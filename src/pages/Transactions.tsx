import React, { useState, useMemo } from 'react';
import { useBudget } from '../BudgetContext';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  Calendar,
  MoreVertical,
  Trash2,
  FileText,
  Table as TableIcon
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const Transactions: React.FC = () => {
  const { expenses, categories, removeExpense, settings } = useBudget();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const category = categories.find(c => c.id === e.categoryId);
      const matchesSearch = category?.name.toLowerCase().includes(search.toLowerCase()) || 
                           e.notes?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || e.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, categories, search, categoryFilter]);

  const exportToExcel = () => {
    const data = filteredExpenses.map(e => ({
      Date: format(parseISO(e.date), 'yyyy-MM-dd'),
      Category: categories.find(c => c.id === e.categoryId)?.name || 'Unknown',
      Amount: e.amount,
      Currency: settings.currency,
      Method: e.paymentMethod,
      Notes: e.notes || ''
    }));
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Transactions");
    writeFile(wb, "ceditrack_transactions.xlsx");
    setShowExportMenu(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("CediTrack Transaction Report", 14, 15);
    const tableData = filteredExpenses.map(e => [
      format(parseISO(e.date), 'dd/MM/yyyy'),
      categories.find(c => c.id === e.categoryId)?.name || 'Unknown',
      e.paymentMethod,
      `${settings.currency} ${e.amount.toFixed(2)}`
    ]);
    (doc as any).autoTable({
      startY: 20,
      head: [['Date', 'Category', 'Method', 'Amount']],
      body: tableData,
    });
    doc.save("ceditrack_report.pdf");
    setShowExportMenu(false);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Amount', 'Method', 'Notes'];
    const rows = filteredExpenses.map(e => [
      format(parseISO(e.date), 'yyyy-MM-dd'),
      categories.find(c => c.id === e.categoryId)?.name || 'Unknown',
      e.amount,
      e.paymentMethod,
      e.notes || ''
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + 
      headers.join(",") + "\n" + 
      rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ceditrack_transactions.csv");
    document.body.appendChild(link);
    link.click();
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Transaction History</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and analyze your spending logs.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm dark:text-slate-200"
            >
              <Download size={18} className="text-slate-400 dark:text-slate-500" />
              Export Data
              <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-slate-100 dark:border-dark-border py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                <button onClick={exportToExcel} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors">
                  <TableIcon size={16} /> Excel (.xlsx)
                </button>
                <button onClick={exportToPDF} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors">
                  <FileText size={16} /> PDF Report
                </button>
                <button onClick={exportToCSV} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors">
                  <History size={16} /> CSV File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-dark-card p-4 rounded-3xl border border-border-subtle dark:border-dark-border shadow-sm flex flex-col md:flex-row gap-4 shrink-0 transition-colors duration-300">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search notes or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-accent rounded-2xl text-sm outline-none transition-all font-medium text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 outline-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 bg-white dark:bg-dark-card rounded-[32px] border border-border-subtle dark:border-dark-border shadow-sm overflow-hidden flex flex-col transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500">
              <tr>
                <th className="px-8 py-5 text-slate-400 dark:text-slate-500 font-black">Item</th>
                <th className="px-8 py-5 text-slate-400 dark:text-slate-500 font-black">Category</th>
                <th className="px-8 py-5 text-slate-400 dark:text-slate-500 font-black">Method</th>
                <th className="px-8 py-5 text-slate-400 dark:text-slate-500 font-black text-right">Amount</th>
                <th className="px-8 py-5 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center text-slate-300 dark:text-slate-700">
                    <p className="font-bold text-sm">No activity recorded.</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => {
                  const category = categories.find(c => c.id === expense.categoryId);
                  return (
                    <tr key={expense.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              {expense.notes || 'Unlabeled Expense'}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">
                              {format(parseISO(expense.date), 'MMM dd, hh:mm a')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span 
                          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                          style={{ backgroundColor: `${category?.color}15`, color: category?.color }}
                        >
                          {category?.name || 'Misc'}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{expense.paymentMethod}</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {formatCurrency(expense.amount, settings.currency)}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <button 
                          onClick={() => removeExpense(expense.id)}
                          className="p-2 text-slate-200 dark:text-slate-700 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
