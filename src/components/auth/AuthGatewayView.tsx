import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { UserRole } from '../../types.ts';
import {
  Scale,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Briefcase,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone,
  Cpu,
  Layers,
  FileCheck,
} from 'lucide-react';

export const AuthGatewayView: React.FC = () => {
  const {
    isFirstTimeUser,
    registerUser,
    loginUser,
    quickDemoLogin,
    setShowPrivacyModal,
  } = useApp();

  // Primary tab state: default to 'register' if first time, else 'login'
  const [activeTab, setActiveTab] = useState<'register' | 'login'>(
    isFirstTimeUser ? 'register' : 'login'
  );

  // Synchronize initial state if isFirstTimeUser updates
  useEffect(() => {
    setActiveTab(isFirstTimeUser ? 'register' : 'login');
  }, [isFirstTimeUser]);

  // Form states
  const [role, setRole] = useState<UserRole>('lawyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lawyerLicenseId, setLawyerLicenseId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(true);

  // Status & Validation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('กรุณากรอกชื่อ-นามสกุล หรือชื่อสำนักงานกฎหมาย');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('กรุณาระบุอีเมลที่ถูกต้อง');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    if (!agreePrivacy) {
      setErrorMsg('กรุณายินยอมรับทราบนโยบายรักษาความลับวิชาชีพทนายความ (ป.อาญา ม.323)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = registerUser(
        name.trim(),
        email.trim(),
        password,
        role,
        role === 'lawyer' ? lawyerLicenseId.trim() : undefined
      );
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMsg(res.error || 'เกิดข้อผิดพลาดในการสร้างบัญชี');
      }
    }, 200);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('กรุณาระบุอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginUser(email.trim(), password);
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMsg(res.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] rounded-full bg-emerald-600/10 blur-[130px] pointer-events-none" />

      {/* Top Bar Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                CASELINK
                <span className="text-xs font-normal text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-2 py-0.5 rounded-full">
                  Thai Legal Workspace
                </span>
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                ระบบแฟ้มคดีความ & ผู้ช่วยสื่อสารลูกความอัจฉริยะสำหรับทนายความไทย
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 transition cursor-pointer bg-emerald-950/50 border border-emerald-800/50 px-3 py-1.5 rounded-lg"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">การรับรอง:</span>
              <span className="font-semibold">Zero-Knowledge Vault</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content: 2-Column Desktop Grid following Figma UI Design Principles */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Product Value & Design Principles Showcase (7 cols on desktop) */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6 text-left">
            {/* Visual Hierarchy: Category Kicker */}
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>มาตรฐานความปลอดภัยสูงสุดเพื่อวิชาชีพกฎหมายไทย</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">ป.อาญา ม.323 & PDPA</span>
            </div>

            {/* Dominant Headline with Balanced Typography */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.18]">
              จัดการคดีความ <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400 bg-clip-text text-transparent">เห็นภาพรวมทั้งสำนวน</span> ปลอดภัยบนเครื่องของคุณ
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              ผสานพลังผังคดีแบบ Blueprint Graph, การสื่อสารลูกความอัตโนมัติผ่าน LINE Official, 
              และการเตรียมตัวว่าความในศาลอย่างเป็นระบบ — ภายใต้สถาปัตยกรรม <strong className="text-emerald-400 font-semibold">Zero-Knowledge</strong> ที่ไม่มีการเก็บข้อมูลความลับของลูกความบนเซิร์ฟเวอร์ส่วนกลาง
            </p>

            {/* 4 Feature Pillars (Figma Card Architecture with single-elevation depth) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition group">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Interactive Blueprint Canvas</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  เชื่อมโยงข้อเท็จจริง พยาน เอกสาร และข้อกฎหมายเป็นเส้นสายจำสี ไม่ซ้อนทับ
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">LINE Official Automation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  แจ้งเตือนวันนัดศาล สรุปคำพิพากษา และทวงเอกสารผ่าน LINE OA ทนายความ
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition group">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">AI Fact-Structuring & Audit</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  สกัดข้อเท็จจริงด้วย Gemini JSON Schema โดยลบเลขบัตรและเบอร์โทร (PII) ล่วงหน้า
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition group">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Courtroom Arsenal & Speech</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  เตรียมประเด็นถามพยาน คำนวณเบี้ยปรับดอกเบี้ย 5% และเช็กลิสต์ยื่นศาล
                </p>
              </div>
            </div>

            {/* Compliance Guarantee Bar */}
            <div className="pt-2 flex items-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                ความลับวิชาชีพได้รับการคุ้มครองตาม <strong className="text-slate-200">มรรยาททนายความ พ.ศ. 2529 ข้อ 14</strong> และ <strong className="text-slate-200">ประมวลกฎหมายอาญา มาตรา 323</strong>
              </span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Authentication Card (5 cols on desktop) */}
          <div className="lg:col-span-6 xl:col-span-5 w-full">
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 relative">
              {/* Segmented Control Tabs following Figma Affordance Principle */}
              <div className="flex p-1 bg-slate-950/80 border border-slate-800 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ลงทะเบียนใช้งานใหม่</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>เข้าสู่ระบบ</span>
                </button>
              </div>

              {/* Status or Error Banner */}
              {errorMsg && (
                <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                  <span className="font-medium leading-relaxed">{errorMsg}</span>
                </div>
              )}

              {/* Tab 1: REGISTER FORM */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4 text-left">
                  {/* Role Selector Card */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      บทบาทผู้ใช้งาน (เลือกเพื่อปรับแต่งหน้าจอที่เหมาะสม)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('lawyer')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          role === 'lawyer'
                            ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-inner'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Briefcase className={`w-4 h-4 ${role === 'lawyer' ? 'text-indigo-400' : 'text-slate-500'}`} />
                          {role === 'lawyer' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                        </div>
                        <div className="font-bold text-xs">ทนายความ / นิติกร</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">บริหารสำนวนคดี วางยุทธวิธี</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('client')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          role === 'client'
                            ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-inner'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <User className={`w-4 h-4 ${role === 'client' ? 'text-emerald-400' : 'text-slate-500'}`} />
                          {role === 'client' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <div className="font-bold text-xs">ลูกความ / ผู้ว่าจ้าง</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">ติดตามคดี ส่งเอกสาร นัดหมาย</div>
                      </button>
                    </div>
                  </div>

                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {role === 'lawyer' ? 'ชื่อ-นามสกุล ทนายความ หรือ สำนักงาน' : 'ชื่อ-นามสกุล ลูกความ'} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'lawyer' ? 'เช่น ทนายวิชัย หรือ สำนักงานกฎหมายธนกิจ' : 'เช่น นายสมชาย มั่นคง'}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      อีเมลสำหรับเข้าใช้งาน <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="lawyer@example.com"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    />
                  </div>

                  {/* Optional Lawyer License ID */}
                  {role === 'lawyer' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-300">
                          เลขที่ใบอนุญาตว่าความ (ถ้ามี)
                        </label>
                        <span className="text-[10px] text-slate-500">สภาทนายความ</span>
                      </div>
                      <input
                        type="text"
                        value={lawyerLicenseId}
                        onChange={(e) => setLawyerLicenseId(e.target.value)}
                        placeholder="เช่น 1425/2562"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                      />
                    </div>
                  )}

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        รหัสผ่าน <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="อย่างน้อย 6 ตัวอักษร"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ยืนยันรหัสผ่าน <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="กรอกรหัสผ่านซ้ำ"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                      />
                    </div>
                  </div>

                  {/* Ethics & Privacy Policy Consent Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreePrivacy}
                        onChange={(e) => setAgreePrivacy(e.target.checked)}
                        className="mt-1 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4 flex-shrink-0"
                      />
                      <span className="text-xs text-slate-300 leading-snug">
                        ข้าพเจ้ายินยอมรับทราบนโยบายรักษาความลับวิชาชีพตาม{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPrivacyModal(true);
                          }}
                          className="text-indigo-400 hover:underline font-semibold"
                        >
                          ป.อาญา ม.323 และมาตรการ Zero-Knowledge Privacy
                        </button>{' '}
                        โดยข้อมูลทั้งหมดจะถูกเก็บรักษาไว้บนเครื่องของผู้ใช้งานเท่านั้น
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 hover:from-indigo-500 to-violet-600 hover:to-violet-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition transform active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>กำลังสร้างบัญชีและเข้ารหัสข้อมูล...</span>
                    ) : (
                      <>
                        <span>สร้างบัญชีและเข้าสู่ระบบทันที</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Tab 2: LOGIN FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      อีเมลบัญชีผู้ใช้
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="lawyer@example.com หรืออีเมลที่ลงทะเบียนไว้"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        รหัสผ่าน
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="กรอกรหัสผ่านของคุณ"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 hover:from-indigo-500 to-violet-600 hover:to-violet-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition transform active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>กำลังตรวจสอบข้อมูล...</span>
                    ) : (
                      <>
                        <span>เข้าสู่ระบบ</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Instant Demo Access (Affordance & Fitts's Law principle: fast access without typing) */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <div className="text-center mb-3">
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-900 px-2 py-0.5">
                    หรือทดลองประเมินระบบทันที (ไม่ต้องพิมพ์ข้อมูล):
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => quickDemoLogin('lawyer')}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-600/60 text-slate-300 hover:text-white transition flex items-center justify-center space-x-2 text-xs font-semibold cursor-pointer group"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition" />
                    <span>เข้าทดลอง: ทนายความ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickDemoLogin('client')}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-600/60 text-slate-300 hover:text-white transition flex items-center justify-center space-x-2 text-xs font-semibold cursor-pointer group"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
                    <span>เข้าทดลอง: ลูกความ</span>
                  </button>
                </div>
              </div>

              {/* Zero-Knowledge Privacy Guarantee Microcopy */}
              <div className="mt-5 text-center">
                <p className="text-[11px] text-slate-400 flex items-center justify-center space-x-1.5">
                  <Lock className="w-3 h-3 text-emerald-400 inline" />
                  <span>ระบบบันทึกแบบ Local Storage Vault ไม่มีการส่งข้อมูลสำนวนคดีสู่ Cloud</span>
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
            CASELINK © 2026 — นวัตกรรมผู้ช่วยทนายความไทยเพื่อความยุติธรรมที่รวดเร็วและปลอดภัย
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-indigo-400 transition cursor-pointer"
            >
              นโยบายความเป็นส่วนตัว & มรรยาทวิชาชีพ
            </button>
            <span>·</span>
            <span>ป.อาญา ม.323</span>
            <span>·</span>
            <span>PDPA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
