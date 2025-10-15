import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetSummary = ({ budgets }) => {
  const totalAllocated = budgets?.reduce((sum, budget) => sum + budget?.allocated, 0);
  const totalSpent = budgets?.reduce((sum, budget) => sum + budget?.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallProgress = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  const onTrackBudgets = budgets?.filter(budget => (budget?.spent / budget?.allocated) * 100 < 80)?.length;
  const warningBudgets = budgets?.filter(budget => {
    const percentage = (budget?.spent / budget?.allocated) * 100;
    return percentage >= 80 && percentage < 100;
  })?.length;
  const exceededBudgets = budgets?.filter(budget => (budget?.spent / budget?.allocated) * 100 >= 100)?.length;

  const summaryCards = [
    {
      title: 'Total Allocated',
      value: `$${totalAllocated?.toLocaleString()}`,
      icon: 'PiggyBank',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Total Spent',
      value: `$${totalSpent?.toLocaleString()}`,
      icon: 'CreditCard',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Remaining',
      value: `$${totalRemaining?.toLocaleString()}`,
      icon: 'Wallet',
      color: totalRemaining >= 0 ? 'text-success' : 'text-error',
      bgColor: totalRemaining >= 0 ? 'bg-success/10' : 'bg-error/10'
    },
    {
      title: 'Overall Progress',
      value: `${overallProgress?.toFixed(1)}%`,
      icon: 'TrendingUp',
      color: overallProgress < 80 ? 'text-success' : overallProgress < 100 ? 'text-warning' : 'text-error',
      bgColor: overallProgress < 80 ? 'bg-success/10' : overallProgress < 100 ? 'bg-warning/10' : 'bg-error/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards?.map((card, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-4 elevation-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{card?.title}</p>
                <p className={`text-2xl font-semibold ${card?.color}`}>{card?.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card?.bgColor}`}>
                <Icon name={card?.icon} size={24} className={card?.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Budget Status Overview */}
      <div className="bg-card rounded-lg border border-border p-6 elevation-1">
        <h3 className="text-lg font-semibold text-foreground mb-4">Budget Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-success/10">
            <div className="w-10 h-10 rounded-lg bg-success flex items-center justify-center">
              <Icon name="CheckCircle" size={20} color="white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">On Track</p>
              <p className="text-xl font-semibold text-success">{onTrackBudgets}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-lg bg-warning/10">
            <div className="w-10 h-10 rounded-lg bg-warning flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approaching Limit</p>
              <p className="text-xl font-semibold text-warning">{warningBudgets}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-lg bg-error/10">
            <div className="w-10 h-10 rounded-lg bg-error flex items-center justify-center">
              <Icon name="XCircle" size={20} color="white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Exceeded</p>
              <p className="text-xl font-semibold text-error">{exceededBudgets}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Overall Progress Bar */}
      <div className="bg-card rounded-lg border border-border p-6 elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Overall Budget Progress</h3>
          <span className={`text-lg font-semibold ${
            overallProgress < 80 ? 'text-success' : overallProgress < 100 ? 'text-warning' : 'text-error'
          }`}>
            {overallProgress?.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              overallProgress < 80 ? 'bg-success' : overallProgress < 100 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>$0</span>
          <span>${totalAllocated?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;