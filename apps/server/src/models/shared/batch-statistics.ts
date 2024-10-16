import { Schema } from 'mongoose';

export const batchStatistics = new Schema({
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

export type BatchStatistics = {
  delivered: number;
  cancelled: number;
  returned: number;
  unreachable: number;
  outForDelivery: number;
  postponed: number;
  toBeReshipped: number;
  instapay: number;
  paidShippingOnly: number;
  gotGhosted: number;
  courierCollected: number;
  totalDelivered: number;
  maxPossibleDelivered: number;
};