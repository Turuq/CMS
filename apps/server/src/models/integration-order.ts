import { model, Schema } from 'mongoose';
import { statusHistorySchema } from './shared/status-history';

const productsSchema = new Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  price: {
    type: String,
  },
  discount: {
    type: String,
  },
  variant: {
    type: String,
  },
  variant_id: {
    type: String,
  },
  properties: {
    type: Array,
  },
  quantity: {
    type: Number,
  },
  returned: {
    type: Number,
    default: 0,
  },
});

const customerSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  governorate: {
    type: String,
  },
});
const integrationOrderSchema = new Schema(
  {
    id: {
      type: String,
    },
    integratorId: {
      type: Number,
    },
    provider: {
      type: String,
      enum: ['SHOPIFY', 'WOOCOMMERCE'],
    },
    customer: customerSchema,
    products: [productsSchema],
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingFees: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
    },
    courier: {
      type: Schema.Types.ObjectId,
      ref: 'Courier',
    },
    missedOpportunity: {
      type: Boolean,
      default: false,
    },
    OID: {
      type: String,
      unique: true,
    },
    reshipped: {
      type: Boolean,
      default: false,
    },
    toBeReshipped: {
      type: Boolean,
      default: false,
    },
    isOutstanding: {
      type: Boolean,
      default: false,
    },
    statusHistory: statusHistorySchema,
    notes: {
      type: String,
    },
    paidShippingOnly: {
      type: Boolean,
      default: false,
    },
    gotGhosted: {
      type: Boolean,
      default: false,
    },
    //is this for turuq only?
    paymentMethod: {
      type: String,
      enum: ['CASH', 'INSTAPAY', 'VISA'],
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'UNPAID'],
    },
    postPonedDate: {
      type: Date,
    },
    courierCOD: {
      type: Number,
    },
    hasReturnedItems: {
      type: Boolean,
      default: false,
    },
    // Define the field to store the images of the order for proof of delivery
    orderImages: {
      proofOfDelivery: {
        type: String,
      },
      proofOfContact: {
        type: String,
      },
      instapayReceipt: {
        type: String,
      },
      proofOfUnreachable: {
        type: String,
      },
      proofOfPostponement: {
        type: String,
      },
      proofOfGhosting: {
        type: String,
      },
      //maybe we need this later?
      proofOfReturn: {
        type: String,
      },
    },
    cancellationReason: {
      type: String,
      enum: ['WRONG_ORDER', 'BAD_SIZE', 'PROBLEM_WITH_PRODUCT', 'OTHER'],
    },
    courierNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

export const integrationOrderModel = model(
  'ShopifyOrder',
  integrationOrderSchema
);
