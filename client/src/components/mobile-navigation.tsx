import { useState } from "react";
import { 
  Home, FileText, DollarSign, Users, ShoppingBag
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', icon: Home, id: 'dashboard' },
  { name: 'Labor', icon: FileText, id: 'labor' },
  { name: 'Balance', icon: DollarSign, id: 'balance' },
  { name: 'Gov', icon: Users, id: 'governance' },
  { name: 'Market', icon: ShoppingBag, id: 'marketplace' },
];

export function MobileNavigation() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-pearl-white border-t border-ocean-teal/20 z-50">
      <div className="flex justify-around py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 transition-colors ${
                isActive ? 'text-ocean-blue' : 'text-moon-gray'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
