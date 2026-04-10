
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Investment } from "@/entities/Investment";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Edit2,
  Trash2,
  BarChart3,
  PieChart as PieChartIcon, // Renamed to avoid conflict with recharts component (now removed)
} from "lucide-react";
import { useSettings } from "@/components/settings/SettingsProvider";

import InvestmentForm from "../components/investments/InvestmentForm";

export default function InvestmentsPage() {
  const { formatCurrency } = useSettings();
  const [investments, setInvestments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      const data = await Investment.list("-created_date");
      setInvestments(data);
    } catch (error) {
      console.error("Error loading investments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (investmentData) => {
    try {
      if (editingInvestment) {
        await Investment.update(editingInvestment.id, {
          ...investmentData,
          last_updated: new Date().toISOString(),
        });
      } else {
        await Investment.create({
          ...investmentData,
          last_updated: new Date().toISOString(),
        });
      }
      loadInvestments();
      setShowForm(false);
      setEditingInvestment(null);
    } catch (error) {
      console.error("Error saving investment:", error);
    }
  };

  const handleEdit = (investment) => {
    setEditingInvestment(investment);
    setShowForm(true);
  };

  const handleDelete = async (investment) => {
    if (confirm("Are you sure you want to delete this investment?")) {
      try {
        await Investment.delete(investment.id);
        loadInvestments();
      } catch (error) {
        console.error("Error deleting investment:", error);
      }
    }
  };

  const portfolioTotal = investments.reduce((sum, inv) => sum + (inv.shares * (inv.current_price || 0)), 0);
  const totalGainLoss = investments.reduce((sum, inv) => {
    const currentValue = inv.shares * (inv.current_price || 0);
    const purchaseValue = inv.shares * (inv.purchase_price || 0);
    return sum + (currentValue - purchaseValue);
  }, 0);
  const totalGainLossPercent = portfolioTotal > 0 ? (totalGainLoss / (portfolioTotal - totalGainLoss)) * 100 : 0;

  const sectorAllocation = investments.reduce((acc, inv) => {
    const value = inv.shares * (inv.current_price || 0);
    acc[inv.sector] = (acc[inv.sector] || 0) + value;
    return acc;
  }, {});

  const sectorColors = {
    technology: "#3b82f6",
    healthcare: "#10b981",
    finance: "#8b5cf6",
    energy: "#f59e0b",
    consumer: "#ef4444",
    industrial: "#6b7280",
    real_estate: "#06b6d4",
    utilities: "#84cc16",
    other: "#d1d5db"
  };

  const sectorData = Object.entries(sectorAllocation)
    .map(([sector, value]) => ({
      name: sector.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Re-added formatting for display
      value,
      percentage: portfolioTotal > 0 ? (value / portfolioTotal) * 100 : 0,
      color: sectorColors[sector] || "#d1d5db"
    }))
    .sort((a, b) => b.value - a.value);


  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy dark:text-white mb-2">
              Investments
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Track your investment portfolio performance
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary-sage hover:bg-primary-sage/90 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Investment
          </Button>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Portfolio Value</p>
                    <p className="text-3xl font-bold">{formatCurrency(portfolioTotal)}</p>
                  </div>
                  <Wallet className="w-12 h-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className={`bg-gradient-to-r ${totalGainLoss >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600'} text-white border-0 shadow-lg`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium mb-1 ${totalGainLoss >= 0 ? 'text-emerald-100' : 'text-red-100'}`}>Total Gain/Loss</p>
                    <p className="text-3xl font-bold">{formatCurrency(totalGainLoss)}</p>
                  </div>
                  {totalGainLoss >= 0 ? (
                    <TrendingUp className="w-12 h-12 text-emerald-200" />
                  ) : (
                    <TrendingDown className="w-12 h-12 text-red-200" />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium mb-1">Total Return</p>
                    <p className={`text-3xl font-bold ${totalGainLossPercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {totalGainLossPercent.toFixed(2)}%
                    </p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Portfolio Table and Allocation Chart */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
                    <Wallet className="w-5 h-5" />
                    Portfolio Holdings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Shares</TableHead>
                          <TableHead>Avg. Price</TableHead>
                          <TableHead>Current Price</TableHead>
                          <TableHead>Market Value</TableHead>
                          <TableHead>Gain/Loss</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {investments.map((inv) => {
                          const marketValue = inv.shares * (inv.current_price || 0);
                          const gainLoss = (inv.current_price - (inv.purchase_price || 0)) * inv.shares;
                          return (
                            <TableRow key={inv.id}>
                              <TableCell className="font-medium">{inv.symbol}</TableCell>
                              <TableCell>{inv.shares?.toLocaleString()}</TableCell>
                              <TableCell>{formatCurrency(inv.purchase_price)}</TableCell>
                              <TableCell>{formatCurrency(inv.current_price)}</TableCell>
                              <TableCell>{formatCurrency(marketValue)}</TableCell>
                              <TableCell className={gainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                {formatCurrency(gainLoss)}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => handleEdit(inv)} className="w-8 h-8 text-neutral-400 hover:text-blue-600">
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDelete(inv)} className="w-8 h-8 text-neutral-400 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  {investments.length === 0 && (
                     <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                        No investments added yet.
                     </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
                    <PieChartIcon className="w-5 h-5" />
                    Sector Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sectorData.length > 0 ? (
                    <div className="space-y-4">
                      {sectorData.map(sector => (
                        <div key={sector.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                            <span className="capitalize">{sector.name}</span>
                          </div>
                          <span className="font-semibold text-neutral-900 dark:text-white">{sector.percentage.toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                      No sector data available.
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {investments.length === 0 && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 col-span-full">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-dashed border-neutral-200 dark:border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BarChart3 className="w-16 h-16 text-neutral-400 dark:text-neutral-500 mb-4" />
                <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-300 mb-2">No Investments Yet</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-center mb-6 max-w-md">
                  Add your investments to start tracking your portfolio performance.
                </p>
                <Button onClick={() => setShowForm(true)} className="bg-primary-sage hover:bg-primary-sage/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Investment
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <InvestmentForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingInvestment(null);
            }}
            initialData={editingInvestment}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
