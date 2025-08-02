import { Sidebar } from "../components/sidebar";
import { MobileNavigation } from "../components/mobile-navigation";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Receipt, Calendar, CheckCircle, Clock } from "lucide-react";

export default function Invoices() {
  return (
    <div className="flex min-h-screen bg-shell-cream">
      <Sidebar />
      <MobileNavigation />

      <div className="flex-1 lg:ml-64 p-4 lg:p-8 pb-20 lg:pb-8">
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-deep-navy mb-2">Invoices</h2>
          <p className="text-moon-gray">Track your labor contributions and COW earnings</p>
        </div>

        <div className="space-y-4">
          {/* Sample invoices */}
          {[
            {
              id: "INV-001",
              description: "Cultural Preservation Workshop",
              date: "2025-01-31",
              hours: 8,
              cowEarned: 168,
              status: "Paid"
            },
            {
              id: "INV-002", 
              description: "Community Care Services",
              date: "2025-01-30",
              hours: 6,
              cowEarned: 132,
              status: "Pending"
            },
            {
              id: "INV-003",
              description: "Traditional Craft Teaching",
              date: "2025-01-29", 
              hours: 4,
              cowEarned: 84,
              status: "Paid"
            }
          ].map((invoice) => (
            <Card key={invoice.id} className="p-6 border border-ocean-teal/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-xl flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-pearl-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-deep-navy">{invoice.description}</h3>
                    <div className="flex items-center space-x-4 text-sm text-moon-gray mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{invoice.date}</span>
                      </span>
                      <span>{invoice.hours} hours</span>
                      <span className="text-ocean-blue font-medium">{invoice.cowEarned} COW</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge 
                    className={invoice.status === 'Paid' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-yellow-100 text-yellow-600'
                    }
                  >
                    {invoice.status === 'Paid' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {invoice.status}
                  </Badge>
                  <span className="text-sm font-mono text-moon-gray">{invoice.id}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}