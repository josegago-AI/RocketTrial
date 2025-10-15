import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const statusOptions = [
    { value: 'all', label: 'All Budgets', icon: 'List' },
    { value: 'on-track', label: 'On Track', icon: 'CheckCircle' },
    { value: 'warning', label: 'Approaching Limit', icon: 'AlertTriangle' },
    { value: 'exceeded', label: 'Exceeded', icon: 'XCircle' }
  ];

  const periodOptions = [
    { value: 'all', label: 'All Periods' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Category Name' },
    { value: 'allocated', label: 'Budget Amount' },
    { value: 'spent', label: 'Amount Spent' },
    { value: 'remaining', label: 'Remaining' },
    { value: 'progress', label: 'Progress %' }
  ];

  const hasActiveFilters = filters?.status !== 'all' || filters?.period !== 'all' || filters?.sortBy !== 'name';

  return (
    <div className="bg-card rounded-lg border border-border p-4 elevation-1 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Status:</span>
            <div className="flex space-x-1">
              {statusOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => onFilterChange('status', option?.value)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth ${
                    filters?.status === option?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  <Icon name={option?.icon} size={14} />
                  <span className="hidden sm:inline">{option?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Period:</span>
            <select
              value={filters?.period}
              onChange={(e) => onFilterChange('period', e?.target?.value)}
              className="px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {periodOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Sort:</span>
            <select
              value={filters?.sortBy}
              onChange={(e) => onFilterChange('sortBy', e?.target?.value)}
              className="px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => onFilterChange('sortOrder', filters?.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 rounded-md hover:bg-muted transition-smooth"
            >
              <Icon 
                name={filters?.sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
                size={14} 
                className="text-muted-foreground" 
              />
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear Filters
          </Button>
        )}
      </div>
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>
              Showing budgets: 
              {filters?.status !== 'all' && ` ${statusOptions?.find(opt => opt?.value === filters?.status)?.label}`}
              {filters?.period !== 'all' && ` • ${filters?.period} period`}
              {` • Sorted by ${sortOptions?.find(opt => opt?.value === filters?.sortBy)?.label} (${filters?.sortOrder === 'asc' ? 'ascending' : 'descending'})`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetFilters;