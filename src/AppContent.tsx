import React, { useState } from 'react';
import { useBudget } from './BudgetContext';
import { Layout } from './components/layout/Layout';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Categories } from './pages/Categories';
import { BudgetPlanning } from './pages/BudgetPlanning';
import { Reports } from './pages/Reports';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import { AnimatePresence, motion } from 'motion/react';

import { Login } from './pages/Login';
import { Welcome } from './pages/Welcome';

export type Page = 'dashboard' | 'transactions' | 'categories' | 'budget' | 'reports' | 'goals' | 'settings';

export default function App() {
  const { settings, loading } = useBudget();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main dark:bg-dark-bg-main flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Loading Secure Session...</p>
        </div>
      </div>
    );
  }

  if (!settings.welcomed) {
    return <Welcome />;
  }

  if (!settings.isAuthenticated) {
    return <Login />;
  }

  if (!settings.onboarded) {
    return <Onboarding />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'transactions': return <Transactions />;
      case 'categories': return <Categories />;
      case 'budget': return <BudgetPlanning />;
      case 'reports': return <Reports />;
      case 'goals': return <Goals />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout activePage={currentPage} onNavigate={setCurrentPage}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
