/**
 * Mobile Features Showcase Component
 * Demonstrates advanced mobile capabilities including offline support, notifications, and camera
 * Interactive showcase for touch gestures, PWA installation, and mobile-optimized workflows
 * Highlights Coral8's mobile-first approach to cultural labor tracking
 */

import { useState } from "react";
import { useOffline } from "../hooks/use-offline";
import { usePushNotifications } from "../hooks/use-push-notifications";
import { useCamera } from "../hooks/use-camera";
import { useTouchGestures } from "../hooks/use-touch-gestures";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { 
  Wifi, 
  WifiOff, 
  Bell, 
  BellOff, 
  Camera, 
  Download,
  Smartphone,
  TouchpadIcon,
  Zap,
  Check,
  X
} from "lucide-react";

export function MobileFeaturesShowcase() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  
  // Mobile feature hooks
  const { 
    isEffectivelyOffline, 
    pendingActions, 
    toggleOfflineMode,
    syncPendingActions,
    queueOfflineAction 
  } = useOffline();
  
  const { 
    isEnabled: notificationsEnabled, 
    requestPermission, 
    showNotification,
    scheduleReminder 
  } = usePushNotifications();
  
  const { 
    isSupported: cameraSupported, 
    startCamera, 
    stopCamera, 
    isActive: cameraActive,
    capturePhoto 
  } = useCamera();

  // Touch gesture demo
  const gestureRef = useTouchGestures({
    onSwipeLeft: () => setActiveDemo('swipe-left'),
    onSwipeRight: () => setActiveDemo('swipe-right'),
    onTap: () => setActiveDemo('tap'),
    onLongPress: () => setActiveDemo('long-press'),
  });

  const features = [
    {
      id: 'offline',
      title: 'Offline Support',
      description: 'Continue working without internet connection',
      icon: isEffectivelyOffline ? WifiOff : Wifi,
      status: isEffectivelyOffline ? 'Active' : 'Online',
      color: isEffectivelyOffline ? 'bg-amber-500' : 'bg-green-500',
      demo: () => {
        toggleOfflineMode();
        queueOfflineAction({
          type: 'labor-log',
          data: { laborType: 'care-work', hours: 2 }
        });
      }
    },
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Get reminders for labor logging and voting',
      icon: notificationsEnabled ? Bell : BellOff,
      status: notificationsEnabled ? 'Enabled' : 'Disabled',
      color: notificationsEnabled ? 'bg-blue-500' : 'bg-gray-500',
      demo: async () => {
        if (!notificationsEnabled) {
          await requestPermission();
        } else {
          showNotification({
            title: '🌊 Demo Notification',
            body: 'This is how Coral8 keeps you engaged with your community!'
          });
        }
      }
    },
    {
      id: 'camera',
      title: 'Camera Integration',
      description: 'Capture photos for labor attestation',
      icon: Camera,
      status: cameraSupported ? (cameraActive ? 'Active' : 'Ready') : 'Not Supported',
      color: cameraSupported ? (cameraActive ? 'bg-purple-500' : 'bg-green-500') : 'bg-gray-500',
      demo: async () => {
        if (cameraActive) {
          stopCamera();
        } else {
          await startCamera();
        }
      }
    },
    {
      id: 'gestures',
      title: 'Touch Gestures',
      description: 'Swipe, tap, and long press interactions',
      icon: TouchpadIcon,
      status: activeDemo || 'Ready',
      color: activeDemo ? 'bg-teal-500' : 'bg-blue-500',
      demo: () => {
        setActiveDemo('gesture-demo');
        setTimeout(() => setActiveDemo(null), 2000);
      }
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-ocean-blue to-ocean-teal text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-6 h-6" />
            <span>Advanced Mobile Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="opacity-90 mb-4">
            Coral8 is built mobile-first with advanced capabilities for cultural labor tracking on any device.
          </p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{pendingActions.length}</div>
              <div className="text-sm opacity-75">Queued Actions</div>
            </div>
            <div>
              <div className="text-2xl font-bold">PWA</div>
              <div className="text-sm opacity-75">Ready to Install</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${feature.color.replace('bg-', 'bg-')} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.status}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-moon-gray text-sm mb-4">{feature.description}</p>
                
                <Button
                  onClick={feature.demo}
                  size="sm"
                  className="w-full bg-ocean-teal hover:bg-ocean-blue text-white"
                >
                  Try Demo
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Touch Gesture Demo Area */}
      <Card ref={gestureRef} className="border-2 border-dashed border-ocean-teal">
        <CardContent className="p-8 text-center">
          <TouchpadIcon className="w-12 h-12 mx-auto mb-4 text-ocean-teal" />
          <h3 className="text-lg font-semibold mb-2">Touch Gesture Demo</h3>
          <p className="text-moon-gray mb-4">Try swiping left/right, tapping, or long pressing in this area</p>
          
          {activeDemo && (
            <div className="bg-ocean-teal/10 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5 text-ocean-teal" />
                <span className="font-medium text-ocean-teal">
                  Detected: {activeDemo.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offline Actions Queue */}
      {pendingActions.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-800">
              <WifiOff className="w-5 h-5" />
              <span>Offline Actions Queue</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {pendingActions.slice(0, 3).map((action, index) => (
                <div key={action.id} className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="text-sm font-medium">{action.type}</span>
                  <Badge variant="outline" className="text-xs">
                    Retry: {action.retryCount}
                  </Badge>
                </div>
              ))}
            </div>
            <Button
              onClick={syncPendingActions}
              size="sm"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Sync {pendingActions.length} Actions
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}