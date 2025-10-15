import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetStatusWidget = () => {
  const budgetCategories = [
    {
      id: 1,
      name: "Food & Dining",
      spent: 456.78,
      budget: 600.00,
      icon: "Utensils",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Transportation",
      spent: 234.50,
      budget: 300.00,
      icon: "Car",
      color: "bg-green-500"
    },
    {
      id: 3,
      name: "Entertainment",
      spent: 189.99,
      budget: 150.00,
      icon: "Play",
      color: "bg-purple-500"
    },
    {
      id: 4,
      name: "Shopping",
      spent: 345.67,
      budget: 400.00,
      icon: "ShoppingBag",
      color: "bg-pink-500"
    },
    {
      id: 5,
      name: "Utilities",
      spent: 267.89,
      budget: 350.00,
      icon: "Zap",
      color: "bg-yellow-500"
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const getProgressPercentage = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getStatusColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'bg-error';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-accent';
  };

  const getStatusText = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'Over Budget';
    if (percentage >= 80) return 'Near Limit';
    return 'On Track';
  };

  const totalSpent = budgetCategories?.reduce((sum, category) => sum + category?.spent, 0);
  const totalBudget = budgetCategories?.reduce((sum, category) => sum + category?.budget, 0);

  return (
    <div className="bg-card rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Budget Status</h3>
        <Link to="/budgets">
          <Button variant="ghost" size="sm" iconName="Settings" iconPosition="right">
            Manage
          </Button>
        </Link>
      </div>
      {/* Overall Budget Summary */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Total Monthly Budget</span>
          <span className="text-sm text-muted-foreground">
            {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
          </span>
        </div>
        <div className="w-full bg-background rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(totalSpent, totalBudget)}`}
            style={{ width: `${getProgressPercentage(totalSpent, totalBudget)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs font-medium ${
            getProgressPercentage(totalSpent, totalBudget) >= 100 ? 'text-error' : 
            getProgressPercentage(totalSpent, totalBudget) >= 80 ? 'text-warning' : 'text-accent'
          }`}>
            {getStatusText(totalSpent, totalBudget)}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(getProgressPercentage(totalSpent, totalBudget))}% used
          </span>
        </div>
      </div>
      {/* Category Breakdown */}
      <div className="space-y-4">
        {budgetCategories?.slice(0, 4)?.map((category) => {
          const percentage = getProgressPercentage(category?.spent, category?.budget);
          const isOverBudget = category?.spent > category?.budget;
          
          return (
            <div key={category?.id} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category?.color}`}>
                <Icon name={category?.icon} size={14} color="white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{category?.name}</span>
                  <span className={`text-xs font-medium ${isOverBudget ? 'text-error' : 'text-muted-foreground'}`}>
                    {formatCurrency(category?.spent)} / {formatCurrency(category?.budget)}
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${getStatusColor(category?.spent, category?.budget)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="outline" fullWidth iconName="Plus" iconPosition="left">
          Create New Budget
        </Button>
      </div>
    </div>
  );
};

export default BudgetStatusWidget;