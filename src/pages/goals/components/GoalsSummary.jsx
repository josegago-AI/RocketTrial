import React from 'react';
import Icon from '../../../components/AppIcon';

const GoalsSummary = ({ goals }) => {
  const totalGoalsValue = goals?.reduce((sum, goal) => sum + goal?.targetAmount, 0);
  const totalSaved = goals?.reduce((sum, goal) => sum + goal?.currentAmount, 0);
  const totalRemaining = totalGoalsValue - totalSaved;
  const overallProgress = totalGoalsValue > 0 ? (totalSaved / totalGoalsValue) * 100 : 0;
  
  const activeGoals = goals?.filter(goal => goal?.currentAmount < goal?.targetAmount);
  const completedGoals = goals?.filter(goal => goal?.currentAmount >= goal?.targetAmount);
  
  const averageMonthlyRequired = activeGoals?.reduce((sum, goal) => {
    const remaining = goal?.targetAmount - goal?.currentAmount;
    const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
    const monthsLeft = Math.max(daysLeft / 30, 1);
    return sum + (remaining / monthsLeft);
  }, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const nextGoalDeadline = activeGoals?.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))?.[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Goals Value */}
      <div className="bg-card rounded-lg border border-border p-6 elevation-1">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon name="Target" size={20} className="text-blue-600" />
          </div>
          <Icon name="TrendingUp" size={16} className="text-success" />
        </div>
        <div className="text-2xl font-semibold text-foreground mb-1">
          {formatCurrency(totalGoalsValue)}
        </div>
        <div className="text-sm text-muted-foreground">Total Goals Value</div>
        <div className="text-xs text-success mt-1">
          {goals?.length} {goals?.length === 1 ? 'goal' : 'goals'} active
        </div>
      </div>
      {/* Total Saved */}
      <div className="bg-card rounded-lg border border-border p-6 elevation-1">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <Icon name="PiggyBank" size={20} className="text-green-600" />
          </div>
          <span className="text-sm font-medium text-primary">
            {overallProgress?.toFixed(1)}%
          </span>
        </div>
        <div className="text-2xl font-semibold text-foreground mb-1">
          {formatCurrency(totalSaved)}
        </div>
        <div className="text-sm text-muted-foreground">Total Saved</div>
        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
      {/* Monthly Required */}
      <div className="bg-card rounded-lg border border-border p-6 elevation-1">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-orange-600" />
          </div>
          <Icon name="ArrowUp" size={16} className="text-warning" />
        </div>
        <div className="text-2xl font-semibold text-foreground mb-1">
          {formatCurrency(averageMonthlyRequired)}
        </div>
        <div className="text-sm text-muted-foreground">Monthly Required</div>
        <div className="text-xs text-muted-foreground mt-1">
          To meet all deadlines
        </div>
      </div>
      {/* Goal Status */}
      <div className="bg-card rounded-lg border border-border p-6 elevation-1">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <Icon name="CheckCircle" size={20} className="text-purple-600" />
          </div>
          {nextGoalDeadline && (
            <Icon name="Clock" size={16} className="text-muted-foreground" />
          )}
        </div>
        <div className="text-2xl font-semibold text-foreground mb-1">
          {completedGoals?.length}/{goals?.length}
        </div>
        <div className="text-sm text-muted-foreground">Goals Completed</div>
        {nextGoalDeadline && (
          <div className="text-xs text-muted-foreground mt-1">
            Next: {new Date(nextGoalDeadline.targetDate)?.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsSummary;