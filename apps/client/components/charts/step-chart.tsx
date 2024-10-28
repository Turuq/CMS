'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A line chart with step';

export function StepChart({
  chartData,
  title,
  description,
  chartConfig,
  children,
}: {
  chartData: { [key: string]: string }[];
  title: string;
  description: string;
  chartConfig: ChartConfig;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="_id"
              tickLine={false}
              axisLine={false}
              tickMargin={2}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="delivered"
              stackId="a"
              fill="var(--color-delivered)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="outForDelivery"
              stackId="a"
              fill="var(--color-outForDelivery)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {children && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {children}
        </CardFooter>
      )}
    </Card>
  );
}
