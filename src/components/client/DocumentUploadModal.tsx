import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  FileUp,
  Check,
  CreditCard,
  FileText,
  DollarSign,
  Image,
  MessageCircle,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  initialType?: string;
}

const DOC_TYPES = [
  { id: 'บัตรประชาชน', label: 'บัตรประชาชน', icon: CreditCard, hint: 'ถ่ายด้านหน้าบัตรให้เห็นข้อความชัดเจน' },
  { id: 'สัญญา', label: 'สัญญา', icon: FileText, hint: 'สัญญาจ้าง ใบเสนอราคา หรือบันทึกข้อตกลง' },
  { id: 'หลักฐานการโอนเงิน', label: 'หลักฐานการโอนเงิน', icon: DollarSign, hint: 'สลิปธนาคาร หรือใบเสร็จรับเงิน' },
  { id: 'รูปภาพ', label: 'รูปภาพ', icon: Image, hint: 'รูปภาพหน้างาน ความเสียหาย หรือสิ่งของ' },
  { id: 'Chat', label: 'Chat', icon: MessageCircle, hint: 'ภาพแคปเจอร์หน้าจอการคุยผ่าน LINE หรือ Facebook' },
  { id: 'อื่นๆ', label: 'อื่นๆ', icon: HelpCircle, hint: 'เอกสารราชการ ทะเบียนบ้าน หรือใบสำคัญอื่นๆ' },
];

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  caseId,
  initialType,
}) => {
  const { addDocument } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<string>(initialType || 'สัญญา');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('1.8 MB');
  const [notes, setNotes] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectMockFile = (name: string) => {
    setFileName(name);
    setUploadError(null);
    setStep(3); // Go to preview
  };

  const handleCustomFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setUploadError('ยังส่งเอกสารไม่ได้ ขนาดไฟล์ต้องไม่เกิน 25MB');
        return;
      }
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setUploadError(null);
      setStep(3);
    }
  };

  const handleSendToLawyer = () => {
    if (!fileName) {
      setUploadError('ยังส่งเอกสารไม่ได้ กรุณาเลือกไฟล์เอกสารก่อน');
      return;
    }

    addDocument(caseId, {
      title: fileName,
      type: selectedType,
      status: 'กำลังตรวจ', // Sets status to "กำลังตรวจ" as required by section 19 & 27
      date: 'วันนี้',
      fileSize: fileSize || '1.2 MB',
      uploadedBy: 'ลูกความ',
      notes: notes.trim() || undefined,
      relatedEventIds: [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              {step}/3
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {step === 1
                ? 'คุณต้องการส่งเอกสารอะไร?'
                : step === 2
                ? 'เลือกไฟล์เอกสาร'
                : 'ตรวจสอบข้อมูลก่อนส่งให้ทนาย'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* STEP 1: คุณต้องการส่งเอกสารอะไร? (Section 18) */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600">
                เลือกประเภทของเอกสารที่ต้องการส่งให้ทนายความของคุณ:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {DOC_TYPES.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedType(t.id);
                        setStep(2);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="text-sm font-semibold">{t.label}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-normal leading-tight">
                        {t.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: เลือกไฟล์ (Section 18) */}
          {step === 2 && (
            <div className="space-y-4 text-center">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:border-emerald-500 transition bg-slate-50/50">
                <FileUp className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-900">
                  เลือกไฟล์สำหรับ: {selectedType}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  รองรับไฟล์ PDF, JPG, PNG หรือไฟล์เอกสาร
                </p>

                <div className="mt-4">
                  <label className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition">
                    <span>เลือกไฟล์จากเครื่อง</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleCustomFileInput}
                    />
                  </label>
                </div>
              </div>

              {/* Quick simulation for demonstration */}
              <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1 font-semibold">
                  หรือเลือกตัวอย่างไฟล์สำหรับทดสอบ:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSelectMockFile(`ไฟล์_${selectedType}_ฉบับสแกน.pdf`)}
                    className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    📄 ไฟล์_{selectedType}_ฉบับสแกน.pdf
                  </button>
                  <button
                    onClick={() => handleSelectMockFile(`รูปภาพหลักฐาน_${selectedType}.jpg`)}
                    className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    🖼️ รูปภาพหลักฐาน_{selectedType}.jpg
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & CONFIRM (Section 18) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ชื่อไฟล์:</span>
                  <span className="font-bold text-slate-900">{fileName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ประเภทเอกสาร:</span>
                  <span className="font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {selectedType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">วันที่ส่ง:</span>
                  <span className="text-slate-700 font-medium">วันนี้</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ขนาดไฟล์:</span>
                  <span className="text-slate-700">{fileSize}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ข้อความเพิ่มเติมถึงทนาย (ถ้ามี)
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น สัญญาฉบับนี้เซ็นเมื่อเดือนมกราคม..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Error Message Format (Section 19: “ยังส่งเอกสารไม่ได้” “ตรวจสอบประเภทไฟล์และลองอีกครั้ง”) */}
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  <div className="font-bold">{uploadError}</div>
                  <div className="text-[11px] text-red-600 mt-0.5">
                    ตรวจสอบประเภทไฟล์และลองอีกครั้ง
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ย้อนกลับ</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              ยกเลิก
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((step + 1) as any)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>ต่อไป</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            /* Button: “ส่งให้ทนาย” (Section 18) */
            <button
              onClick={handleSendToLawyer}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>ส่งให้ทนาย</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
