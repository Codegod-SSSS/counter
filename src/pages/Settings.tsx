import React from 'react';
import { useBudget } from '../BudgetContext';
import { 
  History, 
  Trash2, 
  Settings as SettingsIcon,
  Moon,
  Sun,
  Globe,
  Coins,
  Database,
  ShieldAlert,
  CalendarRange
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { BudgetType } from '../types';

import { motion } from 'motion/react';

export const Settings: React.FC = () => {
  const { settings, setSettings, resetData } = useBudget();

  const handleBudgetTypeChange = (type: BudgetType) => {
    setSettings({ ...settings, budgetType: type });
  };

  const handleBudgetAmountChange = (amount: string) => {
    setSettings({ ...settings, budgetAmount: Number(amount) });
  };

  const budgetTypes: { value: BudgetType; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Application Settings</h1>
        <p className="text-slate-500">Customize your experience and manage your financial data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Budget Strategy */}
        <div className="bg-white rounded-[32px] border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <CalendarRange size={18} className="text-accent" /> Budget Plan
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Frequency</label>
              <div className="grid grid-cols-2 gap-2">
                {budgetTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleBudgetTypeChange(type.value)}
                    className={cn(
                      "py-2.5 rounded-xl border-2 text-xs font-bold transition-all",
                      settings.budgetType === type.value
                        ? "border-accent bg-emerald-50 text-accent"
                        : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-100"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget Amount ({settings.currency})</label>
              <input 
                type="number"
                value={settings.budgetAmount}
                onChange={(e) => handleBudgetAmountChange(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl outline-none border border-transparent focus:border-accent transition-all font-bold text-slate-900 dark:text-white"
              />
              <p className="text-[10px] text-slate-400 font-medium">This is your {settings.budgetType} spending limit in {settings.currency}.</p>
            </div>
          </div>
        </div>

        {/* General Options */}
        <div className="bg-white dark:bg-dark-card rounded-[32px] border border-border-subtle dark:border-dark-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 dark:border-dark-border bg-slate-50/50 dark:bg-slate-800/20">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SettingsIcon size={18} className="text-indigo-600" /> Regional & App
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Language</p>
                  <p className="text-xs text-slate-400">Application display language</p>
                </div>
                <Globe size={18} className="text-slate-400" />
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
                {(['en', 'fr', 'ko'] as const).map((l) => (
                  <button 
                    key={l}
                    onClick={() => setSettings({ ...settings, language: l })}
                    className={cn(
                      "flex-1 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-widest",
                      settings.language === l 
                        ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" 
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Display Currency</p>
                  <p className="text-xs text-slate-400">Default tracking currency</p>
                </div>
                <Coins size={18} className="text-slate-400" />
              </div>
              <select 
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none border-2 border-transparent focus:border-indigo-500 transition-all font-bold text-slate-900 dark:text-white"
              >
                <option value="GHS">GHS - Ghanaian Cedi</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="WON">WON - Korean Won</option>
                <option value="XOF">XOF - CFA Franc</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Appearance</p>
                <p className="text-xs text-slate-400">Light / Dark mode</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
                <button 
                  onClick={() => setSettings({ ...settings, theme: 'light' })}
                  className={cn("p-1.5 px-4 rounded-lg transition-all", settings.theme === 'light' ? "bg-white dark:bg-slate-700 text-amber-500 shadow-sm" : "text-slate-400")}
                >
                  <Sun size={16} />
                </button>
                <button 
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                  className={cn("p-1.5 px-4 rounded-lg transition-all", settings.theme === 'dark' ? "bg-white dark:bg-slate-700 text-indigo-400 shadow-sm" : "text-slate-400")}
                >
                  <Moon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-[32px] border border-border-subtle shadow-sm overflow-hidden md:col-span-2">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Database size={18} className="text-rose-600" /> Data & Security
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-rose-50 p-4 rounded-2xl flex gap-4">
              <div className="shrink-0 w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                <ShieldAlert size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-rose-900">Security Note</p>
                <p className="text-xs text-rose-600 leading-relaxed">
                  CediSafe runs entirely in your browser. Your data is stored locally and never leaves this device. 
                  Regularly export your data to keep a backup.
                </p>
              </div>
            </div>

            <div className="pt-4">
               <motion.button 
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(254, 226, 226, 0.5)', borderColor: 'rgba(254, 202, 202, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (confirm("Are you sure? This will permanently delete all your expenses, goals, and budget settings.")) {
                      resetData();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 border-2 border-slate-100 dark:border-dark-border rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 transition-colors font-display"
               >
                 <Trash2 size={18} className="text-rose-500" /> 
                 <span>Reset All Application Data</span>
               </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-10">
        <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">CediSafe v1.1.0 • Made for Ghana 🇬🇭</p>
      </div>
    </div>
  );
};
