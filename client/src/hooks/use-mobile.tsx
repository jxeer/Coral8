/**
 * Mobile Detection Hook
 * Provides responsive design capability by detecting mobile screen sizes
 * Uses media queries for accurate device detection across viewport changes
 * Essential for Coral8's mobile-first design approach
 */

import * as React from "react"

// Mobile breakpoint: 768px matches Tailwind's 'md' breakpoint
const MOBILE_BREAKPOINT = 768

/**
 * Custom hook to detect if the current viewport is mobile-sized
 * Updates dynamically when the window is resized
 * @returns Boolean indicating if current viewport is mobile (< 768px)
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create media query listener for mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Listen for viewport changes
    mql.addEventListener("change", onChange)
    
    // Set initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup listener on unmount
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
