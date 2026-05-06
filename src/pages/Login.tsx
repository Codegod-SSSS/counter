import React from 'react';
import { useBudget } from '../BudgetContext';
import { motion } from 'motion/react';
import { ShieldCheck, CreditCard, Chrome } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

export const Login: React.FC = () => {
  const { setSettings, settings } = useBudget();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        // BudgetContext onAuthStateChanged will handle the rest
        // But we should update local state if it's the first time
        await setSettings({
          ...settings,
          userName: result.user.displayName || '',
          email: result.user.email || '',
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main dark:bg-dark-bg-main flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-dark-card rounded-[40px] shadow-2xl overflow-hidden border border-border-subtle dark:border-dark-border"
      >
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-200 dark:shadow-none mb-6">
              <CreditCard size={32} />
            </div>
            <h1 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">CediSafe Login</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Secure access to your Ghanaian Cedi tracking.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              <Chrome size={20} />
              Continue with Google
            </button>
            
            <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest px-4">
              By continuing you agree to our terms and conditions.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-dark-border flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted via Firebase</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
