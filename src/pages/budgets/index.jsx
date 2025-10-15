import React, { useState, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import BudgetCard from './components/BudgetCard';
import CreateBudgetModal from './components/CreateBudgetModal';
import BudgetSummary from './components/BudgetSummary';
import BudgetFilters from './components/BudgetFilters';
import BudgetTemplates from './components/BudgetTemplates';

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([
    {
      id: 1,
      category: 'Groceries',
      allocated: 800,
      spent: 650,
      period: 'Monthly',
      alertThreshold: 80,
      color: 'bg-green-500',
      icon: 'ShoppingCart',
      weeklySpending: [120, 95, 110, 85, 140, 100, 0],
      lastTransaction: '2 hours ago',
      transactionCount: 24
    },
    {
      id: 2,
      category: 'Transportation',
      allocated: 400,
      spent: 320,
      period: 'Monthly',
      alertThreshold: 85,
      color: 'bg-blue-500',
      icon: 'Car',
      weeklySpending: [80, 60, 70, 45, 65, 0, 0],
      lastTransaction: '1 day ago',
      transactionCount: 12
    },
    {
      id: 3,
      category: 'Entertainment',
      allocated: 300,
      spent: 280,
      period: 'Monthly',
      alertThreshold: 75,
      color: 'bg-purple-500',
      icon: 'Film',
      weeklySpending: [45, 60, 35, 50, 40, 50, 0],
      lastTransaction: '3 days ago',
      transactionCount: 18
    },
    {
      id: 4,
      category: 'Utilities',
      allocated: 250,
      spent: 265,
      period: 'Monthly',
      alertThreshold: 90,
      color: 'bg-yellow-500',
      icon: 'Zap',
      weeklySpending: [65, 70, 60, 70, 0, 0, 0],
      lastTransaction: '5 days ago',
      transactionCount: 8
    },
    {
      id: 5,
      category: 'Healthcare',
      allocated: 200,
      spent: 45,
      period: 'Monthly',
      alertThreshold: 80,
      color: 'bg-red-500',
      icon: 'Heart',
      weeklySpending: [0, 45, 0, 0, 0, 0, 0],
      lastTransaction: '2 weeks ago',
      transactionCount: 2
    },
    {
      id: 6,
      category: 'Dining Out',
      allocated: 350,
      spent: 290,
      period: 'Monthly',
      alertThreshold: 80,
      color: 'bg-orange-500',
      icon: 'Coffee',
      weeklySpending: [65, 45, 70, 55, 55, 0, 0],
      lastTransaction: 'Yesterday',
      transactionCount: 16
    }
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    period: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      period: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const handleCreateBudget = (budgetData) => {
    const newBudget = {
      ...budgetData,
      id: Date.now(),
      categoryName: budgetData?.categoryName || budgetData?.category,
      category: budgetData?.categoryName || budgetData?.category,
      weeklySpending: [0, 0, 0, 0, 0, 0, 0],
      lastTransaction: 'No transactions yet',
      transactionCount: 0,
      spent: 0
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const handleEditBudget = (budget) => {
    console.log('Edit budget:', budget);
    // Implementation for editing budget
  };

  const handleDeleteBudget = (budgetId) => {
    setBudgets(prev => prev?.filter(budget => budget?.id !== budgetId));
  };

  const handleApplyTemplate = (template) => {
    const monthlyIncome = 5000; // Mock monthly income
    const templateBudgets = template?.budgets?.map((budget, index) => ({
      id: Date.now() + index,
      category: budget?.category,
      allocated: Math.round((monthlyIncome * budget?.percentage) / 100),
      spent: 0,
      period: 'Monthly',
      alertThreshold: 80,
      color: budget?.color,
      icon: budget?.icon,
      weeklySpending: [0, 0, 0, 0, 0, 0, 0],
      lastTransaction: 'No transactions yet',
      transactionCount: 0
    }));
    setBudgets(prev => [...prev, ...templateBudgets]);
  };

  const filteredAndSortedBudgets = useMemo(() => {
    let filtered = budgets;

    // Filter by status
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(budget => {
        const percentage = (budget?.spent / budget?.allocated) * 100;
        switch (filters?.status) {
          case 'on-track':
            return percentage < 80;
          case 'warning':
            return percentage >= 80 && percentage < 100;
          case 'exceeded':
            return percentage >= 100;
          default:
            return true;
        }
      });
    }

    // Filter by period
    if (filters?.period !== 'all') {
      filtered = filtered?.filter(budget => 
        budget?.period?.toLowerCase() === filters?.period
      );
    }

    // Sort budgets
    filtered?.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters?.sortBy) {
        case 'allocated':
          aValue = a?.allocated;
          bValue = b?.allocated;
          break;
        case 'spent':
          aValue = a?.spent;
          bValue = b?.spent;
          break;
        case 'remaining':
          aValue = a?.allocated - a?.spent;
          bValue = b?.allocated - b?.spent;
          break;
        case 'progress':
          aValue = (a?.spent / a?.allocated) * 100;
          bValue = (b?.spent / b?.allocated) * 100;
          break;
        default:
          aValue = a?.category?.toLowerCase();
          bValue = b?.category?.toLowerCase();
      }

      if (filters?.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [budgets, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">Budgets</h1>
              <p className="text-muted-foreground">
                Create and manage your spending budgets to stay on track with your financial goals
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="FileTemplate"
                iconPosition="left"
                onClick={() => setIsTemplatesModalOpen(true)}
              >
                Templates
              </Button>
              <Button
                variant="outline"
                iconName={viewMode === 'cards' ? 'List' : 'Grid3X3'}
                onClick={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}
              >
                {viewMode === 'cards' ? 'List View' : 'Card View'}
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Budget
              </Button>
            </div>
          </div>

          {/* Budget Summary */}
          <BudgetSummary budgets={budgets} />

          {/* Filters */}
          <BudgetFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Budgets Grid/List */}
          {filteredAndSortedBudgets?.length > 0 ? (
            <div className={
              viewMode === 'cards' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :'space-y-4'
            }>
              {filteredAndSortedBudgets?.map((budget) => (
                <BudgetCard
                  key={budget?.id}
                  budget={budget}
                  onEdit={handleEditBudget}
                  onDelete={handleDeleteBudget}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Icon name="PiggyBank" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No budgets found</h3>
              <p className="text-muted-foreground mb-6">
                {budgets?.length === 0 
                  ? "Get started by creating your first budget or using a template" :"No budgets match your current filters. Try adjusting your search criteria."
                }
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create Budget
                </Button>
                <Button
                  variant="outline"
                  iconName="FileTemplate"
                  iconPosition="left"
                  onClick={() => setIsTemplatesModalOpen(true)}
                >
                  Use Template
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Modals */}
      <CreateBudgetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateBudget}
      />
      <BudgetTemplates
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onApplyTemplate={handleApplyTemplate}
      />
      <QuickActionButton />
    </div>
  );
};

export default BudgetsPage;