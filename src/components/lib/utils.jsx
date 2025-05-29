import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string, merging Tailwind classes properly
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
