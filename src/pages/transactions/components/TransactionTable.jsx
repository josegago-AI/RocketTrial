import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const TransactionTable = ({ transactions, onEdit, onDelete, onBulkAction }) => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTransactions(transactions?.map(t => t?.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (transactionId, checked) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, transactionId]);
    } else {
      setSelectedTransactions(selectedTransactions?.filter(id => id !== transactionId));
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = Math.abs(amount)?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    
    if (type === 'income') {
      return <span className="text-success font-medium">+{formattedAmount}</span>;
    } else if (type === 'expense') {
      return <span className="text-error font-medium">-{formattedAmount}</span>;
    }
    return <span className="text-foreground font-medium">{formattedAmount}</span>;
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'food': 'Utensils',
      'transportation': 'Car',
      'shopping': 'ShoppingBag',
      'entertainment': 'Film',
      'bills': 'Receipt',
      'healthcare': 'Heart',
      'income': 'TrendingUp',
      'transfer': 'ArrowRightLeft',
      'other': 'MoreHorizontal'
    };
    return iconMap?.[category] || 'MoreHorizontal';
  };

  const getAccountBadgeColor = (account) => {
    const colorMap = {
      'checking': 'bg-blue-100 text-blue-800',
      'savings': 'bg-green-100 text-green-800',
      'credit': 'bg-purple-100 text-purple-800',
      'investment': 'bg-orange-100 text-orange-800'
    };
    return colorMap?.[account] || 'bg-gray-100 text-gray-800';
  };

  const sortedTransactions = [...transactions]?.sort((a, b) => {
    if (sortConfig?.key === 'amount') {
      const aValue = Math.abs(a?.amount);
      const bValue = Math.abs(b?.amount);
      return sortConfig?.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (sortConfig?.key === 'date') {
      const aValue = new Date(a.date);
      const bValue = new Date(b.date);
      return sortConfig?.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aValue = a?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
    const bValue = b?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
    
    if (sortConfig?.direction === 'asc') {
      return aValue?.localeCompare(bValue);
    }
    return bValue?.localeCompare(aValue);
  });

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden elevation-1">
      {/* Bulk Actions Bar */}
      {selectedTransactions?.length > 0 && (
        <div className="bg-primary/5 border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {selectedTransactions?.length} transaction{selectedTransactions?.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('categorize', selectedTransactions)}
                iconName="Tag"
                iconPosition="left"
              >
                Categorize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('delete', selectedTransactions)}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTransactions([])}
                iconName="X"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-6 py-4">
                <Checkbox
                  checked={selectedTransactions?.length === transactions?.length && transactions?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Date</span>
                  {getSortIcon('date')}
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('description')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Description</span>
                  {getSortIcon('description')}
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Category</span>
                  {getSortIcon('category')}
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('account')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Account</span>
                  {getSortIcon('account')}
                </button>
              </th>
              <th className="text-right px-6 py-4">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center justify-end space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Amount</span>
                  {getSortIcon('amount')}
                </button>
              </th>
              <th className="w-24 px-6 py-4">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTransactions?.map((transaction) => (
              <tr key={transaction?.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedTransactions?.includes(transaction?.id)}
                    onChange={(e) => handleSelectTransaction(transaction?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">
                    {new Date(transaction.date)?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{transaction?.description}</p>
                    {transaction?.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{transaction?.notes}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getCategoryIcon(transaction?.category)} size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground capitalize">{transaction?.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getAccountBadgeColor(transaction?.account)}`}>
                    {transaction?.accountName}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {formatAmount(transaction?.amount, transaction?.type)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(transaction)}
                      iconName="Edit2"
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(transaction?.id)}
                      iconName="Trash2"
                      className="h-8 w-8 p-0 text-error hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {sortedTransactions?.map((transaction) => (
          <div key={transaction?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedTransactions?.includes(transaction?.id)}
                  onChange={(e) => handleSelectTransaction(transaction?.id, e?.target?.checked)}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction?.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date)?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {formatAmount(transaction?.amount, transaction?.type)}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name={getCategoryIcon(transaction?.category)} size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground capitalize">{transaction?.category}</span>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getAccountBadgeColor(transaction?.account)}`}>
                  {transaction?.accountName}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(transaction)}
                  iconName="Edit2"
                  className="h-8 w-8 p-0"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(transaction?.id)}
                  iconName="Trash2"
                  className="h-8 w-8 p-0 text-error hover:text-error"
                />
              </div>
            </div>
            
            {transaction?.notes && (
              <p className="text-xs text-muted-foreground mt-2 pl-8">{transaction?.notes}</p>
            )}
          </div>
        ))}
      </div>
      {/* Empty State */}
      {transactions?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or add your first transaction.</p>
          <Button variant="default" iconName="Plus" iconPosition="left">
            Add Transaction
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;