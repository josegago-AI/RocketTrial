import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const IncomeAnalysisChart = ({ filters }) => {
  const incomeData = [
    { month: 'Jan', salary: 2800, freelance: 400, investments: 150, other: 50 },
    { month: 'Feb', salary: 2800, freelance: 300, investments: 180, other: 70 },
    { month: 'Mar', salary: 2800, freelance: 600, investments: 120, other: 80 },
    { month: 'Apr', salary: 2800, freelance: 350, investments: 200, other: 100 },
    { month: 'May', salary: 2800, freelance: 400, investments: 160, other: 90 },
    { month: 'Jun', salary: 3000, freelance: 500, investments: 180, other: 120 },
    { month: 'Jul', salary: 3000, freelance: 450, investments: 140, other: 110 },
    { month: 'Aug', salary: 3000, freelance: 200, investments: 190, other: 80 },
    { month: 'Sep', salary: 3000, freelance: 300, investments: 170, other: 60 }
  ];

  const incomeSourcesData = [
    { name: 'Salary', value: 27000, color: '#3b82f6' },
    { name: 'Freelance', value: 3500, color: '#10b981' },
    { name: 'Investments', value: 1490, color: '#f59e0b' },
    { name: 'Other', value: 760, color: '#8b5cf6' }
  ];

  const growthData = [
    { period: 'Q1 2024', growth: 5.2 },
    { period: 'Q2 2024', growth: 8.7 },
    { period: 'Q3 2024', growth: 3.1 },
    { period: 'Q4 2024', growth: 12.4 }
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

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-card border border-border rounded-lg p-3 elevation-2">
          <p className="font-medium text-foreground">{data?.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data?.value?.toLocaleString()} ({((data?.value / 32750) * 100)?.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Income Trend Chart */}
      <div className="bg-card rounded-lg border border-border p-6 elevation-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Income Trends</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">Salary</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Freelance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-muted-foreground">Investments</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-muted-foreground">Other</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={incomeData}>
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
              <Area
                type="monotone"
                dataKey="salary"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.8}
                name="Salary"
              />
              <Area
                type="monotone"
                dataKey="freelance"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.8}
                name="Freelance"
              />
              <Area
                type="monotone"
                dataKey="investments"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.8}
                name="Investments"
              />
              <Area
                type="monotone"
                dataKey="other"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.8}
                name="Other"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Sources Pie Chart */}
        <div className="bg-card rounded-lg border border-border p-6 elevation-1">
          <h3 className="text-lg font-semibold text-foreground mb-6">Income Sources</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeSourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {incomeSourcesData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {incomeSourcesData?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item?.color }}
                ></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{item?.name}</div>
                  <div className="text-xs text-muted-foreground">${item?.value?.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Analysis */}
        <div className="bg-card rounded-lg border border-border p-6 elevation-1">
          <h3 className="text-lg font-semibold text-foreground mb-6">Growth Analysis</h3>
          <div className="space-y-4">
            {growthData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="font-medium text-foreground">{item?.period}</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${item?.growth > 0 ? 'text-success' : 'text-error'}`}>
                    {item?.growth > 0 ? '+' : ''}{item?.growth}%
                  </span>
                  <div className={`w-2 h-2 rounded-full ${item?.growth > 0 ? 'bg-success' : 'bg-error'}`}></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-medium text-success">Key Insight</span>
            </div>
            <p className="text-sm text-foreground">
              Your income has grown by an average of 7.4% quarterly this year, with freelance work showing the highest volatility but strong overall contribution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeAnalysisChart;