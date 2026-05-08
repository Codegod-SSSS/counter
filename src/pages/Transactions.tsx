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
import { motion, AnimatePresence } from 'motion/react';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CategoryIcon } from './Categories';

export const Transactions: React.FC = () => {
  const { expenses, categories, removeExpense, settings } = useBudget();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [isListOpen, setIsListOpen] = useState(true);

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
    writeFile(wb, "financial_safe_transactions.xlsx");
    setShowExportMenu(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Financial Safe Transaction Report", 14, 15);
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
    link.setAttribute("download", "financial_safe_transactions.csv");
    document.body.appendChild(link);
    link.click();
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="font-display font-bold text-[#56ea56] text-[26px]">Transaction History</h1>
          <p className="text-text-primary/50">Manage and analyze your spending logs.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-card border border-border-subtle px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-bg-main transition-all shadow-sm text-text-primary"
            >
              <Download size={18} className="text-text-primary/40" />
              Export Data
              <ChevronDown size={16} className="text-text-primary/40" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-2xl shadow-2xl border border-border-subtle py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                <button onClick={exportToExcel} className="w-full text-left px-4 py-2 text-sm font-medium text-text-primary/70 hover:bg-accent/10 hover:text-accent flex items-center gap-2 transition-colors">
                  <TableIcon size={16} /> Excel (.xlsx)
                </button>
                <button onClick={exportToPDF} className="w-full text-left px-4 py-2 text-sm font-medium text-text-primary/70 hover:bg-accent/10 hover:text-accent flex items-center gap-2 transition-colors">
                  <FileText size={16} /> PDF Report
                </button>
                <button onClick={exportToCSV} className="w-full text-left px-4 py-2 text-sm font-medium text-text-primary/70 hover:bg-accent/10 hover:text-accent flex items-center gap-2 transition-colors">
                  <History size={16} /> CSV File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-card p-4 rounded-3xl border border-border-subtle shadow-sm flex flex-col md:flex-row gap-4 shrink-0 transition-colors duration-300">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30" size={18} />
          <input 
            type="text"
            placeholder="Search notes or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-bg-main border border-transparent focus:bg-card focus:border-accent rounded-2xl text-sm outline-none transition-all font-medium text-text-primary"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30" size={16} />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-10 py-3 bg-bg-main border border-transparent rounded-2xl text-sm font-bold text-text-primary/60 outline-none hover:bg-bg-main shadow-inner transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-primary/30 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 flex flex-col gap-2">
        <button 
          onClick={() => setIsListOpen(!isListOpen)}
          className="w-full flex items-center justify-between p-4 bg-bg-main border border-border-subtle rounded-2xl hover:bg-bg-main/80 transition-all font-bold text-xs text-text-primary/40 uppercase tracking-widest"
        >
          <span className="flex items-center gap-2">
            <TableIcon size={16} className="text-accent" />
            Activity Log ({filteredExpenses.length})
          </span>
          <ChevronDown className={cn("transition-transform duration-300", !isListOpen && "-rotate-90")} size={16} />
        </button>

        <AnimatePresence>
          {isListOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-card rounded-[32px] border border-border-subtle shadow-sm overflow-hidden flex flex-col transition-colors duration-300"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-bg-main/50 text-[10px] uppercase tracking-widest font-black text-text-primary/40">
                    <tr>
                      <th className="px-8 py-5">Item</th>
                      <th className="px-8 py-5">Category</th>
                      <th className="px-8 py-5">Method</th>
                      <th className="px-8 py-5 text-right">Amount</th>
                      <th className="px-8 py-5 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-24 text-center text-text-primary/20">
                          <p className="font-bold text-sm">No activity recorded.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map((expense) => {
                        const category = categories.find(c => c.id === expense.categoryId);
                        return (
                          <tr key={expense.id} className="group hover:bg-bg-main/50 transition-colors">
                            <td className="px-8 py-4">
                              <div className="flex items-center gap-4">
                                <div 
                                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                                  style={{ backgroundColor: category?.color || 'var(--color-bg-main)' }}
                                >
                                  <CategoryIcon name={category?.icon || 'Tags'} size={18} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-text-primary leading-tight">
                                    {expense.notes || 'Unlabeled Expense'}
                                  </p>
                                  <p className="text-[10px] text-text-primary/30 font-bold uppercase tracking-tight">
                                    {format(parseISO(expense.date), 'MMM dd, hh:mm a')}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-4">
                              <span 
                                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                                style={{ backgroundColor: `${category?.color}20`, color: category?.color }}
                              >
                                {category?.name || 'Misc'}
                              </span>
                            </td>
                            <td className="px-8 py-4">
                              <span className="text-xs font-bold text-text-primary/50">{expense.paymentMethod}</span>
                            </td>
                            <td className="px-8 py-4 text-right">
                              <span className="text-sm font-black text-text-primary">
                                {formatCurrency(expense.amount, settings.currency)}
                              </span>
                            </td>
                            <td className="px-8 py-4 text-center">
                              <button 
                                onClick={() => removeExpense(expense.id)}
                                className="p-2 text-text-primary/10 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
