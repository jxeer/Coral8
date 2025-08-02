/**
 * Offline Support Hook
 * Manages offline functionality and data synchronization for mobile users
 * Provides offline storage, sync queues, and connectivity status
 * Essential for mobile users with intermittent internet connections
 */

import { useState, useEffect, useCallback } from 'react';

interface OfflineState {
  isOnline: boolean;
  isOfflineMode: boolean;
  pendingActions: OfflineAction[];
  lastSync: Date | null;
}

interface OfflineAction {
  id: string;
  type: 'labor-log' | 'vote' | 'marketplace-purchase';
  data: any;
  timestamp: Date;
  retryCount: number;
}

const OFFLINE_STORAGE_KEY = 'coral8_offline_data';
const MAX_RETRY_COUNT = 3;

/**
 * Custom hook for managing offline functionality
 * @returns Offline state and management functions
 */
export function useOffline() {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    isOfflineMode: false,
    pendingActions: [],
    lastSync: null,
  });

  // Load offline data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setState(prev => ({
          ...prev,
          pendingActions: parsed.pendingActions || [],
          lastSync: parsed.lastSync ? new Date(parsed.lastSync) : null,
        }));
      } catch (error) {
        console.error('Failed to load offline data:', error);
      }
    }
  }, []);

  // Save offline data to localStorage
  const saveOfflineData = useCallback((data: Partial<OfflineState>) => {
    const currentData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    const existing = currentData ? JSON.parse(currentData) : {};
    const updated = { ...existing, ...data };
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updated));
  }, []);

  // Handle online/offline status changes
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      // Automatically sync when coming back online
      syncPendingActions();
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Add an action to the offline queue
   */
  const queueOfflineAction = useCallback((action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>) => {
    const newAction: OfflineAction = {
      id: `${action.type}_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      retryCount: 0,
      ...action,
    };

    setState(prev => {
      const updated = {
        ...prev,
        pendingActions: [...prev.pendingActions, newAction],
      };
      saveOfflineData({ pendingActions: updated.pendingActions });
      return updated;
    });

    return newAction.id;
  }, [saveOfflineData]);

  /**
   * Sync pending actions to server
   */
  const syncPendingActions = useCallback(async () => {
    if (!state.isOnline || state.pendingActions.length === 0) return;

    const actionsToSync = [...state.pendingActions];
    const successful: string[] = [];
    const failed: OfflineAction[] = [];

    for (const action of actionsToSync) {
      try {
        // Simulate API calls based on action type
        switch (action.type) {
          case 'labor-log':
            await fetch('/api/labor-logs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.data),
            });
            break;
          case 'vote':
            await fetch(`/api/proposals/${action.data.proposalId}/vote`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ vote: action.data.vote }),
            });
            break;
          case 'marketplace-purchase':
            await fetch('/api/marketplace/purchase', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.data),
            });
            break;
        }
        successful.push(action.id);
      } catch (error) {
        console.error(`Failed to sync action ${action.id}:`, error);
        if (action.retryCount < MAX_RETRY_COUNT) {
          failed.push({ ...action, retryCount: action.retryCount + 1 });
        }
      }
    }

    setState(prev => {
      const updated = {
        ...prev,
        pendingActions: failed,
        lastSync: new Date(),
      };
      saveOfflineData({ 
        pendingActions: updated.pendingActions,
        lastSync: updated.lastSync,
      });
      return updated;
    });

    return { successful: successful.length, failed: failed.length };
  }, [state.isOnline, state.pendingActions, saveOfflineData]);

  /**
   * Toggle offline mode (for testing or deliberate offline usage)
   */
  const toggleOfflineMode = useCallback(() => {
    setState(prev => ({ ...prev, isOfflineMode: !prev.isOfflineMode }));
  }, []);

  /**
   * Clear all pending actions
   */
  const clearPendingActions = useCallback(() => {
    setState(prev => ({
      ...prev,
      pendingActions: [],
    }));
    saveOfflineData({ pendingActions: [] });
  }, [saveOfflineData]);

  /**
   * Get offline storage usage
   */
  const getStorageUsage = useCallback(() => {
    const data = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!data) return 0;
    return new Blob([data]).size;
  }, []);

  return {
    ...state,
    queueOfflineAction,
    syncPendingActions,
    toggleOfflineMode,
    clearPendingActions,
    getStorageUsage,
    isEffectivelyOffline: !state.isOnline || state.isOfflineMode,
  };
}

/**
 * Hook for offline-aware API requests
 * @param endpoint - API endpoint
 * @param options - Fetch options
 * @returns Function to make offline-aware requests
 */
export function useOfflineRequest() {
  const { isEffectivelyOffline, queueOfflineAction } = useOffline();

  const makeRequest = useCallback(async (
    endpoint: string,
    options: RequestInit = {},
    offlineAction?: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>
  ) => {
    if (isEffectivelyOffline && offlineAction) {
      // Queue for later sync
      const actionId = queueOfflineAction(offlineAction);
      return { success: true, queued: true, actionId };
    }

    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { success: true, data: await response.json() };
    } catch (error) {
      if (offlineAction) {
        // Queue for retry
        const actionId = queueOfflineAction(offlineAction);
        return { success: false, queued: true, actionId, error };
      }
      return { success: false, error };
    }
  }, [isEffectivelyOffline, queueOfflineAction]);

  return makeRequest;
}