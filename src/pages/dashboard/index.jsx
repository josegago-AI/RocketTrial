import React from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import FinancialSummaryCard from './components/FinancialSummaryCard';
import SpendingChart from './components/SpendingChart';
import RecentTransactions from './components/RecentTransactions';
import BudgetStatusWidget from './components/BudgetStatusWidget';
import UpcomingBills from './components/UpcomingBills';
import QuickActions from './components/QuickActions';

const Dashboard = () => {
  const financialSummaryData = [
    {
      title: "Total Balance",
      amount: 12456.78,
      change: 5.2,
      changeType: "positive",
      icon: "Wallet",
      iconColor: "bg-primary"
    },
    {
      title: "Monthly Income",
      amount: 4800.00,
      change: 0,
      changeType: "neutral",
      icon: "TrendingUp",
      iconColor: "bg-accent"
    },
    {
      title: "Monthly Expenses",
      amount: 2456.89,
      change: -12.3,
      changeType: "positive",
      icon: "TrendingDown",
      iconColor: "bg-warning"
    },
    {
      title: "Savings Goal",
      amount: 8500.00,
      change: 15.7,
      changeType: "positive",
      icon: "Target",
      iconColor: "bg-secondary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Welcome back, John! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's your financial overview for {new Date()?.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {financialSummaryData?.map((data, index) => (
              <FinancialSummaryCard
                key={index}
                title={data?.title}
                amount={data?.amount}
                change={data?.change}
                changeType={data?.changeType}
                icon={data?.icon}
                iconColor={data?.iconColor}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Charts and Transactions */}
            <div className="lg:col-span-2 space-y-8">
              <SpendingChart />
              <RecentTransactions />
            </div>

            {/* Right Column - Budget Status and Bills */}
            <div className="space-y-8">
              <BudgetStatusWidget />
              <UpcomingBills />
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Footer Stats */}
          <div className="bg-card rounded-lg p-6 elevation-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-semibold text-foreground">156</p>
                <p className="text-sm text-muted-foreground">Transactions This Month</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">8</p>
                <p className="text-sm text-muted-foreground">Active Budgets</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Financial Goals</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <QuickActionButton />
    </div>
  );
};

export default Dashboard;