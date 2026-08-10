import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorAlertProps {
  message?: string | null;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
  const defaultMsg = message || "We couldn't access or process this source. The website or file may be restricted or unsupported.";

  return (
    <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-6 max-w-lg mx-auto shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-rose-950 text-sm">Analysis Unavailable</h3>
          <p className="text-xs text-rose-700 leading-relaxed">{defaultMsg}</p>
        </div>
      </div>

      <div className="bg-white/80 rounded-lg p-3 border border-rose-100 text-xs text-slate-600 space-y-1">
        <p className="font-medium text-slate-800">Suggested Action:</p>
        <p>If the website blocks automated access, capture a full-page screenshot and upload it as an Image analysis instead.</p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-900 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        )}
        <Link
          to="/analyze"
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          New Upload
        </Link>
      </div>
    </div>
  );
};
