import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { FutureUpdateItem } from '../../types.ts';
import {
  MessageSquareQuote,
  Plus,
  Copy,
  Check,
  Trash2,
  Edit3,
  CheckCircle2,
  Circle,
  Presentation,
  X,
  Sparkles,
  Calendar,
  Filter,
  Tag,
  Palette,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  Briefcase,
} from 'lucide-react';

const CATEGORY_MAP: Record<string, { label: string; badgeClass: string }> = {
  client: { label: 'พูดกับลูกความ', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  court: { label: 'แถลงต่อศาล', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  execution: { label: 'เจรจา / บังคับคดี', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  speech: { label: 'ประเด็นนำเสนอ', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200' },
  general: { label: 'อัปเดตทั่วไป', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
  document: { label: 'ตรวจสอบเอกสาร', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const COLOR_MAP: Record<string, { border: string; bg: string; accent: string }> = {
  indigo: { border: 'border-indigo-200', bg: 'bg-indigo-50/40', accent: 'bg-indigo-600' },
  emerald: { border: 'border-emerald-200', bg: 'bg-emerald-50/40', accent: 'bg-emerald-600' },
  amber: { border: 'border-amber-200', bg: 'bg-amber-50/40', accent: 'bg-amber-600' },
  sky: { border: 'border-sky-200', bg: 'bg-sky-50/40', accent: 'bg-sky-600' },
  purple: { border: 'border-purple-200', bg: 'bg-purple-50/40', accent: 'bg-purple-600' },
  rose: { border: 'border-rose-200', bg: 'bg-rose-50/40', accent: 'bg-rose-600' },
};

export const TalkingPointsView: React.FC = () => {
  const {
    cases,
    currentCase,
    selectedCaseId,
    setSelectedCaseId,
    addFutureUpdate,
    updateFutureUpdate,
    toggleFutureUpdate,
    deleteFutureUpdate,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FutureUpdateItem | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [presentationIndex, setPresentationIndex] = useState(0);
  const [copiedAllToast, setCopiedAllToast] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [formCategory, setFormCategory] = useState<'client' | 'court' | 'execution' | 'speech' | 'general'>('client');
  const [formColor, setFormColor] = useState<'indigo' | 'emerald' | 'amber' | 'sky' | 'purple' | 'rose'>('indigo');
  const [formTargetDate, setFormTargetDate] = useState('');

  const activeCase = currentCase || cases[0];
  const items = activeCase?.futureUpdates || [];

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormDetails('');
    setFormCategory('client');
    setFormColor('indigo');
    setFormTargetDate('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: FutureUpdateItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDetails(item.details || '');
    setFormCategory((item.category as any) || 'client');
    setFormColor(item.color || 'indigo');
    setFormTargetDate(item.targetDate || '');
    setIsAddModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !formTitle.trim()) return;

    if (editingItem) {
      updateFutureUpdate(activeCase.id, {
        ...editingItem,
        title: formTitle.trim(),
        details: formDetails.trim() || undefined,
        category: formCategory,
        color: formColor,
        targetDate: formTargetDate.trim() || undefined,
      });
    } else {
      addFutureUpdate(activeCase.id, {
        title: formTitle.trim(),
        details: formDetails.trim() || undefined,
        category: formCategory,
        targetDate: formTargetDate.trim() || undefined,
        color: formColor,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleCopyAll = () => {
    if (!activeCase || items.length === 0) return;
    const header = `=== ประเด็นที่จะพูด & สิ่งที่ต้องอัปเดต ===\nคดี: ${activeCase.title} (ลูกความ: ${activeCase.clientName})\n\n`;
    const body = items
      .map(
        (it, idx) =>
          `${idx + 1}. [${CATEGORY_MAP[it.category || 'general']?.label || 'ทั่วไป'}] ${it.title}${
            it.targetDate ? ` (กำหนด: ${it.targetDate})` : ''
          }\n${it.details ? `   ${it.details.replace(/\n/g, '\n   ')}` : ''}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(header + body);
    setCopiedAllToast(true);
    setTimeout(() => setCopiedAllToast(false), 2000);
  };

  const handleCopySingle = (item: FutureUpdateItem) => {
    const text = `${item.title}\n${item.details || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedCardId(item.id);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  const completedCount = items.filter((i) => i.isCompleted).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                <MessageSquareQuote className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                ประเด็นที่จะพูด & สิ่งที่ต้องอัปเดต
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              พื้นที่จัดเตรียมหัวข้อ บันทึกสคริปต์ และประเด็นที่ท่านต้องการนำไปพูดคุยหรือชี้แจงด้วยตนเอง
            </p>
          </div>

          {/* Case Switcher & Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Case Selector Dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={activeCase?.id || ''}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Copy All */}
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleCopyAll}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
                title="คัดลอกประเด็นทั้งหมด"
              >
                {copiedAllToast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">คัดลอกแล้ว!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>คัดลอกทั้งหมด</span>
                  </>
                )}
              </button>
            )}

            {/* Presentation Mode */}
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setPresentationIndex(0);
                  setIsPresentationMode(true);
                }}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                title="เปิดโหมดนำเสนอ / โหมดซ้อมพูด"
              >
                <Presentation className="w-3.5 h-3.5 text-sky-400" />
                <span>โหมดพูด</span>
              </button>
            )}

            {/* Add Box Button */}
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs hover:shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่ม Box ข้อความ</span>
            </button>
          </div>
        </div>

        {/* Categories Bar & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-5 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex-shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ทั้งหมด ({items.length})
            </button>
            {Object.entries(CATEGORY_MAP).map(([key, cat]) => {
              const count = items.filter((i) => i.category === key).length;
              if (count === 0 && activeCategory !== key) return null;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex-shrink-0 ${
                    activeCategory === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3 text-slate-500">
            <span className="text-xs">
              พูดแล้ว/เสร็จสิ้น: <strong className="text-slate-800">{completedCount}</strong>/{items.length}
            </span>
          </div>
        </div>
      </div>

      {/* Box Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => {
            const catInfo = CATEGORY_MAP[item.category || 'general'] || CATEGORY_MAP.general;
            const colorInfo = COLOR_MAP[item.color || 'indigo'] || COLOR_MAP.indigo;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-sm relative overflow-hidden group ${
                  item.isCompleted
                    ? 'border-slate-200 opacity-60 bg-slate-50/50'
                    : `${colorInfo.border} hover:border-slate-400`
                }`}
              >
                {/* Accent top line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    item.isCompleted ? 'bg-slate-300' : colorInfo.accent
                  }`}
                />

                <div className="space-y-3 pt-1">
                  {/* Category & Action Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${catInfo.badgeClass}`}
                    >
                      {catInfo.label}
                    </span>

                    <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleCopySingle(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title="คัดลอกข้อความ"
                      >
                        {copiedCardId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                        title="แก้ไขประเด็นนี้"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteFutureUpdate(activeCase.id, item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="ลบ Box นี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex items-start space-x-2.5">
                    <button
                      type="button"
                      onClick={() => toggleFutureUpdate(activeCase.id, item.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-500 cursor-pointer flex-shrink-0"
                      title={item.isCompleted ? 'ทำเครื่องหมายว่ายังไม่ได้พูด' : 'ทำเครื่องหมายว่าพูดแล้ว'}
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <h3
                      className={`text-sm sm:text-base font-bold text-slate-900 leading-snug ${
                        item.isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Content / Script */}
                  {item.details && (
                    <div
                      className={`text-xs sm:text-sm text-slate-700 leading-relaxed p-3 rounded-xl whitespace-pre-wrap ${
                        colorInfo.bg
                      } border border-slate-100 ${item.isCompleted ? 'line-through text-slate-400' : ''}`}
                    >
                      {item.details}
                    </div>
                  )}
                </div>

                {/* Footer Tag */}
                {item.targetDate && (
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>กำหนด: {item.targetDate}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      #{index + 1}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Add Blank Card Box */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="min-h-[200px] rounded-xl border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50/50 hover:bg-sky-50/30 p-6 flex flex-col items-center justify-center space-y-2 text-slate-500 hover:text-sky-600 transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-white group-hover:bg-sky-100 text-slate-400 group-hover:text-sky-600 border border-slate-200 group-hover:border-sky-300 flex items-center justify-center transition shadow-2xs">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold">เพิ่ม Box ข้อความใหม่</span>
            <span className="text-[11px] text-slate-400 text-center max-w-[200px]">
              พิมพ์สิ่งที่ท่านจะนำไปพูด ชี้แจง หรือสอบถาม
            </span>
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl p-12 border border-slate-200/90 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center border border-sky-100">
            <MessageSquareQuote className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              ยังไม่มี Box ข้อความในคดีนี้
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              สร้าง Box ข้อความสำหรับบันทึกประเด็นที่ท่านเตรียมนำไปพูดเอง เช่น ชี้แจงลูกความ, อภิปรายต่อศาล, หรือเตรียมคำถาม
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-bold transition inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>สร้าง Box ข้อความแรก</span>
          </button>
        </div>
      )}

      {/* Add / Edit Box Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-lg border border-slate-200 overflow-hidden text-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingItem ? 'แก้ไข Box ข้อความ' : 'เพิ่ม Box ข้อความที่จะพูด'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    คดี: {activeCase?.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  หัวข้อประเด็นที่จะพูด *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="เช่น ชี้แจงผลคำพิพากษาและยอดเงินชดเชยที่ลูกความจะได้รับ..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Category & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ประเภทการพูด / การนำเสนอ
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="client">พูดกับลูกความ</option>
                    <option value="court">แถลงต่อศาล</option>
                    <option value="execution">เจรจา / บังคับคดี</option>
                    <option value="speech">ประเด็นนำเสนอ</option>
                    <option value="general">อัปเดตทั่วไป</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    แถบสี Box
                  </label>
                  <div className="flex items-center space-x-2 py-1">
                    {(['indigo', 'emerald', 'amber', 'sky', 'purple', 'rose'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormColor(c)}
                        className={`w-6 h-6 rounded-full transition cursor-pointer border-2 ${
                          formColor === c ? 'scale-115 border-slate-900' : 'border-transparent opacity-70 hover:opacity-100'
                        } ${
                          c === 'indigo'
                            ? 'bg-indigo-600'
                            : c === 'emerald'
                            ? 'bg-emerald-600'
                            : c === 'amber'
                            ? 'bg-amber-500'
                            : c === 'sky'
                            ? 'bg-sky-500'
                            : c === 'purple'
                            ? 'bg-purple-600'
                            : 'bg-rose-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Speech Script / Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    เนื้อหา / ข้อความ / สคริปต์ที่จะพูด
                  </label>
                  <span className="text-[11px] text-slate-400">รองรับการขึ้นบรรทัดใหม่และ Bullet</span>
                </div>
                <textarea
                  rows={5}
                  placeholder="พิมพ์ข้อความที่ต้องการจะพูด เช่น:&#10;- ชี้แจงยอดเงินรวม 500,000 บาท พร้อมดอกเบี้ย&#10;- กำหนดระยะเวลาชำระภายใน 30 วัน&#10;- หากจำเลยไม่ชำระ จะเริ่มขั้นตอนตั้งเจ้าพนักงานบังคับคดีทันที"
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-normal leading-relaxed"
                />
              </div>

              {/* Target Date / Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  กำหนดเวลา / นัดหมายที่จะพูด (ถ้ามี)
                </label>
                <input
                  type="text"
                  placeholder="เช่น นัดพบลูกความวันที่ 15 ต.ค. เวลา 10:00 น."
                  value={formTargetDate}
                  onChange={(e) => setFormTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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

      {/* Presentation Mode Modal / Teleprompter */}
      {isPresentationMode && items.length > 0 && (
        <div className="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-xl bg-sky-500/20 text-sky-600">
                <Presentation className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  โหมดซ้อมพูด / โหมดนำเสนอ
                </h2>
                <p className="text-xs text-slate-500">
                  คดี: {activeCase?.title} • ประเด็นที่ {presentationIndex + 1} จาก {items.length}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPresentationMode(false)}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center space-x-1.5 text-xs font-bold border border-slate-200"
            >
              <X className="w-4 h-4" />
              <span>ปิดโหมดพูด</span>
            </button>
          </div>

          {/* Active Card in Huge Readable Font */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full py-8 text-center">
            {items[presentationIndex] && (
              <div className="space-y-6 w-full">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-700 border border-sky-200">
                  {CATEGORY_MAP[items[presentationIndex].category || 'general']?.label}
                </span>

                <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
                  {items[presentationIndex].title}
                </h1>

                {items[presentationIndex].details && (
                  <div className="p-8 rounded-xl bg-white/80 border border-slate-200 text-lg sm:text-2xl text-slate-800 leading-relaxed font-medium whitespace-pre-wrap text-left shadow-md max-h-[50vh] overflow-y-auto">
                    {items[presentationIndex].details}
                  </div>
                )}

                {items[presentationIndex].targetDate && (
                  <p className="text-sm text-sky-600 font-mono">
                    กำหนดเวลา: {items[presentationIndex].targetDate}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 max-w-4xl mx-auto w-full">
            <button
              type="button"
              disabled={presentationIndex === 0}
              onClick={() => setPresentationIndex((i) => Math.max(0, i - 1))}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-900 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 border border-slate-200 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ประเด็นก่อนหน้า</span>
            </button>

            <div className="flex items-center space-x-1.5">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPresentationIndex(idx)}
                  className={`w-3 h-3 rounded-full transition cursor-pointer ${
                    presentationIndex === idx ? 'bg-sky-400 scale-125' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={presentationIndex === items.length - 1}
              onClick={() => setPresentationIndex((i) => Math.min(items.length - 1, i + 1))}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-30 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              <span>ประเด็นถัดไป</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
