import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';


const AddTransactionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    account: '',
    date: new Date()?.toISOString()?.split('T')?.[0],
    notes: '',
    tags: '',
    isRecurring: false,
    recurringFrequency: 'monthly'
  });

  const [errors, setErrors] = useState({});

  const typeOptions = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
    { value: 'transfer', label: 'Transfer' }
  ];

  const categoryOptions = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'bills', label: 'Bills & Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'income', label: 'Income' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'other', label: 'Other' }
  ];

  const accountOptions = [
    { value: 'checking', label: 'Chase Checking' },
    { value: 'savings', label: 'Chase Savings' },
    { value: 'credit', label: 'Chase Freedom Card' },
    { value: 'investment', label: 'Fidelity Investment' }
  ];

  const recurringOptions = [
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData?.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData?.account) {
      newErrors.account = 'Please select an account';
    }

    if (!formData?.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData?.amount),
        id: Date.now()?.toString(),
        createdAt: new Date()?.toISOString()
      };
      
      onSave(transactionData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      type: 'expense',
      amount: '',
      description: '',
      category: '',
      account: '',
      date: new Date()?.toISOString()?.split('T')?.[0],
      notes: '',
      tags: '',
      isRecurring: false,
      recurringFrequency: 'monthly'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-card shadow-xl rounded-lg elevation-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Add New Transaction</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              iconName="X"
              className="h-8 w-8 p-0"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type */}
            <div>
              <Select
                label="Transaction Type"
                options={typeOptions}
                value={formData?.type}
                onChange={(value) => handleInputChange('type', value)}
                required
              />
            </div>

            {/* Amount and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Amount"
                type="number"
                placeholder="0.00"
                value={formData?.amount}
                onChange={(e) => handleInputChange('amount', e?.target?.value)}
                error={errors?.amount}
                required
                min="0"
                step="0.01"
              />
              <Input
                label="Description"
                type="text"
                placeholder="Enter transaction description"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                error={errors?.description}
                required
              />
            </div>

            {/* Category and Account */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                options={categoryOptions}
                value={formData?.category}
                onChange={(value) => handleInputChange('category', value)}
                error={errors?.category}
                required
                searchable
              />
              <Select
                label="Account"
                options={accountOptions}
                value={formData?.account}
                onChange={(value) => handleInputChange('account', value)}
                error={errors?.account}
                required
              />
            </div>

            {/* Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={formData?.date}
                onChange={(e) => handleInputChange('date', e?.target?.value)}
                error={errors?.date}
                required
              />
              <Input
                label="Tags"
                type="text"
                placeholder="Enter tags (comma separated)"
                value={formData?.tags}
                onChange={(e) => handleInputChange('tags', e?.target?.value)}
                description="Separate multiple tags with commas"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="3"
                placeholder="Add any additional notes..."
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
              />
            </div>

            {/* Recurring Transaction */}
            <div className="border border-border rounded-lg p-4">
              <Checkbox
                label="Make this a recurring transaction"
                checked={formData?.isRecurring}
                onChange={(e) => handleInputChange('isRecurring', e?.target?.checked)}
                className="mb-4"
              />
              
              {formData?.isRecurring && (
                <div className="ml-6">
                  <Select
                    label="Frequency"
                    options={recurringOptions}
                    value={formData?.recurringFrequency}
                    onChange={(value) => handleInputChange('recurringFrequency', value)}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                iconName="Plus"
                iconPosition="left"
              >
                Add Transaction
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;