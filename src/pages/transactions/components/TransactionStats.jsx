import React from 'react';
import Icon from '../../../components/AppIcon';

const TransactionStats = ({ transactions }) => {
  const calculateStats = () => {
    const currentMonth = new Date()?.getMonth();
    const currentYear = new Date()?.getFullYear();
    
    const currentMonthTransactions = transactions?.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate?.getMonth() === currentMonth && 
             transactionDate?.getFullYear() === currentYear;
    });

    const totalIncome = currentMonthTransactions?.filter(t => t?.type === 'income')?.reduce((sum, t) => sum + Math.abs(t?.amount), 0);

    const totalExpenses = currentMonthTransactions?.filter(t => t?.type === 'expense')?.reduce((sum, t) => sum + Math.abs(t?.amount), 0);

    const netIncome = totalIncome - totalExpenses;

    const transactionCount = currentMonthTransactions?.length;

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      transactionCount
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const getNetIncomeColor = () => {
    if (stats?.netIncome > 0) return 'text-success';
    if (stats?.netIncome < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getNetIncomeIcon = () => {
    if (stats?.netIncome > 0) return 'TrendingUp';
    if (stats?.netIncome < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Income */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-semibold text-success">
              {formatCurrency(stats?.totalIncome)}
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg">
            <Icon name="TrendingUp" size={24} className="text-success" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Icon name="Calendar" size={14} className="mr-1" />
          This month
        </div>
      </div>
      {/* Total Expenses */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-semibold text-error">
              {formatCurrency(stats?.totalExpenses)}
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-error/10 rounded-lg">
            <Icon name="TrendingDown" size={24} className="text-error" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Icon name="Calendar" size={14} className="mr-1" />
          This month
        </div>
      </div>
      {/* Net Income */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Net Income</p>
            <p className={`text-2xl font-semibold ${getNetIncomeColor()}`}>
              {formatCurrency(stats?.netIncome)}
            </p>
          </div>
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
            stats?.netIncome > 0 ? 'bg-success/10' : 
            stats?.netIncome < 0 ? 'bg-error/10' : 'bg-muted/10'
          }`}>
            <Icon 
              name={getNetIncomeIcon()} 
              size={24} 
              className={getNetIncomeColor()} 
            />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Icon name="Calculator" size={14} className="mr-1" />
          Income - Expenses
        </div>
      </div>
      {/* Transaction Count */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-semibold text-foreground">
              {stats?.transactionCount}
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
            <Icon name="Receipt" size={24} className="text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Icon name="Calendar" size={14} className="mr-1" />
          This month
        </div>
      </div>
    </div>
  );
};

export default TransactionStats;