'use client';

import { courierManagerIcons } from '@/app/[locale]/courier-manager/components/icons/courier-manager-icons';
// import { CourierStatisticsIcons } from '@/app/[locale]/handover-officer/components/icons/courier-statistics-icons';
import { CourierBatchSummary } from '@/api/validation/courier-batch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getBatchProgress } from '@/utils/helpers/functions';
import { ProgressBar } from '@tremor/react';
import moment from 'moment';
import Link from 'next/link';

// interface BatchCardProps {
//   title: string;
//   progress: number;
//   startDate: string;
//   endDate?: string;
//   delivered: number;
//   toBeReshipped: number;
//   collected: number;
//   finished: boolean;
//   courier: string;
// }

export default function BatchCard({
  batch,
  href
}: {
  batch: CourierBatchSummary;
  href?: string;
}) {
  return (
    <Card className="rounded-xl border-muted w-full">
      <CardHeader className="space-y-0.5 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-0.5">
            <ProgressBar
              value={
                batch.endDate
                  ? 100
                  : getBatchProgress(batch.progress, batch.numberOfOrders)
              }
              color={
                batch.endDate
                  ? 'emerald'
                  : getBatchProgress(batch.progress, batch.numberOfOrders) <= 25
                    ? 'stone'
                    : getBatchProgress(batch.progress, batch.numberOfOrders) <=
                        75
                      ? 'amber'
                      : 'green'
              }
              showAnimation
              className="w-20"
            />
            <CardTitle className="text-lg font-bold uppercase">
              {`${batch.courier?.name}'s Batch-${batch.BID.toString().padStart(3, '0')}`}
            </CardTitle>
            <CardDescription className="text-xs font-semibold">
              {moment(batch.startDate).format('MMM DD')} -{' '}
              {batch.endDate
                ? moment(batch.endDate).format('MMM DD')
                : 'Current'}
            </CardDescription>
          </div>
          <Link
            href={href ?? `inspector/${batch._id}`}
            className="flex items-center justify-center font-semibold text-dark bg-accent hover:bg-accent/80 rounded-xl w-auto h-8 p-2"
          >
            {courierManagerIcons['inspect']}
            <span className="ml-2">Inspect</span>
          </Link>
        </div>
      </CardHeader>
      {/* <CardContent className="px-6 pb-2">
        <Separator />
        <div className="grid grid-cols-3 gap-5 my-2 p-2 bg-muted rounded-xl">
          <div className="flex flex-col items-center justify-center gap-1">
            {CourierStatisticsIcons['delivered']}
            <p className="text-xs font-bold">{batch.delivered}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            {CourierStatisticsIcons['toBeReshipped']}
            <p className="text-xs font-bold">{batch.toBeReshipped}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            {CourierStatisticsIcons['collectedAmount']}
            <p className="text-xs font-bold">
              {batch.collected.toLocaleString('en-EG', {
                style: 'currency',
                currency: 'EGP',
              })}
            </p>
          </div>
        </div>
        <Separator />
      </CardContent> */}
      <CardFooter className="w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-sm font-semibold text-dark_border/80 dark:text-light/80 italic">
            {batch.endDate
              ? `Batch ended on: ${moment(batch.endDate).format('dddd DD, MMMM YYYY')}`
              : 'Batch is still in progress'}
          </p>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs font-bold capitalize">
                    {batch.courier?.name[0]}
                    {/* {batch.courier?.name.split(' ')[1][0]} */}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{batch.courier?.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
