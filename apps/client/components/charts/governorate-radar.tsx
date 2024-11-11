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

const chartConfig = {
  count: {
    label: 'Out For Delivery',
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
      <CardContent className="flex items-center justify-center pb-0 h-[400px]">
        <ChartContainer
          config={chartConfig}
          className="aspect-square max-h-[400px] h-full"
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
