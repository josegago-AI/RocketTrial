import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';

const TutorialContent = ({ 
  stepId, 
  onComplete, 
  onTryItNow, 
  onNoteUpdate, 
  note, 
  isCompleted 
}) => {
  const [userNote, setUserNote] = useState(note || '');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [practiceData, setPracticeData] = useState({
    amount: '',
    category: '',
    description: ''
  });

  // Complete tutorial content data structure with all 25 steps
  const tutorialSteps = {
    // Getting Started Category
    'setup-profile': {
      title: 'Set Up Your Profile',
      category: 'Getting Started',
      duration: '2 min',
      difficulty: 'Beginner',
      description: 'Learn how to personalize your FinanceFlow profile and configure basic settings for optimal experience.',
      objectives: [
        'Update your profile information',
        'Set your preferred currency',
        'Configure notification preferences',
        'Set up security settings'
      ],
      content: [
        {
          type: 'text',
          content: 'Welcome to FinanceFlow! Setting up your profile is the first step towards taking control of your finances. A well-configured profile ensures accurate tracking and personalized insights.'
        },
        {
          type: 'steps',
          title: 'Step-by-Step Instructions:',
          steps: [
            'Click on the user icon in the top-right corner',
            'Select "Profile Settings" from the dropdown menu',
            'Fill in your basic information (name, email, etc.)',
            'Choose your primary currency from the dropdown',
            'Set your financial goals and income level (optional)',
            'Configure notification preferences for budgets and goals',
            'Enable two-factor authentication for security'
          ]
        },
        {
          type: 'tip',
          content: 'Pro Tip: Setting an accurate income level helps FinanceFlow provide better budget recommendations and insights.'
        },
        {
          type: 'quiz',
          question: 'Why is it important to set your preferred currency?',
          options: [
            'It makes the app look better',
            'It ensures accurate financial calculations and reporting',
            'It\'s required by law',
            'It doesn\'t matter'
          ],
          correctAnswer: 1
        }
      ]
    },
    'app-overview': {
      title: 'App Overview & Navigation',
      category: 'Getting Started',
      duration: '3 min',
      difficulty: 'Beginner',
      description: 'Get familiar with FinanceFlow\'s interface, navigation, and key features to maximize your productivity.',
      objectives: [
        'Understand the main navigation structure',
        'Learn about each major section',
        'Discover keyboard shortcuts',
        'Master the search functionality'
      ],
      content: [
        {
          type: 'text',
          content: 'FinanceFlow is designed with simplicity and efficiency in mind. Let\'s explore the main areas of the application.'
        },
        {
          type: 'feature-tour',
          features: [
            {
              name: 'Dashboard',
              icon: 'BarChart3',
              description: 'Your financial overview with key metrics and insights'
            },
            {
              name: 'Transactions',
              icon: 'Receipt',
              description: 'Track all your income and expenses in one place'
            },
            {
              name: 'Budgets',
              icon: 'PiggyBank',
              description: 'Create and monitor budgets to control spending'
            },
            {
              name: 'Goals',
              icon: 'Target',
              description: 'Set and track your financial goals'
            },
            {
              name: 'Reports',
              icon: 'FileText',
              description: 'Analyze your financial patterns with detailed reports'
            }
          ]
        },
        {
          type: 'keyboard-shortcuts',
          shortcuts: [
            { keys: 'Ctrl + N', action: 'Add new transaction' },
            { keys: 'Ctrl + B', action: 'Create new budget' },
            { keys: 'Ctrl + /', action: 'Open search' },
            { keys: 'Ctrl + D', action: 'Go to dashboard' }
          ]
        }
      ]
    },
    'first-login': {
      title: 'First Time Setup',
      category: 'Getting Started',
      duration: '5 min',
      difficulty: 'Beginner',
      description: 'Complete your initial setup with sample data and basic configuration to start tracking your finances immediately.',
      objectives: [
        'Import or add sample transactions',
        'Set up your first budget categories',
        'Configure initial financial goals',
        'Understand data privacy and security'
      ],
      content: [
        {
          type: 'text',
          content: 'Let\'s get your financial tracking started with some initial data. This will help you understand how FinanceFlow works and see immediate value.'
        },
        {
          type: 'checklist',
          title: 'Setup Checklist:',
          items: [
            { id: 'sample-data', text: 'Add sample transactions to see how tracking works', completed: false },
            { id: 'categories', text: 'Review and customize expense categories', completed: false },
            { id: 'first-budget', text: 'Create your first monthly budget', completed: false },
            { id: 'goal-setup', text: 'Set up an initial financial goal', completed: false },
            { id: 'notifications', text: 'Configure notification preferences', completed: false }
          ]
        },
        {
          type: 'practice',
          title: 'Practice: Add Your First Transaction',
          description: 'Try adding a sample transaction to get familiar with the process.',
          fields: ['amount', 'description', 'category']
        }
      ]
    },

    // Transactions Category  
    'add-transaction': {
      title: 'Adding Your First Transaction',
      category: 'Managing Transactions',
      duration: '3 min',
      difficulty: 'Beginner',
      description: 'Master the basics of transaction entry to keep accurate records of your income and expenses.',
      objectives: [
        'Add your first income transaction',
        'Record an expense transaction',
        'Understand transaction categories',
        'Use quick-add features'
      ],
      content: [
        {
          type: 'text',
          content: 'Transactions are the foundation of financial tracking. Every dollar in and out should be recorded to get accurate insights into your spending patterns.'
        },
        {
          type: 'steps',
          title: 'Adding a Transaction:',
          steps: [
            'Navigate to the Transactions page',
            'Click the "Add Transaction" button',
            'Select transaction type (Income or Expense)',
            'Enter the amount and description',
            'Choose the appropriate category',
            'Select the date (defaults to today)',
            'Add any additional notes if needed',
            'Click "Save Transaction"'
          ]
        },
        {
          type: 'interactive',
          title: 'Try It Now',
          description: 'Practice adding a transaction with our guided overlay',
          actionText: 'Launch Interactive Demo'
        },
        {
          type: 'common-mistakes',
          title: 'Common Mistakes to Avoid:',
          mistakes: [
            'Forgetting to categorize transactions properly',
            'Not adding descriptions for unclear transactions',
            'Mixing personal and business expenses',
            'Recording transfers as income/expenses'
          ]
        }
      ]
    },
    'transaction-categories': {
      title: 'Understanding Categories',
      category: 'Managing Transactions',
      duration: '4 min',
      difficulty: 'Beginner',
      description: 'Learn how to effectively categorize your transactions for better financial insights and reporting.',
      objectives: [
        'Understand default categories',
        'Create custom categories',
        'Best practices for categorization',
        'Bulk category updates'
      ],
      content: [
        {
          type: 'text',
          content: 'Proper categorization is crucial for meaningful financial analysis. Categories help you understand where your money goes and identify spending patterns.'
        },
        {
          type: 'category-overview',
          defaultCategories: [
            { name: 'Food & Dining', color: 'bg-red-500', icon: 'UtensilsCrossed' },
            { name: 'Transportation', color: 'bg-blue-500', icon: 'Car' },
            { name: 'Shopping', color: 'bg-purple-500', icon: 'ShoppingBag' },
            { name: 'Entertainment', color: 'bg-pink-500', icon: 'GamePad' },
            { name: 'Bills & Utilities', color: 'bg-yellow-500', icon: 'Zap' },
            { name: 'Healthcare', color: 'bg-green-500', icon: 'Heart' }
          ]
        },
        {
          type: 'best-practices',
          title: 'Categorization Best Practices:',
          practices: [
            'Be consistent with your categorization rules',
            'Create subcategories for detailed tracking',
            'Review and recategorize monthly',
            'Use specific names for custom categories'
          ]
        }
      ]
    },
    'edit-transactions': {
      title: 'Editing & Deleting Transactions',
      category: 'Managing Transactions',
      duration: '2 min',
      difficulty: 'Beginner',
      description: 'Learn how to modify existing transactions and safely delete incorrect entries.',
      objectives: [
        'Edit transaction details',
        'Update categories and amounts',
        'Delete transactions safely',
        'Understand transaction history'
      ],
      content: [
        {
          type: 'text',
          content: 'Sometimes you\'ll need to correct transactions or remove duplicates. Here\'s how to manage your transaction data effectively.'
        },
        {
          type: 'steps',
          title: 'Editing a Transaction:',
          steps: [
            'Find the transaction in your list',
            'Click the edit icon or transaction row',
            'Modify the necessary fields',
            'Click "Save Changes" to confirm',
            'Review the updated transaction'
          ]
        },
        {
          type: 'warning',
          content: 'Warning: Deleting transactions cannot be undone. Consider editing instead of deleting when possible.'
        }
      ]
    },
    'bulk-operations': {
      title: 'Bulk Transaction Operations',
      category: 'Managing Transactions',
      duration: '5 min',
      difficulty: 'Intermediate',
      description: 'Efficiently manage multiple transactions at once using bulk operations and batch processing.',
      objectives: [
        'Select multiple transactions',
        'Bulk categorization',
        'Batch delete operations',
        'Mass import from CSV'
      ],
      content: [
        {
          type: 'text',
          content: 'When you have many transactions to manage, bulk operations save significant time and effort.'
        },
        {
          type: 'steps',
          title: 'Using Bulk Operations:',
          steps: [
            'Select transactions using checkboxes',
            'Choose the bulk action from the toolbar',
            'Configure the operation parameters',
            'Review changes before confirming',
            'Execute the bulk operation'
          ]
        },
        {
          type: 'feature-highlight',
          features: [
            'Bulk categorization for uncategorized transactions',
            'Mass delete for duplicate entries',
            'Bulk date updates for imported data',
            'Category migration for reorganization'
          ]
        }
      ]
    },
    'transaction-filters': {
      title: 'Advanced Filtering & Search',
      category: 'Managing Transactions',
      duration: '4 min',
      difficulty: 'Intermediate',
      description: 'Master advanced search and filtering techniques to quickly find and analyze specific transactions.',
      objectives: [
        'Use search filters effectively',
        'Create saved filter presets',
        'Advanced date range filtering',
        'Amount and category filters'
      ],
      content: [
        {
          type: 'text',
          content: 'As your transaction history grows, finding specific transactions becomes crucial. Master these filtering techniques for efficient data management.'
        },
        {
          type: 'filter-examples',
          examples: [
            { name: 'Last Month Groceries', filter: 'Category: Food & Dining, Date: Last 30 days' },
            { name: 'Large Expenses', filter: 'Amount: > $100, Type: Expense' },
            { name: 'Recurring Bills', filter: 'Description contains: "bill", Recurring: Yes' },
            { name: 'Cash Transactions', filter: 'Payment Method: Cash' }
          ]
        }
      ]
    },

    // Budgets Category
    'budget-basics': {
      title: 'Budget Fundamentals',
      category: 'Creating Budgets',
      duration: '4 min',
      difficulty: 'Beginner',
      description: 'Understand the core concepts of budgeting and how FinanceFlow helps you stay on track.',
      objectives: [
        'Learn budgeting principles',
        'Understand budget types',
        'Plan your budget structure',
        'Set realistic expectations'
      ],
      content: [
        {
          type: 'text',
          content: 'A budget is your financial roadmap. It helps you allocate your income toward expenses, savings, and goals while preventing overspending.'
        },
        {
          type: 'budget-types',
          types: [
            {
              name: 'Zero-Based Budget',
              description: 'Every dollar is assigned a purpose',
              pros: ['Complete control', 'No wasted money'],
              cons: ['Time-intensive', 'Less flexibility']
            },
            {
              name: '50/30/20 Rule',
              description: '50% needs, 30% wants, 20% savings',
              pros: ['Simple to follow', 'Balanced approach'],
              cons: ['May not fit all situations']
            },
            {
              name: 'Envelope Method',
              description: 'Physical or digital envelopes for categories',
              pros: ['Visual spending limits', 'Prevents overspending'],
              cons: ['Requires discipline', 'Less convenient']
            }
          ]
        }
      ]
    },
    'create-budget': {
      title: 'Creating Your First Budget',
      category: 'Creating Budgets',
      duration: '6 min',
      difficulty: 'Intermediate',
      description: 'Learn how to create effective budgets that align with your financial goals and lifestyle.',
      objectives: [
        'Understand budget categories',
        'Set realistic spending limits',
        'Configure budget tracking',
        'Monitor budget performance'
      ],
      content: [
        {
          type: 'text',
          content: 'A well-planned budget is your roadmap to financial success. FinanceFlow makes it easy to create, track, and adjust your budgets as your needs change.'
        },
        {
          type: 'warning',
          content: 'Important: Start with larger, essential categories first (housing, food, transportation) before adding discretionary spending categories.'
        },
        {
          type: 'steps',
          title: 'Creating a Budget:',
          steps: [
            'Go to the Budgets page',
            'Click "Create New Budget"',
            'Choose a budget template or start from scratch',
            'Set your total monthly income',
            'Allocate amounts to different categories',
            'Set up alerts for when you approach limits',
            'Review and save your budget'
          ]
        },
        {
          type: 'interactive',
          title: 'Try It Now',
          description: 'Create a sample budget with our guided interface',
          actionText: 'Launch Budget Creator'
        }
      ]
    },
    'budget-categories': {
      title: 'Budget Categories & Allocation',
      category: 'Creating Budgets',
      duration: '5 min',
      difficulty: 'Intermediate',
      description: 'Learn how to structure your budget categories and allocate funds effectively across different areas of your life.',
      objectives: [
        'Organize budget categories',
        'Allocate funds by priority',
        'Create category hierarchies',
        'Balance needs vs wants'
      ],
      content: [
        {
          type: 'text',
          content: 'Effective budget allocation ensures your essential needs are covered while still allowing for enjoyment and future planning.'
        },
        {
          type: 'allocation-guide',
          categories: [
            { name: 'Housing', percentage: 25, priority: 'High', examples: ['Rent/Mortgage', 'Insurance', 'Utilities'] },
            { name: 'Food', percentage: 15, priority: 'High', examples: ['Groceries', 'Dining out'] },
            { name: 'Transportation', percentage: 10, priority: 'High', examples: ['Car payment', 'Gas', 'Public transit'] },
            { name: 'Savings', percentage: 20, priority: 'High', examples: ['Emergency fund', 'Retirement'] },
            { name: 'Entertainment', percentage: 10, priority: 'Medium', examples: ['Movies', 'Hobbies'] },
            { name: 'Personal', percentage: 10, priority: 'Medium', examples: ['Clothing', 'Healthcare'] },
            { name: 'Miscellaneous', percentage: 10, priority: 'Low', examples: ['Gifts', 'Unexpected'] }
          ]
        }
      ]
    },
    'budget-monitoring': {
      title: 'Monitoring Budget Performance',
      category: 'Creating Budgets',
      duration: '3 min',
      difficulty: 'Beginner',
      description: 'Learn how to track your budget progress and identify when adjustments are needed.',
      objectives: [
        'Read budget progress indicators',
        'Understand variance analysis',
        'Set up budget alerts',
        'Make mid-month adjustments'
      ],
      content: [
        {
          type: 'text',
          content: 'Regular budget monitoring helps you stay on track and make informed decisions about your spending.'
        },
        {
          type: 'monitoring-tools',
          tools: [
            { name: 'Progress Bars', description: 'Visual representation of category spending' },
            { name: 'Alerts', description: 'Notifications when approaching limits' },
            { name: 'Variance Reports', description: 'Compare actual vs budgeted amounts' },
            { name: 'Trending Analysis', description: 'Identify spending patterns over time' }
          ]
        }
      ]
    },
    'budget-templates': {
      title: 'Using Budget Templates',
      category: 'Creating Budgets',
      duration: '4 min',
      difficulty: 'Beginner',
      description: 'Discover pre-built budget templates and learn how to customize them for your specific needs.',
      objectives: [
        'Explore available templates',
        'Customize template categories',
        'Create your own templates',
        'Share templates with family'
      ],
      content: [
        {
          type: 'text',
          content: 'Budget templates provide a great starting point and can save you time when creating new budgets or helping family members get started.'
        },
        {
          type: 'template-showcase',
          templates: [
            { name: 'Student Budget', description: 'Perfect for college students managing limited income', categories: 8 },
            { name: 'Family Budget', description: 'Comprehensive template for families with children', categories: 12 },
            { name: 'Retiree Budget', description: 'Fixed income focus with healthcare considerations', categories: 10 },
            { name: 'Freelancer Budget', description: 'Variable income with business expense tracking', categories: 15 }
          ]
        }
      ]
    },

    // Goals Category
    'goal-types': {
      title: 'Types of Financial Goals',
      category: 'Setting Goals',
      duration: '3 min',
      difficulty: 'Beginner',
      description: 'Learn about different types of financial goals and how to structure them for success.',
      objectives: [
        'Understand goal categories',
        'Learn SMART goal principles',
        'Identify your goal priorities',
        'Plan goal timelines'
      ],
      content: [
        {
          type: 'text',
          content: 'Financial goals give your money management purpose and direction. Understanding different goal types helps you create a comprehensive financial plan.'
        },
        {
          type: 'goal-categories',
          categories: [
            {
              name: 'Emergency Fund',
              description: '3-6 months of expenses for unexpected events',
              timeline: 'Short-term',
              priority: 'High'
            },
            {
              name: 'Debt Payoff',
              description: 'Systematic elimination of credit card or loan debt',
              timeline: 'Medium-term',
              priority: 'High'
            },
            {
              name: 'Major Purchase',
              description: 'Car, home down payment, or large appliance',
              timeline: 'Medium-term',
              priority: 'Medium'
            },
            {
              name: 'Vacation',
              description: 'Dream trip or annual holiday fund',
              timeline: 'Short-term',
              priority: 'Medium'
            },
            {
              name: 'Retirement',
              description: 'Long-term wealth building for future',
              timeline: 'Long-term',
              priority: 'High'
            }
          ]
        }
      ]
    },
    'create-goal': {
      title: 'Creating Your First Goal',
      category: 'Setting Goals',
      duration: '5 min',
      difficulty: 'Beginner',
      description: 'Step-by-step guide to creating and setting up your first financial goal in FinanceFlow.',
      objectives: [
        'Set up goal details',
        'Calculate target amounts',
        'Set realistic timelines',
        'Configure automatic contributions'
      ],
      content: [
        {
          type: 'text',
          content: 'Creating your first goal is exciting! Let\'s walk through the process of setting up a goal that you can actually achieve.'
        },
        {
          type: 'steps',
          title: 'Creating a Goal:',
          steps: [
            'Navigate to the Goals section',
            'Click "Create New Goal"',
            'Choose your goal type and category',
            'Set your target amount',
            'Choose your target date',
            'Set up automatic or manual contributions',
            'Add motivational images or notes',
            'Review and save your goal'
          ]
        },
        {
          type: 'calculator',
          title: 'Goal Calculator',
          description: 'Calculate how much you need to save monthly to reach your goal'
        },
        {
          type: 'interactive',
          title: 'Try It Now',
          description: 'Create a sample goal with our guided setup',
          actionText: 'Launch Goal Creator'
        }
      ]
    },
    'goal-tracking': {
      title: 'Tracking Goal Progress',
      category: 'Setting Goals',
      duration: '4 min',
      difficulty: 'Beginner',
      description: 'Learn how to monitor your progress toward financial goals and stay motivated.',
      objectives: [
        'Read progress indicators',
        'Update goal contributions',
        'Celebrate milestones',
        'Adjust goals when needed'
      ],
      content: [
        {
          type: 'text',
          content: 'Tracking your progress keeps you motivated and helps you make adjustments when life changes.'
        },
        {
          type: 'progress-indicators',
          indicators: [
            { name: 'Progress Bar', description: 'Visual representation of completion percentage' },
            { name: 'Amount Remaining', description: 'How much more you need to save' },
            { name: 'Time Remaining', description: 'Days/months until target date' },
            { name: 'Monthly Target', description: 'Required monthly contribution to stay on track' }
          ]
        },
        {
          type: 'motivation-tips',
          tips: [
            'Celebrate reaching 25%, 50%, 75% milestones',
            'Share progress with accountability partner',
            'Visualize your goal with photos or descriptions',
            'Reward yourself for consistent contributions'
          ]
        }
      ]
    },
    'goal-contributions': {
      title: 'Making Goal Contributions',
      category: 'Setting Goals',
      duration: '3 min',
      difficulty: 'Beginner',
      description: 'Learn different ways to contribute to your goals and automate your savings.',
      objectives: [
        'Make manual contributions',
        'Set up automatic transfers',
        'Track contribution sources',
        'Handle irregular contributions'
      ],
      content: [
        {
          type: 'text',
          content: 'Consistent contributions are the key to reaching your financial goals. Here are different ways to fund your goals.'
        },
        {
          type: 'contribution-methods',
          methods: [
            {
              name: 'Manual Contributions',
              description: 'Add money whenever you have extra',
              pros: ['Full control', 'Flexible amounts'],
              cons: ['Easy to forget', 'Inconsistent']
            },
            {
              name: 'Automatic Transfers',
              description: 'Set up recurring transfers from checking',
              pros: ['Consistent', 'No willpower needed'],
              cons: ['Less flexibility', 'Needs adequate balance']
            },
            {
              name: 'Percentage-Based',
              description: 'Save a percentage of each paycheck',
              pros: ['Scales with income', 'Always proportional'],
              cons: ['Variable amounts', 'Complex setup']
            }
          ]
        }
      ]
    },
    'goal-milestones': {
      title: 'Setting Milestones',
      category: 'Setting Goals',
      duration: '4 min',
      difficulty: 'Intermediate',
      description: 'Break down large goals into smaller, achievable milestones to maintain motivation.',
      objectives: [
        'Create milestone markers',
        'Set milestone rewards',
        'Track milestone progress',
        'Adjust milestones as needed'
      ],
      content: [
        {
          type: 'text',
          content: 'Large goals can feel overwhelming. Breaking them into smaller milestones makes them more manageable and keeps you motivated.'
        },
        {
          type: 'milestone-strategy',
          strategies: [
            {
              name: 'Percentage Milestones',
              description: '25%, 50%, 75%, 100% completion markers',
              example: 'Emergency fund: $1,250, $2,500, $3,750, $5,000'
            },
            {
              name: 'Time-Based Milestones',
              description: 'Monthly or quarterly checkpoints',
              example: 'Vacation fund: $500/month for 12 months'
            },
            {
              name: 'Amount-Based Milestones',
              description: 'Fixed dollar amount increments',
              example: 'Car fund: Every $1,000 saved'
            }
          ]
        },
        {
          type: 'reward-ideas',
          rewards: [
            'Small treat for 25% milestone',
            'Nice dinner out for 50% milestone',
            'Weekend activity for 75% milestone',
            'Big celebration for 100% milestone'
          ]
        }
      ]
    },

    // Reports Category
    'reports-overview': {
      title: 'Reports Dashboard Overview',
      category: 'Understanding Reports',
      duration: '4 min',
      difficulty: 'Beginner',
      description: 'Get familiar with FinanceFlow\'s reporting dashboard and understand key financial metrics.',
      objectives: [
        'Navigate the reports dashboard',
        'Understand key metrics',
        'Customize report views',
        'Export report data'
      ],
      content: [
        {
          type: 'text',
          content: 'Reports turn your financial data into actionable insights. The dashboard provides a comprehensive view of your financial health.'
        },
        {
          type: 'dashboard-tour',
          sections: [
            { name: 'Summary Cards', description: 'Quick overview of key metrics' },
            { name: 'Spending Analysis', description: 'Category breakdown and trends' },
            { name: 'Income Tracking', description: 'Income sources and patterns' },
            { name: 'Budget Performance', description: 'How well you\'re sticking to budgets' },
            { name: 'Goal Progress', description: 'Savings and goal achievement status' }
          ]
        },
        {
          type: 'key-metrics',
          metrics: [
            { name: 'Net Income', description: 'Total income minus total expenses' },
            { name: 'Savings Rate', description: 'Percentage of income saved' },
            { name: 'Budget Variance', description: 'Difference between budgeted and actual spending' },
            { name: 'Category Trends', description: 'Spending changes over time' }
          ]
        }
      ]
    },
    'spending-analysis': {
      title: 'Analyzing Spending Patterns',
      category: 'Understanding Reports',
      duration: '6 min',
      difficulty: 'Intermediate',
      description: 'Learn how to interpret spending analysis reports and identify opportunities for improvement.',
      objectives: [
        'Read spending charts',
        'Identify spending trends',
        'Compare periods',
        'Find optimization opportunities'
      ],
      content: [
        {
          type: 'text',
          content: 'Understanding your spending patterns is crucial for making informed financial decisions and identifying areas where you can optimize your budget.'
        },
        {
          type: 'chart-guide',
          charts: [
            {
              name: 'Category Pie Chart',
              description: 'Shows spending distribution across categories',
              insights: ['Which categories consume most of your budget', 'Balance between needs and wants']
            },
            {
              name: 'Monthly Trend Line',
              description: 'Tracks spending changes over time',
              insights: ['Seasonal spending patterns', 'Growing or shrinking categories']
            },
            {
              name: 'Daily Average Bar',
              description: 'Average daily spending by category',
              insights: ['Daily spending habits', 'Weekend vs weekday differences']
            }
          ]
        },
        {
          type: 'analysis-tips',
          tips: [
            'Look for categories where spending consistently exceeds budget',
            'Identify seasonal patterns (higher utilities in summer/winter)',
            'Compare spending to income trends',
            'Focus on largest categories for biggest impact'
          ]
        }
      ]
    },
    'income-tracking': {
      title: 'Income Analysis & Trends',
      category: 'Understanding Reports',
      duration: '5 min',
      difficulty: 'Intermediate',
      description: 'Analyze your income patterns and understand how income stability affects your financial planning.',
      objectives: [
        'Track income sources',
        'Analyze income stability',
        'Plan for variable income',
        'Optimize income streams'
      ],
      content: [
        {
          type: 'text',
          content: 'Understanding your income patterns helps you plan better budgets and prepare for periods of variable earnings.'
        },
        {
          type: 'income-types',
          types: [
            {
              name: 'Salary',
              characteristics: ['Predictable', 'Monthly/bi-weekly'],
              planning: 'Easy to budget with fixed amounts'
            },
            {
              name: 'Freelance/Gig',
              characteristics: ['Variable', 'Project-based'],
              planning: 'Budget conservatively, save during high months'
            },
            {
              name: 'Investment',
              characteristics: ['Passive', 'May fluctuate'],
              planning: 'Don\'t rely on for essential expenses'
            },
            {
              name: 'Side Hustle',
              characteristics: ['Supplementary', 'Time-dependent'],
              planning: 'Great for goal funding and extra savings'
            }
          ]
        },
        {
          type: 'stability-metrics',
          metrics: [
            'Average monthly income',
            'Income volatility (standard deviation)',
            'Minimum monthly income (worst case)',
            'Growth rate over time'
          ]
        }
      ]
    },
    'budget-performance': {
      title: 'Budget Performance Reports',
      category: 'Understanding Reports',
      duration: '4 min',
      difficulty: 'Intermediate',
      description: 'Learn how to evaluate budget performance and make data-driven adjustments to improve your financial control.',
      objectives: [
        'Read budget variance reports',
        'Identify problem categories',
        'Understand seasonal variations',
        'Make budget adjustments'
      ],
      content: [
        {
          type: 'text',
          content: 'Budget performance reports show how well you\'re sticking to your planned spending and help identify areas needing attention.'
        },
        {
          type: 'variance-analysis',
          indicators: [
            {
              name: 'Green (Under Budget)',
              meaning: 'Spending less than planned',
              action: 'Great job! Consider if budget was too generous'
            },
            {
              name: 'Yellow (Near Limit)',
              meaning: 'Approaching budget limit',
              action: 'Monitor closely, adjust spending if needed'
            },
            {
              name: 'Red (Over Budget)',
              meaning: 'Exceeded planned amount',
              action: 'Analyze causes, adjust budget or spending habits'
            }
          ]
        },
        {
          type: 'improvement-strategies',
          strategies: [
            'Increase budget for consistently over-budget categories',
            'Set up alerts at 75% of budget limit',
            'Review and adjust budgets monthly',
            'Consider envelope method for problem categories'
          ]
        }
      ]
    },
    'export-data': {
      title: 'Exporting & Sharing Reports',
      category: 'Understanding Reports',
      duration: '3 min',
      difficulty: 'Beginner',
      description: 'Learn how to export your financial data and share reports with family members or financial advisors.',
      objectives: [
        'Export data to CSV/Excel',
        'Generate PDF reports',
        'Share reports securely',
        'Schedule automatic reports'
      ],
      content: [
        {
          type: 'text',
          content: 'Exporting your financial data gives you flexibility to use other tools or share information with trusted advisors.'
        },
        {
          type: 'export-options',
          options: [
            {
              format: 'CSV',
              use: 'Import into Excel or Google Sheets',
              includes: 'Raw transaction data with all fields'
            },
            {
              format: 'PDF',
              use: 'Professional reports for advisors',
              includes: 'Formatted reports with charts and summaries'
            },
            {
              format: 'JSON',
              use: 'Integration with other apps',
              includes: 'Complete data structure for developers'
            }
          ]
        },
        {
          type: 'sharing-tips',
          tips: [
            'Remove sensitive account numbers before sharing',
            'Use date ranges to limit shared data',
            'Consider password-protecting exported files',
            'Schedule monthly reports for regular review'
          ]
        }
      ]
    }
  };

  const currentStep = tutorialSteps?.[stepId];

  if (!currentStep) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Tutorial Not Found</h3>
          <p className="text-muted-foreground">The requested tutorial step could not be loaded.</p>
        </div>
      </div>
    );
  }

  const handleNoteChange = (value) => {
    setUserNote(value);
    onNoteUpdate(stepId, value);
  };

  const handleQuizAnswer = (questionIndex, selectedAnswer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedAnswer
    }));
  };

  const handlePracticeChange = (field, value) => {
    setPracticeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderContent = (item, index) => {
    switch (item?.type) {
      case 'text':
        return (
          <p className="text-muted-foreground leading-relaxed mb-6">
            {item?.content}
          </p>
        );
        
      case 'steps':
        return (
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-4">{item?.title}</h4>
            <ol className="space-y-3">
              {item?.steps?.map((step, stepIndex) => (
                <li key={stepIndex} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    {stepIndex + 1}
                  </div>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        );
        
      case 'tip':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Icon name="Lightbulb" size={20} className="text-blue-500 mr-3 mt-0.5" />
              <p className="text-blue-800 text-sm">{item?.content}</p>
            </div>
          </div>
        );
        
      case 'warning':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Icon name="AlertTriangle" size={20} className="text-yellow-600 mr-3 mt-0.5" />
              <p className="text-yellow-800 text-sm">{item?.content}</p>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4 flex items-center">
              <Icon name="HelpCircle" size={20} className="mr-2 text-green-600" />
              Quick Quiz
            </h4>
            <p className="text-muted-foreground mb-4">{item?.question}</p>
            <div className="space-y-3">
              {item?.options?.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleQuizAnswer(index, optionIndex)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    quizAnswers?.[index] === optionIndex
                      ? quizAnswers?.[index] === item?.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800' :'border-red-500 bg-red-50 text-red-800' :'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                  {option}
                </button>
              ))}
            </div>
            {quizAnswers?.[index] !== undefined && (
              <div className="mt-4 text-sm">
                {quizAnswers?.[index] === item?.correctAnswer ? (
                  <div className="text-green-600 flex items-center">
                    <Icon name="CheckCircle" size={16} className="mr-1" />
                    Correct! Well done.
                  </div>
                ) : (
                  <div className="text-red-600 flex items-center">
                    <Icon name="XCircle" size={16} className="mr-1" />
                    Not quite. The correct answer is {String.fromCharCode(65 + item?.correctAnswer)}.
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'practice':
        return (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Code" size={20} className="mr-2 text-purple-600" />
              {item?.title}
            </h4>
            <p className="text-muted-foreground mb-4">{item?.description}</p>
            <div className="space-y-4">
              {item?.fields?.includes('amount') && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={practiceData?.amount}
                    onChange={(e) => handlePracticeChange('amount', e?.target?.value)}
                    className="w-full"
                  />
                </div>
              )}
              {item?.fields?.includes('description') && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <Input
                    type="text"
                    placeholder="What was this transaction for?"
                    value={practiceData?.description}
                    onChange={(e) => handlePracticeChange('description', e?.target?.value)}
                    className="w-full"
                  />
                </div>
              )}
              {item?.fields?.includes('category') && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select 
                    value={practiceData?.category}
                    onChange={(e) => handlePracticeChange('category', e?.target?.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select a category</option>
                    <option value="food">Food & Dining</option>
                    <option value="transport">Transportation</option>
                    <option value="shopping">Shopping</option>
                    <option value="bills">Bills & Utilities</option>
                  </select>
                </div>
              )}
              <Button 
                variant="default" 
                onClick={() => {
                  // Simulate saving the practice data
                  alert(`Practice transaction saved!\nAmount: $${practiceData?.amount}\nDescription: ${practiceData?.description}\nCategory: ${practiceData?.category}`);
                }}
                disabled={!practiceData?.amount || !practiceData?.description}
              >
                Save Practice Transaction
              </Button>
            </div>
          </div>
        );

      case 'checklist':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4">{item?.title}</h4>
            <div className="space-y-3">
              {item?.items?.map((checkItem, checkIndex) => (
                <label key={checkIndex} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkItem?.completed}
                    onChange={() => {
                      // Update checklist item completion
                      const updatedItems = [...item?.items];
                      updatedItems[checkIndex].completed = !updatedItems?.[checkIndex]?.completed;
                    }}
                    className="mr-3 rounded"
                  />
                  <span className={`${checkItem?.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {checkItem?.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'feature-tour':
        return (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {item?.features?.map((feature, featureIndex) => (
              <div key={featureIndex} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Icon name={feature?.icon} size={20} className="text-primary mr-2" />
                  <h5 className="font-medium text-foreground">{feature?.name}</h5>
                </div>
                <p className="text-sm text-muted-foreground">{feature?.description}</p>
              </div>
            ))}
          </div>
        );

      case 'keyboard-shortcuts':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Keyboard" size={20} className="mr-2 text-gray-600" />
              Keyboard Shortcuts
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {item?.shortcuts?.map((shortcut, shortcutIndex) => (
                <div key={shortcutIndex} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm text-muted-foreground">{shortcut?.action}</span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">{shortcut?.keys}</span>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'interactive':
        return (
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-2">{item?.title}</h4>
            <p className="text-muted-foreground text-sm mb-4">{item?.description}</p>
            <Button
              variant="default"
              onClick={() => onTryItNow(stepId)}
              iconName="ExternalLink"
              iconPosition="right"
            >
              {item?.actionText}
            </Button>
          </div>
        );
        
      case 'video':
        return (
          <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Icon name="Play" size={48} className="text-muted-foreground" />
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-foreground mb-1">{item?.title}</h4>
              <p className="text-sm text-muted-foreground">Duration: {item?.duration}</p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full mr-4">
              {currentStep?.category}
            </div>
            {isCompleted && (
              <div className="flex items-center text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
                <Icon name="CheckCircle" size={16} className="mr-1" />
                Completed
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Icon name="Clock" size={16} className="mr-1" />
              {currentStep?.duration}
            </span>
            <span className="flex items-center">
              <Icon name="BarChart" size={16} className="mr-1" />
              {currentStep?.difficulty}
            </span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">{currentStep?.title}</h1>
        <p className="text-lg text-muted-foreground mb-6">{currentStep?.description}</p>
        
        {/* Learning Objectives */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Target" size={20} className="mr-2 text-primary" />
            What You'll Learn
          </h3>
          <ul className="space-y-2">
            {currentStep?.objectives?.map((objective, index) => (
              <li key={index} className="flex items-center text-muted-foreground">
                <Icon name="Check" size={16} className="text-green-500 mr-3" />
                {objective}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Content */}
      <div className="mb-8">
        {currentStep?.content?.map((item, index) => (
          <div key={index}>
            {renderContent(item, index)}
          </div>
        ))}
      </div>
      {/* Notes Section */}
      <div className="mb-8">
        <h3 className="font-semibold text-foreground mb-3 flex items-center">
          <Icon name="StickyNote" size={20} className="mr-2 text-primary" />
          Your Notes
        </h3>
        <textarea
          value={userNote}
          onChange={(e) => handleNoteChange(e?.target?.value)}
          placeholder="Add your personal notes about this tutorial..."
          className="w-full h-32 p-4 border border-border rounded-lg bg-card text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button variant="outline" iconName="BookOpen">
          View All Tutorials
        </Button>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="default"
            onClick={() => onTryItNow(stepId)}
            iconName="ExternalLink"
            iconPosition="right"
          >
            Try It Now
          </Button>
          
          {!isCompleted && (
            <Button
              variant="default"
              onClick={() => onComplete(stepId)}
              iconName="Check"
              iconPosition="right"
              className="bg-green-600 hover:bg-green-700"
            >
              Mark Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialContent;