import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EditGoalModal = ({ isOpen, onClose, goal, onUpdateGoal }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    priority: false,
    autoContribute: false,
    monthlyContribution: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal?.name || '',
        description: goal?.description || '',
        targetAmount: goal?.targetAmount?.toString() || '',
        targetDate: goal?.targetDate ? goal?.targetDate?.split('T')?.[0] : '',
        priority: goal?.priority || false,
        autoContribute: goal?.autoContribute || false,
        monthlyContribution: goal?.monthlyContribution?.toString() || ''
      });
    }
  }, [goal]);

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

    const updatedGoal = {
      ...goal,
      ...formData,
      targetAmount: parseFloat(formData?.targetAmount),
      monthlyContribution: formData?.monthlyContribution ? parseFloat(formData?.monthlyContribution) : 0,
      updatedDate: new Date()?.toISOString()
    };

    onUpdateGoal(updatedGoal);
    setErrors({});
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  if (!isOpen || !goal) return null;

  const currentProgress = goal?.currentAmount / parseFloat(formData?.targetAmount || goal?.targetAmount) * 100;
  const remainingAmount = parseFloat(formData?.targetAmount || goal?.targetAmount) - goal?.currentAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Edit Goal</h2>
            <p className="text-sm text-muted-foreground">Update your financial goal details</p>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Progress Display */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Current Progress</span>
              <span className="text-sm font-semibold text-primary">
                {((goal?.currentAmount / goal?.targetAmount) * 100)?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2 mb-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${(goal?.currentAmount / goal?.targetAmount) * 100}%` }}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(goal?.currentAmount)} saved
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
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
              label="Description (Optional)"
              type="text"
              name="description"
              value={formData?.description}
              onChange={handleInputChange}
              placeholder="Brief description of your goal"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <Input
                label="Target Date"
                type="date"
                name="targetDate"
                value={formData?.targetDate}
                onChange={handleInputChange}
                error={errors?.targetDate}
                required
              />
            </div>
          </div>

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

          {/* Updated Calculation Preview */}
          {formData?.targetAmount && formData?.targetDate && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Updated Goal Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">New Target:</span>
                  <div className="font-semibold text-foreground">
                    {formatCurrency(parseFloat(formData?.targetAmount))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Remaining:</span>
                  <div className="font-semibold text-foreground">
                    {formatCurrency(Math.max(remainingAmount, 0))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">New Progress:</span>
                  <div className="font-semibold text-primary">
                    {Math.min(currentProgress, 100)?.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly Needed:</span>
                  <div className="font-semibold text-foreground">
                    {formatCurrency(Math.max(remainingAmount / Math.max((new Date(formData.targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 30), 1), 0))}
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
              iconName="Save"
              iconPosition="left"
            >
              Update Goal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGoalModal;