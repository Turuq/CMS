import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { getUser } from '../lib/clerk/clerkClient';
import { CourierModel } from '../models/courier';
import { authorizeUser } from '../utils/authorization';
import { validateObjectId } from '../utils/validation';
import {
  activeCourierSchema,
  courierUpdateSchema,
  createCourierSchema,
  type Courier,
  type CourierWithStatistics,
} from '../validation/courier';

// TODO: Add Route Authorization & Authentication

// Base Path: /api/courier
const courierRouter = new Hono()
  .post('/create', zValidator('json', createCourierSchema), async (c) => {
    // Validate request body
    const data = c.req.valid('json');
    // Check if courier already exists
    const existingCourier = await CourierModel.findOne({
      username: data.username,
    });
    if (existingCourier) {
      c.status(409);
      return c.json({
        message: 'Courier already exists',
      });
    }

    const encryptedPassword = await Bun.password.hash(data.password, {
      algorithm: 'bcrypt',
      cost: 12,
    });

    // Create new courier
    const newCourier = new CourierModel({
      ...data,
      password: encryptedPassword,
    });
    try {
      // Save new courier
      await newCourier.save();
      c.status(201);
      return c.json(newCourier);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      return c.json({
        message: `Failed to create courier: ${error.message}`,
      });
    }
  })
  // GET ALL COURIERS
  .get('/', getUser, async (c) => {
    authorizeUser({ level: ['COURIER_MANAGER', 'ASSIGNMENT_OFFICER'], c });
    try {
      const couriers = await CourierModel.find({})
        .select(
          'name _id phone username active zone commissionPerOrder nationalId'
        )
        .sort({ active: 'desc' });
      return c.json(couriers, 200);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error(`Failed to get couriers: ${error.message}`);
    }
  })
  // GET ALL COURIERS GROUPED BY ACTIVE STATUS
  .get('/grouped', getUser, async (c) => {
    try {
      authorizeUser({ level: ['COURIER_MANAGER', 'ASSIGNMENT_OFFICER'], c });
      const result = await CourierModel.aggregate([
        {
          $group: {
            _id: '$active',
            couriers: {
              $push: {
                _id: '$_id',
                name: '$name',
                phone: '$phone',
                username: '$username',
                active: '$active',
                zone: '$zone',
              },
            },
          },
        },
      ]);

      const couriers: {
        active: Courier[];
        inactive: Courier[];
      } = {
        active: result.find((group) => group._id === true)?.couriers ?? [],
        inactive: result.find((group) => group._id === false)?.couriers ?? [],
      };

      return c.json(couriers, 200);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error(`Failed to get couriers: ${error.message}`);
    }
  })
  .get('/withStatistics', async (c) => {
    const currentMonthYear = new Date()
      .toLocaleString('en-US', { month: '2-digit', year: 'numeric' })
      .replace('/', '-');

    try {
      const grouped = await CourierModel.aggregate([
        {
          $lookup: {
            from: 'courierstatistics', // Collection name in db
            localField: '_id', // Field in orders collection
            foreignField: 'courierId', // Field in customers collection
            as: 'courierStatistics', // Alias for the joined data
          },
        },
        {
          $addFields: {
            courierStatistics: {
              $filter: {
                input: '$courierStatistics',
                as: 'stat',
                cond: { $eq: ['$$stat.date', currentMonthYear] },
              },
            },
          },
        },
        {
          $group: {
            _id: '$active',
            couriers: {
              $push: {
                _id: '$_id',
                name: '$name',
                phone: '$phone',
                username: '$username',
                active: '$active',
                zone: '$zone',
                statistics: {
                  $arrayElemAt: ['$courierStatistics.statistics', 0], // Only take the first element, assuming there's only one match per month
                },
              },
            },
          },
        },
        {
          $project: {
            active: '$_id',
            couriers: '$couriers',
            _id: 0,
          },
        },
        {
          $sort: {
            active: -1,
          },
        },
      ]);

      if (!grouped) {
        c.status(404);
        throw new Error('No couriers found');
      }

      const couriers: {
        active: CourierWithStatistics[];
        inactive: CourierWithStatistics[];
      } = {
        active: grouped.find((group) => group.active === true)?.couriers ?? [],
        inactive:
          grouped.find((group) => group.active === false)?.couriers ?? [],
      };

      c.status(200);
      return c.json(couriers);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error(`Failed to get couriers: ${error.message}`);
    }
  })
  .get('/:id', getUser, zValidator('param', validateObjectId), async (c) => {
    authorizeUser({ level: ['COURIER_MANAGER', 'HANDOVER_OFFICER'], c });
    try {
      // Verify that id is a valid ObjectId
      const { id } = c.req.valid('param');
      // Find courier by id
      const courier = await CourierModel.findById(id);
      if (!courier) {
        c.status(404);
        throw new Error('Courier not found');
      }
      return c.json(courier, 200);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error(`Failed to get courier: ${error.message}`);
    }
  })
  .delete('/:id', zValidator('param', validateObjectId), async (c) => {
    try {
      // Verify that id is a valid ObjectId
      const { id } = c.req.valid('param');
      // Find courier by id and delete
      const deletedCourier = await CourierModel.findByIdAndDelete(id);
      if (!deletedCourier) {
        c.status(404);
        return c.json({
          message: 'Courier not found',
        });
      }

      c.status(204);
      return c.json({ message: 'Courier deleted' });
    } catch (error: any) {
      console.error(error);
      c.status(500);
      return c.json({
        message: `Failed to delete courier: ${error.message}`,
      });
    }
  })
  .put(
    '/:id',
    getUser,
    zValidator('param', validateObjectId),
    zValidator('json', courierUpdateSchema),
    async (c) => {
      authorizeUser({ c, level: ['COURIER_MANAGER'] });
      try {
        // Verify that id is a valid ObjectId
        const { id } = c.req.valid('param');
        console.log(id);
        // Validate request body
        const data = c.req.valid('json');
        console.log(data);
        // Find courier and update
        const updatedCourier = await CourierModel.findByIdAndUpdate(id, data);
        if (!updatedCourier) {
          c.status(404);
          return c.json({
            message: 'Courier not found',
          });
        }

        c.status(201);
        return c.json(updatedCourier);
      } catch (error: any) {
        console.log(error);
        c.status(500);
        return c.json({
          message: `Failed to update courier: ${error.message}`,
        });
      }
    }
  )
  .put(
    'activate/:id',
    getUser,
    zValidator('param', validateObjectId),
    zValidator('json', activeCourierSchema),
    async (c) => {
      authorizeUser({ c, level: ['COURIER_MANAGER'] });
      try {
        // Verify that id is a valid ObjectId
        const { id } = c.req.valid('param');
        const { salary, commissionPerOrder, zone } = c.req.valid('json');
        // Find courier by id and activate
        const activatedCourier = await CourierModel.findByIdAndUpdate(id, {
          active: true,
          salary,
          commissionPerOrder,
          zone,
        });
        if (!activatedCourier) {
          c.status(404);
          return c.json({
            message: 'Courier not found',
          });
        }

        c.status(201);
        return c.json(activatedCourier);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        return c.json({
          message: `Failed to activate courier: ${error.message}`,
        });
      }
    }
  )
  .put(
    'deactivate/:id',
    getUser,
    zValidator('param', validateObjectId),
    async (c) => {
      authorizeUser({ c, level: ['COURIER_MANAGER'] });
      try {
        // Verify that id is a valid ObjectId
        const { id } = c.req.valid('param');
        // Find courier by id and deactivate
        const deactivatedCourier = await CourierModel.findByIdAndUpdate(id, {
          active: false,
        });
        if (!deactivatedCourier) {
          c.status(404);
          return c.json({
            message: 'Courier not found',
          });
        }

        c.status(201);
        return c.json(deactivatedCourier);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        return c.json({
          message: `Failed to deactivate courier: ${error.message}`,
        });
      }
    }
  );
export default courierRouter;
