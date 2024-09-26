import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { courierModel } from '../models/courier';
import {
  courierUpdateSchema,
  createCourierSchema,
} from '../validation/courier';
import { validateObjectId } from '../utils/validation';

// TODO: Add Route Authorization & Authentication

// Base Path: /api/courier
const courierRouter = new Hono()
  .post('/create', zValidator('json', createCourierSchema), async (c) => {
    // Validate request body
    const data = c.req.valid('json');
    // Check if courier already exists
    const existingCourier = await courierModel.findOne({
      username: data.username,
    });
    if (existingCourier) {
      c.status(409);
      return c.json({
        message: 'Courier already exists',
      });
    }
    // Create new courier
    const newCourier = new courierModel(data);
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
  .get('/', async (c) => {
    try {
      // Get all couriers
      const couriers = await courierModel
        .find({ active: true })
        .select('name username phone zone active');

      // Respond with couriers
      if (!couriers) {
        c.status(404);
        return c.json({
          message: 'No couriers found',
        });
      }

      c.status(200);
      return c.json(couriers);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      return c.json({
        message: `Failed to get couriers: ${error.message}`,
      });
    }
  })
  .get('/withStatistics', async (c) => {
    try {
      const grouped = await courierModel.aggregate([
        {
          $lookup: {
            from: 'courierstatistics', // Collection name in db
            localField: '_id', // Field in orders collection
            foreignField: 'courierId', // Field in customers collection
            as: 'courierStatistics', // Alias for the joined data
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
                statistics: '$courierStatistics.statistics',
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
        return c.json({
          message: 'No couriers found',
        });
      }

      const couriers = {
        active: grouped.find((group) => group.active === true)?.couriers ?? [],
        inactive:
          grouped.find((group) => group.active === false)?.couriers ?? [],
      };

      c.status(200);
      return c.json(couriers);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      return c.json({
        message: `Failed to get couriers: ${error.message}`,
      });
    }
  })
  .get('/:id', zValidator('param', validateObjectId), async (c) => {
    try {
      // Verify that id is a valid ObjectId
      const { id } = c.req.valid('param');
      // Find courier by id
      const courier = await courierModel.findById(id);
      if (!courier) {
        c.status(404);
        return c.json({
          message: 'Courier not found',
        });
      }
      c.status(200);
      return c.json(courier);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      return c.json({
        message: `Failed to get courier: ${error.message}`,
      });
    }
  })
  .delete('/:id', zValidator('param', validateObjectId), async (c) => {
    try {
      // Verify that id is a valid ObjectId
      const { id } = c.req.valid('param');
      // Find courier by id and delete
      const deletedCourier = await courierModel.findByIdAndDelete(id);
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
    zValidator('param', validateObjectId),
    zValidator('json', courierUpdateSchema),
    async (c) => {
      try {
        // Verify that id is a valid ObjectId
        const { id } = c.req.valid('param');
        // Validate request body
        const data = c.req.valid('json');
        // Find courier and update
        const updatedCourier = await courierModel.findByIdAndUpdate(id, data);
        if (!updatedCourier) {
          c.status(404);
          return c.json({
            message: 'Courier not found',
          });
        }

        c.status(201);
        return c.json(updatedCourier);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        return c.json({
          message: `Failed to update courier: ${error.message}`,
        });
      }
    }
  )
  .put('activate/:id', zValidator('param', validateObjectId), async (c) => {
    try {
      // Verify that id is a valid ObjectId
      const { id } = c.req.valid('param');
      // Find courier by id and activate
      const activatedCourier = await courierModel.findByIdAndUpdate(id, {
        active: true,
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
  });
export default courierRouter;
