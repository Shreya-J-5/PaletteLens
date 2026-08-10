import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, LayoutDashboard, User as UserIcon, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, trialsUsed, maxFreeTrials, openAuthModal, requestLogout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#0C0D0E]/95 backdrop-blur-md border-b border-[#262830]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
          <div className="text-[#8B5CF6] transition-transform group-hover:scale-105">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" className="stroke-[#262830]" />
              <circle cx="12" cy="12" r="5" className="stroke-[#8B5CF6]" />
              <circle cx="12" cy="7" r="1.2" fill="#8B5CF6" stroke="none" />
              <circle cx="16.3" cy="14.5" r="1.2" fill="#EC4899" stroke="none" />
              <circle cx="7.7" cy="14.5" r="1.2" fill="#10B981" stroke="none" />
            </svg>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-white font-sans">
              Palette<span className="text-[#8B5CF6]">Lens</span>
            </span>
            <span className="text-[10px] font-mono font-medium text-[#9CA3AF] bg-[#16171B] border border-[#262830] px-1.5 py-0.5 rounded">
              v1.0
            </span>
          </div>
        </Link>

        {/* Navigation Links & Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          <Link
            to="/dashboard"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              isActive('/dashboard')
                ? 'bg-[#16171B] text-white border border-[#262830] font-semibold'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#16171B]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg transition-all shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Analyze</span>
          </Link>

          {/* User Auth State / Trial Counter */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#262830]">
              <div className="flex items-center gap-1.5 bg-[#16171B] border border-[#262830] text-white px-2.5 py-1.5 rounded-lg text-xs font-medium">
                <UserIcon className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="max-w-[100px] sm:max-w-[140px] truncate">{user.name}</span>
              </div>
              
              <button
                onClick={requestLogout}
                title="Log Out"
                className="p-1.5 text-[#9CA3AF] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-[#262830]">
              <div
                onClick={() => openAuthModal('signup')}
                className="cursor-pointer hidden md:flex items-center gap-1.5 bg-[#16171B] border border-[#262830] text-[#9CA3AF] px-2.5 py-1.5 rounded-lg text-xs font-medium hover:border-[#3B3E4A] hover:text-white transition-colors"
                title="3 Free Trial Analyses without account"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>{trialsUsed} / {maxFreeTrials} Free Trials</span>
              </div>

              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 text-xs font-medium text-[#9CA3AF] hover:text-white hover:bg-[#16171B] rounded-lg transition-colors"
              >
                Log In
              </button>

              <button
                onClick={() => openAuthModal('signup')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#16171B] border border-[#262830] hover:bg-[#202229] rounded-lg transition-colors"
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
