import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransactions = () => {
  const recentTransactions = [
    {
      id: 1,
      description: "Starbucks Coffee",
      category: "Food & Dining",
      amount: -5.67,
      date: "2025-09-15",
      type: "expense",
      icon: "Coffee",
      iconColor: "bg-amber-500"
    },
    {
      id: 2,
      description: "Salary Deposit",
      category: "Income",
      amount: 4800.00,
      date: "2025-09-14",
      type: "income",
      icon: "DollarSign",
      iconColor: "bg-green-500"
    },
    {
      id: 3,
      description: "Electric Bill",
      category: "Utilities",
      amount: -89.23,
      date: "2025-09-13",
      type: "expense",
      icon: "Zap",
      iconColor: "bg-yellow-500"
    },
    {
      id: 4,
      description: "Grocery Store",
      category: "Food & Dining",
      amount: -156.78,
      date: "2025-09-12",
      type: "expense",
      icon: "ShoppingCart",
      iconColor: "bg-blue-500"
    },
    {
      id: 5,
      description: "Gas Station",
      category: "Transportation",
      amount: -45.00,
      date: "2025-09-11",
      type: "expense",
      icon: "Car",
      iconColor: "bg-red-500"
    },
    {
      id: 6,
      description: "Netflix Subscription",
      category: "Entertainment",
      amount: -15.99,
      date: "2025-09-10",
      type: "expense",
      icon: "Play",
      iconColor: "bg-purple-500"
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    if (date?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <Link to="/transactions">
          <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
            View All
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {recentTransactions?.map((transaction) => (
          <div key={transaction?.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-smooth">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction?.iconColor}`}>
                <Icon name={transaction?.icon} size={18} color="white" />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{transaction?.description}</p>
                <p className="text-xs text-muted-foreground">{transaction?.category}</p>
              </div>
            </div>

            <div className="text-right">
              <p className={`text-sm font-semibold ${
                transaction?.type === 'income' ? 'text-success' : 'text-foreground'
              }`}>
                {transaction?.type === 'income' ? '+' : '-'}{formatCurrency(transaction?.amount)}
              </p>
              <p className="text-xs text-muted-foreground">{formatDate(transaction?.date)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="outline" fullWidth iconName="Plus" iconPosition="left">
          Add New Transaction
        </Button>
      </div>
    </div>
  );
};

export default RecentTransactions;