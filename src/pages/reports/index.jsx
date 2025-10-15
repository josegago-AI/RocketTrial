import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import ReportTypeSelector from './components/ReportTypeSelector';
import ReportFilters from './components/ReportFilters';
import SpendingAnalysisChart from './components/SpendingAnalysisChart';
import IncomeAnalysisChart from './components/IncomeAnalysisChart';
import BudgetPerformanceChart from './components/BudgetPerformanceChart';
import SummaryStatistics from './components/SummaryStatistics';
import Icon from '../../components/AppIcon';

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState('spending');
  const [filters, setFilters] = useState({
    dateRange: 'last3months',
    account: 'all',
    category: 'all',
    comparison: 'none',
    startDate: '',
    endDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate data loading when filters change
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [selectedReportType, filters]);

  const handleReportTypeChange = (type) => {
    setSelectedReportType(type);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleExport = (format) => {
    // Mock export functionality
    const reportName = `${selectedReportType}_report_${new Date()?.toISOString()?.split('T')?.[0]}`;
    console.log(`Exporting ${reportName} as ${format?.toUpperCase()}`);
    
    // Simulate export process
    const exportData = {
      reportType: selectedReportType,
      filters: filters,
      generatedAt: new Date()?.toISOString(),
      format: format
    };
    
    // In a real app, this would trigger actual file download
    alert(`${format?.toUpperCase()} export started for ${selectedReportType} report`);
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="bg-card rounded-lg border border-border p-12 elevation-1">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading report data...</p>
          </div>
        </div>
      );
    }

    switch (selectedReportType) {
      case 'spending':
        return <SpendingAnalysisChart filters={filters} />;
      case 'income':
        return <IncomeAnalysisChart filters={filters} />;
      case 'budget':
        return <BudgetPerformanceChart filters={filters} />;
      case 'category':
        return <SpendingAnalysisChart filters={filters} />;
      case 'comparison':
        return <SpendingAnalysisChart filters={filters} />;
      default:
        return <SpendingAnalysisChart filters={filters} />;
    }
  };

  const getReportTitle = () => {
    const titles = {
      spending: 'Spending Analysis Report',
      income: 'Income Trends Report',
      budget: 'Budget Performance Report',
      category: 'Category Breakdown Report',
      comparison: 'Period Comparison Report'
    };
    return titles?.[selectedReportType] || 'Financial Report';
  };

  const getReportDescription = () => {
    const descriptions = {
      spending: 'Comprehensive analysis of your spending patterns, trends, and category breakdowns',
      income: 'Detailed overview of income sources, growth trends, and earning patterns',
      budget: 'Performance analysis comparing your actual spending against budgeted amounts',
      category: 'In-depth breakdown of spending across different expense categories',
      comparison: 'Side-by-side comparison of financial metrics across different time periods'
    };
    return descriptions?.[selectedReportType] || 'Financial insights and analytics';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="BarChart3" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
                <p className="text-muted-foreground">
                  Comprehensive financial insights and performance analysis
                </p>
              </div>
            </div>
          </div>

          {/* Report Type Selector */}
          <div className="mb-6">
            <ReportTypeSelector 
              selectedType={selectedReportType}
              onTypeChange={handleReportTypeChange}
            />
          </div>

          {/* Report Filters */}
          <div className="mb-6">
            <ReportFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onExport={handleExport}
            />
          </div>

          {/* Report Header */}
          <div className="mb-6">
            <div className="bg-card rounded-lg border border-border p-6 elevation-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {getReportTitle()}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {getReportDescription()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Generated on</div>
                  <div className="font-medium text-foreground">
                    {new Date()?.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="mb-6">
            <SummaryStatistics 
              reportType={selectedReportType}
              filters={filters}
            />
          </div>

          {/* Main Chart/Visualization */}
          <div className="mb-6">
            {renderChart()}
          </div>

          {/* Report Footer */}
          <div className="bg-card rounded-lg border border-border p-6 elevation-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} />
                  <span>Report Period: {filters?.dateRange}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Database" size={16} />
                  <span>Data Source: All Accounts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} />
                  <span>Last Updated: {new Date()?.toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="text-sm text-success">Data Verified</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <QuickActionButton />
    </div>
  );
};

export default Reports;