import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { UserRole } from '../../types.ts';
import { X, Briefcase, User, Info, RotateCcw } from 'lucide-react';

export const AuthModals: React.FC = () => {
  const {
    authModal,
    setAuthModal,
    switchRole,
    resetDemoData,
    setShowPrivacyModal,
    currentUser,
  } = useApp();

  if (!authModal) return null;

  const handleSelectRole = (role: UserRole) => {
    switchRole(role);
    setAuthModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden text-slate-100 p-6 relative">
        <button
          onClick={() => setAuthModal(null)}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-left mb-5">
          <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-2 py-0.5 rounded-full">
            สลับบทบาทเดโม
          </span>
          <h3 className="text-xl font-bold text-white mt-2">
            เลือกมุมมองการใช้งานเดโม
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            ระบบนี้เป็นเดโม static บน GitHub Pages ไม่มีการเก็บรหัสผ่านหรือยืนยันตัวตนจริง คุณสามารถสลับมุมมองเพื่อทดลองฟังก์ชันได้ทันที
          </p>
        </div>

        <div className="space-y-3">
          {/* Lawyer Choice */}
          <button
            onClick={() => handleSelectRole('lawyer')}
            className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-center space-x-3.5 ${
              currentUser.role === 'lawyer'
                ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">มุมมอง: ทนายความ</span>
                {currentUser.role === 'lawyer' && (
                  <span className="text-[10px] text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-800">
                    กำลังใช้งาน
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ทนายสมชาย รัตนกุล — แฟ้มคดี, ผัง Mind Map, เตรียมตัวว่าความ
              </p>
            </div>
          </button>

          {/* Client Choice */}
          <button
            onClick={() => handleSelectRole('client')}
            className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-center space-x-3.5 ${
              currentUser.role === 'client'
                ? 'bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">มุมมอง: ลูกความ</span>
                {currentUser.role === 'client' && (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                    กำลังใช้งาน
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                นายสมชาย มั่นคง — ตรวจสอบสถานะคดี, รายการเอกสารที่ต้องส่ง
              </p>
            </div>
          </button>
        </div>

        {/* Footer info & Reset */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => {
              resetDemoData();
              setAuthModal(null);
            }}
            className="text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่าข้อมูลเดโม</span>
          </button>

          <button
            onClick={() => {
              setAuthModal(null);
              setShowPrivacyModal(true);
            }}
            className="text-indigo-400 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>ข้อจำกัดเดโม</span>
          </button>
        </div>
      </div>
    </div>
  );
};
