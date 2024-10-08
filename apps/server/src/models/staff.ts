import { model, Schema } from 'mongoose';

const staffMemberSchema = new Schema(
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
    role: {
      type: String,
      required: true,
      enum: ['ASSIGNMENT_OFFICER', 'COURIER_MANAGER', 'HANDOVER_OFFICER'],
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
    salary: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const staffMemberModel = model('StaffMember', staffMemberSchema);
