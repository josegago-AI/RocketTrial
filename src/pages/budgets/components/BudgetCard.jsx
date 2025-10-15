import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getProgressColor = () => {
    const percentage = (budget?.spent / budget?.allocated) * 100;
    if (percentage >= 100) return 'bg-error';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const getStatusColor = () => {
    const percentage = (budget?.spent / budget?.allocated) * 100;
    if (percentage >= 100) return 'text-error';
    if (percentage >= 80) return 'text-warning';
    return 'text-success';
  };

  const percentage = Math.min((budget?.spent / budget?.allocated) * 100, 100);
  const remaining = Math.max(budget?.allocated - budget?.spent, 0);

  return (
    <div className="bg-card rounded-lg border border-border p-6 elevation-1 hover-lift transition-smooth">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${budget?.color}`}>
            <Icon name={budget?.icon} size={20} color="white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{budget?.category}</h3>
            <p className="text-sm text-muted-foreground">{budget?.period}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Edit"
            onClick={() => onEdit(budget)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreVertical"
            onClick={() => setShowDetails(!showDetails)}
          />
        </div>
      </div>
      {/* Budget Overview */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Allocated</span>
          <span className="font-semibold text-foreground">${budget?.allocated?.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Spent</span>
          <span className={`font-semibold ${getStatusColor()}`}>${budget?.spent?.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Remaining</span>
          <span className={`font-semibold ${remaining > 0 ? 'text-success' : 'text-error'}`}>
            ${remaining?.toLocaleString()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {percentage?.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Mini Chart */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Spending Trend</span>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="flex items-end space-x-1 h-12">
            {budget?.weeklySpending?.map((amount, index) => (
              <div
                key={index}
                className="flex-1 bg-primary/20 rounded-sm"
                style={{
                  height: `${(amount / Math.max(...budget?.weeklySpending)) * 100}%`,
                  minHeight: '4px'
                }}
              />
            ))}
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Alert Threshold</span>
              <span className="text-sm font-medium">{budget?.alertThreshold}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Transaction</span>
              <span className="text-sm font-medium">{budget?.lastTransaction}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Transactions Count</span>
              <span className="text-sm font-medium">{budget?.transactionCount}</span>
            </div>
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" size="sm" fullWidth iconName="TrendingUp">
                View Trends
              </Button>
              <Button variant="outline" size="sm" fullWidth iconName="Receipt">
                Transactions
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;