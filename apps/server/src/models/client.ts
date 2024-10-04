import { model, Schema } from 'mongoose';

const woocommerceKeysSchema = new Schema({
  apiConsumerKey: {
    type: String,
  },
  apiConsumerSecret: {
    type: String,
  },
  creationWebhookSecret: {
    type: String,
  },
  updateWebhookSecret: {
    type: String,
  },
});

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    companyLocation: {
      type: String,
      required: true,
    },
    servicesOffered: {
      type: [String],
      required: true,
    },
    password: {
      type: String,
      private: true,
      required: true,
      select: false,
    },
    active: {
      type: Boolean,
      required: true,
    },
    verificationCode: {
      type: String,
    },
    shopifyCode: {
      type: String,
    },
    shopifyToken: {
      type: String,
    },
    shopifyStoreName: {
      type: String,
    },
    onboarding: {
      type: Boolean,
      default: true,
    },
    woocommerceKeys: woocommerceKeysSchema,
  },
  { timestamps: true }
);

export const ClientModel = model('Client', clientSchema);
