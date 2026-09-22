"use client";

import { useSyncExternalStore } from "react";

const BUILD_YEAR = new Date().getFullYear();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) timer = setInterval(() => listeners.forEach((notify) => notify()), 60 * 60 * 1000);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const currentYear = () => new Date().getFullYear();
const buildYear = () => BUILD_YEAR;

export function CurrentYear() {
  return useSyncExternalStore(subscribe, currentYear, buildYear);
}

export function YearsSince({ year }: { year: number }) {
  const now = useSyncExternalStore(subscribe, currentYear, buildYear);
  return Math.max(0, now - year);
}
