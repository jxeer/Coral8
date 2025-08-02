// Main Application Component
// Handles routing between authenticated and public views
// Integrates React Query for server state management and authentication context

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./contexts/app-context";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/sidebar";

// Page imports - organized by authentication requirement
import Dashboard from "./pages/dashboard";
import Contracts from "./pages/contracts";
import Invoices from "./pages/invoices";
import Clients from "./pages/clients";
import Tasks from "./pages/tasks";
import Login from "./pages/auth-login";
import { Landing } from "./pages/landing";
import NotFound from "@/pages/not-found";

/**
 * Main Router Component
 * Handles conditional rendering based on authentication state
 * Shows public pages (Landing, Login) for unauthenticated users
 * Shows protected dashboard with sidebar navigation for authenticated users
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
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
