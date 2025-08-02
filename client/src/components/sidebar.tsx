import { Link, useLocation } from "wouter";
import { WaveAnimation } from "./wave-animation";
import { useAppContext } from "../contexts/app-context";
import { 
  Home, FileText, Receipt, Users, CheckSquare, Wallet
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Contracts', href: '/contracts', icon: FileText },
  { name: 'Invoices', href: '/invoices', icon: Receipt },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
];

export function Sidebar() {
  const { walletAddress } = useAppContext();
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
      
      {/* Wallet Address Section */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-ocean-blue/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Wallet className="w-4 h-4 text-seafoam" />
            <span className="text-xs text-seafoam">Wallet</span>
          </div>
          <p className="text-sm font-mono text-pearl-white truncate">
            {walletAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
