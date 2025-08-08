/**
 * Sidebar Navigation Component
 * Main navigation interface for authenticated users in the Coral8 application
 * Features oceanic Yemaya-inspired design with wave animation branding
 * Provides access to dashboard, contracts, invoices, clients, and tasks
 * Includes user profile management and wallet connection status
 */

import { Link, useLocation } from "wouter";
import { WaveAnimation } from "./wave-animation";
import { WalletConnectionButton } from "./wallet-connection-button";
import { useAppContext } from "../contexts/app-context";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { 
  Home, FileText, Receipt, Users, CheckSquare, Wallet, LogOut, User, Settings
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Contracts', href: '/contracts', icon: FileText },
  { name: 'Invoices', href: '/invoices', icon: Receipt },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Web3', href: '/web3', icon: Wallet },
];

export function Sidebar() {
  const { walletAddress } = useAppContext();
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();

  return (
    <div className="hidden lg:block w-64 bg-deep-navy text-pearl-white min-h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <WaveAnimation />
          <div>
            <h1 className="text-xl font-bold">Coral8</h1>
            <p className="text-sm text-seafoam">Cowrie Ecosystem</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-ocean-blue text-pearl-white'
                    : 'text-moon-gray hover:bg-ocean-blue/20 hover:text-pearl-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* User Profile & Actions */}
      <div className="absolute bottom-6 left-6 right-6 space-y-4">
        {/* User Profile */}
        <div className="flex items-center space-x-3 p-3 bg-ocean-blue/20 rounded-xl">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profileImage || ''} />
            <AvatarFallback className="bg-seafoam text-deep-navy">
              {user?.firstName?.[0] || user?.username?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-pearl-white truncate">
              {user?.firstName || user?.username || 'User'}
            </p>
            <p className="text-xs text-moon-gray truncate">
              {user?.email || (user?.walletAddress && `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`)}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-moon-gray hover:text-pearl-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Wallet Connection */}
        {!user?.walletAddress && (
          <WalletConnectionButton 
            variant="outline" 
            className="w-full text-sm"
            onSuccess={(token, updatedUser) => {
              // The auth context will be updated automatically
              console.log('Wallet connected successfully');
            }}
          />
        )}
      </div>
    </div>
  );
}
