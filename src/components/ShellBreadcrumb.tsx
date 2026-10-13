"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Crumb } from "@noirly-dev/ui";

type Setter = (crumbs: Crumb[] | null) => void;
const BreadcrumbContext = createContext<{ crumbs: Crumb[] | null; setCrumbs: Setter } | null>(null);

/** Lets a page put its trail in the shell's top bar. */
export function ShellBreadcrumbProvider({ children }: { children: ReactNode }) {
  const [crumbs, setCrumbs] = useState<Crumb[] | null>(null);
  return <BreadcrumbContext.Provider value={{ crumbs, setCrumbs }}>{children}</BreadcrumbContext.Provider>;
}

export function useShellCrumbs(): Crumb[] | null {
  return useContext(BreadcrumbContext)?.crumbs ?? null;
}

/** Publishes `crumbs` to the top bar while the calling page is mounted. */
export function useRegisterCrumbs(crumbs: Crumb[]) {
  const setCrumbs = useContext(BreadcrumbContext)?.setCrumbs;
  const key = JSON.stringify(crumbs);
  useEffect(() => {
    if (!setCrumbs) return;
    setCrumbs(JSON.parse(key) as Crumb[]);
    return () => setCrumbs(null);
  }, [key, setCrumbs]);
}
