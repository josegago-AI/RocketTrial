import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TransactionFilters = ({ onFiltersChange, resultsCount }) => {
  const [filters, setFilters] = useState({
    search: '',
    dateRange: 'all',
    category: 'all',
    account: 'all',
    amountMin: '',
    amountMax: '',
    type: 'all'
  });

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
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
    { value: 'all', label: 'All Accounts' },
    { value: 'checking', label: 'Chase Checking' },
    { value: 'savings', label: 'Chase Savings' },
    { value: 'credit', label: 'Chase Freedom Card' },
    { value: 'investment', label: 'Fidelity Investment' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
    { value: 'transfer', label: 'Transfer' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      dateRange: 'all',
      category: 'all',
      account: 'all',
      amountMin: '',
      amountMax: '',
      type: 'all'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value !== '' && value !== 'all'
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 elevation-1">
      {/* Search and Results */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex-1 max-w-md mb-4 lg:mb-0">
          <Input
            type="search"
            placeholder="Search transactions..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {resultsCount} transactions found
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Date Range */}
        <div className="lg:col-span-1">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />
        </div>

        {/* Category */}
        <div className="lg:col-span-1">
          <Select
            label="Category"
            options={categoryOptions}
            value={filters?.category}
            onChange={(value) => handleFilterChange('category', value)}
            searchable
          />
        </div>

        {/* Account */}
        <div className="lg:col-span-1">
          <Select
            label="Account"
            options={accountOptions}
            value={filters?.account}
            onChange={(value) => handleFilterChange('account', value)}
          />
        </div>

        {/* Type */}
        <div className="lg:col-span-1">
          <Select
            label="Type"
            options={typeOptions}
            value={filters?.type}
            onChange={(value) => handleFilterChange('type', value)}
          />
        </div>

        {/* Amount Range */}
        <div className="lg:col-span-1">
          <Input
            label="Min Amount"
            type="number"
            placeholder="0.00"
            value={filters?.amountMin}
            onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="lg:col-span-1">
          <Input
            label="Max Amount"
            type="number"
            placeholder="1000.00"
            value={filters?.amountMax}
            onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
            min="0"
            step="0.01"
          />
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters?.search && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                Search: "{filters?.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.dateRange !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                Date: {dateRangeOptions?.find(opt => opt?.value === filters?.dateRange)?.label}
                <button
                  onClick={() => handleFilterChange('dateRange', 'all')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.category !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                Category: {categoryOptions?.find(opt => opt?.value === filters?.category)?.label}
                <button
                  onClick={() => handleFilterChange('category', 'all')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;