import React from 'react';
import {
  X,
  Shield,
  HardDrive,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>คำชี้แจงความเป็นส่วนตัว & ข้อจำกัดของระบบเดโม</span>
                <span className="text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded-full">
                  Static Demo Prototype
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                CASELINK — เดโมต้นแบบสำหรับทดลองการใช้งานบน GitHub Pages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Key Statement Banner */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 space-y-1.5">
            <div className="flex items-center space-x-2 font-bold text-sm text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>คำเตือนสำคัญ: ห้ามใส่ข้อมูลลูกความจริงหรือเอกสารคดีจริง</span>
            </div>
            <p className="text-xs text-amber-100/90 leading-normal">
              เว็บไซต์นี้เป็นเพียงต้นแบบสาธิตแนวคิดการทำงาน (Prototype Demo) เผยแพร่แบบ Static Web บน GitHub Pages
              ไม่มีระบบ Backend หรือฐานข้อมูลสำหรับความปลอดภัยระดับ Production กรุณาใช้ข้อมูลสมมติในการทดลองเท่านั้น
            </p>
          </div>

          {/* Section 1: Storage Mechanism */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <HardDrive className="w-4 h-4 text-sky-400" />
              <span>1. วิธีการจัดเก็บข้อมูลของเดโม (Browser LocalStorage)</span>
            </div>
            <div className="pl-6 space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>เก็บในเครื่องของคุณเท่านั้น:</strong> ข้อมูลคดีตัวอย่าง เหตุการณ์ในไทม์ไลน์ และสถานะการตรวจสอบ จะถูกบันทึกไว้ในหน่วยความจำของเว็บเบราว์เซอร์เครื่องนี้ (LocalStorage) เท่านั้น ไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์ภายนอก
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>ไม่ซิงก์ข้ามเครื่อง:</strong> การแก้ไขข้อมูลในเครื่องนี้จะไม่ปรากฏบนอุปกรณ์อื่น และหากล้างแคชของเบราว์เซอร์หรือกด "รีเซ็ตเดโม" ข้อมูลจะกลับเป็นค่าเริ่มต้น
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Account & Role Switching */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>2. การสลับบทบาทและการเข้าสู่ระบบในเดโม</span>
            </div>
            <div className="pl-6 space-y-1.5 text-xs text-slate-400">
              <p>
                ปุ่มสลับบทบาทระหว่าง "ทนายความ" และ "ลูกความ" หรือการเข้าสู่ระบบในเดโมนี้
                <strong>ไม่ใช่ระบบยืนยันตัวตน (Authentication) หรือระบบควบคุมสิทธิ์ (Authorization) จริง</strong>
                เป็นเพียงการสลับมุมมองหน้าจอเพื่อทดสอบประสบการณ์ผู้ใช้ (UX/UI) เท่านั้น และไม่มีการจัดเก็บรหัสผ่านจริง
              </p>
            </div>
          </div>

          {/* Section 3: Simulated Features (LINE, AI, File Uploads) */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>3. ฟังก์ชันจำลอง (LINE Official, AI, การอัปโหลดไฟล์)</span>
            </div>
            <div className="pl-6 space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>การเลือกไฟล์:</strong> การเลือกไฟล์เป็นการจำลองชื่อและขนาดไฟล์เพื่อแสดงตัวอย่างในหน้าจอเท่านั้น ไม่มีการอัปโหลดไฟล์จริงหรือจัดเก็บไฟล์ต้นฉบับ
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>LINE Official:</strong> เป็นการจำลองแสดงตัวอย่างหน้าจอสมาร์ตโฟน ไม่มีการเรียก LINE Messaging API จริง และไม่มีการขอหรือบันทึก Token จริง
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>การจัดโครงสร้างและสรุปคดี:</strong> เป็นการจำลองผลลัพธ์ภายในเบราว์เซอร์ ไม่มีการส่งข้อความออกภายนอก และไม่ได้ให้คำแนะนำทางกฎหมายใดๆ
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Limitation & Legal Disclaimer */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <Info className="w-4 h-4 text-amber-400" />
              <span>4. ข้อจำกัดความรับผิดชอบ (Disclaimer)</span>
            </div>
            <p className="text-slate-400 text-xs pl-6">
              ระบบนี้มิได้ให้คำปรึกษาทางกฎหมาย และยังไม่ผ่านการตรวจสอบรับรองมาตรฐานด้านความปลอดภัยสารสนเทศหรือมรรยาทวิชาชีพโดยผู้เชี่ยวชาญ การนำไปพัฒนาต่อเพื่อใช้งานจริงจะต้องติดตั้งระบบจัดเก็บข้อมูลและมาตรการรักษาความปลอดภัยที่ได้มาตรฐานตามกฎหมายที่เกี่ยวข้องต่อไป
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-amber-400" />
            <span>ต้นแบบสาธิตสำหรับทดลองใช้งาน — ข้อมูลสมมติ</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
          >
            รับทราบและปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
