/**
 * Mobile Dashboard Component
 * Optimized dashboard interface specifically designed for mobile devices
 * Features swipe navigation, touch-friendly cards, and condensed information display
 * Prioritizes key metrics and actions for mobile-first user experience
 */

import { useState } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { useTouchGestures } from "../hooks/use-touch-gestures";
import { MobileOptimizedLayout, MobileCard, MobileButton } from "./mobile-optimized-layout";
import { DashboardCards } from "./dashboard-cards";
import { LaborLogging } from "./labor-logging";
import { BalanceDisplay } from "./balance-display";
import { GovernanceSection } from "./governance-section";
import { MarketplaceSection } from "./marketplace-section";
import { WalletConnectionButton } from "./wallet-connection-button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  ArrowRight, 
  Plus, 
  TrendingUp, 
  Users, 
  Zap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

type MobileDashboardSection = 'overview' | 'labor' | 'balance' | 'governance' | 'marketplace';

interface MobileDashboardProps {
  className?: string;
}

export function MobileDashboard({ className = "" }: MobileDashboardProps) {
  const [activeSection, setActiveSection] = useState<MobileDashboardSection>('overview');
  const isMobile = useIsMobile();

  // Touch gesture handling for section navigation
  const gestureRef = useTouchGestures({
    onSwipeLeft: () => {
      const sections: MobileDashboardSection[] = ['overview', 'labor', 'balance', 'governance', 'marketplace'];
      const currentIndex = sections.indexOf(activeSection);
      if (currentIndex < sections.length - 1) {
        setActiveSection(sections[currentIndex + 1]);
      }
    },
    onSwipeRight: () => {
      const sections: MobileDashboardSection[] = ['overview', 'labor', 'balance', 'governance', 'marketplace'];
      const currentIndex = sections.indexOf(activeSection);
      if (currentIndex > 0) {
        setActiveSection(sections[currentIndex - 1]);
      }
    }
  });

  const sections = [
    { id: 'overview', title: 'Overview', icon: TrendingUp },
    { id: 'labor', title: 'Labor Log', icon: Plus },
    { id: 'balance', title: 'Tokens', icon: Zap },
    { id: 'governance', title: 'Voting', icon: Users },
    { id: 'marketplace', title: 'Market', icon: ArrowRight },
  ] as const;

  if (!isMobile) {
    return null; // Use regular dashboard for desktop
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <MobileCard className="bg-gradient-to-br from-ocean-blue to-ocean-teal text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Today's Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">3.5</div>
                    <div className="text-sm opacity-90">Hours Logged</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">38.5</div>
                    <div className="text-sm opacity-90">COW Earned</div>
                  </div>
                </div>
              </CardContent>
            </MobileCard>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <MobileButton
                onClick={() => setActiveSection('labor')}
                className="h-20 bg-seafoam hover:bg-seafoam/90 text-deep-navy"
              >
                <div className="text-center">
                  <Plus className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-sm font-medium">Log Labor</div>
                </div>
              </MobileButton>
              
              <MobileButton
                onClick={() => setActiveSection('balance')}
                variant="outline"
                className="h-20 border-seafoam text-seafoam hover:bg-seafoam/10"
              >
                <div className="text-center">
                  <Zap className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-sm font-medium">View Tokens</div>
                </div>
              </MobileButton>
            </div>

            {/* Condensed Dashboard Cards */}
            <DashboardCards />
          </div>
        );

      case 'labor':
        return (
          <div className="space-y-6">
            <LaborLogging isMobile={true} />
          </div>
        );

      case 'balance':
        return (
          <div className="space-y-6">
            <BalanceDisplay isMobile={true} />
          </div>
        );

      case 'governance':
        return (
          <div className="space-y-6">
            <GovernanceSection />
          </div>
        );

      case 'marketplace':
        return (
          <div className="space-y-6">
            <MarketplaceSection />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={gestureRef as any} className={`min-h-screen bg-shell-cream ${className}`}>
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-deep-navy to-ocean-blue text-white sticky top-0 z-30 shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Coral8</h1>
            <WalletConnectionButton size="sm" />
          </div>
          
          {/* Section Navigation Pills */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as MobileDashboardSection)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-seafoam text-deep-navy' 
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Section Content */}
      <main className="p-4 pb-24">
        {/* Section Indicator */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-deep-navy">
            {sections.find(s => s.id === activeSection)?.title}
          </h2>
          
          {/* Swipe Indicators */}
          <div className="flex items-center space-x-2 text-moon-gray">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs">Swipe</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="animate-in slide-in-from-right-5 duration-300">
          {renderSectionContent()}
        </div>
      </main>

      {/* Progress Indicator */}
      <div className="fixed bottom-20 left-4 right-4 z-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-full p-2">
          <div className="flex space-x-1">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  activeSection === section.id ? 'bg-ocean-blue' : 'bg-moon-gray/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}