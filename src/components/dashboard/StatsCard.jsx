
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useSettings } from "@/components/settings/SettingsProvider";

export default function StatsCard({ 
  title, 
  amount, 
  change, 
  changeType = "positive",
  icon: Icon,
  color = "blue",
  index = 0 
}) {
  const { formatCurrency } = useSettings();

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600", 
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 card-hover bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
              {typeof amount === 'string' ? amount : formatCurrency(amount)}
            </p>
            {change && (
              <div className="flex items-center gap-1">
                {changeType === "positive" ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  changeType === "positive" ? "text-emerald-500" : "text-red-500"
                }`}>
                  {change}%
                </span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
