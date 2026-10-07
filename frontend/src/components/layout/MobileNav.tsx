import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Home,
  Briefcase,
  Calendar,
  CheckSquare,
  FileText,
  MessageSquare,
  HelpCircle,
  Rocket,
  LucideIcon,
} from 'lucide-react';

interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<{ item: NavItem }> = ({ item }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={item.onClick}
      aria-current={item.active ? 'page' : undefined}
      className={`flex-1 flex flex-col items-center gap-1 py-2 text-[11px] transition ${
        item.active ? 'text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{item.label}</span>
    </button>
  );
};

export const MobileNav: React.FC = () => {
  const {
    currentUser,
    activeLawyerNav,
    setActiveLawyerNav,
    activeClientTab,
    setActiveClientTab,
    setShowHelpModal,
  } = useApp();

  const help: NavItem = {
    key: 'help',
    label: 'ช่วยเหลือ',
    icon: HelpCircle,
    active: false,
    onClick: () => setShowHelpModal(true),
  };

  const items: NavItem[] =
    currentUser.role === 'lawyer'
      ? [
          { key: 'dashboard', label: 'หน้าหลัก', icon: Home },
          { key: 'cases', label: 'คดี', icon: Briefcase },
          { key: 'calendar', label: 'นัดหมาย', icon: Calendar },
          { key: 'roadmap', label: 'อัปเดต', icon: Rocket },
        ]
          .map((i) => ({
            ...i,
            active: activeLawyerNav === i.key,
            onClick: () => setActiveLawyerNav(i.key as typeof activeLawyerNav),
          }))
          .concat(help)
      : [
          { key: 'overview', label: 'ภาพรวม', icon: Home },
          { key: 'todos', label: 'สิ่งที่ต้องทำ', icon: CheckSquare },
          { key: 'documents', label: 'เอกสาร', icon: FileText },
          { key: 'messages', label: 'ข้อความ', icon: MessageSquare },
        ]
          .map((i) => ({
            ...i,
            active: activeClientTab === i.key,
            onClick: () => setActiveClientTab(i.key as typeof activeClientTab),
          }))
          .concat(help);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex px-1 pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => (
        <NavButton key={item.key} item={item} />
      ))}
    </nav>
  );
};
