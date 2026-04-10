
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Income } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  Edit2, 
  Trash2,
  DollarSign,
  BarChart3
} from "lucide-react";
import { useSettings } from "@/components/settings/SettingsProvider";

import IncomeForm from "../components/income/IncomeForm";

export default function IncomePage() {
  const { formatCurrency } = useSettings();
  const [income, setIncome] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIncome();
  }, []);

  const loadIncome = async () => {
    try {
      const data = await Income.list("-created_date");
      setIncome(data);
    } catch (error) {
      console.error("Error loading income:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (incomeData) => {
    try {
      if (editingIncome) {
        await Income.update(editingIncome.id, incomeData);
      } else {
        await Income.create(incomeData);
      }
      loadIncome();
      setShowForm(false);
      setEditingIncome(null);
    } catch (error) {
      console.error("Error saving income:", error);
    }
  };

  const handleEdit = (incomeItem) => {
    setEditingIncome(incomeItem);
    setShowForm(true);
  };

  const handleDelete = async (incomeItem) => {
    if (confirm("Are you sure you want to delete this income source?")) {
      try {
        await Income.delete(incomeItem.id);
        loadIncome();
      } catch (error) {
        console.error("Error deleting income:", error);
      }
    }
  };

  const calculateMonthlyTotal = () => {
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

  const getCategoryColor = (category) => {
    const colors = {
      primary: "bg-emerald-100 text-emerald-800",
      secondary: "bg-blue-100 text-blue-800",
      passive: "bg-purple-100 text-purple-800",
      other: "bg-gray-100 text-gray-800"
    };
    return colors[category] || colors.other;
  };

  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'weekly': return "📅";
      case 'bi-weekly': return "🗓️";
      case 'annual': return "📆";
      default: return "📊";
    }
  };

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy dark:text-white mb-2">
              Income Sources
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Track and manage all your income streams
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-primary-sage hover:bg-primary-sage/90 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Income Source
          </Button>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-lg font-medium mb-2">
                    Total Monthly Income
                  </p>
                  <p className="text-4xl font-bold">
                    {formatCurrency(calculateMonthlyTotal())}
                  </p>
                  <p className="text-emerald-100 text-sm mt-2">
                    From {income.filter(inc => inc.is_active).length} active sources
                  </p>
                </div>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-10 h-10" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {income.map((incomeItem, index) => (
              <motion.div
                key={incomeItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`card-hover bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg ${!incomeItem.is_active ? 'opacity-60' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-neutral-900 truncate">
                            {incomeItem.source_name}
                          </h3>
                          <Badge className={getCategoryColor(incomeItem.category)} variant="secondary">
                            {incomeItem.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(incomeItem)}
                          className="w-8 h-8 text-neutral-400 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon" 
                          onClick={() => handleDelete(incomeItem)}
                          className="w-8 h-8 text-neutral-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                          {formatCurrency(incomeItem.amount)}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                          <span>{getFrequencyIcon(incomeItem.frequency)}</span>
                          <span>{incomeItem.frequency}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t dark:border-gray-700">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Monthly equivalent</p>
                        <p className="text-lg font-semibold text-primary-sage">
                          {formatCurrency((() => {
                            const amount = incomeItem.amount || 0;
                            switch (incomeItem.frequency) {
                              case 'weekly': return (amount * 4.33);
                              case 'bi-weekly': return (amount * 2.17);
                              case 'annual': return (amount / 12);
                              default: return amount;
                            }
                          })())}
                        </p>
                      </div>

                      {!incomeItem.is_active && (
                        <Badge variant="outline" className="w-full justify-center mt-2 text-orange-600 border-orange-200">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {income.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full"
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-dashed border-neutral-200">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BarChart3 className="w-16 h-16 text-neutral-400 mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-600 dark:text-white mb-2">
                    No Income Sources Yet
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-center mb-6 max-w-md">
                    Start by adding your income sources to track your financial progress
                  </p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-primary-sage hover:bg-primary-sage/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Income Source
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Income Form Modal */}
      <AnimatePresence>
        {showForm && (
          <IncomeForm
            initialData={editingIncome}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingIncome(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
