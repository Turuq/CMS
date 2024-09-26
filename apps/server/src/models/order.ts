import { model, Schema } from 'mongoose';
import { statusHistorySchema } from './shared/status-history';

const productsSchema = new Schema({
  UID: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  client: {
    type: String,
  },
  returned: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['ADDED', 'RETURNED'],
  },
});

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  governorate: {
    type: String,
    required: true,
  },
});

const orderSchema = new Schema(
  {
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
    notes: {
      type: String,
    },
    courier: {
      type: Schema.Types.ObjectId,
      ref: 'Courier',
    },
    courierAssignedAt: {
      type: Date,
    },
    // Define the OID field with unique constraint and default value
    OID: {
      type: String,
      unique: true,
    },
    type: {
      type: String,
      enum: ['NORMAL', 'PROMOTIONAL', 'REFUND', 'EXCHANGE'],
      required: true,
      default: 'NORMAL',
    },
    missedOpportunity: {
      type: Boolean,
      default: false,
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
    paidShippingOnly: {
      type: Boolean,
      default: false,
    },
    gotGhosted: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'INSTAPAY', 'VISA'],
      // required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'UNPAID'],
    },
    postponedDate: {
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
      proofOfLocation: {
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

export const orderModel = model('Order', orderSchema);
