import React from 'react';
import { FileText, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsOfServicePage: React.FC = () => {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200">
          <FileText className="w-3.5 h-3.5" />
          <span>Terms of Service</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms & Usage Guidelines</h1>
        <p className="text-sm text-slate-500">Effective Date: August 2026</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing PaletteLens, you agree to comply with these terms. PaletteLens provides genuine color extraction services for web development, brand identity design, and digital color analysis.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            2. Usage Allowance & Free Trial Limit
          </h2>
          <p>
            Guest users are permitted up to 3 free trial analyses. Beyond 3 free trials, user account registration is required to continue accessing palette extraction tools and history storage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Fair Use & Crawling Policies</h2>
          <p>
            When submitting website URLs, users must ensure they have permission to access the target domain. PaletteLens respects robots.txt and limits automated crawling depth to maintain web ethics.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Intellectual Property</h2>
          <p>
            Extracted color swatches, generated CSS root variables, and Tailwind configuration code belong entirely to you for use in personal or commercial projects.
          </p>
        </section>
      </div>
    </div>
  );
};
