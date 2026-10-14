"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { DURATION, EASE_OUT, SPRING } from "@noirly-dev/ui/motion";
import { cn } from "@noirly-dev/ui";
import { useSettings } from "@/app/contexts/SettingsContext";

/**
 * Light/dark switch (Flow's control). Goes through Settings, so a signed-in
 * learner's choice is saved to their account; signed out it is kept on this
 * device only.
 */
export function ThemeToggle({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  const { resolvedTheme, toggleTheme } = useSettings();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      transition={SPRING}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "focusable relative flex items-center justify-center overflow-hidden rounded-full border border-[var(--hairline)] text-[var(--text-secondary)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[var(--text)]",
        size === "sm" ? "h-9 w-9" : "h-11 w-11",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ y: 14, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 45 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
          className="absolute inline-flex"
        >
          {isDark ? <Sun size={size === "sm" ? 15 : 16} /> : <Moon size={size === "sm" ? 15 : 16} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
