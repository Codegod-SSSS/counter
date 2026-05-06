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
          <h1 className="text-2xl font-display font-bold text-slate-900">Savings Goals</h1>
          <p className="text-slate-500">Track your progress towards big purchases.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
        >
          <Plus size={18} /> Add Goal
        </button>
      </div>

      {isAddOpen && (
        <div className="bg-white p-8 rounded-3xl border-2 border-indigo-100 shadow-xl shadow-indigo-50 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Goal Name</label>
              <input 
                type="text" 
                value={newGoal.name}
                onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="e.g. New Laptop"
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl outline-none focus:bg-white border focus:border-indigo-500 transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Target Amount ({settings.currency})</label>
              <input 
                type="number" 
                value={newGoal.targetAmount}
                onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                placeholder="5000"
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl outline-none focus:bg-white border focus:border-indigo-500 transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Deadline (Optional)</label>
              <input 
                type="date" 
                value={newGoal.deadline}
                onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl outline-none focus:bg-white border focus:border-indigo-500 transition-all text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-indigo-100 shadow-lg">Save</button>
              <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <div key={goal.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <Target size={24} />
                </div>
                {goal.deadline && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400">
                    <Calendar size={12} /> {format(new Date(goal.deadline), 'MMM yyyy')}
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-display font-bold text-slate-900 mb-1">{goal.name}</h3>
              <p className="text-sm font-medium text-slate-400 mb-8">
                {formatCurrency(goal.currentAmount, settings.currency)} of {formatCurrency(goal.targetAmount, settings.currency)}
              </p>

              <div className="space-y-4">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex gap-2">
                     <button 
                        onClick={() => updateProgress(goal.id, 100)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-xs font-bold text-slate-500 transition-all"
                     >
                       +{settings.currency}100
                     </button>
                     <button 
                        onClick={() => updateProgress(goal.id, 500)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-xs font-bold text-slate-500 transition-all"
                     >
                       +{settings.currency}500
                     </button>
                   </div>
                   <span className="text-xs font-black text-slate-900">{progress.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {goals.length === 0 && !isAddOpen && (
          <div className="md:col-span-2 py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
             <Trophy size={48} className="mb-4 opacity-10" />
             <p className="font-medium">You haven't set any savings goals yet.</p>
             <button onClick={() => setIsAddOpen(true)} className="mt-4 text-indigo-600 font-bold hover:underline">Create your first goal</button>
          </div>
        )}
      </div>
    </div>
  );
};
