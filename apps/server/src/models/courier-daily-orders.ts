import { model, Schema } from 'mongoose';

// @deprecated
const courierDailyOrdersSchema = new Schema({
  courierId: {
    type: Schema.Types.ObjectId,
    ref: 'Courier',
    unique: true,
  },
  orderIds: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  shopifyOrderIds: [{ type: Schema.Types.ObjectId, ref: 'ShopifyOrder' }],
});

export const courierDailyOrdersModel = model(
  'CourierDailyOrders',
  courierDailyOrdersSchema
);
