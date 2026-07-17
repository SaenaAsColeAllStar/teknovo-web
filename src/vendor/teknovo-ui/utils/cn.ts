import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabungkan class Tailwind tanpa konflik (pola Shadcn / Atlas). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
