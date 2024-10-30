export type OrderType = {
  orderImages: {
    proofOfContact: string;
  };
  _id: string;
  customer: {
    name: string;
    first_name?: string;
    last_name?: string;
    phone: string;
    address: string;
    governorate: string;
    _id: string;
  };
  products: Array<{
    UID: string;
    itemDescription: string;
    quantity: number;
    price: number;
    returned: number;
    type: string;
  }>;
  client: {
    _id: string;
    companyName: string;
  };
  subtotal: number;
  total: number;
  shippingFees: number;
  status: string;
  notes: string;
  type: string;
  missedOpportunity: boolean;
  courierNotes: string;
  reshipped: boolean;
  toBeReshipped: boolean;
  isOutstanding: boolean;
  paidShippingOnly: boolean;
  gotGhosted: boolean;
  hasReturnedItems: boolean;
  postponedDate?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  OID: string;
  __v: number;
  statusHistory: {
    delivered?: string;
    cancelled?: string;
    postponed?: string;
    outForDelivery?: string;
    processing?: string;
    _id: string;
  };
  courier: {
    _id: string;
    name: string;
    phone: string;
  };
  courierAssignedAt: string;
  courierCOD: number;
  paymentMethod: string;
  provider?: string;
};
