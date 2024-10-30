import { model, Schema, type ObjectId } from 'mongoose';
import type { Courier } from '../validation/courier';

const courierSchema = new Schema<Courier>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      private: true,
      required: true,
      select: false,
    },
    nationalId: {
      type: String,
      required: true,
      unique: true,
    },
    nationalIdImage: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    criminalRecordImage: {
      type: String,
      required: true,
    },
    driverLicenseImage: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
    },
    zone: {
      type: String,
    },
    reshippedOrders: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: false,
    },
    commissionPerOrder: {
      type: Number,
    },
    outSourced: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const CourierModel = model<Courier>('Courier', courierSchema);
