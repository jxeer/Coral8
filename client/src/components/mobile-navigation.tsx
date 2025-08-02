/**
 * Mobile Navigation Component
 * Bottom navigation bar for mobile devices with tab-based interface
 * Features oceanic design with smooth transitions and active state indicators
 * Provides quick access to core dashboard sections on mobile devices
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, FileText, DollarSign, Users, ShoppingBag
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', icon: Home, href: '/', id: 'dashboard' },
  { name: 'Contracts', icon: FileText, href: '/contracts', id: 'contracts' },
  { name: 'Invoices', icon: DollarSign, href: '/invoices', id: 'invoices' },
  { name: 'Clients', icon: Users, href: '/clients', id: 'clients' },
  { name: 'Tasks', icon: ShoppingBag, href: '/tasks', id: 'tasks' },
];

export function MobileNavigation() {
  const [location] = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-deep-navy to-ocean-blue border-t border-seafoam/30 z-50 backdrop-blur-sm">
      <div className="flex justify-around py-3 px-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
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
