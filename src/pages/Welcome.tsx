import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Sparkles, ShieldCheck, Zap, ArrowRight, Sun, Moon, Languages, Coins } from 'lucide-react';
import { useBudget } from '../BudgetContext';

const TRANSLATIONS = {
  en: {
    name: 'English',
    title: 'Master Your Money',
    subtitle: 'Secure, localized, and intelligent expense tracking built for everyone.',
    secure: 'Secure Storage',
    firebase: 'Firebase Ready',
    ai: 'AI Insights',
    tips: 'Smart Tips',
    start: 'Get Started',
    theme: 'Theme',
    language: 'Language',
    currency: 'Currency'
  },
  fr: {
    name: 'Français',
    title: 'Maîtrisez votre argent',
    subtitle: 'Suivi des dépenses sécurisé, localisé et intelligent conçu pour tous.',
    secure: 'Stockage Sécurisé',
    firebase: 'Prêt pour Firebase',
    ai: 'Aperçus IA',
    tips: 'Conseils Intelligents',
    start: 'Commencer',
    theme: 'Thème',
    language: 'Langue',
    currency: 'Devise'
  },
  ko: {
    name: '한국어',
    title: '당신의 자산을 관리하세요',
    subtitle: '모두를 위해 구축된 안전하고 현지화된 지능형 지불 추적 서비스입니다.',
    secure: '안전한 저장소',
    firebase: 'Firebase 준비 완료',
    ai: 'AI 인사이트',
    tips: '스마트 팁',
    start: '시작하기',
    theme: '테마',
    language: '언어',
    currency: '통화'
  }
};

const CURRENCIES = [
  { code: 'GHS', label: 'Ghanaian Cedi' },
  { code: 'USD', label: 'US Dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'WON', label: 'Korean Won' },
  { code: 'XOF', label: 'CFA Franc' }
];

export const Welcome: React.FC = () => {
  const { settings, setSettings } = useBudget();
  const lang = settings.language || 'en';
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];

  const handleEnter = () => {
    setSettings({ ...settings, welcomed: true });
  };

  const toggleTheme = () => {
    setSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const setLanguage = (l: 'en' | 'fr' | 'ko') => {
    setSettings({ ...settings, language: l });
  };

  const setCurrency = (c: string) => {
    setSettings({ ...settings, currency: c });
  };

  return (
    <div className="min-h-screen bg-bg-main dark:bg-dark-bg-main flex items-center justify-center p-4 overflow-hidden transition-colors duration-500">
      {/* Top Options Bar */}
      <div className="absolute top-8 right-8 flex items-center gap-4 z-20">
        <div className="flex bg-white/50 dark:bg-dark-card/50 backdrop-blur-md p-1 rounded-2xl border border-border-subtle dark:border-dark-border">
          {(['en', 'fr', 'ko'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                lang === l 
                ? 'bg-accent text-white shadow-lg shadow-emerald-200 dark:shadow-none' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <button 
          onClick={toggleTheme}
          className="p-3 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md rounded-2xl border border-border-subtle dark:border-dark-border text-slate-600 dark:text-slate-300 hover:text-accent transition-all"
        >
          {settings.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none">
              <CreditCard size={28} />
            </div>
            <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">FinancialSafe</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl lg:text-5xl font-display font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              {t.title} <span className="text-accent underline decoration-emerald-200 dark:decoration-emerald-900/50 underline-offset-8">Everywhere</span>.
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              {t.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t.currency}</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code)}
                  className={`py-3 rounded-xl text-xs font-bold border-2 transition-all ${
                    settings.currency === c.code 
                    ? 'border-accent bg-accent/5 text-accent' 
                    : 'border-slate-100 dark:border-dark-border text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-white dark:bg-dark-card rounded-2xl border border-border-subtle dark:border-dark-border shadow-sm">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-accent rounded-lg">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{t.secure}</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{t.firebase}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white dark:bg-dark-card rounded-2xl border border-border-subtle dark:border-dark-border shadow-sm">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-lg">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{t.ai}</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{t.tips}</p>
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
            className="group flex items-center gap-3 bg-accent text-white px-8 py-5 rounded-3xl font-display font-black text-xl shadow-2xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-600 transition-all"
          >
            {t.start} <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative hidden md:block"
        >
          {/* Card Mockup */}
          <div className="relative z-10 w-[340px] h-[500px] bg-white dark:bg-dark-card rounded-[48px] border-[12px] border-slate-900 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div className="h-8 w-32 bg-accent/20 rounded-lg" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-lg" />
                      <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
                    </div>
                    <div className="h-3 w-10 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="h-32 bg-accent/10 rounded-3xl border-2 border-dashed border-accent/30 mt-4 flex items-center justify-center">
                <Zap size={32} className="text-accent opacity-20" />
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/4 -left-12 w-24 h-24 bg-emerald-400/20 blur-3xl rounded-full" />
          <div className="absolute bottom-1/4 -right-12 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
        </motion.div>
      </div>
    </div>
  );
};
