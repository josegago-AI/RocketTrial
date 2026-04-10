
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useSettings } from "@/components/settings/SettingsProvider";

export default function RecentTransactions({ expenses = [], income = [] }) {
  const { formatCurrency, formatDate } = useSettings();

  // Combine and sort recent transactions
  const allTransactions = [
    ...expenses.slice(0, 5).map(expense => ({
      ...expense,
      type: 'expense',
      icon: ArrowDownLeft,
      color: 'text-red-500'
    })),
    ...income.slice(0, 3).map(inc => ({
      ...inc,
      title: inc.source_name,
      type: 'income',
      icon: ArrowUpRight,
      color: 'text-emerald-500',
      date: inc.created_date
    }))
  ].sort((a, b) => new Date(b.date || b.created_date) - new Date(a.date || a.created_date))
   .slice(0, 6);

  const getCategoryColor = (category) => {
    const colors = {
      needs: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      wants: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      savings: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
      primary: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      secondary: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary-navy dark:text-white">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allTransactions.map((transaction, index) => (
              <motion.div
                key={`${transaction.type}-${transaction.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50/50 dark:bg-gray-700/30 hover:bg-neutral-100/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center ${transaction.color}`}>
                  <transaction.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 dark:text-white truncate">
                    {transaction.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {transaction.category && (
                      <Badge className={getCategoryColor(transaction.category)} variant="secondary">
                        {transaction.category}
                      </Badge>
                    )}
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatDate(transaction.date || transaction.created_date)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {allTransactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-500 dark:text-neutral-400">No recent transactions</p>
                <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">Add income or expenses to see activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
