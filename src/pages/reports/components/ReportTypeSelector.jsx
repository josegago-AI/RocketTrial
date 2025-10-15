import React from 'react';

import Icon from '../../../components/AppIcon';

const ReportTypeSelector = ({ selectedType, onTypeChange }) => {
  const reportTypes = [
    {
      id: 'spending',
      label: 'Spending Analysis',
      description: 'Analyze spending patterns and trends',
      icon: 'TrendingDown',
      color: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      id: 'income',
      label: 'Income Trends',
      description: 'Track income sources and growth',
      icon: 'TrendingUp',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      id: 'budget',
      label: 'Budget Performance',
      description: 'Compare budget vs actual spending',
      icon: 'Target',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'category',
      label: 'Category Breakdown',
      description: 'Spending distribution by category',
      icon: 'PieChart',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'comparison',
      label: 'Period Comparison',
      description: 'Compare different time periods',
      icon: 'BarChart3',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 elevation-1">
      <h2 className="text-lg font-semibold text-foreground mb-4">Report Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {reportTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => onTypeChange(type?.id)}
            className={`p-4 rounded-lg border-2 transition-smooth hover-lift text-left ${
              selectedType === type?.id
                ? type?.color
                : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/20'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Icon 
                name={type?.icon} 
                size={20} 
                className={selectedType === type?.id ? 'text-current' : 'text-muted-foreground'}
              />
              <span className="font-medium text-sm">{type?.label}</span>
            </div>
            <p className="text-xs opacity-80">{type?.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportTypeSelector;