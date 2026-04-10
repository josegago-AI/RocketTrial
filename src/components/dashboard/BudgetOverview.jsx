
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { useSettings } from "@/components/settings/SettingsProvider";

export default function BudgetOverview({ budgets = [], expenses = [], income = [] }) {
  const { formatCurrency } = useSettings();

  const categoryColors = {
    needs: "bg-blue-500",
    wants: "bg-purple-500", 
    savings: "bg-emerald-500"
  };

  const getCategoryData = useMemo(() => {
    // Calculate actual spending from expenses
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = expenses.filter(expense => 
      expense.date?.startsWith(currentMonth)
    );

    const actualSpending = monthlyExpenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount || 0;
      return acc;
    }, {});

    // Get planned amounts from budgets
    const categoryTotals = budgets.filter(budget => 
      budget.month === currentMonth
    ).reduce((acc, budget) => {
      if (!acc[budget.category]) {
        acc[budget.category] = { planned: 0, actual: 0 };
      }
      acc[budget.category].planned += budget.planned_amount || 0;
      return acc;
    }, {});

    // Combine with actual spending
    Object.keys(actualSpending).forEach(category => {
      if (!categoryTotals[category]) {
        categoryTotals[category] = { planned: 0, actual: 0 };
      }
      categoryTotals[category].actual = actualSpending[category];
    });

    return Object.entries(categoryTotals).map(([category, data]) => ({
      category,
      ...data,
      percentage: data.planned > 0 ? (data.actual / data.planned) * 100 : 0,
      isOverBudget: data.actual > data.planned && data.planned > 0,
      remaining: Math.max(0, data.planned - data.actual)
    }));
  }, [budgets, expenses]);

  const categoryData = getCategoryData;

  // Calculate total monthly income
  const totalMonthlyIncome = useMemo(() => {
    return income
      .filter(inc => inc.is_active)
      .reduce((total, inc) => {
        const amount = inc.amount || 0;
        switch (inc.frequency) {
          case 'weekly': return total + (amount * 4.33);
          case 'bi-weekly': return total + (amount * 2.17);
          case 'annual': return total + (amount / 12);
          default: return total + amount;
        }
      }, 0);
  }, [income]);

  const totalSpending = categoryData.reduce((sum, cat) => sum + cat.actual, 0);
  const netBalance = totalMonthlyIncome - totalSpending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-primary-navy dark:text-white">
              Budget Overview
            </CardTitle>
            <Badge 
              variant={netBalance >= 0 ? "default" : "destructive"}
              className={netBalance >= 0 ? 
                "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : 
                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }
            >
              <TrendingUp className={`w-3 h-3 mr-1 ${netBalance < 0 ? 'rotate-180' : ''}`} />
              {formatCurrency(Math.abs(netBalance))} 
              {netBalance >= 0 ? " surplus" : " deficit"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {categoryData.map((item) => (
            <motion.div 
              key={item.category} 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${categoryColors[item.category]}`} />
                  <span className="font-medium capitalize text-neutral-800 dark:text-neutral-200">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.isOverBudget ? (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {formatCurrency(item.actual)} / {formatCurrency(item.planned)}
                  </span>
                </div>
              </div>
              
              <Progress 
                value={Math.min(item.percentage, 100)} 
                className="h-2 bg-gray-200 dark:bg-gray-700"
              />
              
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>{item.percentage.toFixed(1)}% used</span>
                <span className={item.isOverBudget ? 
                  "text-red-500 dark:text-red-400 font-medium" : 
                  "text-emerald-600 dark:text-emerald-400 font-medium"
                }>
                  {item.isOverBudget ? 
                    `${formatCurrency(item.actual - item.planned)} over budget` : 
                    `${formatCurrency(item.remaining)} remaining`
                  }
                </span>
              </div>
            </motion.div>
          ))}
          
          {categoryData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-neutral-500 dark:text-neutral-400">No budget data available</p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                Set up your monthly budgets to see progress
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
