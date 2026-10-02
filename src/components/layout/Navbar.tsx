import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  HelpCircle,
  UserCheck,
  Shield,
  RotateCcw,
  Scale,
  Info,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    setShowHelpModal,
    resetDemoData,
    setShowPrivacyModal,
    logoutUser,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo exactly matching Image 1 */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-950/40 text-white flex-shrink-0">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">CASELINK</span>
              <span className="text-xs font-normal text-indigo-300 bg-indigo-950/80 border border-indigo-700/60 px-2 py-0.5 rounded-full">
                Thai Legal Workspace
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block leading-tight mt-0.5">
              ระบบแฟ้มคดีความ & ผู้ช่วยสื่อสารลูกความอัจฉริยะสำหรับทนายความไทย
            </p>
          </div>
        </div>

        {/* Center / Role Switcher Demo Bar */}
        <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/80 text-xs">
          <span className="px-2 text-slate-400 font-medium">สลับมุมมองเดโม:</span>
          <button
            onClick={() => switchRole('lawyer')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
              currentUser.role === 'lawyer'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>ทนายความ (ตัวอย่าง)</span>
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
            <span>ลูกความ (ตัวอย่าง)</span>
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Demo Limitation & Privacy Notice Trigger */}
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
            title="ดูคำชี้แจงความเป็นส่วนตัวและข้อจำกัดของระบบเดโม"
          >
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">ข้อจำกัดเดโม</span>
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
            title="คู่มือการใช้งานเดโม (?)"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center space-x-1 text-sm border border-transparent hover:border-slate-700 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline font-medium text-xs">ช่วยเหลือ</span>
          </button>

          {/* Reset Demo Data button */}
          <button
            onClick={resetDemoData}
            title="รีเซ็ตข้อมูลตัวอย่างทั้งหมดเป็นค่าเริ่มต้น"
            className="hidden lg:flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>รีเซ็ตเดโม</span>
          </button>

          {/* User profile & Logout */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-700/60">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${
                currentUser.role === 'lawyer' ? 'bg-indigo-700 text-white' : 'bg-emerald-700 text-white'
              }`}
              title={`บทบาทปัจจุบัน: ${currentUser.role === 'lawyer' ? 'ทนายความ' : 'ลูกความ'}`}
            >
              {currentUser.name.slice(0, 2)}
            </div>
            <div className="hidden sm:block text-left text-xs leading-tight">
              <div className="font-medium text-slate-200">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400">
                {currentUser.role === 'lawyer' ? 'ทนายความ (เดโม)' : 'ลูกความ (เดโม)'}
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              onClick={logoutUser}
              title="ออกจากระบบเดโม — กลับสู่หน้าเลือกบทบาท"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer flex items-center space-x-1 ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-xs">ออก</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

