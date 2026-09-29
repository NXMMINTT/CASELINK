import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { UserRole } from '../../types.ts';
import { X, Shield, UserCheck } from 'lucide-react';

export const AuthModals: React.FC = () => {
  const { authModal, setAuthModal, setCurrentUser, setShowOnboarding } = useApp();

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('lawyer');

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
    if (!regName.trim() || !regEmail.trim()) {
      setAuthError('กรุณากรอกชื่อและอีเมล');
      return;
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      hasCompletedOnboarding: false,
    };
    setAuthError(null);
    setCurrentUser(newUser);
    setAuthModal(null);
    setShowOnboarding(true); // Enters onboarding right after register (Section 5)
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Quick login with demo account based on entered email or defaults
    const isClient = loginEmail.toLowerCase().includes('client') || loginEmail.includes('ลูกความ');
    const userRole: UserRole = isClient ? 'client' : 'lawyer';
    const userName = isClient ? 'นายสมชาย' : 'ทนายสมชาย';

    setCurrentUser({
      id: `usr-${Date.now()}`,
      name: userName,
      email: loginEmail || (isClient ? 'client@caselink.th' : 'lawyer@caselink.th'),
      role: userRole,
      hasCompletedOnboarding: true,
    });
    setAuthModal(null);
  };

  const handleGoogleAuth = () => {
    // Demo quick OAuth simulation
    const role: UserRole = authModal === 'register' ? regRole : 'lawyer';
    setCurrentUser({
      id: `usr-google-${Date.now()}`,
      name: role === 'lawyer' ? 'ทนายสมชาย' : 'นายสมชาย',
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
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {authModal === 'register' ? (
          /* SECTION 3: REGISTER */
          <div className="p-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">สร้างบัญชี</h2>
              <p className="text-slate-500 text-sm mt-1">เริ่มจัดการข้อมูลคดีของคุณในที่เดียว</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {authError && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-medium">
                  {authError}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อ</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ทนายสมชาย หรือ นายสมชาย"
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
                  placeholder="email@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
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

              {/* Role selection - Section 2 & 3 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">เลือกประเภทผู้ใช้ (Role)</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    onClick={() => setRegRole('lawyer')}
                    className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition ${
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
                    className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition ${
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

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-sm transition"
              >
                สร้างบัญชี
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400">
                <span className="bg-white px-2">หรือ</span>
              </div>
            </div>

            <button
              onClick={handleGoogleAuth}
              type="button"
              className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-xl flex items-center justify-center space-x-2 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>ดำเนินการต่อด้วย Google</span>
            </button>

            <div className="mt-5 text-center text-xs text-slate-500">
              มีบัญชีอยู่แล้ว?{' '}
              <button
                onClick={() => setAuthModal('login')}
                className="text-indigo-600 hover:underline font-semibold"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        ) : (
          /* SECTION 4: LOGIN */
          <div className="p-7">
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold text-lg mb-1">
                <span>CASELINK</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">เข้าสู่ระบบ</h2>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                  placeholder="เช่น lawyer@caselink.th"
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
                    onClick={() => setAuthNotice('ระบบส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว')}
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

              <div className="flex items-center">
                <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>จดจำฉัน</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-sm transition"
              >
                เข้าสู่ระบบ
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400">
                <span className="bg-white px-2">หรือ</span>
              </div>
            </div>

            <button
              onClick={handleGoogleAuth}
              type="button"
              className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-xl flex items-center justify-center space-x-2 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>ดำเนินการต่อด้วย Google</span>
            </button>

            <div className="mt-5 text-center text-xs text-slate-500">
              ยังไม่มีบัญชี?{' '}
              <button
                onClick={() => setAuthModal('register')}
                className="text-indigo-600 hover:underline font-semibold"
              >
                สมัครสมาชิก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
