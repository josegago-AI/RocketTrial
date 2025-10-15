import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateBudgetModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    category: '',
    customCategory: '',
    allocated: '',
    period: 'monthly',
    alertThreshold: '80',
    color: 'bg-primary',
    icon: 'DollarSign'
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'groceries', label: 'Groceries', icon: 'ShoppingCart', color: 'bg-green-500' },
    { value: 'transportation', label: 'Transportation', icon: 'Car', color: 'bg-blue-500' },
    { value: 'entertainment', label: 'Entertainment', icon: 'Film', color: 'bg-purple-500' },
    { value: 'utilities', label: 'Utilities', icon: 'Zap', color: 'bg-yellow-500' },
    { value: 'healthcare', label: 'Healthcare', icon: 'Heart', color: 'bg-red-500' },
    { value: 'dining', label: 'Dining Out', icon: 'Coffee', color: 'bg-orange-500' },
    { value: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-500' },
    { value: 'custom', label: 'Custom Category', icon: 'Plus', color: 'bg-gray-500' }
  ];

  const periods = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategorySelect = (category) => {
    const selectedCategory = categories?.find(cat => cat?.value === category);
    setFormData(prev => ({
      ...prev,
      category: category,
      icon: selectedCategory?.icon || 'DollarSign',
      color: selectedCategory?.color || 'bg-primary'
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData?.category === 'custom' && !formData?.customCategory?.trim()) {
      newErrors.customCategory = 'Please enter a custom category name';
    }

    if (!formData?.allocated || parseFloat(formData?.allocated) <= 0) {
      newErrors.allocated = 'Please enter a valid budget amount';
    }

    if (!formData?.alertThreshold || parseFloat(formData?.alertThreshold) < 0 || parseFloat(formData?.alertThreshold) > 100) {
      newErrors.alertThreshold = 'Alert threshold must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      const budgetData = {
        ...formData,
        allocated: parseFloat(formData?.allocated),
        alertThreshold: parseFloat(formData?.alertThreshold),
        categoryName: formData?.category === 'custom' ? formData?.customCategory : categories?.find(cat => cat?.value === formData?.category)?.label,
        id: Date.now(),
        spent: 0,
        weeklySpending: [0, 0, 0, 0, 0, 0, 0],
        lastTransaction: 'No transactions yet',
        transactionCount: 0
      };
      onSave(budgetData);
      onClose();
      setFormData({
        category: '',
        customCategory: '',
        allocated: '',
        period: 'monthly',
        alertThreshold: '80',
        color: 'bg-primary',
        icon: 'DollarSign'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4 elevation-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Create Budget</h2>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories?.map((category) => (
                <button
                  key={category?.value}
                  type="button"
                  onClick={() => handleCategorySelect(category?.value)}
                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-smooth ${
                    formData?.category === category?.value
                      ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${category?.color}`}>
                    <Icon name={category?.icon} size={14} color="white" />
                  </div>
                  <span className="text-sm font-medium">{category?.label}</span>
                </button>
              ))}
            </div>
            {errors?.category && <p className="text-error text-sm mt-1">{errors?.category}</p>}
          </div>

          {/* Custom Category Name */}
          {formData?.category === 'custom' && (
            <Input
              label="Custom Category Name"
              type="text"
              value={formData?.customCategory}
              onChange={(e) => handleInputChange('customCategory', e?.target?.value)}
              placeholder="Enter category name"
              error={errors?.customCategory}
              required
            />
          )}

          {/* Budget Amount */}
          <Input
            label="Budget Amount"
            type="number"
            value={formData?.allocated}
            onChange={(e) => handleInputChange('allocated', e?.target?.value)}
            placeholder="0.00"
            error={errors?.allocated}
            required
          />

          {/* Time Period */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Time Period</label>
            <div className="grid grid-cols-2 gap-2">
              {periods?.map((period) => (
                <button
                  key={period?.value}
                  type="button"
                  onClick={() => handleInputChange('period', period?.value)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-smooth ${
                    formData?.period === period?.value
                      ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50'
                  }`}
                >
                  {period?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Threshold */}
          <Input
            label="Alert Threshold (%)"
            type="number"
            value={formData?.alertThreshold}
            onChange={(e) => handleInputChange('alertThreshold', e?.target?.value)}
            placeholder="80"
            description="Get notified when spending reaches this percentage"
            error={errors?.alertThreshold}
            min="0"
            max="100"
          />

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default" fullWidth type="submit">
              Create Budget
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBudgetModal;