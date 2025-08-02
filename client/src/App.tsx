import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./contexts/app-context";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/sidebar";
import Dashboard from "./pages/dashboard";
import Contracts from "./pages/contracts";
import Invoices from "./pages/invoices";
import Clients from "./pages/clients";
import Tasks from "./pages/tasks";
import Login from "./pages/auth-login";
import { Landing } from "./pages/landing";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-pearl-white">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
        </>
      ) : (
        <>
          <AppProvider>
            <div className="min-h-screen bg-deep-navy">
              <Sidebar />
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
      <Route component={NotFound} />
    </Switch>
  );
}

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
