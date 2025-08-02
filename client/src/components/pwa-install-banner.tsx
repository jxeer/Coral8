/**
 * PWA Install Banner Component
 * Prompts users to install Coral8 as a Progressive Web App
 * Features oceanic design with dismissible banner and install button
 * Optimizes mobile experience with native app-like functionality
 */

import { useInstallBanner } from "../hooks/use-pwa";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, Download, Smartphone } from "lucide-react";

export function PWAInstallBanner() {
  const { showBanner, dismiss, install } = useInstallBanner();

  if (!showBanner) return null;

  return (
    <Card className="fixed bottom-24 left-4 right-4 z-50 bg-gradient-to-r from-ocean-blue to-ocean-teal text-white border-none shadow-xl lg:bottom-4 lg:left-auto lg:right-4 lg:w-96">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-seafoam/20 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-seafoam" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Install Coral8</h3>
              <p className="text-xs opacity-90">Get the full app experience</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={dismiss}
            className="text-white hover:bg-white/10 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs opacity-90 mb-4 leading-relaxed">
          Install Coral8 for faster access, offline support, and a native app experience. 
          Track your cultural labor and earn COW tokens seamlessly.
        </p>

        <div className="flex space-x-2">
          <Button
            onClick={install}
            size="sm"
            className="flex-1 bg-seafoam hover:bg-seafoam/90 text-deep-navy font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
          <Button
            onClick={dismiss}
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Not Now
          </Button>
        </div>
      </div>
    </Card>
  );
}