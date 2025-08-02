/**
 * Demo Mobile Dashboard Component
 * Self-contained mobile dashboard with all context and mock data included
 * Showcases mobile features without dependencies on external contexts
 */

import { useState, createContext, useContext } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { useTouchGestures } from "../hooks/use-touch-gestures";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  ArrowRight, 
  Plus, 
  TrendingUp, 
  Users, 
  Zap,
  ChevronLeft,
  ChevronRight,
  Home,
  FileText,
  DollarSign,
  ShoppingBag
} from "lucide-react";
import { Link, useLocation } from "wouter";

// Mock context for this demo component
const mockData = {
  user: {
    firstName: "Demo",
    lastName: "User",
    walletAddress: "0x742d35Cc6634C0532925a3b8D5c01f5ca7Dc5bF8",
  },
  tokenBalance: {
    cow1Balance: "1,247.50",
    cow2Balance: "892.75",
    cow3Balance: "156.25",
  },
  userStats: {
    focusScore: 87,
    monthlyEarnings: "2,847.50",
    attentionViews: 5420,
  },
};

const DemoContext = createContext(mockData);

type MobileDashboardSection = 'overview' | 'labor' | 'balance' | 'governance' | 'marketplace';

export function DemoMobileDashboard() {
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

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-ocean-blue to-ocean-teal text-white">
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
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setActiveSection('labor')}
                className="h-20 bg-seafoam hover:bg-seafoam/90 text-deep-navy"
              >
                <div className="text-center">
                  <Plus className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-sm font-medium">Log Labor</div>
                </div>
              </Button>
              
              <Button
                onClick={() => setActiveSection('balance')}
                variant="outline"
                className="h-20 border-seafoam text-seafoam hover:bg-seafoam/10"
              >
                <div className="text-center">
                  <Zap className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-sm font-medium">View Tokens</div>
                </div>
              </Button>
            </div>

            {/* Demo Features */}
            <Card>
              <CardHeader>
                <CardTitle>Demo Features Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">Touch Gestures</Badge>
                  <Badge variant="secondary">Offline Support</Badge>
                  <Badge variant="secondary">PWA Installation</Badge>
                  <Badge variant="secondary">Push Notifications</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'labor':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Log Cultural Labor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">Care Work</Button>
                    <Button variant="outline" size="sm">Teaching</Button>
                    <Button variant="outline" size="sm">Art Creation</Button>
                    <Button variant="outline" size="sm">Community</Button>
                  </div>
                  <Button className="w-full bg-ocean-teal text-white">
                    Start Logging
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'balance':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>COW Token Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-ocean-blue">1,247</div>
                    <div className="text-sm text-moon-gray">COW1</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-ocean-teal">892</div>
                    <div className="text-sm text-moon-gray">COW2</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-seafoam">156</div>
                    <div className="text-sm text-moon-gray">COW3</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'governance':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Voting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-moon-gray mb-4">Participate in community governance</p>
                <Button className="w-full bg-ocean-blue text-white">
                  View Proposals
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'marketplace':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-moon-gray mb-4">Trade goods and services with COW tokens</p>
                <Button className="w-full bg-seafoam text-deep-navy">
                  Browse Items
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DemoContext.Provider value={mockData}>
      <div ref={gestureRef as any} className="min-h-screen bg-shell-cream">
        {/* Mobile Header */}
        <header className="bg-gradient-to-r from-deep-navy to-ocean-blue text-white sticky top-0 z-30 shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Coral8 Demo</h1>
              <Badge variant="secondary" className="bg-amber-500 text-black">
                DEMO
              </Badge>
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
    </DemoContext.Provider>
  );
}

// Mobile Navigation for Demo
export function DemoMobileNavigation() {
  const [location] = useLocation();

  const navigation = [
    { name: 'Dashboard', icon: Home, href: '/demo', id: 'dashboard' },
    { name: 'Contracts', icon: FileText, href: '/demo', id: 'contracts' },
    { name: 'Invoices', icon: DollarSign, href: '/demo', id: 'invoices' },
    { name: 'Clients', icon: Users, href: '/demo', id: 'clients' },
    { name: 'Tasks', icon: ShoppingBag, href: '/demo', id: 'tasks' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-deep-navy to-ocean-blue border-t border-seafoam/30 z-50 backdrop-blur-sm">
      <div className="flex justify-around py-3 px-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'dashboard'; // Always show dashboard as active in demo
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-seafoam bg-seafoam/10 scale-105' 
                  : 'text-pearl-white/70 hover:text-pearl-white hover:bg-pearl-white/5'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}