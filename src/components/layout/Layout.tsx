import React from 'react';
import { 
  LayoutDashboard, 
  History, 
  Tags, 
  PieChart, 
  Target, 
  Settings as SettingsIcon,
  Wallet,
  Menu,
  X,
  CreditCard,
  Sun,
  Moon,
  Monitor,
  LogOut
} from 'lucide-react';
import { Page } from '../../AppContent';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useBudget } from '../../BudgetContext';

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { settings, setSettings, resetData } = useBudget();

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setSettings({ ...settings, theme: themes[nextIndex] });
  };

  const logout = () => {
    resetData();
  };

  const getThemeIcon = () => {
    if (settings.theme === 'light') return <Sun size={18} />;
    if (settings.theme === 'dark') return <Moon size={18} />;
    return <Monitor size={18} />;
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'budget', label: 'Budget Plan', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'goals', label: 'Savings Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-bg-main dark:bg-dark-bg-main overflow-hidden transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-card border-r border-border-subtle dark:border-dark-border transform transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white shadow-sm">
            <CreditCard size={18} />
          </div>
          <div>
            <h1 className="font-display font-black text-xl leading-none text-slate-900 dark:text-white tracking-tight">CediSafe</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as Page);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                  isActive 
                    ? "bg-accent-light dark:bg-dark-accent-light text-accent" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-dark-border space-y-3">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-dark-border"
          >
            {getThemeIcon()}
            <span className="capitalize">{settings.theme} Mode</span>
          </button>

          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Tracking Currency</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{settings.currency}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-dark-border flex items-center justify-between px-4 lg:px-8 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-400 lg:hidden hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-display font-semibold text-lg text-slate-800 dark:text-slate-200 capitalize tracking-tight">
              {activePage.replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{settings.userName || 'Member Account'}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{settings.email || 'Free Tier'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-black text-sm border-2 border-white dark:border-slate-800 shadow-sm">
              {(settings.userName || 'G').charAt(0).toUpperCase()}
              {(settings.userName || 'A').split(' ')[1]?.charAt(0).toUpperCase() || ''}
            </div>
          </div>
        </header>

        {/* Page Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto h-full text-slate-900 dark:text-slate-100">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
