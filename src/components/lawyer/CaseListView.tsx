import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CaseItem } from '../../types.ts';
import {
  Search,
  Plus,
  Filter,
  Calendar,
  FileText,
  ArrowRight,
  Trash2,
  RotateCcw,
  Clock,
  CheckCircle,
  Gavel,
  Scale,
  Users,
  GitCommit,
  CheckSquare,
  Shield,
  Briefcase,
  Sparkles,
  AlertCircle,
  DollarSign,
  Award,
} from 'lucide-react';

interface CaseListViewProps {
  onOpenCreateCase: () => void;
}

// Category theme styling for legal categories
export const CASE_CATEGORY_THEMES: Record<
  string,
  {
    badge: string;
    border: string;
    accent: string;
    iconColor: string;
    lightBg: string;
  }
> = {
  คดีแพ่ง: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    border: 'border-blue-200/90 hover:border-blue-400',
    accent: 'bg-blue-600',
    iconColor: 'text-blue-600',
    lightBg: 'bg-blue-50/40',
  },
  คดีอาญา: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    border: 'border-rose-200/90 hover:border-rose-400',
    accent: 'bg-rose-600',
    iconColor: 'text-rose-600',
    lightBg: 'bg-rose-50/40',
  },
  คดีแรงงาน: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    border: 'border-amber-200/90 hover:border-amber-400',
    accent: 'bg-amber-500',
    iconColor: 'text-amber-600',
    lightBg: 'bg-amber-50/40',
  },
  คดีมรดก: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    border: 'border-emerald-200/90 hover:border-emerald-400',
    accent: 'bg-emerald-600',
    iconColor: 'text-emerald-600',
    lightBg: 'bg-emerald-50/40',
  },
  คดีครอบครัว: {
    badge: 'bg-teal-50 text-teal-800 border-teal-200',
    border: 'border-teal-200/90 hover:border-teal-400',
    accent: 'bg-teal-600',
    iconColor: 'text-teal-600',
    lightBg: 'bg-teal-50/40',
  },
  อื่นๆ: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    border: 'border-purple-200/90 hover:border-purple-400',
    accent: 'bg-purple-600',
    iconColor: 'text-purple-600',
    lightBg: 'bg-purple-50/40',
  },
};

