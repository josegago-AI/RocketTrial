import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  X,
  Check
} from "lucide-react";
import { Income, Expense } from "@/entities/all";

export default function QuickAddFAB({ onTransactionAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    subcategory: "other"
  });

  const resetForm = () => {
    setFormData({
      title: "",
      amount: "",
      category: "",
      subcategory: "other"
    });
    setTransactionType(null);
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) return;

    setIsSubmitting(true);
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date().toISOString().slice(0, 10)
      };

      if (transactionType === 'income') {
        await Income.create({
          source_name: transactionData.title,
          amount: transactionData.amount,
          category: transactionData.category,
          frequency: 'monthly',
          is_active: true
        });
      } else {
        await Expense.create(transactionData);
      }

      onTransactionAdded?.();
      resetForm();
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* FAB Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-primary-sage hover:bg-primary-sage/90 shadow-xl"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-6 h-6 text-white" />
          </motion.div>
        </Button>
      </motion.div>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Quick Add
                    </h3>
                    <Button variant="ghost" size="icon" onClick={resetForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {!transactionType ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        What would you like to add?
                      </p>
                      <Button
                        onClick={() => {
                          setTransactionType('income');
                          setFormData({...formData, category: 'primary'});
                        }}
                        variant="outline"
                        className="w-full justify-start gap-3 h-12"
                      >
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        <span>Add Income</span>
                      </Button>
                      <Button
                        onClick={() => {
                          setTransactionType('expense');
                          setFormData({...formData, category: 'needs'});
                        }}
                        variant="outline"
                        className="w-full justify-start gap-3 h-12"
                      >
                        <TrendingDown className="w-5 h-5 text-red-500" />
                        <span>Add Expense</span>
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        placeholder={transactionType === 'income' ? "Income source..." : "Expense description..."}
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                      
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Amount"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        required
                      />

                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({...formData, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {transactionType === 'income' ? (
                            <>
                              <SelectItem value="primary">Primary Income</SelectItem>
                              <SelectItem value="secondary">Secondary Income</SelectItem>
                              <SelectItem value="passive">Passive Income</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="needs">Needs</SelectItem>
                              <SelectItem value="wants">Wants</SelectItem>
                              <SelectItem value="savings">Savings</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>

                      <div className="flex gap-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setTransactionType(null)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting || !formData.title || !formData.amount}
                          className="flex-1 bg-primary-sage hover:bg-primary-sage/90"
                        >
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}