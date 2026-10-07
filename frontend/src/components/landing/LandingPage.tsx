import React, { useState } from 'react';
import {
  Scale,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Plus,
  Briefcase,
  User,
  Network,
  Clock3,
  ListChecks,
  FolderOpen,
  CalendarDays,
  MessageSquare,
  Check,
} from 'lucide-react';

type AuthTab = 'login' | 'register';

interface LandingPageProps {
  onStart: (tab: AuthTab) => void;
  onOpenPrivacy: () => void;
}

const NAV_LINKS = [
  { href: '#about', label: 'เกี่ยวกับ' },
  { href: '#features', label: 'ฟีเจอร์' },
  { href: '#audience', label: 'สำหรับใคร' },
  { href: '#steps', label: 'เริ่มต้นใช้งาน' },
  { href: '#faq', label: 'คำถามที่พบบ่อย' },
];

const PILLARS = [
  {
    no: '01',
    title: 'สำนวนเดียว ใช้ร่วมกัน',
    text: 'ทนายความและลูกความเปิดคดีเดียวกันได้จากบัญชีของตัวเอง ไม่ต้องส่งไฟล์ไปมาหลายช่องทาง',
  },
  {
    no: '02',
    title: 'เห็นความเชื่อมโยง',
    text: 'บุคคล เหตุการณ์ เอกสาร และข้อกฎหมาย ถูกวางไว้บนผังเดียว เห็นว่าอะไรเกี่ยวกับอะไร',
  },
  {
    no: '03',
    title: 'ติดตามงานต่อเนื่อง',
    text: 'ไทม์ไลน์ เช็กลิสต์ และนัดหมาย บอกได้ทันทีว่าคดีอยู่ขั้นไหน และใครต้องทำอะไรต่อ',
  },
];

const FAQS = [
  {
    q: 'CASELINK คืออะไร',
    a: 'เว็บต้นแบบสำหรับจัดระเบียบข้อมูลคดี ช่วยให้ทนายความและลูกความเห็นภาพรวมของคดีเดียวกัน ผ่าน Mind Map, Timeline, Checklist และคลังเอกสาร',
  },
  {
    q: 'ลูกความเข้าถึงคดีของตัวเองได้อย่างไร',
    a: 'ทนายความระบุอีเมลของลูกความตอนสร้างคดี เมื่อลูกความสมัครบัญชีด้วยอีเมลนั้น จะเปิดดูคดี ส่งเอกสาร และอัปเดตเช็กลิสต์ของตัวเองได้',
  },
  {
    q: 'ลูกความแก้ไขข้อมูลคดีได้แค่ไหน',
    a: 'ลูกความส่งเอกสาร อัปเดตเช็กลิสต์ และพูดคุยในแชทประจำคดีได้ ส่วนผังคดี ไทม์ไลน์ และรายละเอียดอื่นแก้ไขได้เฉพาะทนายความ',
  },
  {
    q: 'ข้อมูลคดีถูกเก็บไว้ที่ไหน',
    a: 'ข้อมูลคดีและข้อความแชทบันทึกไว้ในฐานข้อมูลของระบบ ผูกกับบัญชีผู้ใช้ จึงเปิดต่อจากอุปกรณ์อื่นได้เมื่อเข้าสู่ระบบ',
  },
  {
    q: 'ระบบ AI และ LINE ใช้งานจริงหรือไม่',
    a: 'ยังเป็นโหมดจำลอง การจัดโครงสร้างข้อเท็จจริงใช้กฎและคำสำคัญที่กำหนดไว้ ไม่ได้วิเคราะห์หรือทำนายผลคดี ส่วนหน้า LINE เป็นการพรีวิวข้อความเท่านั้น',
  },
  {
    q: 'ควรใส่ข้อมูลคดีจริงหรือไม่',
    a: 'CASELINK ยังเป็นต้นแบบ แนะนำให้ทดลองด้วยข้อมูลสมมติ และไม่ใส่ข้อมูลส่วนบุคคลหรือข้อมูลคดีจริงที่เป็นความลับ',
  },
];

/* ---------- Small visual mocks (no external images) ---------- */

