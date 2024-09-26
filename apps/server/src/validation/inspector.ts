import { z } from 'zod';
import { ObjectId } from 'mongodb';
const objectIdArraySchema = z.array(
  z
    .string()
    .refine((id) => ObjectId.isValid(id), { message: 'Invalid ObjectId' })
);

const courierDailyOrdersResponse = z.array(
  z.object({
    orderIds: objectIdArraySchema,
    integrationOrderIds: objectIdArraySchema,
  })
);

// "totalShippingFees": 1400,
// "totalToBeReceived": 0,
// "totalDelivered": 12,
// "totalOutForDelivery": 12,
// "totalToBeReshipped": 3,
// "totalProcessingAssigned": 1,
// "totalProcessingUnassigned": 0,
// "uniqueCouriers": 8

const dailyOrderStatisticsResponse = z.array(
  z.object({
    totalShippingFees: z.number().positive(),
    totalToBeReceived: z.number().positive(),
    totalDelivered: z.number().positive(),
    totalOutForDelivery: z.number().positive(),
    totalToBeReshipped: z.number().positive(),
    totalProcessingAssigned: z.number().positive(),
    totalProcessingUnassigned: z.number().positive(),
    uniqueCouriers: z.number().positive(),
  })
);

export type CourierDailyOrdersResponse = z.infer<
  typeof courierDailyOrdersResponse
>;

export type ObjectIdArray = z.infer<typeof objectIdArraySchema>;

export type DailyOrderMetrics = z.infer<typeof dailyOrderStatisticsResponse>;
