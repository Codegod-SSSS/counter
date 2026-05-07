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
  LogOut,
  Sparkles
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
    const themes: ('light' | 'dark' | 'gold' | 'system')[] = ['light', 'dark', 'gold', 'system'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setSettings({ ...settings, theme: themes[nextIndex] });
  };

  const logout = () => {
    resetData();
  };

  const getThemeIcon = () => {
    if (settings.theme === 'light') return <Sun size={18} className="text-amber-500" />;
    if (settings.theme === 'dark') return <Moon size={18} className="text-indigo-400" />;
    if (settings.theme === 'gold') return <Sparkles size={18} className="text-gold-accent" />;
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
    <div className="flex h-screen bg-bg-main overflow-hidden transition-colors duration-500">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-text-primary/20 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border-subtle transform transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col shadow-sm",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-[var(--color-accent-contrast)] shadow-sm">
            <CreditCard size={18} />
          </div>
          <div>
            <h1 className="font-display font-black text-xl leading-none text-text-primary tracking-tight">CediSafe</h1>
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
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group",
                  isActive 
                    ? "bg-accent/10 text-accent" 
                    : "text-text-primary/50 hover:bg-bg-main hover:text-text-primary"
                )}
              >
                <Icon size={18} className={cn(isActive && "scale-110 transition-transform")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border-subtle space-y-3">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-text-primary/50 hover:bg-bg-main transition-all border border-border-subtle"
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

          <div className="bg-bg-main/50 rounded-xl p-4 border border-border-subtle/50">
            <p className="text-[10px] font-bold text-text-primary/30 uppercase tracking-widest mb-2">Tracking Currency</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-primary/80">{settings.currency}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border-subtle flex items-center justify-between px-4 lg:px-8 shrink-0 transition-colors duration-500">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-text-primary/60 lg:hidden hover:bg-bg-main rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-display font-semibold text-lg text-text-primary capitalize tracking-tight">
              {activePage.replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-text-primary leading-none">{settings.userName || 'Member Account'}</p>
              <p className="text-[10px] font-bold text-text-primary/40 uppercase tracking-widest mt-1">{settings.email || 'Free Tier'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent text-[var(--color-accent-contrast)] flex items-center justify-center font-black text-sm border-2 border-card shadow-sm">
              {(settings.userName || 'G').charAt(0).toUpperCase()}
              {(settings.userName || 'A').split(' ')[1]?.charAt(0).toUpperCase() || ''}
            </div>
          </div>
        </header>

        {/* Page Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
