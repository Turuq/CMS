import { model, Schema } from 'mongoose';
import { defaultOrderStatistics } from '../utils/defaults';

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

const statusCounts = new Schema({
  delivered: {
    type: Number,
    default: 0,
  },
  outForDelivery: {
    type: Number,
    default: 0,
  },
  pending: {
    type: Number,
    default: 0,
  },
  unreachable: {
    type: Number,
    default: 0,
  },
  postponed: {
    type: Number,
    default: 0,
  },
  cancelled: {
    type: Number,
    default: 0,
  },
  invalidAddress: {
    type: Number,
    default: 0,
  },
  returned: {
    type: Number,
    default: 0,
  },
  collected: {
    type: Number,
    default: 0,
  },
  outOfStock: {
    type: Number,
    default: 0,
  },
  processing: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
});

const orderStatisticsSchema = new Schema({
  turuqOrders: statusCounts,
  integrationOrders: {
    shopify: statusCounts,
    woocommerce: statusCounts,
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
    orderStatistics: {
      type: orderStatisticsSchema,
      default: defaultOrderStatistics,
    },
  },
  { timestamps: true }
);

export const ClientModel = model('Client', clientSchema);
