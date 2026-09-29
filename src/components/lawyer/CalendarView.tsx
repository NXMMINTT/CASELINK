import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Calendar, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { cases, setSelectedCaseId, setActiveLawyerNav, setActiveCaseTab, setIsViewingCaseDetail } = useApp();

  const allDeadlines = cases.flatMap((c) =>
    c.deadlines.map((dl) => ({ ...dl, caseTitle: c.title, caseId: c.id }))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ปฏิทินและนัดหมาย</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          ติดตามกำหนดนัดศาล วันครบกำหนดยื่นเอกสาร และงานเร่งด่วนของทุกคดี
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>กำหนดนัดสำคัญที่ใกล้ถึง ({allDeadlines.length} รายการ)</span>
        </h2>

        <div className="divide-y divide-slate-100">
          {allDeadlines.map((dl) => (
            <div
              key={dl.id}
              onClick={() => {
                setSelectedCaseId(dl.caseId);
                setIsViewingCaseDetail(true);
                setActiveLawyerNav('cases');
                setActiveCaseTab('overview');
              }}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-3 -mx-3 rounded-xl transition cursor-pointer"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-700 flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase">วันนัด</span>
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {dl.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-700">{dl.caseTitle}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-medium">{dl.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    dl.urgency === 'high'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {dl.urgency === 'high' ? '🔴 ด่วนมาก' : '🟡 กำลังจะถึง'}
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
