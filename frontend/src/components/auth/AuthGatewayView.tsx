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
  ListChecks,
  FileCheck,
  Loader2,
} from 'lucide-react';

interface AuthGatewayViewProps {
  initialTab?: 'register' | 'login';
  onBack?: () => void;
}

export const AuthGatewayView: React.FC<AuthGatewayViewProps> = ({ initialTab, onBack }) => {
  const { isFirstTimeUser, registerUser, loginUser, setShowPrivacyModal } = useApp();

  // First visit opens on "create account"; returning visitors land on "sign in".
  const [activeTab, setActiveTab] = useState<'register' | 'login'>(() =>
    initialTab ?? (isFirstTimeUser ? 'register' : 'login')
  );

  const [role, setRole] = useState<UserRole>('lawyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lawyerLicenseId, setLawyerLicenseId] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name.trim() || !email.trim()) {
      setErrorMsg('กรุณากรอกชื่อและอีเมลให้ครบถ้วน');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }
    setIsSubmitting(true);
    const res = await registerUser(name, email, password, role, role === 'lawyer' ? lawyerLicenseId : undefined);
    setIsSubmitting(false);
    if (!res.success) setErrorMsg(res.error || 'เกิดข้อผิดพลาดในการสร้างบัญชี');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email.trim() || !password) {
      setErrorMsg('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    setIsSubmitting(true);
    const res = await loginUser(email, password);
    setIsSubmitting(false);
    if (!res.success) setErrorMsg(res.error || 'เข้าสู่ระบบไม่สำเร็จ');
  };

  const features = [
    { icon: Layers, title: 'ผังคดี Blueprint', text: 'เชื่อมข้อเท็จจริง พยาน เอกสาร และข้อกฎหมายไว้ในผังเดียว' },
    { icon: ListChecks, title: 'จัดระเบียบสำนวน', text: 'ไทม์ไลน์ เช็กลิสต์ และคลังเอกสารแยกตามคดี' },
    { icon: Smartphone, title: 'แจ้งเตือนผ่าน LINE', text: 'พรีวิวข้อความแจ้งวันนัดและทวงเอกสารถึงลูกความ' },
    { icon: FileCheck, title: 'เตรียมว่าความ', text: 'ประเด็นถามพยาน คำนวณดอกเบี้ย และตรวจเอกสารก่อนขึ้นศาล' },
  ];

  const inputClass =
    'w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100';

  const roleToggle = (
    <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-slate-100">
      {(['lawyer', 'client'] as const).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => setRole(r)}
          className={`py-1.5 rounded-md text-sm transition flex items-center justify-center gap-1.5 ${
            role === r ? 'bg-white text-blue-700 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {r === 'lawyer' ? <Briefcase className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
          <span>{r === 'lawyer' ? 'ทนายความ' : 'ลูกความ'}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            className="flex items-center gap-2.5"
            title={onBack ? 'กลับหน้าแรก' : undefined}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">CASELINK</span>
          </button>
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="text-sm text-slate-500 hover:text-slate-900 transition"
          >
            ความเป็นส่วนตัว
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <section className="lg:col-span-7 space-y-8 lg:pt-6">
          <div className="space-y-4">
            <span className="inline-flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              ทนายความและลูกความทำงานร่วมกันในสำนวนเดียว
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
              จัดการคดีความ
              <br />
              <span className="text-blue-600">เห็นภาพรวมในที่เดียว</span>
            </h1>
            <p className="text-slate-600 leading-relaxed max-w-xl">
              พื้นที่ทำงานสำหรับทนายความและลูกความ — จัดสำนวน ติดตามเอกสาร และสื่อสารกับลูกความได้ต่อเนื่อง
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-900">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mt-0.5">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-5 w-full">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-7">
            <div className="flex border-b border-slate-200 mb-6 -mt-1">
              {(['login', 'register'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setErrorMsg(null);
                  }}
                  className={`flex-1 pb-3 text-sm transition border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-700 font-medium'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab === 'login' ? 'เข้าสู่ระบบ' : 'สร้างบัญชี'}
                </button>
              ))}
            </div>

            <form
              onSubmit={activeTab === 'register' ? handleRegisterSubmit : handleLoginSubmit}
              className="space-y-4"
            >
              {activeTab === 'register' && (
                <>
                  <div className="space-y-1.5">
                    <span className="block text-sm font-medium text-slate-700">บทบาท</span>
                    {roleToggle}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="displayName" className="block text-sm font-medium text-slate-700">
                      ชื่อ-นามสกุล
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'lawyer' ? 'เช่น ทนายสมเกียรติ ใจดี' : 'เช่น สมหญิง รักดี'}
                      className={inputClass}
                    />
                  </div>
                  {role === 'lawyer' && (
                    <div className="space-y-1.5">
                      <label htmlFor="licenseId" className="block text-sm font-medium text-slate-700">
                        เลขใบอนุญาตทนายความ <span className="font-normal text-slate-400">(ไม่บังคับ)</span>
                      </label>
                      <input
                        id="licenseId"
                        type="text"
                        value={lawyerLicenseId}
                        onChange={(e) => setLawyerLicenseId(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  )}
                </>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  อีเมล
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
                {activeTab === 'register' && role === 'client' && (
                  <p className="text-xs text-slate-500">ใช้อีเมลเดียวกับที่แจ้งทนาย เพื่อให้เห็นคดีของคุณ</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  รหัสผ่าน
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete={activeTab === 'register' ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={activeTab === 'register' ? 'อย่างน้อย 8 ตัวอักษร' : ''}
                  className={inputClass}
                />
              </div>

              {activeTab === 'register' && (
                <label className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 accent-blue-600"
                  />
                  <span>
                    ยอมรับ{' '}
                    <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-blue-600 hover:underline">
                      นโยบายความเป็นส่วนตัว
                    </button>{' '}
                    และการจัดเก็บข้อมูลคดีบนเซิร์ฟเวอร์
                  </span>
                </label>
              )}

              {errorMsg && (
                <p role="alert" className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || (activeTab === 'register' && !agreed)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {activeTab === 'register' ? 'สร้างบัญชี' : 'เข้าสู่ระบบ'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© 2026 CASELINK</span>
          <span className="flex items-center gap-4">
            <button onClick={() => setShowPrivacyModal(true)} className="hover:text-slate-900 transition">
              ความเป็นส่วนตัวและข้อจำกัด
            </button>
          </span>
        </div>
      </footer>
    </div>
  );
};
