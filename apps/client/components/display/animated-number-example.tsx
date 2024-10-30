"use client";

import { useEffect, useState } from "react";
import AnimatedNumber from "./animated-number";

export default function AnimatedNumberExample({
  value,
  financial,
  notation,
}: {
  value: number;
  financial?: boolean;
  notation?: "standard" | "compact";
}) {
  const [autoIncrement, setAutoIncrement] = useState(value);
  useEffect(() => {
    const inc = setInterval(() => {
      setAutoIncrement((old) => old + 2222);
    }, 10000);

    return () => clearInterval(inc);
  }, []);
  return (
    <AnimatedNumber
      value={autoIncrement}
      locale="en-EG"
      financial={financial}
      notation={notation}
    />
  );
}
