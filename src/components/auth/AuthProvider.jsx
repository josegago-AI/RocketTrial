import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/entities/User";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      await User.login();
      // After successful login, check auth status
      await checkAuthStatus();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginWithRedirect = async (callbackUrl) => {
    try {
      await User.loginWithRedirect(callbackUrl);
    } catch (error) {
      console.error("Login with redirect failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await User.logout();
      setUser(null);
      setIsAuthenticated(false);
      // Clear any cached data
      localStorage.clear();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const updateProfile = async (userData) => {
    try {
      await User.updateMyUserData(userData);
      await checkAuthStatus(); // Refresh user data
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithRedirect,
    logout,
    updateProfile,
    refreshUser: checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};