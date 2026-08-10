import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, X } from 'lucide-react';

export const LogoutConfirmModal: React.FC = () => {
  const { isLogoutConfirmOpen, confirmLogout, cancelLogout, user } = useAuth();

  if (!isLogoutConfirmOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111318]/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#DCDDD9] rounded-2xl shadow-xl max-w-sm w-full p-6 relative space-y-4 text-center">
        
        {/* Close Icon */}
        <button
          onClick={cancelLogout}
          className="absolute top-4 right-4 p-1.5 text-[#666A73] hover:text-[#111318] hover:bg-[#F6F5F2] rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
          <LogOut className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#111318]">Confirm Log Out</h3>
          <p className="text-xs text-[#666A73] leading-relaxed">
            Are you sure you want to sign out of <span className="font-semibold text-[#111318] font-mono">{user?.email}</span>? You can sign back in anytime to access your saved palette history.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={cancelLogout}
            className="py-2 px-3 text-xs font-semibold text-[#111318] bg-[#F6F5F2] border border-[#DCDDD9] hover:bg-[#EBEAE5] rounded-xl transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={confirmLogout}
            className="py-2 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-2xs transition-colors"
          >
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
};
