import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const categoryPresets = {
  expense: {
    needs: [
      { name: "Rent/Mortgage", subcategory: "rent", emoji: "🏠" },
      { name: "Groceries", subcategory: "groceries", emoji: "🛒" },
      { name: "Utilities", subcategory: "utilities", emoji: "⚡" },
      { name: "Transportation", subcategory: "transportation", emoji: "🚗" },
      { name: "Healthcare", subcategory: "healthcare", emoji: "🏥" }
    ],
    wants: [
      { name: "Dining Out", subcategory: "dining", emoji: "🍽️" },
      { name: "Entertainment", subcategory: "entertainment", emoji: "🎬" },
      { name: "Shopping", subcategory: "shopping", emoji: "🛍️" },
      { name: "Subscriptions", subcategory: "subscriptions", emoji: "📱" }
    ],
    savings: [
      { name: "Emergency Fund", subcategory: "emergency_fund", emoji: "🛡️" },
      { name: "Investments", subcategory: "investments", emoji: "📈" },
      { name: "Retirement", subcategory: "retirement", emoji: "🏖️" }
    ]
  },
  income: [
    { name: "Salary", category: "primary", emoji: "💼" },
    { name: "Freelance", category: "secondary", emoji: "💻" },
    { name: "Side Hustle", category: "secondary", emoji: "🚀" },
    { name: "Investments", category: "passive", emoji: "📈" },
    { name: "Rental Income", category: "passive", emoji: "🏠" }
  ]
};

export default function CategorySelector({ type, selectedCategory, onSelect, className = "" }) {
  if (type === "income") {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${className}`}>
        {categoryPresets.income.map((preset) => (
          <motion.div key={preset.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={() => onSelect({
                title: preset.name,
                category: preset.category
              })}
              className="w-full h-16 flex flex-col gap-1 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
            >
              <span className="text-lg">{preset.emoji}</span>
              <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{preset.name}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    );
  }

  const categoryGroups = selectedCategory ? [selectedCategory] : Object.keys(categoryPresets.expense);

  return (
    <div className={`space-y-4 ${className}`}>
      {categoryGroups.map((category) => (
        <div key={category}>
          {!selectedCategory && (
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
              {category}
            </h4>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categoryPresets.expense[category]?.map((preset) => (
              <motion.div key={preset.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={() => onSelect({
                    title: preset.name,
                    category,
                    subcategory: preset.subcategory
                  })}
                  className="w-full h-16 flex flex-col gap-1 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
                >
                  <span className="text-lg">{preset.emoji}</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{preset.name}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}