const MindMapMock: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <svg viewBox="0 0 520 300" className="w-full h-full" role="img" aria-label="ตัวอย่างผังคดี Mind Map">
    <defs>
      <pattern id={compact ? 'grid-s' : 'grid-l'} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0H0V20" fill="none" stroke="#1b2a47" strokeWidth="0.6" />
      </pattern>
    </defs>
    <rect width="520" height="300" fill={`url(#${compact ? 'grid-s' : 'grid-l'})`} />
    <g stroke="#3d6fd6" strokeWidth="1.4" fill="none" strokeOpacity="0.75">
      <path d="M260 150 C 200 150, 170 70, 110 70" />
      <path d="M260 150 C 200 150, 170 230, 110 230" />
      <path d="M260 150 C 320 150, 350 60, 410 60" />
      <path d="M260 150 C 320 150, 350 150, 410 150" />
      <path d="M260 150 C 320 150, 350 240, 410 240" strokeDasharray="4 4" />
    </g>
    {[
      { x: 110, y: 70, label: 'โจทก์', tag: 'บุคคล' },
      { x: 110, y: 230, label: 'จำเลย', tag: 'บุคคล' },
      { x: 410, y: 60, label: 'สัญญาเช่า', tag: 'เอกสาร' },
      { x: 410, y: 150, label: 'ผิดนัดชำระ', tag: 'เหตุการณ์' },
      { x: 410, y: 240, label: 'ป.พ.พ. 537', tag: 'ข้อกฎหมาย' },
    ].map((n) => (
      <g key={n.label} transform={`translate(${n.x - 56} ${n.y - 20})`}>
        <rect width="112" height="40" rx="8" fill="#0d1830" stroke="#24406f" />
        <text x="10" y="16" fontSize="9" fill="#6f8fca">{n.tag}</text>
        <text x="10" y="31" fontSize="12" fill="#e6ecf7" fontWeight="600">{n.label}</text>
      </g>
    ))}
    <g transform="translate(196 126)">
      <rect width="128" height="48" rx="10" fill="#1d56db" />
      <text x="14" y="20" fontSize="9" fill="#cfe0ff">คดีแพ่ง</text>
      <text x="14" y="36" fontSize="13" fill="#ffffff" fontWeight="700">ผิดสัญญาเช่า</text>
    </g>
  </svg>
);

const TimelineMock = () => (
  <ol className="relative mt-4 space-y-3 border-l border-[#22375f] pl-4">
    {[
      ['12 ม.ค.', 'ทำสัญญาเช่า'],
      ['03 เม.ย.', 'ผิดนัดชำระงวดแรก'],
      ['20 พ.ค.', 'ส่งหนังสือบอกกล่าว'],
    ].map(([d, t], i) => (
      <li key={t} className="relative">
        <span
          className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ${
            i === 2 ? 'bg-[#4f8dfd] ring-4 ring-[#4f8dfd]/20' : 'bg-[#2a4373]'
          }`}
        />
        <p className="text-[11px] text-[#7d8ba6] tabular-nums">{d}</p>
        <p className="text-sm text-[#dbe4f3]">{t}</p>
      </li>
    ))}
  </ol>
);

const ChecklistMock = () => (
  <ul className="mt-4 space-y-2">
    {[
      ['สำเนาบัตรประชาชน', true],
      ['สัญญาเช่าฉบับจริง', true],
      ['ใบเสร็จค่าเช่า', false],
    ].map(([t, done]) => (
      <li key={t as string} className="flex items-center gap-2.5 text-sm">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded border ${
            done ? 'border-[#4f8dfd] bg-[#4f8dfd] text-[#05070c]' : 'border-[#2a3c5f]'
          }`}
        >
          {done && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
        <span className={done ? 'text-[#7d8ba6] line-through' : 'text-[#dbe4f3]'}>{t as string}</span>
      </li>
    ))}
    <li className="pt-1">
      <div className="h-1 rounded-full bg-[#14223d]">
        <div className="h-1 w-2/3 rounded-full bg-[#4f8dfd]" />
      </div>
    </li>
  </ul>
);

