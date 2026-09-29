import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Plus,
  ArrowRight,
  FileCheck2,
  Calendar,
  AlertCircle,
  Clock,
  Briefcase,
} from 'lucide-react';

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
  } = useApp();

  // Find demo case
  const demoCase = cases.find((c) => c.id === 'case-abc-001') || cases[0];

  const handleOpenCase = (caseId: string, tab: 'overview' | 'documents' | 'checklist' | 'timeline' = 'overview') => {
    setSelectedCaseId(caseId);
    setIsViewingCaseDetail(true);
    setActiveLawyerNav('cases');
    setActiveCaseTab(tab);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Header - Section 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">สวัสดีครับ</h1>
          <p className="text-slate-500 text-sm mt-1">
            วันนี้คุณมี 2 งานด่วน และ 1 กำหนดส่งที่ต้องตรวจตรา
          </p>
        </div>

        {/* Primary Action Button - Big and Prominent */}
        <button
          onClick={onOpenCreateCase}
          className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition text-base cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>+ สร้างคดีใหม่</span>
        </button>
      </div>

      {/* 3 Essential Sections (Strictly Section 7) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. งานที่ต้องทำวันนี้ */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">งานที่ต้องทำวันนี้</h2>
              <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                2 งาน
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Task 1 */}
              <div
                onClick={() => handleOpenCase(demoCase?.id || 'case-abc-001', 'documents')}
                className="p-3.5 rounded-xl border border-red-100 bg-red-50/40 hover:bg-red-50 transition cursor-pointer group"
              >
                <div className="flex items-center space-x-2 text-xs font-bold text-red-700">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span>🔴 ตรวจเอกสาร</span>
                </div>
                <div className="text-sm font-semibold text-slate-900 mt-1">
                  คดี: {demoCase?.clientName || 'นายสมชาย'}
                </div>
                <div className="text-xs text-red-600 font-medium mt-0.5">
                  ครบกำหนดวันนี้
                </div>
              </div>

              {/* Task 2 */}
              <div
                onClick={() => handleOpenCase(demoCase?.id || 'case-abc-001', 'checklist')}
                className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/40 hover:bg-amber-50 transition cursor-pointer group"
              >
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>🟡 ส่งเอกสาร</span>
                </div>
                <div className="text-sm font-semibold text-slate-900 mt-1">
                  คดี: บริษัท ABC
                </div>
                <div className="text-xs text-amber-600 font-medium mt-0.5">
                  ครบกำหนดพรุ่งนี้
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => handleOpenCase(demoCase?.id || 'case-abc-001', 'checklist')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center justify-between w-full"
            >
              <span>เปิดรายการตรวจสอบทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Deadline ใกล้ถึง */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Deadline ใกล้ถึง</h2>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <span className="text-indigo-600">30</span>
                <span>ก.ย. 2026</span>
              </div>
              <div className="text-sm font-semibold text-slate-800">
                คดี{demoCase?.clientName || 'นายสมชาย'}
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                ยื่นคำแถลงและส่งเอกสารเพิ่มเติมต่อศาลแพ่ง
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3" />
                  <span>เหลืออีก 1 วัน</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => handleOpenCase(demoCase?.id || 'case-abc-001', 'overview')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center justify-between w-full"
            >
              <span>เปิดแฟ้มคดีนี้</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. เอกสารที่รอตรวจ */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">เอกสารรอตรวจ</h2>
              <FileCheck2 className="w-4 h-4 text-sky-500" />
            </div>

            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">
                  เอกสารรอตรวจ 4 รายการ
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  ลูกความส่งไฟล์ใหม่เข้ามาเมื่อวานนี้
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => handleOpenCase(demoCase?.id || 'case-abc-001', 'documents')}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <span>ตรวจเอกสาร</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access to Cases List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-slate-500" />
            <h2 className="text-base font-bold text-slate-900">คดีที่กำลังดำเนินการล่าสุด</h2>
          </div>
          <button
            onClick={() => setActiveLawyerNav('cases')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            ดูคดีทั้งหมด ({cases.length})
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {cases.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenCase(item.id, 'overview')}
              className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-3 -mx-3 rounded-xl transition cursor-pointer"
            >
              <div>
                <div className="font-semibold text-sm text-slate-900 hover:text-indigo-600 transition">
                  {item.title}
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                  <span>{item.type}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    <span>🟡</span>
                    <span>{item.status}</span>
                  </span>
                  <span>•</span>
                  <span>Deadline: {item.deadline}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 hidden sm:inline">
                  {item.documents.length} เอกสาร
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
