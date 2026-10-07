import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CaseItem, CaseEvent } from '../../types.ts';
import {
  Plus,
  Calendar,
  X,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Users,
  FileText,
  Clock,
  Check,
} from 'lucide-react';

interface TimelineViewProps {
  caseItem: CaseItem;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ caseItem }) => {
  const { addEvent, deleteEvent } = useApp();

  // 3-step modal state (Section 14)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: เกิดเหตุการณ์อะไร?
  const [eventTitle, setEventTitle] = useState('');
  // Step 2: เกิดวันที่เท่าไหร่?
  const [eventDate, setEventDate] = useState('');
  // Step 3: รายละเอียดเพิ่มเติม?
  const [eventDetails, setEventDetails] = useState('');
  const [eventPersons, setEventPersons] = useState('');
  const [eventDocs, setEventDocs] = useState('');

  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setCurrentStep(1);
    setEventTitle('');
    setEventDate('');
    setEventDetails('');
    setEventPersons('');
    setEventDocs('');
    setStepError(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!eventTitle.trim()) {
      setStepError('กรุณาระบุชื่อเหตุการณ์');
      return;
    }

    const parsedPersons = eventPersons
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedDocs = eventDocs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addEvent(caseItem.id, {
      title: eventTitle.trim(),
      date: eventDate.trim() || 'ไม่ระบุวันที่',
      description: eventDetails.trim() || 'ไม่มีรายละเอียดเพิ่มเติม',
      relatedPersonNames: parsedPersons,
      relatedDocNames: parsedDocs,
      type: 'other',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-200">
      {/* Timeline Header & Primary Action (Section 14) */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Timeline ลำดับเหตุการณ์
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            แสดงข้อเท็จจริงตามลำดับเวลา เพื่อให้เห็นความเชื่อมโยงก่อนและหลัง
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition text-xs sm:text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>เพิ่มเหตุการณ์</span>
        </button>
      </div>

      {/* Timeline Feed (Section 14 exact styling) */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8 my-6">
        {caseItem.events.map((ev, index) => (
          <div key={ev.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 transition-transform" />

            {/* Event Content Card */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-sm transition">
              {/* Date & Title */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ev.date}</span>
                </span>
                <button
                  onClick={() => setEventToDelete(ev.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded transition self-end sm:self-auto cursor-pointer"
                  title="ลบเหตุการณ์"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {ev.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {ev.description}
              </p>

              {/* Related tags */}
              {(ev.relatedPersonNames.length > 0 || ev.relatedDocNames.length > 0) && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                  {ev.relatedPersonNames.map((name, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-2 py-0.5 rounded-md text-[11px]"
                    >
                      <Users className="w-3 h-3 text-emerald-600" />
                      <span>{name}</span>
                    </span>
                  ))}
                  {ev.relatedDocNames.map((doc, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center space-x-1 bg-sky-50 text-sky-800 border border-sky-200/70 px-2 py-0.5 rounded-md text-[11px]"
                    >
                      <FileText className="w-3 h-3 text-sky-600" />
                      <span>{doc}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Event Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-xs w-full shadow-lg border border-slate-200 p-5 text-slate-800">
            <h3 className="font-bold text-sm text-slate-900 mb-1.5">ลบเหตุการณ์นี้หรือไม่?</h3>
            <p className="text-xs text-slate-500 mb-4">
              เหตุการณ์นี้จะถูกนำออกจากลำดับเวลาและ Mind Map ของคดี
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEventToDelete(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  deleteEvent(caseItem.id, eventToDelete);
                  setEventToDelete(null);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3-STEP SHORT EVENT MODAL (Section 14: ถามทีละข้อมูล อย่าสร้าง Form ยาวในหน้าเดียว) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-md w-full shadow-lg border border-slate-200 overflow-hidden text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  {currentStep}/3
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {currentStep === 1
                    ? 'ขั้นที่ 1: เกิดเหตุการณ์อะไร?'
                    : currentStep === 2
                    ? 'ขั้นที่ 2: เกิดวันที่เท่าไหร่?'
                    : 'ขั้นที่ 3: รายละเอียดเพิ่มเติม?'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content - Progressive 3 Steps */}
            <div className="p-6 min-h-[160px] flex flex-col justify-center space-y-3">
              {stepError && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 font-medium">
                  {stepError}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    ชื่อเหตุการณ์ (กระชับและเข้าใจง่าย)
                  </label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="เช่น ทำสัญญาจ้าง, ผิดสัญญา, ส่งหนังสือแจ้งเตือน"
                    value={eventTitle}
                    onChange={(e) => {
                      setEventTitle(e.target.value);
                      if (stepError) setStepError(null);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                  />
                  <p className="text-[11px] text-slate-400">
                    แนะนำให้ใช้คำสั้นๆ เพื่อให้แสดงผลใน Timeline ได้อย่างชัดเจน
                  </p>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    วันที่เกิดเหตุการณ์
                  </label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="เช่น 12 มกราคม 2025 หรือ กลางเดือนมีนาคม"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {['วันนี้', 'เมื่อวานนี้', '12 มกราคม 2025', '20 มีนาคม 2025'].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => setEventDate(sample)}
                        className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      รายละเอียดเพิ่มเติม (ไม่บังคับ)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="อธิบายว่าเกิดอะไรขึ้น มีใครทำอะไร..."
                      value={eventDetails}
                      onChange={(e) => setEventDetails(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      บุคคลที่เกี่ยวข้อง (คั่นด้วยจุลภาค ,)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น นายสมชาย, กรรมการบริษัท ABC"
                      value={eventPersons}
                      onChange={(e) => setEventPersons(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  onClick={() => {
                    setStepError(null);
                    setCurrentStep((currentStep - 1) as any);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ย้อนกลับ</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ยกเลิก
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  onClick={() => {
                    if (currentStep === 1 && !eventTitle.trim()) {
                      setStepError('กรุณาระบุชื่อเหตุการณ์');
                      return;
                    }
                    setStepError(null);
                    setCurrentStep((currentStep + 1) as any);
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>ต่อไป</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSaveEvent}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกเหตุการณ์</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
