/**
 * Dashboard Component
 * Main authenticated user interface for Coral8 application
 * Provides access to labor logging, token balances, governance, and marketplace
 * Features responsive design with mobile-first layout and sidebar navigation
 */

import { useIsMobile } from "../hooks/use-mobile";
import { Sidebar } from "../components/sidebar";
import { MobileNavigation } from "../components/mobile-navigation";
import { MobileDashboard } from "../components/mobile-dashboard";
import { PWAInstallBanner } from "../components/pwa-install-banner";
import { WalletConnectionButton } from "../components/wallet-connection-button";
import { DashboardCards } from "../components/dashboard-cards";
import { LaborLogging } from "../components/labor-logging";
import { BalanceDisplay } from "../components/balance-display";
import { GovernanceSection } from "../components/governance-section";
import { MarketplaceSection } from "../components/marketplace-section";
import { useAppContext } from "../contexts/app-context";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const { walletAddress } = useAppContext();

  // Use mobile-optimized dashboard for mobile devices
  if (isMobile) {
    return (
      <>
        <MobileDashboard />
        <MobileNavigation />
        <PWAInstallBanner />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-shell-cream">
      {/* Sidebar for desktop */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-4 lg:p-8 pb-8">
        <PWAInstallBanner />
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-deep-navy mb-2">Welcome back</h2>
              <p className="text-moon-gray">Manage your labor contributions and earn COW tokens</p>
            </div>
            {/* Mobile Wallet Connection */}
            {isMobile && (
              <div className="mt-4 sm:mt-0">
                <WalletConnectionButton />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Priority Sections */}
        {isMobile && (
          <>
            {/* COW Token Balances */}
            <div className="mb-8">
              <BalanceDisplay isMobile={true} />
            </div>

            {/* Labor Logging */}
            <div className="mb-8">
              <LaborLogging isMobile={true} />
            </div>
          </>
        )}

        {/* Dashboard Cards Grid */}
        <div className="mb-8">
          <DashboardCards />
        </div>

        {/* Desktop Labor Logging (included in grid on desktop) */}
        {!isMobile && (
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LaborLogging />
          </div>
        )}

        {/* Desktop Balance Section */}
        {!isMobile && (
          <div className="mb-8">
            <BalanceDisplay />
          </div>
        )}

        {/* Governance Section */}
        <GovernanceSection />

        {/* Community Marketplace */}
        <MarketplaceSection />
      </div>
    </div>
  );
}
