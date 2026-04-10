
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Income, Expense, Investment } from "@/entities/all";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  RefreshCw
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Pie
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";
import { useSettings } from "@/components/settings/SettingsProvider";

export default function AnalyticsPage() {
  const { formatCurrency, formatDate } = useSettings();
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        loadData(true);
      }
    }, 30000); // Refresh every 30 seconds for dynamic updates

    return () => clearInterval(interval);
  }, [isRefreshing]);

  const loadData = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);

    try {
      const [expensesData, incomeData, investmentsData] = await Promise.all([
        Expense.list("-date"),
        Income.list("-created_date"),
        Investment.list("-created_date")
      ]);
      setExpenses(expensesData);
      setIncome(incomeData);
      setInvestments(investmentsData);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getFilteredExpenses = () => {
    let filtered = [...expenses];

    if (dateFilter.start && dateFilter.end) {
      const startDate = parseISO(dateFilter.start);
      const endDate = parseISO(dateFilter.end);
      filtered = filtered.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, { start: startDate, end: endDate });
      });
    }

    return filtered;
  };

  const getCategoryData = () => {
    const filteredExpenses = getFilteredExpenses();
    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + (expense.amount || 0);
      return acc;
    }, {});

    const colors = {
      needs: "#3b82f6",
      wants: "#8b5cf6",
      savings: "#10b981"
    };

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount,
      color: colors[category] || "#6b7280"
    }));
  };

  const getMonthlyTrends = () => {
    const months = [];
    const currentDate = new Date();
    const monthCount = selectedPeriod === "3months" ? 3 : selectedPeriod === "1year" ? 12 : 6;

    for (let i = monthCount - 1; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
      }).reduce((sum, expense) => sum + (expense.amount || 0), 0);

      const monthlyIncome = income.reduce((sum, inc) => {
        if (!inc.is_active) return sum;
        const amount = inc.amount || 0;
        switch (inc.frequency) {
          case 'weekly': return sum + (amount * 4.33);
          case 'bi-weekly': return sum + (amount * 2.17);
          case 'annual': return sum + (amount / 12);
          default: return sum + amount;
        }
      }, 0);

      months.push({
        month: format(monthDate, 'MMM yy'),
        expenses: monthlyExpenses,
        income: monthlyIncome,
        savings: monthlyIncome - monthlyExpenses
      });
    }

    return months;
  };

  const getSubcategoryBreakdown = () => {
    const filteredExpenses = getFilteredExpenses();
    const subcategoryTotals = filteredExpenses.reduce((acc, expense) => {
      const key = expense.subcategory || 'other';
      acc[key] = (acc[key] || 0) + (expense.amount || 0);
      return acc;
    }, {});

    return Object.entries(subcategoryTotals)
      .map(([subcategory, amount]) => ({
        name: subcategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        amount
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);
  };

  const getInvestmentAllocation = () => {
    const sectorTotals = investments.reduce((acc, inv) => {
      const value = inv.shares * (inv.current_price || 0);
      acc[inv.sector] = (acc[inv.sector] || 0) + value;
      return acc;
    }, {});

    const colors = {
      technology: "#3b82f6",
      healthcare: "#10b981",
      finance: "#8b5cf6",
      energy: "#f59e0b",
      consumer: "#ef4444",
      industrial: "#6b7280",
      real_estate: "#06b6d4",
      utilities: "#84cc16",
      other: "#64748b"
    };

    return Object.entries(sectorTotals).map(([sector, value]) => ({
      name: sector.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value,
      color: colors[sector] || "#64748b"
    }));
  };

  const categoryData = getCategoryData();
  const monthlyTrends = getMonthlyTrends();
  const subcategoryData = getSubcategoryBreakdown();
  const investmentData = getInvestmentAllocation();

  const exportData = () => {
    const csvContent = [
      ["Date", "Description", "Category", "Subcategory", "Amount", "Type"],
      ...expenses.map(expense => [
        expense.date,
        expense.title,
        expense.category,
        expense.subcategory,
        expense.amount,
        "Expense"
      ]),
      ...income.map(inc => [
        inc.created_date,
        inc.source_name,
        inc.category,
        "",
        inc.amount,
        "Income"
      ]),
      ...investments.map(inv => [
        inv.created_date,
        `${inv.symbol} - ${inv.name}`,
        inv.sector,
        inv.investment_type,
        inv.shares * (inv.current_price || 0),
        "Investment"
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Dynamic Refresh */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy dark:text-white mb-2">
              Analytics & Reports
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Real-time insights into your financial performance
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {/* Date Filter */}
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                className="w-auto"
                placeholder="Start date"
              />
              <Input
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                className="w-auto"
                placeholder="End date"
              />
            </div>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>

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
              Refresh
            </Button>

            <Button onClick={exportData} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Monthly Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
                    <TrendingUp className="w-5 h-5" />
                    Income vs Expenses Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-600" />
                        <XAxis dataKey="month" stroke="#64748b" className="dark:stroke-gray-400" />
                        <YAxis stroke="#64748b" className="dark:stroke-gray-400" tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip
                          formatter={(value) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: 'var(--background, #fff)',
                            border: '1px solid var(--border, #ccc)',
                            borderRadius: '8px',
                            color: 'var(--foreground, #000)'
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} name="Income" />
                        <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} name="Expenses" />
                        <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={3} name="Net Savings" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium mb-1">Avg Monthly Income</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(monthlyTrends.length > 0 ? monthlyTrends.reduce((sum, m) => sum + m.income, 0) / monthlyTrends.length : 0)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium mb-1">Avg Monthly Expenses</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(monthlyTrends.length > 0 ? monthlyTrends.reduce((sum, m) => sum + m.expenses, 0) / monthlyTrends.length : 0)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-red-200 rotate-180" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium mb-1">Avg Monthly Savings</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(monthlyTrends.length > 0 ? monthlyTrends.reduce((sum, m) => sum + m.savings, 0) / monthlyTrends.length : 0)}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-8">
            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
                    <PieChart className="w-5 h-5" />
                    Spending by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [formatCurrency(value), 'Amount']}
                          contentStyle={{
                            backgroundColor: 'var(--background, #fff)',
                            border: '1px solid var(--border, #ccc)',
                            borderRadius: '8px',
                            color: 'var(--foreground, #000)'
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subcategory Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
                    <BarChart3 className="w-5 h-5" />
                    Top Spending Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={subcategoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-600" />
                        <XAxis type="number" stroke="#64748b" className="dark:stroke-gray-400" tickFormatter={(value) => formatCurrency(value)} />
                        <YAxis dataKey="name" type="category" stroke="#64748b" className="dark:stroke-gray-400" width={100} />
                        <Tooltip
                          formatter={(value) => [formatCurrency(value), 'Amount']}
                          contentStyle={{
                            backgroundColor: 'var(--background, #fff)',
                            border: '1px solid var(--border, #ccc)',
                            borderRadius: '8px',
                            color: 'var(--foreground, #000)'
                          }}
                        />
                        <Bar dataKey="amount" fill="#8b5cf6" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="investments" className="space-y-8">
            {investmentData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
                      <PieChart className="w-5 h-5" />
                      Portfolio Allocation by Sector
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={investmentData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                          >
                            {investmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [formatCurrency(value), 'Value']}
                            contentStyle={{
                              backgroundColor: 'var(--background, #fff)',
                              border: '1px solid var(--border, #ccc)',
                              borderRadius: '8px',
                              color: 'var(--foreground, #000)'
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
