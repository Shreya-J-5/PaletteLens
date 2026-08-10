import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Eye, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6 flex-1 flex flex-col justify-center">
      
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] hover:text-white transition-colors self-start"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Privacy & Data Handling
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF] font-normal">
          Designed with complete respect for your creative work and visual privacy.
        </p>
      </div>

      {/* Studio 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-[#16171B] border border-[#262830] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-[#8B5CF6]">
            <Lock className="w-4 h-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Your Designs Stay Yours</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            PaletteLens analyzes URLs, images, and PDFs solely to calculate genuine color values. We never store, distribute, or use your uploaded artwork for machine training.
          </p>
        </div>

        <div className="bg-[#16171B] border border-[#262830] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-[#EC4899]">
            <Eye className="w-4 h-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Minimal Account Data</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            We only save your email address when you sign up, enabling you to seamlessly view your past color extractions whenever you log back in.
          </p>
        </div>

        <div className="bg-[#16171B] border border-[#262830] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-[#10B981]">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Local Browser Security</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Free trial counters and active session states are managed securely within your browser. No invasive cross-site tracking or third-party ad scripts.
          </p>
        </div>

        <div className="bg-[#16171B] border border-[#262830] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-[#8B5CF6]">
            <Mail className="w-4 h-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Direct Studio Support</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Need your stored palette history or account details removed? Reach out directly to <span className="font-semibold text-white">privacy@palettelens.com</span>.
          </p>
        </div>

      </div>

    </div>
  );
};
