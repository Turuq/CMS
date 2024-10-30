import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { OrderType } from '@/types/order';
import { getStatusColor, getStatusText } from '@/utils/helpers/status-modifier';
import {
  BanknoteIcon,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  ReceiptTextIcon,
} from 'lucide-react';
import moment from 'moment';

export default function OrderSummaryCard({ order }: { order: OrderType }) {
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
          {order.paymentMethod === 'VISA' ? (
            <CreditCard size={16} className="text-muted-foreground" />
          ) : (
            <BanknoteIcon size={16} className="text-muted-foreground" />
          )}
          <span className="text-sm capitalize">
            {order.paymentMethod.toLowerCase()}{' '}
            {order.paymentMethod === 'VISA' && '•••• 4242'}
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
              {moment(order.createdAt).format('MMM DD')}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg border p-2">
            <ReceiptTextIcon size={16} className="text-muted-foreground" />
            <span className="text-xs">
              {order.total.toLocaleString('en-EG', {
                style: 'currency',
                currency: 'EGP',
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
