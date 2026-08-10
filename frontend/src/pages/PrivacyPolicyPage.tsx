import React from 'react';
import { ShieldCheck, Lock, Eye, Server, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-bold border border-sky-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy Policy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy & Data Handling</h1>
        <p className="text-sm text-slate-500">Last updated: August 2026</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-sky-600" />
            1. Information We Process
          </h2>
          <p>
            PaletteLens analyzes publicly accessible website URLs, uploaded images (PNG, JPG, WEBP, SVG), and PDF documents provided directly by users. We collect minimal information required to compute genuine color palettes and preserve user history.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-600" />
            2. How Extracted Data Is Used
          </h2>
          <p>
            Submitted visual content is processed exclusively for CIE L*a*b* perceptual color clustering, DOM CSS color analysis, and page-by-page color aggregation. PaletteLens does not sell, market, or share your submitted files with third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" />
            3. Account & Local Storage Security
          </h2>
          <p>
            User accounts utilize email identification to scope historical color analyses. Free trial counts and user sessions are preserved using standard client-side encryption and secure API communication.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900">4. Contact & Data Inquiries</h2>
          <p>
            If you have questions regarding your stored palette history or account data deletion, feel free to contact our support team at <span className="font-semibold text-slate-900">support@palettelens.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
};
