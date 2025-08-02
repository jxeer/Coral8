/**
 * Push Notifications Hook
 * Manages push notification permissions and delivery for mobile users
 * Provides reminders for labor logging, governance voting, and community updates
 * Integrates with service worker for background notifications
 */

import { useState, useEffect, useCallback } from 'react';

interface NotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
  isEnabled: boolean;
  subscription: PushSubscription | null;
}

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
}

/**
 * Custom hook for push notification management
 * @returns Notification state and control functions
 */
export function usePushNotifications() {
  const [state, setState] = useState<NotificationState>({
    permission: 'default',
    isSupported: 'Notification' in window && 'serviceWorker' in navigator,
    isEnabled: false,
    subscription: null,
  });

  // Initialize notification state
  useEffect(() => {
    if (!state.isSupported) return;

    setState(prev => ({
      ...prev,
      permission: Notification.permission,
      isEnabled: Notification.permission === 'granted',
    }));

    // Get existing subscription
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        return registration.pushManager.getSubscription();
      }).then(subscription => {
        setState(prev => ({ ...prev, subscription }));
      });
    }
  }, [state.isSupported]);

  /**
   * Request notification permission
   */
  const requestPermission = useCallback(async () => {
    if (!state.isSupported) {
      throw new Error('Notifications not supported');
    }

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({
        ...prev,
        permission,
        isEnabled: permission === 'granted',
      }));
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }, [state.isSupported]);

  /**
   * Subscribe to push notifications
   */
  const subscribe = useCallback(async () => {
    if (!state.isEnabled || !('serviceWorker' in navigator)) return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Generate VAPID keys (in production, these should come from your server)
      const applicationServerKey = urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa40HI8KdHgR-YDBFq2lNFQRBvxOPT3kZo1-hn9RqYoK5g8fNQ8-s0rZdX0QAk'
      );

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      setState(prev => ({ ...prev, subscription }));

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }, [state.isEnabled]);

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribe = useCallback(async () => {
    if (!state.subscription) return;

    try {
      await state.subscription.unsubscribe();
      setState(prev => ({ ...prev, subscription: null }));

      // Notify server
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: state.subscription.endpoint }),
      });
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
    }
  }, [state.subscription]);

  /**
   * Show local notification
   */
  const showNotification = useCallback(async (options: NotificationOptions) => {
    if (!state.isEnabled) return;

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        return registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/icon-192x192.png',
          badge: options.badge || '/icons/icon-72x72.png',
          tag: options.tag,
          data: options.data,
          requireInteraction: options.requireInteraction || false,
          actions: options.actions || [],
        });
      } else {
        return new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/icon-192x192.png',
          tag: options.tag,
          data: options.data,
        });
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }, [state.isEnabled]);

  /**
   * Schedule notification reminders
   */
  const scheduleReminder = useCallback((type: 'labor' | 'voting' | 'community', delay: number = 3600000) => {
    const notifications = {
      labor: {
        title: '🌊 Time to Log Your Labor',
        body: 'Remember to record your culturally rooted work and earn COW tokens',
        tag: 'labor-reminder',
        data: { type: 'labor', action: 'log' },
      },
      voting: {
        title: '🗳️ Community Voting Open',
        body: 'New governance proposals need your vote. Help shape the community.',
        tag: 'voting-reminder',
        data: { type: 'voting', action: 'vote' },
      },
      community: {
        title: '🏛️ Community Updates',
        body: 'Check out new marketplace items and community discussions',
        tag: 'community-reminder',
        data: { type: 'community', action: 'explore' },
      },
    };

    setTimeout(() => {
      showNotification(notifications[type]);
    }, delay);
  }, [showNotification]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
    scheduleReminder,
  };
}

/**
 * Hook for notification settings management
 */
export function useNotificationSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('notification_settings');
    return saved ? JSON.parse(saved) : {
      laborReminders: true,
      votingAlerts: true,
      communityUpdates: true,
      marketplaceDeals: false,
      reminderFrequency: 'daily', // daily, weekly, never
    };
  });

  const updateSettings = useCallback((newSettings: Partial<typeof settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('notification_settings', JSON.stringify(updated));
  }, [settings]);

  return { settings, updateSettings };
}

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}