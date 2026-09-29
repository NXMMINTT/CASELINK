/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { MobileNav } from './components/layout/MobileNav.tsx';
import { LawyerDashboard } from './components/lawyer/LawyerDashboard.tsx';
import { CaseListView } from './components/lawyer/CaseListView.tsx';
import { CaseDetailView } from './components/lawyer/CaseDetailView.tsx';
import { CalendarView } from './components/lawyer/CalendarView.tsx';
import { ClientsView } from './components/lawyer/ClientsView.tsx';
import { RoadmapView } from './components/roadmap/RoadmapView.tsx';
import { DocumentsView } from './components/documents/DocumentsView.tsx';
import { ClientDashboard } from './components/client/ClientDashboard.tsx';
import { OnboardingModal } from './components/onboarding/OnboardingModal.tsx';
import { ContextualHelpModal } from './components/help/ContextualHelpModal.tsx';
import { AuthModals } from './components/auth/AuthModals.tsx';
import { CreateCaseModal } from './components/lawyer/CreateCaseModal.tsx';

import { SettingsModal } from './components/settings/SettingsModal.tsx';
import { DocumentUploadModal } from './components/client/DocumentUploadModal.tsx';
import { CaseChatView } from './components/chat/CaseChatView.tsx';
import { ShopeeClientChatView } from './components/chat/ShopeeClientChatView.tsx';
import { MessageSquare, Zap, Bell, X, ArrowRight } from 'lucide-react';

