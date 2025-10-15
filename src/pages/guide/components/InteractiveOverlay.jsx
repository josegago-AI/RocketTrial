import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const InteractiveOverlay = ({ stepId, onClose, onComplete }) => {
  const [currentHotspot, setCurrentHotspot] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isActive, setIsActive] = useState(false);

  // Comprehensive interactive hotspots for all tutorial steps
  const hotspotData = {
    'setup-profile': [
      {
        id: 'user-menu',
        position: { top: '10%', right: '5%' },
        title: 'User Menu',
        description: 'Click here to access your profile settings',
        highlight: true,
        action: 'Click to open profile menu'
      },
      {
        id: 'profile-settings',
        position: { top: '15%', right: '5%' },
        title: 'Profile Settings',
        description: 'Select Profile Settings from the dropdown',
        highlight: false,
        action: 'Navigate to profile configuration'
      },
      {
        id: 'currency-setting',
        position: { top: '50%', left: '30%' },
        title: 'Currency Selection',
        description: 'Choose your preferred currency for calculations',
        highlight: false,
        action: 'Select your local currency'
      }
    ],

    'add-transaction': [
      {
        id: 'add-button',
        position: { top: '20%', right: '10%' },
        title: 'Add Transaction Button',
        description: 'Click here to add a new transaction',
        highlight: true,
        action: 'Start adding a new transaction'
      },
      {
        id: 'transaction-type',
        position: { top: '35%', left: '50%' },
        title: 'Transaction Type',
        description: 'Select whether this is income or an expense',
        highlight: false,
        action: 'Choose Income or Expense'
      },
      {
        id: 'amount-field',
        position: { top: '45%', left: '50%' },
        title: 'Amount Field',
        description: 'Enter the transaction amount here',
        highlight: false,
        action: 'Input the dollar amount'
      },
      {
        id: 'category-select',
        position: { top: '55%', left: '50%' },
        title: 'Category Selection',
        description: 'Choose the appropriate category for this transaction',
        highlight: false,
        action: 'Select a category'
      },
      {
        id: 'description-field',
        position: { top: '65%', left: '50%' },
        title: 'Description',
        description: 'Add a description to remember what this was for',
        highlight: false,
        action: 'Describe the transaction'
      }
    ],

    'create-budget': [
      {
        id: 'budget-button',
        position: { top: '15%', right: '10%' },
        title: 'Create Budget',
        description: 'Start creating your first budget',
        highlight: true,
        action: 'Click to create new budget'
      },
      {
        id: 'budget-template',
        position: { top: '30%', left: '30%' },
        title: 'Budget Template',
        description: 'Choose a template or start from scratch',
        highlight: false,
        action: 'Select a template'
      },
      {
        id: 'income-field',
        position: { top: '40%', left: '30%' },
        title: 'Monthly Income',
        description: 'Set your total monthly income',
        highlight: false,
        action: 'Enter your monthly income'
      },
      {
        id: 'category-allocation',
        position: { top: '55%', left: '50%' },
        title: 'Category Allocation',
        description: 'Allocate amounts to different spending categories',
        highlight: false,
        action: 'Set budget amounts for each category'
      }
    ],

    'create-goal': [
      {
        id: 'goal-button',
        position: { top: '18%', right: '10%' },
        title: 'Create Goal',
        description: 'Start setting up your financial goal',
        highlight: true,
        action: 'Click to create a new goal'
      },
      {
        id: 'goal-type',
        position: { top: '35%', left: '40%' },
        title: 'Goal Type',
        description: 'Choose what type of goal you want to create',
        highlight: false,
        action: 'Select goal type'
      },
      {
        id: 'target-amount',
        position: { top: '45%', left: '40%' },
        title: 'Target Amount',
        description: 'Set how much money you want to save',
        highlight: false,
        action: 'Enter your target amount'
      },
      {
        id: 'target-date',
        position: { top: '55%', left: '40%' },
        title: 'Target Date',
        description: 'When do you want to achieve this goal?',
        highlight: false,
        action: 'Choose your target date'
      }
    ],

    'transaction-filters': [
      {
        id: 'filter-button',
        position: { top: '25%', left: '15%' },
        title: 'Filter Options',
        description: 'Access advanced filtering options',
        highlight: true,
        action: 'Open filter menu'
      },
      {
        id: 'date-filter',
        position: { top: '35%', left: '20%' },
        title: 'Date Range',
        description: 'Filter transactions by date range',
        highlight: false,
        action: 'Set date filters'
      },
      {
        id: 'category-filter',
        position: { top: '45%', left: '20%' },
        title: 'Category Filter',
        description: 'Filter by specific categories',
        highlight: false,
        action: 'Select categories to filter'
      },
      {
        id: 'amount-filter',
        position: { top: '55%', left: '20%' },
        title: 'Amount Range',
        description: 'Filter by transaction amount',
        highlight: false,
        action: 'Set minimum/maximum amounts'
      }
    ],

    'budget-monitoring': [
      {
        id: 'budget-overview',
        position: { top: '20%', left: '20%' },
        title: 'Budget Overview',
        description: 'View all your budgets and their current status',
        highlight: true,
        action: 'Review budget performance'
      },
      {
        id: 'progress-bars',
        position: { top: '40%', left: '30%' },
        title: 'Progress Indicators',
        description: 'Visual representation of spending vs budget',
        highlight: false,
        action: 'Monitor spending progress'
      },
      {
        id: 'alerts-section',
        position: { top: '60%', left: '30%' },
        title: 'Budget Alerts',
        description: 'Set up notifications for budget limits',
        highlight: false,
        action: 'Configure alert preferences'
      }
    ],

    'reports-overview': [
      {
        id: 'reports-nav',
        position: { top: '16%', left: '70%' },
        title: 'Reports Section',
        description: 'Navigate to the reports dashboard',
        highlight: true,
        action: 'Access financial reports'
      },
      {
        id: 'summary-cards',
        position: { top: '30%', left: '20%' },
        title: 'Summary Cards',
        description: 'Quick overview of key financial metrics',
        highlight: false,
        action: 'Review key metrics'
      },
      {
        id: 'charts-section',
        position: { top: '50%', left: '50%' },
        title: 'Visual Charts',
        description: 'Interactive charts showing spending patterns',
        highlight: false,
        action: 'Analyze spending charts'
      },
      {
        id: 'export-options',
        position: { top: '20%', right: '10%' },
        title: 'Export Data',
        description: 'Download reports in various formats',
        highlight: false,
        action: 'Export your data'
      }
    ],

    'spending-analysis': [
      {
        id: 'spending-chart',
        position: { top: '40%', left: '30%' },
        title: 'Spending Chart',
        description: 'Analyze your spending patterns by category',
        highlight: true,
        action: 'Explore spending breakdown'
      },
      {
        id: 'time-filter',
        position: { top: '25%', right: '20%' },
        title: 'Time Period',
        description: 'Change the time period for analysis',
        highlight: false,
        action: 'Select time range'
      },
      {
        id: 'category-details',
        position: { top: '40%', right: '20%' },
        title: 'Category Insights',
        description: 'Detailed breakdown of spending by category',
        highlight: false,
        action: 'View category details'
      }
    ],

    'goal-tracking': [
      {
        id: 'goal-progress',
        position: { top: '30%', left: '25%' },
        title: 'Goal Progress',
        description: 'Track progress toward your financial goals',
        highlight: true,
        action: 'Review goal progress'
      },
      {
        id: 'contribute-button',
        position: { top: '50%', left: '25%' },
        title: 'Add Contribution',
        description: 'Make a contribution to your goal',
        highlight: false,
        action: 'Contribute to goal'
      },
      {
        id: 'milestone-markers',
        position: { top: '35%', left: '60%' },
        title: 'Milestones',
        description: 'See milestone achievements along the way',
        highlight: false,
        action: 'View milestones'
      }
    ]
  };

  const currentHotspots = hotspotData?.[stepId] || [];

  useEffect(() => {
    setIsActive(true);
    // Auto-advance through hotspots with longer duration
    if (currentHotspots?.length > 0 && currentHotspot < currentHotspots?.length - 1) {
      const timer = setTimeout(() => {
        setCurrentHotspot(prev => prev + 1);
      }, 4000); // Increased to 4 seconds for better readability
      return () => clearTimeout(timer);
    }
  }, [currentHotspot, currentHotspots?.length]);

  const handleNext = () => {
    if (currentHotspot < currentHotspots?.length - 1) {
      setCurrentHotspot(prev => prev + 1);
    } else {
      onComplete(stepId);
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentHotspot > 0) {
      setCurrentHotspot(prev => prev - 1);
    }
  };

  const handleSkipTour = () => {
    onClose();
  };

  if (currentHotspots?.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card p-8 rounded-lg max-w-md mx-4 text-center">
          <Icon name="Rocket" size={48} className="text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Interactive Demo Available!
          </h3>
          <p className="text-muted-foreground mb-6">
            This tutorial includes an interactive walkthrough. Follow the highlighted areas to practice using the feature.
          </p>
          <div className="flex space-x-3 justify-center">
            <Button onClick={onClose} variant="outline">
              Continue Reading
            </Button>
            <Button onClick={() => {
              // Simulate interactive demo
              alert('Interactive demo would guide you through the actual interface!');
              onComplete(stepId);
              onClose();
            }} variant="default">
              Start Interactive Demo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentSpot = currentHotspots?.[currentHotspot];

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay background with subtle animation */}
      <div 
        className="absolute inset-0 bg-black/70 transition-opacity duration-500" 
        onClick={handleSkipTour}
        style={{ opacity: isActive ? 1 : 0 }}
      />
      
      {/* Hotspot indicators */}
      {currentHotspots?.map((spot, index) => (
        <div key={spot?.id}>
          {/* Hotspot circle */}
          <div
            className={`absolute w-12 h-12 rounded-full border-4 transition-all duration-500 cursor-pointer ${
              index === currentHotspot 
                ? 'border-primary bg-primary/30 animate-pulse scale-110 shadow-lg shadow-primary/50' 
                : 'border-white/50 bg-white/10 hover:bg-white/20'
            }`}
            style={{
              top: spot?.position?.top,
              left: spot?.position?.left,
              right: spot?.position?.right,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => setCurrentHotspot(index)}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className={`font-bold text-sm ${
                index === currentHotspot ? 'text-white' : 'text-white/80'
              }`}>
                {index + 1}
              </span>
            </div>
          </div>

          {/* Spotlight effect for active hotspot */}
          {index === currentHotspot && (
            <div
              className="absolute w-20 h-20 rounded-full bg-white/10 animate-ping"
              style={{
                top: spot?.position?.top,
                left: spot?.position?.left,
                right: spot?.position?.right,
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}
        </div>
      ))}

      {/* Enhanced tooltip */}
      {showTooltip && currentSpot && (
        <div
          className="absolute bg-card border border-border rounded-lg shadow-xl p-6 max-w-sm z-60 transform transition-all duration-300"
          style={{
            top: `calc(${currentSpot?.position?.top} + 60px)`,
            left: currentSpot?.position?.left ? `calc(${currentSpot?.position?.left} - 150px)` : 'auto',
            right: currentSpot?.position?.right ? `calc(${currentSpot?.position?.right} - 150px)` : 'auto',
          }}
        >
          {/* Tooltip arrow */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-card border-l border-t border-border rotate-45" />
          
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-foreground">{currentSpot?.title}</h4>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
          
          <p className="text-muted-foreground text-sm mb-4">{currentSpot?.description}</p>
          
          {/* Action hint */}
          <div className="bg-primary/5 border border-primary/20 rounded-md p-3 mb-4">
            <div className="flex items-center text-primary text-sm">
              <Icon name="MousePointer2" size={16} className="mr-2" />
              <span className="font-medium">{currentSpot?.action}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Step {currentHotspot + 1} of {currentHotspots?.length}
            </div>
            <div className="flex items-center space-x-2">
              {currentHotspot > 0 && (
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  <Icon name="ArrowLeft" size={14} className="mr-1" />
                  Back
                </Button>
              )}
              <Button variant="default" size="sm" onClick={handleNext}>
                {currentHotspot === currentHotspots?.length - 1 ? (
                  <>
                    <Icon name="Check" size={14} className="mr-1" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <Icon name="ArrowRight" size={14} className="ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced control panel */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg p-4 shadow-lg min-w-96">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleSkipTour} iconName="X">
              Exit Tour
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium text-foreground">Interactive Guide</div>
              <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                {currentHotspot + 1} / {currentHotspots?.length}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowTooltip(!showTooltip)}
              iconName={showTooltip ? "EyeOff" : "Eye"}
            >
              {showTooltip ? 'Hide' : 'Show'} Info
            </Button>
            
            {/* Progress indicator */}
            <div className="flex items-center space-x-1">
              {currentHotspots?.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentHotspot ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Welcome message for first hotspot */}
      {currentHotspot === 0 && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-lg shadow-lg max-w-md text-center">
          <Icon name="Sparkles" size={20} className="mx-auto mb-2" />
          <div className="font-semibold mb-1">Interactive Tutorial</div>
          <div className="text-sm opacity-90">Follow the highlighted areas to learn hands-on!</div>
        </div>
      )}
    </div>
  );
};

export default InteractiveOverlay;