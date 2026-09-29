import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CaseItem } from '../../types.ts';
import { CloseCaseModal } from './CloseCaseModal.tsx';
import {
  Calendar,
  FileText,
  Users,
  CheckSquare,
  ArrowRight,
  GitCommit,
  Clock,
  Sparkles,
  Gavel,
  CheckCircle,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ShieldAlert,
  Lightbulb,
  Award,
  ChevronRight,
  Edit3,
  Scale,
} from 'lucide-react';

interface CaseOverviewTabProps {
  caseItem: CaseItem;
}

export const CaseOverviewTab: React.FC<CaseOverviewTabProps> = ({ caseItem }) => {
  const { setActiveCaseTab, generatePostCaseAnalysis } = useApp();

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const completedChecklist = caseItem.checklist.filter((i) => i.status === 'ตรวจแล้ว').length;
  const totalChecklist = caseItem.checklist.length;

  const handleGenerateAi = async () => {
    setIsAnalyzingAi(true);
    try {
      const res = await fetch('/api/ai/post-case-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseData: caseItem,
          courtVerdict: caseItem.courtVerdict,
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.data) {
          generatePostCaseAnalysis(caseItem.id, resData.data);
          setIsAnalyzingAi(false);
          return;
        }
      }
      generatePostCaseAnalysis(caseItem.id);
    } catch (err) {
      console.warn('AI analysis call error, using local generator:', err);
      generatePostCaseAnalysis(caseItem.id);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleCopyLearnings = () => {
    if (!caseItem.postCaseLearning) return;
    const l = caseItem.postCaseLearning;
    const text = `=== บทเรียนและข้อสรุปคดี (Post-Case Learning) ===\nคดี: ${caseItem.title}\n\n[สรุปภาพรวม]\n${l.summary}\n\n[ประเด็นเรียนรู้สำคัญ]\n${l.keyLearnings.map((k, i) => `${i + 1}. ${k}`).join('\n')}\n\n[วิเคราะห์ยุทธวิธีและจุดเปลี่ยน]\n${l.tacticalAnalysis}\n\n[บรรทัดฐานและข้อสังเกต]\n${l.precedentTakeaways}\n\n[ข้อพึงระวัง]\n${l.futurePrecautions.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* SECTION 1: “คดีนี้มีอะไรบ้าง” (Summary Stats) */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          คดีนี้มีอะไรบ้าง
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* เหตุการณ์ */}
          <div
            onClick={() => setActiveCaseTab('timeline')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600 transition">
              <span className="text-xs font-medium text-slate-600">เหตุการณ์</span>
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {caseItem.events.length}
            </div>
            <div className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center space-x-1">
              <span>ดู Timeline</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* เอกสาร */}
          <div
            onClick={() => setActiveCaseTab('documents')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600 transition">
              <span className="text-xs font-medium text-slate-600">เอกสาร</span>
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {caseItem.documents.length}
            </div>
            <div className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center space-x-1">
              <span>ดูคลังเอกสาร</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* บุคคล */}
          <div
            onClick={() => setActiveCaseTab('mindmap')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600 transition">
              <span className="text-xs font-medium text-slate-600">บุคคล</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {caseItem.people.length}
            </div>
            <div className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center space-x-1">
              <span>ดูใน Mind Map</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Checklist */}
          <div
            onClick={() => setActiveCaseTab('checklist')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600 transition">
              <span className="text-xs font-medium text-slate-600">Checklist</span>
              <CheckSquare className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {completedChecklist}/{totalChecklist}
            </div>
            <div className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center space-x-1">
              <span>ตรวจรายการ</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: “ข้อสรุปจากคำสั่งศาล” (Court Verdict Summary) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <span>ข้อสรุปจากคำสั่งศาล</span>
                {caseItem.courtVerdict && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {caseItem.courtVerdict.verdictResult}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                สาระสำคัญของคำสั่งศาล คำพิพากษา และข้อกำหนดการบังคับคดี
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCloseModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-slate-200 hover:border-indigo-200 cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{caseItem.courtVerdict ? 'แก้ไขคำสั่งศาล' : '+ บันทึกคำสั่งศาล / ปิดคดี'}</span>
          </button>
        </div>

        {caseItem.courtVerdict ? (
          <div className="space-y-4 pt-1">
            {/* Meta Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 text-xs">
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">ศาลที่ออกคำสั่ง:</span>
                <span className="font-bold text-slate-800 text-sm">{caseItem.courtVerdict.courtName || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">คดีหมายเลขแดง:</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{caseItem.courtVerdict.redCaseNumber || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">วันที่ศาลมีคำสั่ง:</span>
                <span className="font-bold text-slate-800 text-sm">{caseItem.courtVerdict.verdictDate || '-'}</span>
              </div>
            </div>

            {/* Verdict Details */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                สาระสำคัญตามคำสั่งศาล / คำพิพากษา
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {caseItem.courtVerdict.details}
              </p>
            </div>

            {/* Compensation & Execution Deadlines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {caseItem.courtVerdict.compensationAmount && (
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-emerald-950">
                  <span className="font-bold block text-emerald-800 text-[11px]">💰 ยอดเงินชดเชย / ทรัพย์สินตามคำพิพากษา</span>
                  <span className="font-semibold text-sm mt-0.5 block">{caseItem.courtVerdict.compensationAmount}</span>
                </div>
              )}
              {caseItem.courtVerdict.executionDeadline && (
                <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-indigo-950">
                  <span className="font-bold block text-indigo-800 text-[11px]">⏳ ระยะเวลาการบังคับคดี / ปฏิบัติตามคำสั่ง</span>
                  <span className="font-semibold text-sm mt-0.5 block">{caseItem.courtVerdict.executionDeadline}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <Scale className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">คดียังอยู่ระหว่างดำเนินกระบวนพิจารณา</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              เมื่อศาลมีคำสั่ง คำพิพากษา หรือคู่ความสามารถตกลงประนีประนอมยอมความกันได้ ท่านสามารถกดบันทึกคำสั่งศาลเพื่อสรุปและปิดคดี
            </p>
            <button
              type="button"
              onClick={() => setIsCloseModalOpen(true)}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs inline-flex items-center space-x-1.5"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>บันทึกคำสั่งศาล & ปิดคดี</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3: “AI สรุปเหตุการณ์หลังจบคดี & บทเรียนสำหรับเรียนรู้” (Post-Case Learning) */}
      <div className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white flex items-center space-x-1.5">
                  <span>Ai สรุปเหตุการณ์หลังจบคดี & บทเรียนสำหรับเรียนรู้</span>
                </h2>
                <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded-full border border-sky-800 font-mono">
                  GEMINI AI
                </span>
              </div>
              <p className="text-xs text-slate-300">
                สังเคราะห์ข้อเท็จจริง ไทม์ไลน์ และคำสั่งศาล สู่คลังความรู้และแนวทางการดำเนินคดีในอนาคต
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {caseItem.postCaseLearning && (
              <button
                type="button"
                onClick={handleCopyLearnings}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 cursor-pointer border border-slate-700"
                title="คัดลอกบทเรียน"
              >
                {copyToast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">คัดลอกแล้ว!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>คัดลอกบทเรียน</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              disabled={isAnalyzingAi}
              onClick={handleGenerateAi}
              className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {isAnalyzingAi ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>กำลังวิเคราะห์...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{caseItem.postCaseLearning ? 'ให้ AI สรุปใหม่' : '✨ สรุปบทเรียนด้วย AI'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {caseItem.postCaseLearning ? (
          <div className="space-y-4">
            {/* 1. Summary of Events Flow */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1.5">
              <span className="text-xs font-bold text-sky-400 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4" />
                <span>1. สรุปภาพรวมลำดับเหตุการณ์หลังจบคดี (Summary & Case Flow)</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {caseItem.postCaseLearning.summary}
              </p>
            </div>

            {/* 2. Key Learnings */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>2. ประเด็นเรียนรู้สำคัญ (Key Takeaways)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {caseItem.postCaseLearning.keyLearnings.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-xs text-slate-200 space-y-1.5 flex flex-col justify-between"
                  >
                    <div className="flex items-center space-x-2 text-amber-300 font-bold text-[11px]">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>บทเรียนที่ {idx + 1}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300 font-medium">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Tactical Analysis & 4. Precedents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700/70 space-y-1.5">
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                  <Award className="w-4 h-4" />
                  <span>3. วิเคราะห์ยุทธวิธีและจุดเปลี่ยนของคดี (Tactical Turning Points)</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {caseItem.postCaseLearning.tacticalAnalysis}
                </p>
              </div>

              <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700/70 space-y-1.5">
                <span className="text-xs font-bold text-sky-300 flex items-center space-x-1.5">
                  <Scale className="w-4 h-4" />
                  <span>4. บรรทัดฐานและข้อสังเกตสำหรับคดีในอนาคต (Precedents)</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {caseItem.postCaseLearning.precedentTakeaways}
                </p>
              </div>
            </div>

            {/* 5. Future Precautions */}
            {caseItem.postCaseLearning.futurePrecautions && caseItem.postCaseLearning.futurePrecautions.length > 0 && (
              <div className="bg-rose-950/30 p-3.5 rounded-xl border border-rose-900/50 space-y-2">
                <span className="text-xs font-bold text-rose-300 flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>5. ข้อพึงระวังและข้อควรหลีกเลี่ยงในการทำคดีลักษณะนี้</span>
                </span>
                <ul className="space-y-1 pl-5 list-disc text-xs text-rose-200/90 leading-relaxed">
                  {caseItem.postCaseLearning.futurePrecautions.map((prec, i) => (
                    <li key={i}>{prec}</li>
                  ))}
                </ul>
              </div>
            )}

            {caseItem.postCaseLearning.generatedAt && (
              <div className="text-right text-[11px] text-slate-400 pt-1">
                สร้างบทเรียนสรุปเมื่อ: {caseItem.postCaseLearning.generatedAt}
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <Sparkles className="w-8 h-8 text-sky-400 mx-auto animate-pulse" />
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-sm font-bold text-white">ยังไม่มีการประมวลผลบทเรียนหลังจบคดี</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                คลิกปุ่มด้านล่างเพื่อให้ AI รวบรวมข้อเท็จจริงในคดีนี้ พยานเอกสาร ลำดับเหตุการณ์ และคำพิพากษา มาสกัดเป็นคลังความรู้เพื่อใช้เรียนรู้และอ้างอิง
              </p>
            </div>
            <button
              type="button"
              disabled={isAnalyzingAi}
              onClick={handleGenerateAi}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm inline-flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzingAi ? 'กำลังวิเคราะห์ข้อมูล...' : '✨ ประมวลผลและสรุปบทเรียนด้วย AI'}</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 4: “สิ่งที่ต้องทำต่อ” */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">สิ่งที่ต้องทำต่อ</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">ลำดับความสำคัญตามขั้นตอน</span>
        </div>

        <div className="space-y-3">
          {/* Action 1 */}
          <div
            onClick={() => setActiveCaseTab('documents')}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 transition cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                  ตรวจสัญญาว่าจ้างและเงื่อนไขการส่งมอบ
                </div>
                <div className="text-xs text-slate-500">
                  ตรวจสอบข้อสัญญาเรื่องการผิดนัดชำระและเงื่อนไขบอกเลิกสัญญา
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </div>

          {/* Action 2 */}
          <div
            onClick={() => setActiveCaseTab('checklist')}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 transition cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                  ขอเอกสารเพิ่มเติมจากลูกความ
                </div>
                <div className="text-xs text-slate-500">
                  ติดตามรายการเดินบัญชีย้อนหลังและหลักฐานยืนยันความเสียหาย
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </div>

          {/* Action 3 */}
          <div
            onClick={() => setActiveCaseTab('timeline')}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 transition cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                  ตรวจ Deadline ยื่นเอกสารต่อศาล ({caseItem.deadline})
                </div>
                <div className="text-xs text-slate-500">
                  เตรียมบัญชีระบุพยานเอกสารและสำเนาคำฟ้องให้พร้อมก่อนครบกำหนด
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Mind Map Visual Prompt Section */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-md">
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold">
            <GitCommit className="w-4 h-4" />
            <span>MIND MAP VISUALIZER</span>
          </div>
          <h3 className="text-lg font-bold text-white">เห็นความเชื่อมโยงของคดีเป็นภาพรวม</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            ดูว่าเหตุการณ์ใดนำไปสู่การผิดสัญญา และมีเอกสารหรือบุคคลใดเกี่ยวข้องบ้าง
          </p>
        </div>
        <button
          onClick={() => setActiveCaseTab('mindmap')}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <span>เปิด Mind Map คดีนี้</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal for editing or entering court verdict */}
      <CloseCaseModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        caseItem={caseItem}
      />
    </div>
  );
};
