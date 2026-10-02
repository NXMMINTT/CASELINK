import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { UserRole } from '../../types.ts';
import { X, Shield, UserCheck, Lock, CheckCircle2 } from 'lucide-react';

export const AuthModals: React.FC = () => {
  const {
    authModal,
    setAuthModal,
    setCurrentUser,
    setShowOnboarding,
    registerUser,
    loginUser,
    setShowPrivacyModal,
  } = useApp();

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('lawyer');
  const [agreePrivacy, setAgreePrivacy] = useState(true);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Inline feedback messages
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  if (!authModal) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!regName.trim() || !regEmail.trim()) {
      setAuthError('กรุณากรอกชื่อและอีเมลให้ครบถ้วน');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    if (!agreePrivacy) {
      setAuthError('กรุณายินยอมและรับทราบนโยบายความเป็นส่วนตัว (Zero-Knowledge) ก่อนสร้างบัญชี');
      return;
    }

    const res = registerUser(regName.trim(), regEmail.trim(), regPassword, regRole);
    if (!res.success) {
      setAuthError(res.error || 'เกิดข้อผิดพลาดในการสร้างบัญชี');
      return;
    }

    setAuthModal(null);
    setShowOnboarding(true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    const res = loginUser(loginEmail.trim(), loginPassword);
    if (!res.success) {
      setAuthError(res.error || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลหรือรหัสผ่าน');
      return;
    }

    setAuthModal(null);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    if (role === 'lawyer') {
      loginUser('lawyer@caselink.th', 'demo1234');
    } else {
      loginUser('client@caselink.th', 'demo1234');
    }
    setAuthModal(null);
  };

  const handleGoogleAuth = () => {
    // Quick OAuth simulation with client-side isolation
    const role: UserRole = authModal === 'register' ? regRole : 'lawyer';
    setCurrentUser({
      id: `usr-google-${Date.now()}`,
      name: role === 'lawyer' ? 'ทนายสมชาย รัตนกุล' : 'นายสมชาย มั่นคง',
      email: role === 'lawyer' ? 'lawyer.somchai@gmail.com' : 'somchai.client@gmail.com',
      role,
      hasCompletedOnboarding: false,
    });
    setAuthModal(null);
    setShowOnboarding(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800 relative">
        <button
          onClick={() => setAuthModal(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {authModal === 'register' ? (
          /* SECTION: REGISTER */
          <div className="p-7">
            <div className="mb-5">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm mb-1">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Zero-Knowledge Local Vault
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">สร้างบัญชีใช้งาน</h2>
              <p className="text-slate-500 text-xs mt-1">
                ข้อมูลคดีและรหัสผ่านจะถูกบันทึกไว้ในอุปกรณ์ของคุณเท่านั้น ไม่ผ่านเซิร์ฟเวอร์
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {authError && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-medium">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ทนายสมชาย รัตนกุล หรือ นายสมชาย มั่นคง"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="your-email@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password (6 ตัวขึ้นไป)</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Role selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">เลือกประเภทผู้ใช้ (Role)</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <label
                    onClick={() => setRegRole('lawyer')}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      regRole === 'lawyer'
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-medium ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      checked={regRole === 'lawyer'}
                      onChange={() => setRegRole('lawyer')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex items-center space-x-1.5 text-xs">
                      <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      <span>ฉันเป็นทนาย</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setRegRole('client')}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      regRole === 'client'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-medium ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      checked={regRole === 'client'}
                      onChange={() => setRegRole('client')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex items-center space-x-1.5 text-xs">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ฉันเป็นลูกความ</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Privacy Policy Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start space-x-2 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    ฉันรับทราบนโยบายความปลอดภัยและยืนยันว่า{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPrivacyModal(true);
                      }}
                      className="text-indigo-600 underline font-semibold hover:text-indigo-800"
                    >
                      ข้อมูลคดีทั้งหมดจะถูกจัดเก็บบนอุปกรณ์นี้เท่านั้น (Zero-Knowledge)
                    </button>{' '}
                    ปราศจากการเก็บข้อมูลบนเซิร์ฟเวอร์แม่ข่าย
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-sm transition cursor-pointer"
              >
                สร้างบัญชีผู้ใช้
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-slate-500">
              มีบัญชีอยู่แล้ว?{' '}
              <button
                onClick={() => {
                  setAuthError(null);
                  setAuthModal('login');
                }}
                className="text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        ) : (
          /* SECTION: LOGIN */
          <div className="p-7">
            <div className="mb-5">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold text-lg mb-1">
                <span>CASELINK</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 font-normal">
                  Local-First Vault
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">เข้าสู่ระบบ</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                ปลดล็อกแฟ้มสำนวนคดีด้วยรหัสผ่านในเครื่องของคุณ
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {authError && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-medium">
                  {authError}
                </div>
              )}
              {authNotice && (
                <div className="text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 font-medium">
                  {authNotice}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="เช่น lawyer@caselink.th หรืออีเมลที่ลงทะเบียน"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() =>
                      setAuthNotice('รหัสผ่านถูกเก็บไว้ในเครื่องของคุณ หากลืมสามารถกดรีเซ็ตข้อมูลในเมนูตั้งค่าได้')
                    }
                    className="text-xs text-indigo-600 hover:underline cursor-pointer"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>จดจำเซสชันในเครื่องนี้</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-[11px] text-emerald-700 hover:underline font-medium flex items-center space-x-1"
                >
                  <Shield className="w-3 h-3 text-emerald-600" />
                  <span>คำรับรองความปลอดภัย</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-sm transition cursor-pointer"
              >
                เข้าสู่ระบบ
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400">
                <span className="bg-white px-2">หรือทดสอบด้วยบัญชีตัวอย่าง</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('lawyer')}
                className="p-2 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl text-slate-700 font-medium flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>ทนายสมชาย (เดโม)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('client')}
                className="p-2 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 rounded-xl text-slate-700 font-medium flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ลูกความ (เดโม)</span>
              </button>
            </div>

            <div className="mt-4 text-center text-xs text-slate-500">
              ยังไม่มีบัญชี?{' '}
              <button
                onClick={() => {
                  setAuthError(null);
                  setAuthModal('register');
                }}
                className="text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                สร้างบัญชีใหม่
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
