import { model } from 'mongoose';
import { Schema } from 'mongoose';

export const financeSchema = new Schema(
  {
    client: {
      type: String,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    collected: {
      type: Number,
      required: true,
      default: 0,
    },
    prepaid: {
      type: Number,
      required: true,
      default: 0,
    },
    storage: {
      type: Number,
      required: true,
      default: 0,
    },
    packaging: {
      type: Number,
      required: true,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const FinanceModel = model('finances', financeSchema);

export default FinanceModel;
