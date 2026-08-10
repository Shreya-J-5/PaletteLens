import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, X } from 'lucide-react';

export const LogoutConfirmModal: React.FC = () => {
  const { isLogoutConfirmOpen, confirmLogout, cancelLogout, user } = useAuth();

  if (!isLogoutConfirmOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-sm w-full p-6 relative space-y-4 text-center">
        
        {/* Close Icon */}
        <button
          onClick={cancelLogout}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <LogOut className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-extrabold text-slate-900">Confirm Log Out</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Are you sure you want to sign out of <span className="font-semibold text-slate-700">{user?.email}</span>? You can sign back in anytime to access your saved palette history.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            type="button"
            onClick={cancelLogout}
            className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={confirmLogout}
            className="py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors"
          >
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
};
