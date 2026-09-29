import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CaseItem, UserRole } from '../../types.ts';
import {
  MessageSquare,
  Search,
  Send,
  Zap,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  ChevronRight,
  Briefcase,
  Calendar,
  FileText,
  User,
  Phone,
  Mail,
  Info,
  ExternalLink,
  Clock,
  Sparkles,
  Shield,
  Circle,
  X,
  Filter,
} from 'lucide-react';

export const ShopeeClientChatView: React.FC = () => {
  const {
    cases,
    currentCase,
    selectedCaseId,
    setSelectedCaseId,
    sendMessage,
    simulateClientMessage,
    setIsViewingCaseDetail,
    setActiveCaseTab,
    unreadChatCount,
    setUnreadChatCount,
  } = useApp();

  // Active selected conversation (defaults to currentCase or first case)
  const activeCase = currentCase || cases[0];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
  const [inputText, setInputText] = useState('');
  const [activeSenderRole, setActiveSenderRole] = useState<UserRole>('lawyer');
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeCase?.messages]);

  // Clear unread count when viewing active conversation
  useEffect(() => {
    if (activeCase) {
      setUnreadChatCount(0);
    }
  }, [activeCase?.id]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeCase || !inputText.trim()) return;

    sendMessage(
      activeCase.id,
      inputText.trim(),
      activeSenderRole,
      activeSenderRole === 'lawyer' ? 'ทนายสมชาย' : activeCase.clientName
    );
    setInputText('');
  };

  const handleSendQuickReply = (text: string) => {
    if (!activeCase) return;
    sendMessage(activeCase.id, text, 'lawyer', 'ทนายสมชาย');
  };

  const handleSimulateFrom = (cId: string, customText?: string) => {
    simulateClientMessage(cId, customText);
    setSelectedCaseId(cId);
    setIsSimulateModalOpen(false);
  };

  // Filter conversations
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.messages && c.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (filterTab === 'unread') {
      const lastMsg = c.messages && c.messages[c.messages.length - 1];
      return lastMsg && lastMsg.role === 'client';
    }

    return true;
  });

  const quickReplies = [
    'สวัสดีครับ ได้รับเอกสารครบถ้วนแล้ว อยู่ระหว่างตรวจทานครับ',
    'ทนายได้จัดเตรียมคำฟ้องและหลักฐานลงใน Mind Map เรียบร้อยครับ',
    'รบกวนส่งสำเนาสัญญาฉบับจริงหรือสลิปการโอนเงินเพิ่มเติมครับ',
    'กำหนดนัดศาลครั้งถัดไปคือตามที่ลงไว้ในระบบครับ',
    'ศาลมีคำสั่งแล้ว อยู่ระหว่างเตรียมการประสานงานบังคับคดีครับ',
  ];

  const incomingSimulations = [
    'สวัสดีครับทนาย อยากสอบถามว่าเอกสารสัญญาเพิ่มเติมต้องเซ็นตรงไหนบ้างครับ?',
    'คุณทนายครับ ได้รับไฟล์สลิปโอนเงินที่ส่งไปในระบบหรือยังครับ?',
    'สอบถามเรื่องวันนัดขึ้นศาลครั้งแรกครับ ทางศาลส่งหมายมาหรือยังครับ?',
    'ปรึกษาเพิ่มเติมครับ ทางคู่กรณีติดต่อมาขอเจรจาไกล่เกลี่ย เราควรตอบอย่างไรดีครับ?',
    'รบกวนทนายช่วยตรวจสอบข้อกฎหมายเรื่องการผิดนัดชำระหนี้ด้วยครับ',
  ];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-6.5rem)] flex flex-col space-y-3 animate-in fade-in duration-150">
      {/* Top Banner Notice */}
      <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span>แชทสนทนากับลูกความ</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                🟢 ออนไลน์
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              กล่องข้อความรวมทุกคดี เลือกลูกความที่จะตอบกลับ แชทโต้ตอบแบบเรียลไทม์พร้อมข้อมูลคดีประกอบ
            </p>
          </div>
        </div>

        {/* Action: Simulate Incoming Message Button */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsSimulateModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs hover:shadow-indigo-500/20"
            title="จำลองให้ลูกความส่งแชทมาหา เพื่อทดสอบการแจ้งเตือนและการตอบกลับ"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>⚡ จำลองลูกความแชทมา</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Chat Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex overflow-hidden min-h-0">
        {/* ============================================================== */}
        {/* COLUMN 1: CONVERSATIONS LIST (INBOX) */}
        {/* ============================================================== */}
        <div className="w-80 sm:w-88 border-r border-slate-200/90 flex flex-col flex-shrink-0 bg-slate-50/50">
          {/* Inbox Search & Filter Tabs */}
          <div className="p-3 border-b border-slate-200/80 space-y-2 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาลูกความ หรือชื่อคดี..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-transparent focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`flex-1 py-1 rounded-lg font-bold transition cursor-pointer text-center ${
                  filterTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ทั้งหมด ({cases.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('unread')}
                className={`flex-1 py-1 rounded-lg font-bold transition cursor-pointer text-center flex items-center justify-center space-x-1 ${
                  filterTab === 'unread'
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>ยังไม่อ่าน</span>
                {unreadChatCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredCases.map((c) => {
              const isSelected = activeCase?.id === c.id;
              const messages = c.messages || [];
              const lastMessage = messages[messages.length - 1];
              const isClientLast = lastMessage && lastMessage.role === 'client';

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3.5 transition cursor-pointer flex items-start space-x-3 relative ${
                    isSelected
                      ? 'bg-indigo-50/70 border-l-4 border-l-indigo-600'
                      : 'hover:bg-slate-100/70 bg-white'
                  }`}
                >
                  {/* Client Avatar with Online Dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {c.clientName.slice(0, 1)}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>

                  {/* Text preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs sm:text-sm truncate ${
                          isSelected ? 'font-bold text-indigo-950' : 'font-semibold text-slate-900'
                        }`}
                      >
                        {c.clientName}
                      </h4>
                      {lastMessage && (
                        <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                          {lastMessage.time}
                        </span>
                      )}
                    </div>

                    {/* Case Badge */}
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium truncate max-w-[170px]">
                        {c.type}: {c.title}
                      </span>
                    </div>

                    {/* Last message snippet */}
                    <p
                      className={`text-xs truncate mt-1 ${
                        isClientLast && isSelected === false
                          ? 'font-bold text-indigo-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {lastMessage ? (
                        <>
                          <span className="font-semibold text-slate-700">
                            {lastMessage.role === 'lawyer' ? 'คุณ: ' : ''}
                          </span>
                          {lastMessage.text}
                        </>
                      ) : (
                        <span className="text-slate-400 italic">ยังไม่มีข้อความสนทนา</span>
                      )}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {isClientLast && (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 flex-shrink-0 mt-2" />
                  )}
                </div>
              );
            })}

            {filteredCases.length === 0 && (
              <div className="p-8 text-center text-slate-400 space-y-1">
                <p className="text-xs">ไม่พบบทสนทนา</p>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 2: ACTIVE CHAT ROOM */}
        {/* ============================================================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fb]">
          {activeCase ? (
            <>
              {/* Chat Header */}
              <div className="px-5 py-3 border-b border-slate-200/90 bg-white flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {activeCase.clientName.slice(0, 1)}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {activeCase.clientName}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {activeCase.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>กำลังออนไลน์ • คดี: {activeCase.title}</span>
                    </p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {/* Sender Role Toggle for Lawyer / Client simulation */}
                  <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl text-xs border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActiveSenderRole('lawyer')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1 ${
                        activeSenderRole === 'lawyer'
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Briefcase className="w-3 h-3" />
                      <span>ตอบในนามทนาย</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSenderRole('client')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1 ${
                        activeSenderRole === 'client'
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <User className="w-3 h-3" />
                      <span>พิมพ์เป็นลูกความ</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsViewingCaseDetail(true);
                      setActiveCaseTab('overview');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center space-x-1 cursor-pointer"
                    title="เปิดดูแฟ้มคดีนี้"
                  >
                    <span>เปิดแฟ้มคดี</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowRightPanel(!showRightPanel)}
                    className={`p-2 rounded-xl border transition cursor-pointer ${
                      showRightPanel
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title="เปิด/ปิด แถบข้อมูลคดีด้านขวา"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Date separator */}
                <div className="flex items-center justify-center my-2">
                  <span className="text-[11px] font-semibold text-slate-400 bg-white/90 px-3 py-1 rounded-full border border-slate-200/60 shadow-2xs">
                    วันนี้
                  </span>
                </div>

                {activeCase.messages && activeCase.messages.length > 0 ? (
                  activeCase.messages.map((msg) => {
                    const isLawyer = msg.role === 'lawyer';

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end space-x-2 ${
                          isLawyer ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {/* Client avatar on left */}
                        {!isLawyer && (
                          <div className="w-7 h-7 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mb-1 shadow-2xs">
                            {msg.sender.slice(0, 1)}
                          </div>
                        )}

                        <div
                          className={`max-w-[80%] sm:max-w-[70%] space-y-1 ${
                            isLawyer ? 'items-end' : 'items-start'
                          }`}
                        >
                          {!isLawyer && (
                            <span className="text-[11px] font-semibold text-slate-500 pl-1">
                              {msg.sender}
                            </span>
                          )}

                          {/* Message Bubble */}
                          <div
                            className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs whitespace-pre-wrap break-words ${
                              isLawyer
                                ? 'bg-indigo-600 text-white rounded-br-xs'
                                : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                            }`}
                          >
                            {msg.text}
                          </div>

                          {/* Time & Read Receipt */}
                          <div
                            className={`flex items-center space-x-1 text-[10px] text-slate-400 px-1 ${
                              isLawyer ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <span>{msg.time}</span>
                            {isLawyer && (
                              <span className="flex items-center space-x-0.5 text-indigo-600 font-medium">
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>อ่านแล้ว</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
                    <MessageSquare className="w-10 h-10 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">ยังไม่มีข้อความในห้องนี้</p>
                    <p className="text-xs">พิมพ์ข้อความทักทายหรือเลือกข้อความตอบกลับด่วนด้านล่าง</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Canned Replies Bar */}
              <div className="px-4 py-2 bg-white border-t border-slate-200/70 flex items-center space-x-2 overflow-x-auto text-xs">
                <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1 flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>คำตอบด่วน:</span>
                </span>
                {quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendQuickReply(qr)}
                    className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 transition text-[11px] font-medium cursor-pointer"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
              >
                <button
                  type="button"
                  onClick={() =>
                    handleSendQuickReply('ทนายขอส่งสำเนาเอกสารและแบบร่างคำฟ้องให้ตรวจทานครับ')
                  }
                  className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition cursor-pointer flex-shrink-0"
                  title="แนบเอกสาร"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={
                    activeSenderRole === 'lawyer'
                      ? `พิมพ์ข้อความตอบกลับ ${activeCase.clientName}... (กด Enter เพื่อส่ง)`
                      : `พิมพ์ข้อความในฐานะลูกความ (${activeCase.clientName})...`
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/60 focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <span>ส่ง</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-300" />
              <h3 className="text-base font-bold text-slate-700">เลือกลูกความเพื่อเริ่มสนทนา</h3>
              <p className="text-xs text-slate-500">คลิกที่รายชื่อลูกความทางด้านซ้ายเพื่อเปิดแชท</p>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* COLUMN 3: RIGHT CASE SNAPSHOT (ORDER/CASE SUMMARY) */}
        {/* ============================================================== */}
        {showRightPanel && activeCase && (
          <div className="w-72 sm:w-80 border-l border-slate-200/90 bg-white p-4 space-y-4 overflow-y-auto hidden lg:flex lg:flex-col flex-shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>ข้อมูลคดี & ลูกความ</span>
              </span>
              <button
                type="button"
                onClick={() => setShowRightPanel(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client Profile Box */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {activeCase.clientName.slice(0, 1)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{activeCase.clientName}</h4>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>กำลังออนไลน์</span>
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 space-y-1">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>081-998-XXXX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">client@{activeCase.clientName}.th</span>
                </div>
              </div>
            </div>

            {/* Case Details */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">ชื่อคดี:</span>
                <span className="font-bold text-slate-800 text-sm leading-snug block mt-0.5">
                  {activeCase.title}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">ประเภทคดี:</span>
                  <span className="font-bold text-slate-800">{activeCase.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">สถานะ:</span>
                  <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {activeCase.status}
                  </span>
                </div>
              </div>

              {/* Deadline */}
              <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-200/70 text-indigo-950 space-y-0.5">
                <span className="text-[11px] font-bold text-indigo-800 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>กำหนดวันสำคัญ:</span>
                </span>
                <span className="font-semibold block">{activeCase.deadline}</span>
              </div>

              {/* Case Stats */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block">พยานเอกสาร</span>
                  <span className="font-bold text-slate-800 text-sm">{activeCase.documents.length} ฉบับ</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block">ลำดับเหตุการณ์</span>
                  <span className="font-bold text-slate-800 text-sm">{activeCase.events.length} รายการ</span>
                </div>
              </div>

              {/* Quick Case Link Button */}
              <button
                type="button"
                onClick={() => {
                  setIsViewingCaseDetail(true);
                  setActiveCaseTab('overview');
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <span>เปิดดูสำนวนคดีฉบับเต็ม</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simulation Modal (Choose which client sends a message) */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold">
                <Zap className="w-5 h-5 fill-indigo-500" />
                <h3 className="text-base text-slate-900">จำลองลูกความส่งข้อความมา</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSimulateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              เลือกลูกความและข้อความที่ต้องการจำลองให้ส่งเข้ามา เพื่อทดสอบระบบแจ้งเตือนข้อความใหม่
            </p>

            {/* Clients List to simulate from */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cases.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSimulateFrom(c.id)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                      {c.clientName}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      คดี: {c.title}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600">จำลองส่ง &rarr;</span>
                </button>
              ))}
            </div>

            {/* Predefined message options */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 block">
                หรือเลือกข้อความที่ส่งมา:
              </span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {incomingSimulations.map((sim, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSimulateFrom(activeCase?.id || cases[0].id, sim)}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-800 text-[11px] text-slate-700 transition cursor-pointer truncate"
                  >
                    "{sim}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
