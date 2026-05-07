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
      title: "Welcome to Financial Safe",
      description: "Modern expense tracking tailored for you. Choose your preferred budgeting style.",
      icon: <Wallet className="text-accent" size={40} />,
      content: (
        <div className="space-y-4 text-left">
          <div className="flex gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <TrendingUp size={14} />
            </div>
            <p className="text-sm text-text-primary/60">Track spending across different timeframes.</p>
          </div>
          <div className="flex gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <ShieldCheck size={14} />
            </div>
            <p className="text-sm text-text-primary/60">Your data stays local and secure.</p>
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
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-border-subtle bg-card text-text-primary/40 hover:border-accent/40"
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
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30 font-bold">{settings.currency}</span>
            <input
              type="number"
              placeholder="e.g. 5,000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-bg-main border-2 border-border-subtle rounded-2xl text-2xl font-bold text-text-primary focus:border-accent outline-none transition-all placeholder:text-text-primary/20"
            />
          </div>
          <p className="text-xs text-text-primary/30 font-medium">Tracking your ${budgetType} target.</p>
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
        className="max-w-md w-full bg-card rounded-[2.5rem] p-10 shadow-2xl shadow-accent/5 transition-colors duration-500 text-center border border-border-subtle"
      >
        <div className="w-20 h-20 bg-accent/5 rounded-3xl flex items-center justify-center mx-auto mb-8">
          {currentStep.icon}
        </div>
        
        <h2 className="text-3xl font-display font-bold text-text-primary mb-4 tracking-tight">{currentStep.title}</h2>
        <p className="text-text-primary/50 mb-10 leading-relaxed text-sm">{currentStep.description}</p>
        
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
              className="flex-1 py-4 text-text-primary/40 font-semibold hover:bg-bg-main rounded-2xl transition-all text-sm"
            >
              Back
            </button>
          )}
          <button
            disabled={step === 3 && !budget}
            onClick={() => step === steps.length ? handleComplete() : setStep(step + 1)}
            className="flex-[2] bg-accent text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-accent/20 disabled:opacity-50 disabled:shadow-none"
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
                step === i + 1 ? "w-8 bg-accent" : "w-1.5 bg-border-subtle"
              )} 
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
