import { model, Schema } from 'mongoose';
import { batchStatistics } from './shared/batch-statistics';

const courierStatisticsSchema = new Schema(
  {
    courierId: {
      type: Schema.Types.ObjectId,
      ref: 'Courier',
    },
    date: { type: String },
    statistics: batchStatistics,
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
