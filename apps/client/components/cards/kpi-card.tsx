import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import AnimatedNumber from '../display/animated-number';
import AnimatedNumberExample from '../display/animated-number-example';
import Link from 'next/link';
import { icons } from '../icons/icons';

import { SparkAreaChart, SparkBarChart, SparkLineChart } from '@tremor/react';

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
    chart: 'area' | 'bar' | 'line';
    data: Array<{ [key: string]: string }>;
    index: string;
    categories: Array<string>;
    colors: Array<ColorOptions>;
  };
  action?: React.ReactNode;
  color?: CardColorOptions;
}

export default function KpiCard({
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
}: IKpiCardProps) {
  return (
    <Card
      className={cn(
        `rounded-xl drop-shadow-sm relative shadow-accent/10 min-h-20`,
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
                    ? statistic.toLocaleString('en-EG', {
                        notation: notation,
                        style: 'currency',
                        currency: 'EGP',
                      })
                    : statistic.toLocaleString('en-EG', {
                        notation: notation,
                      })
                  : 0}
              </h1>
            ) : (
              // use this in your actual code
              //   <AnimatedNumber
              //     value={statistic}
              //     financial={financial}
              //     locale="en-EG"
              //       notation={notation}
              //   />
              // This is just an example
              <AnimatedNumberExample
                value={statistic}
                financial={financial}
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
              <SparkLineChart
                data={chartConfig.data}
                categories={chartConfig.categories}
                index={chartConfig.index}
                colors={chartConfig.colors}
              />
            )}
          </>
        )}
        {action && !chart && (
          <div className={'flex items-center gap-5'}>{action}</div>
        )}
      </CardHeader>
      <CardContent className={`px-6 pt-0 pb-1`}>
        <p className="text-xs capitalize">{title}</p>
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
              View More
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
