import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Button from '../../components/ui/Button';
import TransactionFilters from './components/TransactionFilters';
import TransactionTable from './components/TransactionTable';
import AddTransactionModal from './components/AddTransactionModal';
import TransactionStats from './components/TransactionStats';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({});

  // Mock transaction data
  const mockTransactions = [
    {
      id: "1",
      date: "2025-01-15",
      description: "Grocery Store - Whole Foods",
      category: "food",
      account: "checking",
      accountName: "Chase Checking",
      amount: 127.45,
      type: "expense",
      notes: "Weekly grocery shopping",
      tags: "groceries, weekly",
      isRecurring: false
    },
    {
      id: "2",
      date: "2025-01-14",
      description: "Salary Deposit",
      category: "income",
      account: "checking",
      accountName: "Chase Checking",
      amount: 3500.00,
      type: "income",
      notes: "Monthly salary",
      tags: "salary, work",
      isRecurring: true
    },
    {
      id: "3",
      date: "2025-01-13",
      description: "Gas Station - Shell",
      category: "transportation",
      account: "credit",
      accountName: "Chase Freedom Card",
      amount: 45.20,
      type: "expense",
      notes: "Fill up tank",
      tags: "gas, car",
      isRecurring: false
    },
    {
      id: "4",
      date: "2025-01-12",
      description: "Netflix Subscription",
      category: "entertainment",
      account: "checking",
      accountName: "Chase Checking",
      amount: 15.99,
      type: "expense",
      notes: "Monthly streaming service",
      tags: "subscription, entertainment",
      isRecurring: true
    },
    {
      id: "5",
      date: "2025-01-11",
      description: "Amazon Purchase",
      category: "shopping",
      account: "credit",
      accountName: "Chase Freedom Card",
      amount: 89.99,
      type: "expense",
      notes: "Office supplies and books",
      tags: "amazon, supplies",
      isRecurring: false
    },
    {
      id: "6",
      date: "2025-01-10",
      description: "Electric Bill - PG&E",
      category: "bills",
      account: "checking",
      accountName: "Chase Checking",
      amount: 156.78,
      type: "expense",
      notes: "Monthly electricity bill",
      tags: "utilities, bills",
      isRecurring: true
    },
    {
      id: "7",
      date: "2025-01-09",
      description: "Coffee Shop - Starbucks",
      category: "food",
      account: "checking",
      accountName: "Chase Checking",
      amount: 12.50,
      type: "expense",
      notes: "Morning coffee and pastry",
      tags: "coffee, breakfast",
      isRecurring: false
    },
    {
      id: "8",
      date: "2025-01-08",
      description: "Freelance Project Payment",
      category: "income",
      account: "checking",
      accountName: "Chase Checking",
      amount: 750.00,
      type: "income",
      notes: "Web design project completion",
      tags: "freelance, design",
      isRecurring: false
    },
    {
      id: "9",
      date: "2025-01-07",
      description: "Movie Theater - AMC",
      category: "entertainment",
      account: "credit",
      accountName: "Chase Freedom Card",
      amount: 28.50,
      type: "expense",
      notes: "Date night movie tickets",
      tags: "movies, date",
      isRecurring: false
    },
    {
      id: "10",
      date: "2025-01-06",
      description: "Pharmacy - CVS",
      category: "healthcare",
      account: "checking",
      accountName: "Chase Checking",
      amount: 34.99,
      type: "expense",
      notes: "Prescription medication",
      tags: "pharmacy, health",
      isRecurring: false
    },
    {
      id: "11",
      date: "2025-01-05",
      description: "Transfer to Savings",
      category: "transfer",
      account: "savings",
      accountName: "Chase Savings",
      amount: 500.00,
      type: "transfer",
      notes: "Monthly savings transfer",
      tags: "savings, transfer",
      isRecurring: true
    },
    {
      id: "12",
      date: "2025-01-04",
      description: "Restaurant - Italian Bistro",
      category: "food",
      account: "credit",
      accountName: "Chase Freedom Card",
      amount: 67.80,
      type: "expense",
      notes: "Dinner with friends",
      tags: "restaurant, dinner",
      isRecurring: false
    }
  ];

  useEffect(() => {
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...transactions];

    // Apply search filter
    if (newFilters?.search) {
      const searchTerm = newFilters?.search?.toLowerCase();
      filtered = filtered?.filter(transaction =>
        transaction?.description?.toLowerCase()?.includes(searchTerm) ||
        transaction?.notes?.toLowerCase()?.includes(searchTerm) ||
        transaction?.tags?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Apply category filter
    if (newFilters?.category && newFilters?.category !== 'all') {
      filtered = filtered?.filter(transaction => transaction?.category === newFilters?.category);
    }

    // Apply account filter
    if (newFilters?.account && newFilters?.account !== 'all') {
      filtered = filtered?.filter(transaction => transaction?.account === newFilters?.account);
    }

    // Apply type filter
    if (newFilters?.type && newFilters?.type !== 'all') {
      filtered = filtered?.filter(transaction => transaction?.type === newFilters?.type);
    }

    // Apply amount range filter
    if (newFilters?.amountMin) {
      filtered = filtered?.filter(transaction => Math.abs(transaction?.amount) >= parseFloat(newFilters?.amountMin));
    }
    if (newFilters?.amountMax) {
      filtered = filtered?.filter(transaction => Math.abs(transaction?.amount) <= parseFloat(newFilters?.amountMax));
    }

    // Apply date range filter
    if (newFilters?.dateRange && newFilters?.dateRange !== 'all') {
      const now = new Date();
      let startDate;

      switch (newFilters?.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarterStart = Math.floor(now?.getMonth() / 3) * 3;
          startDate = new Date(now.getFullYear(), quarterStart, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filtered = filtered?.filter(transaction => new Date(transaction.date) >= startDate);
      }
    }

    setFilteredTransactions(filtered);
  };

  const handleAddTransaction = (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: Date.now()?.toString(),
      accountName: getAccountName(transactionData?.account)
    };
    
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    
    // Reapply current filters
    handleFiltersChange(filters);
  };

  const getAccountName = (accountKey) => {
    const accountMap = {
      'checking': 'Chase Checking',
      'savings': 'Chase Savings',
      'credit': 'Chase Freedom Card',
      'investment': 'Fidelity Investment'
    };
    return accountMap?.[accountKey] || accountKey;
  };

  const handleEditTransaction = (transaction) => {
    console.log('Edit transaction:', transaction);
    // TODO: Implement edit functionality
  };

  const handleDeleteTransaction = (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = transactions?.filter(t => t?.id !== transactionId);
      setTransactions(updatedTransactions);
      handleFiltersChange(filters);
    }
  };

  const handleBulkAction = (action, selectedIds) => {
    switch (action) {
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedIds?.length} transaction(s)?`)) {
          const updatedTransactions = transactions?.filter(t => !selectedIds?.includes(t?.id));
          setTransactions(updatedTransactions);
          handleFiltersChange(filters);
        }
        break;
      case 'categorize': console.log('Bulk categorize:', selectedIds);
        // TODO: Implement bulk categorization
        break;
      default:
        break;
    }
  };

  const handleExportData = () => {
    console.log('Export data');
    // TODO: Implement data export functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">Transactions</h1>
              <p className="text-muted-foreground">
                Track and manage all your financial transactions in one place
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={handleExportData}
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
              <Button
                variant="default"
                onClick={() => setIsAddModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Transaction Stats */}
          <TransactionStats transactions={transactions} />

          {/* Filters */}
          <TransactionFilters
            onFiltersChange={handleFiltersChange}
            resultsCount={filteredTransactions?.length}
          />

          {/* Transaction Table */}
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onBulkAction={handleBulkAction}
          />
        </div>
      </main>
      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTransaction}
      />
      {/* Quick Action Button */}
      <QuickActionButton />
    </div>
  );
};

export default TransactionsPage;