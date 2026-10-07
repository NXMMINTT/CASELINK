import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Home,
  Briefcase,
  Calendar,
  FileText,
  Users,
  HelpCircle,
  Settings,
  Plus,
  MessageSquare,
  Rocket,
  Smartphone,
  Zap,
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
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: Home },
    { id: 'cases', label: 'คดี', icon: Briefcase, badge: cases.length },
    {
      id: 'chat',
      label: 'แชทกับลูกความ',
      icon: MessageSquare,
      badge: unreadChatCount > 0 ? unreadChatCount : undefined,
      isAlert: unreadChatCount > 0,
    },
    { id: 'calendar', label: 'ปฏิทิน', icon: Calendar },
    { id: 'documents', label: 'เอกสาร', icon: FileText },
    { id: 'clients', label: 'ลูกความ', icon: Users },
    { id: 'line_bot', label: 'LINE แจ้งเตือน', icon: Smartphone },
    { id: 'roadmap', label: 'อัปเดตระบบ', icon: Rocket },
  ] as const;

  const secondaryClass =
    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition';

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col justify-between min-h-[calc(100vh-3.5rem)]">
      <div className="p-3 space-y-5">
        {onOpenCreateCase && (
          <button
            onClick={onOpenCreateCase}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md transition flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างคดีใหม่</span>
          </button>
        )}

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeLawyerNav === item.id;
            const isAlert = 'isAlert' in item && item.isAlert;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveLawyerNav(item.id);
                  if (item.id === 'cases') setIsViewingCaseDetail(false);
                  if (item.id === 'chat') setUnreadChatCount(0);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </span>
                {'badge' in item && item.badge !== undefined && (
                  <span
                    className={`min-w-5 text-center text-[11px] px-1.5 py-px rounded-full tabular-nums ${
                      isAlert
                        ? 'bg-blue-600 text-white'
                        : isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      <div className="p-3 border-t border-slate-200 space-y-0.5">
        <button onClick={() => setShowHelpModal(true)} className={secondaryClass}>
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>ช่วยเหลือ</span>
        </button>
        <button onClick={onOpenSettings} className={secondaryClass}>
          <Settings className="w-4 h-4 text-slate-400" />
          <span>ตั้งค่า</span>
        </button>
      </div>
    </aside>
  );
};
