
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SavingsGoal } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Plus, 
  Edit2, 
  Trash2,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp
} from "lucide-react";
import { useSettings } from "@/components/settings/SettingsProvider";
import { differenceInDays } from "date-fns";

export default function GoalsPage() {
  const { formatCurrency, formatDate } = useSettings();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [addingAmount, setAddingAmount] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    target_amount: "",
    target_date: "",
    category: "other",
    priority: "medium"
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await SavingsGoal.list("-created_date");
      setGoals(data);
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const goalData = {
        ...formData,
        target_amount: parseFloat(formData.target_amount) || 0
      };

      if (editingGoal) {
        await SavingsGoal.update(editingGoal.id, goalData);
      } else {
        await SavingsGoal.create(goalData);
      }
      
      loadGoals();
      resetForm();
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  const handleAddAmount = async (goal, amount) => {
    try {
      const newAmount = (goal.current_amount || 0) + parseFloat(amount);
      await SavingsGoal.update(goal.id, {
        ...goal,
        current_amount: newAmount
      });
      loadGoals();
      setAddingAmount(null);
    }
    catch (error) {
      console.error("Error adding amount:", error);
    }
  };

  const handleDelete = async (goal) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await SavingsGoal.delete(goal.id);
        loadGoals();
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      target_amount: "",
      target_date: "",
      category: "other",
      priority: "medium"
    });
    setShowForm(false);
    setEditingGoal(null);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      emergency: "🛡️",
      vacation: "✈️",
      home: "🏠",
      car: "🚗",
      education: "🎓",
      retirement: "🏖️",
      other: "🎯"
    };
    return icons[category] || icons.other;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return colors[priority] || colors.medium;
  };

  const calculateProgress = (goal) => {
    return goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
  };

  const getDaysRemaining = (targetDate) => {
    return differenceInDays(new Date(targetDate), new Date());
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
              Savings Goals
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Set and track your financial objectives
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-primary-sage hover:bg-primary-sage/90 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Goal
          </Button>
        </motion.div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {goals.map((goal, index) => {
              const progress = calculateProgress(goal);
              const daysRemaining = getDaysRemaining(goal.target_date);
              const isCompleted = progress >= 100;
              const isOverdue = daysRemaining < 0 && !isCompleted;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`card-hover bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg ${
                    isCompleted ? 'ring-2 ring-emerald-200 dark:ring-emerald-700' : 
                    isOverdue ? 'ring-2 ring-red-200 dark:ring-red-700' : ''
                  }`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100 truncate">
                              {goal.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getPriorityColor(goal.priority)} variant="secondary">
                                {goal.priority}
                              </Badge>
                              {isCompleted && (
                                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-100">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Complete
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingGoal(goal);
                              setFormData({
                                title: goal.title,
                                target_amount: goal.target_amount.toString(),
                                target_date: goal.target_date,
                                category: goal.category,
                                priority: goal.priority
                              });
                              setShowForm(true);
                            }}
                            className="w-8 h-8 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(goal)}
                            className="w-8 h-8 text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600 dark:text-neutral-300">Progress</span>
                          <span className="font-medium text-neutral-800 dark:text-neutral-100">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={Math.min(progress, 100)} className="h-2" />
                        <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
                          <span>{formatCurrency(goal.current_amount)}</span>
                          <span>{formatCurrency(goal.target_amount)}</span>
                        </div>
                      </div>

                      {/* Time remaining */}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <span className={`${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-neutral-600 dark:text-neutral-300'}`}>
                          {isOverdue ? 
                            `Overdue by ${Math.abs(daysRemaining)} days` :
                            `${daysRemaining} days remaining`
                          }
                        </span>
                      </div>

                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Target: {formatDate(goal.target_date)}
                      </div>

                      {/* Add amount button */}
                      {!isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddingAmount(goal.id)}
                          className="w-full mt-4"
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Add Progress
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {goals.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full"
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-dashed border-neutral-200 dark:border-neutral-700">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Target className="w-16 h-16 text-neutral-400 mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
                    No Goals Set Yet
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-center mb-6 max-w-md">
                    Create your first savings goal to start tracking your financial objectives
                  </p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-primary-sage hover:bg-primary-sage/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Goal
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Goal Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <Card className="w-full max-w-md bg-white dark:bg-gray-900 dark:text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
                    <Target className="w-5 h-5" />
                    {editingGoal ? "Edit Goal" : "Create New Goal"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="dark:text-neutral-300">Goal Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Emergency Fund, Vacation, New Car"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                        className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target_amount" className="dark:text-neutral-300">Target Amount</Label>
                      <Input
                        id="target_amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.target_amount}
                        onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                        required
                        className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target_date" className="dark:text-neutral-300">Target Date</Label>
                      <Input
                        id="target_date"
                        type="date"
                        value={formData.target_date}
                        onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                        required
                        className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="dark:text-neutral-300">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                          <SelectTrigger className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="vacation">Vacation</SelectItem>
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="retirement">Retirement</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority" className="dark:text-neutral-300">Priority</Label>
                        <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                          <SelectTrigger className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={resetForm} className="flex-1 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 bg-primary-sage hover:bg-primary-sage/90">
                        {editingGoal ? "Update" : "Create"} Goal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Amount Modal */}
        <AnimatePresence>
          {addingAmount && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <Card className="w-full max-w-sm bg-white dark:bg-gray-900 dark:text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
                    <TrendingUp className="w-5 h-5" />
                    Add Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const amount = new FormData(e.target).get('amount');
                    const goal = goals.find(g => g.id === addingAmount);
                    if (goal && amount) {
                      handleAddAmount(goal, amount);
                    }
                  }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="dark:text-neutral-300">Amount to Add</Label>
                      <Input
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        autoFocus
                        required
                        className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setAddingAmount(null)} 
                        className="flex-1 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 bg-primary-sage hover:bg-primary-sage/90">
                        Add Amount
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
