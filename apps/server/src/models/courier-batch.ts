import { model, Schema } from 'mongoose';

const courierBatchSequenceSchema = new Schema({
  courier: {
    type: Schema.Types.ObjectId,
    ref: 'Courier',
  },
  sequence: {
    type: Number,
    required: true,
    default: 1,
  },
});

export const courierBatchSchema = new Schema({
  courier: {
    type: Schema.Types.ObjectId,
    ref: 'Courier',
    required: true,
  },
  startDate: {
    type: Date,
    required: false,
    default: null,
  },
  endDate: {
    type: Date,
    required: false,
    default: null,
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  integrationOrders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ShopifyOrder',
    },
  ],
  BID: {
    type: Number,
    required: true,
  },
});

const CourierBatchModel = model('courierbatches', courierBatchSchema);

export const CourierBatchSequenceModel = model(
  'courierbatchsequences',
  courierBatchSequenceSchema
);

export default CourierBatchModel;
