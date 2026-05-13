import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Sparkles, ShieldCheck, Zap, ArrowRight, Sun, Moon, Languages, Coins } from 'lucide-react';
import { useBudget } from '../BudgetContext';

const TRANSLATIONS = {
  en: {
    name: 'English',
    title: 'Welcome to Financial Safe',
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
  const [step, setStep] = React.useState(1);
  const lang = settings.language || 'en';
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];

  const handleNext = () => {
    setStep(2);
  };

  const handleEnter = () => {
    setSettings({ ...settings, welcomed: true });
  };

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'gold')[] = ['light', 'dark', 'gold'];
    const currentIndex = themes.indexOf(settings.theme as 'light' | 'dark' | 'gold');
    const nextIndex = (currentIndex + 1) % themes.length;
    setSettings({ ...settings, theme: themes[nextIndex] as 'light' | 'dark' | 'gold' | 'system' });
  };

  const setLanguage = (l: 'en' | 'fr' | 'ko') => {
    setSettings({ ...settings, language: l });
  };

  const setCurrency = (c: string) => {
    setSettings({ ...settings, currency: c });
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (step === 1) {
          handleNext();
        } else {
          handleEnter();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, settings]);

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4 overflow-hidden transition-colors duration-500 relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-[40%] right-[5%] w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-float-slow" style={{ animationDelay: '-10s' }} />
      </div>

      {/* Top Options Bar */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-8 right-8 flex items-center gap-4 z-20"
          >
            <div className="flex bg-card/50 backdrop-blur-md p-1 rounded-2xl border border-border-subtle shadow-sm">
              {(['en', 'fr', 'ko'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    lang === l 
                    ? 'bg-accent text-[var(--color-accent-contrast)] shadow-lg' 
                    : 'text-text-primary/50 hover:text-text-primary'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button 
              onClick={toggleTheme}
              className="p-3 bg-card/50 backdrop-blur-md rounded-2xl border border-border-subtle text-text-primary/70 hover:text-accent transition-all shadow-sm"
            >
              {settings.theme === 'dark' ? <Moon size={20} className="text-indigo-400" /> : 
               settings.theme === 'gold' ? <Sparkles size={20} className="text-gold-accent" /> : 
               <Sun size={20} className="text-amber-500" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-[var(--color-accent-contrast)] shadow-lg shadow-accent/20">
              <CreditCard size={28} />
            </div>
            <h1 className="text-2xl font-display font-black text-text-primary tracking-tight">FinancialSafe</h1>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl lg:text-7xl font-display font-black text-text-primary leading-[1.05] tracking-tight"
                  >
                    {t.title} <span className="text-accent underline decoration-accent/20 underline-offset-8">Everywhere</span>.
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-text-primary/60 leading-relaxed max-w-md"
                  >
                    {t.subtitle}
                  </motion.p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="flex items-start gap-3 p-5 bg-card/50 backdrop-blur-sm rounded-3xl border border-border-subtle shadow-sm group hover:shadow-md transition-all">
                    <div className="p-2.5 bg-accent/10 text-accent rounded-xl group-hover:scale-110 transition-transform">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{t.secure}</p>
                      <p className="text-[10px] text-text-primary/40 uppercase font-black tracking-widest mt-1">{t.firebase}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-5 bg-card/50 backdrop-blur-sm rounded-3xl border border-border-subtle shadow-sm group hover:shadow-md transition-all">
                    <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl group-hover:scale-110 transition-transform">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{t.ai}</p>
                      <p className="text-[10px] text-text-primary/40 uppercase font-black tracking-widest mt-1">{t.tips}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="group flex items-center justify-between bg-accent text-[var(--color-accent-contrast)] px-8 py-5 rounded-3xl font-display font-black text-xl shadow-2xl shadow-accent/20 hover:bg-opacity-90 transition-all w-full sm:w-auto min-w-[200px]"
                >
                  Continue <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform ml-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-display font-black text-text-primary tracking-tight">Personalize Your Safe</h2>
                  <p className="text-text-primary/60">Choose how you want to interact with your money.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-text-primary/40 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Coins size={14} className="text-accent"/> {t.currency}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {CURRENCIES.map((c, i) => (
                        <motion.button
                          key={c.code}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + (i * 0.05) }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrency(c.code)}
                          className={`py-4 rounded-2xl text-xs font-bold border-2 transition-all ${
                            settings.currency === c.code 
                            ? 'border-accent bg-accent text-white shadow-xl shadow-accent/20' 
                            : 'border-border-subtle bg-card/50 text-text-primary/40 hover:border-accent/40 hover:text-text-primary'
                          }`}
                        >
                          {c.code}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-text-primary/40 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Languages size={14} className="text-accent"/> {t.language}
                      </label>
                      <div className="flex flex-col gap-2">
                        {(['en', 'fr', 'ko'] as const).map((l) => (
                          <button
                            key={l}
                            onClick={() => setLanguage(l)}
                            className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all ${
                              lang === l 
                              ? 'bg-accent/10 border-accent/20 border text-accent' 
                              : 'bg-card/50 border border-border-subtle text-text-primary/50 hover:text-text-primary'
                            }`}
                          >
                            {TRANSLATIONS[l].name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-text-primary/40 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Zap size={14} className="text-amber-500"/> {t.theme}
                      </label>
                      <div className="flex flex-col gap-2">
                        {(['light', 'dark', 'gold'] as const).map((th) => (
                          <button
                            key={th}
                            onClick={() => setSettings({ ...settings, theme: th as any })}
                            className={`px-4 py-3 rounded-2xl text-xs font-bold text-left capitalize transition-all ${
                              settings.theme === th
                              ? 'bg-accent/10 border-accent/20 border text-accent' 
                              : 'bg-card/50 border border-border-subtle text-text-primary/50 hover:text-text-primary'
                            }`}
                          >
                             {th}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-6 py-5 rounded-3xl font-display font-bold text-text-primary/40 hover:text-text-primary transition-colors"
                  >
                    Back
                  </button>
                  <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEnter}
                    className="flex-1 group flex items-center justify-center gap-3 bg-accent text-[var(--color-accent-contrast)] px-8 py-5 rounded-3xl font-display font-black text-xl shadow-2xl shadow-accent/20 hover:bg-opacity-90 transition-all"
                  >
                    {t.start} <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative hidden md:block animate-float"
        >
          {/* Phone Mockup Frame */}
          <div className="relative z-10 w-[300px] h-[600px] bg-card rounded-[54px] border-[10px] border-text-primary/10 shadow-2xl overflow-hidden ring-4 ring-text-primary/5">
            {/* Speaker/Notch Area */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-text-primary/10 rounded-b-2xl z-30" />
            
            <div className="p-6 pt-12 space-y-8 h-full flex flex-col">
              <div className="flex justify-between items-center">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ delay: 1.4 }}
                  className="h-10 bg-text-primary/5 rounded-xl" 
                />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 1.5 }}
                  className="w-10 h-10 bg-text-primary/5 rounded-full flex items-center justify-center"
                >
                  <div className="w-6 h-6 bg-accent/20 rounded-full border-2 border-accent" />
                </motion.div>
              </div>

              <div className="space-y-3">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="h-4 w-24 bg-text-primary/5 rounded-full" 
                />
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.7 }}
                  className="h-12 w-48 bg-accent/10 rounded-2xl flex items-center px-4"
                >
                   <div className="h-6 w-32 bg-accent rounded-full opacity-30" />
                </motion.div>
              </div>

              <div className="space-y-4 flex-1">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i} 
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.8 + (i * 0.1) }}
                    className="flex items-center justify-between p-4 bg-text-primary/[0.02] rounded-2xl border border-border-subtle shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-text-primary/5 rounded-lg flex items-center justify-center">
                        <div className={`w-4 h-4 rounded-full ${['bg-red-400', 'bg-blue-400', 'bg-emerald-400', 'bg-amber-400'][i-1]}`} />
                      </div>
                      <div className="h-3 w-16 bg-text-primary/10 rounded-full" />
                    </div>
                    <div className="h-3 w-10 bg-text-primary/10 rounded-full text-[10px] flex items-center justify-end font-bold text-text-primary/40">-{i*10}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.3 }}
                className="h-28 bg-accent/5 rounded-3xl border-2 border-dashed border-accent/20 flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-[var(--color-accent-contrast)]">
                  <Zap size={20} />
                </div>
                <div className="h-2 w-20 bg-accent/20 rounded-full" />
              </motion.div>
            </div>
          </div>
          
          {/* Decorative Floating Elements around Phone */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-6 -right-12 z-20 bg-card p-4 rounded-2xl shadow-xl border border-border-subtle"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase text-text-primary/50 tracking-tighter">Safe Status</span>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-12 -left-16 z-20 bg-accent text-[var(--color-accent-contrast)] p-4 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">AI Insight Ready</span>
          </motion.div>

          <div className="absolute top-1/4 -left-12 w-32 h-32 bg-accent/10 blur-3xl rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 -right-12 w-48 h-48 bg-accent/10 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </motion.div>
      </div>
    </div>
  );
};
