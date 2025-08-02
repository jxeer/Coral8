import { Sidebar } from "../components/sidebar";
import { MobileNavigation } from "../components/mobile-navigation";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Users, Mail, Phone, MapPin } from "lucide-react";

export default function Clients() {
  return (
    <div className="flex min-h-screen bg-shell-cream">
      <Sidebar />
      <MobileNavigation />

      <div className="flex-1 lg:ml-64 p-4 lg:p-8 pb-20 lg:pb-8">
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-deep-navy mb-2">Clients</h2>
          <p className="text-moon-gray">Manage your community connections and collaborations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample clients */}
          {[
            {
              name: "Ocean Keepers Collective",
              type: "Community Organization",
              contact: "keepers@ocean.org",
              location: "Pacific Coast",
              projects: 3,
              totalCOW: 450
            },
            {
              name: "Ancestral Arts Foundation",
              type: "Cultural Institution", 
              contact: "contact@ancestralarts.org",
              location: "Cultural District",
              projects: 2,
              totalCOW: 320
            },
            {
              name: "Elder Circle",
              type: "Care Community",
              contact: "circle@elders.com",
              location: "Community Center",
              projects: 5,
              totalCOW: 680
            }
          ].map((client, index) => (
            <Card key={index} className="p-6 border border-ocean-teal/20 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-pearl-white" />
                </div>
                <span className="text-xs text-ocean-blue bg-seafoam/20 px-2 py-1 rounded-full">
                  {client.projects} projects
                </span>
              </div>
              
              <h3 className="font-semibold text-deep-navy mb-2">{client.name}</h3>
              <p className="text-sm text-moon-gray mb-4">{client.type}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-moon-gray">
                  <Mail className="w-4 h-4" />
                  <span>{client.contact}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-moon-gray">
                  <MapPin className="w-4 h-4" />
                  <span>{client.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-ocean-teal/10">
                <span className="text-sm text-ocean-blue font-medium">
                  {client.totalCOW} COW earned
                </span>
                <Button size="sm" variant="outline" className="border-ocean-teal/30 text-ocean-blue hover:bg-ocean-blue/10">
                  Contact
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}