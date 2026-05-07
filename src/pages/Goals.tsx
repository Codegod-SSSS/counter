import React, { useState } from 'react';
import { useBudget } from '../BudgetContext';
import { 
  Target, 
  Plus, 
  Trophy, 
  ChevronRight,
  TrendingUp,
  CircleDollarSign,
  Calendar
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { format } from 'date-fns';

export const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal, settings } = useBudget();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', deadline: '' });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount) return;
    addGoal({
      name: newGoal.name,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline || undefined
    });
    setNewGoal({ name: '', targetAmount: '', deadline: '' });
    setIsAddOpen(false);
  };

  const updateProgress = (id: string, increment: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    updateGoal({ ...goal, currentAmount: Math.max(0, goal.currentAmount + increment) });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Savings Goals</h1>
          <p className="text-text-primary/50">Track your progress towards big purchases.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus size={18} /> Add Goal
        </button>
      </div>

      {isAddOpen && (
        <div className="bg-card p-8 rounded-3xl border border-border-subtle shadow-xl animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-primary/30 uppercase tracking-widest">Goal Name</label>
              <input 
                type="text" 
                value={newGoal.name}
                onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="e.g. New Laptop"
                className="w-full px-4 py-2.5 bg-bg-main rounded-xl outline-none focus:bg-card border border-transparent focus:border-accent transition-all text-sm font-bold text-text-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-primary/30 uppercase tracking-widest">Target Amount ({settings.currency})</label>
              <input 
                type="number" 
                value={newGoal.targetAmount}
                onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                placeholder="5000"
                className="w-full px-4 py-2.5 bg-bg-main rounded-xl outline-none focus:bg-card border border-transparent focus:border-accent transition-all text-sm font-bold text-text-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-primary/30 uppercase tracking-widest">Deadline (Optional)</label>
              <input 
                type="date" 
                value={newGoal.deadline}
                onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-main rounded-xl outline-none focus:bg-card border border-transparent focus:border-accent transition-all text-sm font-bold text-text-primary"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2.5 bg-accent text-white rounded-xl text-sm font-bold shadow-emerald-500/20 shadow-lg">Save</button>
              <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2.5 bg-bg-main text-text-primary/40 rounded-xl text-sm font-bold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <div key={goal.id} className="bg-card p-8 rounded-3xl border border-border-subtle shadow-sm group hover:border-accent/40 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-bg-main rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <Target size={24} />
                </div>
                {goal.deadline && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-bg-main rounded-full text-[10px] font-bold text-text-primary/30">
                    <Calendar size={12} /> {format(new Date(goal.deadline), 'MMM yyyy')}
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-display font-bold text-text-primary mb-1 tracking-tight">{goal.name}</h3>
              <p className="text-sm font-medium text-text-primary/40 mb-8 font-display">
                {formatCurrency(goal.currentAmount, settings.currency)} of {formatCurrency(goal.targetAmount, settings.currency)}
              </p>

              <div className="space-y-4">
                <div className="h-3 bg-bg-main rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex gap-2">
                     <button 
                        onClick={() => updateProgress(goal.id, 100)}
                        className="px-3 py-1.5 bg-bg-main hover:bg-accent/10 hover:text-accent rounded-lg text-xs font-bold text-text-primary/40 transition-all border border-transparent hover:border-accent/20"
                     >
                       +{settings.currency}100
                     </button>
                     <button 
                        onClick={() => updateProgress(goal.id, 500)}
                        className="px-3 py-1.5 bg-bg-main hover:bg-accent/10 hover:text-accent rounded-lg text-xs font-bold text-text-primary/40 transition-all border border-transparent hover:border-accent/20"
                     >
                       +{settings.currency}500
                     </button>
                   </div>
                   <span className="text-xs font-black text-text-primary">{progress.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {goals.length === 0 && !isAddOpen && (
          <div className="md:col-span-2 py-20 bg-bg-main/50 rounded-[2.5rem] border-2 border-dashed border-border-subtle flex flex-col items-center justify-center text-text-primary/20">
             <Trophy size={48} className="mb-4 opacity-50" />
             <p className="font-medium">You haven't set any savings goals yet.</p>
             <button onClick={() => setIsAddOpen(true)} className="mt-4 text-accent font-bold hover:underline">Create your first goal</button>
          </div>
        )}
      </div>
    </div>
  );
};
