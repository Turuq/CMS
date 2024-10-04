"use client";

import MotionNumber from "motion-number";
import { easeOut } from "framer-motion";

interface IAnimatedNumberProps {
  value: number;
  locale?: string;
  financial?: boolean;
  notation?: "standard" | "compact";
}

export default function AnimatedNumber({
  value,
  locale,
  financial,
  notation,
}: IAnimatedNumberProps) {
  return (
    <MotionNumber
      value={value}
      format={{
        notation: notation,
        currency: financial ? "EGP" : undefined,
        style: financial ? "currency" : undefined,
      }} // Intl.NumberFormat() options
      locales={locale}
      className="text-3xl lg:text-4xl font-bold"
      transition={{
        // Applied to layout animations on individual characters:
        layout: { type: "spring", duration: 1, bounce: 0 },
        // Used for the digit animations:
        y: { type: "spring", duration: 1, bounce: 0.25 },

        // Opacity applies to entering/exiting characters.
        // Note the use of the times array, explained below:
        opacity: { duration: 1, ease: easeOut, times: [0, 0.3] }, // 0.3s perceptual duration
      }}
    />
  );
}
