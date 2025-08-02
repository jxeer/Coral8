/**
 * Coral8 Demo Mobile Dashboard - Complete Interactive Preview
 * 
 * This comprehensive demo dashboard showcases the full Coral8 application experience
 * in a mobile-first interface, allowing visitors to explore all features without
 * requiring authentication or setup. Self-contained with all mock data and context.
 * 
 * Purpose & User Journey:
 * 1. Immediate engagement: No signup friction for first-time visitors
 * 2. Complete exploration: All major features accessible and interactive
 * 3. Realistic experience: Mock data that reflects actual application usage
 * 4. Educational: Clear explanations of cultural labor and token economics
 * 5. Conversion: Smooth path to actual authentication after demo
 * 
 * Feature Demonstrations:
 * - Cultural Labor Logging: Multiple work types with multiplier-based rewards
 * - Token Economics: Three-tier COW system (liquid, staked, governance)
 * - Community Governance: Democratic proposal voting with transparent results
 * - Cultural Marketplace: Goods and services trading with COW tokens
 * - User Analytics: Comprehensive stats and community engagement metrics
 * - Mobile Interactions: Touch gestures, swipe navigation, haptic feedback
 * 
 * Technical Implementation:
 * - Self-contained context and state management
 * - Mock data matching production schema structures
 * - Interactive buttons with loading states and visual feedback
 * - DOM-based toast notifications for mobile optimization
 * - Tab-based navigation with smooth transitions
 * - Responsive design for various mobile screen sizes
 * 
 * Design System:
 * - Oceanic Yemaya-inspired color palette (deep navy, ocean blue, seafoam, pearl white)
 * - Mobile-first touch targets (minimum 44px for accessibility)
 * - Consistent spacing using 8px grid system
 * - High contrast text for readability in various lighting
 * - Smooth animations and micro-interactions for polished feel
 * 
 * Cultural Focus:
 * - Labor types reflect real cultural work categories
 * - Token rewards demonstrate value placed on ancestral wisdom
 * - Governance proposals address actual community needs
 * - Marketplace items showcase cultural goods and services
 * - Analytics emphasize community connection and contribution
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
  const [isLogging, setIsLogging] = useState(false);
  const [selectedLaborType, setSelectedLaborType] = useState<string>('');
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
                    {['Care Work', 'Teaching', 'Art Creation', 'Community'].map((type) => (
                      <Button
                        key={type}
                        variant={selectedLaborType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedLaborType(type)}
                        className={selectedLaborType === type ? "bg-ocean-teal text-white" : ""}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                  
                  {selectedLaborType && (
                    <div className="bg-seafoam/10 p-4 rounded-lg">
                      <p className="text-sm text-deep-navy mb-2">
                        Selected: <strong>{selectedLaborType}</strong>
                      </p>
                      <p className="text-xs text-moon-gray">
                        Multiplier: {selectedLaborType === 'Care Work' ? '2.0x' : selectedLaborType === 'Teaching' ? '1.9x' : selectedLaborType === 'Art Creation' ? '1.8x' : '1.7x'} COW tokens per hour
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-ocean-teal hover:bg-ocean-blue text-white disabled:opacity-50"
                    disabled={!selectedLaborType || isLogging}
                    onClick={() => {
                      if (selectedLaborType) {
                        setIsLogging(true);
                        setTimeout(() => {
                          setIsLogging(false);
                          alert(`✓ Demo: Started logging ${selectedLaborType}!\n\nIn a real app, this would:\n• Track your time automatically\n• Calculate COW tokens with ${selectedLaborType === 'Care Work' ? '2.0x' : selectedLaborType === 'Teaching' ? '1.9x' : '1.8x'} multiplier\n• Store progress in your labor history\n• Update your token balance in real-time`);
                        }, 2000);
                      }
                    }}
                  >
                    {isLogging ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Starting...</span>
                      </div>
                    ) : (
                      "Start Logging"
                    )}
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
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-ocean-blue/10 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-ocean-blue">1,247</div>
                      <div className="text-sm text-moon-gray">COW1</div>
                      <div className="text-xs text-moon-gray">Basic Labor</div>
                    </div>
                    <div className="bg-ocean-teal/10 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-ocean-teal">892</div>
                      <div className="text-sm text-moon-gray">COW2</div>
                      <div className="text-xs text-moon-gray">Cultural Work</div>
                    </div>
                    <div className="bg-seafoam/10 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-seafoam">156</div>
                      <div className="text-sm text-moon-gray">COW3</div>
                      <div className="text-xs text-moon-gray">Governance</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-ocean-blue/5 to-seafoam/5 p-4 rounded-lg">
                    <h4 className="font-semibold text-deep-navy mb-2">Total Value</h4>
                    <div className="text-2xl font-bold text-ocean-blue">$2,847.50</div>
                    <div className="text-sm text-moon-gray">Estimated USD value</div>
                  </div>
                  
                  <Button 
                    className="w-full bg-seafoam hover:bg-ocean-teal text-deep-navy"
                    onClick={() => {
                      // Create a more elegant notification
                      const notification = document.createElement('div');
                      notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-white border border-seafoam rounded-lg shadow-xl p-4 z-50 max-w-sm mx-4';
                      notification.innerHTML = `
                        <div class="flex items-center space-x-2 mb-2">
                          <div class="w-3 h-3 bg-seafoam rounded-full"></div>
                          <span class="font-semibold text-deep-navy">Token Transfer</span>
                        </div>
                        <p class="text-sm text-moon-gray">Demo feature: Send COW tokens to community members or exchange in marketplace</p>
                      `;
                      document.body.appendChild(notification);
                      setTimeout(() => {
                        notification.style.opacity = '0';
                        setTimeout(() => document.body.removeChild(notification), 300);
                      }, 3000);
                    }}
                  >
                    Transfer Tokens
                  </Button>
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
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-amber-800">Active Proposal</h4>
                      <Badge className="bg-amber-100 text-amber-800">Voting Open</Badge>
                    </div>
                    <p className="text-sm text-amber-700 mb-3">
                      "Should we increase care work multiplier to 2.2x?"
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          const notification = document.createElement('div');
                          notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-50 border border-green-200 rounded-lg shadow-xl p-4 z-50 max-w-sm mx-4';
                          notification.innerHTML = `
                            <div class="flex items-center space-x-2 mb-2">
                              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span class="font-semibold text-green-800">Vote Recorded: YES</span>
                            </div>
                            <p class="text-sm text-green-700">+5 COW3 governance tokens earned!</p>
                          `;
                          document.body.appendChild(notification);
                          setTimeout(() => {
                            notification.style.opacity = '0';
                            setTimeout(() => document.body.removeChild(notification), 300);
                          }, 3000);
                        }}
                      >
                        Vote Yes
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          const notification = document.createElement('div');
                          notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 rounded-lg shadow-xl p-4 z-50 max-w-sm mx-4';
                          notification.innerHTML = `
                            <div class="flex items-center space-x-2 mb-2">
                              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span class="font-semibold text-red-800">Vote Recorded: NO</span>
                            </div>
                            <p class="text-sm text-red-700">+5 COW3 governance tokens earned!</p>
                          `;
                          document.body.appendChild(notification);
                          setTimeout(() => {
                            notification.style.opacity = '0';
                            setTimeout(() => document.body.removeChild(notification), 300);
                          }, 3000);
                        }}
                      >
                        Vote No
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-ocean-blue hover:bg-deep-navy text-white"
                    onClick={() => alert('Demo: View all proposals! This would show the complete governance dashboard with voting history and proposal creation.')}
                  >
                    View All Proposals
                  </Button>
                </div>
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
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-moon-gray/20 p-3 rounded-lg">
                      <div className="w-full h-16 bg-gradient-to-br from-seafoam/20 to-ocean-teal/20 rounded mb-2 flex items-center justify-center">
                        <span className="text-xs text-moon-gray">Handmade Art</span>
                      </div>
                      <p className="text-sm font-medium text-deep-navy">Cultural Craft</p>
                      <p className="text-xs text-ocean-teal font-semibold">45 COW</p>
                    </div>
                    <div className="border border-moon-gray/20 p-3 rounded-lg">
                      <div className="w-full h-16 bg-gradient-to-br from-ocean-blue/20 to-deep-navy/20 rounded mb-2 flex items-center justify-center">
                        <span className="text-xs text-moon-gray">Care Service</span>
                      </div>
                      <p className="text-sm font-medium text-deep-navy">Elder Care</p>
                      <p className="text-xs text-ocean-teal font-semibold">120 COW</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-seafoam hover:bg-ocean-teal text-deep-navy"
                      onClick={() => alert('Demo: Browse marketplace! This would show all available items and services you can purchase with COW tokens.')}
                    >
                      Browse All
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-seafoam text-seafoam hover:bg-seafoam/10"
                      onClick={() => alert('Demo: Sell items! This would let you list your own goods or services for COW tokens.')}
                    >
                      Sell Item
                    </Button>
                  </div>
                </div>
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
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigation = [
    { 
      name: 'Dashboard', 
      icon: Home, 
      href: '/demo', 
      id: 'dashboard',
      action: () => alert('Demo: Dashboard navigation! This would take you to the main dashboard view.')
    },
    { 
      name: 'Contracts', 
      icon: FileText, 
      href: '/demo', 
      id: 'contracts',
      action: () => alert('Demo: Contracts page! This would show your labor contracts and agreements.')
    },
    { 
      name: 'Invoices', 
      icon: DollarSign, 
      href: '/demo', 
      id: 'invoices',
      action: () => alert('Demo: Invoices page! This would display your earnings and payment history.')
    },
    { 
      name: 'Clients', 
      icon: Users, 
      href: '/demo', 
      id: 'clients',
      action: () => alert('Demo: Clients page! This would show your community connections and collaboration partners.')
    },
    { 
      name: 'Tasks', 
      icon: ShoppingBag, 
      href: '/demo', 
      id: 'tasks',
      action: () => alert('Demo: Tasks page! This would display your active labor logging and marketplace activities.')
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-deep-navy to-ocean-blue border-t border-seafoam/30 z-50 backdrop-blur-sm">
      <div className="flex justify-around py-3 px-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.id);
                // Use a more elegant notification instead of alert
                const toast = document.createElement('div');
                toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-ocean-teal text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity';
                toast.innerHTML = `<strong>${item.name}</strong> - Demo feature preview`;
                document.body.appendChild(toast);
                setTimeout(() => {
                  toast.style.opacity = '0';
                  setTimeout(() => document.body.removeChild(toast), 300);
                }, 2000);
              }}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-seafoam bg-seafoam/10 scale-105' 
                  : 'text-pearl-white/70 hover:text-pearl-white hover:bg-pearl-white/5'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}