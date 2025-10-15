import React from 'react';
import Icon from 'components/AppIcon';

const TutorialSidebar = ({ 
  activeCategory, 
  setActiveCategory, 
  currentStep, 
  onStepSelect, 
  completedSteps 
}) => {
  const tutorialCategories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: 'Rocket',
      color: 'text-green-500',
      steps: [
        { id: 'setup-profile', title: 'Set Up Your Profile', duration: '2 min' },
        { id: 'app-overview', title: 'App Overview & Navigation', duration: '3 min' },
        { id: 'first-login', title: 'First Time Setup', duration: '5 min' },
      ]
    },
    {
      id: 'transactions',
      name: 'Managing Transactions',
      icon: 'Receipt',
      color: 'text-blue-500',
      steps: [
        { id: 'add-transaction', title: 'Adding Your First Transaction', duration: '3 min' },
        { id: 'transaction-categories', title: 'Understanding Categories', duration: '4 min' },
        { id: 'edit-transactions', title: 'Editing & Deleting Transactions', duration: '2 min' },
        { id: 'bulk-operations', title: 'Bulk Transaction Operations', duration: '5 min' },
        { id: 'transaction-filters', title: 'Advanced Filtering & Search', duration: '4 min' },
      ]
    },
    {
      id: 'budgets',
      name: 'Creating Budgets',
      icon: 'PiggyBank',
      color: 'text-purple-500',
      steps: [
        { id: 'budget-basics', title: 'Budget Fundamentals', duration: '4 min' },
        { id: 'create-budget', title: 'Creating Your First Budget', duration: '6 min' },
        { id: 'budget-categories', title: 'Budget Categories & Allocation', duration: '5 min' },
        { id: 'budget-monitoring', title: 'Monitoring Budget Performance', duration: '3 min' },
        { id: 'budget-templates', title: 'Using Budget Templates', duration: '4 min' },
      ]
    },
    {
      id: 'goals',
      name: 'Setting Goals',
      icon: 'Target',
      color: 'text-orange-500',
      steps: [
        { id: 'goal-types', title: 'Types of Financial Goals', duration: '3 min' },
        { id: 'create-goal', title: 'Creating Your First Goal', duration: '5 min' },
        { id: 'goal-tracking', title: 'Tracking Goal Progress', duration: '4 min' },
        { id: 'goal-contributions', title: 'Making Goal Contributions', duration: '3 min' },
        { id: 'goal-milestones', title: 'Setting Milestones', duration: '4 min' },
      ]
    },
    {
      id: 'reports',
      name: 'Understanding Reports',
      icon: 'BarChart3',
      color: 'text-red-500',
      steps: [
        { id: 'reports-overview', title: 'Reports Dashboard Overview', duration: '4 min' },
        { id: 'spending-analysis', title: 'Analyzing Spending Patterns', duration: '6 min' },
        { id: 'income-tracking', title: 'Income Analysis & Trends', duration: '5 min' },
        { id: 'budget-performance', title: 'Budget Performance Reports', duration: '4 min' },
        { id: 'export-data', title: 'Exporting & Sharing Reports', duration: '3 min' },
      ]
    }
  ];

  const isStepCompleted = (stepId) => completedSteps?.includes(stepId);
  const isStepActive = (stepId) => currentStep === stepId;

  return (
    <div className="space-y-1">
      {tutorialCategories?.map((category) => (
        <div key={category?.id} className="mb-4">
          <button
            onClick={() => setActiveCategory(category?.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-smooth hover:bg-muted ${
              activeCategory === category?.id ? 'bg-muted text-foreground' : 'text-muted-foreground'
            }`}
          >
            <div className="flex items-center">
              <Icon name={category?.icon} size={20} className={`mr-3 ${category?.color}`} />
              <span className="font-medium">{category?.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs bg-secondary px-2 py-1 rounded-full mr-2">
                {category?.steps?.filter(step => isStepCompleted(step?.id))?.length}/{category?.steps?.length}
              </span>
              <Icon 
                name={activeCategory === category?.id ? "ChevronDown" : "ChevronRight"} 
                size={16} 
              />
            </div>
          </button>

          {activeCategory === category?.id && (
            <div className="mt-2 ml-4 space-y-1">
              {category?.steps?.map((step, index) => (
                <button
                  key={step?.id}
                  onClick={() => onStepSelect(step?.id)}
                  className={`w-full flex items-center p-3 rounded-lg text-left text-sm transition-smooth hover:bg-muted ${
                    isStepActive(step?.id) 
                      ? 'bg-primary text-primary-foreground' 
                      : isStepCompleted(step?.id)
                      ? 'bg-green-50 text-green-800 border border-green-200' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs font-medium ${
                        isStepCompleted(step?.id)
                          ? 'bg-green-500 text-white'
                          : isStepActive(step?.id)
                          ? 'bg-primary-foreground text-primary'
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        {isStepCompleted(step?.id) ? (
                          <Icon name="Check" size={12} />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{step?.title}</div>
                        <div className={`text-xs ${
                          isStepActive(step?.id) ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        }`}>
                          {step?.duration}
                        </div>
                      </div>
                    </div>
                    
                    {isStepActive(step?.id) && (
                      <Icon name="Play" size={14} className="text-primary-foreground" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TutorialSidebar;