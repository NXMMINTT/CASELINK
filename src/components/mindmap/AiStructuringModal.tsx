import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Sparkles,
  X,
  AlertTriangle,
  Check,
  Calendar,
  Users,
  FileText,
  Loader2,
  Edit2,
  Info,
  Shield,
} from 'lucide-react';
import { simulateLocalCaseStructuring } from '../../utils/aiSimulator.ts';

interface AiStructuringModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
}

export const AiStructuringModal: React.FC<AiStructuringModalProps> = ({
  isOpen,
  onClose,
  caseId,
}) => {
  const { addEvent, addPerson, addDocument } = useApp();

  const [storyText, setStoryText] = useState(
    'วันที่ 12 มกราคม นายสมชายทำสัญญากับบริษัท ABC\nวันที่ 20 มีนาคมบริษัทไม่ทำตามสัญญา\nวันที่ 5 เมษายนส่งหนังสือแจ้งเตือน'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Preview stage state
  const [previewData, setPreviewData] = useState<{
    events: any[];
    people: any[];
    documents: any[];
    summary: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerateStructure = async () => {
    if (!storyText.trim()) {
      setErrorMsg('กรุณากรอกข้อความเหตุการณ์ของคดี');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    // Simulated local parsing in browser (No external API calls, No network traffic)
    setTimeout(() => {
      try {
        const result = simulateLocalCaseStructuring(storyText);
        setPreviewData(result);
      } catch (err: any) {
        console.error(err);
        setErrorMsg('ไม่สามารถจัดระเบียบข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setIsLoading(false);
      }
    }, 400);
  };

  const handleConfirmSave = () => {
    if (!previewData) return;

    // Add extracted events to current case
    previewData.events.forEach((ev) => {
      addEvent(caseId, {
        title: ev.title || 'เหตุการณ์',
        date: ev.date || 'ไม่ระบุวันที่',
        description: ev.description || '',
        relatedPersonNames: ev.relatedPersonNames || [],
        relatedDocNames: ev.relatedDocNames || [],
        type: ev.title.includes('สัญญา') ? 'contract' : ev.title.includes('เตือน') ? 'notice' : 'other',
      });
    });

    // Add people if any
    previewData.people.forEach((p) => {
      addPerson(caseId, {
        name: p.name,
        role: p.role || 'บุคคลที่เกี่ยวข้อง',
        relatedEventIds: [],
      });
    });

    // Add documents if any
    previewData.documents.forEach((d) => {
      addDocument(caseId, {
        title: d.name,
        type: d.type || 'เอกสาร',
        status: 'ยังไม่ได้ส่ง',
        date: d.date || 'ระบุภายหลัง',
        uploadedBy: 'ทนาย',
        relatedEventIds: [],
      });
    });

    onClose();
    setPreviewData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {previewData ? 'ตรวจสอบข้อมูลก่อนบันทึก' : '✨ จัดโครงสร้างด้วย AI'}
              </h3>
              <p className="text-xs text-slate-500">
                {previewData
                  ? 'ตรวจสอบความถูกต้องของเหตุการณ์และบุคคลก่อนนำเข้าสู่คดี'
                  : 'เล่าเหตุการณ์ของคดี เพื่อให้ระบบช่วยแยกเป็นลำดับเวลาและบุคคล'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Important Honest AI Simulation Disclaimer (Requirement 4) */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start space-x-2.5 text-xs text-amber-900 leading-relaxed">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">โหมดจำลองในเบราว์เซอร์:</span>{' '}
              ระบบจำลองการจัดระเบียบข้อเท็จจริงในเครื่องของคุณเท่านั้น (Client-Side Simulation)
              ไม่ได้ส่งข้อความให้ AI ภายนอก ไม่ได้ส่งข้อมูลออกนอกเครื่อง และไม่ได้ให้คำแนะนำทางกฎหมาย
            </div>
          </div>

          {!previewData ? (
            /* INPUT STAGE */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  เล่าเหตุการณ์ของคดี (พิมพ์ข้อเท็จจริงตามลำดับ)
                </label>
                <textarea
                  rows={6}
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder="ตัวอย่าง:
วันที่ 12 มกราคม นายสมชายทำสัญญากับบริษัท ABC
วันที่ 20 มีนาคมบริษัทไม่ทำตามสัญญา
วันที่ 5 เมษายนส่งหนังสือแจ้งเตือน"
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-500 space-y-1">
                <span className="font-semibold text-slate-700">สิ่งที่ระบบจะสกัดให้:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>บุคคลและองค์กรที่เกี่ยวข้อง</li>
                  <li>เหตุการณ์และวันที่เกิดขึ้น</li>
                  <li>เอกสารหรือหลักฐานที่อ้างถึง</li>
                </ul>
              </div>
            </div>
          ) : (
            /* PREVIEW STAGE (Section 13: แสดง Preview ก่อนเพิ่มเข้า Case) */
            <div className="space-y-5">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900">
                <span className="font-bold">สรุปภาพรวม:</span> {previewData.summary}
              </div>

              {/* Events Preview */}
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 mb-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>เหตุการณ์ที่พบ ({previewData.events.length} รายการ)</span>
                </div>
                <div className="space-y-2">
                  {previewData.events.map((ev, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{ev.title}</span>
                        <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-medium">
                          {ev.date}
                        </span>
                      </div>
                      <p className="text-slate-600">{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* People Preview */}
              {previewData.people.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 mb-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>บุคคลที่สกัดได้ ({previewData.people.length} รายการ)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {previewData.people.map((p, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                      >
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-500">{p.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents Preview */}
              {previewData.documents.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 mb-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>เอกสารที่เกี่ยวข้อง ({previewData.documents.length} รายการ)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {previewData.documents.map((d, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                      >
                        <div className="font-semibold text-slate-900">{d.name}</div>
                        <div className="text-[11px] text-slate-500">ประเภท: {d.type}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {!previewData ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleGenerateStructure}
                disabled={isLoading}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition flex items-center space-x-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังจัดโครงสร้าง...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>สร้างโครงสร้าง</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Buttons: “ยืนยัน” “แก้ไข” “ยกเลิก” (Section 13) */
            <>
              <button
                onClick={() => setPreviewData(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>แก้ไขข้อความ</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirmSave}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>ยืนยันบันทึกเข้าคดี</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
