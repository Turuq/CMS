import { Hono } from 'hono';
import { courierDailyOrdersModel } from '../models/courier-daily-orders';
import type {
  CourierDailyOrdersResponse,
  DailyOrderMetrics,
} from '../validation/inspector';
import { orderModel } from '../models/order';
import { integrationOrderModel } from '../models/integration-order';
import { generateDailyOrderPipeline } from '../utils/functions/helpers';

const inspectorRouter = new Hono().get('/dashboard', async (c) => {
  // Get all orderIds and integrationOrderIds from courierDailyOrders collection
  const ids: CourierDailyOrdersResponse =
    await courierDailyOrdersModel.aggregate([
      {
        $unwind: '$orderIds',
      },
      {
        $unwind: '$shopifyOrderIds',
      },
      {
        $group: {
          _id: null,
          orderIds: { $addToSet: '$orderIds' },
          integrationOrderIds: { $addToSet: '$shopifyOrderIds' },
        },
      },
    ]);

  if (!ids) {
    return c.json(
      {
        error: 'No orders found',
      },
      404
    );
  }

  const [dailyOrdersIds] = ids;

  // Populate dailyOrderIds with order details from db
  // &
  // Calculate various dashboard metrics related to daily orders

  // Pipelines
  const dailyOrdersPipeline = generateDailyOrderPipeline(
    dailyOrdersIds.orderIds
  );

  const dailyIntegrationOrdersPipeline = generateDailyOrderPipeline(
    dailyOrdersIds.integrationOrderIds
  );

  // Populated Orders
  const dailyOrdersMetrics: DailyOrderMetrics =
    await orderModel.aggregate(dailyOrdersPipeline);

  const dailyIntegrationOrdersMetrics: DailyOrderMetrics =
    await integrationOrderModel.aggregate(dailyIntegrationOrdersPipeline);

  const mergedMetrics = [
    ...dailyOrdersMetrics,
    ...dailyIntegrationOrdersMetrics,
  ];

  // Sum Values of both arrays
  const metrics = mergedMetrics.reduce((acc, curr) => {
    acc.totalShippingFees += curr.totalShippingFees;
    acc.totalToBeReceived += curr.totalToBeReceived;
    acc.totalDelivered += curr.totalDelivered;
    acc.totalOutForDelivery += curr.totalOutForDelivery;
    acc.totalToBeReshipped += curr.totalToBeReshipped;
    acc.totalProcessingAssigned += curr.totalProcessingAssigned;
    acc.totalProcessingUnassigned += curr.totalProcessingUnassigned;

    return acc;
  });

  return c.json(metrics, 200);
});

export default inspectorRouter;
