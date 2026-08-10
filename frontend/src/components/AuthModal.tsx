import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authMode, login, signup, trialLimitReachedMessage } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(authMode);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Please enter your name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'login') {
      login(email);
    } else {
      signup(name, email);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111318]/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#DCDDD9] rounded-2xl shadow-xl max-w-md w-full overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 text-[#666A73] hover:text-[#111318] hover:bg-[#F6F5F2] rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 text-center border-b border-[#DCDDD9]">
          <div className="w-10 h-10 rounded-xl bg-[#F6F5F2] border border-[#DCDDD9] text-[#1677FF] flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          
          <h3 className="text-xl font-extrabold text-[#111318]">
            {mode === 'signup' ? 'Create Studio Account' : 'Welcome Back'}
          </h3>

          {trialLimitReachedMessage ? (
            <div className="mt-2.5 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded-xl text-left flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>{trialLimitReachedMessage}</span>
            </div>
          ) : (
            <p className="text-xs text-[#666A73] mt-1">
              {mode === 'signup'
                ? 'Sign up to unlock unlimited website, image, and PDF color extractions.'
                : 'Sign in to access your saved palette analysis history.'}
            </p>
          )}

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-[#F6F5F2] border border-[#DCDDD9] p-1 rounded-xl text-xs font-medium mt-4">
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#111318] border border-[#DCDDD9] shadow-2xs font-semibold'
                  : 'text-[#666A73] hover:text-[#111318]'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#111318] border border-[#DCDDD9] shadow-2xs font-semibold'
                  : 'text-[#666A73] hover:text-[#111318]'
              }`}
            >
              Log In
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1 text-left">
              <label className="block text-[11px] font-semibold text-[#111318] uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8A8F98] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#F6F5F2] border border-[#DCDDD9] rounded-xl text-xs focus:outline-none focus:border-[#111318] focus:bg-white transition-all text-[#111318]"
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="block text-[11px] font-semibold text-[#111318] uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A8F98] absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F6F5F2] border border-[#DCDDD9] rounded-xl text-xs focus:outline-none focus:border-[#111318] focus:bg-white transition-all text-[#111318]"
                required
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="block text-[11px] font-semibold text-[#111318] uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A8F98] absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F6F5F2] border border-[#DCDDD9] rounded-xl text-xs focus:outline-none focus:border-[#111318] focus:bg-white transition-all text-[#111318]"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium text-left">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#111318] hover:bg-[#252830] rounded-xl shadow-2xs transition-all"
          >
            {mode === 'signup' ? 'Create Free Account' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
};
