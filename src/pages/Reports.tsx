import React from 'react';
import { useBudget } from '../BudgetContext';
import { 
  PieChart as PieChartIcon, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  Layers
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as ChartTooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { format, subMonths, parseISO } from 'date-fns';

export const Reports: React.FC = () => {
  const { expenses, categories, settings } = useBudget();

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Category Breakdown
  const categoryData = categories.map(cat => ({
    name: cat.name,
    value: expenses.filter(e => e.categoryId === cat.id).reduce((acc, curr) => acc + curr.amount, 0),
    color: cat.color
  })).filter(c => c.value > 0);

  // Growth Data
  const monthlyData = Array.from({ length: 12 }).map((_, i) => {
    const monthDate = new Date(new Date().getFullYear(), i, 1);
    const amount = expenses
      .filter(e => {
        const date = parseISO(e.date);
        return date.getMonth() === i && date.getFullYear() === new Date().getFullYear();
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { name: format(monthDate, 'MMM'), amount };
  });

  const topCategories = [...categoryData].sort((a, b) => b.value - a.value).slice(0, 3);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">Advanced Analytics</h1>
        <p className="text-text-primary/50">In-depth insights into your financial health.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending by Category */}
        <div className="bg-card p-8 rounded-3xl border border-border-subtle shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <PieChartIcon size={20} />
            </div>
            <h3 className="text-xl font-display font-bold text-text-primary">Category Mix</h3>
          </div>
          
          <div className="h-[350px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'var(--color-bg-main)', color: 'var(--color-text-primary)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-text-primary/20">
                No data to display
              </div>
            )}
          </div>
        </div>

        {/* Top Expenses List */}
        <div className="flex flex-col gap-6">
          <div className="bg-text-primary p-8 rounded-3xl text-card shadow-xl">
            <h4 className="opacity-50 text-xs font-bold uppercase tracking-widest mb-6 font-display">Top Spending Groups</h4>
            <div className="space-y-6">
              {topCategories.map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                    </div>
                    <span className="text-sm font-black">{formatCurrency(cat.value, settings.currency)}</span>
                  </div>
                  <div className="h-1.5 bg-card/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000" 
                      style={{ 
                        backgroundColor: cat.color,
                        width: `${(cat.value / totalSpent) * 100}%` 
                      }} 
                    />
                  </div>
                </div>
              ))}
              {topCategories.length === 0 && <p className="opacity-30 text-sm italic">No data yet</p>}
            </div>
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border-subtle shadow-sm flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                <AlertCircle size={20} />
              </div>
              <h3 className="font-bold text-text-primary">Budget Insight</h3>
            </div>
            <p className="text-sm text-text-primary/60 leading-relaxed">
              Based on your current spending of <span className="font-bold text-text-primary">{formatCurrency(totalSpent, settings.currency)}</span>, 
              you are predicted to spend <span className="font-bold text-accent">{formatCurrency(totalSpent * (12 / (new Date().getMonth() + 1)), settings.currency)}</span> by the end of the year.
            </p>
          </div>
        </div>
      </div>

      {/* Yearly Trend Chart */}
      <div className="bg-card p-8 rounded-3xl border border-border-subtle shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-xl font-display font-bold text-text-primary">Spending Trend 2026</h3>
          </div>
          <div className="bg-bg-main px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold text-text-primary/50">
            <Calendar size={14} /> Full Year View
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-primary)', opacity: 0.3, fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-primary)', opacity: 0.3, fontSize: 10 }} />
              <ChartTooltip 
                 contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'var(--color-bg-main)', color: 'var(--color-text-primary)' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="var(--color-accent)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAmount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
