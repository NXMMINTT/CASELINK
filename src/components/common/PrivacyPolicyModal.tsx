import React from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  HardDrive,
  EyeOff,
  FileText,
  AlertTriangle,
  Scale,
  Cpu,
  CheckCircle2,
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
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>คำรับรองความปลอดภัย & นโยบายความเป็นส่วนตัว</span>
                <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                  Zero-Knowledge Architecture
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                CASELINK — ออกแบบสำหรับทนายความและวิชาชีพกฎหมาย ปราศจากการเก็บข้อมูลบนเซิร์ฟเวอร์
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
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-600/40 text-emerald-200 space-y-1.5">
            <div className="flex items-center space-x-2 font-bold text-sm text-white">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>คำมั่นสัญญาสำคัญ: ข้อมูลสำนวนคดีทั้งหมดอยู่บนอุปกรณ์ของคุณ 100%</span>
            </div>
            <p className="text-xs text-emerald-300/90 leading-normal">
              CASELINK ไม่จัดเก็บข้อมูลสำนวนคดี พยานหลักฐาน รายชื่อคู่ความ หรือโน้ตยุทธวิธีใดๆ บนเครื่องแม่ข่าย (Central Server) ของเรา ข้อมูลของคุณจะไม่ถูกบันทึกในฐานข้อมูลภายนอก และไม่มีใครสามารถเข้าถึงข้อมูลของคุณได้นอกจากตัวคุณเอง
            </p>
          </div>

          {/* Section 1: Professional Ethics & Privilege */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <Scale className="w-4 h-4 text-purple-400" />
              <span>1. สอดคล้องกับมรรยาททนายความและเอกสิทธิ์ความลับของลูกความ</span>
            </div>
            <p className="text-slate-400 text-xs pl-6">
              ตาม **ข้อบังคับสภาทนายความว่าด้วยมรรยาททนายความ พ.ศ. 2529 (ข้อ 14)**, **พ.ร.บ. ทนายความ พ.ศ. 2528** และ **ประมวลกฎหมายอาญา มาตรา 323** ทนายความและผู้ประกอบวิชาชีพกฎหมายมีหน้าที่รักษาความลับของลูกความ (Attorney-Client Privilege) โดยมีโทษทางอาญาจำคุกไม่เกิน 6 เดือน ปรับไม่เกิน 10,000 บาท หรือถูกถอนใบอนุญาตว่าความหากข้อมูลรั่วไหล การนำสำนวนคดีไปฝากไว้บน Cloud ทั่วไปจึงมีความเสี่ยงสูง CASELINK จึงถูกสร้างด้วยแนวคิด **Local-First & Client-Device Storage** เพื่อขจัดความเสี่ยงนี้ตั้งแต่ระดับสถาปัตยกรรม
            </p>
          </div>

          {/* Section 2: Storage Mechanism */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <HardDrive className="w-4 h-4 text-sky-400" />
              <span>2. กลไกการจัดเก็บข้อมูลและการเข้าสู่ระบบ (Local Device Vault)</span>
            </div>
            <div className="pl-6 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>**บัญชีผู้ใช้และการลงทะเบียน:** ข้อมูลการสมัครสมาชิกและรหัสผ่านจะถูกบันทึกลงในคลังรหัสผ่านเฉพาะในอุปกรณ์ของคุณ (Local Vault) เพื่อความสะดวกในการจดจำเซสชัน</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>**ไม่มีการส่งสำนวนคดีขึ้นฐานข้อมูล:** ผัง Mind Map, เอกสารสัญญา, พิกัดการเชื่อมโยง, และการคำนวณค่าเสียหาย ถูกบันทึกไว้ใน Browser Storage ของเครื่องที่คุณใช้งานเท่านั้น</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>**การสำรองและย้ายเครื่อง:** คุณสามารถกด "ดาวน์โหลดไฟล์สำรองข้อมูล (JSON Backup)" เพื่อเก็บรักษาไว้ใน Flash Drive หรือย้ายไปเปิดบนคอมพิวเตอร์เครื่องอื่นได้อย่างสมบูรณ์</span>
              </div>
            </div>
          </div>

          {/* Section 3: AI Processing Transparency */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>3. ความโปร่งใสเมื่อใช้งานฟีเจอร์ AI (Transient AI Processing)</span>
            </div>
            <div className="pl-6 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>เมื่อคุณกดใช้งาน **"✨ จัดโครงสร้างด้วย AI"** หรือ **"สรุปบทเรียนคดี"** เฉพาะข้อความที่คุณยินยอมให้ส่งเท่านั้นจะถูกส่งผ่านช่องทางเข้ารหัส (TLS 1.3) ไปประมวลผลโครงสร้าง</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>**ไม่มีการนำข้อมูลไปฝึกสอน AI (No Model Training):** ข้อมูลคดีจะไม่ถูกนำไปใช้เทรนหรือปรับปรุงโมเดล AI สาธารณะ และไม่มีการเก็บบันทึกประวัติบน Server ของ CASELINK</span>
              </div>
            </div>
          </div>

          {/* Section 4: PDPA & User Rights */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <EyeOff className="w-4 h-4 text-amber-400" />
              <span>4. สิทธิในการควบคุมและลบข้อมูล (PDPA & Data Ownership)</span>
            </div>
            <p className="text-slate-400 text-xs pl-6">
              คุณมีอำนาจสิทธิ์ขาดในข้อมูลทั้งหมด 100% คุณสามารถลบข้อมูลคดี ล้างแคช หรือรีเซ็ตข้อมูลทั้งหมดได้ทุกเมื่อในเมนู **ตั้งค่าระบบ ➔ ล้างข้อมูล** โดยข้อมูลจะถูกทำลายถาวรจากอุปกรณ์ของคุณทันที
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>รับรองมาตรฐาน Zero-Knowledge Client Architecture</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
          >
            รับทราบและเข้าใจนโยบาย
          </button>
        </div>
      </div>
    </div>
  );
};
