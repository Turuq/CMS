import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  MapPin,
  Package,
  Calendar,
  DollarSign,
  ShoppingCart,
  BanknoteIcon,
  ReceiptTextIcon,
} from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/helpers/status-modifier";
import moment from "moment";

const Order = {
  orderImages: {
    proofOfContact:
      "https://cvurqtyyadqvtbvyshns.supabase.co/storage/v1/object/public/courier/1724707985215.jpeg",
  },
  _id: "66ca35cbcae0f4f2e6641b43",
  customer: {
    name: "Naif el kady",
    phone: "01018372878",
    address:
      "74 abbas el akaad - nasr city \nFloor 6 , apartment 11 \nLandmark : Suez Canal bank",
    governorate: "Cairo",
    _id: "66ca35cbcae0f4f2e6641b44",
  },
  products: [
    {
      UID: "1005302076001",
      quantity: 1,
      price: 0,
      returned: 0,
      type: "RETURNED",
      _id: "66ca35cbcae0f4f2e6641b45",
    },
    {
      UID: "1005302056001",
      quantity: 1,
      price: 0,
      returned: 0,
      type: "ADDED",
      _id: "66ca35cbcae0f4f2e6641b46",
    },
  ],
  client: {
    _id: "66ab47e06084d50c918d94d1",
    companyName: "Laqta",
  },
  subtotal: 1,
  total: 51,
  shippingFees: 50,
  status: "delivered",
  notes: "",
  type: "EXCHANGE",
  missedOpportunity: false,
  reshipped: false,
  toBeReshipped: false,
  isOutstanding: false,
  paidShippingOnly: false,
  gotGhosted: false,
  hasReturnedItems: true,
  createdAt: "2024-08-24T19:34:35.617Z",
  updatedAt: "2024-08-26T21:33:26.092Z",
  OID: "0000000022331",
  __v: 0,
  statusHistory: {
    delivered: "2024-08-26T21:33:26.091Z",
    outForDelivery: "2024-08-25T11:43:06.255Z",
    processing: "2024-08-25T11:11:17.348Z",
    _id: "66cb11556ff91ddb4bea96ea",
  },
  courier: {
    _id: "66c25a4b8c80a6b33db1d884",
    name: "احمد ناصر عبدالنعيم",
  },
  courierAssignedAt: "2024-08-25T11:31:54.040Z",
  courierCOD: 50,
  paymentMethod: "CASH",
};

export default function OrderSummaryCard({ order }: { order: typeof Order }) {
  return (
    <Card className="w-full max-w-sm py-5">
      <CardContent className="grid gap-4 pb-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Order ID:</span>
          <span className="text-sm">#{parseInt(order.OID)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge className={`${getStatusColor(order.status)} capitalize`}>
            {getStatusText(order.status)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {order.paymentMethod === "VISA" ? (
            <CreditCard size={16} className="text-muted-foreground" />
          ) : (
            <BanknoteIcon size={16} className="text-muted-foreground" />
          )}
          <span className="text-sm capitalize">
            {order.paymentMethod.toLowerCase()}{" "}
            {order.paymentMethod === "VISA" && "•••• 4242"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-muted-foreground" />
          <span className="text-sm">{order.customer.governorate}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col items-center gap-1 rounded-lg border p-2">
            <Package size={16} className="text-muted-foreground" />
            <span className="text-xs">{order.products.length} items</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg border p-2">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-xs">
              {moment(order.createdAt).format("MMM DD")}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg border p-2">
            <ReceiptTextIcon size={16} className="text-muted-foreground" />
            <span className="text-xs">
              {order.total.toLocaleString("en-EG", {
                style: "currency",
                currency: "EGP",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
