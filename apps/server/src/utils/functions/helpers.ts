import type { PipelineStage } from 'mongoose';
import type { ObjectIdArray } from '../../validation/inspector';
import { CourierBatchSequenceModel } from '../../models/courier-batch';

export const generateDailyOrderPipeline = (ids: ObjectIdArray) => {
  const pipeline: Array<PipelineStage> = [
    {
      $match: {
        _id: { $in: ids },
      },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        paidShippingOnly: 1,
        shippingFees: 1,
        courierCOD: 1,
        toBeReshipped: 1,
        courier: 1,
      },
    },
    {
      $group: {
        _id: null,
        totalShippingFees: { $sum: '$shippingFees' },
        totalToBeReceived: {
          $sum: {
            $cond: [
              { $eq: ['$status', 'delivered'] },
              '$total', // Use orderTotal field for delivered orders
              {
                $cond: [
                  { $eq: ['$paidShippingOnly', true] },
                  '$courierCOD', // Use shippingFees field for paidShippingOnly orders
                  0, // If neither condition is met, return 0
                ],
              },
            ],
          },
        },
        totalDelivered: {
          $sum: {
            $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0],
          },
        },
        totalOutForDelivery: {
          $sum: {
            $cond: [{ $eq: ['$status', 'outForDelivery'] }, 1, 0],
          },
        },
        totalToBeReshipped: {
          $sum: {
            $cond: [{ $eq: ['$toBeReshipped', true] }, 1, 0],
          },
        },
        totalProcessingAssigned: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$status', 'processing'] },
                  { $ne: ['$courier', null] },
                ],
              },
              1,
              0,
            ],
          },
        },
        totalProcessingUnassigned: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$status', 'processing'] },
                  { $eq: ['$courier', null] },
                ],
              },
              1,
              0,
            ],
          },
        },
        // uniqueCouriers: {
        //   $addToSet: '$courier',
        // },
      },
    },
  ];

  return pipeline;
};

export async function getNextSequence(courierId: string) {
  const sequence = await CourierBatchSequenceModel.findOneAndUpdate(
    { courier: courierId },
    { $inc: { sequence: 1 } },
    { new: true }
  );

  if (!sequence) {
    await new CourierBatchSequenceModel({ courier: courierId }).save();
    return 1;
  }

  return sequence.sequence;
}
