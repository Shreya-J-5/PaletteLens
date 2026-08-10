import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Eye, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6 flex-1 flex flex-col justify-center">
      
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666A73] hover:text-[#111318] transition-colors self-start"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
          Privacy & Data Handling
        </h1>
        <p className="text-xs sm:text-sm text-[#666A73] font-normal">
          Designed with complete respect for your creative work and visual privacy.
        </p>
      </div>

      {/* Studio 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-white border border-[#DCDDD9] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#1677FF]">
            <Lock className="w-4 h-4" />
            <h3 className="text-xs font-bold text-[#111318] uppercase tracking-wider">Your Designs Stay Yours</h3>
          </div>
          <p className="text-xs text-[#666A73] leading-relaxed">
            PaletteLens analyzes URLs, images, and PDFs solely to calculate genuine color values. We never store, distribute, or use your uploaded artwork for machine training.
          </p>
        </div>

        <div className="bg-white border border-[#DCDDD9] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#111318]">
            <Eye className="w-4 h-4 text-[#1677FF]" />
            <h3 className="text-xs font-bold text-[#111318] uppercase tracking-wider">Minimal Account Data</h3>
          </div>
          <p className="text-xs text-[#666A73] leading-relaxed">
            We only save your email address when you sign up, enabling you to seamlessly view your past color extractions whenever you log back in.
          </p>
        </div>

        <div className="bg-white border border-[#DCDDD9] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#111318]">
            <ShieldCheck className="w-4 h-4 text-[#1677FF]" />
            <h3 className="text-xs font-bold text-[#111318] uppercase tracking-wider">Local Browser Security</h3>
          </div>
          <p className="text-xs text-[#666A73] leading-relaxed">
            Free trial counters and active session states are managed securely within your browser. No invasive cross-site tracking or third-party ad scripts.
          </p>
        </div>

        <div className="bg-white border border-[#DCDDD9] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#111318]">
            <Mail className="w-4 h-4 text-[#1677FF]" />
            <h3 className="text-xs font-bold text-[#111318] uppercase tracking-wider">Direct Studio Support</h3>
          </div>
          <p className="text-xs text-[#666A73] leading-relaxed">
            Need your stored palette history or account details removed? Reach out directly to <span className="font-semibold text-[#111318]">privacy@palettelens.com</span>.
          </p>
        </div>

      </div>

    </div>
  );
};
