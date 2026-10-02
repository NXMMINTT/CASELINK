import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { UserRole } from '../../types.ts';
import {
  Scale,
  Briefcase,
  User,
  ArrowRight,
  Layers,
  Smartphone,
  Cpu,
  FileCheck,
  Info,
  RotateCcw,
  CheckCircle2,
  HardDrive,
  UserPlus,
  LogIn,
  AlertTriangle,
} from 'lucide-react';

export const AuthGatewayView: React.FC = () => {
  const {
    isFirstTimeUser,
    quickDemoLogin,
    registerUser,
    loginUser,
    setShowPrivacyModal,
    resetDemoData,
  } = useApp();

  // If first time user -> starts on Register tab! Otherwise starts on Login tab!
  const [activeTab, setActiveTab] = useState<'register' | 'login'>(() =>
    isFirstTimeUser ? 'register' : 'login'
  );

  // Form states for custom demo profile
  const [role, setRole] = useState<UserRole>('lawyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetToast, setResetToast] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('กรุณากรอกชื่อสำหรับทดลองใช้งาน');
      return;
    }
    const cleanEmail = email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '')}@demo.law`;
    const res = registerUser(name.trim(), cleanEmail, 'demo1234', role);
    if (!res.success) {
      setErrorMsg(res.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'lawyer') {
      quickDemoLogin('lawyer');
    } else {
      quickDemoLogin('client');
    }
  };

  const handleReset = () => {
    resetDemoData();
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />

      {/* Top Banner Notice */}
      <div className="bg-amber-950/90 text-amber-200 border-b border-amber-800/80 px-4 py-2 text-xs font-medium z-20 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/30 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              เดโมต้นแบบ
            </span>
            <span className="text-amber-100">
              เว็บไซต์นี้เป็นเดโมสำหรับทดลองใช้งานบน GitHub Pages — ใช้ข้อมูลสมมติเท่านั้น ห้ามใส่ข้อมูลลูกความจริง
            </span>
          </div>
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="text-amber-300 hover:text-white underline text-[11px] cursor-pointer ml-3 flex-shrink-0"
          >
            ข้อจำกัดเดโม
          </button>
        </div>
      </div>

      {/* Top Bar Header matching Image 1 Logo */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 py-3.5 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo exactly matching Navbar & original brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-950/40 text-white flex-shrink-0">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">CASELINK</span>
                <span className="text-xs font-normal text-indigo-300 bg-indigo-950/80 border border-indigo-700/60 px-2 py-0.5 rounded-full">
                  Thai Legal Workspace
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block leading-tight mt-0.5">
                ระบบแฟ้มคดีความ & ผู้ช่วยสื่อสารลูกความอัจฉริยะสำหรับทนายความไทย
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition cursor-pointer bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg"
            >
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>คำชี้แจงเดโม & ข้อจำกัด</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Prototype Overview & Features (7 cols on desktop) */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>ต้นแบบระบบจัดการคดีความ (Static Prototype)</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">ทดลองใช้งานฟรีบนเบราว์เซอร์</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.18]">
              ทดลองใช้งาน <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400 bg-clip-text text-transparent">CASELINK เดโม</span> จัดการคดีความแบบครบวงจร
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              สัมผัสประสบการณ์การทำงานร่วมกันระหว่างทนายความและลูกความผ่านผังคดีแบบ Blueprint Graph, 
              การจำลองแจ้งเตือนผ่าน LINE Official, และการเตรียมตัวว่าความในศาลด้วยข้อมูลสมมติที่ปลอดภัยในเครื่องของคุณ
            </p>

            {/* 4 Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition group">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Interactive Blueprint Canvas</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ผังคดีเชื่อมโยงข้อเท็จจริง พยาน เอกสาร และข้อกฎหมายเป็นเส้นสายจำสี ไม่ซ้อนทับ
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">LINE Automation (โหมดจำลอง)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ทดลองพรีวิว Flex Message แจ้งวันนัดศาลและทวงเอกสารในหน้าต่างจำลองสมาร์ตโฟน
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition group">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">การจัดระเบียบคดี (จำลองในเครื่อง)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  จำลองการแยกไทม์ไลน์และพยานในเบราว์เซอร์ โดยไม่ส่งข้อมูลออกนอกเครื่อง
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition group">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Courtroom Arsenal & Speech</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  เตรียมประเด็นถามพยาน คำนวณเบี้ยปรับดอกเบี้ย 5% และเช็กลิสต์ตรวจเอกสาร
                </p>
              </div>
            </div>

            {/* Storage Notice */}
            <div className="pt-2 flex items-center space-x-2 text-xs text-slate-400">
              <HardDrive className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>
                ข้อมูลตัวอย่างถูกบันทึกในเบราว์เซอร์เครื่องนี้เท่านั้น (LocalStorage) ไม่มีการซิงก์ไปเซิร์ฟเวอร์ภายนอก
              </span>
            </div>
          </div>

          {/* Right Column: Register / Login Tabs & One-Click Demo Role Cards */}
          <div className="lg:col-span-6 xl:col-span-5 w-full">
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 relative">
              
              {/* Tab Selector: Register vs Login */}
              <div className="flex rounded-xl bg-slate-800/90 p-1 mb-6 border border-slate-700/70">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                    activeTab === 'register'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>สร้างบัญชีจำลอง (Register)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                    activeTab === 'login'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>เข้าสู่ระบบ (Login)</span>
                </button>
              </div>

              {/* Title Header */}
              <div className="text-left mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {activeTab === 'register' ? 'สมัครทดลองใช้งานเดโม' : 'เข้าสู่ระบบทดลองใช้งาน'}
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {activeTab === 'register'
                    ? 'สร้างโปรไฟล์จำลองในเครื่อง หรือกดปุ่มบทบาทด้านล่างเพื่อเข้าทดลองทันที'
                    : 'เลือกบทบาทที่ต้องการเพื่อเข้าสู่หน้าจอทำงานจำลองทันที'}
                </p>
              </div>

              {/* 1-Click Quick Demo Role Access Buttons */}
              <div className="space-y-3 mb-6">
                <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider text-left">
                  ⚡ ทางลัด: เข้าทดลองทันที 1 คลิก
                </div>

                {/* Role 1: Lawyer */}
                <button
                  type="button"
                  onClick={() => quickDemoLogin('lawyer')}
                  className="w-full p-3.5 rounded-xl border border-indigo-500/40 bg-indigo-950/30 hover:border-indigo-500/80 hover:bg-indigo-950/50 transition text-left flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-105 transition-transform">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white flex items-center space-x-1.5">
                        <span>ทดลองเป็น: ทนายความ</span>
                        <span className="text-[10px] text-indigo-300 bg-indigo-900/60 px-1.5 py-0.5 rounded font-normal">
                          สมชาย รัตนกุล
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        บริหารสำนวน, ผัง Mind Map, เตรียมตัวว่าความ
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Role 2: Client */}
                <button
                  type="button"
                  onClick={() => quickDemoLogin('client')}
                  className="w-full p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 hover:border-emerald-500/80 hover:bg-emerald-950/50 transition text-left flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white flex items-center space-x-1.5">
                        <span>ทดลองเป็น: ลูกความ</span>
                        <span className="text-[10px] text-emerald-300 bg-emerald-900/60 px-1.5 py-0.5 rounded font-normal">
                          สมชาย มั่นคง
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        ติดตามความคืบหน้า, จำลองส่งเอกสารพยาน
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Optional Custom Form */}
              <div className="pt-4 border-t border-slate-800/80 text-left">
                <div className="text-[11px] font-semibold text-slate-400 mb-3">
                  {activeTab === 'register' ? 'หรือสร้างโปรไฟล์ตัวอย่างของท่านเอง:' : 'หรือเข้าสู่ระบบด้วยชื่ออื่น:'}
                </div>

                {activeTab === 'register' ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">บทบาทการใช้งาน</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setRole('lawyer')}
                          className={`py-2 px-3 rounded-lg border text-center font-medium transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                            role === 'lawyer'
                              ? 'border-indigo-500 bg-indigo-600/20 text-white font-bold'
                              : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>ทนายความ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('client')}
                          className={`py-2 px-3 rounded-lg border text-center font-medium transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                            role === 'client'
                              ? 'border-emerald-500 bg-emerald-600/20 text-white font-bold'
                              : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white'
                          }`}
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>ลูกความ</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">ชื่อ-นามสกุล สำหรับแสดงในเดโม</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="เช่น ทนายสมเกียรติ หรือ คุณวิภาดา"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                      />
                    </div>

                    <div className="flex items-start space-x-2 pt-1">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="agreeTerms" className="text-[11px] text-slate-400 leading-tight cursor-pointer">
                        รับทราบว่าเป็นระบบเดโม ไม่เก็บรหัสผ่านจริง และจะใช้ข้อมูลสมมติเท่านั้น
                      </label>
                    </div>

                    {errorMsg && (
                      <div className="p-2 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-[11px]">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!agreed}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50 text-xs shadow-md shadow-indigo-600/20"
                    >
                      สร้างโปรไฟล์และเริ่มทดลองใช้งาน
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">เลือกมุมมองที่ต้องการเข้าใช้งาน</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setRole('lawyer')}
                          className={`py-2 px-3 rounded-lg border text-center font-medium transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                            role === 'lawyer'
                              ? 'border-indigo-500 bg-indigo-600/20 text-white font-bold'
                              : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>มุมมองทนายความ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('client')}
                          className={`py-2 px-3 rounded-lg border text-center font-medium transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                            role === 'client'
                              ? 'border-emerald-500 bg-emerald-600/20 text-white font-bold'
                              : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white'
                          }`}
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>มุมมองลูกความ</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition cursor-pointer text-xs shadow-md shadow-indigo-600/20"
                    >
                      เข้าสู่ระบบเดโมในมุมมอง{role === 'lawyer' ? 'ทนายความ' : 'ลูกความ'}
                    </button>
                  </form>
                )}
              </div>

              {/* Reset Demo Option & Honest Disclaimer */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-left space-y-2">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>ต้องการล้างข้อมูลที่เคยแก้ไขในเดโม?</span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 cursor-pointer transition text-xs"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>คืนค่าข้อมูลเริ่มต้น</span>
                  </button>
                </div>
                {resetToast && (
                  <div className="text-[11px] text-emerald-400 bg-emerald-950/60 p-2 rounded-lg border border-emerald-800 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>คืนค่าข้อมูลตัวอย่างและเซสชันทั้งหมดเป็นค่าเริ่มต้นแล้ว</span>
                  </div>
                )}
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  * การสลับบทบาทหรือเข้าสู่ระบบนี้เป็นเพียงการเปลี่ยนมุมมองทดสอบเดโม ไม่ใช่ระบบรักษาความปลอดภัยหรือควบคุมสิทธิ์จริง
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            CASELINK © 2026 — เดโมต้นแบบระบบจัดการคดีความ (Static Prototype บน GitHub Pages)
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-indigo-400 transition cursor-pointer"
            >
              คำชี้แจงความเป็นส่วนตัว & ข้อจำกัดเดโม
            </button>
            <span>·</span>
            <span>ห้ามใช้ข้อมูลลูกความจริง</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
