import React, { useState } from 'react';
import { useBudget } from '../BudgetContext';
import { 
  Plus, 
  Tags, 
  Trash2, 
  Edit3,
  Palette,
  CircleDot,
  ShoppingBag,
  Car,
  Home,
  Coffee,
  Heart,
  Gamepad,
  GraduationCap,
  Plane,
  Briefcase,
  Utensils,
  Smartphone,
  Gift,
  Search,
  LucideIcon
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  ShoppingBag,
  Car,
  Home,
  Coffee,
  Heart,
  Gamepad,
  GraduationCap,
  Plane,
  Briefcase,
  Utensils,
  Smartphone,
  Gift,
  Tags,
  Plus
};

export const CategoryIcon: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 20, className }) => {
  const Icon = ICON_MAP[name] || Tags;
  return <Icon size={size} className={className} />;
};

export const Categories: React.FC = () => {
  const { categories, addCategory, removeCategory, settings } = useBudget();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', color: '#4f46e5', limit: '', icon: 'ShoppingBag' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name || !newCat.limit) return;
    addCategory({
      name: newCat.name,
      color: newCat.color,
      icon: newCat.icon,
      monthlyLimit: Number(newCat.limit)
    });
    setNewCat({ name: '', color: '#4f46e5', limit: '', icon: 'ShoppingBag' });
    setIsAddOpen(false);
  };

  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', 
    '#ec4899', '#64748b'
  ];

  const availableIcons = Object.keys(ICON_MAP);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display font-bold text-[#56ea56] text-[26px] tracking-tight">Categorization</h1>
          <p className="text-text-primary/50 text-sm">Define and organize your spending labels.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-accent text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-md shadow-emerald-500/10"
        >
          <Plus size={18} /> New Category
        </button>
      </div>

      {isAddOpen && (
        <div className="bg-card p-8 rounded-[32px] border border-border-subtle shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
           <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-text-primary/30 uppercase tracking-widest">Category Name</label>
                   <input 
                     type="text" 
                     value={newCat.name}
                     onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                     placeholder="e.g. Subscriptions"
                     className="w-full px-5 py-3.5 bg-bg-main rounded-2xl outline-none border border-transparent focus:border-accent focus:bg-card transition-all font-bold text-text-primary"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-text-primary/30 uppercase tracking-widest">Budget Goal ({settings.currency}/mo)</label>
                   <input 
                     type="number" 
                     value={newCat.limit}
                     onChange={e => setNewCat({ ...newCat, limit: e.target.value })}
                     placeholder="200"
                     className="w-full px-5 py-3.5 bg-bg-main rounded-2xl outline-none border border-transparent focus:border-accent focus:bg-card transition-all font-bold text-text-primary"
                   />
                 </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-text-primary/30 uppercase tracking-widest flex items-center gap-2"><Plus size={14}/> Symbol</label>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2.5 p-4 bg-bg-main rounded-2xl border border-border-subtle/50">
                  {availableIcons.map(iconName => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setNewCat({ ...newCat, icon: iconName })}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        newCat.icon === iconName 
                          ? "bg-accent text-white shadow-lg shadow-accent/20 scale-110" 
                          : "bg-card text-text-primary/40 hover:text-text-primary hover:bg-card/80"
                      )}
                    >
                      <CategoryIcon name={iconName} size={18} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-text-primary/30 uppercase tracking-widest flex items-center gap-2"><Palette size={14}/> Identity Color</label>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map(c => (
                    <button 
                       key={c}
                       type="button"
                       onClick={() => setNewCat({ ...newCat, color: c })}
                       className={cn(
                         "w-9 h-9 rounded-full border-4 transition-all duration-300 shadow-sm",
                         newCat.color === c ? "border-text-primary/20 scale-110" : "border-card"
                       )}
                       style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-accent text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all">Create Category</button>
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-8 py-4 bg-bg-main text-text-primary/40 rounded-2xl font-bold hover:bg-bg-main/50 transition-all uppercase text-[10px] tracking-widest">Cancel</button>
              </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-card p-6 rounded-[28px] border border-border-subtle shadow-sm flex flex-col group hover:border-accent/40 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: cat.color, boxShadow: `0 8px 16px -4px ${cat.color}40` }}
              >
                <CategoryIcon name={cat.icon} size={24} />
              </div>
              <button 
                onClick={() => removeCategory(cat.id)}
                className="p-3 text-text-primary/10 group-hover:text-text-primary/20 hover:!text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <h3 className="text-xl font-display font-black text-text-primary tracking-tight leading-none mb-1">{cat.name}</h3>
            <p className="text-[10px] font-bold text-text-primary/30 uppercase tracking-widest mb-6">Managed Spending</p>
            <div className="pt-4 border-t border-border-subtle/50">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-text-primary/30 tracking-widest">Goal Status</span>
                  <span className="text-sm font-black text-text-primary">{formatCurrency(cat.monthlyLimit, settings.currency)} Budget</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
