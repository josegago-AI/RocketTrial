
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Receipt } from "lucide-react";
import CategorySelector from "../ui/category-selector";
import { useSettings } from "@/components/settings/SettingsProvider";

export default function ExpenseForm({ onSubmit, onCancel, initialData = null }) {
  const { settings } = useSettings();
  const [formData, setFormData] = useState(initialData || {
    title: "",
    amount: "",
    category: "needs",
    subcategory: "other",
    date: new Date().toISOString().slice(0, 10),
    is_recurring: false,
    notes: ""
  });
  const [showQuickSelect, setShowQuickSelect] = useState(!initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount) || 0
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuickSelect = (preset) => {
    setFormData(prev => ({
      ...prev,
      ...preset
    }));
    setShowQuickSelect(false);
  };
  
  const handleQuickAddAmount = (amountToAdd) => {
    const currentAmount = parseFloat(formData.amount) || 0;
    handleChange('amount', (currentAmount + amountToAdd).toString());
  };

  const getSubcategories = (category) => {
    const subcategories = {
      needs: ["rent", "groceries", "utilities", "transportation", "healthcare", "other"],
      wants: ["dining", "entertainment", "shopping", "subscriptions", "other"],
      savings: ["emergency_fund", "investments", "retirement", "other"]
    };
    return subcategories[category] || [];
  };

  const quickAmounts = [1, 5, 10, 50, 100, 500];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
              <Receipt className="w-5 h-5" />
              {initialData ? "Edit Expense" : "Add Expense"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showQuickSelect && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quick Select Category
              </h3>
              <CategorySelector
                type="expense"
                selectedCategory={formData.category}
                onSelect={handleQuickSelect}
              />
              <Button
                variant="ghost"
                onClick={() => setShowQuickSelect(false)}
                className="w-full mt-4 text-gray-600 dark:text-gray-400"
              >
                Or fill manually
              </Button>
            </div>
          )}

          {!showQuickSelect && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Description</Label>
                <Input
                  id="title"
                  placeholder="e.g., Coffee, Train ticket"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount ({settings.currency})</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Quick Add Amount</Label>
                <div className="flex flex-wrap gap-2">
                  {quickAmounts.map(amount => (
                    <motion.div key={amount} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleQuickAddAmount(amount)}
                      >
                        + {settings.currency}{amount}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="needs">Needs</SelectItem>
                      <SelectItem value="wants">Wants</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select value={formData.subcategory} onValueChange={(value) => handleChange('subcategory', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategories(formData.category).map(sub => (
                        <SelectItem key={sub} value={sub}>
                          {sub.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Any extra details..."
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_recurring" 
                  checked={formData.is_recurring}
                  onCheckedChange={(checked) => handleChange('is_recurring', checked)}
                />
                <Label htmlFor="is_recurring">This is a recurring expense</Label>
              </div>

              {!initialData && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowQuickSelect(true)}
                  className="w-full"
                >
                  ← Back to Quick Select
                </Button>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary-sage hover:bg-primary-sage/90 text-white">
                  {initialData ? "Update" : "Add"} Expense
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
