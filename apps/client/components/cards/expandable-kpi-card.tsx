"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import AnimatedNumber from "../display/animated-number";
import AnimatedNumberExample from "../display/animated-number-example";
import Link from "next/link";
import { icons } from "../icons/icons";
import { motion } from "framer-motion";

import { SparkAreaChart, SparkBarChart, SparkLineChart } from "@tremor/react";
import { useState } from "react";

type ColorOptions =
  | "blue"
  | "emerald"
  | "violet"
  | "amber"
  | "gray"
  | "cyan"
  | "pink"
  | "lime"
  | "fuchsia";

interface IKpiCardProps {
  statistic: number;
  title: string;
  financial?: boolean;
  dotted?: boolean;
  animated?: boolean;
  notation?: "standard" | "compact";
  description?: string;
  icon?: React.ReactNode;
  link?: string;
  chart?: boolean;
  chartConfig?: {
    chart: "area" | "bar" | "line";
    data: Array<{ [key: string]: string }>;
    index: string;
    categories: Array<string>;
    colors: Array<ColorOptions>;
  };
  children?: React.ReactNode;
  action?: React.ReactNode;
}

export default function ExpandableKpiCard({
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
  children,
  action,
}: IKpiCardProps) {
  const [expand, setExpand] = useState(false);

  const cardVariants = {
    expand: {
      minHeight: 100,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    collapse: {
      minHeight: 80,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const childrenVariants = {
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        delay: 0.2,
        duration: 1.5,
        ease: "easeInOut",
      },
    },
    hide: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      key={"expanded-kpi-card"}
      variants={cardVariants}
      animate={expand ? "expand" : "collapse"}
    >
      <Card
        className={cn(
          `rounded-xl drop-shadow-sm relative shadow-accent/10 min-h-20`,
        )}
      >
        <CardHeader
          className={`px-6 pt-3 pb-1 flex flex-row items-center justify-between gap-2`}
        >
          <CardTitle className={"flex items-center gap-5"}>
            {icon}
            <div className={"flex items-center justify-between gap-5 w-full"}>
              {!animated ? (
                <h1 className={"text-3xl lg:text-4xl font-bold"}>
                  {statistic
                    ? financial
                      ? statistic.toLocaleString("en-EG", {
                          notation: notation,
                          style: "currency",
                          currency: "EGP",
                        })
                      : statistic.toLocaleString("en-EG", {
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
          <div className="flex flex-col items-end gap-1">
            <button
              className="flex items-center justify-center hover:text-accent size-5"
              onClick={() => setExpand((old) => !old)}
            >
              {expand ? icons.chevronUp : icons.chevronDown}
            </button>
            {chart && chartConfig && (
              <>
                {chartConfig?.chart === "area" ? (
                  <SparkAreaChart
                    data={chartConfig.data}
                    categories={chartConfig.categories}
                    index={chartConfig.index}
                    colors={chartConfig.colors}
                  />
                ) : chartConfig?.chart === "bar" ? (
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
              <div className={"flex items-center gap-5"}>{action}</div>
            )}
          </div>
        </CardHeader>
        <CardContent className={`flex flex-col gap-2 px-6 pt-0 pb-1`}>
          <p className="text-xs capitalize">{title}</p>
          <motion.div
            key={"expanded-kpi-card-children"}
            variants={childrenVariants}
            animate={expand ? "show" : "hide"}
          >
            {children}
          </motion.div>
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
              "text-xs lg:text-sm font-bold text-dark/50 dark:text-light/50 italic py-2 px-6"
            }
          >
            {description}
          </CardFooter>
        )}
        {dotted && <div className={"dot-background hidden lg:block"}></div>}
      </Card>
    </motion.div>
  );
}
