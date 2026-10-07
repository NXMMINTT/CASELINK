import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  MessageSquare,
  Smartphone,
  Send,
  Bell,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Shield,
  HelpCircle,
  QrCode,
  Sparkles,
  ExternalLink,
  Clock,
  User,
  Settings,
  RefreshCw,
  Phone,
  Lock,
} from 'lucide-react';

interface LineBotSettings {
  channelName: string;
  channelId: string;
  channelSecret: string;
  channelAccessToken: string;
  basicId: string;
  isLiveMode: boolean;
}

const DEFAULT_LINE_SETTINGS: LineBotSettings = {
  channelName: 'CASELINK Alert - ทนายความประจำตัว',
  channelId: '2005891234',
  channelSecret: '••••••••••••••••••••••••••••••••',
  channelAccessToken: '',
  basicId: '@caselink_lawyer',
  isLiveMode: false,
};

const LOCAL_STORAGE_KEY_LINE_SETTINGS = 'caselink_line_bot_settings_v1';
const LOCAL_STORAGE_KEY_LINE_LOGS = 'caselink_line_bot_logs_v1';

export const LineBotIntegrationView: React.FC = () => {
  const { cases, currentCase, setSelectedCaseId, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'send' | 'settings' | 'logs' | 'guide'>('send');

  // Load saved settings
  const [settings, setSettings] = useState<LineBotSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LINE_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_LINE_SETTINGS;
  });

  const [settingsSaved, setSettingsSaved] = useState(false);

  // Template Form State
  const [selectedCaseForAlert, setSelectedCaseForAlert] = useState<string>(
    currentCase?.id || cases[0]?.id || ''
  );
  const [templateType, setTemplateType] = useState<
    'hearing' | 'milestone' | 'document_request' | 'verdict'
  >('hearing');

  // Template Fields
  const activeCase = cases.find((c) => c.id === selectedCaseForAlert) || currentCase || cases[0];

  const [customCourt, setCustomCourt] = useState('ศาลแพ่งกรุงเทพใต้');
  const [customHearingDate, setCustomHearingDate] = useState('24 พ.ย. 2569');
  const [customHearingTime, setCustomHearingTime] = useState('09:00 น.');
  const [customChamber, setCustomChamber] = useState('ห้องพิจารณาคดี 402 (บัลลังก์ 4)');
  const [customHearingAgenda, setCustomHearingAgenda] = useState('นัดพร้อมเพื่อกำหนดวันสืบพยานโจทก์-จำเลย และเจรจาไกล่เกลี่ย');
  const [customPreparation, setCustomPreparation] = useState('นำบัตรประชาชนตัวจริง และสำเนาสัญญาว่าจ้างฉบับจริงมาด้วย');

  const [customMilestoneTitle, setCustomMilestoneTitle] = useState('ทนายยื่นคำฟ้องและเอกสารต่อศาลเรียบร้อยแล้ว');
  const [customMilestoneDesc, setCustomMilestoneDesc] = useState('ศาลมีคำสั่งรับคำฟ้องเป็นคดีหมายเลขดำที่ พ. 892/2569 แล้ว อยู่ระหว่างส่งหมายเรียกให้คู่กรณี');

  const [customDocList, setCustomDocList] = useState('1. สลิปโอนเงินงวดสุดท้าย\n2. ภาพถ่ายบทสนทนา Line ฉบับเต็ม\n3. หนังสือบอกกล่าวทวงถาม');
  const [customDocDeadline, setCustomDocDeadline] = useState('ภายในวันที่ 15 พ.ย. 2569');

  const [customVerdictTitle, setCustomVerdictTitle] = useState('ศาลมีคำพิพากษาให้ฝ่ายเราชนะคดี');
  const [customVerdictDesc, setCustomVerdictDesc] = useState('ศาลสั่งให้คู่กรณีชำระเงินต้นพร้อมดอกเบี้ย และค่าฤชาธรรมเนียมแทนโจทก์');

  // Interactive feedback
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessToast, setSendSuccessToast] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Delivery logs
  interface LineLogItem {
    id: string;
    timestamp: string;
    clientName: string;
    caseTitle: string;
    templateName: string;
    status: 'delivered' | 'simulated';
  }

  const [logs, setLogs] = useState<LineLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LINE_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'log-1',
        timestamp: '1 วันที่แล้ว (10:15 น.)',
        clientName: 'นายสมชาย มั่นคง',
        caseTitle: 'คดีพิพาทสัญญาจะซื้อจะขายที่ดิน',
        templateName: 'แจ้งเตือนวันนัดศาล',
        status: 'simulated',
      },
    ];
  });

  const saveSettings = (newSettings: LineBotSettings) => {
    setSettings(newSettings);
    localStorage.setItem(LOCAL_STORAGE_KEY_LINE_SETTINGS, JSON.stringify(newSettings));
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleSendNotification = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      const templateNameMap = {
        hearing: 'แจ้งเตือนวันนัดศาล',
        milestone: 'แจ้งความคืบหน้าคดี',
        document_request: 'ขอเอกสารเพิ่มเติม',
        verdict: 'สรุปผลคำพิพากษาศาล',
      };

      const newLog: LineLogItem = {
        id: `log-${Date.now()}`,
        timestamp: 'เพิ่งจำลองเมื่อสักครู่',
        clientName: activeCase?.clientName || 'ลูกความ',
        caseTitle: activeCase?.title || 'คดี',
        templateName: templateNameMap[templateType],
        status: 'simulated',
      };

      const updatedLogs = [newLog, ...logs];
      setLogs(updatedLogs);
      localStorage.setItem(LOCAL_STORAGE_KEY_LINE_LOGS, JSON.stringify(updatedLogs));

      setSendSuccessToast(
        `[โหมดจำลอง] แสดงตัวอย่าง Flex Message (${templateNameMap[templateType]}) สำเร็จ — ไม่มีการส่ง LINE จริง`
      );
      setTimeout(() => setSendSuccessToast(null), 4000);
    }, 500);
  };

  const handleCopyClientLink = () => {
    const link = `https://caselink.app/client-portal?case=${activeCase?.id || 'demo'}&pin=1234`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150 text-slate-800 pb-12">
      {/* Top Banner / Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-emerald-200 text-slate-900 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none hidden" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 bg-[#06C755] text-white font-bold text-xs rounded-full flex items-center space-x-1.5 shadow-sm">
                <span>LINE Official (โหมดจำลอง)</span>
              </span>
              <span className="text-xs bg-white text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
                Simulation Only — ไม่มีการส่ง API จริง
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              จำลองระบบแจ้งเตือนลูกความผ่าน LINE Official
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              ทดลองดูรูปแบบข้อความ Flex Card แจ้งวันนัดศาล อัปเดตสถานะคดี และทวงถามเอกสารในหน้าต่างจำลองสมาร์ตโฟน
              (เดโมนี้เป็นแบบจำลองบน GitHub Pages ไม่มีการเชื่อมต่อ LINE API ภายนอก และไม่บันทึก Token จริง)
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-4 py-2.5 bg-slate-50/80 hover:bg-slate-100 text-slate-900 text-xs font-semibold rounded-xl border border-slate-200 flex items-center space-x-2 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>QR Code (ตัวอย่างจำลอง)</span>
            </button>

            <button
              onClick={handleCopyClientLink}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-2 transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'คัดลอกลิงก์ตัวอย่างแล้ว' : 'ลิงก์พอร์ทัล (ตัวอย่างจำลอง)'}</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('send')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'send'
                ? 'bg-[#06C755] text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-100 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>สร้างและจำลองการแจ้งเตือน</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-100 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>ตั้งค่า Custom LINE Bot</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-slate-100 text-slate-900 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>ประวัติการแจ้งเตือน ({logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-100 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>คู่มือสร้างบอทฟรี 3 นาที</span>
          </button>
        </div>
      </div>

      {/* Success notification banner */}
      {sendSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-900 text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-emerald-950">ส่งข้อความเข้า LINE เรียบร้อยแล้ว</div>
              <div className="text-xs text-emerald-700 font-normal">{sendSuccessToast}</div>
            </div>
          </div>
          <button
            onClick={() => setSendSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-950 text-xs px-2 py-1 rounded"
          >
            ปิด
          </button>
        </div>
      )}

      {/* TAB 1: SEND NOTIFICATIONS */}
      {activeTab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Template Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Case & Client Selector */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>เลือกลูกความและคดีเป้าหมาย</span>
                </label>
                <span className="text-[11px] text-slate-400">ดึงข้อมูลอัตโนมัติจากสำนวนคดี</span>
              </div>

              <select
                value={selectedCaseForAlert}
                onChange={(e) => setSelectedCaseForAlert(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer bg-slate-50/50"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} — ลูกความ: {c.clientName} (สถานะ: {c.status})
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500">ลูกความ: </span>
                  <span className="font-bold text-slate-800">{activeCase?.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-500">ประเภทคดี: </span>
                  <span className="font-bold text-slate-800">{activeCase?.type}</span>
                </div>
                <div>
                  <span className="text-slate-500">LINE ID: </span>
                  <span className="font-bold text-emerald-600">@ลูกความเชื่อมโยงแล้ว</span>
                </div>
              </div>
            </div>

            {/* Template Selector Cards */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>เลือกรูปแบบข้อความแจ้งเตือนอัตโนมัติ (Automated Flex Templates)</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTemplateType('hearing')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    templateType === 'hearing'
                      ? 'border-[#06C755] bg-emerald-50/70 ring-1 ring-[#06C755] text-emerald-950 font-bold'
                      : 'border-slate-250 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Calendar className="w-5 h-5 text-emerald-600 mb-2" />
                  <div className="text-xs">เตือนนัดศาล</div>
                  <div className="text-[10px] text-slate-500 font-normal">วัน เวลา บัลลังก์</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTemplateType('milestone')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    templateType === 'milestone'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600 text-indigo-950 font-bold'
                      : 'border-slate-250 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-indigo-600 mb-2" />
                  <div className="text-xs">ความคืบหน้าคดี</div>
                  <div className="text-[10px] text-slate-500 font-normal">ยื่นฟ้อง/หมายศาล</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTemplateType('document_request')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    templateType === 'document_request'
                      ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500 text-amber-950 font-bold'
                      : 'border-slate-250 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <FileText className="w-5 h-5 text-amber-600 mb-2" />
                  <div className="text-xs">ขอเอกสารเพิ่ม</div>
                  <div className="text-[10px] text-slate-500 font-normal">ทวงถามสลิป/สัญญา</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTemplateType('verdict')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    templateType === 'verdict'
                      ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600 text-purple-950 font-bold'
                      : 'border-slate-250 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mb-2" />
                  <div className="text-xs">สรุปคำพิพากษา</div>
                  <div className="text-[10px] text-slate-500 font-normal">ผลคดี/ระยะอุทธรณ์</div>
                </button>
              </div>

              {/* Dynamic Edit Form based on Template */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3.5 text-xs">
                {templateType === 'hearing' && (
                  <>
                    <div className="font-bold text-slate-800 text-sm flex items-center space-x-1.5 text-emerald-800">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>กรอกรายละเอียดนัดพิจารณาคดี</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ศาลที่นัด
                        </label>
                        <input
                          type="text"
                          value={customCourt}
                          onChange={(e) => setCustomCourt(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ห้องพิจารณา / บัลลังก์
                        </label>
                        <input
                          type="text"
                          value={customChamber}
                          onChange={(e) => setCustomChamber(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          วันที่นัด
                        </label>
                        <input
                          type="text"
                          value={customHearingDate}
                          onChange={(e) => setCustomHearingDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold text-emerald-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          เวลา
                        </label>
                        <input
                          type="text"
                          value={customHearingTime}
                          onChange={(e) => setCustomHearingTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        วาระการนัด (Agenda)
                      </label>
                      <input
                        type="text"
                        value={customHearingAgenda}
                        onChange={(e) => setCustomHearingAgenda(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        สิ่งที่ลูกความต้องเตรียมตัว
                      </label>
                      <input
                        type="text"
                        value={customPreparation}
                        onChange={(e) => setCustomPreparation(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </>
                )}

                {templateType === 'milestone' && (
                  <>
                    <div className="font-bold text-slate-800 text-sm flex items-center space-x-1.5 text-indigo-800">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>กรอกความคืบหน้าของคดี</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        หัวข้อความคืบหน้า
                      </label>
                      <input
                        type="text"
                        value={customMilestoneTitle}
                        onChange={(e) => setCustomMilestoneTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold text-indigo-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        รายละเอียดการดำเนินงานและขั้นตอนถัดไป
                      </label>
                      <textarea
                        rows={3}
                        value={customMilestoneDesc}
                        onChange={(e) => setCustomMilestoneDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </>
                )}

                {templateType === 'document_request' && (
                  <>
                    <div className="font-bold text-slate-800 text-sm flex items-center space-x-1.5 text-amber-800">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span>รายการเอกสารที่ขอให้ลูกความส่งเพิ่ม</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        รายการเอกสารที่ต้องการ (แยกบรรทัด)
                      </label>
                      <textarea
                        rows={3}
                        value={customDocList}
                        onChange={(e) => setCustomDocList(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        กำหนดส่งเอกสาร
                      </label>
                      <input
                        type="text"
                        value={customDocDeadline}
                        onChange={(e) => setCustomDocDeadline(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold text-amber-900"
                      />
                    </div>
                  </>
                )}

                {templateType === 'verdict' && (
                  <>
                    <div className="font-bold text-slate-800 text-sm flex items-center space-x-1.5 text-purple-800">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      <span>สรุปผลคำพิพากษาหรือคำสั่งศาล</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        หัวข้อผลคำตัดสิน
                      </label>
                      <input
                        type="text"
                        value={customVerdictTitle}
                        onChange={(e) => setCustomVerdictTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold text-purple-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        รายละเอียดคำสั่งศาลและสิทธิการอุทธรณ์
                      </label>
                      <textarea
                        rows={3}
                        value={customVerdictDesc}
                        onChange={(e) => setCustomVerdictDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleSendNotification}
                  disabled={isSending}
                  className="w-full sm:flex-1 py-3 px-5 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-xl shadow-sm flex items-center justify-center space-x-2 transition cursor-pointer text-sm"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>กำลังจำลองการส่งเข้า LINE...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        จำลองการแจ้งเตือนเข้า LINE ลูกความ ({activeCase?.clientName || 'ลูกความ'})
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyClientLink}
                  className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>คัดลอกข้อความ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Smartphone Mockup (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>ภาพตัวอย่างบนหน้าจอโทรศัพท์ลูกความ (Live LINE Preview)</span>
            </div>

            {/* Smartphone Bezel */}
            <div className="w-[320px] sm:w-[350px] bg-white rounded-[42px] p-3 shadow-lg border-4 border-slate-200 relative">
              {/* Camera notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-white rounded-full z-20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-50" />
              </div>

              {/* Phone Screen Area */}
              <div className="w-full bg-[#8CABD9] rounded-[34px] overflow-hidden flex flex-col min-h-[580px] text-slate-800 shadow-inner">
                {/* LINE Chat Header */}
                <div className="bg-[#202736] text-white px-4 pt-8 pb-3 flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#06C755] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                      ⚖️
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-tight flex items-center space-x-1">
                        <span>{settings.channelName}</span>
                        <span className="text-[9px] bg-emerald-500 text-white px-1 rounded">✓</span>
                      </div>
                      <div className="text-[10px] text-slate-400">บัญชีทางการ (Official Bot)</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-emerald-400 font-mono">10:45</div>
                </div>

                {/* LINE Chat Message Stream */}
                <div className="p-3 flex-1 flex flex-col justify-end space-y-3 overflow-y-auto">
                  {/* Date badge */}
                  <div className="flex justify-center">
                    <span className="text-[10px] bg-black/20 text-white px-2.5 py-0.5 rounded-full font-medium">
                      วันนี้
                    </span>
                  </div>

                  {/* LINE Flex Message Card (The core alert) */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 text-left animate-in zoom-in-95 duration-150">
                    {/* Flex Card Header */}
                    <div
                      className={`p-3 text-white ${
                        templateType === 'hearing'
                          ? 'bg-[#06C755]'
                          : templateType === 'milestone'
                          ? 'bg-indigo-600'
                          : templateType === 'document_request'
                          ? 'bg-amber-600'
                          : 'bg-purple-600'
                      }`}
                    >
                      <div className="text-[10px] font-semibold opacity-90 uppercase tracking-wide">
                        {templateType === 'hearing' && '⚖️ แจ้งเตือนวันนัดพิจารณาคดี'}
                        {templateType === 'milestone' && '📌 อัปเดตความคืบหน้าสำนวนคดี'}
                        {templateType === 'document_request' && '📄 ขอส่งเอกสารพยานเพิ่มเติม'}
                        {templateType === 'verdict' && '🏆 แจ้งผลคำสั่ง / คำพิพากษาศาล'}
                      </div>
                      <div className="text-sm font-bold mt-0.5 leading-snug">
                        คดี: {activeCase?.title || 'พิพาทสัญญา'}
                      </div>
                    </div>

                    {/* Flex Card Body */}
                    <div className="p-3.5 space-y-2 text-xs">
                      {templateType === 'hearing' && (
                        <>
                          <div className="flex justify-between border-b border-slate-100 pb-1.5">
                            <span className="text-slate-500">วัน-เวลานัด:</span>
                            <span className="font-bold text-emerald-700">
                              {customHearingDate} ({customHearingTime})
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-1.5">
                            <span className="text-slate-500">ศาล:</span>
                            <span className="font-semibold text-slate-800">{customCourt}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-1.5">
                            <span className="text-slate-500">ห้องพิจารณา:</span>
                            <span className="font-semibold text-slate-800">{customChamber}</span>
                          </div>
                          <div className="space-y-0.5 pt-1">
                            <span className="text-[11px] text-slate-500">วาระการนัด:</span>
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-950 font-medium text-[11px]">
                              {customHearingAgenda}
                            </div>
                          </div>
                          <div className="space-y-0.5 pt-1">
                            <span className="text-[11px] text-slate-500">สิ่งที่ต้องเตรียม:</span>
                            <div className="p-2 rounded-lg bg-slate-50 text-slate-700 text-[11px]">
                              {customPreparation}
                            </div>
                          </div>
                        </>
                      )}

                      {templateType === 'milestone' && (
                        <>
                          <div className="font-bold text-indigo-900 text-sm">
                            {customMilestoneTitle}
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            {customMilestoneDesc}
                          </p>
                          <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                            <span>สถานะปัจจุบัน:</span>
                            <span className="font-bold text-indigo-700">{activeCase?.status}</span>
                          </div>
                        </>
                      )}

                      {templateType === 'document_request' && (
                        <>
                          <div className="font-bold text-amber-900 text-sm">
                            ต้องการเอกสารเพิ่มเติมสำหรับทำสำนวน
                          </div>
                          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-mono text-[11px] whitespace-pre-line leading-relaxed">
                            {customDocList}
                          </div>
                          <div className="flex justify-between text-[11px] pt-1">
                            <span className="text-slate-500">กำหนดส่ง:</span>
                            <span className="font-bold text-red-600">{customDocDeadline}</span>
                          </div>
                        </>
                      )}

                      {templateType === 'verdict' && (
                        <>
                          <div className="font-bold text-purple-900 text-sm">
                            {customVerdictTitle}
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                            {customVerdictDesc}
                          </p>
                          <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                            <span>ระยะเวลายื่นอุทธรณ์:</span>
                            <span className="font-bold text-purple-700">ภายใน 30 วัน</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Flex Action Buttons */}
                    <div className="p-2 bg-slate-50 border-t border-slate-100 space-y-1.5">
                      <button
                        type="button"
                        onClick={handleCopyClientLink}
                        className="w-full py-1.5 px-3 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                      >
                        <span>เปิดแฟ้มคดีในระบบ CASELINK</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          className="py-1 px-2 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 text-center"
                        >
                          ส่งเอกสารให้ทนาย
                        </button>
                        <button
                          type="button"
                          className="py-1 px-2 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 text-center"
                        >
                          โทรด่วนหาทนาย
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-600 text-right pr-1">อ่านแล้ว 10:46</div>
                </div>

                {/* Bottom Mockup Phone Bar */}
                <div className="bg-white p-2.5 border-t border-slate-200 flex items-center justify-between text-slate-400 text-xs">
                  <span>พิมพ์ข้อความตอบกลับทนาย...</span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    ☺
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOT SIMULATION SETTINGS (Requirement 3: No real tokens) */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                ตั้งค่าการแสดงผล LINE Official (โหมดจำลอง)
              </h3>
              <p className="text-xs text-slate-500">
                ปรับแต่งชื่อบอทและไอดีสำหรับแสดงในหน้าต่างจำลองสมาร์ตโฟน
              </p>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-2 text-xs font-bold">
              <span>โหมดจำลอง (Simulator)</span>
            </div>
          </div>

          {/* Privacy & Safety Notice */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-1.5 leading-relaxed">
            <div className="flex items-center space-x-2 font-bold text-amber-950">
              <Shield className="w-4 h-4 text-amber-700" />
              <span>ความปลอดภัยและความซื่อตรงของระบบเดโม</span>
            </div>
            <p>
              เนื่องจากเว็บไซต์นี้เป็นเดโมแบบ static บน GitHub Pages จึง<strong>ไม่รับ ไม่บันทึก และไม่ขอ Channel Secret หรือ Channel Access Token จริง</strong> และไม่มีการยิง API ภายนอก ข้อมูลทั้งหมดเป็นเพียงการแสดงตัวอย่าง Flex Message บนหน้าจอจำลองเท่านั้น
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSettings(settings);
            }}
            className="space-y-4 text-xs sm:text-sm"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อบอท / สำนักงานที่แสดงในเดโม (Bot Display Name)
              </label>
              <input
                type="text"
                value={settings.channelName}
                onChange={(e) => setSettings({ ...settings, channelName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="เช่น สำนักงานทนายความสมชาย & เพื่อน"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                LINE Official ID จำลอง (สำหรับแสดงผล)
              </label>
              <input
                type="text"
                value={settings.basicId}
                onChange={(e) => setSettings({ ...settings, basicId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                placeholder="เช่น @caselink_demo"
              />
            </div>

            {settingsSaved && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>บันทึกชื่อแสดงผลจำลองเรียบร้อยแล้ว</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-xl shadow-sm transition cursor-pointer text-sm"
              >
                บันทึกการตั้งค่าตัวอย่าง
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: DELIVERY LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">ประวัติการจำลองแจ้งเตือน</h3>
              <p className="text-xs text-slate-500">
                บันทึกประวัติการทดลองแสดงผล Flex Message ในเบราว์เซอร์เครื่องนี้
              </p>
            </div>
            <button
              onClick={() => {
                setLogs([]);
                localStorage.removeItem(LOCAL_STORAGE_KEY_LINE_LOGS);
              }}
              className="text-xs text-red-600 hover:underline cursor-pointer"
            >
              ล้างประวัติ
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              ยังไม่มีประวัติการจำลองแจ้งเตือน
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {logs.map((log) => (
                <div key={log.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center space-x-2">
                        <span>{log.templateName}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-normal">
                          {log.clientName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{log.caseTitle}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center space-x-1 text-slate-700 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 text-[10px]">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>[จำลอง] บันทึกในเดโม</span>
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STEP-BY-STEP SETUP GUIDE */}
      {activeTab === 'guide' && (
        <div className="max-w-4xl bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              วิธีสร้าง LINE Official Messaging API Bot สำหรับทนายความ (ฟรี ไม่มีค่าบริการ)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              เพียง 4 ขั้นตอนสั้นๆ สำนักงานของท่านก็สามารถมีระบบบอทแจ้งเตือนอัตโนมัติได้ทันที
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <span className="w-6 h-6 rounded-full bg-[#06C755] text-white flex items-center justify-center text-xs">
                  1
                </span>
                <span>เข้าสู่ LINE Developers Console</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                เข้าไปที่{' '}
                <a
                  href="https://developers.line.biz"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 underline font-semibold inline-flex items-center space-x-1"
                >
                  <span>developers.line.biz</span>
                  <ExternalLink className="w-3 h-3" />
                </a>{' '}
                แล้วล็อกอินด้วยบัญชี LINE ทั่วไปของท่าน
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <span className="w-6 h-6 rounded-full bg-[#06C755] text-white flex items-center justify-center text-xs">
                  2
                </span>
                <span>สร้าง Provider (ชื่อสำนักงาน)</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                คลิกปุ่ม <strong>Create a new provider</strong> ตั้งชื่อเป็นชื่อสำนักงานกฎหมายหรือชื่อของท่านเอง
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <span className="w-6 h-6 rounded-full bg-[#06C755] text-white flex items-center justify-center text-xs">
                  3
                </span>
                <span>สร้าง Messaging API Channel</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                เลือกประเภท <strong>Create a Messaging API channel</strong> ใส่รูปโปรไฟล์ ชื่อบอท
                และอีเมลสำหรับติดต่อ
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <span className="w-6 h-6 rounded-full bg-[#06C755] text-white flex items-center justify-center text-xs">
                  4
                </span>
                <span>Channel Access Token (สำหรับระบบจริง)</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                ในระบบจริงเมื่อนำไปติดตั้งบนเซิร์ฟเวอร์ จะใช้ Token นี้ร่วมกับ Webhook URL (สำหรับเดโมแบบ Static นี้ ระบบจะจำลอง Flex Message ในเบราว์เซอร์ จึงไม่จำเป็นต้องขอหรือกรอก Token ใดๆ)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Invitation Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center space-y-4 shadow-lg border border-slate-200 relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#06C755] mx-auto flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-block mb-1">
                <span className="text-[10px] text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                  ตัวอย่างจำลอง — ไม่สามารถสแกนจริงได้
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900">
                QR Code สำหรับเดโม (ตัวอย่างจำลอง)
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                ภาพตัวอย่างสำหรับสาธิตหน้าจอเชิญลูกความเข้าสู่ช่องทาง LINE Official
              </p>
            </div>

            {/* Simulated QR Code graphic */}
            <div className="p-4 bg-slate-50 rounded-xl border-2 border-dashed border-emerald-300 flex flex-col items-center justify-center">
              <div className="w-44 h-44 bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center justify-center space-y-2">
                <QrCode className="w-32 h-32 text-slate-800" />
                <span className="text-[10px] font-mono font-bold text-emerald-700">
                  {settings.basicId}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
