import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  HelpCircle,
  UserCheck,
  Shield,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
  Lock,
  UserPlus,
  LogIn,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    setShowHelpModal,
    setShowOnboarding,
    resetDemoData,
    setShowPrivacyModal,
    setAuthModal,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center shadow-md shadow-indigo-900/30">
            <span className="font-bold text-white text-lg tracking-wider">C</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">CASELINK</span>
              <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/60 flex items-center space-x-1">
                <Lock className="w-2.5 h-2.5" />
                <span>ZERO-KNOWLEDGE</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block leading-tight">
              เชื่อมโยงทุกข้อมูล ปราศจากการเก็บข้อมูลบนเครื่องแม่ข่าย
            </p>
          </div>
        </div>

        {/* Center / Role Switcher Demo Bar */}
        <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/80 text-xs">
          <span className="px-2 text-slate-400 font-medium">สลับมุมมอง:</span>
          <button
            onClick={() => switchRole('lawyer')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
              currentUser.role === 'lawyer'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>ทนายความ (ทนายสมชาย)</span>
          </button>
          <button
            onClick={() => switchRole('client')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
              currentUser.role === 'client'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>ลูกความ (นายสมชาย)</span>
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Zero-Knowledge Security Badge & Modal Trigger */}
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold transition cursor-pointer"
            title="ดูคำรับรองความปลอดภัย & นโยบายความเป็นส่วนตัว Zero-Knowledge"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">ความปลอดภัย: </span>
            <span>Zero-Knowledge</span>
          </button>

          {/* Quick role switcher for mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => switchRole(currentUser.role === 'lawyer' ? 'client' : 'lawyer')}
              className="text-xs px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-sky-300 cursor-pointer"
            >
              สลับเป็น: {currentUser.role === 'lawyer' ? 'ลูกความ' : 'ทนาย'}
            </button>
          </div>

          {/* Contextual Help Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            title="ความช่วยเหลือในหน้านี้ (?)"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center space-x-1 text-sm border border-transparent hover:border-slate-700 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline font-medium text-xs">ช่วยเหลือ</span>
          </button>

          {/* Reset Demo Data button */}
          <button
            onClick={resetDemoData}
            title="รีเซ็ตข้อมูลตัวอย่างทั้งหมด"
            className="hidden 2xl:flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>รีเซ็ต</span>
          </button>

          {/* User profile & Login/Register triggers */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-700/60">
            <button
              onClick={() => setAuthModal('login')}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition cursor-pointer hover:ring-2 hover:ring-indigo-400 ${
                currentUser.role === 'lawyer' ? 'bg-indigo-700 text-white' : 'bg-emerald-700 text-white'
              }`}
              title="คลิกเพื่อเข้าสู่ระบบหรือสลับบัญชี"
            >
              {currentUser.name.slice(0, 2)}
            </button>
            <div className="hidden sm:block text-left text-xs leading-tight">
              <div className="font-medium text-slate-200">{currentUser.name}</div>
              <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                <span>{currentUser.role === 'lawyer' ? 'ทนายความ' : 'ลูกความ'}</span>
                <span>•</span>
                <button
                  onClick={() => setAuthModal('login')}
                  className="text-sky-400 hover:underline cursor-pointer"
                >
                  สลับบัญชี
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

