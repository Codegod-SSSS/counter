import React, { useState } from 'react';
import { useBudget } from '../BudgetContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowUpRight, 
  ChevronRight,
  Wallet,
  Calendar,
  CreditCard
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { AddExpenseModal } from '../components/transactions/AddExpenseModal';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { startOfMonth, subMonths, format, isAfter, isBefore, parseISO, isSameYear, isSameMonth, isSameWeek, isSameDay } from 'date-fns';
import { Page } from '../AppContent';
import { AISpendingInsights } from '../components/dashboard/AISpendingInsights';
import { BudgetType, Expense } from '../types';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { settings, expenses, categories } = useBudget();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filterExpensesByBudgetType = (exps: Expense[], type: BudgetType) => {
    const now = new Date();
    return exps.filter(e => {
      const expenseDate = parseISO(e.date);
      if (type === 'yearly') return isSameYear(expenseDate, now);
      if (type === 'monthly') return isSameMonth(expenseDate, now);
      if (type === 'weekly') return isSameWeek(expenseDate, now, { weekStartsOn: 1 });
      if (type === 'daily') return isSameDay(expenseDate, now);
      return false;
    });
  };

  const currentPeriodExpenses = filterExpensesByBudgetType(expenses, settings.budgetType);
  const totalSpent = currentPeriodExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = Math.max(0, settings.budgetAmount - totalSpent);
  const percentageSpent = settings.budgetAmount > 0 ? (totalSpent / settings.budgetAmount) * 100 : 0;

  // Monthly Data for Chart
  const last6Months = Array.from({ length: 12 }).map((_, i) => {
    const monthDate = subMonths(new Date(), 11 - i);
    const monthKey = format(monthDate, 'MMM');
    const monthlyTotal = expenses
      .filter(e => format(parseISO(e.date), 'MMM yyyy') === format(monthDate, 'MMM yyyy'))
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { name: monthKey, amount: monthlyTotal };
  });

  const recentTransactions = expenses.slice(0, 5);

  return (
    <div className="space-y-6 pb-10">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Welcome, Member</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">You have {formatCurrency(remaining)} left for the {settings.budgetType}.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-accent text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Main Budget Health - Large */}
        <div className="md:col-span-2 bg-white dark:bg-dark-card rounded-[24px] p-6 border border-border-subtle dark:border-dark-border shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">{settings.budgetType} Budget Health</span>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white">
              {formatCurrency(totalSpent)} 
              <span className="text-sm font-medium text-slate-400 dark:text-slate-500 ml-2">/ {formatCurrency(settings.budgetAmount)}</span>
            </h3>
            <div className="text-accent font-bold text-sm">{percentageSpent.toFixed(1)}% Used</div>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-accent transition-all duration-1000" 
              style={{ width: `${Math.min(100, percentageSpent)}%` }}
            />
          </div>
          <div className="flex gap-10">
            <div className="text-[11px] text-slate-500 font-medium">Remaining: <span className="text-slate-900 dark:text-slate-200 font-bold">{formatCurrency(remaining)}</span></div>
            <div className="text-[11px] text-slate-500 font-medium">Plan: <span className="text-slate-900 dark:text-slate-200 font-bold capitalize">{settings.budgetType}</span></div>
          </div>
        </div>

        {/* AI Coaching Card */}
        <div className="bg-white dark:bg-dark-card rounded-[24px] border border-border-subtle dark:border-dark-border shadow-sm overflow-hidden min-h-[220px]">
          <AISpendingInsights />
        </div>

        {/* Top Category Card */}
        <div className="bg-white dark:bg-dark-card rounded-[24px] p-6 border border-border-subtle dark:border-dark-border shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Top Category</span>
          {categories.length > 0 ? (
            <div>
              <div className="text-2xl font-display font-black text-slate-900 dark:text-white mt-2">
                {categories[0].name}
              </div>
              <div className="mt-3">
                <span 
                  className="px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase"
                  style={{ backgroundColor: categories[0].color }}
                >
                  {formatCurrency(expenses.filter(e => e.categoryId === categories[0].id).reduce((a, b) => a + b.amount, 0))} YTD
                </span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm italic">No data yet</p>
          )}
        </div>

        {/* Monthly Patterns - Tall */}
        <div className="md:row-span-2 bg-white dark:bg-dark-card rounded-[24px] p-6 border border-border-subtle dark:border-dark-border shadow-sm flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Spending Pattern</span>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last6Months.slice(-6)}>
                <Bar 
                  dataKey="amount" 
                  fill="currentColor" 
                  className="text-emerald-50 dark:text-emerald-900/10"
                  radius={[4, 4, 0, 0]}
                  stroke="#10b981"
                  strokeWidth={2}
                >
                  {last6Months.slice(-6).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 5 ? '#10b981' : undefined} 
                    />
                  ))}
                </Bar>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  interval={0}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 dark:bg-slate-800 text-white p-2 rounded-lg text-[10px] font-bold shadow-xl border border-slate-700">
                          {formatCurrency(payload[0].value as number)}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4 text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">
            <span>START</span>
            <span>PRESENT</span>
          </div>
        </div>

        {/* Recent Transactions - Wide */}
        <div className="md:col-span-2 md:row-span-2 bg-white dark:bg-dark-card rounded-[24px] p-6 border border-border-subtle dark:border-dark-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Recent Transactions</span>
            <button 
              onClick={() => onNavigate('transactions')}
              className="text-accent font-bold text-xs flex items-center gap-1 hover:underline"
            >
              All Activity <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="space-y-1 divide-y divide-slate-50 dark:divide-slate-800 flex-1">
            {recentTransactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                <p className="text-xs font-medium">Empty logs.</p>
              </div>
            ) : (
              recentTransactions.map((expense) => {
                const category = categories.find(c => c.id === expense.categoryId);
                return (
                  <div key={expense.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                        style={{ backgroundColor: category?.color || '#94a3b8' }}
                      >
                        <Wallet size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{expense.notes || category?.name}</h4>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">
                          {format(parseISO(expense.date), 'MMM dd')} • {category?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-slate-900 dark:text-white">GH₵{expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">{expense.paymentMethod}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Savings Goal Progress */}
        <div className="bg-white dark:bg-dark-card rounded-[24px] p-6 border border-border-subtle dark:border-dark-border shadow-sm flex flex-col justify-between">
           <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Savings Focus</span>
           <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 bg-accent-light dark:bg-dark-accent-light rounded-xl flex items-center justify-center text-xl">💻</div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Tech Fund</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">GH₵ 4.2k / 12k</p>
              </div>
           </div>
           <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-accent" style={{ width: '35%' }} />
           </div>
        </div>

      </div>

      <AddExpenseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
