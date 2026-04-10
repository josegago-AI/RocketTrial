import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@/entities/User";
import { format as formatDateFns, parseISO } from "date-fns";

const SettingsContext = createContext(null);

const defaultSettings = {
  currency: "USD",
  dateFormat: "MM/dd/yyyy",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setSettings({
        currency: user.currency || defaultSettings.currency,
        dateFormat: user.dateFormat || defaultSettings.dateFormat,
      });
    } catch (error) {
      // User not logged in, use defaults
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserSettings();
  }, [loadUserSettings]);

  const updateSettings = async (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    try {
      await User.updateMyUserData(updatedSettings);
    } catch (error) {
      console.error("Failed to update user settings:", error);
      // Revert state on error
      loadUserSettings();
    }
  };

  const formatCurrency = useCallback((amount) => {
    if (typeof amount !== 'number') {
      amount = 0;
    }
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: settings.currency,
    }).format(amount);
  }, [settings.currency]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return formatDateFns(date, settings.dateFormat);
    } catch (error) {
      console.error("Invalid date for formatting:", dateString);
      return dateString;
    }
  }, [settings.dateFormat]);

  const value = {
    settings,
    isLoading,
    updateSettings,
    formatCurrency,
    formatDate,
  };

  return (
    <SettingsContext.Provider value={value}>
      {!isLoading && children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};