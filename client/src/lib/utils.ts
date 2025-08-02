/**
 * Utility Functions
 * Common helper functions used throughout the Coral8 application
 * Includes CSS class merging for Tailwind CSS integration
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges CSS class names intelligently
 * Uses clsx for conditional classes and tailwind-merge for conflicting utilities
 * Essential for dynamic styling in components with Tailwind CSS
 * @param inputs - Array of class values (strings, conditionals, etc.)
 * @returns Merged and optimized class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
