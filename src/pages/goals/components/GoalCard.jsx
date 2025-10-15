import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GoalCard = ({ goal, onContribute, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  
  const progressPercentage = Math.min((goal?.currentAmount / goal?.targetAmount) * 100, 100);
  const remainingAmount = Math.max(goal?.targetAmount - goal?.currentAmount, 0);
  const daysRemaining = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
  const monthlyRequired = remainingAmount / Math.max(daysRemaining / 30, 1);

  const getGoalIcon = (type) => {
    const icons = {
      'savings': 'PiggyBank',
      'debt': 'CreditCard',
      'emergency': 'Shield',
      'vacation': 'Plane',
      'home': 'Home',
      'car': 'Car',
      'education': 'GraduationCap',
      'retirement': 'TrendingUp',
      'custom': 'Target'
    };
    return icons?.[type] || 'Target';
  };

  const getGoalColor = (type) => {
    const colors = {
      'savings': 'text-blue-600 bg-blue-50',
      'debt': 'text-red-600 bg-red-50',
      'emergency': 'text-green-600 bg-green-50',
      'vacation': 'text-purple-600 bg-purple-50',
      'home': 'text-orange-600 bg-orange-50',
      'car': 'text-gray-600 bg-gray-50',
      'education': 'text-indigo-600 bg-indigo-50',
      'retirement': 'text-emerald-600 bg-emerald-50',
      'custom': 'text-slate-600 bg-slate-50'
    };
    return colors?.[type] || 'text-slate-600 bg-slate-50';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 elevation-1 hover-lift transition-smooth">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getGoalColor(goal?.type)}`}>
            <Icon name={getGoalIcon(goal?.type)} size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{goal?.name}</h3>
            <p className="text-sm text-muted-foreground">{goal?.description}</p>
          </div>
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreVertical"
            onClick={() => setShowActions(!showActions)}
          />
          {showActions && (
            <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg z-10 py-1 min-w-32">
              <button
                onClick={() => {
                  onEdit(goal);
                  setShowActions(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
              >
                <Icon name="Edit" size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  onDelete(goal?.id);
                  setShowActions(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted text-error flex items-center space-x-2"
              >
                <Icon name="Trash2" size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm font-semibold text-primary">{progressPercentage?.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mb-3">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {formatCurrency(goal?.currentAmount)} of {formatCurrency(goal?.targetAmount)}
          </span>
          <span className="text-muted-foreground">
            {formatCurrency(remainingAmount)} remaining
          </span>
        </div>
      </div>
      {/* Timeline and Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-foreground">{daysRemaining}</div>
          <div className="text-xs text-muted-foreground">Days Left</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-foreground">{formatCurrency(monthlyRequired)}</div>
          <div className="text-xs text-muted-foreground">Monthly Needed</div>
        </div>
      </div>
      {/* Target Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Target: {formatDate(goal?.targetDate)}</span>
        </div>
        {goal?.priority && (
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={14} className="text-warning" />
            <span className="text-xs text-warning font-medium">High Priority</span>
          </div>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          variant="default"
          size="sm"
          fullWidth
          iconName="Plus"
          iconPosition="left"
          onClick={() => onContribute(goal)}
        >
          Add Money
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="TrendingUp"
          onClick={() => console.log('View progress details')}
        />
      </div>
    </div>
  );
};

export default GoalCard;