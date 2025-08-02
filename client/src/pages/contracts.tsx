import { Sidebar } from "../components/sidebar";
import { MobileNavigation } from "../components/mobile-navigation";
import { Card } from "../components/ui/card";
import { FileText, Calendar, DollarSign } from "lucide-react";

export default function Contracts() {
  return (
    <div className="flex min-h-screen bg-shell-cream">
      <Sidebar />
      <MobileNavigation />

      <div className="flex-1 lg:ml-64 p-4 lg:p-8 pb-20 lg:pb-8">
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-deep-navy mb-2">Contracts</h2>
          <p className="text-moon-gray">Manage your labor contracts and agreements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample contracts */}
          {[
            {
              title: "Cultural Preservation Project",
              type: "Long-term",
              status: "Active",
              value: "500 COW",
              duration: "3 months"
            },
            {
              title: "Community Art Workshop",
              type: "Event-based",
              status: "Pending",
              value: "150 COW", 
              duration: "2 weeks"
            },
            {
              title: "Elder Care Services",
              type: "Recurring",
              status: "Active",
              value: "300 COW/month",
              duration: "Ongoing"
            }
          ].map((contract, index) => (
            <Card key={index} className="p-6 border border-ocean-teal/20 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <FileText className="w-8 h-8 text-ocean-blue" />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  contract.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {contract.status}
                </span>
              </div>
              <h3 className="font-semibold text-deep-navy mb-2">{contract.title}</h3>
              <p className="text-sm text-moon-gray mb-4">{contract.type}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-ocean-blue" />
                  <span className="text-ocean-blue font-medium">{contract.value}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-moon-gray" />
                  <span className="text-moon-gray">{contract.duration}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}