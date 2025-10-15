import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetTemplates = ({ isOpen, onClose, onApplyTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: '50/30/20 Rule',
      description: 'Allocate 50% for needs, 30% for wants, 20% for savings',
      icon: 'PieChart',
      color: 'bg-blue-500',
      budgets: [
        { category: 'Housing & Utilities', percentage: 25, icon: 'Home', color: 'bg-blue-500' },
        { category: 'Groceries', percentage: 15, icon: 'ShoppingCart', color: 'bg-green-500' },
        { category: 'Transportation', percentage: 10, icon: 'Car', color: 'bg-purple-500' },
        { category: 'Entertainment', percentage: 15, icon: 'Film', color: 'bg-pink-500' },
        { category: 'Dining Out', percentage: 10, icon: 'Coffee', color: 'bg-orange-500' },
        { category: 'Shopping', percentage: 5, icon: 'ShoppingBag', color: 'bg-red-500' },
        { category: 'Savings', percentage: 20, icon: 'PiggyBank', color: 'bg-yellow-500' }
      ]
    },
    {
      id: 2,
      name: 'Student Budget',
      description: 'Budget template optimized for students and young professionals',
      icon: 'GraduationCap',
      color: 'bg-green-500',
      budgets: [
        { category: 'Housing & Utilities', percentage: 30, icon: 'Home', color: 'bg-blue-500' },
        { category: 'Groceries', percentage: 20, icon: 'ShoppingCart', color: 'bg-green-500' },
        { category: 'Transportation', percentage: 15, icon: 'Car', color: 'bg-purple-500' },
        { category: 'Entertainment', percentage: 15, icon: 'Film', color: 'bg-pink-500' },
        { category: 'Education', percentage: 10, icon: 'BookOpen', color: 'bg-indigo-500' },
        { category: 'Savings', percentage: 10, icon: 'PiggyBank', color: 'bg-yellow-500' }
      ]
    },
    {
      id: 3,
      name: 'Family Budget',
      description: 'Comprehensive budget for families with children',
      icon: 'Users',
      color: 'bg-purple-500',
      budgets: [
        { category: 'Housing & Utilities', percentage: 30, icon: 'Home', color: 'bg-blue-500' },
        { category: 'Groceries', percentage: 18, icon: 'ShoppingCart', color: 'bg-green-500' },
        { category: 'Transportation', percentage: 12, icon: 'Car', color: 'bg-purple-500' },
        { category: 'Healthcare', percentage: 8, icon: 'Heart', color: 'bg-red-500' },
        { category: 'Childcare & Education', percentage: 12, icon: 'Baby', color: 'bg-pink-500' },
        { category: 'Entertainment', percentage: 8, icon: 'Film', color: 'bg-orange-500' },
        { category: 'Savings', percentage: 12, icon: 'PiggyBank', color: 'bg-yellow-500' }
      ]
    },
    {
      id: 4,
      name: 'Minimalist Budget',
      description: 'Simple budget focusing on essentials and savings',
      icon: 'Minus',
      color: 'bg-gray-500',
      budgets: [
        { category: 'Housing & Utilities', percentage: 35, icon: 'Home', color: 'bg-blue-500' },
        { category: 'Groceries', percentage: 20, icon: 'ShoppingCart', color: 'bg-green-500' },
        { category: 'Transportation', percentage: 15, icon: 'Car', color: 'bg-purple-500' },
        { category: 'Healthcare', percentage: 5, icon: 'Heart', color: 'bg-red-500' },
        { category: 'Savings', percentage: 25, icon: 'PiggyBank', color: 'bg-yellow-500' }
      ]
    }
  ];

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onApplyTemplate(selectedTemplate);
      onClose();
      setSelectedTemplate(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-lg border border-border p-6 w-full max-w-4xl mx-4 elevation-3 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Budget Templates</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a template to quickly set up your budgets
            </p>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {templates?.map((template) => (
            <div
              key={template?.id}
              onClick={() => setSelectedTemplate(template)}
              className={`p-6 rounded-lg border cursor-pointer transition-smooth hover-lift ${
                selectedTemplate?.id === template?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              {/* Template Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${template?.color}`}>
                  <Icon name={template?.icon} size={24} color="white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{template?.name}</h3>
                  <p className="text-sm text-muted-foreground">{template?.description}</p>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Budget Allocation:</h4>
                {template?.budgets?.map((budget, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${budget?.color}`}>
                        <Icon name={budget?.icon} size={12} color="white" />
                      </div>
                      <span className="text-sm text-foreground">{budget?.category}</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {budget?.percentage}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Selection Indicator */}
              {selectedTemplate?.id === template?.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-2 text-primary">
                    <Icon name="CheckCircle" size={16} />
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Template Preview */}
        {selectedTemplate && (
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-foreground mb-3">Preview: {selectedTemplate?.name}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedTemplate?.budgets?.map((budget, index) => (
                <div key={index} className="flex items-center justify-between bg-card p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded ${budget?.color}`} />
                    <span className="text-sm font-medium">{budget?.category}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{budget?.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleApplyTemplate}
            disabled={!selectedTemplate}
            iconName="Check"
            iconPosition="left"
          >
            Apply Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BudgetTemplates;