import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

interface ProgressStepperProps {
  currentStep?: string | null;
  status: string;
  sourceType: string;
}

const STEPS = [
  "Source validated",
  "Content loaded",
  "Visual content processed",
  "Colours detected",
  "Palette generated",
  "Results saved"
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, status, sourceType }) => {
  const getStepStatus = (stepName: string) => {
    if (status === 'completed') return 'completed';
    if (status === 'failed') return 'failed';

    const curIndex = currentStep ? STEPS.findIndex(s => currentStep.toLowerCase().includes(s.toLowerCase())) : 0;
    const stepIndex = STEPS.indexOf(stepName);

    if (stepIndex < curIndex) return 'completed';
    if (stepIndex === curIndex) return 'in_progress';
    return 'pending';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 capitalize">Analyzing {sourceType}...</h3>
          <p className="text-xs text-slate-500">Real-time processing pipeline</p>
        </div>
      </div>

      <div className="space-y-4">
        {STEPS.map((step) => {
          const stepState = getStepStatus(step);

          return (
            <div key={step} className="flex items-center gap-3">
              {stepState === 'completed' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              )}
              {stepState === 'in_progress' && (
                <Loader2 className="w-5 h-5 text-sky-600 animate-spin flex-shrink-0" />
              )}
              {stepState === 'pending' && (
                <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
              )}
              {stepState === 'failed' && (
                <Circle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}

              <span
                className={`text-sm font-medium ${
                  stepState === 'completed'
                    ? 'text-slate-900 font-semibold'
                    : stepState === 'in_progress'
                    ? 'text-sky-600 font-semibold'
                    : 'text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
