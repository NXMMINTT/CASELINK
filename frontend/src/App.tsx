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
import { CreateCaseModal } from './components/lawyer/CreateCaseModal.tsx';

import { SettingsModal } from './components/settings/SettingsModal.tsx';
import { DocumentUploadModal } from './components/client/DocumentUploadModal.tsx';
import { CaseChatView } from './components/chat/CaseChatView.tsx';
import { ShopeeClientChatView } from './components/chat/ShopeeClientChatView.tsx';
import { LineBotIntegrationView } from './components/lawyer/LineBotIntegrationView.tsx';
import { PrivacyPolicyModal } from './components/common/PrivacyPolicyModal.tsx';
import { AuthGatewayView } from './components/auth/AuthGatewayView.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { MessageSquare, Bell, X, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';

function MainApp() {
  const {
    currentUser,
    isAuthenticated,
    isCheckingSession,
    syncStatus,
    syncError,
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
    showPrivacyModal,
    setShowPrivacyModal,
  } = useApp();
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState('สัญญา');
  const [authTab, setAuthTab] = useState<'login' | 'register' | null>(null);

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-sm text-slate-500 gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        กำลังโหลด...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {authTab ? (
          <AuthGatewayView
            key={authTab}
            initialTab={authTab}
            onBack={() => {
              setAuthTab(null);
              window.scrollTo(0, 0);
            }}
          />
        ) : (
          <LandingPage
            onStart={(tab) => {
              setAuthTab(tab);
              window.scrollTo(0, 0);
            }}
            onOpenPrivacy={() => setShowPrivacyModal(true)}
          />
        )}
        <PrivacyPolicyModal
          isOpen={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
        />
      </>
    );
  }

  const isMindMapActive =
    currentUser.role === 'lawyer' &&
    activeLawyerNav === 'cases' &&
    isViewingCaseDetail &&
    activeCaseTab === 'mindmap';

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col text-slate-900 pb-16 md:pb-0 relative">
      {/* Save status */}
      {(syncStatus === 'error' || syncError) && (
        <div role="alert" className="bg-rose-50 text-rose-800 border-b border-rose-100 px-4 sm:px-6 py-1.5 text-xs flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{syncError || 'บันทึกข้อมูลไม่สำเร็จ'} — ระบบจะลองบันทึกอีกครั้งเมื่อมีการแก้ไข</span>
        </div>
      )}
      {syncStatus === 'saving' && (
        <div className="fixed bottom-20 md:bottom-4 right-4 z-40 bg-white border border-slate-200 shadow-sm rounded-full px-3 py-1 text-xs text-slate-500 flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" />
          กำลังบันทึก
        </div>
      )}

      {/* Incoming chat notification */}
      {chatNotification && (
        <div
          role="status"
          className="fixed top-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm bg-white p-4 rounded-xl shadow-lg border border-slate-200 flex items-start gap-3 animate-in slide-in-from-top-4"
        >
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-slate-900">
                ข้อความใหม่จาก {chatNotification.sender}
              </span>
              <button
                onClick={() => setChatNotification(null)}
                className="text-slate-400 hover:text-slate-700 -mt-0.5"
                aria-label="ปิด"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{chatNotification.text}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveLawyerNav('chat');
                  setUnreadChatCount(0);
                  setChatNotification(null);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition flex items-center gap-1"
              >
                <span>ตอบกลับ</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  setIsLeftChatOpen(true);
                  setUnreadChatCount(0);
                  setChatNotification(null);
                }}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md text-xs transition"
              >
                เปิดแชทด่วน
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
                isMindMapActive ? 'overflow-hidden p-0 bg-slate-50' : 'overflow-y-auto p-4 sm:p-6 lg:p-8'
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
              {activeLawyerNav === 'line_bot' && <LineBotIntegrationView />}
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
            {!isLeftChatOpen && (
              <div className="fixed left-4 bottom-20 md:left-64 md:bottom-6 z-40">
                <button
                  type="button"
                  onClick={() => {
                    setIsLeftChatOpen(true);
                    setUnreadChatCount(0);
                  }}
                  className="pl-3 pr-4 py-2 rounded-full shadow-sm border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:border-slate-300 text-sm flex items-center gap-2 transition"
                  title="เปิดแชทด่วน"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>แชทลูกความ</span>
                  {unreadChatCount > 0 && (
                    <span className="min-w-5 px-1.5 rounded-full bg-blue-600 text-white text-[11px] text-center tabular-nums">
                      {unreadChatCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {isLeftChatOpen && (
              <div className="fixed left-0 top-14 bottom-0 w-96 max-w-[90vw] z-50 bg-white border-r border-slate-200 shadow-md flex flex-col animate-in slide-in-from-left duration-200">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-slate-900">แชทด่วนประจำสำนวน</h3>
                    <p className="text-xs text-slate-500 truncate">{currentCase.title}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsLeftChatOpen(false)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      title="ปิด"
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

      {lastDeletedToast && (
        <div
          role="status"
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 bg-white text-slate-900 pl-4 pr-2 py-2 rounded-lg shadow-lg flex items-center gap-3 text-sm animate-in slide-in-from-bottom-5"
        >
          <span>
            ย้าย <strong className="font-medium">"{lastDeletedToast.case.title}"</strong> ไปถังขยะแล้ว
          </span>
          <button
            onClick={() => restoreCase(lastDeletedToast.case.id)}
            className="px-2.5 py-1 text-blue-700 hover:text-slate-900 font-medium rounded-md transition"
          >
            เลิกทำ
          </button>
          <button
            onClick={() => setLastDeletedToast(null)}
            className="p-1 text-slate-500 hover:text-slate-900"
            aria-label="ปิด"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Overlays & Modals */}
      <OnboardingModal onOpenCreateCase={() => setIsCreateCaseOpen(true)} />
      <ContextualHelpModal />
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
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
