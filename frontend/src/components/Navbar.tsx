import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, LayoutDashboard, User as UserIcon, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, trialsUsed, maxFreeTrials, openAuthModal, requestLogout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#F6F5F2]/95 backdrop-blur-sm border-b border-[#DCDDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
          <div className="text-[#1677FF] transition-transform group-hover:scale-105">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" className="stroke-[#DCDDD9]" />
              <circle cx="12" cy="12" r="5" className="stroke-[#1677FF]" />
              <circle cx="12" cy="7" r="1.2" fill="#1677FF" stroke="none" />
              <circle cx="16.3" cy="14.5" r="1.2" fill="#111318" stroke="none" />
              <circle cx="7.7" cy="14.5" r="1.2" fill="#666A73" stroke="none" />
            </svg>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-[#111318] font-sans">
              Palette<span className="text-[#1677FF]">Lens</span>
            </span>
            <span className="text-[10px] font-mono font-medium text-[#666A73] bg-[#EBEAE5] border border-[#DCDDD9] px-1.5 py-0.5 rounded">
              v1.0
            </span>
          </div>
        </Link>

        {/* Navigation Links & Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          <Link
            to="/dashboard"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              isActive('/dashboard')
                ? 'bg-white text-[#111318] border border-[#DCDDD9] shadow-2xs font-semibold'
                : 'text-[#666A73] hover:text-[#111318] hover:bg-[#EBEAE5]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#666A73]" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#111318] hover:bg-[#252830] rounded-md transition-all shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#1677FF]" />
            <span>Analyze</span>
          </Link>

          {/* User Auth State / Trial Counter */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#DCDDD9]">
              <div className="flex items-center gap-1.5 bg-white border border-[#DCDDD9] text-[#111318] px-2.5 py-1.5 rounded-md text-xs font-medium">
                <UserIcon className="w-3.5 h-3.5 text-[#1677FF]" />
                <span className="max-w-[100px] sm:max-w-[140px] truncate">{user.name}</span>
              </div>
              
              <button
                onClick={requestLogout}
                title="Log Out"
                className="p-1.5 text-[#666A73] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-[#DCDDD9]">
              <div
                onClick={() => openAuthModal('signup')}
                className="cursor-pointer hidden md:flex items-center gap-1.5 bg-white border border-[#DCDDD9] text-[#111318] px-2.5 py-1.5 rounded-md text-xs font-medium hover:border-[#B5B7B0] transition-colors"
                title="3 Free Trial Analyses without account"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>{trialsUsed} / {maxFreeTrials} Free Trials</span>
              </div>

              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 text-xs font-medium text-[#666A73] hover:text-[#111318] hover:bg-[#EBEAE5] rounded-md transition-colors"
              >
                Log In
              </button>

              <button
                onClick={() => openAuthModal('signup')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#111318] hover:bg-[#252830] rounded-md transition-colors"
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
