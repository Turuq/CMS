import { Schema } from 'mongoose';

export const statusHistorySchema = new Schema({
  //key value pair of status and date where status is the key and date is the value

  delivered: {
    type: Date,
  },
  outForDelivery: {
    type: Date,
  },
  pending: {
    type: Date,
  },
  unreachable: {
    type: Date,
  },
  postponed: {
    type: Date,
  },
  cancelled: {
    type: Date,
  },
  returned: {
    type: Date,
  },
  collected: {
    type: Date,
  },
  outOfStock: {
    type: Date,
  },
  processing: {
    type: Date,
  },
  invalidAddress: {
    type: Date,
  },
});
