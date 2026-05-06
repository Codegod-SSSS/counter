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
        <h1 className="text-2xl font-display font-bold text-slate-900">Advanced Analytics</h1>
        <p className="text-slate-500">In-depth insights into your financial health.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending by Category */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <PieChartIcon size={20} />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900">Category Mix</h3>
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
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No data to display
              </div>
            )}
          </div>
        </div>

        {/* Top Expenses List */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
            <h4 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-6">Top Spending Groups</h4>
            <div className="space-y-6">
              {topCategories.map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-bold">{cat.name}</span>
                    </div>
                    <span className="text-sm font-medium text-white/70">{formatCurrency(cat.value)}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
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
              {topCategories.length === 0 && <p className="text-white/30 text-sm">No data yet</p>}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <AlertCircle size={20} />
              </div>
              <h3 className="font-bold text-slate-900">Budget Insight</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Based on your current spending of <span className="font-bold text-slate-900">{formatCurrency(totalSpent)}</span>, 
              you are predicted to spend <span className="font-bold text-indigo-600">{formatCurrency(totalSpent * (12 / (new Date().getMonth() + 1)))}</span> by the end of the year.
            </p>
          </div>
        </div>
      </div>

      {/* Yearly Trend Chart */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900">Spending Trend 2026</h3>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold text-slate-500">
            <Calendar size={14} /> Full Year View
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <ChartTooltip 
                 contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#4f46e5" 
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
