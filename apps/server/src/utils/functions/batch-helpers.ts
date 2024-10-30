import { ObjectId } from 'mongodb';
import CourierBatchModel from '../../models/courier-batch';
import { courierStatisticsModel } from '../../models/courier-statistics';
import type { BatchStatistics } from '../../models/shared/batch-statistics';

export async function updateCourierMonthlyStatistics({
  courierId,
  date,
  batchId,
}: {
  courierId: string;
  date: string;
  batchId: string;
}) {
  // find batch and count statistics
  const batch = await CourierBatchModel.aggregate([
    {
      $match: {
        _id: new ObjectId(batchId),
      },
    },
    {
      $lookup: {
        from: 'orders',
        localField: 'orders',
        foreignField: '_id',
        as: 'orders',
      },
    },
    {
      $lookup: {
        from: 'shopifyorders',
        localField: 'integrationOrders',
        foreignField: '_id',
        as: 'integrationOrders',
      },
    },
    {
      $project: {
        orders: { $concatArrays: ['$orders', '$integrationOrders'] },
      },
    },
    { $unwind: { path: '$orders', preserveNullAndEmptyArrays: true } },
    {
      $facet: {
        statusCounts: [
          {
            $group: {
              _id: '$orders.status',
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              status: '$_id',
              count: 1,
              _id: 0,
            },
          },
        ],
        other: [
          {
            $group: {
              _id: null,
              toBeReshipped: {
                $sum: { $cond: ['$orders.toBeReshipped', 1, 0] },
              },
              paidShippingOnly: {
                $sum: { $cond: ['$orders.paidShippingOnly', 1, 0] },
              },
              gotGhosted: { $sum: { $cond: ['$orders.gotGhosted', 1, 0] } },
              instapay: {
                $sum: {
                  $cond: [{ $eq: ['$orders.paymentMethod', 'INSTAPAY'] }, 1, 0],
                },
              },
              courierCollected: { $sum: '$orders.courierCOD' },
              maxPossibleDelivered: { $sum: '$orders.total' },
              totalDelivered: {
                $sum: {
                  $cond: [
                    { $eq: ['$orders.status', 'delivered'] },
                    '$orders.total',
                    {
                      $cond: [
                        '$orders.paidShippingOnly',
                        '$orders.shippingFees',
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              toBeReshipped: 1,
              paidShippingOnly: 1,
              gotGhosted: 1,
              courierCollected: 1,
              maxPossibleDelivered: 1,
              totalDelivered: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        statistics: {
          $mergeObjects: [
            {
              $arrayToObject: {
                $map: {
                  input: '$statusCounts',
                  as: 'status',
                  in: { k: '$$status.status', v: '$$status.count' },
                },
              },
            },
            { $arrayElemAt: ['$other', 0] },
          ],
        },
      },
    },
  ]);

  if (!batch.length) {
    throw new Error('Batch not found');
  }

  const monthlyStatistics = await courierStatisticsModel.findOne({
    courierId,
    date,
  });

  const oldStatistics: BatchStatistics | undefined | null =
    monthlyStatistics?.statistics;

  const batchStatistics = batch[0].statistics;

  let statistics = batchStatistics;

  //   Sum values of the same key in both objects
  if (oldStatistics) {
    statistics = Object.keys(batchStatistics).reduce((acc, key) => {
      const typedKey = key as keyof BatchStatistics;
      acc[typedKey] =
        (oldStatistics?.[typedKey] || 0) + (batchStatistics[typedKey] || 0);
      return acc;
    }, {} as BatchStatistics);
  }

  const newMonthlyStatistics = await courierStatisticsModel.findOneAndUpdate(
    {
      courierId,
      date,
    },
    {
      courierId,
      date,
      statistics,
    },
    {
      upsert: true,
      new: true,
    }
  );

  if (!newMonthlyStatistics) {
    throw new Error('Failed to update monthly statistics');
  }

  return { newMonthlyStatistics };
}
