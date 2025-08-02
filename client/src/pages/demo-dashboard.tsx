/**
 * Demo Dashboard Page
 * Temporary demo mode to preview mobile features without OAuth
 * Showcases all mobile optimizations, PWA features, and Coral8 functionality
 * Uses mock data to demonstrate the complete user experience
 */

import { useIsMobile } from "../hooks/use-mobile";
import { MobileDashboard } from "../components/mobile-dashboard";
import { MobileNavigation } from "../components/mobile-navigation";
import { PWAInstallBanner } from "../components/pwa-install-banner";
import { Sidebar } from "../components/sidebar";
import { DashboardCards } from "../components/dashboard-cards";
import { LaborLogging } from "../components/labor-logging";
import { BalanceDisplay } from "../components/balance-display";
import { GovernanceSection } from "../components/governance-section";
import { MarketplaceSection } from "../components/marketplace-section";
import { MobileFeaturesShowcase } from "../components/mobile-features-showcase";
import { WalletConnectionButton } from "../components/wallet-connection-button";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Mock app context provider for demo
const mockAppContext = {
  walletAddress: "0x742d35Cc6634C0532925a3b8D5c01f5ca7Dc5bF8",
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
};

export default function DemoDatashboard() {
  const isMobile = useIsMobile();

  // Mock context provider
  const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    return (
      <div data-demo-context={JSON.stringify(mockAppContext)}>
        {children}
      </div>
    );
  };

  if (isMobile) {
    return (
      <AppContextProvider>
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
            <MobileDashboard />
            <MobileNavigation />
            <PWAInstallBanner />
          </div>
        </div>
      </AppContextProvider>
    );
  }

  return (
    <AppContextProvider>
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
          <Sidebar />
          <div className="flex-1 lg:ml-64 p-4 lg:p-8 pb-8">
            <PWAInstallBanner />
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-deep-navy mb-2">Welcome to Coral8</h2>
                  <p className="text-moon-gray">Experience the complete mobile-optimized interface</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <WalletConnectionButton />
                </div>
              </div>
            </div>

            {/* Mobile Features Showcase */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-deep-navy mb-4">Advanced Mobile Features</h3>
              <MobileFeaturesShowcase />
            </div>

            {/* Dashboard Cards Grid */}
            <div className="mb-8">
              <DashboardCards />
            </div>

            {/* Mobile Priority Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-deep-navy mb-4">Token Balances</h3>
                <BalanceDisplay />
              </div>
              <div>
                <h3 className="text-xl font-bold text-deep-navy mb-4">Log Labor</h3>
                <LaborLogging />
              </div>
            </div>

            {/* Governance Section */}
            <div className="mb-8">
              <GovernanceSection />
            </div>

            {/* Marketplace Section */}
            <div className="mb-8">
              <MarketplaceSection />
            </div>
          </div>
        </div>
      </div>
    </AppContextProvider>
  );
}