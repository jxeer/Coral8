/**
 * PWA Installation Banner Component
 * Provides native app installation prompts for mobile users
 * Integrates with service worker and manifest for seamless PWA experience
 * Essential for mobile-first Coral8 engagement
 */

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallBanner() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const wasDismissed = localStorage.getItem('pwa_install_dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show banner after a delay if conditions are met
    const timer = setTimeout(() => {
      if (!isInstalled && !dismissed && !installPrompt) {
        setShowBanner(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setShowBanner(false);
        setInstallPrompt(null);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa_install_dismissed', 'true');
  };

  const handleManualInstall = () => {
    // Show instructions for manual installation
    alert(
      'To install Coral8 as an app:\n\n' +
      'Chrome: Menu → "Install Coral8..."\n' +
      'Safari: Share → "Add to Home Screen"\n' +
      'Firefox: Menu → "Install"\n\n' +
      'This will add Coral8 to your home screen for quick access!'
    );
  };

  if (isInstalled || !showBanner || dismissed) {
    return null;
  }

  return (
    <Card className="mb-6 border-ocean-teal/20 bg-gradient-to-r from-ocean-blue/5 to-ocean-teal/5">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-deep-navy">Install Coral8 App</h3>
              <Badge variant="secondary" className="bg-seafoam text-deep-navy text-xs">
                PWA
              </Badge>
            </div>
            
            <p className="text-moon-gray text-sm mb-4">
              Get the full mobile experience with offline support, push notifications, and native app feel.
            </p>
            
            <div className="flex flex-wrap gap-2">
              {installPrompt ? (
                <Button
                  onClick={handleInstall}
                  size="sm"
                  className="bg-ocean-teal hover:bg-ocean-blue text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install Now
                </Button>
              ) : (
                <Button
                  onClick={handleManualInstall}
                  size="sm"
                  variant="outline"
                  className="border-ocean-teal text-ocean-teal hover:bg-ocean-teal/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  How to Install
                </Button>
              )}
              
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="text-moon-gray hover:text-deep-navy"
              >
                Maybe Later
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleDismiss}
            size="sm"
            variant="ghost"
            className="flex-shrink-0 text-moon-gray hover:text-deep-navy p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * PWA Status Indicator Component
 * Shows current PWA installation status
 */
export function PWAStatusIndicator() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isInstalled) return null;

  return (
    <Badge 
      variant="secondary" 
      className={`fixed top-4 right-4 z-50 ${
        isOnline ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
      }`}
    >
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-amber-500'
        }`} />
        <span className="text-xs">
          {isOnline ? 'PWA Online' : 'PWA Offline'}
        </span>
      </div>
    </Badge>
  );
}