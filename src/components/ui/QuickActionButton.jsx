import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';


const QuickActionButton = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getContextualActions = () => {
    switch (location?.pathname) {
      case '/dashboard':
        return [
          { label: 'Add Transaction', icon: 'Plus', action: () => console.log('Add Transaction') },
          { label: 'Create Budget', icon: 'PiggyBank', action: () => console.log('Create Budget') },
          { label: 'Set Goal', icon: 'Target', action: () => console.log('Set Goal') }
        ];
      case '/transactions':
        return [
          { label: 'Add Transaction', icon: 'Plus', action: () => console.log('Add Transaction') },
          { label: 'Import CSV', icon: 'Upload', action: () => console.log('Import CSV') },
          { label: 'Export Data', icon: 'Download', action: () => console.log('Export Data') }
        ];
      case '/budgets':
        return [
          { label: 'Create Budget', icon: 'Plus', action: () => console.log('Create Budget') },
          { label: 'Copy Budget', icon: 'Copy', action: () => console.log('Copy Budget') },
          { label: 'Budget Template', icon: 'FileText', action: () => console.log('Budget Template') }
        ];
      case '/goals':
        return [
          { label: 'Set New Goal', icon: 'Plus', action: () => console.log('Set New Goal') },
          { label: 'Goal Template', icon: 'FileText', action: () => console.log('Goal Template') },
          { label: 'Track Progress', icon: 'TrendingUp', action: () => console.log('Track Progress') }
        ];
      case '/reports':
        return [
          { label: 'Generate Report', icon: 'Plus', action: () => console.log('Generate Report') },
          { label: 'Export PDF', icon: 'FileDown', action: () => console.log('Export PDF') },
          { label: 'Schedule Report', icon: 'Calendar', action: () => console.log('Schedule Report') }
        ];
      default:
        return [
          { label: 'Add Transaction', icon: 'Plus', action: () => console.log('Add Transaction') }
        ];
    }
  };

  const actions = getContextualActions();
  const primaryAction = actions?.[0];

  const handlePrimaryAction = () => {
    if (actions?.length === 1) {
      primaryAction?.action();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleActionClick = (action) => {
    action?.action();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-200">
      {/* Expanded Actions */}
      {isExpanded && actions?.length > 1 && (
        <div className="mb-4 space-y-2 animate-slide-in">
          {actions?.slice(1)?.reverse()?.map((action, index) => (
            <div key={index} className="flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleActionClick(action)}
                iconName={action?.icon}
                iconPosition="left"
                className="elevation-2 hover-lift"
              >
                {action?.label}
              </Button>
            </div>
          ))}
        </div>
      )}
      {/* Primary Action Button */}
      <Button
        variant="default"
        size="lg"
        onClick={handlePrimaryAction}
        iconName={isExpanded ? "X" : primaryAction?.icon}
        className="w-14 h-14 rounded-full elevation-3 hover-lift bg-primary hover:bg-primary/90"
      >
        <span className="sr-only">
          {actions?.length === 1 ? primaryAction?.label : 'Quick Actions'}
        </span>
      </Button>
      {/* Action Label Tooltip */}
      {!isExpanded && (
        <div className="absolute bottom-16 right-0 bg-card text-card-foreground px-3 py-2 rounded-lg text-sm font-medium elevation-2 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          {actions?.length === 1 ? primaryAction?.label : 'Quick Actions'}
        </div>
      )}
    </div>
  );
};

export default QuickActionButton;