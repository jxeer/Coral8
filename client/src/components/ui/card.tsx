/**
 * Card Component System - Content Container Framework
 * 
 * A flexible card system that provides consistent content containers
 * throughout the Coral8 application. Used for dashboard sections,
 * labor logs, marketplace items, and governance proposals.
 * 
 * Components:
 * - Card: Base container with shadow and border
 * - CardHeader: Top section for titles and metadata
 * - CardTitle: Primary heading with proper typography hierarchy
 * - CardDescription: Secondary text for context and details
 * - CardContent: Main content area with proper padding
 * - CardFooter: Bottom section for actions and additional info
 * 
 * Design Features:
 * - Subtle shadows for depth perception
 * - Rounded corners for friendly appearance
 * - Consistent padding and spacing
 * - Responsive design for mobile and desktop
 * - Oceanic color integration through CSS variables
 * 
 * Usage Patterns:
 * - Dashboard feature cards (labor, governance, marketplace)
 * - Data display containers (token balances, user stats)
 * - Interactive content (voting interfaces, form sections)
 * - List items (marketplace goods, labor history)
 * 
 * Accessibility:
 * - Proper heading hierarchy with CardTitle
 * - Sufficient color contrast for text readability
 * - Focus management for interactive cards
 * - Screen reader friendly structure
 */

import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
