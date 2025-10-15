import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 1,
      title: "Add Transaction",
      description: "Record a new income or expense",
      icon: "Plus",
      color: "bg-primary",
      action: () => navigate('/transactions')
    },
    {
      id: 2,
      title: "Create Budget",
      description: "Set spending limits for categories",
      icon: "PiggyBank",
      color: "bg-accent",
      action: () => navigate('/budgets')
    },
    {
      id: 3,
      title: "Set Financial Goal",
      description: "Plan for future expenses or savings",
      icon: "Target",
      color: "bg-secondary",
      action: () => navigate('/goals')
    },
    {
      id: 4,
      title: "View Reports",
      description: "Analyze your spending patterns",
      icon: "BarChart3",
      color: "bg-warning",
      action: () => navigate('/reports')
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 elevation-1">
      <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant="outline"
            className="h-auto p-4 text-left hover-lift"
            onClick={action?.action}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action?.color}`}>
                <span className="text-white text-lg">
                  {action?.icon === 'Plus' && '+'}
                  {action?.icon === 'PiggyBank' && '🐷'}
                  {action?.icon === 'Target' && '🎯'}
                  {action?.icon === 'BarChart3' && '📊'}
                </span>
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {action?.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {action?.description}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;