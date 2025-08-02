/**
 * Mobile Optimized Layout Component
 * Provides mobile-first responsive layouts for different screen sizes
 * Features touch-friendly interfaces and optimized spacing for mobile devices
 * Includes gesture support and mobile-specific navigation patterns
 */

import { useState, useEffect } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, X } from "lucide-react";

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  mobileHeader?: React.ReactNode;
  className?: string;
}

/**
 * Responsive layout that adapts to mobile and desktop interfaces
 * @param children - Main content to display
 * @param sidebar - Optional sidebar content for desktop
 * @param mobileHeader - Optional mobile-specific header
 * @param className - Additional CSS classes
 */
export function MobileOptimizedLayout({ 
  children, 
  sidebar, 
  mobileHeader,
  className = "" 
}: MobileOptimizedLayoutProps) {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-deep-navy to-ocean-blue ${className}`}>
        {/* Mobile Header */}
        <header className="bg-deep-navy/95 backdrop-blur-sm border-b border-seafoam/20 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            {mobileHeader || (
              <h1 className="text-xl font-bold text-pearl-white">Coral8</h1>
            )}
            
            {/* Mobile Menu Trigger */}
            {sidebar && (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-pearl-white hover:bg-seafoam/20"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="bg-deep-navy border-seafoam/20 w-80"
                >
                  <div className="text-pearl-white">
                    {sidebar}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </header>

        {/* Mobile Content */}
        <main className="flex-1 p-4 pb-20">
          {children}
        </main>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className={`flex min-h-screen ${className}`}>
      {/* Desktop Sidebar */}
      {sidebar && (
        <aside className="w-64 bg-deep-navy border-r border-seafoam/20 sticky top-0 h-screen overflow-y-auto">
          {sidebar}
        </aside>
      )}
      
      {/* Desktop Content */}
      <main className="flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
}

/**
 * Mobile-optimized card component with touch-friendly interactions
 */
export function MobileCard({ 
  children, 
  className = "",
  onTap,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  onTap?: () => void;
} & React.ComponentProps<typeof Card>) {
  const isMobile = useIsMobile();
  
  return (
    <Card 
      className={`
        ${isMobile ? 'active:scale-95 transition-transform duration-150' : ''}
        ${onTap ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onTap}
      {...props}
    >
      {children}
    </Card>
  );
}

/**
 * Touch-optimized button sizing for mobile devices
 */
export function MobileButton({ 
  children, 
  className = "",
  size = "default",
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg";
} & React.ComponentProps<typeof Button>) {
  const isMobile = useIsMobile();
  
  const mobileSize = isMobile ? (size === "sm" ? "default" : "lg") : size;
  
  return (
    <Button 
      size={mobileSize}
      className={`${isMobile ? 'min-h-[44px] px-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}