import React, { useState } from 'react';
import { useBudget } from '../../BudgetContext';
import { X, Calendar, MessageSquare, CreditCard, Wallet, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { PaymentMethod } from '../../types';
import { CategoryIcon } from '../../pages/Categories';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  const { categories, addExpense, settings } = useBudget();
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;
    if (notes.length > 500) return;

    addExpense({
      amount: Number(amount),
      categoryId,
      date: new Date(date).toISOString(),
      paymentMethod,
      notes
    });
    
    // Reset and close
    setAmount('');
    setCategoryId('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 bottom-4 top-20 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-display font-black text-slate-900 tracking-tight">Record Expense</h3>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Amount Input */}
              <div className="text-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Amount</label>
                <div className="relative inline-block max-w-[200px]">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-black text-accent">{settings.currency}</span>
                  <input
                    type="number"
                    autoFocus
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-10 pr-2 py-2 text-4xl font-display font-black text-slate-900 focus:outline-none border-b-2 border-slate-100 focus:border-accent text-center transition-all bg-transparent"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Category</label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryId(cat.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all group",
                        categoryId === cat.id 
                          ? "border-accent bg-accent-light" 
                          : "border-slate-50 bg-slate-50 hover:border-slate-200"
                      )}
                    >
                      <div 
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform",
                          categoryId === cat.id ? "scale-110" : ""
                        )}
                        style={{ backgroundColor: cat.color }}
                      >
                        <CategoryIcon name={cat.icon} size={20} />
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wide truncate w-full text-center",
                        categoryId === cat.id ? "text-accent" : "text-slate-500"
                      )}>
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Payment Method</label>
                <div className="flex gap-2">
                  {(['Cash', 'Mobile Money', 'Bank'] as PaymentMethod[]).map((method) => {
                    const Icon = method === 'Cash' ? Banknote : method === 'Mobile Money' ? CreditCard : Wallet;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-xs transition-all",
                          paymentMethod === method 
                            ? "border-accent bg-accent-light text-accent" 
                            : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200"
                        )}
                      >
                        <Icon size={16} />
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-600 transition-all"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2"><MessageSquare size={14} /> Notes (Optional)</span>
                    <span className={cn("text-[8px]", notes.length > 500 ? "text-rose-500" : "text-slate-300")}>
                      {notes.length}/500
                    </span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                    placeholder="e.g. Lunch with team"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent transition-all placeholder:text-slate-300 resize-none h-20"
                  />
                </div>
              </div>

              <div className="pt-4 shrink-0">
                <button
                  type="submit"
                  disabled={!amount || !categoryId}
                  className="w-full bg-accent text-white py-5 rounded-2xl font-black text-lg tracking-tight shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
                >
                  Log Expense
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
