
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Income, Expense, Budget, SavingsGoal } from "@/entities/all";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  PlusCircle,
  RefreshCw,
  Landmark,
  Brain // Added Brain import
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useSettings } from "@/components/settings/SettingsProvider";

import StatsCard from "../components/dashboard/StatsCard";
import BudgetOverview from "../components/dashboard/BudgetOverview";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import QuickAddFAB from "../components/ui/quick-add-fab";
import AIInsightsPanel from "../components/ai/AIInsightsPanel"; // Added AIInsightsPanel import
import AIChat from "../components/ai/AIChat"; // Added AIChat import

export default function Dashboard() {
  const { formatCurrency } = useSettings();
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false); // New state for AI Chat visibility

  useEffect(() => {
    loadData();

    // Set up auto-refresh for dynamic updates
    const interval = setInterval(() => {
      if (!isRefreshing) { // Only refresh if not already refreshing
        loadData(true);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [isRefreshing]); // Dependency array includes isRefreshing to ensure latest state is used by interval check

  const loadData = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);

    try {
      const [incomeData, expensesData, budgetsData, goalsData] = await Promise.all([
        Income.list("-created_date"),
        Expense.list("-created_date"),
        Budget.list("-created_date"),
        SavingsGoal.list("-created_date")
      ]);

      setIncome(incomeData);
      setExpenses(expensesData);
      setBudgets(budgetsData);
      setGoals(goalsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleTransactionAdded = () => {
    loadData(true);
  };

  const calculateTotalIncome = () => {
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
  };

  const calculateTotalExpenses = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return expenses
      .filter(exp => exp.date?.startsWith(currentMonth))
      .reduce((total, exp) => total + (exp.amount || 0), 0);
  };

  const calculateSavingsProgress = () => {
    const activeGoals = goals.filter(goal => goal.is_active);
    if (activeGoals.length === 0) return 0;

    const totalProgress = activeGoals.reduce((sum, goal) => {
      const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
      return sum + progress;
    }, 0);

    return totalProgress / activeGoals.length;
  };

  const getLargestExpenseCategory = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = expenses.filter(exp => exp.date?.startsWith(currentMonth));

    const categoryTotals = monthlyExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + (exp.amount || 0);
      return acc;
    }, {});

    const largest = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0];
    return largest ? { category: largest[0], amount: largest[1] } : { category: "N/A", amount: 0 };
  };

  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();
  const netIncome = totalIncome - totalExpenses;
  const savingsProgress = calculateSavingsProgress();
  const largestCategory = getLargestExpenseCategory();

  const statsCards = [
    {
      title: "Monthly Income",
      amount: totalIncome,
      change: 8.2,
      changeType: "positive",
      icon: TrendingUp,
      color: "green"
    },
    {
      title: "Monthly Expenses",
      amount: totalExpenses,
      change: -3.1,
      changeType: "positive",
      icon: TrendingDown,
      color: "red"
    },
    {
      title: "Net Balance",
      amount: netIncome,
      change: netIncome > 0 ? 12.5 : -5.2,
      changeType: netIncome > 0 ? "positive" : "negative",
      icon: Wallet,
      color: netIncome > 0 ? "blue" : "amber"
    },
    {
      title: "Savings Progress",
      amount: `${savingsProgress.toFixed(1)}%`,
      icon: Target,
      color: "purple"
    }
  ];

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy dark:text-white mb-2">
              Financial Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Real-time overview of your financial health
            </p>
          </div>
          <div className="flex gap-3">
            {/* AI Coach Button */}
            <Button
              variant="outline"
              onClick={() => setShowAIChat(true)}
              className="gap-2"
            >
              <Brain className="w-4 h-4" />
              AI Coach
            </Button>
            <Button
              variant="outline"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="gap-2"
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              {isRefreshing ? "Updating..." : "Refresh"}
            </Button>
            <Link to={createPageUrl("Expenses")}>
              <Button className="bg-primary-sage hover:bg-primary-sage/90 text-white shadow-lg">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Transaction
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <StatsCard key={card.title} {...card} index={index} />
          ))}
        </div>

        {/* Additional Insight Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">
                  Largest Expense Category
                </p>
                <p className="text-2xl font-bold capitalize">
                  {largestCategory.category}
                </p>
                <p className="text-orange-100 text-lg">
                  {formatCurrency(largestCategory.amount)}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingDown className="w-8 h-8" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium mb-1">
                  Active Goals
                </p>
                <p className="text-2xl font-bold">
                  {goals.filter(g => g.is_active).length}
                </p>
                <p className="text-cyan-100 text-lg">
                  Goals in progress
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white card-hover"
          >
            <Link to={createPageUrl("Import")}>
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">
                    Bank Sync
                  </p>
                  <p className="text-2xl font-bold">
                    Import Data
                  </p>
                  <p className="text-blue-100 text-lg">
                    Upload CSV files
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Landmark className="w-8 h-8" />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white card-hover"
          >
            <Link to={createPageUrl("Investments")}>
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">
                    Portfolio
                  </p>
                  <p className="text-2xl font-bold">
                    Investments
                  </p>
                  <p className="text-purple-100 text-lg">
                    Track holdings
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-8 h-8" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <BudgetOverview budgets={budgets} expenses={expenses} income={income} />
          </div>

          <div className="space-y-8">
            <RecentTransactions expenses={expenses} income={income} />
            {/* AI Insights Panel */}
            <AIInsightsPanel onAskAI={() => setShowAIChat(true)} />
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-primary-navy dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to={createPageUrl("Income")}>
              <Button variant="outline" className="w-full h-16 flex-col gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">Add Income</span>
              </Button>
            </Link>
            <Link to={createPageUrl("Expenses")}>
              <Button variant="outline" className="w-full h-16 flex-col gap-2 hover:bg-red-50 dark:hover:bg-red-900/20">
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm">Add Expense</span>
              </Button>
            </Link>
            <Link to={createPageUrl("Goals")}>
              <Button variant="outline" className="w-full h-16 flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <Target className="w-5 h-5" />
                <span className="text-sm">Set Goal</span>
              </Button>
            </Link>
            <Link to={createPageUrl("Analytics")}>
              <Button variant="outline" className="w-full h-16 flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">View Reports</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Quick Add FAB */}
      <QuickAddFAB onTransactionAdded={handleTransactionAdded} />

      {/* AI Chat */}
      <AIChat isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
    </div>
  );
}
