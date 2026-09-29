import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Lightbulb,
  Edit3,
  Trash2,
  X,
  Tag,
  Check,
  Zap,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';

export interface RoadmapItem {
  id: string;
  title: string;
  details: string;
  status: 'coming_soon' | 'in_progress' | 'planned' | 'completed';
  quarter?: string;
  category: string;
  color: 'sky' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'rose';
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'caselink_web_roadmap_items';

const INITIAL_ROADMAP: RoadmapItem[] = [
  {
    id: 'rd-1',
    title: 'เชื่อมต่อระบบศาลอิเล็กทรอนิกส์ e-Filing & CIOS',
    details: 'ดึงข้อมูลนัดหมาย วันนัดไต่สวน และดาวน์โหลดคำสั่งศาลโดยตรงจากระบบศาลยุติธรรมเข้าสู่แฟ้มคดีอัตโนมัติ',
    status: 'coming_soon',
    quarter: 'Q4 2026',
    category: 'ศาลดิจิทัล e-Filing',
    color: 'sky',
    updatedAt: '29 ก.ย. 2026',
  },
  {
    id: 'rd-2',
    title: 'ระบบช่วยร่างคำฟ้องและเอกสารศาลด้วย AI',
    details: 'สร้างแบบร่างคำฟ้อง คำให้การ และหนังสือบอกกล่าว (Notice) อัตโนมัติจากข้อมูลใน Mind Map และพยานเอกสาร',
    status: 'in_progress',
    quarter: 'Q1 2027',
    category: 'ระบบ AI อัจฉริยะ',
    color: 'indigo',
    updatedAt: '28 ก.ย. 2026',
  },
  {
    id: 'rd-3',
    title: 'ระบบแจ้งเตือนลูกความอัตโนมัติผ่าน LINE Official',
    details: 'แจ้งเตือนวันนัดศาล เอกสารที่ต้องส่ง และรายงานสถานะคดีไปยัง LINE ของลูกความโดยตรงแบบเรียลไทม์',
    status: 'planned',
    quarter: 'Q2 2027',
    category: 'ระบบติดต่อลูกความ',
    color: 'emerald',
    updatedAt: '25 ก.ย. 2026',
  },
  {
    id: 'rd-4',
    title: 'ระบบลงลายมือชื่อดิจิทัล e-Signature ตามกฎหมาย',
    details: 'ให้ลูกความและทนายความสามารถลงชื่อในหนังสือมอบอำนาจและสัญญาจ้างว่าความแบบอิเล็กทรอนิกส์ มีผลผูกพันตามกฎหมาย',
    status: 'in_progress',
    quarter: 'Q4 2026',
    category: 'เอกสารและสัญญา',
    color: 'purple',
    updatedAt: '20 ก.ย. 2026',
  },
  {
    id: 'rd-5',
    title: 'ระบบคำนวณดอกเบี้ยผิดนัด ป.พ.พ. ใหม่อัตโนมัติ',
    details: 'คำนวณดอกเบี้ยตามอัตรา ป.พ.พ. มาตรา 7 และ 224 แบบ Real-time พร้อมตารางแจกแจงสำหรับแนบท้ายคำฟ้อง',
    status: 'completed',
    quarter: 'อัปเดตแล้ว',
    category: 'การเงินและดอกเบี้ย',
    color: 'amber',
    updatedAt: '15 ก.ย. 2026',
  },
  {
    id: 'rd-6',
    title: 'คลังคำพิพากษาฎีกาเทียบเคียง (Supreme Court Precedents)',
    details: 'สืบค้นคำพิพากษาศาลฎีกาที่ใกล้เคียงกับข้อเท็จจริงในคดี พร้อมสรุปย่อประเด็นข้อกฎหมายสำหรับใช้เป็นแนวทางต่อสู้',
    status: 'planned',
    quarter: 'ปี 2027',
    category: 'คลังความรู้กฎหมาย',
    color: 'rose',
    updatedAt: '10 ก.ย. 2026',
  },
];

const STATUS_CONFIG: Record<
  RoadmapItem['status'],
  { label: string; icon: any; badge: string }
> = {
  coming_soon: {
    label: '🚀 เร็วๆ นี้',
    icon: Rocket,
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  in_progress: {
    label: '🛠️ กำลังพัฒนา',
    icon: Clock,
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  planned: {
    label: '💡 วางแผนในอนาคต',
    icon: Lightbulb,
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  completed: {
    label: '✅ อัปเดตแล้ว',
    icon: CheckCircle2,
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
};

const COLOR_STYLES: Record<string, { accent: string; border: string; bg: string }> = {
  sky: { accent: 'bg-sky-500', border: 'border-sky-200', bg: 'bg-sky-50/30' },
  indigo: { accent: 'bg-indigo-600', border: 'border-indigo-200', bg: 'bg-indigo-50/30' },
  emerald: { accent: 'bg-emerald-600', border: 'border-emerald-200', bg: 'bg-emerald-50/30' },
  amber: { accent: 'bg-amber-500', border: 'border-amber-200', bg: 'bg-amber-50/30' },
  purple: { accent: 'bg-purple-600', border: 'border-purple-200', bg: 'bg-purple-50/30' },
  rose: { accent: 'bg-rose-500', border: 'border-rose-200', bg: 'bg-rose-50/30' },
};

export const RoadmapView: React.FC = () => {
  const [items, setItems] = useState<RoadmapItem[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.warn('Failed to load roadmap items from storage', err);
    }
    return INITIAL_ROADMAP;
  });

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [formStatus, setFormStatus] = useState<RoadmapItem['status']>('coming_soon');
  const [formCategory, setFormCategory] = useState('ระบบ AI อัจฉริยะ');
  const [formQuarter, setFormQuarter] = useState('');
  const [formColor, setFormColor] = useState<RoadmapItem['color']>('sky');

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Failed to save roadmap items', err);
    }
  }, [items]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormDetails('');
    setFormStatus('coming_soon');
    setFormCategory('ระบบ AI อัจฉริยะ');
    setFormQuarter('Q4 2026');
    setFormColor('sky');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: RoadmapItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDetails(item.details);
    setFormStatus(item.status);
    setFormCategory(item.category);
    setFormQuarter(item.quarter || '');
    setFormColor(item.color);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const todayStr = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                title: formTitle.trim(),
                details: formDetails.trim(),
                status: formStatus,
                category: formCategory.trim() || 'ทั่วไป',
                quarter: formQuarter.trim() || undefined,
                color: formColor,
                updatedAt: todayStr,
              }
            : i
        )
      );
    } else {
      const newItem: RoadmapItem = {
        id: `rd-${Date.now()}`,
        title: formTitle.trim(),
        details: formDetails.trim(),
        status: formStatus,
        category: formCategory.trim() || 'ทั่วไป',
        quarter: formQuarter.trim() || undefined,
        color: formColor,
        updatedAt: todayStr,
      };
      setItems((prev) => [newItem, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCycleStatus = (id: string) => {
    const cycle: RoadmapItem['status'][] = ['planned', 'in_progress', 'coming_soon', 'completed'];
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const currentIdx = cycle.indexOf(i.status);
          const nextStatus = cycle[(currentIdx + 1) % cycle.length];
          return { ...i, status: nextStatus };
        }
        return i;
      })
    );
  };

  const filteredItems = items.filter((i) => {
    if (filterStatus === 'all') return true;
    return i.status === filterStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/30">
              <Rocket className="w-3.5 h-3.5" />
              <span>CASELINK PRODUCT ROADMAP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              แผนการอัปเดตระบบในอนาคต
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              กระดานรวมรายการฟีเจอร์และสิ่งที่ระบบ CASELINK จะอัปเดตในอนาคต (แยกเป็นอิสระไม่เกี่ยวกับคดี) ท่านสามารถกดเพิ่ม Box ข้อความหรือเขียนรายละเอียดสิ่งที่ต้องการพัฒนาได้เอง
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 cursor-pointer shadow-lg hover:shadow-sky-500/20 self-start sm:self-auto flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ เพิ่ม Box สิ่งที่เว็บจะอัปเดต</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 font-medium block">ทั้งหมด</span>
            <span className="text-xl sm:text-2xl font-bold text-white mt-0.5 block">{items.length} รายการ</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] text-sky-400 font-medium block">🚀 เร็วๆ นี้</span>
            <span className="text-xl sm:text-2xl font-bold text-sky-300 mt-0.5 block">
              {items.filter((i) => i.status === 'coming_soon').length}
            </span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] text-indigo-400 font-medium block">🛠️ กำลังพัฒนา</span>
            <span className="text-xl sm:text-2xl font-bold text-indigo-300 mt-0.5 block">
              {items.filter((i) => i.status === 'in_progress').length}
            </span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] text-emerald-400 font-medium block">✅ อัปเดตแล้ว</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-300 mt-0.5 block">
              {items.filter((i) => i.status === 'completed').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer flex-shrink-0 ${
            filterStatus === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          ทั้งหมด ({items.length})
        </button>
        {(['coming_soon', 'in_progress', 'planned', 'completed'] as const).map((st) => {
          const cfg = STATUS_CONFIG[st];
          const count = items.filter((i) => i.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer flex-shrink-0 flex items-center space-x-1.5 ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cfg.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Roadmap Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const statusInfo = STATUS_CONFIG[item.status];
          const colorStyle = COLOR_STYLES[item.color] || COLOR_STYLES.sky;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md relative overflow-hidden group ${
                item.status === 'completed'
                  ? 'border-slate-200 bg-slate-50/50'
                  : `${colorStyle.border} hover:border-slate-400`
              }`}
            >
              {/* Accent Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${colorStyle.accent}`} />

              <div className="space-y-3.5 pt-1">
                {/* Status & Quarter Tag Header */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCycleStatus(item.id)}
                    title="คลิกเพื่อเปลี่ยนสถานะ"
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition cursor-pointer hover:opacity-80 ${statusInfo.badge}`}
                  >
                    {statusInfo.label}
                  </button>

                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                      title="แก้ไข Box นี้"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="ลบ Box นี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Category & Quarter */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  {item.quarter && (
                    <span className="text-[11px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60">
                      {item.quarter}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  className={`text-base font-bold text-slate-900 leading-snug ${
                    item.status === 'completed' ? 'line-through text-slate-500' : ''
                  }`}
                >
                  {item.title}
                </h3>

                {/* Details */}
                <p
                  className={`text-xs sm:text-sm text-slate-600 leading-relaxed ${
                    item.status === 'completed' ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {item.details}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>บันทึกเมื่อ: {item.updatedAt}</span>
                <button
                  type="button"
                  onClick={() => handleCycleStatus(item.id)}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition cursor-pointer flex items-center space-x-1"
                >
                  <span>เปลี่ยนสถานะ</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Blank Add Box Card */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="min-h-[220px] rounded-2xl border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50/50 hover:bg-sky-50/30 p-6 flex flex-col items-center justify-center space-y-2 text-slate-500 hover:text-sky-600 transition cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-sky-100 text-slate-400 group-hover:text-sky-600 border border-slate-200 group-hover:border-sky-300 flex items-center justify-center transition shadow-xs">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-sm font-bold">+ เพิ่ม Box ข้อความใหม่</span>
          <span className="text-xs text-slate-400 text-center max-w-[220px]">
            เขียนหัวข้อและรายละเอียดสิ่งที่ต้องการให้อัปเดตในอนาคต
          </span>
        </button>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingItem ? 'แก้ไข Box สิ่งที่เว็บจะอัปเดต' : 'เพิ่ม Box สิ่งที่เว็บจะอัปเดตในอนาคต'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    บันทึกฟีเจอร์และแผนงานพัฒนาเว็บไซต์
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  หัวข้อฟีเจอร์ / สิ่งที่เว็บจะอัปเดต *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="เช่น ระบบเชื่อมต่อศาลอิเล็กทรอนิกส์, แจ้งเตือนผ่าน LINE..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    สถานะการอัปเดต
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value="coming_soon">🚀 เร็วๆ นี้ (Coming Soon)</option>
                    <option value="in_progress">🛠️ กำลังพัฒนา (In Progress)</option>
                    <option value="planned">💡 วางแผนในอนาคต (Planned)</option>
                    <option value="completed">✅ อัปเดตแล้ว (Completed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ช่วงเวลาปล่อยอัปเดต / Version
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น Q4 2026, หรือ ปลายปีนี้"
                    value={formQuarter}
                    onChange={(e) => setFormQuarter(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    หมวดหมู่ของฟีเจอร์
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ระบบ AI, ศาลดิจิทัล, เอกสาร..."
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    แถบสี Box
                  </label>
                  <div className="flex items-center space-x-2 py-1">
                    {(['sky', 'indigo', 'emerald', 'amber', 'purple', 'rose'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormColor(c)}
                        className={`w-6 h-6 rounded-full transition cursor-pointer border-2 ${
                          formColor === c ? 'scale-115 border-slate-900' : 'border-transparent opacity-70 hover:opacity-100'
                        } ${
                          c === 'sky'
                            ? 'bg-sky-500'
                            : c === 'indigo'
                            ? 'bg-indigo-600'
                            : c === 'emerald'
                            ? 'bg-emerald-600'
                            : c === 'amber'
                            ? 'bg-amber-500'
                            : c === 'purple'
                            ? 'bg-purple-600'
                            : 'bg-rose-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  รายละเอียด / สิ่งที่ต้องทำ
                </label>
                <textarea
                  rows={4}
                  placeholder="เขียนอธิบายรายละเอียดของฟีเจอร์นี้ สิ่งที่ผู้ใช้จะทำได้ หรือประโยชน์ที่จะเกิดขึ้น..."
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed font-normal"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs"
                >
                  <span>{editingItem ? 'บันทึกการแก้ไข' : 'เพิ่ม Box ข้อความ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
