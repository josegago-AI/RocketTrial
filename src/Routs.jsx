import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import TransactionsPage from './pages/transactions';
import Goals from './pages/goals';
import BudgetsPage from './pages/budgets';
import Dashboard from './pages/dashboard';
import Reports from './pages/reports';
import GuidePage from './pages/guide';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<BudgetsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;