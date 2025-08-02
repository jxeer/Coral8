/**
 * Coral8 Demo Dashboard - Complete Feature Preview
 * 
 * This comprehensive demo page showcases the full Coral8 application experience
 * without requiring authentication, allowing visitors to explore all features
 * and understand the value proposition before signing up.
 * 
 * Purpose & Goals:
 * - Demonstrate complete Coral8 functionality and mobile experience
 * - Showcase cultural labor tracking with real-time token calculations
 * - Preview three-tier COW token system and governance features
 * - Display marketplace capabilities and community interactions
 * - Provide realistic data and interactions for informed decision-making
 * 
 * Feature Demonstrations:
 * - Labor Logging: Multiple work types with cultural multipliers
 * - Token Economics: COW1/COW2/COW3 balance management and transfers
 * - Governance: Community proposals with Yes/No voting options
 * - Marketplace: Cultural goods browsing and selling interface
 * - Analytics: User stats including focus score, earnings, and community metrics
 * - Mobile UX: Touch-friendly interactions and responsive design
 * 
 * Technical Implementation:
 * - React Context for demo state management
 * - Mock data that matches production schema
 * - Interactive buttons with loading states and visual feedback
 * - Toast notifications for user action confirmation
 * - Tab navigation between major feature sections
 * - Realistic calculations using actual labor index formulas
 * 
 * Design System:
 * - Oceanic Yemaya-inspired theming (deep navy, ocean blue, seafoam, pearl white)
 * - Mobile-first responsive breakpoints and touch targets
 * - Smooth animations and transitions for enhanced user experience
 * - Accessible UI components with proper ARIA labels and contrast
 * 
 * User Journey:
 * 1. Landing page explanation and "Preview Demo" call-to-action
 * 2. Immediate access to full dashboard without signup friction
 * 3. Interactive exploration of all major features
 * 4. Educational explanations and realistic data
 * 5. Clear path to actual authentication and signup
 */

import { useIsMobile } from "../hooks/use-mobile";
import { DemoMobileDashboard, DemoMobileNavigation } from "../components/demo-mobile-dashboard";
import { PWAInstallBanner } from "../components/pwa-install-banner";
import { MobileFeaturesShowcase } from "../components/mobile-features-showcase";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Create mock context provider that matches AppContext interface
import React, { createContext, useContext } from 'react';

interface DemoAppContextType {
  user: any;
  tokenBalance: any;
  userStats: any;
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  refreshData: () => Promise<void>;
}

const mockContextValue: DemoAppContextType = {
  user: {
    id: "demo-user",
    email: "demo@coral8.com",
    firstName: "Demo",
    lastName: "User",
    walletAddress: "0x742d35Cc6634C0532925a3b8D5c01f5ca7Dc5bF8",
  },
  tokenBalance: {
    cow1Balance: "1,247.50",
    cow2Balance: "892.75", 
    cow3Balance: "156.25",
    lastActive: new Date().toISOString(),
  },
  userStats: {
    focusScore: 87,
    tribeMembers: 23,
    emotionScore: "7.8",
    monthlyEarnings: "2,847.50",
    attentionViews: 5420,
    totalProjects: 12,
    completionRate: 94,
  },
  walletAddress: "0x742d35Cc6634C0532925a3b8D5c01f5ca7Dc5bF8",
  setWalletAddress: () => {},
  refreshData: async () => {},
};

const DemoAppContext = createContext<DemoAppContextType>(mockContextValue);

// Mock the useAppContext hook
const useDemoAppContext = () => useContext(DemoAppContext);

// Override the useAppContext import for this component
const useAppContext = useDemoAppContext;

export default function DemoDatashboard() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="relative">
        {/* Demo Mode Indicator */}
        <div className="fixed top-0 left-0 right-0 bg-amber-500 text-black text-center py-2 text-sm font-medium z-50">
          <div className="flex items-center justify-center space-x-4">
            <span>🚀 Demo Mode - Preview Mobile Features</span>
            <Link href="/">
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                <ArrowLeft className="w-3 h-3 mr-1" />
                Exit
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="pt-10">
          <DemoMobileDashboard />
          <DemoMobileNavigation />
          <PWAInstallBanner />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Demo Mode Indicator */}
      <div className="fixed top-0 left-0 right-0 bg-amber-500 text-black text-center py-3 text-sm font-medium z-50">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-amber-600 text-white">DEMO</Badge>
            <span>Preview Coral8 Features - OAuth configuration pending</span>
          </div>
          <Link href="/">
            <Button size="sm" variant="ghost" className="text-black hover:bg-amber-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Demo
            </Button>
          </Link>
        </div>
      </div>

      <div className="pt-16 flex min-h-screen bg-shell-cream">
        <div className="flex-1 p-4 lg:p-8 pb-8">
          <PWAInstallBanner />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-deep-navy mb-2">Welcome to Coral8 Demo</h2>
                <p className="text-moon-gray">Experience mobile-optimized features and advanced capabilities</p>
              </div>
            </div>
          </div>

          {/* Mobile Features Showcase */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-deep-navy mb-4">Advanced Mobile Features</h3>
            <MobileFeaturesShowcase />
          </div>
        </div>
      </div>
    </div>
  );
}