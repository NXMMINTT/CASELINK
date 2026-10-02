import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Plus,
  ArrowRight,
  FileCheck2,
  Calendar,
  Clock,
  Briefcase,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  FolderOpen,
  Info,
} from 'lucide-react';
import {
  parseThaiDateString,
  getDaysDifferenceFromToday,
  formatRelativeDaysBadge,
  THAI_MONTHS_FULL,
} from '../../utils/dateUtils.ts';

interface LawyerDashboardProps {
  onOpenCreateCase: () => void;
}

export const LawyerDashboard: React.FC<LawyerDashboardProps> = ({ onOpenCreateCase }) => {
  const {
    cases,
    setSelectedCaseId,
    setActiveLawyerNav,
    setActiveCaseTab,
    setIsViewingCaseDetail,
    setShowPrivacyModal,
    currentUser,
  } = useApp();

  const demoCase = cases.find((c) => c.id === 'case-abc-001') || cases[0];

  const handleOpenCase = (
    caseId: string,
    tab: 'overview' | 'mindmap' | 'documents' | 'checklist' | 'timeline' = 'overview'
  ) => {
    setSelectedCaseId(caseId);
    setIsViewingCaseDetail(true);
    setActiveLawyerNav('cases');
    setActiveCaseTab(tab);
  };

  // Compute summary numbers
  const totalPendingDocs = cases.reduce(
    (acc, c) => acc + c.documents.filter((d) => d.status === 'กำลังตรวจ' || d.status === 'ส่งแล้ว').length,
    0
  );

  // Find upcoming deadlines dynamically across all active cases
  const allDeadlines = useMemo(() => {
    return cases
      .filter((c) => c.status !== 'ปิดคดีแล้ว')
      .flatMap((c) =>
        (c.deadlines || []).map((dl) => {
          const parsed = parseThaiDateString(dl.dueDate);
          const diff = parsed ? getDaysDifferenceFromToday(parsed) : 999;
          return {
            ...dl,
            caseTitle: c.title,
            caseId: c.id,
            parsed,
            diff,
          };
        })
      )
      .sort((a, b) => a.diff - b.diff);
  }, [cases]);

  const nextDeadline = allDeadlines[0] || null;

  // Urgent pending checklist items
  const urgentChecklistItems = useMemo(() => {
    return cases
      .flatMap((c) =>
        (c.checklist || [])
          .filter((item) => item.status === 'กำลังตรวจ' || item.status === 'ยังไม่ได้ส่ง')
          .map((item) => ({ ...item, caseTitle: c.title, caseId: c.id }))
      )
      .slice(0, 2);
  }, [cases]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* 1. Header: Typographic Hierarchy & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              ศูนย์รวมสำนวนคดีและการเตรียมตัวว่าความ
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">
              {new Date().toLocaleDateString('th-TH', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            สวัสดีครับ {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
            วันนี้คุณมี 2 งานเร่งด่วนที่ต้องตรวจตรา และ 1 กำหนดนัดศาลสำคัญภายในสัปดาห์นี้
          </p>
        </div>

        {/* Primary CTA with clear visual weight */}
        <button
          onClick={onOpenCreateCase}
          className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold py-2.5 px-5 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto text-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ สร้างสำนวนคดีใหม่</span>
        </button>
      </div>

      {/* 2. Quick Action Hub (Figma Gestalt Law of Proximity) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => handleOpenCase(demoCase?.id || 'case-abc-001', 'mindmap')}
          className="p-3.5 rounded-2xl bg-white hover:bg-indigo-50/50 border border-slate-200/90 hover:border-indigo-300 text-left transition-all duration-150 shadow-2xs hover:shadow-sm group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
            🧠
          </div>
          <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
            ผังคดี Mind Map
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">วางยุทธวิธีแบบ Blueprint</div>
        </button>

        <button
          onClick={() => setActiveLawyerNav('line_bot')}
          className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200/90 hover:border-emerald-300 text-left transition-all duration-150 shadow-2xs hover:shadow-sm group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#06C755] flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
            <Smartphone className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
            LINE Official Bot
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">ส่งแจ้งเตือนเข้า LINE ลูกความ</div>
        </button>

        <button
          onClick={() => setActiveLawyerNav('calendar')}
          className="p-3.5 rounded-2xl bg-white hover:bg-sky-50/50 border border-slate-200/90 hover:border-sky-300 text-left transition-all duration-150 shadow-2xs hover:shadow-sm group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4 text-sky-600" />
          </div>
          <div className="font-bold text-xs text-slate-900 group-hover:text-sky-700 transition-colors">
            ปฏิทินนัดหมายศาล
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">ตารางนัดบัลลังก์ศาลรายเดือน</div>
        </button>

        <button
          onClick={() => setShowPrivacyModal(true)}
          className="p-3.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200/90 hover:border-slate-300 text-left transition-all duration-150 shadow-2xs hover:shadow-sm group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
            <Info className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
            ข้อจำกัดเดโม
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">จำลองบน Browser / ข้อมูลสมมติ</div>
        </button>
      </div>

      {/* 3. Three Triage Columns (Figma Visual Contrast & Card Math) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: งานด่วน */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>งานด่วนที่ต้องดำเนินการ</span>
              </h2>
              <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                {urgentChecklistItems.length} งานสำคัญ
              </span>
            </div>

            <div className="space-y-2.5">
              {urgentChecklistItems.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                  ไม่มีงานคั่งค้างในขณะนี้
                </div>
              ) : (
                urgentChecklistItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => handleOpenCase(item.caseId, 'checklist')}
                    className="p-3 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50/80 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-red-800">{item.title}</span>
                      <span className="text-[10px] font-bold text-red-600 bg-white px-1.5 py-0.5 rounded border border-red-200">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 mt-1">
                      {item.caseTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {item.dueText ? `กำหนด: ${item.dueText}` : 'รอดำเนินการตรวจสอบ'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => handleOpenCase(demoCase?.id || 'case-abc-001', 'checklist')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-between w-full transition cursor-pointer"
            >
              <span>เปิดรายการตรวจสอบทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: กำหนดนัดศาลสำคัญ */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>กำหนดนัดศาลถัดไป</span>
              </h2>
              <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                {nextDeadline?.type === 'court' ? 'นัดศาล' : 'กำหนดงาน'}
              </span>
            </div>

            {nextDeadline ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-indigo-600 tracking-tight">
                    {nextDeadline.parsed?.day || new Date().getDate()}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {THAI_MONTHS_FULL[nextDeadline.parsed?.month ?? new Date().getMonth()]}{' '}
                    {(nextDeadline.parsed?.year ?? new Date().getFullYear()) + 543}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  {nextDeadline.caseTitle}
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  {nextDeadline.title}
                </div>
                <div className="pt-1 flex items-center space-x-2">
                  {nextDeadline.parsed ? (
                    <span
                      className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        formatRelativeDaysBadge(nextDeadline.parsed).urgencyClass
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeDaysBadge(nextDeadline.parsed).label}</span>
                    </span>
                  ) : null}
                  <span className="text-[11px] text-slate-400">เวลา 09:00 น.</span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/70 text-center text-xs text-slate-500">
                ไม่มีนัดหมายด่วนในขณะนี้
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => {
                if (nextDeadline) {
                  handleOpenCase(nextDeadline.caseId, 'overview');
                } else {
                  setActiveLawyerNav('calendar');
                }
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-between w-full transition cursor-pointer"
            >
              <span>เปิดดูรายละเอียดในปฏิทิน</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: เอกสารที่รอตรวจทาน */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-sky-600" />
                <span>เอกสารรอตรวจทาน</span>
              </h2>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                {totalPendingDocs || 4} รายการ
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-2xs">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  มีไฟล์ใหม่จากลูกความ
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  ลูกความอัปโหลดสลิปและสัญญาฉบับแก้ไขเข้ามาในระบบ
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => handleOpenCase(demoCase?.id || 'case-abc-001', 'documents')}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>เปิดคลังเอกสารเพื่อตรวจ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recent Cases Table: Clean Typography, Unboxed Metadata, Zero-Pill */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">สำนวนคดีที่กำลังดำเนินการ</h2>
              <p className="text-xs text-slate-400">ภาพรวมคดีความที่อยู่ในการดูแลของสำนักงาน</p>
            </div>
          </div>
          <button
            onClick={() => setActiveLawyerNav('cases')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 transition cursor-pointer"
          >
            <span>ดูคดีทั้งหมด ({cases.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {cases.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenCase(item.id, 'overview')}
              className="py-3.5 px-3 -mx-3 flex items-center justify-between hover:bg-slate-50/80 rounded-xl transition cursor-pointer group"
            >
              <div className="space-y-1">
                <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center space-x-2">
                  <span>{item.title}</span>
                  <span className="text-slate-300 font-normal">/</span>
                  <span className="text-xs font-medium text-slate-500">{item.clientName}</span>
                </div>
                {/* Clean Unboxed Metadata with Typographic Dots */}
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-600">{item.type}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="flex items-center space-x-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.status === 'ชนะคดี'
                          ? 'bg-emerald-500'
                          : item.status === 'ตรวจแล้ว'
                          ? 'bg-sky-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <span className="font-medium text-slate-700">{item.status}</span>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>วันนัด: {item.deadline}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>{item.documents.length} เอกสาร</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCase(item.id, 'mindmap');
                  }}
                  className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-xs font-semibold text-slate-700 transition"
                >
                  <span>เปิดผังคดี</span>
                </button>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
