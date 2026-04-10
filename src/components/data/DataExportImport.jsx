import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Download, 
  Upload, 
  FileText, 
  Shield, 
  Check,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Income, Expense, SavingsGoal, Investment, BankAccount } from "@/entities/all";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSettings } from "@/components/settings/SettingsProvider";

export default function DataExportImport() {
  const { user } = useAuth();
  const { formatCurrency } = useSettings();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const exportAllData = async () => {
    setIsExporting(true);
    setExportComplete(false);

    try {
      const [expenses, income, goals, investments, accounts] = await Promise.all([
        Expense.list(),
        Income.list(),
        SavingsGoal.list(),
        Investment.list(),
        BankAccount.list()
      ]);

      const exportData = {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          exportDate: new Date().toISOString()
        },
        data: {
          expenses,
          income,
          savings_goals: goals,
          investments,
          bank_accounts: accounts
        },
        summary: {
          total_expenses: expenses.length,
          total_income_sources: income.length,
          total_goals: goals.length,
          total_investments: investments.length,
          total_accounts: accounts.length
        }
      };

      // Create downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `finara-export-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      // Validate the import data structure
      if (!importData.user || !importData.data) {
        throw new Error('Invalid file format');
      }

      // Confirm import
      const confirmed = confirm(
        `This will import ${importData.summary?.total_expenses || 0} expenses, ` +
        `${importData.summary?.total_income_sources || 0} income sources, and ` +
        `${importData.summary?.total_goals || 0} goals. Continue?`
      );

      if (!confirmed) {
        setIsImporting(false);
        return;
      }

      // Import expenses
      if (importData.data.expenses?.length > 0) {
        for (const expense of importData.data.expenses) {
          const { id, created_date, updated_date, created_by, ...expenseData } = expense;
          await Expense.create(expenseData);
        }
      }

      // Import income
      if (importData.data.income?.length > 0) {
        for (const inc of importData.data.income) {
          const { id, created_date, updated_date, created_by, ...incomeData } = inc;
          await Income.create(incomeData);
        }
      }

      // Import goals
      if (importData.data.savings_goals?.length > 0) {
        for (const goal of importData.data.savings_goals) {
          const { id, created_date, updated_date, created_by, ...goalData } = goal;
          await SavingsGoal.create(goalData);
        }
      }

      alert('Import completed successfully!');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please check the file format and try again.');
    } finally {
      setIsImporting(false);
      event.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Data */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
            <Download className="w-5 h-5" />
            Export Your Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                  GDPR Compliant Export
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Download all your data in JSON format. This includes expenses, income, goals, and account information.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={exportAllData}
            disabled={isExporting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : exportComplete ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Export Complete!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Import Data */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
            <Upload className="w-5 h-5" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  Import Warning
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Importing will add data to your existing records. Make sure to backup your current data first.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="importFile">Select Finara Export File</Label>
            <Input
              id="importFile"
              type="file"
              accept=".json"
              onChange={handleFileImport}
              disabled={isImporting}
              className="cursor-pointer"
            />
          </div>

          {isImporting && (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Importing data...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
            <FileText className="w-5 h-5" />
            Your Data Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Protected
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <Shield className="w-3 h-3 mr-1" />
                Encrypted
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Synced
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Multi-Device
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Private
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Your Eyes Only
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                GDPR
              </div>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                Compliant
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}