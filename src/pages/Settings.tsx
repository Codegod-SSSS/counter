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
  Sparkles,
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
        <h1 className="font-display font-bold text-[#56ea56] text-[26px]">Application Settings</h1>
        <p className="text-text-primary/50">Customize your experience and manage your financial data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Budget Strategy */}
        <div className="bg-card rounded-[32px] border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle bg-bg-main/50">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <CalendarRange size={18} className="text-accent" /> Budget Plan
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-primary/40 uppercase tracking-widest">Plan Frequency</label>
              <div className="grid grid-cols-2 gap-2">
                {budgetTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleBudgetTypeChange(type.value)}
                    className={cn(
                      "py-2.5 rounded-xl border-2 text-xs font-bold transition-all",
                      settings.budgetType === type.value
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-border-subtle bg-bg-main text-text-primary/50 hover:border-accent"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-primary/40 uppercase tracking-widest">Budget Amount ({settings.currency})</label>
              <input 
                type="number"
                value={settings.budgetAmount}
                onChange={(e) => handleBudgetAmountChange(e.target.value)}
                className="w-full px-5 py-3.5 bg-bg-main rounded-2xl outline-none border border-transparent focus:border-accent transition-all font-bold text-text-primary"
              />
              <p className="text-[10px] text-text-primary/40 font-medium">This is your {settings.budgetType} spending limit in {settings.currency}.</p>
            </div>
          </div>
        </div>

        {/* General Options */}
        <div className="bg-card rounded-[32px] border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle bg-bg-main/50">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <SettingsIcon size={18} className="text-accent" /> Regional & App
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-text-primary">Language</p>
                  <p className="text-xs text-text-primary/40">Application display language</p>
                </div>
                <Globe size={18} className="text-text-primary/30" />
              </div>
              <div className="flex bg-bg-main p-1 rounded-xl">
                {(['en', 'fr', 'ko'] as const).map((l) => (
                  <button 
                    key={l}
                    onClick={() => setSettings({ ...settings, language: l })}
                    className={cn(
                      "flex-1 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-widest",
                      settings.language === l 
                        ? "bg-card text-accent shadow-sm" 
                        : "text-text-primary/40 hover:text-text-primary"
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
                  <p className="text-sm font-bold text-text-primary">Display Currency</p>
                  <p className="text-xs text-text-primary/40">Default tracking currency</p>
                </div>
                <Coins size={18} className="text-text-primary/30" />
              </div>
              <select 
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-3 bg-bg-main rounded-xl outline-none border-2 border-transparent focus:border-accent transition-all font-bold text-text-primary"
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
                <p className="text-sm font-bold text-text-primary">Appearance</p>
                <p className="text-xs text-text-primary/40">Light / Dark / Gold mode</p>
              </div>
              <div className="flex bg-bg-main p-1 rounded-xl">
                <button 
                  onClick={() => setSettings({ ...settings, theme: 'light' })}
                  className={cn("p-1.5 px-4 rounded-lg transition-all", settings.theme === 'light' ? "bg-card text-amber-500 shadow-sm" : "text-text-primary/40")}
                >
                  <Sun size={16} />
                </button>
                <button 
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                  className={cn("p-1.5 px-4 rounded-lg transition-all", settings.theme === 'dark' ? "bg-card text-indigo-400 shadow-sm" : "text-text-primary/40")}
                >
                  <Moon size={16} />
                </button>
                <button 
                  onClick={() => setSettings({ ...settings, theme: 'gold' })}
                  className={cn("p-1.5 px-4 rounded-lg transition-all", settings.theme === 'gold' ? "bg-card text-gold-accent shadow-sm" : "text-text-primary/40")}
                >
                  <Sparkles size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-card rounded-[32px] border border-border-subtle shadow-sm overflow-hidden md:col-span-2">
          <div className="p-6 border-b border-border-subtle bg-bg-main/50">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <Database size={18} className="text-rose-600" /> Data & Security
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-rose-500/10 p-4 rounded-2xl flex gap-4">
              <div className="shrink-0 w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 border border-rose-500/20">
                <ShieldAlert size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-rose-500">Security Note</p>
                <p className="text-xs text-rose-500/70 leading-relaxed">
                  Financial Safe is protected by Firebase Security Rules. Your data is isolated to your account 
                  and encrypted in transit. Always log out when using a public terminal.
                </p>
              </div>
            </div>

            <div className="pt-4">
               <motion.button 
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (confirm("Are you sure? This will log you out and clear local session. Cloud data remains safe.")) {
                      resetData();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 border-2 border-border-subtle rounded-2xl text-sm font-bold text-text-primary/50 transition-colors font-display"
               >
                 <Trash2 size={18} className="text-rose-500" /> 
                 <span>Logout & Reset Session</span>
               </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-10">
        <p className="text-xs text-text-primary/20 font-bold uppercase tracking-widest leading-loose">
          FinancialSafe v1.2.0 • Premium FinTech Experience<br/>
          Secure Cloud Sync Enabled • Made with ❤️
        </p>
      </div>
    </div>
  );
};
