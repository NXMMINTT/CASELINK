import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Home,
  Briefcase,
  Calendar,
  FileText,
  Users,
  HelpCircle,
  Settings,
  User,
  Plus,
  MessageSquare,
  Zap,
  Rocket,
  Smartphone,
  CheckCircle2,
  Circle,
  Trash2,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SidebarProps {
  onOpenCreateCase?: () => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreateCase, onOpenSettings }) => {
  const {
    activeLawyerNav,
    setActiveLawyerNav,
    setIsViewingCaseDetail,
    setShowHelpModal,
    cases,
    currentCase,
    unreadChatCount,
    setUnreadChatCount,
    simulateClientMessage,
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: Home },
    { id: 'cases', label: 'คดี', icon: Briefcase, badge: cases.length },
    {
      id: 'chat',
      label: 'แชทกับลูกความ',
      icon: MessageSquare,
      badge: unreadChatCount > 0 ? `${unreadChatCount} ใหม่` : undefined,
      isAlert: unreadChatCount > 0,
    },
    { id: 'calendar', label: 'ปฏิทิน', icon: Calendar },
    { id: 'documents', label: 'เอกสาร', icon: FileText },
    { id: 'clients', label: 'ลูกความ', icon: Users },
    {
      id: 'line_bot',
      label: 'ระบบ LINE แจ้งเตือน',
      icon: Smartphone,
      badge: 'LINE OA',
      isLineBrand: true,
    },
    {
      id: 'roadmap',
      label: 'สิ่งที่เว็บจะอัปเดต',
      icon: Rocket,
    },
  ] as const;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Quick Action Button */}
        {onOpenCreateCase && (
          <button
            onClick={onOpenCreateCase}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ สร้างคดีใหม่</span>
          </button>
        )}

        {/* Primary Navigation - Section 8 exact items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeLawyerNav === item.id;
            const isAlert = 'isAlert' in item && item.isAlert;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveLawyerNav(item.id);
                  if (item.id === 'cases') {
                    setIsViewingCaseDetail(false);
                  }
                  if (item.id === 'chat') {
                    setUnreadChatCount(0);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer relative ${
                  isActive
                    ? 'bg-slate-800 text-sky-400 font-semibold shadow-sm'
                    : isAlert
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/50'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-sky-400' : isAlert ? 'text-emerald-400 animate-bounce' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {'badge' in item && item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center space-x-1 ${
                      isAlert
                        ? 'bg-emerald-500 text-white animate-pulse shadow-sm'
                        : 'isLineBrand' in item && item.isLineBrand
                        ? 'bg-[#06C755] text-white shadow-xs'
                        : isActive
                        ? 'bg-sky-950 text-sky-300 border border-sky-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isAlert && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-1" />}
                    <span>{item.badge}</span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Simulator Widget for Lawyer Testing */}
        {currentCase && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => simulateClientMessage(currentCase.id)}
              className="w-full text-left p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 transition flex items-center space-x-2 group cursor-pointer"
              title="ทดสอบลูกความพิมพ์ถามมา เพื่อตรวจดูการแจ้งเตือน"
            >
              <div className="p-1 rounded-lg bg-emerald-900/60 text-emerald-400 group-hover:scale-110 transition">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-slate-200">ทดสอบแจ้งเตือนแชท</div>
                <div className="text-[10px] text-slate-400 truncate">จำลองลูกความส่งคำถาม</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Section - Section 8: ช่วยเหลือ / ตั้งค่า / โปรไฟล์ */}
      <div className="p-4 border-t border-slate-800/80 space-y-1">
        <button
          onClick={() => setShowHelpModal(true)}
          className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>ช่วยเหลือ</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>ตั้งค่า</span>
        </button>
        <div className="pt-2 mt-2 border-t border-slate-800/50 flex items-center justify-between px-2 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span className="font-medium text-slate-300">ทนายสมชาย</span>
          </div>
          <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800">ทนาย</span>
        </div>
      </div>
    </aside>
  );
};
