import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, Globe2, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsOfServicePage: React.FC = () => {
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
          Terms & Usage Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF] font-normal">
          Simple, transparent guidelines created for designers and developers.
        </p>
      </div>

      {/* Studio 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-[#16171B] border border-[#262830] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-[#8B5CF6]">
            <Palette className="w-4 h-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Built for Creative Work</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            PaletteLens provides genuine visual color extraction tools for designers, studios, and engineers to discover production colors without manual eye-dropping.
          </p>
        </div>

        <div className="bg-[#16171B] border border-[#262830] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-[#EC4899]">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">3 Free Trials & Account Access</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Guests receive 3 free color analyses. Beyond 3 trials, create a free account or log in to unlock unlimited palette extractions and personal history.
          </p>
        </div>

        <div className="bg-[#16171B] border border-[#262830] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-[#10B981]">
            <Globe2 className="w-4 h-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Respectful Web Analysis</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            When submitting website URLs, ensure you have permission to view the public site. PaletteLens crawls internal pages politely with rate-limiting.
          </p>
        </div>

        <div className="bg-[#16171B] border border-[#262830] rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-[#8B5CF6]">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Full Palette Ownership</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            All exported CSS custom variables, Tailwind configurations, JSON structures, and color swatches are 100% yours to use in personal or commercial projects.
          </p>
        </div>

      </div>

    </div>
  );
};
