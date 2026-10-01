import React from 'react';
import {
  Rocket,
  Sparkles,
  Database,
  Scale,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Bell,
  Cpu,
} from 'lucide-react';

interface UpcomingFeature {
  id: string;
  category: string;
  title: string;
  description: string;
  badge: string;
  expectedDate: string;
  icon: React.ElementType;
  theme: {
    accentColor: string;
    badgeBg: string;
    borderTop: string;
    iconBg: string;
    iconColor: string;
    tagBg: string;
  };
  highlights: string[];
}

const UPCOMING_FEATURES: UpcomingFeature[] = [
  {
    id: 'feat-1',
    category: 'ระบบ AI อัจฉริยะ',
    title: 'พัฒนาระบบฐานข้อมูลและจัดเก็บข้อมูลบน Cloud Database',
    description:
      'ยกระดับการจัดเก็บข้อมูลสำนวนคดี เอกสารหลักฐานสำคัญ และโครงสร้าง Mind Map ขึ้นสู่คลาวด์มาตรฐานความปลอดภัยสูง รองรับการเข้าถึงได้จากทุกอุปกรณ์ พร้อมระบบสำรองข้อมูลอัตโนมัติแบบเรียลไทม์',
    badge: '🚀 เร็วๆ นี้',
    expectedDate: 'ไตรมาส 4 / 2026',
    icon: Database,
    theme: {
      accentColor: 'text-sky-600',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      borderTop: 'border-t-4 border-t-sky-500',
      iconBg: 'bg-sky-50 text-sky-600 border border-sky-100',
      iconColor: 'text-sky-600',
      tagBg: 'bg-sky-50 text-sky-700',
    },
    highlights: [
      'ความปลอดภัยและเข้ารหัสข้อมูลตามมาตรฐานสากล',
      'ซิงค์ข้อมูลสำนวนคดีแบบ Real-time ข้ามอุปกรณ์',
      'ระบบสำรองข้อมูลอัตโนมัติ ป้องกันข้อมูลสูญหาย 100%',
    ],
  },
  {
    id: 'feat-2',
    category: 'ศาลดิจิทัล e-Filing',
    title: 'เชื่อมต่อระบบศาลอิเล็กทรอนิกส์ e-Filing & CIOS',
    description:
      'ดึงข้อมูลนัดหมาย วันนัดไต่สวน และดาวน์โหลดคำสั่งศาลโดยตรงจากระบบศาลยุติธรรมเข้าสู่แฟ้มคดีอัตโนมัติ ลดขั้นตอนการตรวจสอบข้อมูลด้วยตนเองและไม่พลาดทุกวันนัดสำคัญ',
    badge: '🚀 เร็วๆ นี้',
    expectedDate: 'ไตรมาส 4 / 2026',
    icon: Scale,
    theme: {
      accentColor: 'text-indigo-600',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      borderTop: 'border-t-4 border-t-indigo-600',
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      iconColor: 'text-indigo-600',
      tagBg: 'bg-indigo-50 text-indigo-700',
    },
    highlights: [
      'เชื่อมโยงระบบ e-Filing และ CIOS ของศาลยุติธรรม',
      'อัปเดตวันนัดไต่สวนและคำสั่งศาลเข้าสู่แฟ้มคดีอัตโนมัติ',
      'แจ้งเตือนกำหนดนัดล่วงหน้าผ่านปฏิทินและไทม์ไลน์',
    ],
  },
  {
    id: 'feat-3',
    category: 'ระบบติดต่อลูกความ',
    title: 'ระบบแจ้งเตือนลูกความอัตโนมัติผ่าน LINE Official',
    description:
      'แจ้งเตือนวันนัดศาล เอกสารที่ต้องส่ง และรายงานสถานะคดีไปยัง LINE ของลูกความโดยตรงแบบเรียลไทม์ เพิ่มความมั่นใจให้ลูกความโดยไม่ต้องโทรสอบถามบ่อยครั้ง',
    badge: '🚀 เร็วๆ นี้',
    expectedDate: 'ไตรมาส 1 / 2027',
    icon: MessageCircle,
    theme: {
      accentColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderTop: 'border-t-4 border-t-emerald-500',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      iconColor: 'text-emerald-600',
      tagBg: 'bg-emerald-50 text-emerald-700',
    },
    highlights: [
      'ส่งแจ้งเตือนเอกสารที่ต้องส่งและวันนัดศาลอัตโนมัติ',
      'ลูกความตรวจเช็กสถานะคดีผ่าน LINE ได้ตลอด 24 ชั่วโมง',
      'ลดภาระงานตอบคำถามซ้ำๆ ของทีมทนายความ',
    ],
  },
];

export const RoadmapView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200 pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-sky-300">
            <Rocket className="w-3.5 h-3.5" />
            <span>FEATURE UPDATE SOON</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            สิ่งที่ระบบจะอัปเดตเร็วๆ นี้
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            แผนการพัฒนายกระดับระบบ CASELINK เพื่อเพิ่มประสิทธิภาพการจัดการคดีความของทนายความ
            และอำนวยความสะดวกในการติดตามความคืบหน้าของลูกความแบบก้าวกระโดด
          </p>
        </div>
      </div>

      {/* 3 Main Upcoming Features Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">ฟีเจอร์สำคัญในแผนการพัฒนา</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            3 ฟีเจอร์หลัก
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {UPCOMING_FEATURES.map((feat) => {
            const Icon = feat.icon;

            return (
              <div
                key={feat.id}
                className={`bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between ${feat.theme.borderTop}`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Badge & Category */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${feat.theme.badgeBg}`}
                    >
                      <span>{feat.badge}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {feat.expectedDate}
                    </span>
                  </div>

                  {/* Icon & Category Tag */}
                  <div className="flex items-center space-x-3 pt-1">
                    <div className={`p-2.5 rounded-xl ${feat.theme.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${feat.theme.tagBg}`}>
                      {feat.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug pt-1">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>

                  {/* Feature Highlights */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      จุดเด่นสำคัญ:
                    </span>
                    {feat.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Status */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">สถานะการพัฒนา:</span>
                  <span className="font-semibold text-slate-800 flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>อยู่ในแผนการพัฒนา</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overview Banner for Presentation */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-indigo-100/70 text-indigo-700 rounded-xl flex-shrink-0 mt-0.5">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              มุ่งมั่นพัฒนาระบบเพื่อวงการกฎหมายไทย
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              ทั้ง 3 ฟีเจอร์ได้รับการออกแบบมาจากการสำรวจปัญหาจริงของทนายความและลูกความ
              เพื่อลดเวลาทำงานเอกสารและเพิ่มความโปร่งใสในทุกขั้นตอน
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto flex-shrink-0">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
            CASELINK Next-Gen 2026
          </span>
        </div>
      </div>
    </div>
  );
};
