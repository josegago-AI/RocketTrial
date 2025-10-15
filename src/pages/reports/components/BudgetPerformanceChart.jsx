import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const BudgetPerformanceChart = ({ filters }) => {
  const budgetData = [
    { category: 'Food & Dining', budget: 800, actual: 850, variance: -50, percentage: 106 },
    { category: 'Transportation', budget: 400, actual: 350, variance: 50, percentage: 88 },
    { category: 'Shopping', budget: 300, actual: 380, variance: -80, percentage: 127 },
    { category: 'Entertainment', budget: 250, actual: 200, variance: 50, percentage: 80 },
    { category: 'Bills & Utilities', budget: 350, actual: 320, variance: 30, percentage: 91 },
    { category: 'Healthcare', budget: 200, actual: 180, variance: 20, percentage: 90 },
    { category: 'Education', budget: 150, actual: 120, variance: 30, percentage: 80 },
    { category: 'Travel', budget: 300, actual: 450, variance: -150, percentage: 150 }
  ];

  const monthlyBudgetData = [
    { month: 'Jan', budget: 2800, actual: 2400, saved: 400 },
    { month: 'Feb', budget: 2800, actual: 2600, saved: 200 },
    { month: 'Mar', budget: 2800, actual: 3100, saved: -300 },
    { month: 'Apr', budget: 2800, actual: 2700, saved: 100 },
    { month: 'May', budget: 2800, actual: 2900, saved: -100 },
    { month: 'Jun', budget: 2800, actual: 2500, saved: 300 },
    { month: 'Jul', budget: 2800, actual: 3200, saved: -400 },
    { month: 'Aug', budget: 2800, actual: 2600, saved: 200 },
    { month: 'Sep', budget: 2800, actual: 2800, saved: 0 }
  ];

  const overallPerformance = [
    { name: 'On Track', value: 65, fill: '#22c55e' },
    { name: 'Over Budget', value: 35, fill: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 elevation-2">
          <p className="font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: ${entry?.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getVarianceColor = (variance) => {
    if (variance > 0) return 'text-success';
    if (variance < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getVarianceIcon = (variance) => {
    if (variance > 0) return 'TrendingUp';
    if (variance < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="space-y-6">
      {/* Budget vs Actual Comparison */}
      <div className="bg-card rounded-lg border border-border p-6 elevation-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Budget vs Actual Spending</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">Budget</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-muted-foreground">Actual</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="category" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="budget" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Budget"
              />
              <Bar 
                dataKey="actual" 
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                name="Actual"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance Details */}
        <div className="bg-card rounded-lg border border-border p-6 elevation-1">
          <h3 className="text-lg font-semibold text-foreground mb-6">Category Performance</h3>
          <div className="space-y-3">
            {budgetData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">{item?.category}</div>
                  <div className="text-xs text-muted-foreground">
                    ${item?.actual} / ${item?.budget}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${getVarianceColor(item?.variance)}`}>
                      {item?.variance > 0 ? '+' : ''}${item?.variance}
                    </div>
                    <div className="text-xs text-muted-foreground">{item?.percentage}%</div>
                  </div>
                  <Icon 
                    name={getVarianceIcon(item?.variance)} 
                    size={16} 
                    className={getVarianceColor(item?.variance)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Budget Trend */}
        <div className="bg-card rounded-lg border border-border p-6 elevation-1">
          <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Budget Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBudgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="budget" 
                  fill="#e5e7eb"
                  radius={[4, 4, 0, 0]}
                  name="Budget"
                />
                <Bar 
                  dataKey="actual" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Actual"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6 elevation-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">$500</div>
              <div className="text-sm text-muted-foreground">Total Saved</div>
            </div>
          </div>
          <div className="text-xs text-success">+12% from last month</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 elevation-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">3</div>
              <div className="text-sm text-muted-foreground">Over Budget</div>
            </div>
          </div>
          <div className="text-xs text-warning">Food, Shopping, Travel</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 elevation-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Target" size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">89%</div>
              <div className="text-sm text-muted-foreground">Budget Accuracy</div>
            </div>
          </div>
          <div className="text-xs text-primary">Excellent performance</div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPerformanceChart;