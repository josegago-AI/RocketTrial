
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Expense } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Receipt, 
  Edit2, 
  Trash2,
  Calendar,
  TrendingDown
} from "lucide-react";
import { parseISO } from "date-fns";
import { useSettings } from "@/components/settings/SettingsProvider";

import ExpenseForm from "../components/expenses/ExpenseForm";
import BatchActionsToolbar from "../components/ui/batch-actions-toolbar";
import AdvancedFilters from "../components/ui/advanced-filters";
import QuickAddFAB from "../components/ui/quick-add-fab";

export default function ExpensesPage() {
  const { formatCurrency, formatDate } = useSettings();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    subcategory: "",
    dateRange: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    sortBy: "date",
    sortOrder: "desc"
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const filterAndSortExpenses = useCallback(() => {
    let filtered = [...expenses];

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(exp => exp.category === activeTab);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(exp => 
        exp.title?.toLowerCase().includes(searchLower) ||
        exp.notes?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }

    // Apply date range filter
    if (filters.startDate && filters.endDate) {
      const startDate = parseISO(filters.startDate);
      const endDate = parseISO(filters.endDate);
      filtered = filtered.filter(exp => {
        const expenseDate = parseISO(exp.date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });
    }

    // Apply amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter(exp => (exp.amount || 0) >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(exp => (exp.amount || 0) <= parseFloat(filters.maxAmount));
    }

    // Sort expenses
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case "amount":
          aValue = a.amount || 0;
          bValue = b.amount || 0;
          break;
        case "title":
          aValue = a.title || "";
          bValue = b.title || "";
          break;
        case "category":
          aValue = a.category || "";
          bValue = b.category || "";
          break;
        default: // date
          aValue = new Date(a.date || a.created_date);
          bValue = new Date(b.date || b.created_date);
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredExpenses(filtered);
    
    // Clear selected expenses if they're no longer visible
    setSelectedExpenses(prev => 
      prev.filter(id => filtered.some(exp => exp.id === id))
    );
  }, [expenses, activeTab, filters]); // Added expenses, activeTab, filters to dependencies

  useEffect(() => {
    filterAndSortExpenses();
  }, [filterAndSortExpenses]); // Now depends on the memoized function

  const loadExpenses = async () => {
    try {
      const data = await Expense.list("-date");
      setExpenses(data);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (expenseData) => {
    try {
      if (editingExpense) {
        await Expense.update(editingExpense.id, expenseData);
      } else {
        await Expense.create(expenseData);
      }
      loadExpenses();
      setShowForm(false);
      setEditingExpense(null);
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (expense) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        await Expense.delete(expense.id);
        loadExpenses();
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const handleBatchDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedExpenses.length} expenses?`)) {
      try {
        await Promise.all(selectedExpenses.map(id => Expense.delete(id)));
        loadExpenses();
        setSelectedExpenses([]);
      } catch (error) {
        console.error("Error deleting expenses:", error);
      }
    }
  };

  const handleBatchEdit = (action) => {
    console.log("Batch edit:", action, selectedExpenses);
    // Implementation for batch edit would go here
  };

  const handleSelectExpense = (expenseId, checked) => {
    if (checked) {
      setSelectedExpenses(prev => [...prev, expenseId]);
    } else {
      setSelectedExpenses(prev => prev.filter(id => id !== expenseId));
    }
  };

  const handleSelectAll = () => {
    setSelectedExpenses(filteredExpenses.map(exp => exp.id));
  };

  const handleDeselectAll = () => {
    setSelectedExpenses([]);
  };

  const getCategoryTotals = useMemo(() => {
    const totals = {
      needs: 0,
      wants: 0,
      savings: 0,
      all: 0
    };

    expenses.forEach(expense => {
      const amount = expense.amount || 0;
      totals[expense.category] += amount;
      totals.all += amount;
    });

    return totals;
  }, [expenses]);

  const getCategoryColor = (category) => {
    const colors = {
      needs: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
      wants: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
      savings: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getSubcategoryIcon = (subcategory) => {
    const icons = {
      rent: "🏠", groceries: "🛒", utilities: "⚡", transportation: "🚗",
      healthcare: "🏥", dining: "🍽️", entertainment: "🎬", shopping: "🛍️",
      subscriptions: "📱", emergency_fund: "🛡️", investments: "📈",
      retirement: "🏖️", other: "📋"
    };
    return icons[subcategory] || "📋";
  };

  const categoryTotals = getCategoryTotals;

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
              Expenses
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Track and categorize all your spending
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-primary-sage hover:bg-primary-sage/90 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium mb-1">Total Expenses</p>
                    <p className="text-2xl font-bold">{formatCurrency(categoryTotals.all)}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {["needs", "wants", "savings"].map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium mb-1 capitalize">
                        {category}
                      </p>
                      <p className="text-xl font-bold text-neutral-900 dark:text-white">
                        {formatCurrency(categoryTotals[category])}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      category === 'needs' ? 'bg-blue-500' :
                      category === 'wants' ? 'bg-purple-500' : 'bg-emerald-500'
                    }`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            type="expenses"
            categories={["needs", "wants", "savings"]}
          />
        </motion.div>

        {/* Batch Actions */}
        <BatchActionsToolbar
          selectedItems={selectedExpenses}
          totalItems={filteredExpenses.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onBatchDelete={handleBatchDelete}
          onBatchEdit={handleBatchEdit}
          type="expenses"
        />

        {/* Tabs and Expense List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
                <Receipt className="w-5 h-5" />
                Expense History ({filteredExpenses.length})
              </CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="needs">Needs</TabsTrigger>
                  <TabsTrigger value="wants">Wants</TabsTrigger>
                  <TabsTrigger value="savings">Savings</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredExpenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-neutral-50/50 dark:bg-gray-700/30 rounded-xl hover:bg-neutral-100/50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedExpenses.includes(expense.id)}
                        onCheckedChange={(checked) => handleSelectExpense(expense.id, checked)}
                      />

                      <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-lg">
                          {getSubcategoryIcon(expense.subcategory)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-neutral-900 dark:text-white truncate">
                            {expense.title}
                          </h3>
                          <p className="text-lg font-bold text-red-600 dark:text-red-500 ml-4">
                            -{formatCurrency(expense.amount)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getCategoryColor(expense.category)} variant="secondary">
                            {expense.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs dark:border-gray-600">
                            {expense.subcategory?.replace(/_/g, ' ')}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(expense.date)}</span>
                          </div>
                          {expense.is_recurring && (
                            <Badge variant="outline" className="text-xs text-blue-600 dark:text-blue-400">
                              Recurring
                            </Badge>
                          )}
                        </div>
                        
                        {expense.notes && (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                            {expense.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(expense)}
                          className="w-8 h-8 text-neutral-400 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(expense)}
                          className="w-8 h-8 text-neutral-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredExpenses.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <Receipt className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                      {filters.search || filters.category || activeTab !== "all" ? 
                        "No matching expenses found" : 
                        "No expenses yet"
                      }
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-500 mb-4">
                      {filters.search || filters.category ? 
                        "Try adjusting your filters to see more results" :
                        "Start tracking your spending to better manage your budget"
                      }
                    </p>
                    <Button 
                      onClick={() => setShowForm(true)}
                      className="bg-primary-sage hover:bg-primary-sage/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Expense
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Expense Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ExpenseForm
            initialData={editingExpense}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Quick Add FAB */}
      <QuickAddFAB onTransactionAdded={loadExpenses} />
    </div>
  );
}
