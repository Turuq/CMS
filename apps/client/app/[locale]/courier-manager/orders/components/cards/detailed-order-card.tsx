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
import { icons } from "@/components/icons/icons";
import Link from "next/link";
import DownloadButton from "@/components/buttons/download-button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { OrderType } from "@/types/order";

interface DetailedOrderCardProps {
  order: OrderType;
  orderCardDictionary: {
    [key: string]: any;
  };
  locale: string;
}

export default function DetailedOrderCard({
  order,
  orderCardDictionary,
  locale,
}: DetailedOrderCardProps) {
  return (
    <Card className="w-full max-w-4xl h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-lg sm:text-xl font-bold">
            {orderCardDictionary.header.orderNumber} #{parseInt(order.OID)}
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
            {icons.store}
            <span>{order.client.companyName}</span>
          </p>
        </div>
        <Badge className={`${getStatusColor(order.status)} capitalize text-sm`}>
          {orderCardDictionary.history.statuses[order.status]}
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="details"
          className="w-full"
          style={{ direction: locale === "en" ? "ltr" : "rtl" }}
        >
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 h-fit">
            <TabsTrigger value="details">
              {orderCardDictionary.tabs.details}
            </TabsTrigger>
            <TabsTrigger value="history">
              {orderCardDictionary.tabs.history}
            </TabsTrigger>
            <TabsTrigger value="courier">
              {orderCardDictionary.tabs.courier}
            </TabsTrigger>
            <TabsTrigger value="attachments">
              {orderCardDictionary.tabs.attachments}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">
                  {order.customer.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-muted-foreground" />
                <Link
                  href={`tel:${order.customer.phone}`}
                  className="text-sm hover:underline"
                >
                  {order.customer.phone}
                </Link>
              </div>
              <div className="flex items-center gap-2">
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
              <div className="col-span-1 sm:col-span-3 flex items-center gap-2">
                <MapPin size={20} className="text-muted-foreground" />
                <span className="text-sm text-balance capitalize">
                  {order.customer.address}
                </span>
              </div>
            </div>
            <Separator />
            {order.products.map((product) => (
              <div
                key={product.UID}
                className="flex flex-wrap items-center gap-4 pb-4"
              >
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
                  {orderCardDictionary.details.subtotal}
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
                  <p>{orderCardDictionary.details.shippingFees}</p>
                  {icons.question}
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
                  {orderCardDictionary.details.total}
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
                    <span>{orderCardDictionary.details.orderNotes}</span>
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
                            {orderCardDictionary.history.statuses[key]}
                          </p>
                        </div>
                        <div
                          className={`${
                            locale === "en" ? "ml-2 pl-4" : "mr-2 pr-4"
                          } border-muted-foreground ${
                            index ===
                              Object.keys(order.statusHistory).length - 1 &&
                            "border-l-0"
                          } ${locale === "ar" ? "border-r" : "border-l"}`}
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
                              {`Cancellation Reason: ${order.cancellationReason?.replaceAll(
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
                  {orderCardDictionary.courier.header} : {order.courier.name}
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
                  {orderCardDictionary.courier.estimatedDelivery}:{" "}
                  {moment(order.createdAt)
                    .add(3, "days")
                    .format("MMM DD, YYYY")}
                </span>
              </div>
            </div>
            <div className="rounded-md bg-muted p-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                {icons.notes}
                <span>{orderCardDictionary.courier.courierNotes}</span>
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
      </CardContent>
    </Card>
  );
}
