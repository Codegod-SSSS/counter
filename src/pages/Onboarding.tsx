import React, { useState } from 'react';
import { useBudget } from '../BudgetContext';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, CalendarRange } from 'lucide-react';
import { cn } from '../lib/utils';
import { BudgetType } from '../types';

export const Onboarding: React.FC = () => {
  const { setSettings, settings } = useBudget();
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState('');
  const [budgetType, setBudgetType] = useState<BudgetType>('monthly');
  
  const handleComplete = () => {
    setSettings({
      ...settings,
      budgetAmount: Number(budget),
      budgetType,
      onboarded: true,
    });
  };

  const budgetTypes: { value: BudgetType; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const steps = [
    {
      title: "Welcome to CediSafe",
      description: "Modern expense tracking tailored for Ghana. Choose your preferred budgeting style.",
      icon: <Wallet className="text-accent" size={40} />,
      content: (
        <div className="space-y-4 text-left">
          <div className="flex gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-accent">
              <TrendingUp size={14} />
            </div>
            <p className="text-sm text-slate-600">Track spending across different timeframes.</p>
          </div>
          <div className="flex gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-accent">
              <ShieldCheck size={14} />
            </div>
            <p className="text-sm text-slate-600">Your data stays local and secure.</p>
          </div>
        </div>
      )
    },
    {
      title: "Choose Your Plan",
      description: "Select how often you want to track your budget.",
      icon: <CalendarRange className="text-accent" size={40} />,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {budgetTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setBudgetType(type.value)}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all font-bold text-sm",
                budgetType === type.value
                  ? "border-accent bg-emerald-50 text-accent"
                  : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Set Your Budget",
      description: `How much is your ${budgetType} budget in ${settings.currency}?`,
      icon: <CheckCircle2 className="text-accent" size={40} />,
      content: (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{settings.currency}</span>
            <input
              type="number"
              placeholder="e.g. 5,000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-2xl font-bold text-slate-900 focus:border-accent outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <p className="text-xs text-slate-400 font-medium">Tracking your {budgetType} target.</p>
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-emerald-100/20 text-center"
      >
        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
          {currentStep.icon}
        </div>
        
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 tracking-tight">{currentStep.title}</h2>
        <p className="text-slate-500 mb-10 leading-relaxed text-sm">{currentStep.description}</p>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-10"
          >
            {currentStep.content}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 text-slate-500 font-semibold hover:bg-slate-50 rounded-2xl transition-all text-sm"
            >
              Back
            </button>
          )}
          <button
            disabled={step === 3 && !budget}
            onClick={() => step === steps.length ? handleComplete() : setStep(step + 1)}
            className="flex-[2] bg-accent text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200/50 disabled:opacity-50 disabled:shadow-none"
          >
            {step === steps.length ? 'Get Started' : 'Continue'}
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                step === i + 1 ? "w-8 bg-accent" : "w-1.5 bg-slate-200"
              )} 
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
