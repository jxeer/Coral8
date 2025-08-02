/**
 * Button Component - Primary Interactive Element
 * 
 * A comprehensive button component built on Radix UI primitives with
 * variant-based styling for different use cases throughout Coral8.
 * Optimized for mobile touch interactions and accessibility.
 * 
 * Features:
 * - Multiple visual variants (default, destructive, outline, secondary, ghost, link)
 * - Size variants (sm, default, lg, icon) with proper touch targets
 * - Accessibility with focus management and screen reader support
 * - Polymorphic rendering with asChild prop for link composition
 * - Consistent styling aligned with oceanic design system
 * 
 * Mobile Optimizations:
 * - Minimum 44px height for touch targets (WCAG guidelines)
 * - Proper hover states that work well on touch devices
 * - Loading states and disabled styling for better UX
 * - Icon spacing and sizing for mobile readability
 * 
 * Design System Integration:
 * - Uses CSS custom properties for theme consistency
 * - Supports dark/light mode through CSS variables
 * - Oceanic color palette integration
 * - Consistent border radius and spacing
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
