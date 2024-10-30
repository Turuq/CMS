"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <>
      <ToggleGroup
        type="single"
        value={theme ?? 'dark'}
        onValueChange={(value) => setTheme(value)}
        className="w-auto"
      >
        <ToggleGroupItem value="light">
          <SunIcon size={16} strokeWidth={2} className="text-inherit" />
        </ToggleGroupItem>
        <ToggleGroupItem value="dark">
          <MoonIcon size={16} strokeWidth={2} className="text-inherit" />
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}
