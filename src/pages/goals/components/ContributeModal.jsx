import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContributeModal = ({ isOpen, onClose, goal, onContribute }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const quickAmounts = [25, 50, 100, 250, 500];

  const handleAmountChange = (e) => {
    const value = e?.target?.value;
    setAmount(value);
    setError('');
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount?.toString());
    setError('');
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const contributionAmount = parseFloat(amount);
    
    if (!amount || contributionAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (contributionAmount > 10000) {
      setError('Maximum contribution amount is $10,000');
      return;
    }

    const contribution = {
      id: Date.now()?.toString(),
      goalId: goal?.id,
      amount: contributionAmount,
      note: note?.trim(),
      date: new Date()?.toISOString(),
      type: 'manual'
    };

    onContribute(contribution);
    
    // Reset form
    setAmount('');
    setNote('');
    setError('');
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

  const newTotal = goal ? goal?.currentAmount + (parseFloat(amount) || 0) : 0;
  const newProgress = goal ? Math.min((newTotal / goal?.targetAmount) * 100, 100) : 0;
  const remainingAfter = goal ? Math.max(goal?.targetAmount - newTotal, 0) : 0;

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Add to Goal</h2>
            <p className="text-sm text-muted-foreground">{goal?.name}</p>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Progress */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Progress</span>
              <span className="text-sm font-medium text-foreground">
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
              {formatCurrency(goal?.currentAmount)} of {formatCurrency(goal?.targetAmount)}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <Input
              label="Contribution Amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              error={error}
              required
            />
            
            {/* Quick Amount Buttons */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-foreground mb-2">Quick Amounts</label>
              <div className="flex flex-wrap gap-2">
                {quickAmounts?.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(quickAmount)}
                    className={amount === quickAmount?.toString() ? 'border-primary text-primary' : ''}
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Note */}
          <Input
            label="Note (Optional)"
            type="text"
            value={note}
            onChange={(e) => setNote(e?.target?.value)}
            placeholder="e.g., Birthday money, bonus, etc."
          />

          {/* Preview */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">After This Contribution</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New Total:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(newTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Progress:</span>
                  <span className="font-semibold text-primary">{newProgress?.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(remainingAfter)}</span>
                </div>
              </div>
              
              {newProgress >= 100 && (
                <div className="mt-3 flex items-center space-x-2 text-success">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-sm font-medium">Goal Complete! 🎉</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
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
              iconName="Plus"
              iconPosition="left"
            >
              Add ${amount || '0'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributeModal;