"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <ToggleGroup
      type="single"
      value={theme ?? "system"}
      onValueChange={(value) => setTheme(value)}
      className="w-40"
    >
      <ToggleGroupItem value="light">
        <SunIcon size={16} strokeWidth={2} className="text-inherit" />
      </ToggleGroupItem>
      <ToggleGroupItem value="system">
        <MonitorIcon size={16} strokeWidth={2} className="text-inherit" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark">
        {" "}
        <MoonIcon size={16} strokeWidth={2} className="text-inherit" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
