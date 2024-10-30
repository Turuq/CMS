import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderType } from '@/types/order';
import { getStatusColor, getStatusText } from '@/utils/helpers/status-modifier';
import {
  BanknoteIcon,
  Clock,
  CreditCard,
  InfoIcon,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import DownloadButton from '../buttons/download-button';
import { icons } from '../icons/icons';
import { Separator } from '../ui/separator';

export default function DetailedOrderCard({
  locale,
  order,
  onClose,
}: {
  locale: string;
  order: OrderType;
  onClose: (value: boolean) => void;
}) {
  return (
    <Card className="w-full max-w-4xl h-full shadow shadow-muted">
      <div className="w-full flex items-center justify-end">
        <button
          onClick={() => onClose(false)}
          className="flex items-center justify-center rounded-xl hover:bg-red-200 hover:text-red-500 self-end w-10 h-10 m-2"
        >
          {icons.clear}
        </button>
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-xl font-bold">
            Order #{parseInt(order.OID)}
          </CardTitle>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            {icons.store}
            <span>{order.client?.companyName}</span>
          </p>
        </div>
        <Badge
          className={`${getStatusColor(
            order.status
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
            {order.courier && (
              <TabsTrigger value="courier">Courier</TabsTrigger>
            )}
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
                {order.paymentMethod === 'VISA' ? (
                  <CreditCard size={16} className="text-muted-foreground" />
                ) : order.paymentMethod === 'CASH' ? (
                  <BanknoteIcon size={16} className="text-muted-foreground" />
                ) : (
                  <Image
                    src={'/instapay.png'}
                    alt="instapay"
                    width={24}
                    height={24}
                    priority
                  />
                )}
                <span className="text-sm capitalize">
                  {order.paymentMethod?.toLowerCase()}{' '}
                  {order.paymentMethod === 'VISA' && '•••• 4242'}
                </span>
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <MapPin size={20} className="text-muted-foreground" />
                <span className="text-sm text-balance capitalize">
                  {order.customer.address}
                </span>
              </div>
            </div>
            <Separator />
            {order.products.map((product) => (
              <div key={product.UID} className="flex items-center gap-4 pb-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium">
                    {product.itemDescription}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {product.price.toLocaleString('en-EG', {
                      style: 'currency',
                      currency: 'EGP',
                      roundingMode: 'halfCeil',
                    })}{' '}
                    x {product.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {(product.price * product.quantity).toLocaleString('en-EG', {
                    style: 'currency',
                    currency: 'EGP',
                    roundingMode: 'halfCeil',
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
                  {order.subtotal.toLocaleString('en-EG', {
                    style: 'currency',
                    currency: 'EGP',
                    roundingMode: 'halfCeil',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <p>Shipping Fees</p> {icons.question}
                </span>
                <span className="text-sm font-medium">
                  {order.shippingFees.toLocaleString('en-EG', {
                    style: 'currency',
                    currency: 'EGP',
                    roundingMode: 'halfCeil',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total
                </span>
                <span className="text-sm font-medium">
                  {order.total.toLocaleString('en-EG', {
                    style: 'currency',
                    currency: 'EGP',
                    roundingMode: 'halfCeil',
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
              {order.statusHistory ? (
                <>
                  {Object.keys(order.statusHistory)
                    .reverse()
                    .map((key: string, index) => (
                      <>
                        {key !== '_id' && (
                          <div key={index} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              {icons[key as keyof typeof icons] ?? (
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
                                'border-l-0'
                              }`}
                            >
                              <p className="text-xs text-muted-foreground">
                                {moment(
                                  order.statusHistory[
                                    key as keyof typeof order.statusHistory
                                  ]
                                )
                                  .locale(locale)
                                  .format('dddd, MMMM Do, YYYY hh:mm A')}
                              </p>
                              {key === 'postponed' && (
                                <p className="text-balance text-sm italic text-yellow-500 dark:text-amber-300 font-semibold">
                                  {`The customer postponed the order to ${moment(
                                    order.postponedDate
                                  )
                                    .locale(locale)
                                    .format('MMMM Do, YYYY')}`}
                                </p>
                              )}
                              {key === 'cancelled' && (
                                <p className="text-balance text-sm italic text-red-500 dark:text-red-300 font-semibold">
                                  {`Cancellation Reason: ${order?.cancellationReason?.replaceAll(
                                    '_',
                                    ' '
                                  )}`}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                </>
              ) : (
                <div className="w-full flex items-center justify-center">
                  <p>This order has no history</p>
                </div>
              )}
            </div>
          </TabsContent>
          {order.courier && (
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
                    href={`tel:${order.courier.phone}`}
                    className="text-sm hover:underline"
                  >
                    {order.courier.phone}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <span className="text-sm">
                    Estimated Delivery:{' '}
                    {moment(order.createdAt)
                      .add(3, 'days')
                      .locale(locale)
                      .format('MMM DD, YYYY')}
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
          )}
          <TabsContent value="attachments" className="space-y-4">
            <div className="space-y-2">
              {order.orderImages ? (
                <>
                  {Object.keys(order.orderImages).map((attachment) => (
                    <DownloadButton
                      key={attachment}
                      fileUrl={
                        order.orderImages[
                          attachment as keyof typeof order.orderImages
                        ] ?? ''
                      }
                      fileName={attachment}
                    />
                  ))}
                </>
              ) : (
                <div className="flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    This order has no attachments
                  </p>
                </div>
              )}
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