/* ---------- Page ---------- */

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenPrivacy }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sectionTitle = (eyebrow: string, title: string) => (
    <div className="mb-10 sm:mb-14">
      <p className="mb-3 text-sm font-medium text-[#4f8dfd]">{eyebrow}</p>
      <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">{title}</h2>
    </div>
  );

  return (
    <div className="landing relative min-h-screen overflow-x-hidden bg-[#05070c] text-[#c9d3e6]">
      {/* Background grid + glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 landing-grid" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-240px] h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-[#1d56db]/25 blur-[140px]"
      />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#05070c]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d56db] text-white">
              <Scale className="h-4 w-4" />
            </span>
            <span className="font-brand text-[15px] font-bold tracking-[0.08em] text-white">CASELINK</span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-[#93a1bb] transition hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              onClick={() => onStart('login')}
              className="rounded-full px-4 py-2 text-sm text-[#c9d3e6] transition hover:text-white"
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => onStart('register')}
              className="rounded-full bg-[#1d56db] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2f6ff0]"
            >
              เริ่มใช้งาน
            </button>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-[#c9d3e6] hover:bg-white/5 lg:hidden"
            aria-label={menuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/[0.06] px-4 pb-5 pt-2 lg:hidden">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-white/[0.05] py-3 text-sm text-[#c9d3e6]"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => onStart('login')}
                className="rounded-full border border-white/10 py-2.5 text-sm text-white"
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => onStart('register')}
                className="rounded-full bg-[#1d56db] py-2.5 text-sm font-medium text-white"
              >
                เริ่มใช้งาน
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="top" className="relative">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#4f8dfd]/30 bg-[#4f8dfd]/10 px-3 py-1 text-xs text-[#a9c6ff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4f8dfd]" />
              พื้นที่ทำงานคดีสำหรับทนายความและลูกความ
            </span>
            <h1 className="font-display mt-6 text-[2.1rem] font-semibold leading-[1.2] text-white sm:text-6xl lg:text-7xl">
              เชื่อมโยงทุกข้อมูล
              <br />
              <span className="bg-gradient-to-r from-[#7fb0ff] to-[#3d78f0] bg-clip-text text-transparent">
                ให้เห็นภาพรวมของคดี
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#93a1bb] sm:text-lg">
              รวมบุคคล เหตุการณ์ เอกสาร และข้อกฎหมายไว้บนผังเดียว พร้อมไทม์ไลน์และ
              <span className="whitespace-nowrap">เช็กลิสต์</span> ที่ลูกความเปิดติดตามคดีของตัวเองได้
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => onStart('register')}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#1d56db] px-6 py-3 text-sm font-medium text-white shadow-[0_8px_30px_-8px_rgba(29,86,219,0.8)] transition hover:bg-[#2f6ff0]"
              >
                สร้างบัญชีฟรี
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-white transition hover:border-white/25 hover:bg-white/[0.03]"
              >
                ดูฟีเจอร์ทั้งหมด
              </a>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mt-16">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-[#4f8dfd]/40 via-[#1d56db]/10 to-transparent" />
            <div className="relative overflow-hidden rounded-3xl bg-[#080d18] p-2 sm:p-3">
              <div className="flex items-center gap-1.5 px-3 pb-3 pt-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1e2b45]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#1e2b45]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#1e2b45]" />
                <span className="ml-3 truncate text-xs text-[#5d6c88]">คดีผิดสัญญาเช่า · ผังคดี</span>
              </div>
              <div className="grid gap-2 sm:gap-3 lg:grid-cols-[1fr_260px]">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#060a14] sm:aspect-[16/9]">
                  <MindMapMock />
                </div>
                <div className="hidden flex-col gap-3 lg:flex">
                  <div className="flex-1 rounded-2xl border border-white/[0.06] bg-[#0a1222] p-4">
                    <p className="text-xs text-[#7d8ba6]">ไทม์ไลน์</p>
                    <TimelineMock />
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-[#0a1222] p-4">
                    <p className="text-xs text-[#7d8ba6]">เอกสารจากลูกความ</p>
                    <ChecklistMock />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-20 border-t border-white/[0.06]">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <p className="mb-3 text-sm font-medium text-[#4f8dfd]">เกี่ยวกับเรา</p>
              <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
                คดีหนึ่งคดี
                <br />
                มีข้อมูลมากกว่าที่คิด
              </h2>
            </div>
            <div>
              <p className="text-lg leading-relaxed text-[#a7b3c9]">
                ข้อเท็จจริงกระจายอยู่ในแชท เอกสารอยู่ในอีเมล นัดหมายอยู่ในปฏิทินคนละเล่ม
                CASELINK รวมทุกอย่างของคดีไว้ในสำนวนเดียว ให้ทนายความวางแผนได้ชัด
                และลูกความรู้ว่าคดีของตัวเองเดินไปถึงไหน
              </p>
              <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
                {PILLARS.map((p) => (
                  <div key={p.no} className="bg-[#070b14] p-6">
                    <p className="font-brand text-sm text-[#4f8dfd]">{p.no}</p>
                    <h3 className="mt-4 font-medium text-white">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#7d8ba6]">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features bento */}
        <section id="features" className="scroll-mt-20 border-t border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            {sectionTitle('ฟีเจอร์', 'เครื่องมือครบ สำหรับทุกขั้นของคดี')}

            <div className="grid gap-4 md:grid-cols-6">
              <article className="feature-card md:col-span-4 md:row-span-2">
                <FeatureHead icon={Network} title="ผังคดี Mind Map" />
                <p className="feature-text">
                  ลากโหนดบุคคล เหตุการณ์ เอกสาร ข้อกฎหมาย และกลยุทธ์ มาเชื่อมกัน พร้อมจัดผังอัตโนมัติ
                  และคำนวณค่าเสียหายกับดอกเบี้ย
                </p>
                <div className="mt-6 aspect-[16/9] overflow-hidden rounded-xl border border-white/[0.06] bg-[#060a14]">
                  <MindMapMock compact />
                </div>
              </article>

              <article className="feature-card md:col-span-2">
                <FeatureHead icon={Clock3} title="ไทม์ไลน์" />
                <p className="feature-text">เรียงเหตุการณ์ตามวันที่ ผูกกับบุคคลและเอกสารที่เกี่ยวข้อง</p>
                <TimelineMock />
              </article>

              <article className="feature-card md:col-span-2">
                <FeatureHead icon={ListChecks} title="เช็กลิสต์" />
                <p className="feature-text">แยกงานฝั่งทนายความกับลูกความ เห็นความคืบหน้าทันที</p>
                <ChecklistMock />
              </article>

              <article className="feature-card md:col-span-2">
                <FeatureHead icon={FolderOpen} title="คลังเอกสาร" />
                <p className="feature-text">
                  ลูกความส่งเอกสารเข้าสำนวน ทนายความตรวจและเปลี่ยนสถานะได้ ตั้งแต่ส่งแล้วจนตรวจแล้ว
                </p>
              </article>

              <article className="feature-card md:col-span-2">
                <FeatureHead icon={CalendarDays} title="ปฏิทินนัดหมาย" />
                <p className="feature-text">ดูนัดศาลและนัดหมายของทุกคดีในปฏิทินเดียว กรองตามคดีได้</p>
              </article>

              <article className="feature-card md:col-span-2">
                <FeatureHead icon={MessageSquare} title="แชทประจำคดี" />
                <p className="feature-text">คุยกับลูกความในบริบทของคดีนั้น พร้อมแจ้งเตือนเมื่อมีข้อความใหม่</p>
              </article>
            </div>
          </div>
        </section>

        {/* Audience */}
        <section id="audience" className="scroll-mt-20 border-t border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            {sectionTitle('สำหรับใคร', 'ออกแบบให้สองฝั่งทำงานร่วมกัน')}

            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  icon: Briefcase,
                  role: 'ทนายความ',
                  lead: 'จัดสำนวน วางกลยุทธ์ และติดตามทุกคดีจากที่เดียว',
                  items: [
                    'สร้างและจัดการคดี ค้นหา กรอง ปิดคดี',
                    'ผังคดี ไทม์ไลน์ และประเด็นเตรียมว่าความ',
                    'ตรวจเอกสารที่ลูกความส่งเข้ามา',
                    'ปฏิทินนัดหมายรวมทุกคดี',
                  ],
                  featured: true,
                },
                {
                  icon: User,
                  role: 'ลูกความ',
                  lead: 'รู้ว่าคดีเดินไปถึงไหน และต้องเตรียมอะไรบ้าง',
                  items: [
                    'ดูภาพรวมและสถานะคดีของตัวเอง',
                    'ส่งเอกสารที่ทนายความขอ',
                    'ทำเช็กลิสต์ฝั่งลูกความ',
                    'คุยกับทนายความในแชทประจำคดี',
                  ],
                  featured: false,
                },
              ].map((c) => (
                <div
                  key={c.role}
                  className={`relative overflow-hidden rounded-3xl border p-7 sm:p-9 ${
                    c.featured
                      ? 'border-[#4f8dfd]/30 bg-gradient-to-br from-[#11285a] via-[#0b1733] to-[#070b14]'
                      : 'border-white/[0.07] bg-[#080d18]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        c.featured ? 'bg-[#1d56db] text-white' : 'bg-white/[0.06] text-[#a9c6ff]'
                      }`}
                    >
                      <c.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-white">{c.role}</h3>
                  </div>
                  <p className="mt-5 text-[#a7b3c9]">{c.lead}</p>
                  <ul className="mt-6 space-y-3">
                    {c.items.map((i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#c9d3e6]">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#4f8dfd]" />
                        {i}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onStart('register')}
                    className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      c.featured
                        ? 'bg-white text-[#0b1733] hover:bg-[#dbe8fe]'
                        : 'border border-white/10 text-white hover:border-white/25'
                    }`}
                  >
                    สมัครในฐานะ{c.role}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section id="steps" className="scroll-mt-20 border-t border-white/[0.06]">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <div>
              {sectionTitle('เริ่มต้นใช้งาน', 'เริ่มได้ใน 3 ขั้นตอน')}
              <p className="-mt-4 max-w-sm text-[#7d8ba6]">
                ไม่ต้องติดตั้งโปรแกรม เปิดผ่านเบราว์เซอร์ได้ทั้งบนคอมพิวเตอร์และมือถือ
              </p>
            </div>
            <ol className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {[
                ['ทนายความสร้างบัญชี', 'สมัครด้วยอีเมลและรหัสผ่าน แล้วเลือกบทบาททนายความ'],
                ['สร้างคดีและระบุอีเมลลูกความ', 'กรอกรายละเอียดคดี พร้อมอีเมลของลูกความที่จะเข้าร่วมสำนวน'],
                ['ลูกความสมัครด้วยอีเมลเดียวกัน', 'ลูกความเห็นคดีของตัวเองทันที ส่งเอกสารและติดตามความคืบหน้าได้'],
              ].map(([title, text], i) => (
                <li key={title} className="flex gap-6 py-7">
                  <span className="font-brand flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#4f8dfd]/40 text-sm text-[#a9c6ff]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-medium text-white">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#7d8ba6]">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t border-white/[0.06]">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="text-center">{sectionTitle('คำถามที่พบบ่อย', 'มีคำถาม? เรามีคำตอบ')}</div>
            <div className="space-y-3">
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={f.q}
                    className={`overflow-hidden rounded-2xl border transition ${
                      open ? 'border-[#4f8dfd]/35 bg-[#0b1630]' : 'border-white/[0.07] bg-[#070b14] hover:border-white/15'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                    >
                      <span className={`text-[15px] ${open ? 'text-white' : 'text-[#c9d3e6]'}`}>{f.q}</span>
                      <span
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition ${
                          open ? 'rotate-45 bg-[#1d56db] text-white' : 'bg-white/[0.05] text-[#93a1bb]'
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                    {open && (
                      <p className="px-5 pb-5 text-sm leading-relaxed text-[#93a1bb] sm:px-6">{f.a}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#4f8dfd]/25 bg-gradient-to-br from-[#123173] via-[#0b1a3d] to-[#060a14] px-6 py-14 text-center sm:px-12 sm:py-20">
            <div aria-hidden className="landing-grid absolute inset-0 opacity-60" />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold text-white sm:text-5xl">พร้อมจัดสำนวนให้เป็นระบบแล้วหรือยัง</h2>
              <p className="mx-auto mt-4 max-w-lg text-[#a7b3c9]">
                สร้างบัญชีแล้วเริ่มคดีแรกได้ในไม่กี่นาที แนะนำให้ทดลองด้วยข้อมูลสมมติ
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => onStart('register')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0b1733] transition hover:bg-[#dbe8fe]"
                >
                  สร้างบัญชี
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onStart('login')}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:bg-white/[0.06]"
                >
                  มีบัญชีแล้ว เข้าสู่ระบบ
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-14 sm:px-6">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <div className="max-w-sm">
              <p className="text-sm text-white">เชื่อมโยงทุกข้อมูล ให้เห็นภาพรวมของคดี</p>
              <p className="mt-2 text-xs leading-relaxed text-[#5d6c88]">
                CASELINK เป็นเว็บต้นแบบ ไม่ใช่คำปรึกษาทางกฎหมาย ฟีเจอร์ AI และ LINE อยู่ในโหมดจำลอง
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="text-[#7d8ba6] transition hover:text-white">
                  {l.label}
                </a>
              ))}
              <button onClick={onOpenPrivacy} className="text-[#7d8ba6] transition hover:text-white">
                นโยบายความเป็นส่วนตัว
              </button>
            </div>
          </div>
          <p
            aria-hidden
            className="font-brand mt-12 select-none bg-gradient-to-b from-[#1c3a7a] to-[#05070c] bg-clip-text text-center text-[19vw] font-extrabold leading-[0.8] tracking-tight text-transparent lg:text-[200px]"
          >
            CASELINK
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureHead: React.FC<{ icon: React.ElementType; title: string }> = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1d56db]/15 text-[#7fb0ff]">
      <Icon className="h-4 w-4" />
    </span>
    <h3 className="font-medium text-white">{title}</h3>
  </div>
);
