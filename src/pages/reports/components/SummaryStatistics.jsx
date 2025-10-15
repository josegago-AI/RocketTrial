import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryStatistics = ({ reportType, filters }) => {
  const getStatistics = () => {
    switch (reportType) {
      case 'spending':
        return [
          {
            title: 'Average Monthly Spending',
            value: '$2,650',
            change: '+5.2%',
            changeType: 'increase',
            icon: 'TrendingDown',
            description: 'Compared to last quarter'
          },
          {
            title: 'Highest Spending Category',
            value: 'Food & Dining',
            change: '$850/month',
            changeType: 'neutral',
            icon: 'Utensils',
            description: '28% of total spending'
          },
          {
            title: 'Spending Velocity',
            value: '15.2 days',
            change: '-2 days',
            changeType: 'decrease',
            icon: 'Clock',
            description: 'Average days to spend $1000'
          },
          {
            title: 'Budget Adherence',
            value: '89%',
            change: '+12%',
            changeType: 'increase',
            icon: 'Target',
            description: 'Categories within budget'
          }
        ];
      case 'income':
        return [
          {
            title: 'Average Monthly Income',
            value: '$3,640',
            change: '+8.7%',
            changeType: 'increase',
            icon: 'TrendingUp',
            description: 'Compared to last quarter'
          },
          {
            title: 'Primary Income Source',
            value: 'Salary',
            change: '$3,000/month',
            changeType: 'neutral',
            icon: 'Briefcase',
            description: '82% of total income'
          },
          {
            title: 'Income Growth Rate',
            value: '7.4%',
            change: '+2.1%',
            changeType: 'increase',
            icon: 'BarChart3',
            description: 'Quarterly average growth'
          },
          {
            title: 'Income Stability',
            value: '94%',
            change: '+3%',
            changeType: 'increase',
            icon: 'Shield',
            description: 'Consistency score'
          }
        ];
      case 'budget':
        return [
          {
            title: 'Budget Utilization',
            value: '94.6%',
            change: '+2.3%',
            changeType: 'increase',
            icon: 'PieChart',
            description: 'Of allocated budget used'
          },
          {
            title: 'Categories Over Budget',
            value: '3',
            change: '-1',
            changeType: 'decrease',
            icon: 'AlertTriangle',
            description: 'Out of 8 total categories'
          },
          {
            title: 'Total Budget Variance',
            value: '$-130',
            change: '$50',
            changeType: 'decrease',
            icon: 'DollarSign',
            description: 'Over budget this month'
          },
          {
            title: 'Savings Rate',
            value: '18.2%',
            change: '+1.5%',
            changeType: 'increase',
            icon: 'PiggyBank',
            description: 'Of total income saved'
          }
        ];
      case 'category':
        return [
          {
            title: 'Most Expensive Category',
            value: 'Food & Dining',
            change: '$850',
            changeType: 'neutral',
            icon: 'Utensils',
            description: '28% of total spending'
          },
          {
            title: 'Fastest Growing Category',
            value: 'Transportation',
            change: '+15%',
            changeType: 'increase',
            icon: 'Car',
            description: 'Month over month'
          },
          {
            title: 'Most Consistent Category',
            value: 'Bills & Utilities',
            change: '2% variance',
            changeType: 'neutral',
            icon: 'Home',
            description: 'Lowest spending variation'
          },
          {
            title: 'Optimization Potential',
            value: 'Shopping',
            change: '$120 savings',
            changeType: 'decrease',
            icon: 'ShoppingBag',
            description: 'Potential monthly savings'
          }
        ];
      case 'comparison':
        return [
          {
            title: 'Period Difference',
            value: '+$320',
            change: '+12%',
            changeType: 'increase',
            icon: 'TrendingUp',
            description: 'Compared to previous period'
          },
          {
            title: 'Income Change',
            value: '+$180',
            change: '+5.2%',
            changeType: 'increase',
            icon: 'ArrowUp',
            description: 'Period over period'
          },
          {
            title: 'Expense Change',
            value: '+$140',
            change: '+5.8%',
            changeType: 'increase',
            icon: 'ArrowDown',
            description: 'Period over period'
          },
          {
            title: 'Net Change',
            value: '+$40',
            change: '+1.5%',
            changeType: 'increase',
            icon: 'Calculator',
            description: 'Net financial position'
          }
        ];
      default:
        return [];
    }
  };

  const statistics = getStatistics();

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'increase':
        return 'text-success';
      case 'decrease':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'increase':
        return 'ArrowUp';
      case 'decrease':
        return 'ArrowDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 elevation-1">
      <h2 className="text-lg font-semibold text-foreground mb-6">Key Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statistics?.map((stat, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-4 hover-lift transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={stat?.icon} size={20} className="text-primary" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${getChangeColor(stat?.changeType)}`}>
                <Icon name={getChangeIcon(stat?.changeType)} size={14} />
                <span>{stat?.change}</span>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="text-2xl font-bold text-foreground">{stat?.value}</div>
              <div className="text-sm font-medium text-foreground">{stat?.title}</div>
            </div>
            
            <div className="text-xs text-muted-foreground">{stat?.description}</div>
          </div>
        ))}
      </div>
      {/* Insights Section */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon name="Lightbulb" size={14} color="white" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Financial Insights</h4>
            <div className="space-y-2 text-sm text-blue-800">
              {reportType === 'spending' && (
                <>
                  <p>• Your spending has increased by 5.2% this quarter, primarily driven by food and transportation costs.</p>
                  <p>• Consider setting stricter limits on discretionary spending categories like shopping and entertainment.</p>
                </>
              )}
              {reportType === 'income' && (
                <>
                  <p>• Your income growth of 7.4% quarterly is excellent and above national average.</p>
                  <p>• Diversifying income sources beyond salary could provide additional financial security.</p>
                </>
              )}
              {reportType === 'budget' && (
                <>
                  <p>• You're maintaining good budget discipline with 89% of categories within limits.</p>
                  <p>• Focus on the 3 over-budget categories to improve overall financial control.</p>
                </>
              )}
              {reportType === 'category' && (
                <>
                  <p>• Food & Dining represents your largest expense category at 28% of total spending.</p>
                  <p>• Transportation costs are growing rapidly - consider carpooling or public transit options.</p>
                </>
              )}
              {reportType === 'comparison' && (
                <>
                  <p>• Your financial position has improved by $40 compared to the previous period.</p>
                  <p>• Income growth is outpacing expense growth, which is a positive trend.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStatistics;