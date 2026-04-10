import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/entities/User";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserTheme();
  }, []);

  const loadUserTheme = async () => {
    try {
      const user = await User.me();
      setTheme(user.theme || "light");
    } catch (error) {
      // User not logged in or error, use default theme
      setTheme("light");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    try {
      await User.updateMyUserData({ theme: newTheme });
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}