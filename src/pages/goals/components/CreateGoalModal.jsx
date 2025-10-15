import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateGoalModal = ({ isOpen, onClose, onCreateGoal }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'savings',
    targetAmount: '',
    targetDate: '',
    priority: false,
    autoContribute: false,
    monthlyContribution: ''
  });

  const [errors, setErrors] = useState({});

  const goalTypes = [
    { id: 'savings', name: 'Savings Goal', icon: 'PiggyBank', description: 'Build up savings for future needs' },
    { id: 'debt', name: 'Debt Payoff', icon: 'CreditCard', description: 'Pay down existing debt' },
    { id: 'emergency', name: 'Emergency Fund', icon: 'Shield', description: 'Build financial safety net' },
    { id: 'vacation', name: 'Vacation Fund', icon: 'Plane', description: 'Save for travel and experiences' },
    { id: 'home', name: 'Home Purchase', icon: 'Home', description: 'Save for down payment or home' },
    { id: 'car', name: 'Vehicle Fund', icon: 'Car', description: 'Save for car purchase or repairs' },
    { id: 'education', name: 'Education', icon: 'GraduationCap', description: 'Save for education expenses' },
    { id: 'retirement', name: 'Retirement', icon: 'TrendingUp', description: 'Long-term retirement savings' },
    { id: 'custom', name: 'Custom Goal', icon: 'Target', description: 'Create your own savings goal' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!formData?.targetAmount || parseFloat(formData?.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }

    if (!formData?.targetDate) {
      newErrors.targetDate = 'Target date is required';
    } else {
      const targetDate = new Date(formData.targetDate);
      const today = new Date();
      if (targetDate <= today) {
        newErrors.targetDate = 'Target date must be in the future';
      }
    }

    if (formData?.autoContribute && (!formData?.monthlyContribution || parseFloat(formData?.monthlyContribution) <= 0)) {
      newErrors.monthlyContribution = 'Monthly contribution must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newGoal = {
      id: Date.now()?.toString(),
      ...formData,
      targetAmount: parseFloat(formData?.targetAmount),
      monthlyContribution: formData?.monthlyContribution ? parseFloat(formData?.monthlyContribution) : 0,
      currentAmount: 0,
      createdDate: new Date()?.toISOString(),
      lastContribution: null
    };

    onCreateGoal(newGoal);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      type: 'savings',
      targetAmount: '',
      targetDate: '',
      priority: false,
      autoContribute: false,
      monthlyContribution: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create New Goal</h2>
            <p className="text-sm text-muted-foreground">Set up a financial goal to track your progress</p>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Goal Type Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Goal Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {goalTypes?.map((type) => (
                <button
                  key={type?.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type?.id }))}
                  className={`p-3 rounded-lg border text-left transition-smooth hover-lift ${
                    formData?.type === type?.id
                      ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name={type?.icon} size={18} />
                    <span className="font-medium text-sm">{type?.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{type?.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Goal Name"
              type="text"
              name="name"
              value={formData?.name}
              onChange={handleInputChange}
              placeholder="e.g., Emergency Fund"
              error={errors?.name}
              required
            />
            <Input
              label="Target Amount"
              type="number"
              name="targetAmount"
              value={formData?.targetAmount}
              onChange={handleInputChange}
              placeholder="10000"
              error={errors?.targetAmount}
              required
            />
          </div>

          <Input
            label="Description (Optional)"
            type="text"
            name="description"
            value={formData?.description}
            onChange={handleInputChange}
            placeholder="Brief description of your goal"
          />

          <Input
            label="Target Date"
            type="date"
            name="targetDate"
            value={formData?.targetDate}
            onChange={handleInputChange}
            error={errors?.targetDate}
            required
          />

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="priority"
                name="priority"
                checked={formData?.priority}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor="priority" className="text-sm font-medium text-foreground">
                Mark as high priority
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoContribute"
                name="autoContribute"
                checked={formData?.autoContribute}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor="autoContribute" className="text-sm font-medium text-foreground">
                Set up automatic monthly contributions
              </label>
            </div>

            {formData?.autoContribute && (
              <Input
                label="Monthly Contribution"
                type="number"
                name="monthlyContribution"
                value={formData?.monthlyContribution}
                onChange={handleInputChange}
                placeholder="500"
                error={errors?.monthlyContribution}
                description="Amount to automatically contribute each month"
              />
            )}
          </div>

          {/* Calculation Preview */}
          {formData?.targetAmount && formData?.targetDate && (
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Goal Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Target Amount:</span>
                  <div className="font-semibold text-foreground">
                    ${parseFloat(formData?.targetAmount || 0)?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly Required:</span>
                  <div className="font-semibold text-foreground">
                    ${Math.ceil((parseFloat(formData?.targetAmount || 0) / Math.max((new Date(formData.targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 30), 1)))?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              fullWidth
              iconName="Target"
              iconPosition="left"
            >
              Create Goal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGoalModal;