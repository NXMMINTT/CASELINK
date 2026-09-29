import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CaseOverviewTab } from './CaseOverviewTab.tsx';
import { MindMapView } from '../mindmap/MindMapView.tsx';
import { TimelineView } from '../timeline/TimelineView.tsx';
import { ChecklistView } from '../checklist/ChecklistView.tsx';
import { DocumentsView } from '../documents/DocumentsView.tsx';
import { CaseChatView } from '../chat/CaseChatView.tsx';
import { DocumentUploadModal } from '../client/DocumentUploadModal.tsx';
import { CloseCaseModal } from './CloseCaseModal.tsx';
import {
  Calendar,
  Briefcase,
  GitCommit,
  CheckSquare,
  FileText,
  Clock,
  ArrowLeft,
  Trash2,
  MessageSquare,
  Gavel,
  CheckCircle,
  RotateCcw,
} from 'lucide-react';

export const CaseDetailView: React.FC = () => {
  const {
    currentCase,
    activeCaseTab,
    setActiveCaseTab,
    setActiveLawyerNav,
    setIsViewingCaseDetail,
    deleteCase,
    reopenCase,
  } = useApp();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState('สัญญา');
  const [isCloseCaseOpen, setIsCloseCaseOpen] = useState(false);

  if (!currentCase) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-600 font-medium">ไม่พบคดีที่เลือก</p>
        <button
          onClick={() => {
            setIsViewingCaseDetail(false);
            setActiveLawyerNav('cases');
          }}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          กลับสู่รายการคดี
        </button>
      </div>
    );
  }

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleOpenUpload = (type: string = 'สัญญา') => {
    setUploadDocType(type);
    setIsUploadModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteCase(currentCase.id);
    setIsDeleteConfirmOpen(false);
    setIsViewingCaseDetail(false);
    setActiveLawyerNav('cases');
  };

  // FULL SCREEN MIND MAP WORKSPACE (Edge-to-edge dedicated Blueprint screen)
  if (activeCaseTab === 'mindmap') {
    return (
      <div className="flex-1 flex flex-col w-full h-full min-h-[calc(100vh-4rem)] bg-[#070b14] overflow-hidden animate-in fade-in duration-150">
        {/* Compact Top Navigation Bar for Mind Map Screen */}
        <div className="bg-slate-950/95 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-white z-20 flex-shrink-0 shadow-md">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setIsViewingCaseDetail(false);
                setActiveLawyerNav('cases');
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer border border-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>รายการคดี</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-100">{currentCase.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold font-mono">
                {currentCase.type}
              </span>
              <span className="text-[11px] text-amber-300 font-medium">🟡 {currentCase.status}</span>
            </div>
          </div>

          {/* Quick Tab switcher */}
          <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveCaseTab('overview')}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer font-medium"
            >
              ภาพรวม
            </button>
            <button
              onClick={() => setActiveCaseTab('mindmap')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold transition cursor-pointer shadow-sm"
            >
              Mind Map
            </button>
            <button
              onClick={() => setActiveCaseTab('timeline')}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer font-medium"
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveCaseTab('documents')}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer font-medium"
            >
              เอกสาร ({currentCase.documents.length})
            </button>
            <button
              onClick={() => setActiveCaseTab('checklist')}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer font-medium"
            >
              Checklist
            </button>
            <button
              onClick={() => setActiveCaseTab('chat')}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer font-medium flex items-center space-x-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>แชท ({currentCase.messages?.length || 0})</span>
            </button>
          </div>
        </div>

        {/* Mind Map Canvas (Taking 100% full screen of the page) */}
        <div className="flex-1 w-full h-[calc(100vh-7rem)] relative overflow-hidden">
          <MindMapView caseItem={currentCase} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Back Button */}
      <button
        onClick={() => {
          setIsViewingCaseDetail(false);
          setActiveLawyerNav('cases');
        }}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>กลับสู่รายการคดีทั้งหมด</span>
      </button>

      {/* SECTION 10: CASE HEADER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                {currentCase.type}
              </span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60 flex items-center space-x-1">
                <span>🟡</span>
                <span>{currentCase.status}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {currentCase.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center space-x-1.5 font-medium text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Deadline: {currentCase.deadline}</span>
              </span>
              <span>•</span>
              <span>ลูกความ: {currentCase.clientName}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {currentCase.status === 'ปิดคดีแล้ว' ? (
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ปิดคดีแล้ว ({currentCase.courtVerdict?.verdictResult || 'เสร็จสิ้น'})</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCloseCaseOpen(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
                  title="ดู/แก้ไขคำสั่งศาล"
                >
                  <Gavel className="w-3.5 h-3.5 text-slate-600" />
                  <span>คำสั่งศาล</span>
                </button>
                <button
                  type="button"
                  onClick={() => reopenCase(currentCase.id)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
                  title="เปิดคดีใหม่ / คืนสถานะดำเนินการ"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>เปิดคดีใหม่</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCloseCaseOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer hover:shadow-md"
              >
                <Gavel className="w-4 h-4" />
                <span>ปิดคดีนี้</span>
              </button>
            )}

            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              title="ลบคดีนี้"
              className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition border border-transparent hover:border-red-100 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECTION 10: NAVIGATION TABS — ONLY 5 ITEMS */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-t border-slate-100 pt-4 mt-6 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveCaseTab('overview')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeCaseTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>ภาพรวม</span>
          </button>

          <button
            onClick={() => setActiveCaseTab('mindmap')}
            className="px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 flex-shrink-0 cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <GitCommit className="w-4 h-4" />
            <span>Mind Map</span>
          </button>

          <button
            onClick={() => setActiveCaseTab('timeline')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeCaseTab === 'timeline'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => setActiveCaseTab('documents')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeCaseTab === 'documents'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>เอกสาร ({currentCase.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveCaseTab('checklist')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeCaseTab === 'checklist'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Checklist</span>
          </button>

          <button
            onClick={() => setActiveCaseTab('chat')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeCaseTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>แชทกับลูกความ ({currentCase.messages?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Active Tab Content Area */}
      <div>
        {activeCaseTab === 'overview' && <CaseOverviewTab caseItem={currentCase} />}
        {activeCaseTab === 'timeline' && <TimelineView caseItem={currentCase} />}
        {activeCaseTab === 'documents' && (
          <DocumentsView
            caseItem={currentCase}
            onOpenUpload={handleOpenUpload}
          />
        )}
        {activeCaseTab === 'checklist' && (
          <ChecklistView
            caseItem={currentCase}
            onOpenUpload={handleOpenUpload}
          />
        )}
        {activeCaseTab === 'chat' && (
          <CaseChatView caseItem={currentCase} />
        )}
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        caseId={currentCase.id}
        initialType={uploadDocType}
      />

      {/* Close Case Modal */}
      <CloseCaseModal
        isOpen={isCloseCaseOpen}
        onClose={() => setIsCloseCaseOpen(false)}
        caseItem={currentCase}
      />

      {/* Delete Case Confirmation Modal (No window.alert/confirm) */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-6 text-slate-800">
            <div className="flex items-center space-x-3 mb-3 text-red-600">
              <div className="p-2 bg-red-100 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">ย้ายคดีนี้ไปที่ถังขยะ?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              คดีนี้จะถูกย้ายไปยังถังขยะ ซึ่งท่านสามารถกด <strong>"กู้คืนคดี"</strong> กลับมาทำงานต่อได้ตลอดเวลาจากหน้าคดีของฉัน
            </p>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center space-x-1"
              >
                <span>ย้ายไปถังขยะ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
