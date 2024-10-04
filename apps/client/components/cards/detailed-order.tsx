import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CreditCard,
  MapPin,
  Package,
  Calendar,
  Clock,
  FileText,
  User,
  Phone,
  Download,
  BanknoteIcon,
  ReceiptTextIcon,
  ImageIcon,
  InfoIcon,
} from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/helpers/status-modifier";
import moment from "moment";
import { icons } from "../icons/icons";
import Link from "next/link";
import DownloadButton from "../buttons/download-button";
import { Separator } from "../ui/separator";
import Image from "next/image";

const order = {
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
      UID: "7",
      itemDescription: "Wide Leg Jeans - Black - 32",
      quantity: 1,
      price: 40,
      returned: 0,
      type: "ADDED",
    },
    {
      UID: "8",
      itemDescription: "Oversized T-Shirt - White - M",
      quantity: 2,
      price: 15,
      returned: 0,
      type: "ADDED",
    },
    {
      UID: "8",
      itemDescription: "Low Top Sneakers - White - 42",
      quantity: 2,
      price: 15,
      returned: 0,
      type: "ADDED",
    },
    {
      UID: "8",
      itemDescription: "Oversized T-Shirt - Sky Blue - M",
      quantity: 2,
      price: 15,
      returned: 0,
      type: "ADDED",
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
  notes: "Customer requested gift wrapping.",
  type: "EXCHANGE",
  missedOpportunity: false,
  courierNotes: "Customer requested to deliver the order after 5 PM.",
  reshipped: false,
  toBeReshipped: false,
  isOutstanding: false,
  paidShippingOnly: false,
  gotGhosted: false,
  hasReturnedItems: true,
  postponedDate: "2024-08-31T21:33:26.091Z",
  cancellationReason: "PROBLEM_WITH_PRODUCT",
  createdAt: "2024-08-24T19:34:35.617Z",
  updatedAt: "2024-08-26T21:33:26.092Z",
  OID: "0000000022331",
  __v: 0,
  statusHistory: {
    delivered: "2024-08-26T21:33:26.091Z",
    cancelled: "2024-08-26T21:33:26.091Z",
    postponed: "2024-08-26T21:33:26.091Z",
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
  paymentMethod: "INSTAPAY",
};

export default function DetailedOrderCard() {
  return (
    <Card className="w-full max-w-4xl h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-xl font-bold">
            Order #{parseInt(order.OID)}
          </CardTitle>
          {/* <p className="text-sm text-muted-foreground flex items-center gap-2">
            {icons.calendar}
            <span>{moment(order.createdAt).format('dddd, MMMM Do, YYYY')}</span>
          </p> */}
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            {icons.store}
            <span>{order.client.companyName}</span>
          </p>
        </div>
        <Badge
          className={`${getStatusColor(
            order.status,
          )} bg-emerald-200 text-emerald-800 capitalize text-sm`}
        >
          {getStatusText(order.status)}
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="courier">Courier</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-center gap-2">
                <User size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">
                  {order.customer.name}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone size={16} className="text-muted-foreground" />
                <Link
                  href={`tel:${order.customer.phone}`}
                  className="text-sm hover:underline"
                >
                  {order.customer.phone}
                </Link>
              </div>
              <div className="flex items-center justify-center gap-2">
                {order.paymentMethod === "VISA" ? (
                  <CreditCard size={16} className="text-muted-foreground" />
                ) : order.paymentMethod === "CASH" ? (
                  <BanknoteIcon size={16} className="text-muted-foreground" />
                ) : (
                  <Image
                    src={"/instapay.png"}
                    alt="instapay"
                    width={24}
                    height={24}
                    priority
                  />
                )}
                <span className="text-sm capitalize">
                  {order.paymentMethod.toLowerCase()}{" "}
                  {order.paymentMethod === "VISA" && "•••• 4242"}
                </span>
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <MapPin size={20} className="text-muted-foreground" />
                <span className="text-sm text-balance capitalize">
                  {order.customer.address}
                </span>
              </div>
            </div>

            {/* <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center gap-1 rounded-lg border p-2">
                <Package size={16} className="text-muted-foreground" />
                <span className="font-medium">
                  {order.products.length} items
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border p-2">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="font-medium">
                  {moment(order.createdAt).format('MMM DD, YYYY')}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border p-2">
                <ReceiptTextIcon size={16} className="text-muted-foreground" />
                <span className="font-medium">
                  {' '}
                  {order.total.toLocaleString('en-EG', {
                    style: 'currency',
                    currency: 'EGP',
                  })}
                </span>
              </div>
            </div> */}
            <Separator />
            {order.products.map((product) => (
              <div key={product.UID} className="flex items-center gap-4 pb-4">
                {/* <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 rounded-md object-cover"
                /> */}
                <div className="flex-1">
                  <h3 className="text-sm font-medium">
                    {product.itemDescription}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {product.price.toLocaleString("en-EG", {
                      style: "currency",
                      currency: "EGP",
                      roundingMode: "halfCeil",
                    })}{" "}
                    x {product.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {(product.price * product.quantity).toLocaleString("en-EG", {
                    style: "currency",
                    currency: "EGP",
                    roundingMode: "halfCeil",
                  })}
                </p>
              </div>
            ))}
            <div className="flex flex-col gap-5 pt-4 border-t border-dashed">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Subtotal
                </span>
                <span className="text-sm font-medium">
                  {order.subtotal.toLocaleString("en-EG", {
                    style: "currency",
                    currency: "EGP",
                    roundingMode: "halfCeil",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <p>Shipping Fees</p> {icons.question}
                </span>
                <span className="text-sm font-medium">
                  {order.shippingFees.toLocaleString("en-EG", {
                    style: "currency",
                    currency: "EGP",
                    roundingMode: "halfCeil",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total
                </span>
                <span className="text-sm font-medium">
                  {order.total.toLocaleString("en-EG", {
                    style: "currency",
                    currency: "EGP",
                    roundingMode: "halfCeil",
                  })}
                </span>
              </div>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="notes">
                <AccordionTrigger>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    {icons.info}
                    <span>Order Notes</span>
                  </h4>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm text-muted-foreground">
                      {order.notes}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              {Object.keys(order.statusHistory)
                .reverse()
                .map((key: string, index) => (
                  <>
                    {key !== "_id" && (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {/* @ts-ignore */}
                          {icons[key] ?? (
                            <InfoIcon size={16} className="text-gray-300" />
                          )}
                          <p className="text-sm font-medium capitalize">
                            {getStatusText(key)}
                          </p>
                        </div>
                        <div
                          className={`ml-2 pl-4 border-l border-muted-foreground ${
                            index ===
                              Object.keys(order.statusHistory).length - 1 &&
                            "border-l-0"
                          }`}
                        >
                          <p className="text-xs text-muted-foreground">
                            {/* @ts-ignore */}
                            {moment(order.statusHistory[key]).format(
                              "dddd, MMMM Do, YYYY hh:mm A",
                            )}
                          </p>
                          {key === "postponed" && (
                            <p className="text-balance text-sm italic text-yellow-500 dark:text-amber-300 font-semibold">
                              {`The customer postponed the order to ${moment(
                                order.postponedDate,
                              ).format("MMMM Do, YYYY")}`}
                            </p>
                          )}
                          {key === "cancelled" && (
                            <p className="text-balance text-sm italic text-red-500 dark:text-red-300 font-semibold">
                              {`Cancellation Reason: ${order.cancellationReason.replaceAll(
                                "_",
                                " ",
                              )}`}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="courier" className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="Courier"
                />
                <AvatarFallback>
                  {order.courier.name.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  Courier: {order.courier.name}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-muted-foreground" />
                <Link
                  href={`tel:+1 (555) 987-6543`}
                  className="text-sm hover:underline"
                >
                  +1 (555) 987-6543
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-sm">
                  Estimated Delivery:{" "}
                  {moment(order.createdAt)
                    .add(3, "days")
                    .format("MMM DD, YYYY")}
                </span>
              </div>
            </div>
            <div className="rounded-md bg-muted p-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                {icons.notes}
                <span>Courier Notes</span>
              </h4>
              <p className="text-sm text-muted-foreground">
                {order.courierNotes}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="attachments" className="space-y-4">
            <div className="space-y-2">
              {Object.keys(order.orderImages).map((attachment) => (
                <DownloadButton
                  key={attachment}
                  // @ts-ignore
                  fileUrl={order.orderImages[attachment] ?? ""}
                  fileName={attachment}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6 flex justify-end">
          {/* <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Support
          </Button> */}
          {/* <Button>
            <FileText className="mr-2 h-4 w-4" />
            Download Invoice
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
