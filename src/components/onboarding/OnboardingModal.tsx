import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  GitCommit,
  CheckSquare,
  Clock,
  Briefcase,
  FileUp,
  MessageSquare,
  Activity,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';

interface OnboardingModalProps {
  onComplete?: () => void;
  onOpenCreateCase?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  onComplete,
  onOpenCreateCase,
}) => {
  const { currentUser, showOnboarding, setShowOnboarding } = useApp();
  const [step, setStep] = useState<number>(1);

  if (!showOnboarding) return null;

  const isLawyer = currentUser.role === 'lawyer';

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    setShowOnboarding(false);
    setStep(1);
    if (onComplete) onComplete();
    if (isLawyer && step === 5 && onOpenCreateCase) {
      onOpenCreateCase();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative text-slate-800">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-7 bg-indigo-600'
                    : i < step
                    ? 'w-3 bg-indigo-300'
                    : 'w-3 bg-slate-200'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSkip}
            className="text-xs font-medium text-slate-400 hover:text-slate-700 flex items-center space-x-1 py-1 px-2 rounded-md hover:bg-slate-100 transition"
          >
            <span>ข้าม</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Content based on Role & Step */}
        <div className="p-6 pt-4 text-center min-h-[300px] flex flex-col justify-center items-center">
          {isLawyer ? (
            /* LAWYER ONBOARDING */
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    ยินดีต้อนรับสู่ CASELINK
                  </h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    จัดระเบียบเหตุการณ์ เอกสาร และงานของคดีไว้ในที่เดียว
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 w-full">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <GitCommit className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    เชื่อมโยงเหตุการณ์ของคดีด้วย Mind Map
                  </h3>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 max-w-xs mx-auto text-xs space-y-1.5 shadow-inner">
                    <div className="font-semibold text-slate-800 bg-white py-1.5 px-3 rounded-lg border border-slate-200 shadow-xs">
                      ทำสัญญา
                    </div>
                    <div className="text-indigo-500 font-bold">↓</div>
                    <div className="font-semibold text-slate-800 bg-white py-1.5 px-3 rounded-lg border border-slate-200 shadow-xs">
                      ผิดสัญญา
                    </div>
                    <div className="text-indigo-500 font-bold">↓</div>
                    <div className="font-semibold text-slate-800 bg-white py-1.5 px-3 rounded-lg border border-slate-200 shadow-xs">
                      แจ้งเตือน
                    </div>
                    <div className="text-indigo-500 font-bold">↓</div>
                    <div className="font-semibold text-indigo-900 bg-indigo-50 py-1.5 px-3 rounded-lg border border-indigo-200 shadow-xs">
                      ยื่นฟ้อง
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckSquare className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    ติดตามเอกสารที่ลูกความส่งมาได้ง่ายขึ้น
                  </h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    Checklist ช่วยให้คุณเห็นทันทีว่าเอกสารใดได้รับแล้ว เอกสารใดกำลังตรวจ และเอกสารใดยังขาดอยู่
                  </p>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    รู้ว่าวันไหนต้องทำอะไร โดยไม่ต้องจำเอง
                  </h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    แจ้งเตือนกำหนดนัดศาล วันครบกำหนดยื่นเอกสาร และงานเร่งด่วนในหน้าเดียว
                  </p>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    พร้อมเริ่มแล้ว
                  </h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto">
                    เริ่มต้นสร้างแฟ้มคดีแรกเพื่อจัดระเบียบข้อมูลได้อย่างมีประสิทธิภาพ
                  </p>
                </div>
              )}
            </>
          ) : (
            /* CLIENT ONBOARDING */
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    ยินดีต้อนรับสู่ CASELINK
                  </h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    ที่นี่คือพื้นที่สำหรับส่งข้อมูลและเอกสารให้ทนายของคุณ
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <FileUp className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    เอกสารที่ต้องส่ง
                  </h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    อัปโหลดรูปถ่าย บัตรประชาชน สัญญา หรือสลิปโอนเงินได้ง่ายๆ เพียงไม่กี่คลิก
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Activity className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    สถานะคดี
                  </h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    ติดตามว่าเอกสารของคุณได้รับการตรวจหรือยัง และคดีกำลังดำเนินการถึงขั้นตอนใด
                  </p>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    ข้อความจากทนาย
                  </h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    รับข่าวสารและคำแนะนำจากทนายความของคุณได้โดยตรง ปลอดภัย และไม่ตกหล่น
                  </p>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    พร้อมแล้ว
                  </h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto">
                    เข้าสู่หน้าหลักเพื่อดูรายการเอกสารที่ต้องส่งและสถานะคดีของคุณ
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 py-2 px-3 rounded-lg"
          >
            ข้ามคำแนะนำ
          </button>

          <button
            onClick={handleNext}
            className={`font-medium text-sm py-2.5 px-6 rounded-xl text-white shadow-sm transition flex items-center space-x-2 cursor-pointer ${
              isLawyer
                ? 'bg-indigo-600 hover:bg-indigo-500'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {step === 5 ? (
              <span>{isLawyer ? 'สร้างคดีแรก' : 'เข้าสู่หน้าหลัก'}</span>
            ) : (
              <>
                <span>ต่อไป</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
