import React, { useState } from 'react';
import { useBudget } from '../BudgetContext';
import { 
  Plus, 
  Tags, 
  Trash2, 
  Edit3,
  Palette,
  CircleDot
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

export const Categories: React.FC = () => {
  const { categories, addCategory, removeCategory, settings } = useBudget();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', color: '#4f46e5', limit: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name || !newCat.limit) return;
    addCategory({
      name: newCat.name,
      color: newCat.color,
      icon: 'Plus',
      monthlyLimit: Number(newCat.limit)
    });
    setNewCat({ name: '', color: '#4f46e5', limit: '' });
    setIsAddOpen(false);
  };

  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', 
    '#ec4899', '#64748b'
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Categorization</h1>
          <p className="text-slate-500 text-sm">Define and organize your spending labels.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-accent text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-50"
        >
          <Plus size={18} /> New Category
        </button>
      </div>

      {isAddOpen && (
        <div className="bg-white p-8 rounded-[32px] border border-border-subtle shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
           <form onSubmit={handleAdd} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Name</label>
                  <input 
                    type="text" 
                    value={newCat.name}
                    onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                    placeholder="e.g. Subscriptions"
                    className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-accent focus:bg-white transition-all font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget Goal ({settings.currency}/mo)</label>
                  <input 
                    type="number" 
                    value={newCat.limit}
                    onChange={e => setNewCat({ ...newCat, limit: e.target.value })}
                    placeholder="200"
                    className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-accent focus:bg-white transition-all font-bold text-slate-900"
                  />
                </div>
             </div>
             <div className="space-y-3">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Palette size={14}/> Identity Color</label>
               <div className="flex flex-wrap gap-2.5">
                 {colors.map(c => (
                   <button 
                      key={c}
                      type="button"
                      onClick={() => setNewCat({ ...newCat, color: c })}
                      className={cn(
                        "w-9 h-9 rounded-full border-4 transition-all duration-300 shadow-sm",
                        newCat.color === c ? "border-slate-300 scale-110" : "border-white"
                      )}
                      style={{ backgroundColor: c }}
                   />
                 ))}
               </div>
             </div>
             <div className="flex gap-3 pt-4">
               <button type="submit" className="flex-1 bg-accent text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100/50 hover:bg-emerald-600 transition-all">Create Category</button>
               <button type="button" onClick={() => setIsAddOpen(false)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest">Cancel</button>
             </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-[28px] border border-border-subtle shadow-sm flex flex-col group hover:border-accent/20 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                style={{ backgroundColor: cat.color }}
              >
                <Tags size={24} />
              </div>
              <button 
                onClick={() => removeCategory(cat.id)}
                className="p-3 text-slate-100 group-hover:text-slate-200 hover:!text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <h3 className="text-xl font-display font-black text-slate-900 tracking-tight leading-none mb-1">{cat.name}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Managed Spending</p>
            <div className="pt-4 border-t border-slate-50">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Goal Status</span>
                  <span className="text-sm font-black text-slate-900">{formatCurrency(cat.monthlyLimit, settings.currency)} Budget</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
