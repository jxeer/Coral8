/**
 * 404 Not Found Page Component
 * Handles routing errors and missing pages with oceanic theme
 * Provides user-friendly error messaging with consistent design language
 * Maintains Coral8 branding even for error states
 */

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-deep-navy via-ocean-blue to-seafoam">
      <Card className="w-full max-w-md mx-4 bg-pearl-white/95 backdrop-blur-sm border-seafoam/20">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-ocean-blue/20 rounded-full flex items-center justify-center">
              <Waves className="h-8 w-8 text-ocean-teal" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-deep-navy mb-4">Page Not Found</h1>
          
          <p className="text-moon-gray mb-6">
            The page you're looking for has drifted away like ocean currents. 
            Let's get you back to familiar waters.
          </p>
          
          <Button asChild className="bg-ocean-teal hover:bg-ocean-blue text-white">
            <Link href="/">
              Return to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