function MainApp() {
  const {
    currentUser,
    activeLawyerNav,
    setActiveLawyerNav,
    currentCase,
    isViewingCaseDetail,
    activeCaseTab,
    lastDeletedToast,
    setLastDeletedToast,
    restoreCase,
    unreadChatCount,
    setUnreadChatCount,
    isLeftChatOpen,
    setIsLeftChatOpen,
    chatNotification,
    setChatNotification,
    simulateClientMessage,
  } = useApp();
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState('สัญญา');

  const isMindMapActive =
    currentUser.role === 'lawyer' &&
    activeLawyerNav === 'cases' &&
    isViewingCaseDetail &&
    activeCaseTab === 'mindmap';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 pb-16 md:pb-0 relative">
      {/* Realtime Incoming Chat Notification Banner */}
      {chatNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-md bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/80 backdrop-blur-md animate-in slide-in-from-top-4 flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 animate-bounce">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                🔔 ลูกความพิมพ์สอบถาม: {chatNotification.sender}
              </span>
              <button
                onClick={() => setChatNotification(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer ml-2"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-200 mt-1 line-clamp-2 bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 font-medium">
              "{chatNotification.text}"
            </p>
            <div className="mt-2.5 flex items-center space-x-2">
              <button
                onClick={() => {
                  setActiveLawyerNav('chat');
                  setUnreadChatCount(0);
                  setChatNotification(null);
                }}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-sm"
              >
                <span>เปิดตอบข้อความ</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  setIsLeftChatOpen(true);
                  setUnreadChatCount(0);
                  setChatNotification(null);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                เปิดแชทด่วนด้านซ้าย
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {currentUser.role === 'lawyer' ? (
          <>
            {/* Lawyer Sidebar */}
            <Sidebar
              onOpenCreateCase={() => setIsCreateCaseOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Main Lawyer Workspace */}
            <main
              className={`flex-1 flex flex-col ${
                isMindMapActive ? 'overflow-hidden p-0 bg-[#070b14]' : 'overflow-y-auto p-4 sm:p-6 lg:p-8'
              }`}
            >
              {activeLawyerNav === 'dashboard' && (
                <LawyerDashboard onOpenCreateCase={() => setIsCreateCaseOpen(true)} />
              )}
              {activeLawyerNav === 'cases' && (
                isViewingCaseDetail && currentCase ? (
                  <CaseDetailView />
                ) : (
                  <CaseListView onOpenCreateCase={() => setIsCreateCaseOpen(true)} />
                )
              )}
              {activeLawyerNav === 'chat' && <ShopeeClientChatView />}
              {activeLawyerNav === 'calendar' && <CalendarView />}
              {activeLawyerNav === 'documents' && currentCase && (
                <DocumentsView
                  caseItem={currentCase}
                  onOpenUpload={(type) => {
                    setUploadDocType(type || 'สัญญา');
                    setIsUploadDocOpen(true);
                  }}
                />
              )}
              {activeLawyerNav === 'clients' && <ClientsView />}
              {activeLawyerNav === 'roadmap' && <RoadmapView />}
            </main>
          </>
        ) : (
          /* Client Portal View */
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <ClientDashboard />
          </main>
        )}

        {/* DOCKED LEFT QUICK CHAT DRAWER ("ใส่ในฝั่งด้านซ้ายก็ได้ให้มีแจ้งเตือนด้วยเวลาคนพิมพ์ถามมา") */}
        {currentUser.role === 'lawyer' && currentCase && (
          <>
            {/* Quick Floating Chat Button on the Left if drawer is closed */}
            {!isLeftChatOpen && (
              <div className="fixed left-5 bottom-6 z-40">
                <button
                  type="button"
                  onClick={() => {
                    setIsLeftChatOpen(true);
                    setUnreadChatCount(0);
                  }}
                  className={`px-4 py-2.5 rounded-2xl shadow-2xl border font-bold text-xs flex items-center space-x-2 transition cursor-pointer backdrop-blur-md ${
                    unreadChatCount > 0
                      ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse hover:bg-emerald-500'
                      : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-white'
                  }`}
                  title="เปิดหน้าต่างแชทด่วนด้านซ้าย"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>แชทลูกความ</span>
                  {unreadChatCount > 0 ? (
                    <span className="px-1.5 py-0.5 rounded-full bg-white text-emerald-700 font-extrabold text-[10px]">
                      {unreadChatCount} ใหม่
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </button>
              </div>
            )}

            {/* Left Slide-out Quick Chat Panel */}
            {isLeftChatOpen && (
              <div className="fixed left-0 top-16 bottom-0 w-96 max-w-[90vw] z-50 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
                <div className="p-3.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <span>แชทด่วนประจำสำนวน</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </h3>
                      <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {currentCase.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => simulateClientMessage(currentCase.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900/50 text-slate-300 hover:text-emerald-300 transition cursor-pointer text-[10px] flex items-center space-x-1"
                      title="จำลองลูกความพิมพ์ถามมา"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLeftChatOpen(false)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                      title="ปิดแชทด่วน"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden p-2">
                  <CaseChatView caseItem={currentCase} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Responsive Mobile Navigation */}
      <MobileNav />

      {/* Floating Undo / Recover Case Toast */}
      {lastDeletedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3.5 animate-in slide-in-from-bottom-5">
          <div className="flex items-center space-x-2">
            <span className="text-amber-400 text-sm">🗑️</span>
            <span className="text-xs sm:text-sm">
              ย้ายคดี <strong>"{lastDeletedToast.case.title}"</strong> ไปที่ถังขยะแล้ว
            </span>
          </div>
          <button
            onClick={() => restoreCase(lastDeletedToast.case.id)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-sm"
          >
            <span>🔄 กู้คืนทันที</span>
          </button>
          <button
            onClick={() => setLastDeletedToast(null)}
            className="text-slate-400 hover:text-white text-xs ml-1 cursor-pointer"
            title="ปิดการแจ้งเตือน"
          >
            ✕
          </button>
        </div>
      )}

      {/* Global Overlays & Modals */}
      <OnboardingModal onOpenCreateCase={() => setIsCreateCaseOpen(true)} />
      <ContextualHelpModal />
      <AuthModals />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <CreateCaseModal
        isOpen={isCreateCaseOpen}
        onClose={() => setIsCreateCaseOpen(false)}
      />
      {currentCase && (
        <DocumentUploadModal
          isOpen={isUploadDocOpen}
          onClose={() => setIsUploadDocOpen(false)}
          caseId={currentCase.id}
          initialType={uploadDocType}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
