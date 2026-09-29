import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { HelpCircle, UserCheck, Shield, ChevronDown, RotateCcw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    setShowHelpModal,
    setShowOnboarding,
    resetDemoData,
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
              <span className="text-[11px] font-medium bg-slate-800 text-sky-400 px-2 py-0.5 rounded border border-slate-700">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block leading-tight">
              เชื่อมโยงทุกข้อมูล ให้เห็นภาพรวมของคดี
            </p>
          </div>
        </div>

        {/* Center / Role Switcher Demo Bar */}
        <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/80 text-xs">
          <span className="px-2 text-slate-400 font-medium">สลับมุมมองทดสอบ:</span>
          <button
            onClick={() => switchRole('lawyer')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center space-x-1.5 ${
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
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center space-x-1.5 ${
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
          {/* Quick role switcher for mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => switchRole(currentUser.role === 'lawyer' ? 'client' : 'lawyer')}
              className="text-xs px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-sky-300"
            >
              สลับเป็น: {currentUser.role === 'lawyer' ? 'ลูกความ' : 'ทนาย'}
            </button>
          </div>

          {/* Contextual Help Button (Section 6: Always accessible) */}
          <button
            onClick={() => setShowHelpModal(true)}
            title="ความช่วยเหลือในหน้านี้ (?)"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center space-x-1 text-sm border border-transparent hover:border-slate-700"
          >
            <HelpCircle className="w-5 h-5 text-sky-400" />
            <span className="hidden sm:inline font-medium text-xs">ช่วยเหลือ</span>
          </button>

          {/* Tutorial restart */}
          <button
            onClick={() => setShowOnboarding(true)}
            className="hidden lg:flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800"
            title="ดูคำแนะนำการใช้งานเบื้องต้น"
          >
            <span>คำแนะนำ</span>
          </button>

          {/* Reset Demo Data button */}
          <button
            onClick={resetDemoData}
            title="รีเซ็ตข้อมูลตัวอย่างทั้งหมด"
            className="hidden xl:flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded hover:bg-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            <span>รีเซ็ตเดโม</span>
          </button>

          {/* User badge */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-700/60">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${
              currentUser.role === 'lawyer' ? 'bg-indigo-700 text-white' : 'bg-emerald-700 text-white'
            }`}>
              {currentUser.name.slice(0, 2)}
            </div>
            <div className="hidden sm:block text-left text-xs leading-tight">
              <div className="font-medium text-slate-200">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400">
                {currentUser.role === 'lawyer' ? 'ทนายความ' : 'ลูกความ'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
