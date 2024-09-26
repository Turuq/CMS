import { model, Schema } from 'mongoose';

const statisticsSchema = new Schema({
  delivered: {
    type: Number,
    default: 0,
  },
  cancelled: {
    type: Number,
    default: 0,
  },
  returned: {
    type: Number,
    default: 0,
  },
  unreachable: {
    type: Number,
    default: 0,
  },
  outForDelivery: {
    type: Number,
    default: 0,
  },
  postponed: {
    type: Number,
    default: 0,
  },
  toBeReshipped: {
    type: Number,
    default: 0,
  },
  instapay: {
    type: Number,
    default: 0,
  },
  paidShippingOnly: {
    type: Number,
    default: 0,
  },
  gotGhosted: {
    type: Number,
    default: 0,
  },
  courierCollected: {
    type: Number,
    default: 0,
  },
  totalDelivered: {
    type: Number,
    default: 0,
  },
  maxPossibleDelivered: {
    type: Number,
    default: 0,
  },
});

const courierStatisticsSchema = new Schema(
  {
    courierId: {
      type: Schema.Types.ObjectId,
      ref: 'Courier',
    },
    date: { type: String },
    statistics: statisticsSchema,
  },
  {
    autoIndex: false,
    timestamps: true,
  }
);

export const courierStatisticsModel = model(
  'CourierStatistics',
  courierStatisticsSchema
);
