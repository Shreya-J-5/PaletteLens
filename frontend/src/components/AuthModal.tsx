import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Sparkles, CheckCircle2, UserPlus, LogIn, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authMode, login, signup, trialLimitReachedMessage } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(authMode);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Synchronize modal mode with context authMode when opened
  useEffect(() => {
    setMode(authMode);
    setError(null);
  }, [authMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (mode === 'login') {
      const res = login(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to sign in. Please verify your credentials.');
      }
    } else {
      const res = signup(name, email, password);
      if (!res.success) {
        setError(res.error || 'Failed to create account.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#16171B] border border-[#262830] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative text-white glow-purple">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 text-[#9CA3AF] hover:text-white hover:bg-[#1E2026] rounded-lg transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 text-center border-b border-[#262830] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-11 h-11 rounded-2xl bg-[#1E2026] border border-[#262830] text-[#8B5CF6] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            {mode === 'signup' ? (
              <>
                Create <span className="font-cursive text-[#A78BFA] text-3xl font-bold">Studio</span> Account
              </>
            ) : (
              <>
                Welcome <span className="font-cursive text-[#A78BFA] text-3xl font-bold">Back</span>
              </>
            )}
          </h3>

          {trialLimitReachedMessage ? (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-xl text-left flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{trialLimitReachedMessage}</span>
            </div>
          ) : (
            <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">
              {mode === 'signup'
                ? 'Sign up first to save your credentials and unlock unlimited color extractions.'
                : 'Sign in with your registered account details to access your palette history.'}
            </p>
          )}

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-[#1E2026] border border-[#262830] p-1 rounded-xl text-xs font-medium mt-4">
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-[#16171B] text-white border border-[#262830] shadow-sm font-semibold'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-[#16171B] text-white border border-[#262830] shadow-sm font-semibold'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Log In
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-mono font-medium text-[#9CA3AF] uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#1E2026] border border-[#262830] rounded-xl text-xs focus:outline-none focus:border-[#8B5CF6] transition-all text-white placeholder:text-[#6B7280]"
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <label className="block text-[11px] font-mono font-medium text-[#9CA3AF] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#1E2026] border border-[#262830] rounded-xl text-xs focus:outline-none focus:border-[#8B5CF6] transition-all text-white placeholder:text-[#6B7280] font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-[11px] font-mono font-medium text-[#9CA3AF] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#1E2026] border border-[#262830] rounded-xl text-xs focus:outline-none focus:border-[#8B5CF6] transition-all text-white placeholder:text-[#6B7280]"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-medium text-left flex items-start gap-2 space-y-1 flex-col">
              <div className="flex items-center gap-1.5 font-semibold text-rose-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Authentication Required</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">{error}</p>

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="mt-1 text-[11px] font-bold text-[#A78BFA] hover:underline underline-offset-2 flex items-center gap-1"
                >
                  Click here to Sign Up first →
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {mode === 'signup' ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Studio Account & Log In</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Studio</span>
              </>
            )}
          </button>

          {/* Quick Notice */}
          <div className="pt-2 text-center text-[11px] text-[#9CA3AF]">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="text-[#A78BFA] font-semibold hover:underline"
                >
                  Sign Up here
                </button>
              </p>
            ) : (
              <p>
                Already signed up?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-[#A78BFA] font-semibold hover:underline"
                >
                  Log in here
                </button>
              </p>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
