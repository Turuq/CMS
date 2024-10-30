'use client';

import { icons } from '@/components/icons/icons';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Couriers } from '@/utils/data/dummy';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import moment, { Moment } from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function InspectionCalendar({
  params: { courierId },
}: {
  params: { locale: string; courierId: string };
}) {
  const router = useRouter();
  const [date, setDate] = useState<Moment>(moment().startOf('month'));
  // const [monthDays, setMonthDays] = useState<Array<number>>();

  // useEffect(() => {
  //   const days = moment(date).daysInMonth();
  //   setMonthDays(new Array(days).fill(0).map((_, i) => i + 1));
  // }, [date]);

  const generateCalendarGrid = () => {
    const daysInMonth = date.daysInMonth();
    const startingDay = date.clone().startOf('month').day();
    const dates = [];

    for (let i = 0; i < daysInMonth + startingDay; i++) {
      const currentDate = date.clone().add(i - startingDay, 'days');
      dates.push(currentDate);
    }

    return dates;
  };
  return (
    <div className="flex flex-col w-full gap-2">
      <h1 className="font-bold text-lg text-foreground">Inspection Calendar</h1>
      <div className="flex items-center justify-between gap-5 h-14">
        <div className="flex flex-col gap-1">
          <Select
            value={courierId === 'all' ? undefined : courierId}
            onValueChange={(value) =>
              router.push(`/admin/courier/${value}/inspection`)
            }
          >
            <SelectTrigger className="w-60 h-10 capitalize rounded-xl">
              <SelectValue placeholder="Select Courier" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={'all'} className="capitalize">
                  Select Courier
                </SelectItem>
                {Couriers?.map((courier) => (
                  <SelectItem
                    key={courier._id}
                    value={courier._id}
                    className="capitalize"
                  >
                    {courier.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* {id === 'all' && (
            <span className="font-bold italic text-accent text-xs">
              {'*Please select a courier to proceed'}
            </span>
          )} */}
        </div>
        {/* <Divider orientation="vertical" flexItem>
          <span className="text-xs text-accent font-bold">OR</span>
        </Divider> */}
        <div className="flex items-center justify-between bg-light dark:bg-dark_border rounded-xl w-80 py-1 px-2 h-10">
          <input
            placeholder="Search by OID"
            className="bg-transparent text-xs w-full ring-0 focus:ring-0 outline-none border-0"
            value={''}
            // onChange={(e) => setOID(e.target.value)}
          />
          <button
            className="hover:text-accent"
            // onClick={() =>
            //   router.push(`/admin/courier/${id}/inspection/current/${OID}`)
            // }
          >
            {icons.search}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-start gap-0">
          <div className="w-44 flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center mr-1">
                <h3 className="font-semibold text-lg">
                  {moment(date).format('MMMM')}
                </h3>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Month</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {moment.months().map((month, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => setDate(moment().month(index))}
                  >
                    {month}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-start mr-5">
                <h3 className="font-semibold text-lg">
                  {moment(date).format('YYYY')}
                </h3>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Year</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDate(moment().year(2023))}>
                  2023
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDate(moment().year(2024))}>
                  2024
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDate(moment().year(2025))}
                  disabled
                >
                  2025
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <button
            className="mr-5 p-2 size-10 hover:text-accent disabled:cursor-not-allowed disabled:text-gray-500 disabled:hover:text-gray-500"
            onClick={() =>
              setDate((prev) =>
                moment(prev.subtract(1, 'month').startOf('month'))
              )
            }
            disabled={date.isSameOrBefore(moment('2023-01-01'))}
          >
            <ChevronLeftIcon size={16} />
          </button>
          <button
            className="p-2 size-10 hover:text-accent disabled:cursor-not-allowed disabled:text-gray-500 disabled:hover:text-gray-500"
            onClick={() =>
              setDate((prev) => moment(prev.add(1, 'months').startOf('month')))
            }
            disabled={date.isSameOrAfter(moment().startOf('month'))}
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
        <Card className="p-5 m-0 rounded-xl bg-light dark:bg-dark_border">
          <div className="grid grid-cols-7 gap-4 text-sm font-medium text-dark_border dark:text-light">
            <div className="flex items-center justify-center py-3">Sun</div>
            <div className="flex items-center justify-center py-3">Mon</div>
            <div className="flex items-center justify-center py-3">Tue</div>
            <div className="flex items-center justify-center py-3">Wed</div>
            <div className="flex items-center justify-center py-3">Thu</div>
            <div className="flex items-center justify-center py-3">Fri</div>
            <div className="flex items-center justify-center py-3">Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-4 text-sm">
            {generateCalendarGrid()?.map((day, index) => (
              <Link
                key={index}
                className="flex flex-col items-center justify-center justify-self-center size-20 text-dark_border dark:text-light cursor-pointer hover:bg-muted disabled:cursor-not-allowed disabled:bg-gray-100 rounded-md transition-colors"
                href={`inspection/${moment(day).format('YYYY-MM-DD')}`}
                // disabled={id === 'all'}
              >
                <div
                  className={`${day.month() !== date.month() ? 'text-dark_border/40 dark:text-light/40' : 'text-dark_border dark:text-light'}`}
                >
                  {day.format('D')}
                </div>
                {/* <div className="mt-2 flex items-center gap-1">
                  <PackageIcon className="w-4 h-4" />
                  <span>12</span>
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <RouteIcon className="w-4 h-4" />
                  <span>45 mi</span>
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>95%</span>
                </div> */}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