export const CaseListView: React.FC<CaseListViewProps> = ({ onOpenCreateCase }) => {
  const {
    cases,
    deletedCases,
    restoreCase,
    permanentlyDeleteCase,
    clearAllTrash,
    setSelectedCaseId,
    setActiveCaseTab,
    setIsViewingCaseDetail,
    deleteCase,
    reopenCase,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'closed' | 'trash'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [caseToDeletePermanently, setCaseToDeletePermanently] = useState<string | null>(null);
  const [restoreSuccessNotice, setRestoreSuccessNotice] = useState<string | null>(null);

  // Active cases (กำลังทำ) vs Closed cases (ปิดคดีไปแล้ว)
  const activeCasesList = cases.filter((c) => c.status !== 'ปิดคดีแล้ว');
  const closedCasesList = cases.filter((c) => c.status === 'ปิดคดีแล้ว');

  // Filter Active Cases
  const filteredActiveCases = activeCasesList.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ทั้งหมด' ? true : c.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Filter Closed Cases
  const filteredClosedCases = closedCasesList.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courtVerdict?.verdictResult.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courtVerdict?.courtName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ทั้งหมด' ? true : c.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Filter Trash
  const filteredDeletedCases = deletedCases.filter((c) => {
    return (
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSelectCase = (caseId: string, tab: 'overview' | 'mindmap' | 'timeline' = 'overview') => {
    setSelectedCaseId(caseId);
    setIsViewingCaseDetail(true);
    setActiveCaseTab(tab);
  };

  const handleRestore = (caseId: string, caseTitle: string) => {
    restoreCase(caseId);
    setRestoreSuccessNotice(`กู้คืนคดี "${caseTitle}" กลับสู่รายการเรียบร้อยแล้ว`);
    setTimeout(() => {
      setRestoreSuccessNotice(null);
    }, 4000);
  };

  const handleConfirmPermanentDelete = () => {
    if (caseToDeletePermanently) {
      permanentlyDeleteCase(caseToDeletePermanently);
      setCaseToDeletePermanently(null);
    }
  };

  const availableCategories = ['ทั้งหมด', 'คดีแพ่ง', 'คดีอาญา', 'คดีแรงงาน', 'คดีมรดก', 'คดีครอบครัว'];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Toast Notice for Restore */}
      {restoreSuccessNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-sm shadow-xs animate-in slide-in-from-top-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{restoreSuccessNotice}</span>
          </div>
          <button
            onClick={() => setActiveTab('active')}
            className="text-xs font-bold text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
          >
            เปิดดูคดีทันที
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4" />
              <span>CASE MANAGEMENT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              คดีความของฉัน
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              แยกส่วนคดีที่กำลังดำเนินการ และคดีที่ปิดแล้วอย่างชัดเจน พร้อมระบบเชื่อมโยงพยานหลักฐาน
            </p>
          </div>

          <button
            onClick={onOpenCreateCase}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-2xl shadow-xs hover:shadow-md transition text-xs sm:text-sm cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ สร้างคดีใหม่</span>
          </button>
        </div>

        {/* KPI Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div
            onClick={() => setActiveTab('active')}
            className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200/70 transition cursor-pointer"
          >
            <span className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
              <span>คดีทั้งหมด</span>
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block">
              {cases.length}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('active')}
            className="bg-blue-50/60 hover:bg-blue-50 p-3.5 rounded-2xl border border-blue-200/70 transition cursor-pointer"
          >
            <span className="text-[11px] font-bold text-blue-700 flex items-center justify-between">
              <span>กำลังทำ (Active)</span>
              <Clock className="w-3.5 h-3.5 text-blue-500" />
            </span>
            <span className="text-xl sm:text-2xl font-bold text-blue-900 mt-1 block">
              {activeCasesList.length}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('closed')}
            className="bg-emerald-50/60 hover:bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200/70 transition cursor-pointer"
          >
            <span className="text-[11px] font-bold text-emerald-800 flex items-center justify-between">
              <span>ปิดคดีไปแล้ว</span>
              <Gavel className="w-3.5 h-3.5 text-emerald-600" />
            </span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-950 mt-1 block">
              {closedCasesList.length}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('trash')}
            className="bg-rose-50/40 hover:bg-rose-50 p-3.5 rounded-2xl border border-rose-200/60 transition cursor-pointer"
          >
            <span className="text-[11px] font-bold text-rose-700 flex items-center justify-between">
              <span>ถังขยะ / กู้คืน</span>
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            </span>
            <span className="text-xl sm:text-2xl font-bold text-rose-900 mt-1 block">
              {deletedCases.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs: กำลังทำ vs ปิดคดีไปแล้ว vs ถังขยะ */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-1 sm:pb-0 text-xs sm:text-sm">
          {/* Tab 1: กำลังทำ */}
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2.5 rounded-2xl font-bold transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>คดีที่กำลังดำเนินการ</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                activeTab === 'active' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {activeCasesList.length}
            </span>
          </button>

          {/* Tab 2: ปิดคดีไปแล้ว */}
          <button
            onClick={() => setActiveTab('closed')}
            className={`px-4 py-2.5 rounded-2xl font-bold transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'closed'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <Gavel className="w-4 h-4" />
            <span>คดีที่ปิดแล้ว (มีคำสั่งศาล)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                activeTab === 'closed' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {closedCasesList.length}
            </span>
          </button>

          {/* Tab 3: ถังขยะ */}
          <button
            onClick={() => setActiveTab('trash')}
            className={`px-3.5 py-2.5 rounded-2xl font-bold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'trash'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-white text-slate-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ถังขยะ</span>
            {deletedCases.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  activeTab === 'trash' ? 'bg-rose-900 text-white' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {deletedCases.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === 'active'
                ? 'ค้นหาชื่อคดี, ลูกความ, ป.พ.พ....'
                : activeTab === 'closed'
                ? 'ค้นหาคำสั่งศาล, หมายเลขแดง...'
                : 'ค้นหาคดีในถังขยะ...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category Filter Pills (Use signature colors for each category) */}
      {activeTab !== 'trash' && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] flex-shrink-0 flex items-center space-x-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>แยกหมวดหมู่:</span>
          </span>
          {availableCategories.map((cat) => {
            const isSel = selectedCategory === cat;
            const theme = CASE_CATEGORY_THEMES[cat];

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex-shrink-0 border flex items-center space-x-1.5 ${
                  isSel
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : theme
                    ? `${theme.badge} hover:shadow-2xs`
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {theme && <span className={`w-2 h-2 rounded-full ${theme.accent}`} />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION A: คดีที่กำลังดำเนินการ (ACTIVE CASES) */}
      {/* ============================================================== */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {filteredActiveCases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActiveCases.map((c) => {
                const theme = CASE_CATEGORY_THEMES[c.type] || CASE_CATEGORY_THEMES['อื่นๆ'];

                return (
                  <div
                    key={c.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-md relative overflow-hidden group ${theme.border}`}
                  >
                    {/* Category Accent Stripe on Top */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.accent}`} />

                    <div className="space-y-3 pt-1">
                      {/* Category Badge & Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                          {c.type}
                        </span>

                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 flex items-center space-x-1">
                          <span>🟡</span>
                          <span>{c.status}</span>
                        </span>
                      </div>

                      {/* Title & Client */}
                      <div
                        onClick={() => handleSelectCase(c.id, 'overview')}
                        className="cursor-pointer group-hover:text-indigo-600 transition"
                      >
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 leading-snug">
                          {c.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>ลูกความ: <strong className="text-slate-700">{c.clientName}</strong></span>
                        </p>
                      </div>

                      {/* Description snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>

                      {/* Deadline Tag */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
                        <span className="flex items-center space-x-1.5 text-slate-600 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          <span>กำหนดนัดศาล / วันสำคัญ:</span>
                        </span>
                        <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {c.deadline}
                        </span>
                      </div>

                      {/* Counts Meta Chips */}
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{c.events.length} เหตุการณ์</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <FileText className="w-3 h-3 text-slate-400" />
                          <span>{c.documents.length} เอกสาร</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <CheckSquare className="w-3 h-3 text-slate-400" />
                          <span>
                            {c.checklist.filter((i) => i.status === 'ตรวจแล้ว').length}/{c.checklist.length} เช็คลิสต์
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectCase(c.id, 'mindmap')}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer flex items-center space-x-1"
                        >
                          <GitCommit className="w-3.5 h-3.5" />
                          <span>Mind Map</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectCase(c.id, 'timeline')}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer flex items-center space-x-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Timeline</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => deleteCase(c.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="ย้ายไปถังขยะ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectCase(c.id, 'overview')}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-2xs cursor-pointer"
                        >
                          <span>เปิดดูแฟ้ม</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <Clock className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">ไม่พบคดีที่กำลังดำเนินการ</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery || selectedCategory !== 'ทั้งหมด'
                  ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรองหมวดหมู่คดี'
                  : 'เริ่มต้นเปิดแฟ้มคดีใหม่เพื่อจัดระเบียบข้อมูลและหลักฐาน'}
              </p>
              <button
                type="button"
                onClick={onOpenCreateCase}
                className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ สร้างคดีใหม่</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION B: คดีที่ปิดแล้ว (CLOSED CASES) */}
      {/* ============================================================== */}
      {activeTab === 'closed' && (
        <div className="space-y-4">
          {filteredClosedCases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClosedCases.map((c) => {
                const theme = CASE_CATEGORY_THEMES[c.type] || CASE_CATEGORY_THEMES['อื่นๆ'];

                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl border border-emerald-200/90 transition-all duration-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-md relative overflow-hidden group hover:border-emerald-400"
                  >
                    {/* Top Green Accent Stripe */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600" />

                    <div className="space-y-3 pt-1">
                      {/* Category Badge & Verdict Result Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                          {c.type}
                        </span>

                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center space-x-1 shadow-2xs">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>{c.courtVerdict?.verdictResult || 'ปิดคดีแล้ว'}</span>
                        </span>
                      </div>

                      {/* Title & Client */}
                      <div
                        onClick={() => handleSelectCase(c.id, 'overview')}
                        className="cursor-pointer group-hover:text-emerald-700 transition"
                      >
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 leading-snug">
                          {c.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>ลูกความ: <strong className="text-slate-700">{c.clientName}</strong></span>
                        </p>
                      </div>

                      {/* Court Verdict Box */}
                      {c.courtVerdict && (
                        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-1.5 text-xs text-slate-700">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-emerald-900 flex items-center space-x-1">
                              <Gavel className="w-3 h-3 text-emerald-700" />
                              <span>{c.courtVerdict.courtName || 'ศาล'}</span>
                            </span>
                            {c.courtVerdict.redCaseNumber && (
                              <span className="font-mono text-[10px] bg-white px-1.5 py-0.2 rounded border border-emerald-200 text-emerald-800 font-bold">
                                {c.courtVerdict.redCaseNumber}
                              </span>
                            )}
                          </div>
                          <p className="text-xs leading-relaxed text-slate-700 line-clamp-2">
                            {c.courtVerdict.details}
                          </p>
                          {c.courtVerdict.compensationAmount && (
                            <div className="pt-1 flex items-center space-x-1 font-bold text-emerald-800 text-[11px]">
                              <DollarSign className="w-3 h-3 text-emerald-600" />
                              <span>ยอดเงินชดเชย: {c.courtVerdict.compensationAmount}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Post-Case Learning Indicator */}
                      {c.postCaseLearning && (
                        <div className="p-2 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 flex items-center space-x-1.5 font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                          <span className="truncate">มีบทเรียนสังเคราะห์หลังจบคดีด้วย AI แล้ว</span>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => reopenCase(c.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer flex items-center space-x-1"
                        title="เปิดคดีใหม่ / คืนสถานะดำเนินการ"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>เปิดคดีใหม่</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectCase(c.id, 'overview')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-2xs cursor-pointer"
                      >
                        <span>ดูคำสั่งศาล & แฟ้มคดี</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <Gavel className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">ยังไม่มีคดีที่ปิดแล้ว</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                เมื่อคดีใดมีคำสั่งศาล คำพิพากษา หรือยอมความสำเร็จ ท่านสามารถกดปุ่ม "ปิดคดีนี้" ในหน้าแฟ้มคดีเพื่อย้ายมาที่นี่
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION C: ถังขยะ / กู้คืน (TRASH & RECOVERY) */}
      {/* ============================================================== */}
      {activeTab === 'trash' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-rose-50 p-4 rounded-2xl border border-rose-200 text-rose-900 text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>
                คดีในถังขยะจะไม่แสดงในรายการทำงาน แต่ท่านสามารถกด <strong>"กู้คืนคดี"</strong> กลับมาได้ตลอดเวลา
              </span>
            </div>
            {deletedCases.length > 0 && (
              <button
                type="button"
                onClick={clearAllTrash}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition cursor-pointer flex-shrink-0 ml-3"
              >
                ล้างถังขยะทั้งหมด
              </button>
            )}
          </div>

          {filteredDeletedCases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDeletedCases.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-rose-200 p-5 flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {c.type}
                      </span>
                      <span className="text-[10px] text-rose-600 font-mono">
                        ย้ายลงถังขยะเมื่อ: {c.deletedAt ? new Date(c.deletedAt).toLocaleDateString('th-TH') : '-'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-800">{c.title}</h3>
                    <p className="text-xs text-slate-500">ลูกความ: {c.clientName}</p>
                    <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCaseToDeletePermanently(c.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 font-medium cursor-pointer"
                    >
                      ลบถาวร
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRestore(c.id, c.title)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>กู้คืนคดี</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
              <Trash2 className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">ถังขยะว่างเปล่า</h3>
              <p className="text-xs text-slate-400">ไม่มีคดีที่ถูกลบอยู่ในถังขยะ</p>
            </div>
          )}
        </div>
      )}

      {/* Permanent Delete Modal */}
      {caseToDeletePermanently && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-6 text-slate-800 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2 bg-rose-100 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">ลบคดีนี้ถาวร?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              การลบถาวรจะไม่สามารถกู้คืนข้อมูลพยานหลักฐานและข้อเท็จจริงในคดีนี้ได้อีก
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setCaseToDeletePermanently(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmPermanentDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                ยืนยันลบถาวร
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
