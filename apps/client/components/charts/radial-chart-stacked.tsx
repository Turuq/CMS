'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface Props {
  chartData: { delivered: number; other: number };
}

export const description = 'A radial chart with stacked sections';

const chartConfig = {
  delivered: {
    label: 'Delivered',
    color: 'hsl(var(--accent))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--muted))',
  },
} satisfies ChartConfig;

export function RadialChartStacked({ data }: { data: Props }) {
  const totalOrders = data.chartData.delivered + data.chartData.other;

  return (
    <Card className="flex flex-col gap-5 w-full h-40 rounded-xl">
      <CardHeader className="items-start pb-0">
        <p className="text-xs capitalize">Completed Deliveries</p>
      </CardHeader>
      <CardContent className="flex items-center  p-0">
        <ChartContainer
          config={chartConfig}
          className="w-full h-auto flex items-center justify-center"
        >
          <RadialBarChart
            data={[data.chartData]}
            endAngle={180}
            innerRadius={60}
            outerRadius={97.5}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-lg font-bold"
                        >
                          {data.chartData.delivered}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          out of {totalOrders}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="delivered"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-delivered)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="other"
              fill="var(--color-other)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
