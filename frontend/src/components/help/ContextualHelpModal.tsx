import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { getContextualHelp } from '../../utils/helpContent.ts';
import { HelpCircle, X, CheckCircle2 } from 'lucide-react';

export const ContextualHelpModal: React.FC = () => {
  const {
    showHelpModal,
    setShowHelpModal,
    currentUser,
    activeLawyerNav,
    activeCaseTab,
  } = useApp();

  if (!showHelpModal) return null;

  const help = getContextualHelp(
    currentUser.role,
    activeLawyerNav,
    activeCaseTab
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-lg border border-slate-200 overflow-hidden text-slate-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {help.title}
              </h3>
              <p className="text-xs text-slate-500">{help.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setShowHelpModal(false)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            {help.description}
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              ข้อแนะนำในหน้านี้
            </h4>
            <div className="space-y-2">
              {help.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setShowHelpModal(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-xl transition cursor-pointer"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
};
