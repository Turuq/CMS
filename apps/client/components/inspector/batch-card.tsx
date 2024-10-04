'use client';

import { courierManagerIcons } from '@/app/[locale]/courier-manager/components/icons/courier-manager-icons';
import { CourierStatisticsIcons } from '@/app/[locale]/handover-officer/components/icons/courier-statistics-icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ProgressBar } from '@tremor/react';
import moment from 'moment';
import { Button } from '../ui/button';

interface BatchCardProps {
  title: string;
  progress: number;
  startDate: string;
  endDate?: string;
  delivered: number;
  toBeReshipped: number;
  collected: number;
  finished: boolean;
  courier: string;
}

export default function BatchCard({
  information,
}: {
  information: BatchCardProps;
}) {
  return (
    <Card className="rounded-xl border-muted w-full">
      <CardHeader className="space-y-0.5 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-0.5">
            <ProgressBar
              value={information.progress}
              color={
                information.progress <= 25
                  ? 'stone'
                  : information.progress <= 75
                    ? 'amber'
                    : 'green'
              }
              showAnimation
              className="w-20"
            />
            <CardTitle className="text-lg font-bold">
              {information.title}
            </CardTitle>
            <CardDescription className="text-xs font-semibold">
              {moment(information.startDate).format('MMM DD')} -{' '}
              {information.endDate && information.finished
                ? moment(information.endDate).format('MMM DD')
                : 'Current'}
            </CardDescription>
          </div>
          <Button variant={'ghost'} size={'sm'} className="flex items-center">
            {courierManagerIcons['inspect']}
            <span className="ml-2">Inspect</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-2">
        <Separator />
        <div className="grid grid-cols-3 gap-5 my-2 p-2 bg-muted rounded-xl">
          <div className="flex flex-col items-center justify-center gap-1">
            {CourierStatisticsIcons['delivered']}
            <p className="text-xs font-bold">{information.delivered}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            {CourierStatisticsIcons['toBeReshipped']}
            <p className="text-xs font-bold">{information.toBeReshipped}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            {CourierStatisticsIcons['collectedAmount']}
            <p className="text-xs font-bold">
              {information.collected.toLocaleString('en-EG', {
                style: 'currency',
                currency: 'EGP',
              })}
            </p>
          </div>
        </div>
        <Separator />
      </CardContent>
      <CardFooter className="w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-sm font-semibold text-dark_border/80 dark:text-light/80 italic">
            {information.endDate && information.finished
              ? `Batch ended on: ${moment(information.endDate).format('dddd DD, MMMM YYYY')}`
              : 'Batch is still in progress'}
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs font-bold">
                    {information.courier.split(' ')[0][0]}
                    {information.courier.split(' ')[1][0]}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{information.courier}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
