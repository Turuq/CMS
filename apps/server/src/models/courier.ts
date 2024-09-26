import { model, Schema } from 'mongoose';

const courierSchema = new Schema(
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
    criminalRecord: {
      type: String,
      required: true,
    },
    driverLicense: {
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
  },
  { timestamps: true }
);

export const courierModel = model('Courier', courierSchema);
