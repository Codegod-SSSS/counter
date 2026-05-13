import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ScrollText, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Terms: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        navigate('/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bg-main p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-primary/50 hover:text-text-primary font-bold text-sm transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>

        <header className="space-y-4">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
            <ScrollText size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-text-primary tracking-tight">
            Terms & <span className="text-accent underline decoration-accent/20">Conditions</span>
          </h1>
          <p className="text-text-primary/50 font-medium">Last updated: May 8, 2026</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-card rounded-3xl border border-border-subtle shadow-sm flex flex-col gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Data Privacy</h3>
            <p className="text-sm text-text-primary/60 leading-relaxed">
              Your financial data is stored securely using Firebase. We do not sell your data or share it with third parties.
            </p>
          </div>
          <div className="p-8 bg-card rounded-3xl border border-border-subtle shadow-sm flex flex-col gap-4">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
              <FileText size={20} />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Financial Tracking</h3>
            <p className="text-sm text-text-primary/60 leading-relaxed">
              FinancialSafe is a tracking tool for personal use. It is not a financial advisor or a banking service.
            </p>
          </div>
        </div>

        <div className="prose prose-sm prose-slate max-w-none text-text-primary/70 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <CheckCircle2 size={18} className="text-accent" /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using FinancialSafe, you agree to follow and be bound by these terms. If you do not agree to these terms, please do not use the application.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <CheckCircle2 size={18} className="text-accent" /> 2. User Account
            </h2>
            <p>
              Login is handled via Google OAuth. You are responsible for maintaining the confidentiality of your Google account credentials.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <CheckCircle2 size={18} className="text-accent" /> 3. Usage Limits
            </h2>
            <p>
              The application is provided "as is". While we strive for 100% uptime and data accuracy, we do not guarantee that the service will be error-free.
            </p>
          </section>
        </div>

        <div className="pt-10 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs text-text-primary/40 font-bold uppercase tracking-widest">
            © 2026 FinancialSafe Project
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-accent text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-accent/20 hover:scale-105 transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
