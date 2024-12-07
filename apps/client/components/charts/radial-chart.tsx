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
  chartData: { reshipped: number; other: number; totalOrders: number };
  title: string;
  locale: string;
  chartConfig: ChartConfig;
}

export function RadialChart({ chartData, chartConfig, title, locale }: Props) {
  return (
    <Card className="flex flex-col gap-5 w-full h-40 rounded-xl">
      <CardHeader className="items-start pb-0">
        <p className="text-xs capitalize">{title}</p>
      </CardHeader>
      <CardContent className="flex items-center  p-0">
        <ChartContainer
          config={chartConfig}
          className="w-full h-auto flex items-center justify-center"
        >
          <RadialBarChart
            data={[chartData]}
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
                          {chartData.reshipped.toLocaleString(`${locale}-EG`)}%
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="other"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-other)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="reshipped"
              fill="var(--color-reshipped)"
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
