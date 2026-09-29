import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CaseItem, ChecklistItem, DocStatus } from '../../types.ts';
import {
  CheckSquare,
  Square,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  FileUp,
  X,
} from 'lucide-react';

interface ChecklistViewProps {
  caseItem: CaseItem;
  onOpenUpload?: (docType?: string) => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  caseItem,
  onOpenUpload,
}) => {
  const { toggleChecklistStatus, addChecklistItem, currentUser } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'client' | 'lawyer'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'client' | 'lawyer'>('lawyer');

  const clientItems = caseItem.checklist.filter((i) => i.category === 'client');
  const lawyerItems = caseItem.checklist.filter((i) => i.category === 'lawyer');

  const totalItems = caseItem.checklist.length;
  const completedItems = caseItem.checklist.filter((i) => i.status === 'ตรวจแล้ว').length;
  const progressPercent = Math.round((completedItems / (totalItems || 1)) * 100);

  const getStatusBadge = (status: DocStatus) => {
    switch (status) {
      case 'ตรวจแล้ว':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>ตรวจแล้ว</span>
          </span>
        );
      case 'กำลังตรวจ':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>กำลังตรวจ</span>
          </span>
        );
      case 'ส่งแล้ว':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
            <CheckCircle2 className="w-3 h-3 text-sky-600" />
            <span>ส่งแล้ว</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            <span>ยังไม่ได้ส่ง</span>
          </span>
        );
    }
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addChecklistItem(caseItem.id, {
      title: newTitle.trim(),
      category: newCategory,
      status: 'ยังไม่ได้ส่ง',
    });
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header & Progress Summary (Section 15: “6 จาก 8 รายการเสร็จแล้ว”) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">เอกสารที่ต้องมี</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            ติดตามและตรวจสอบความพร้อมของเอกสารหลักฐานทั้งหมด
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
          <div>
            <div className="text-xs text-slate-500 font-medium">ความพร้อมเอกสาร</div>
            <div className="text-base font-bold text-slate-900">
              {completedItems} จาก {totalItems} รายการเสร็จแล้ว
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-emerald-600 flex items-center justify-center font-bold text-xs text-slate-800">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ทั้งหมด ({totalItems})
          </button>
          <button
            onClick={() => setFilterType('client')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'client'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ลูกความต้องส่ง ({clientItems.length})
          </button>
          <button
            onClick={() => setFilterType('lawyer')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'lawyer'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ทนายต้องตรวจ ({lawyerItems.length})
          </button>
        </div>

        {currentUser.role === 'lawyer' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ เพิ่มรายการ</span>
          </button>
        )}
      </div>

      {/* 2 CATEGORIES (Section 15): ลูกความต้องส่ง & ทนายต้องตรวจ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category A: ลูกความต้องส่ง */}
        {(filterType === 'all' || filterType === 'client') && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <h3 className="font-bold text-slate-900 text-sm">ลูกความต้องส่ง</h3>
              </div>
              <span className="text-xs text-slate-400">
                {clientItems.filter((i) => i.status === 'ตรวจแล้ว').length}/{clientItems.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {clientItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 transition flex items-center justify-between gap-2"
                >
                  <div
                    onClick={() => toggleChecklistStatus(caseItem.id, item.id)}
                    className="flex items-center space-x-3 cursor-pointer flex-1"
                  >
                    {item.status === 'ตรวจแล้ว' ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 hover:text-slate-400 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        item.status === 'ตรวจแล้ว'
                          ? 'line-through text-slate-400'
                          : 'text-slate-800'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(item.status)}
                    {item.status === 'ยังไม่ได้ส่ง' && onOpenUpload && (
                      <button
                        onClick={() => onOpenUpload(item.title)}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center space-x-1"
                        title="ส่งเอกสารนี้"
                      >
                        <FileUp className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">ส่งเอกสาร</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category B: ทนายต้องตรวจ */}
        {(filterType === 'all' || filterType === 'lawyer') && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h3 className="font-bold text-slate-900 text-sm">ทนายต้องตรวจ</h3>
              </div>
              <span className="text-xs text-slate-400">
                {lawyerItems.filter((i) => i.status === 'ตรวจแล้ว').length}/{lawyerItems.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {lawyerItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 transition flex items-center justify-between gap-2"
                >
                  <div
                    onClick={() => toggleChecklistStatus(caseItem.id, item.id)}
                    className="flex items-center space-x-3 cursor-pointer flex-1"
                  >
                    {item.status === 'ตรวจแล้ว' ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 hover:text-slate-400 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        item.status === 'ตรวจแล้ว'
                          ? 'line-through text-slate-400'
                          : 'text-slate-800'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>

                  <div>{getStatusBadge(item.status)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Checklist Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-6 text-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">เพิ่มรายการตรวจสอบ</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อรายการ
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="เช่น ตรวจสอบภาพถ่ายที่เกิดเหตุ"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  หมวดหมู่
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setNewCategory('client')}
                    className={`py-2 px-3 rounded-lg border font-semibold ${
                      newCategory === 'client'
                        ? 'border-sky-500 bg-sky-50 text-sky-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    ลูกความต้องส่ง
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory('lawyer')}
                    className={`py-2 px-3 rounded-lg border font-semibold ${
                      newCategory === 'lawyer'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    ทนายต้องตรวจ
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-xs"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
