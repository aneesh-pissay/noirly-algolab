"use client";

import { cn } from "@noirly-dev/ui";
import { ThemePicker } from "@/src/components/ThemePicker";
import { ThemeToggle } from "@/src/components/ThemeToggle";

type Props = {
  className?: string;
  size?: "sm" | "md";
};

/** Palette picker + light/dark toggle (Noirly Flow's header controls). */
export function ThemeControls({ className, size = "md" }: Props) {
  return (
    <div className={cn("flex shrink-0 items-center gap-1.5", className)}>
      <ThemePicker size={size} />
      <ThemeToggle size={size} />
    </div>
  );
}
