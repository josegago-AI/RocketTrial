import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

import Button from '../../../components/ui/Button';

const SpendingChart = () => {
  const [viewType, setViewType] = useState('weekly');
  const [chartType, setChartType] = useState('bar');

  const weeklyData = [
    { name: 'Mon', spending: 45, income: 0 },
    { name: 'Tue', spending: 78, income: 0 },
    { name: 'Wed', spending: 123, income: 0 },
    { name: 'Thu', spending: 89, income: 0 },
    { name: 'Fri', spending: 156, income: 0 },
    { name: 'Sat', spending: 234, income: 0 },
    { name: 'Sun', spending: 67, income: 0 }
  ];

  const monthlyData = [
    { name: 'Jan', spending: 2400, income: 4800 },
    { name: 'Feb', spending: 2100, income: 4800 },
    { name: 'Mar', spending: 2800, income: 4800 },
    { name: 'Apr', spending: 2300, income: 4800 },
    { name: 'May', spending: 2600, income: 4800 },
    { name: 'Jun', spending: 2900, income: 4800 },
    { name: 'Jul', spending: 2400, income: 4800 },
    { name: 'Aug', spending: 2700, income: 4800 },
    { name: 'Sep', spending: 2500, income: 4800 }
  ];

  const currentData = viewType === 'weekly' ? weeklyData : monthlyData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 elevation-2">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.dataKey === 'spending' ? 'Spending' : 'Income'}: ${entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Spending Overview</h3>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewType === 'weekly' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setViewType('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={viewType === 'monthly' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setViewType('monthly')}
            >
              Monthly
            </Button>
          </div>
          
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setChartType('bar')}
              iconName="BarChart3"
            />
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setChartType('line')}
              iconName="TrendingUp"
            />
          </div>
        </div>
      </div>

      <div className="w-full h-64" aria-label="Spending Chart">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="spending" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
              />
              {viewType === 'monthly' && (
                <Bar 
                  dataKey="income" 
                  fill="var(--color-accent)" 
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          ) : (
            <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="spending" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
              {viewType === 'monthly' && (
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="var(--color-accent)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;