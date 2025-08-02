/**
 * Badge Component - Status and Category Indicators
 * 
 * Small visual indicators used throughout Coral8 to show status,
 * categories, and other metadata with consistent styling.
 * 
 * Features:
 * - Multiple variants (default, secondary, destructive, outline)
 * - Consistent sizing and spacing for visual hierarchy
 * - Integration with oceanic color palette
 * - Accessibility with proper contrast ratios
 * 
 * Usage in Coral8:
 * - Labor type indicators with cultural value multipliers
 * - Token status badges (COW1, COW2, COW3)
 * - Governance proposal status (active, voting, completed)
 * - Marketplace item categories and pricing tiers
 * - User achievement and contribution levels
 * - Activity status indicators (online, active, away)
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
