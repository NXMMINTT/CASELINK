import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Settings,
  Building,
  Shield,
  Bell,
  HardDrive,
  RotateCcw,
  Download,
  Check,
  User,
  ShieldCheck,
  Lock,
  Smartphone,
  ExternalLink,
  Scale,
  LogOut,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { cases, resetDemoData, setShowPrivacyModal, setActiveLawyerNav, logoutUser } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'storage' | 'privacy'>('profile');
  const [lawyerName, setLawyerName] = useState('ทนายสมชาย รัตนกุล');
  const [licenseNo, setLicenseNo] = useState('1452/2558');
  const [lawFirm, setLawFirm] = useState('สำนักงานกฎหมาย สมชายและเพื่อนทนายความ');
  const [phone, setPhone] = useState('081-234-5678');
  const [emailNotify, setEmailNotify] = useState(true);
  const [deadlineAlertDays, setDeadlineAlertDays] = useState('3');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const totalEvents = cases.reduce((acc, c) => acc + c.events.length, 0);
  const totalDocs = cases.reduce((acc, c) => acc + c.documents.length, 0);
  const totalPeople = cases.reduce((acc, c) => acc + c.people.length, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `caselink-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                ตั้งค่าระบบและสำนักงาน
              </h3>
              <p className="text-xs text-slate-500">
                จัดการข้อมูลโปรไฟล์ทนายความ การแจ้งเตือน และข้อมูลสำรอง
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

        {/* Tab navigation */}
        <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/30 text-xs font-semibold space-x-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ข้อมูลสำนักงาน
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-2.5 border-b-2 transition ${
              activeTab === 'notifications'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            การแจ้งเตือน
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`pb-2.5 border-b-2 transition ${
              activeTab === 'storage'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ข้อมูลและการสำรอง
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 border-b-2 transition flex items-center space-x-1 ${
              activeTab === 'privacy'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ความปลอดภัย & Zero-Knowledge</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อทนายความผู้ดูแลคดี
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={lawyerName}
                    onChange={(e) => setLawyerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เลขที่ใบอนุญาตว่าความ
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={licenseNo}
                      onChange={(e) => setLicenseNo(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เบอร์โทรศัพท์ติดต่อ
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อสำนักงานกฎหมาย / บริษัท
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={lawFirm}
                    onChange={(e) => setLawFirm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs font-semibold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>บันทึกการตั้งค่าเรียบร้อยแล้ว</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">แจ้งเตือนกำหนดนัดศาลล่วงหน้า</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      ส่งข้อความแจ้งเตือนเมื่อใกล้ถึง Deadline ยื่นเอกสาร
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotify}
                    onChange={(e) => setEmailNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-600">เตือนล่วงหน้า (วัน):</span>
                  <select
                    value={deadlineAlertDays}
                    onChange={(e) => setDeadlineAlertDays(e.target.value)}
                    className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-semibold text-xs cursor-pointer"
                  >
                    <option value="1">1 วัน</option>
                    <option value="3">3 วัน</option>
                    <option value="7">7 วัน</option>
                    <option value="14">14 วัน</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">แจ้งเตือนเมื่อลูกความอัปโหลดเอกสาร</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    แสดงแถบสีแดงในหน้ารายการคดีเมื่อมีเอกสารใหม่รอตรวจ
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* LINE Official Bot Launcher */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-[#06C755] text-white">
                      <Smartphone className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      ระบบ LINE Official Bot แจ้งเตือนลูกความ
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#06C755] text-white font-bold px-2 py-0.5 rounded-full">
                    พร้อมใช้งาน
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ส่งข้อความการ์ด Flex Message แจ้งวันนัดศาล, อัปเดตความคืบหน้าคดี, และทวงถามเอกสารเข้า LINE ลูกความโดยตรง
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveLawyerNav('line_bot');
                  }}
                  className="w-full py-2 px-3 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-xs"
                >
                  <span>เปิดระบบ LINE Official Bot สำหรับทนายความ</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-700/60 text-white space-y-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm">คำรับรองสถาปัตยกรรม Zero-Knowledge Vault</span>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  CASELINK ไม่มีการเก็บข้อมูลสำนวนคดี พยานหลักฐาน สัญญา หรือคำให้การบนเซิร์ฟเวอร์ส่วนกลาง (Server-less Data Retention) ข้อมูลทั้งหมดจะถูกบันทึกในหน่วยความจำของอุปกรณ์ที่คุณใช้งานเท่านั้น
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="font-bold text-slate-900 flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>การคุ้มครองตามกฎหมายและมรรยาททนายความไทย</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <div>
                    <strong>• มรรยาททนายความ พ.ศ. 2529 ข้อ 14:</strong> คุ้มครองความลับของลูกความ (Attorney-Client Privilege) ป้องกันความเสี่ยงจากการถูกแฮกหรือข้อมูลรั่วไหลผ่านคลาวด์
                  </div>
                  <div>
                    <strong>• ประมวลกฎหมายอาญา มาตรา 323:</strong> คุ้มครองความลับในทางวิชาชีพ ปราศจากความเสี่ยงทางอาญา
                  </div>
                  <div>
                    <strong>• พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA):</strong> คุณเป็นผู้ควบคุมข้อมูล (Data Controller) แต่เพียงผู้เดียว มีสิทธิ์ส่งออกหรือทำลายข้อมูลได้ทันที
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-indigo-950 text-xs">อ่านคำรับรองและนโยบายฉบับเต็ม</div>
                  <div className="text-[11px] text-indigo-700">ตรวจสอบรายละเอียดเงื่อนไขความปลอดภัยและข้อกำหนดสิทธิ</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  เปิดอ่านนโยบาย
                </button>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-5 text-xs sm:text-sm">
              {/* Storage Stats */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  <span>ข้อมูลที่จัดเก็บในอุปกรณ์ (LocalStorage)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-lg font-bold text-slate-900">{cases.length}</div>
                    <div className="text-[11px] text-slate-500">คดีทั้งหมด</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-lg font-bold text-slate-900">{totalEvents}</div>
                    <div className="text-[11px] text-slate-500">เหตุการณ์</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-lg font-bold text-slate-900">{totalDocs}</div>
                    <div className="text-[11px] text-slate-500">เอกสาร</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-lg font-bold text-slate-900">{totalPeople}</div>
                    <div className="text-[11px] text-slate-500">บุคคล</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleExportData}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>ดาวน์โหลดไฟล์สำรองข้อมูลคดี (JSON)</span>
                </button>

                <button
                  onClick={() => {
                    resetDemoData();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl font-semibold text-red-700 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-red-600" />
                  <span>รีเซ็ตข้อมูลตัวอย่างทั้งหมดเป็นค่าเริ่มต้น</span>
                </button>

                <button
                  onClick={() => {
                    logoutUser();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl font-semibold text-slate-700 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-slate-600" />
                  <span>ออกจากระบบ (Sign Out เพื่อสลับบัญชีหรือลงทะเบียนใหม่)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
