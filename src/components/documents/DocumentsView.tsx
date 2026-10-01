import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CaseItem, CaseDocument, DocStatus } from '../../types.ts';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Filter,
  X,
  FileCheck2,
} from 'lucide-react';

interface DocumentsViewProps {
  caseItem: CaseItem;
  onOpenUpload: (prefillType?: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  caseItem,
  onOpenUpload,
}) => {
  const { updateDocStatus, currentUser } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('ทั้งหมด');
  const [search, setSearch] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<CaseDocument | null>(null);

  const filteredDocs = caseItem.documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === 'ทั้งหมด' ? true : doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header & Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">คลังเอกสารของคดี</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            รวบรวมไฟล์หลักฐานและเอกสารประกอบคดีทั้งหมด ({caseItem.documents.length} รายการ)
          </p>
        </div>

        <button
          onClick={() => onOpenUpload()}
          className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition text-xs sm:text-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ ส่งเอกสาร</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อเอกสาร หรือประเภท..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">สถานะ:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="ตรวจแล้ว">ตรวจแล้ว</option>
            <option value="กำลังตรวจ">กำลังตรวจ</option>
            <option value="ส่งแล้ว">ส่งแล้ว</option>
            <option value="ยังไม่ได้ส่ง">ยังไม่ได้ส่ง</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-medium">ไม่พบเอกสาร</p>
            <p className="text-slate-400 text-xs mt-0.5">กดปุ่ม "+ ส่งเอกสาร" เพื่อเพิ่มเอกสารแรก</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl p-4 border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {doc.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-600 font-medium">
                      {doc.type}
                    </span>
                    <span>{doc.date}</span>
                    {doc.fileSize && <span>{doc.fileSize}</span>}
                    <span className="text-[11px] text-slate-400">
                      ผู้นำส่ง: {doc.uploadedBy}
                    </span>
                  </div>
                  {doc.notes && (
                    <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {doc.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center space-x-2.5 self-end sm:self-center">
                {/* Status Badge / Selector */}
                {currentUser.role === 'lawyer' ? (
                  <div className="relative inline-flex items-center">
                    <select
                      value={doc.status}
                      onChange={(e) => updateDocStatus(caseItem.id, doc.id, e.target.value as DocStatus)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition appearance-none pr-6 ${
                        doc.status === 'ตรวจแล้ว'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : doc.status === 'กำลังตรวจ'
                          ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                          : doc.status === 'ส่งแล้ว'
                          ? 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                      title="คลิกเพื่อเปลี่ยนสถานะเอกสาร"
                    >
                      <option value="ยังไม่ได้ส่ง">⚪ ยังไม่ได้ส่ง</option>
                      <option value="ส่งแล้ว">🔵 ส่งแล้ว</option>
                      <option value="กำลังตรวจ">🟡 กำลังตรวจ</option>
                      <option value="ตรวจแล้ว">🟢 ตรวจแล้ว</option>
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] text-slate-500">
                      ▼
                    </span>
                  </div>
                ) : (
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      doc.status === 'ตรวจแล้ว'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : doc.status === 'กำลังตรวจ'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : doc.status === 'ส่งแล้ว'
                        ? 'bg-sky-50 text-sky-800 border-sky-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {doc.status}
                  </span>
                )}

                {/* Status Quick Cycle for Lawyer */}
                {currentUser.role === 'lawyer' && (
                  <button
                    onClick={() => {
                      const cycleMap: Record<DocStatus, DocStatus> = {
                        'ยังไม่ได้ส่ง': 'ส่งแล้ว',
                        'ส่งแล้ว': 'กำลังตรวจ',
                        'กำลังตรวจ': 'ตรวจแล้ว',
                        'ตรวจแล้ว': 'ยังไม่ได้ส่ง',
                      };
                      updateDocStatus(caseItem.id, doc.id, cycleMap[doc.status] || 'ตรวจแล้ว');
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-xs font-medium text-slate-700 transition"
                    title="คลิกเพื่อสลับสถานะถัดไป"
                  >
                    <FileCheck2 className="w-4 h-4 text-indigo-600" />
                  </button>
                )}

                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition"
                  title="ดูรายละเอียดเอกสาร"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 text-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">รายละเอียดเอกสาร</h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-xs text-slate-400 font-medium">ชื่อเอกสาร:</span>
                <div className="font-bold text-slate-900 text-base">{selectedDoc.title}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-slate-400 font-medium">ประเภท:</span>
                  <div className="font-semibold text-slate-800">{selectedDoc.type}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">สถานะ:</span>
                  <div className="font-semibold text-emerald-700">{selectedDoc.status}</div>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">วันที่บันทึก:</span>
                <div className="text-slate-700">{selectedDoc.date}</div>
              </div>
              {selectedDoc.notes && (
                <div>
                  <span className="text-xs text-slate-400 font-medium">หมายเหตุ:</span>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1 text-slate-700 leading-relaxed">
                    {selectedDoc.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
