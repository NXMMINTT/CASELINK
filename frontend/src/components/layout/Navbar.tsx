import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { HelpCircle, Info, LogOut, Scale } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    setShowHelpModal,
    setShowPrivacyModal,
    logoutUser,
  } = useApp();

  const isLawyer = currentUser.role === 'lawyer';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-slate-900">CASELINK</span>
          <span className="hidden lg:inline text-xs text-slate-400 border-l border-slate-200 pl-2.5 ml-0.5 truncate">
            Thai Legal Workspace
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowPrivacyModal(true)}
            title="ความเป็นส่วนตัวและข้อจำกัดของระบบ"
            className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowHelpModal(true)}
            title="ช่วยเหลือ"
            className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5 pl-3 ml-2 border-l border-slate-200">
            <div
              className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-semibold text-xs"
              title={isLawyer ? 'ทนายความ' : 'ลูกความ'}
            >
              {currentUser.name.slice(0, 2)}
            </div>
            <div className="hidden sm:block text-xs leading-tight">
              <div className="font-medium text-slate-900">{currentUser.name}</div>
              <div className="text-slate-500">{isLawyer ? 'ทนายความ' : 'ลูกความ'}</div>
            </div>
            <button
              onClick={logoutUser}
              title="ออกจากระบบ"
              className="p-2 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
