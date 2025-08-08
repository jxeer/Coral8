/**
 * Coral8 Main Application Component
 * 
 * This is the root component for the Coral8 off-chain interface, serving as the
 * web application for the Cowrie Coin blockchain ecosystem. Coral8 enables users
 * to log culturally rooted labor, earn COW tokens, participate in governance,
 * and engage in community marketplace activities.
 * 
 * Core Features:
 * - Cultural labor tracking with multiplier-based token rewards
 * - Three-tier COW token system (COW1, COW2, COW3)
 * - Community governance voting and proposal system
 * - Marketplace for goods and services using COW tokens
 * - Mobile-first responsive design with oceanic Yemaya theming
 * 
 * Architecture:
 * - React 18 with TypeScript for type safety
 * - Wouter for lightweight client-side routing
 * - React Query for server state management and caching
 * - Replit OAuth authentication with wallet connection support
 * - Context providers for global state management
 * - shadcn/ui component library with Tailwind CSS styling
 * 
 * Authentication Flow:
 * - Unauthenticated: Landing page with login options
 * - Authenticated: Dashboard with full feature access
 * - Demo mode: Full feature preview without authentication
 * 
 * Design System:
 * - Oceanic color palette (deep navy, ocean blue, seafoam, pearl white)
 * - Mobile-first responsive breakpoints
 * - Accessible UI components with proper ARIA labels
 * - Smooth animations and transitions for enhanced UX
 */

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./contexts/app-context";
import { WalletProvider } from "./contexts/wallet-context";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/sidebar";

// Page imports - organized by authentication requirement
import Dashboard from "./pages/dashboard";
import DemoDatashboard from "./pages/demo-dashboard";
import Contracts from "./pages/contracts";
import Invoices from "./pages/invoices";
import Clients from "./pages/clients";
import Tasks from "./pages/tasks";
import Login from "./pages/auth-login";
import { Landing } from "./pages/landing";
import NotFound from "@/pages/not-found";
import Web3 from "./pages/web3";

/**
 * Main Router Component
 * 
 * Manages application routing based on authentication state:
 * - Public routes: Landing page, login, demo dashboard
 * - Protected routes: Dashboard, contracts, invoices, clients, tasks
 * - Conditional rendering based on user authentication status
 * - Loading states during authentication checks
 * - Automatic redirection after login/logout
 * 
 * Route Structure:
 * - "/" - Landing (public) or Dashboard (authenticated)
 * - "/demo" - Demo dashboard (always accessible)
 * - "/login" - Authentication page
 * - Protected routes require valid user session
 */
function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-pearl-white">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes - shown when user is not authenticated */}
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/demo" component={DemoDatashboard} />
        </>
      ) : (
        /* Protected routes - shown when user is authenticated */
        <>
          <AppProvider>
            <div className="min-h-screen bg-deep-navy">
              {/* Main navigation sidebar */}
              <Sidebar />
              {/* Main content area with left margin for sidebar */}
              <main className="lg:ml-64 min-h-screen">
                <Route path="/" component={Dashboard} />
                <Route path="/contracts" component={Contracts} />
                <Route path="/invoices" component={Invoices} />
                <Route path="/clients" component={Clients} />
                <Route path="/tasks" component={Tasks} />
                <Route path="/web3" component={Web3} />
              </main>
            </div>
          </AppProvider>
        </>
      )}
      {/* Fallback 404 route */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Root App Component
 * Sets up global providers for React Query, tooltips, and notifications
 * Wraps the main router with necessary context providers
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <Router />
          <Toaster />
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
