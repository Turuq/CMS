import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import AnimatedNumber from '../display/animated-number';
import Link from 'next/link';
import { icons } from '../icons/icons';

import {
  SparkAreaChart,
  SparkBarChart,
  SparkLineChart,
  Tracker,
} from '@tremor/react';
import { Moment } from 'moment';
import 'moment/locale/ar';
import { useTranslations } from 'next-intl';

type ColorOptions =
  | 'blue'
  | 'emerald'
  | 'violet'
  | 'amber'
  | 'gray'
  | 'cyan'
  | 'pink'
  | 'lime'
  | 'fuchsia';

const CardColors = {
  accent: 'bg-accent dark:bg-accent text-light dark:text-light',
  warning: 'bg-amber-500 dark:bg-amber-300 text-light dark:text-dark_border',
  error: 'bg-red-500 dark:bg-red-500 text-light dark:text-light',
  muted: 'bg-light dark:bg-dark_border',
};

type CardColorOptions = 'accent' | 'warning' | 'error' | 'muted';

interface IKpiCardProps {
  locale: string;
  statistic: number;
  title: string;
  financial?: boolean;
  dotted?: boolean;
  animated?: boolean;
  notation?: 'standard' | 'compact';
  description?: string;
  icon?: React.ReactNode;
  link?: string;
  chart?: boolean;
  chartConfig?: {
    chart: 'area' | 'bar' | 'line' | 'tracker';
    data: Array<{ [key: string]: string }>;
    index: string;
    categories: Array<string>;
    colors: Array<ColorOptions>;
  };
  action?: React.ReactNode;
  color?: CardColorOptions;
  date?: Moment;
}

export default function KpiCard({
  locale = 'en',
  statistic,
  title,
  financial,
  dotted,
  animated,
  notation,
  description,
  icon,
  link,
  chart,
  chartConfig,
  action,
  color,
  date,
}: IKpiCardProps) {
  const t = useTranslations('dashboard.statistics');
  return (
    <Card
      className={cn(
        `rounded-xl drop-shadow-sm relative shadow-accent/10 min-h-20 max-h-40 h-full`,
        color && CardColors[color]
      )}
    >
      <CardHeader
        className={`px-6 pt-3 pb-1 flex flex-row items-center justify-between gap-2`}
      >
        <CardTitle className={'flex items-center gap-5'}>
          {icon}
          <div className={'flex items-center justify-between gap-5 w-full'}>
            {!animated ? (
              <h1 className={'text-3xl lg:text-4xl font-bold'}>
                {statistic
                  ? financial
                    ? statistic.toLocaleString(`${locale}-EG`, {
                        notation: notation,
                        style: 'currency',
                        currency: 'EGP',
                        maximumFractionDigits: 0,
                      })
                    : statistic.toLocaleString(`${locale}-EG`, {
                        notation: notation,
                      })
                  : 0}
              </h1>
            ) : (
              <AnimatedNumber
                value={statistic}
                financial={financial}
                locale={`en-EG`}
                notation={notation}
              />
            )}
          </div>
        </CardTitle>
        {chart && chartConfig && (
          <>
            {chartConfig?.chart === 'area' ? (
              <SparkAreaChart
                data={chartConfig.data}
                categories={chartConfig.categories}
                index={chartConfig.index}
                colors={chartConfig.colors}
              />
            ) : chartConfig?.chart === 'bar' ? (
              <SparkBarChart
                data={chartConfig.data}
                categories={chartConfig.categories}
                index={chartConfig.index}
                colors={chartConfig.colors}
                stack
              />
            ) : (
              chartConfig?.chart === 'line' && (
                <SparkLineChart
                  data={chartConfig.data}
                  categories={chartConfig.categories}
                  index={chartConfig.index}
                  colors={chartConfig.colors}
                />
              )
            )}
          </>
        )}
        {action && !chart && !date && (
          <div className={'flex items-center gap-5'}>{action}</div>
        )}

        {date && !action && !chart && (
          <div className="rounded-xl size-10 flex items-center justify-center relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={40}
              height={40}
              fill={'hsl(var(--muted))'}
              className="text-dark dark:text-light"
            >
              <path
                d="M18 2V4M6 2V4"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-black text-lg absolute justify-self-center">
              {date.locale(locale).format('DD')}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className={`px-6 pt-0 pb-1 flex flex-col gap-5`}>
        <p className="text-xs capitalize">{title}</p>
        {chart && chartConfig && (
          <div className="min-w-40 max-w-40 lg:max-w-80 w-full h-10">
            <Tracker
              dir="ltr"
              data={chartConfig.data}
              className="mt-2 h-5 rounded-xl capitalize"
            />
          </div>
        )}
      </CardContent>
      {link && (
        <CardFooter
          className={`
            flex items-center justify-end border-t border-muted mt-1 p-2
          `}
        >
          <div className="flex items-center justify-between gap-5 hover:text-accent">
            <Link
              href={link}
              className="text-sm font-semibold hover:underline underline-offset-4"
            >
              {t('cards.viewMore')}
            </Link>
            {icons.link}
          </div>
        </CardFooter>
      )}
      {description && (
        <CardFooter
          className={
            'text-xs lg:text-sm font-bold text-dark/50 dark:text-light/50 italic py-2 px-6'
          }
        >
          {description}
        </CardFooter>
      )}
      {dotted && <div className={'dot-background hidden lg:block'}></div>}
    </Card>
  );
}
