/**
 * Marketplace Section Component
 * Community-driven marketplace for trading goods and services with COW tokens
 * Features culturally-significant items like handcrafted artwork and traditional goods
 * Enables economic exchange within the Coral8 ecosystem using token payments
 * Supports local artisans and community creators
 */

import { useQuery } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MarketplaceItem } from "@shared/schema";

export function MarketplaceSection() {
  const { data: items, isLoading } = useQuery<MarketplaceItem[]>({
    queryKey: ["/api/marketplace"],
  });

  const handlePurchase = (itemId: string, price: string) => {
    // TODO: Implement marketplace purchase logic with COW tokens
    alert(`Purchase functionality will integrate with COW token payments. Item ID: ${itemId}, Price: ${price} COW`);
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-deep-navy">Community Marketplace</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-moon-gray/20"></div>
              <div className="p-4">
                <div className="h-4 bg-moon-gray/20 rounded mb-2"></div>
                <div className="h-12 bg-moon-gray/20 rounded mb-3"></div>
                <div className="h-8 bg-moon-gray/20 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Add additional sample items to match the design
  const sampleItems: MarketplaceItem[] = [
    {
      id: "item-3",
      sellerId: "default-user",
      title: "Driftwood Sculpture",
      description: "Unique sculpture carved from ocean-weathered driftwood, embodying natural beauty.",
      price: "85",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "item-4",
      sellerId: "default-user",
      title: "Sea Glass Jewelry Set",
      description: "Elegant jewelry crafted from naturally tumbled sea glass and collected shells.",
      price: "65",
      imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isActive: true,
      createdAt: new Date(),
    }
  ];

  const allItems = [...(items || []), ...sampleItems];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-deep-navy">Community Marketplace</h3>
        <Button variant="ghost" className="text-ocean-blue hover:text-ocean-teal">
          Browse All
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allItems.map((item) => (
          <Card 
            key={item.id} 
            className="overflow-hidden border border-ocean-teal/20 hover:shadow-lg transition-all transform hover:scale-[1.02]"
          >
            <img 
              src={item.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-deep-navy mb-2">{item.title}</h4>
              <p className="text-sm text-moon-gray mb-3 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-ocean-blue">{item.price} COW</span>
                <Button
                  onClick={() => handlePurchase(item.id, item.price)}
                  className="bg-ocean-blue text-pearl-white hover:bg-ocean-teal transition-colors"
                  size="sm"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
