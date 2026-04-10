import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  Settings,
  DollarSign,
  Menu,
  X,
  Moon,
  Sun,
  Landmark,
  Download,
  Wallet,
  LogOut,
  LogIn,
  Wifi,
  WifiOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "@/components/ui/theme-provider";
import { SettingsProvider } from "@/components/settings/SettingsProvider";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { DataSyncProvider, useDataSync } from "@/components/sync/DataSyncProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Income",
    url: createPageUrl("Income"),
    icon: TrendingUp,
  },
  {
    title: "Expenses",
    url: createPageUrl("Expenses"),
    icon: TrendingDown,
  },
  {
    title: "Accounts",
    url: createPageUrl("Accounts"),
    icon: Landmark
  },
  {
    title: "Investments",
    url: createPageUrl("Investments"),
    icon: Wallet
  },
  {
    title: "Import",
    url: createPageUrl("Import"),
    icon: Download
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: PieChart,
  },
  {
    title: "Goals",
    url: createPageUrl("Goals"),
    icon: Target,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

function SyncStatus() {
  const { syncStatus, lastSyncTime, offlineMode } = useDataSync();
  
  if (offlineMode) {
    return (
      <Badge variant="outline" className="gap-1 text-orange-600 border-orange-300 dark:text-orange-400 dark:border-orange-600">
        <WifiOff className="w-3 h-3" />
        Offline
      </Badge>
    );
  }

  if (syncStatus === 'syncing') {
    return (
      <Badge variant="outline" className="gap-1 text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-600">
        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        Syncing
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 text-green-600 border-green-300 dark:text-green-400 dark:border-green-600">
      <Wifi className="w-3 h-3" />
      Synced
    </Badge>
  );
}

function UserProfileButton({ user, onLogout }) {
  const { theme, toggleTheme } = useTheme();

  if (!user) {
    return (
      <Button onClick={() => User.login()}>
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 p-3 rounded-xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm w-full text-left">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.picture} alt={user.full_name} />
              <AvatarFallback>{user.full_name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white dark:text-gray-200 truncate">{user.full_name}</p>
              <p className="text-xs text-slate-400 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:text-red-500">
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 font-sans">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

            body {
              font-family: 'Inter', sans-serif;
            }

            :root {
              --primary-navy: #1e293b;
              --primary-sage: #059669;
              --accent-blue: #3b82f6;
              --warning-amber: #f59e0b;
              --danger-red: #ef4444;
              --success-green: #10b981;
              --neutral-100: #f8fafc;
              --neutral-200: #e2e8f0;
              --neutral-300: #cbd5e1;
              --neutral-600: #64748b;
              --neutral-800: #1e293b;
              --neutral-900: #0f172a;
            }

            .dark {
              --primary-navy: #e2e8f0;
              --neutral-100: #0f172a;
              --neutral-200: #1e293b;
              --neutral-300: #334155;
              --neutral-600: #cbd5e1;
              --neutral-800: #f1f5f9;
              --neutral-900: #ffffff;
            }

            .sidebar-gradient {
              background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
              transition: background 0.3s ease;
            }

            .dark .sidebar-gradient {
              background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
            }

            .card-hover {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .card-hover:hover {
              transform: translateY(-2px);
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }

            .text-primary-navy { color: var(--primary-navy); }
            .text-primary-sage { color: var(--primary-sage); }
            .bg-primary-navy { background-color: var(--primary-navy); }
            .bg-primary-sage { background-color: var(--primary-sage); }
            .border-primary-sage { border-color: var(--primary-sage); }

            * {
              transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }

            /* Enhanced dark mode support */
            .dark .bg-white { background-color: #1e293b; }
            .dark .text-gray-900 { color: #f1f5f9; }
            .dark .text-gray-800 { color: #e2e8f0; }
            .dark .text-gray-700 { color: #cbd5e1; }
            .dark .text-gray-600 { color: #94a3b8; }
            .dark .text-gray-500 { color: #64748b; }
            .dark .border-gray-200 { border-color: #334155; }
            .dark .border-gray-300 { border-color: #475569; }
          `}
        </style>

        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex lg:w-64 lg:flex-col">
            <div className="flex flex-col flex-1 min-h-0 sidebar-gradient">
              <div className="flex items-center h-16 px-6 border-b border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-emerald-400/30">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Finara</h2>
                    <p className="text-xs text-slate-400">Smart Finance Tracker</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.url);
                  return (
                    <Link key={item.title} to={item.url}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-emerald-500/20 text-white shadow-lg border border-emerald-400/30 backdrop-blur-sm'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 space-y-3 border-t border-slate-700/30">
                <SyncStatus />
                {!isLoading && <UserProfileButton user={user} onLogout={handleLogout} />}
              </div>
            </div>
          </aside>

          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-primary-navy dark:text-white">Finara</h2>
              </div>
              <div className="flex items-center gap-2">
                <SyncStatus />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="w-8 h-8 text-gray-700 dark:text-gray-300"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-700 dark:text-gray-300"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                className="lg:hidden fixed inset-0 z-40 bg-slate-800 dark:bg-gray-900"
              >
                <div className="flex flex-col h-full pt-20">
                  <nav className="flex-1 px-4 py-6 space-y-2">
                    {navigationItems.map((item) => {
                      const isActive = location.pathname.startsWith(item.url);
                      return (
                        <Link
                          key={item.title}
                          to={item.url}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 px-4 py-4 rounded-xl font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-emerald-500/20 text-white shadow-lg border border-emerald-400/30'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <item.icon className="w-6 h-6" />
                            <span className="text-lg">{item.title}</span>
                          </motion.div>
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="p-4 border-t border-slate-700/30">
                    {!isLoading && (
                      user ? (
                         <Button onClick={handleLogout} variant="outline" className="w-full text-white border-slate-600 hover:bg-white/10 hover:text-white">
                           <LogOut className="w-4 h-4 mr-2" />
                           Sign Out
                         </Button>
                      ) : (
                        <Button onClick={() => User.login()} className="w-full bg-primary-sage hover:bg-primary-sage/90">
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 flex flex-col lg:ml-0">
            <div className="flex-1 pt-16 lg:pt-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <DataSyncProvider>
            <LayoutContent children={children} currentPageName={currentPageName} />
          </DataSyncProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}