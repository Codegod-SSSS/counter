import React from 'react';
import { useBudget } from '../BudgetContext';
import { motion } from 'motion/react';
import { ShieldCheck, CreditCard, Chrome, Check } from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import { Link } from 'react-router-dom';

export const Login: React.FC = () => {
  const { setSettings, settings } = useBudget();

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  const handleGoogleLogin = async () => {
    if (loading || !termsAccepted) return;
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        await setSettings({
          ...settings,
          userName: result.user.displayName || '',
          email: result.user.email || '',
        });
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked! Please allow popups for this site and try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Login request was cancelled. Please try again.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in window was closed before completion.');
      } else {
        setError('An unexpected error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && termsAccepted && !loading) {
        handleGoogleLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [termsAccepted, loading]);

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card rounded-[40px] shadow-2xl overflow-hidden border border-border-subtle"
      >
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-accent/20 mb-6">
              <CreditCard size={32} />
            </div>
            <h1 className="text-3xl font-display font-black text-text-primary tracking-tight">MONEYTORY Login</h1>
            <p className="text-text-primary/50 text-sm">Secure access to your personal tracking.</p>
          </div>

          <div className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="flex items-start gap-3 p-4 bg-bg-main rounded-2xl border border-border-subtle group cursor-pointer transition-all hover:bg-card/50" onClick={() => setTermsAccepted(!termsAccepted)}>
              <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${termsAccepted ? 'bg-accent border-accent text-white' : 'border-border-subtle'}`}>
                {termsAccepted && <Check size={12} strokeWidth={4} />}
              </div>
              <p className="text-[11px] text-text-primary/60 font-medium leading-relaxed">
                I agree to the <Link to="/terms" className="text-accent font-bold hover:underline" onClick={(e) => e.stopPropagation()}>Terms & Conditions</Link> and understand how my data is handled.
              </p>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading || !termsAccepted}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-sm ${
                termsAccepted 
                ? 'bg-accent text-white hover:opacity-90 shadow-xl shadow-accent/20' 
                : 'bg-border-subtle text-text-primary/20 cursor-not-allowed opacity-50'
              }`}
            >
              <Chrome size={20} />
              {loading ? 'Connecting...' : 'Continue with Google'}
            </button>
          </div>

          <div className="pt-6 border-t border-border-subtle flex items-center justify-center gap-2 text-text-primary/20">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted via Firebase</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
