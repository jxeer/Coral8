/**
 * Input Component - Form Input Controls
 * 
 * Standard input component with consistent styling and mobile optimization
 * for text entry throughout the Coral8 application.
 * 
 * Features:
 * - Consistent styling aligned with oceanic design system
 * - Mobile-optimized touch targets and virtual keyboard support
 * - Proper focus states for accessibility
 * - Integration with form validation and error states
 * - Support for various input types (text, email, number, etc.)
 * 
 * Mobile Optimizations:
 * - Appropriate input types for better virtual keyboards
 * - Sufficient padding for touch interactions
 * - Clear visual feedback for focus and error states
 * - Proper sizing for various screen sizes
 * 
 * Usage in Coral8:
 * - Labor hours input with decimal validation
 * - Token amount entry for transfers and marketplace
 * - User profile information editing
 * - Search inputs for marketplace and governance
 * - Authentication form fields
 */

import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
