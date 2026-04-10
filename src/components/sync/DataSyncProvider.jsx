import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const DataSyncContext = createContext(null);

export function DataSyncProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, error, success
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);

  const syncData = useCallback(async () => {
    if (!isAuthenticated || offlineMode) return;

    setSyncStatus('syncing');
    
    try {
      // Cache key based on user ID to ensure per-user isolation
      const cacheKey = `finara_cache_${user?.id || 'anonymous'}`;
      
      // Get cached data
      const cachedData = localStorage.getItem(cacheKey);
      const localData = cachedData ? JSON.parse(cachedData) : null;
      
      // If we have pending offline changes, we need to sync them first
      const pendingChanges = localStorage.getItem(`${cacheKey}_pending`);
      if (pendingChanges) {
        const changes = JSON.parse(pendingChanges);
        await processPendingChanges(changes);
        localStorage.removeItem(`${cacheKey}_pending`);
      }
      
      setLastSyncTime(new Date());
      setSyncStatus('success');
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
    }
  }, [isAuthenticated, offlineMode, user?.id]);

  const processPendingChanges = useCallback(async (changes) => {
    // Process any changes that were made while offline
    for (const change of changes) {
      try {
        switch (change.action) {
          case 'create':
            // Re-attempt creation
            break;
          case 'update':
            // Re-attempt update
            break;
          case 'delete':
            // Re-attempt deletion
            break;
        }
      } catch (error) {
        console.error('Failed to process pending change:', change, error);
      }
    }
  }, []);

  const startPeriodicSync = useCallback(() => {
    // Sync every 30 seconds when online
    const syncInterval = setInterval(() => {
      if (!offlineMode && isAuthenticated) {
        syncData();
      }
    }, 30000);
    return syncInterval;
  }, [offlineMode, isAuthenticated, syncData]);

  const stopPeriodicSync = useCallback((syncInterval) => {
    if (syncInterval) {
      clearInterval(syncInterval);
    }
  }, []);

  useEffect(() => {
    let syncInterval;
    
    if (isAuthenticated) {
      syncInterval = startPeriodicSync();
      checkOnlineStatus();
    }

    return () => {
      stopPeriodicSync(syncInterval);
    };
  }, [isAuthenticated, startPeriodicSync, stopPeriodicSync]);

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => {
      setOfflineMode(false);
      if (isAuthenticated) {
        syncData();
      }
    };

    const handleOffline = () => {
      setOfflineMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated, syncData]);

  const checkOnlineStatus = () => {
    setOfflineMode(!navigator.onLine);
  };

  const cacheData = useCallback((key, data) => {
    if (!user) return;
    
    const cacheKey = `finara_cache_${user.id}_${key}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: new Date().toISOString(),
      userId: user.id
    }));
  }, [user]);

  const getCachedData = useCallback((key) => {
    if (!user) return null;
    
    const cacheKey = `finara_cache_${user.id}_${key}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const parsed = JSON.parse(cached);
      // Verify the cached data belongs to current user
      if (parsed.userId === user.id) {
        return parsed.data;
      } else {
        // Clear invalid cache
        localStorage.removeItem(cacheKey);
      }
    }
    
    return null;
  }, [user]);

  const addPendingChange = useCallback((change) => {
    if (!user) return;
    
    const cacheKey = `finara_cache_${user.id}_pending`;
    const existing = localStorage.getItem(cacheKey);
    const pending = existing ? JSON.parse(existing) : [];
    
    pending.push({
      ...change,
      timestamp: new Date().toISOString(),
      userId: user.id
    });
    
    localStorage.setItem(cacheKey, JSON.stringify(pending));
  }, [user]);

  const clearUserCache = useCallback(() => {
    if (!user) return;
    
    // Clear all cache for current user
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`finara_cache_${user.id}`)) {
        localStorage.removeItem(key);
      }
    });
  }, [user]);

  const value = {
    syncStatus,
    lastSyncTime,
    offlineMode,
    syncData,
    cacheData,
    getCachedData,
    addPendingChange,
    clearUserCache
  };

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
}

export const useDataSync = () => {
  const context = useContext(DataSyncContext);
  if (!context) {
    throw new Error("useDataSync must be used within a DataSyncProvider");
  }
  return context;
};