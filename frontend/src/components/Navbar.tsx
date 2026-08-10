import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, LayoutDashboard, User as UserIcon, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, trialsUsed, maxFreeTrials, openAuthModal, requestLogout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
          <div className="text-sky-600 transition-transform group-hover:scale-110">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" className="stroke-slate-300" />
              <circle cx="12" cy="12" r="5" className="stroke-sky-600" />
              <circle cx="12" cy="7" r="1.3" fill="#38bdf8" stroke="none" />
              <circle cx="16.3" cy="14.5" r="1.3" fill="#818cf8" stroke="none" />
              <circle cx="7.7" cy="14.5" r="1.3" fill="#f43f5e" stroke="none" />
            </svg>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
              Palette<span className="text-sky-600">Lens</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md">
              v1.0
            </span>
          </div>
        </Link>

        {/* Navigation Links & Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          <Link
            to="/dashboard"
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all hover:shadow"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>Analyze</span>
          </Link>

          {/* User Auth State / Trial Counter */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold">
                <UserIcon className="w-3.5 h-3.5 text-sky-600" />
                <span className="max-w-[100px] sm:max-w-[140px] truncate">{user.name}</span>
              </div>
              
              <button
                onClick={requestLogout}
                title="Log Out"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div
                onClick={() => openAuthModal('signup')}
                className="cursor-pointer hidden md:flex items-center gap-1.5 bg-sky-50 border border-sky-200/80 text-sky-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-sky-100 transition-colors"
                title="3 Free Trial Analyses without account"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>{trialsUsed} / {maxFreeTrials} Free Trials</span>
              </div>

              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Log In
              </button>

              <button
                onClick={() => openAuthModal('signup')}
                className="px-3.5 py-2 text-xs font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
