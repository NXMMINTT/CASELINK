import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CaseItem, CourtVerdict } from '../../types.ts';
import { ThaiDatePicker } from '../common/ThaiDatePicker.tsx';
import {
  X,
  Gavel,
  CheckCircle,
  FileText,
  DollarSign,
  Clock,
  Sparkles,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface CloseCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CaseItem;
}

export const CloseCaseModal: React.FC<CloseCaseModalProps> = ({
  isOpen,
  onClose,
  caseItem,
}) => {
  const { closeCase, addFutureUpdate, generatePostCaseAnalysis } = useApp();

  const todayIso = new Date().toISOString().split('T')[0];

  const [verdictResult, setVerdictResult] = useState<string>('ชนะคดีตามฟ้อง');
  const [customResult, setCustomResult] = useState('');
  const [verdictDateIso, setVerdictDateIso] = useState(todayIso);
  const [courtName, setCourtName] = useState('ศาลแพ่ง');
  const [redCaseNumber, setRedCaseNumber] = useState('');
  const [details, setDetails] = useState('');
  const [compensationAmount, setCompensationAmount] = useState('');
  const [executionDeadline, setExecutionDeadline] = useState('ภายใน 30 วันนับแต่วันอ่านคำพิพากษา');
  const [closureReason, setClosureReason] = useState('');
  const [futureFollowup, setFutureFollowup] = useState('ติดตามการบังคับคดีและรับชำระหนี้ตามคำพิพากษา');
  const [autoGenerateAi, setAutoGenerateAi] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const verdictOptions = [
    { label: 'ชนะคดีตามฟ้อง', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { label: 'ยอมความตามสัญญาประนีประนอม', color: 'bg-sky-50 text-sky-800 border-sky-300' },
    { label: 'ไกล่เกลี่ยสำเร็จ', color: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
    { label: 'ยกฟ้อง', color: 'bg-amber-50 text-amber-800 border-amber-300' },
    { label: 'ถอนฟ้อง / ระงับข้อพิพาท', color: 'bg-slate-50 text-slate-800 border-slate-300' },
    { label: 'อื่นๆ (ระบุเอง)', color: 'bg-purple-50 text-purple-800 border-purple-300' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalResult = verdictResult === 'อื่นๆ (ระบุเอง)' && customResult.trim()
      ? customResult.trim()
      : verdictResult;

    const verdict: CourtVerdict = {
      verdictDate: verdictDateIso,
      verdictResult: finalResult,
      courtName: courtName.trim() || 'ศาล',
      redCaseNumber: redCaseNumber.trim() || undefined,
      details: details.trim() || `ศาลมีคำสั่ง/คำพิพากษาผล: ${finalResult}`,
      compensationAmount: compensationAmount.trim() || undefined,
      executionDeadline: executionDeadline.trim() || undefined,
    };

    // Close case
    closeCase(caseItem.id, verdict, closureReason.trim() || finalResult);

    // Add future update if provided
    if (futureFollowup.trim()) {
      addFutureUpdate(caseItem.id, {
        title: futureFollowup.trim(),
        category: 'execution',
        targetDate: executionDeadline.trim() || 'ภายใน 30 วัน',
        details: `ติดตามผลหลังจากศาลมีคำพิพากษา (${verdict.courtName})`,
      });
    }

    // Generate AI Post-Case Analysis
    if (autoGenerateAi) {
      try {
        const res = await fetch('/api/ai/post-case-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseData: caseItem,
            courtVerdict: verdict,
          }),
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.success && resData.data) {
            // update in context
            generatePostCaseAnalysis(caseItem.id);
          } else {
            generatePostCaseAnalysis(caseItem.id);
          }
        } else {
          generatePostCaseAnalysis(caseItem.id);
        }
      } catch {
        generatePostCaseAnalysis(caseItem.id);
      }
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-900 to-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>บันทึกคำสั่งศาล & ปิดคดี</span>
                <span className="text-xs font-normal text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  {caseItem.title}
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                บันทึกข้อสรุปจากคำสั่งศาล และสกัดบทเรียนหลังจบคดีด้วย AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/80 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Result Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              ผลคำพิพากษา / คำสั่งศาล *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {verdictOptions.map((opt) => {
                const isSelected = verdictResult === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setVerdictResult(opt.label)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {verdictResult === 'อื่นๆ (ระบุเอง)' && (
              <input
                type="text"
                required
                placeholder="ระบุผลคำพิพากษา เช่น ประนีประนอมผ่อนชำระ..."
                value={customResult}
                onChange={(e) => setCustomResult(e.target.value)}
                className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Thai Date Picker for Court Date */}
          <ThaiDatePicker
            value={verdictDateIso}
            onChange={(iso) => setVerdictDateIso(iso)}
            label="วันที่ศาลมีคำสั่ง / อ่านคำพิพากษา"
            required
          />

          {/* Court Name and Red Case Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อศาล
              </label>
              <input
                type="text"
                placeholder="เช่น ศาลแพ่ง, ศาลแพ่งกรุงเทพใต้"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                คดีหมายเลขแดง
              </label>
              <input
                type="text"
                placeholder="เช่น พ. 1234/2569"
                value={redCaseNumber}
                onChange={(e) => setRedCaseNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Details / Summary of Verdict */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ข้อสรุปจากคำสั่งศาล / สาระสำคัญคำพิพากษา *
            </label>
            <textarea
              required
              rows={3}
              placeholder="ระบุสรุปคำพิพากษา เช่น ศาลพิพากษาให้จำเลยชำระเงินตามสัญญาจ้างทำของ 500,000 บาท พร้อมดอกเบี้ยร้อยละ 5 ต่อปีนับแต่วันผิดนัด..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Compensation and Execution Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>ยอดเงินชดเชย / ทรัพย์สิน</span>
              </label>
              <input
                type="text"
                placeholder="เช่น 500,000 บาท + ดอกเบี้ย 5%"
                value={compensationAmount}
                onChange={(e) => setCompensationAmount(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>กำหนดเวลาปฏิบัติตามคำสั่ง</span>
              </label>
              <input
                type="text"
                placeholder="เช่น ภายใน 30 วันนับแต่วันอ่านคำพิพากษา"
                value={executionDeadline}
                onChange={(e) => setExecutionDeadline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Future Update to add right away */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <span>📌 เพิ่มสิ่งที่ต้อง Update ในอนาคต (ติดตามผล)</span>
            </label>
            <input
              type="text"
              placeholder="เช่น ติดตามการบังคับคดี, ประสานงานยึดทรัพย์จำเลย, นัดรับเงินก้อนแรก..."
              value={futureFollowup}
              onChange={(e) => setFutureFollowup(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-500">
              จะถูกเพิ่มเข้าไปในรายการ <strong>"สิ่งที่จะ Update ในอนาคต"</strong> ในแถบด้านซ้ายโดยอัตโนมัติ
            </p>
          </div>

          {/* AI Synthesis Checkbox */}
          <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100 flex items-start space-x-3">
            <input
              type="checkbox"
              id="autoGenerateAi"
              checked={autoGenerateAi}
              onChange={(e) => setAutoGenerateAi(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
            />
            <label htmlFor="autoGenerateAi" className="text-xs text-indigo-950 font-medium cursor-pointer">
              <span className="font-bold flex items-center space-x-1 text-indigo-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>ให้ AI วิเคราะห์สรุปเหตุการณ์หลังจบคดีและถอดบทเรียนทันที</span>
              </span>
              <span className="text-indigo-800/80 block mt-0.5 text-[11px]">
                สกัดลำดับเหตุการณ์, จุดเปลี่ยนทางยุทธวิธี, บรรทัดฐานทางคดี และข้อพึงระวังสำหรับเป็นคลังความรู้
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'กำลังบันทึกและประมวลผล...' : 'ยืนยันการปิดคดี'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
