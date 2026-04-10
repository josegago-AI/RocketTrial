import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Shield, Loader2 } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children, fallback = null }) {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 text-lg text-gray-600 dark:text-gray-300"
        >
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading your account...
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to Finara
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Your personal finance tracker. Sign in to access your dashboard and start managing your money.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                  🔐 Secure & Private
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Your financial data is encrypted and only accessible by you. We never share your information.
                </p>
              </div>
              
              <Button 
                onClick={login}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In to Continue
              </Button>
              
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return children;
}