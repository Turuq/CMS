'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A radar chart with dots';

// const chartData = [
//   { month: 'January', desktop: 186 },
//   { month: 'February', desktop: 305 },
//   { month: 'March', desktop: 237 },
//   { month: 'April', desktop: 273 },
//   { month: 'May', desktop: 209 },
//   { month: 'June', desktop: 214 },
// ];

const chartConfig = {
  count: {
    label: 'Processing Orders',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export function GovernorateRadarChart({
  chartData,
  title,
  description,
  children,
}: {
  chartData: { [key: string]: string }[];
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-square max-h-[400px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="_id" />
            <PolarGrid />
            <Radar
              dataKey="count"
              fill="var(--color-count)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      {children && (
        <CardFooter className="flex-col gap-2 text-sm">{children}</CardFooter>
      )}
    </Card>
  );
}
