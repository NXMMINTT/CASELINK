import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Home, Briefcase, FileText, CheckSquare, MessageSquare, HelpCircle, Rocket } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    currentUser,
    activeLawyerNav,
    setActiveLawyerNav,
    activeClientTab,
    setActiveClientTab,
    setShowHelpModal,
  } = useApp();

  if (currentUser.role === 'lawyer') {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 py-2 shadow-lg">
        <button
          onClick={() => setActiveLawyerNav('dashboard')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            activeLawyerNav === 'dashboard' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>หน้าหลัก</span>
        </button>

        <button
          onClick={() => setActiveLawyerNav('cases')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            activeLawyerNav === 'cases' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4 mb-0.5" />
          <span>คดี</span>
        </button>

        <button
          onClick={() => setActiveLawyerNav('roadmap')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            activeLawyerNav === 'roadmap' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Rocket className="w-4 h-4 mb-0.5" />
          <span>เว็บอัปเดต</span>
        </button>

        <button
          onClick={() => setActiveLawyerNav('calendar')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            activeLawyerNav === 'calendar' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>นัดหมาย</span>
        </button>

        <button
          onClick={() => setShowHelpModal(true)}
          className="flex flex-col items-center py-1 px-2 text-[10px] font-medium text-slate-400 hover:text-white"
        >
          <HelpCircle className="w-4 h-4 mb-0.5 text-sky-400" />
          <span>ช่วยเหลือ</span>
        </button>
      </nav>
    );
  }

  // Client bottom navigation
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 py-2 shadow-lg">
      <button
        onClick={() => setActiveClientTab('overview')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
          activeClientTab === 'overview' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span>ภาพรวม</span>
      </button>

      <button
        onClick={() => setActiveClientTab('todos')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
          activeClientTab === 'todos' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <CheckSquare className="w-4 h-4 mb-0.5" />
        <span>สิ่งที่ต้องทำ</span>
      </button>

      <button
        onClick={() => setActiveClientTab('documents')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
          activeClientTab === 'documents' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <FileText className="w-4 h-4 mb-0.5" />
        <span>เอกสาร</span>
      </button>

      <button
        onClick={() => setActiveClientTab('messages')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
          activeClientTab === 'messages' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <MessageSquare className="w-4 h-4 mb-0.5" />
        <span>ข้อความ</span>
      </button>

      <button
        onClick={() => setShowHelpModal(true)}
        className="flex flex-col items-center py-1 px-2 text-[10px] font-medium text-slate-400 hover:text-white"
      >
        <HelpCircle className="w-4 h-4 mb-0.5 text-sky-400" />
        <span>ช่วยเหลือ</span>
      </button>
    </nav>
  );
};
