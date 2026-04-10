
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Bell,
  Save
} from "lucide-react";
import { useSettings } from "@/components/settings/SettingsProvider";
import DataExportImport from "@/components/data/DataExportImport";

export default function SettingsPage() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    if (!isLoading) {
      setLocalSettings(settings);
    }
  }, [settings, isLoading]);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    alert("Settings saved successfully!");
  };

  const handleExportData = () => {
    // In a real app, this would export all user data
    alert("Data export feature would be implemented here");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion would be implemented here");
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Customize your budget planning experience
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
                  <User className="w-5 h-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select
                      value={localSettings.currency}
                      onValueChange={(value) => handleSettingChange('currency', value)}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound (£)</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar (C$)</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar (A$)</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen (¥)</SelectItem>
                        <SelectItem value="CHF">CHF - Swiss Franc (Fr)</SelectItem>
                        <SelectItem value="SEK">SEK - Swedish Krona (kr)</SelectItem>
                        <SelectItem value="NOK">NOK - Norwegian Krone (kr)</SelectItem>
                        <SelectItem value="DKK">DKK - Danish Krone (kr)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={localSettings.dateFormat}
                      onValueChange={(value) => handleSettingChange('dateFormat', value)}
                    >
                      <SelectTrigger id="dateFormat">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/dd/yyyy">MM/dd/yyyy (12/25/2024)</SelectItem>
                        <SelectItem value="dd/MM/yyyy">dd/MM/yyyy (25/12/2024)</SelectItem>
                        <SelectItem value="yyyy-MM-dd">yyyy-MM-dd (2024-12-25)</SelectItem>
                        <SelectItem value="dd MMM yyyy">dd MMM yyyy (25 Dec 2024)</SelectItem>
                        <SelectItem value="MMM dd, yyyy">MMM dd, yyyy (Dec 25, 2024)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-base font-medium">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={localSettings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailAlerts" className="text-base font-medium">
                      Email Alerts
                    </Label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Get important alerts via email
                    </p>
                  </div>
                  <Switch
                    id="emailAlerts"
                    checked={localSettings.emailAlerts}
                    onCheckedChange={(checked) => handleSettingChange('emailAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="budgetWarnings" className="text-base font-medium">
                      Budget Warnings
                    </Label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Alert me when approaching budget limits
                    </p>
                  </div>
                  <Switch
                    id="budgetWarnings"
                    checked={localSettings.budgetWarnings}
                    onCheckedChange={(checked) => handleSettingChange('budgetWarnings', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="monthlyReports" className="text-base font-medium">
                      Monthly Reports
                    </Label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Receive monthly spending summaries
                    </p>
                  </div>
                  <Switch
                    id="monthlyReports"
                    checked={localSettings.monthlyReports}
                    onCheckedChange={(checked) => handleSettingChange('monthlyReports', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Export & Import */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DataExportImport />
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <Button onClick={handleSave} className="bg-primary-sage hover:bg-primary-sage/90 gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
