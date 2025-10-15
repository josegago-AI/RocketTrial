import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';


const SpendingAnalysisChart = ({ filters }) => {
  const spendingData = [
    { month: 'Jan', spending: 2400, income: 3200, budget: 2800 },
    { month: 'Feb', spending: 2100, income: 3200, budget: 2800 },
    { month: 'Mar', spending: 2800, income: 3400, budget: 2800 },
    { month: 'Apr', spending: 2600, income: 3200, budget: 2800 },
    { month: 'May', spending: 3100, income: 3200, budget: 2800 },
    { month: 'Jun', spending: 2900, income: 3500, budget: 2800 },
    { month: 'Jul', spending: 3200, income: 3500, budget: 2800 },
    { month: 'Aug', spending: 2700, income: 3200, budget: 2800 },
    { month: 'Sep', spending: 2500, income: 3200, budget: 2800 }
  ];

  const categoryData = [
    { category: 'Food & Dining', amount: 850, percentage: 28 },
    { category: 'Transportation', amount: 450, percentage: 15 },
    { category: 'Shopping', amount: 380, percentage: 13 },
    { category: 'Bills & Utilities', amount: 320, percentage: 11 },
    { category: 'Entertainment', amount: 280, percentage: 9 },
    { category: 'Healthcare', amount: 220, percentage: 7 },
    { category: 'Others', amount: 500, percentage: 17 }
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

  return (
    <div className="space-y-6">
      {/* Spending Trend Chart */}
      <div className="bg-card rounded-lg border border-border p-6 elevation-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Spending Trends</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-muted-foreground">Spending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Income</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">Budget</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spendingData}>
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
              <Line 
                type="monotone" 
                dataKey="spending" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                name="Spending"
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="budget" 
                stroke="#3b82f6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Budget"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Category Breakdown */}
      <div className="bg-card rounded-lg border border-border p-6 elevation-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Category Breakdown</h3>
          <span className="text-sm text-muted-foreground">Current Month</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  type="number" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis 
                  type="category" 
                  dataKey="category" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="var(--color-primary)"
                  radius={[0, 4, 4, 0]}
                  name="Amount"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {categoryData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }}
                  ></div>
                  <span className="font-medium text-foreground">{item?.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">${item?.amount}</div>
                  <div className="text-sm text-muted-foreground">{item?.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingAnalysisChart;