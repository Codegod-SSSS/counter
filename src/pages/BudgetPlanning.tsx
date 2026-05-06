import React from 'react';
import { useBudget } from '../BudgetContext';
import { 
  Building2, 
  ArrowRight, 
  Info,
  ChevronRight,
  TrendingDown,
  Layout
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

export const BudgetPlanning: React.FC = () => {
  const { settings, categories } = useBudget();
  const baseAmount = settings.budgetAmount;
  const baseType = settings.budgetType;

  // Normalize to yearly for calculations
  let yearly = baseAmount;
  if (baseType === 'daily') yearly = baseAmount * 365;
  if (baseType === 'weekly') yearly = baseAmount * 52;
  if (baseType === 'monthly') yearly = baseAmount * 12;

  const monthly = yearly / 12;
  const daily = yearly / 365;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Budget Allocation</h1>
        <p className="text-slate-500 dark:text-slate-400">Plan your spending rhythm across different timeframes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-accent p-8 rounded-[32px] text-white shadow-xl shadow-emerald-100 dark:shadow-none">
           <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-1">Yearly Estimate</p>
           <h3 className="text-3xl font-display font-black">{formatCurrency(yearly)}</h3>
         </div>
         <div className="bg-white dark:bg-dark-card p-8 rounded-[32px] border border-border-subtle dark:border-dark-border shadow-sm transition-colors duration-300">
           <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Monthly Average</p>
           <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white">{formatCurrency(monthly)}</h3>
         </div>
         <div className="bg-white dark:bg-dark-card p-8 rounded-[32px] border border-border-subtle dark:border-dark-border shadow-sm transition-colors duration-300">
           <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Daily Cap</p>
           <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white">{formatCurrency(daily)}</h3>
         </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-[32px] border border-border-subtle dark:border-dark-border shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-8 border-b border-slate-50 dark:border-dark-border bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layout size={20} className="text-accent" /> Category Breakdown
          </h3>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Values are per month</span>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {categories.map((cat) => (
            <div key={cat.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{cat.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">
                    ~{((cat.monthlyLimit * 12) / (yearly || 1) * 100).toFixed(1)}% of yearly projection
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 dark:text-white text-sm">{formatCurrency(cat.monthlyLimit)}</p>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">per month</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-3xl flex gap-6 items-start border border-amber-100 dark:border-amber-900/30">
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
          <Info size={24} />
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-amber-900 dark:text-amber-200">Allocation Tip</h4>
          <p className="text-sm text-amber-700 dark:text-amber-400/80 leading-relaxed">
            The 50/30/20 rule suggests spending 50% on needs, 30% on wants, and 20% on savings. 
            Currently, your fixed monthly categories account for {formatCurrency(categories.reduce((a,b) => a + b.monthlyLimit, 0))} aggregate limit.
          </p>
        </div>
      </div>
    </div>
  );
};
