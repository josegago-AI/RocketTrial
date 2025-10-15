import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import GoalCard from './components/GoalCard';
import CreateGoalModal from './components/CreateGoalModal';
import ContributeModal from './components/ContributeModal';
import EditGoalModal from './components/EditGoalModal';
import GoalsSummary from './components/GoalsSummary';

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: '1',
      name: 'Emergency Fund',
      description: 'Build a 6-month emergency fund for financial security',
      type: 'emergency',
      targetAmount: 15000,
      currentAmount: 8500,
      targetDate: '2024-12-31',
      priority: true,
      autoContribute: true,
      monthlyContribution: 500,
      createdDate: '2024-01-15T00:00:00.000Z',
      lastContribution: '2024-09-01T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'Dream Vacation',
      description: 'Save for a 2-week European vacation',
      type: 'vacation',
      targetAmount: 8000,
      currentAmount: 3200,
      targetDate: '2025-06-15',
      priority: false,
      autoContribute: false,
      monthlyContribution: 0,
      createdDate: '2024-03-10T00:00:00.000Z',
      lastContribution: '2024-08-15T00:00:00.000Z'
    },
    {
      id: '3',
      name: 'Home Down Payment',
      description: 'Save 20% down payment for first home purchase',
      type: 'home',
      targetAmount: 60000,
      currentAmount: 22000,
      targetDate: '2026-03-01',
      priority: true,
      autoContribute: true,
      monthlyContribution: 1200,
      createdDate: '2023-12-01T00:00:00.000Z',
      lastContribution: '2024-09-10T00:00:00.000Z'
    },
    {
      id: '4',
      name: 'Car Replacement Fund',
      description: 'Save for reliable used car replacement',
      type: 'car',
      targetAmount: 25000,
      currentAmount: 12500,
      targetDate: '2025-08-01',
      priority: false,
      autoContribute: true,
      monthlyContribution: 400,
      createdDate: '2024-02-20T00:00:00.000Z',
      lastContribution: '2024-09-05T00:00:00.000Z'
    },
    {
      id: '5',
      name: 'Education Fund',
      description: 'Professional development and certification courses',
      type: 'education',
      targetAmount: 5000,
      currentAmount: 4800,
      targetDate: '2024-11-30',
      priority: false,
      autoContribute: false,
      monthlyContribution: 0,
      createdDate: '2024-05-01T00:00:00.000Z',
      lastContribution: '2024-08-30T00:00:00.000Z'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  const handleCreateGoal = (newGoal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const handleContribute = (contribution) => {
    setGoals(prev => prev?.map(goal => 
      goal?.id === contribution?.goalId 
        ? { 
            ...goal, 
            currentAmount: goal?.currentAmount + contribution?.amount,
            lastContribution: contribution?.date
          }
        : goal
    ));
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  };

  const handleUpdateGoal = (updatedGoal) => {
    setGoals(prev => prev?.map(goal => 
      goal?.id === updatedGoal?.id ? updatedGoal : goal
    ));
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      setGoals(prev => prev?.filter(goal => goal?.id !== goalId));
    }
  };

  const handleContributeClick = (goal) => {
    setSelectedGoal(goal);
    setIsContributeModalOpen(true);
  };

  const getFilteredAndSortedGoals = () => {
    let filtered = goals;

    // Filter by type
    if (filterType !== 'all') {
      if (filterType === 'active') {
        filtered = goals?.filter(goal => goal?.currentAmount < goal?.targetAmount);
      } else if (filterType === 'completed') {
        filtered = goals?.filter(goal => goal?.currentAmount >= goal?.targetAmount);
      } else {
        filtered = goals?.filter(goal => goal?.type === filterType);
      }
    }

    // Sort goals
    return filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          if (a?.priority && !b?.priority) return -1;
          if (!a?.priority && b?.priority) return 1;
          return new Date(a.targetDate) - new Date(b.targetDate);
        case 'progress':
          const aProgress = (a?.currentAmount / a?.targetAmount) * 100;
          const bProgress = (b?.currentAmount / b?.targetAmount) * 100;
          return bProgress - aProgress;
        case 'amount':
          return b?.targetAmount - a?.targetAmount;
        case 'deadline':
          return new Date(a.targetDate) - new Date(b.targetDate);
        default:
          return 0;
      }
    });
  };

  const filteredGoals = getFilteredAndSortedGoals();

  const filterOptions = [
    { value: 'all', label: 'All Goals', count: goals?.length },
    { value: 'active', label: 'Active', count: goals?.filter(g => g?.currentAmount < g?.targetAmount)?.length },
    { value: 'completed', label: 'Completed', count: goals?.filter(g => g?.currentAmount >= g?.targetAmount)?.length },
    { value: 'savings', label: 'Savings', count: goals?.filter(g => g?.type === 'savings')?.length },
    { value: 'emergency', label: 'Emergency', count: goals?.filter(g => g?.type === 'emergency')?.length },
    { value: 'vacation', label: 'Vacation', count: goals?.filter(g => g?.type === 'vacation')?.length },
    { value: 'home', label: 'Home', count: goals?.filter(g => g?.type === 'home')?.length },
    { value: 'car', label: 'Vehicle', count: goals?.filter(g => g?.type === 'car')?.length }
  ];

  const sortOptions = [
    { value: 'priority', label: 'Priority & Deadline' },
    { value: 'progress', label: 'Progress' },
    { value: 'amount', label: 'Target Amount' },
    { value: 'deadline', label: 'Deadline' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">Financial Goals</h1>
              <p className="text-muted-foreground">
                Track your progress and achieve your financial objectives
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Goal
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <GoalsSummary goals={goals} />

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filterOptions?.filter(option => option?.count > 0)?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => setFilterType(option?.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                    filterType === option?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  }`}
                >
                  {option?.label} ({option?.count})
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e?.target?.value)}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sortOptions?.map((option) => (
                  <option key={option?.value} value={option?.value}>
                    Sort by {option?.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Goals Grid */}
          {filteredGoals?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGoals?.map((goal) => (
                <GoalCard
                  key={goal?.id}
                  goal={goal}
                  onContribute={handleContributeClick}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Target" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {filterType === 'all' ? 'No goals yet' : `No ${filterType} goals found`}
              </h3>
              <p className="text-muted-foreground mb-6">
                {filterType === 'all' ?'Start by creating your first financial goal to track your progress.' :'Try adjusting your filters or create a new goal.'
                }
              </p>
              {filterType === 'all' && (
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create Your First Goal
                </Button>
              )}
            </div>
          )}

          {/* Motivational Section */}
          {goals?.length > 0 && (
            <div className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-8 text-center">
              <Icon name="Trophy" size={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Keep Going! You're Making Great Progress
              </h3>
              <p className="text-muted-foreground mb-4">
                Every contribution brings you closer to achieving your financial dreams.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-foreground">
                    {goals?.filter(g => g?.currentAmount >= g?.targetAmount)?.length} goals completed
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={16} className="text-primary" />
                  <span className="text-foreground">
                    ${goals?.reduce((sum, g) => sum + g?.currentAmount, 0)?.toLocaleString()} total saved
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <QuickActionButton />
      {/* Modals */}
      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGoal={handleCreateGoal}
      />
      <ContributeModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
        goal={selectedGoal}
        onContribute={handleContribute}
      />
      <EditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        goal={selectedGoal}
        onUpdateGoal={handleUpdateGoal}
      />
    </div>
  );
};

export default Goals;