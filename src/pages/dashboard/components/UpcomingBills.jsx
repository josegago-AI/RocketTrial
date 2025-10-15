import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingBills = () => {
  const upcomingBills = [
    {
      id: 1,
      name: "Netflix Subscription",
      amount: 15.99,
      dueDate: "2025-09-18",
      category: "Entertainment",
      icon: "Play",
      color: "bg-red-500",
      status: "upcoming"
    },
    {
      id: 2,
      name: "Electric Bill",
      amount: 89.23,
      dueDate: "2025-09-20",
      category: "Utilities",
      icon: "Zap",
      color: "bg-yellow-500",
      status: "upcoming"
    },
    {
      id: 3,
      name: "Internet Service",
      amount: 79.99,
      dueDate: "2025-09-22",
      category: "Utilities",
      icon: "Wifi",
      color: "bg-blue-500",
      status: "upcoming"
    },
    {
      id: 4,
      name: "Car Insurance",
      amount: 156.78,
      dueDate: "2025-09-25",
      category: "Insurance",
      icon: "Shield",
      color: "bg-green-500",
      status: "upcoming"
    },
    {
      id: 5,
      name: "Gym Membership",
      amount: 29.99,
      dueDate: "2025-09-28",
      category: "Health & Fitness",
      icon: "Dumbbell",
      color: "bg-purple-500",
      status: "upcoming"
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate) => {
    const daysUntil = getDaysUntilDue(dueDate);
    
    if (daysUntil === 0) return 'Due Today';
    if (daysUntil === 1) return 'Due Tomorrow';
    if (daysUntil < 0) return `${Math.abs(daysUntil)} days overdue`;
    if (daysUntil <= 7) return `Due in ${daysUntil} days`;
    
    return new Date(dueDate)?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDueDateColor = (dueDate) => {
    const daysUntil = getDaysUntilDue(dueDate);
    
    if (daysUntil < 0) return 'text-error';
    if (daysUntil <= 3) return 'text-warning';
    return 'text-muted-foreground';
  };

  const totalUpcoming = upcomingBills?.reduce((sum, bill) => sum + bill?.amount, 0);

  return (
    <div className="bg-card rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Bills</h3>
        <Link to="/transactions">
          <Button variant="ghost" size="sm" iconName="Calendar" iconPosition="right">
            View All
          </Button>
        </Link>
      </div>
      {/* Total Upcoming Amount */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Total Due This Month</span>
          </div>
          <span className="text-lg font-semibold text-foreground">
            {formatCurrency(totalUpcoming)}
          </span>
        </div>
      </div>
      {/* Bills List */}
      <div className="space-y-3">
        {upcomingBills?.slice(0, 4)?.map((bill) => (
          <div key={bill?.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-smooth">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bill?.color}`}>
                <Icon name={bill?.icon} size={18} color="white" />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{bill?.name}</p>
                <p className="text-xs text-muted-foreground">{bill?.category}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(bill?.amount)}
              </p>
              <p className={`text-xs font-medium ${getDueDateColor(bill?.dueDate)}`}>
                {formatDueDate(bill?.dueDate)}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-border space-y-2">
        <Button variant="outline" fullWidth iconName="Plus" iconPosition="left">
          Add Bill Reminder
        </Button>
        <Button variant="ghost" fullWidth iconName="CreditCard" iconPosition="left">
          Pay Bills
        </Button>
      </div>
    </div>
  );
};

export default UpcomingBills;