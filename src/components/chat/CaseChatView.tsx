import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CaseItem, UserRole } from '../../types.ts';
import { Send, UserCheck, Briefcase, MessageSquare, Clock, Sparkles } from 'lucide-react';

interface CaseChatViewProps {
  caseItem: CaseItem;
}

export const CaseChatView: React.FC<CaseChatViewProps> = ({ caseItem }) => {
  const { sendMessage, currentUser } = useApp();
  const [inputText, setInputText] = useState('');
  
  // Quick role selection inside chat to easily test lawyer <-> client conversations
  const [activeSenderRole, setActiveSenderRole] = useState<UserRole>(currentUser.role);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [caseItem.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(
      caseItem.id,
      inputText.trim(),
      activeSenderRole,
      activeSenderRole === 'lawyer' ? 'ทนายสมชาย' : caseItem.clientName
    );
    setInputText('');
  };

  const handleSendQuickPrompt = (text: string, role: UserRole) => {
    sendMessage(
      caseItem.id,
      text,
      role,
      role === 'lawyer' ? 'ทนายสมชาย' : caseItem.clientName
    );
  };

  const lawyerSuggestions = [
    'ขอเอกสารสัญญาฉบับจริงหรือสำเนาที่มีลายมือชื่อเพิ่มเติมครับ',
    'ทนายได้ตรวจดูข้อเท็จจริงและหลักฐานแล้ว มีน้ำหนักในการฟ้องร้องได้ดีครับ',
    'ขอประสานงานนัดหมายเวลาคุยรายละเอียดก่อนยื่นคำฟ้องครับ',
    'ทางสำนักงานได้สรุปรายการพยานหลักฐานและข้อกฎหมายลงใน Mind Map เรียบร้อยแล้วครับ',
  ];

  const clientSuggestions = [
    'ได้ส่งไฟล์สลิปและเอกสารเพิ่มเติมผ่านระบบให้เรียบร้อยแล้วครับ',
    'อยากสอบถามเรื่องกรอบระยะเวลาของคดี และขั้นตอนถัดไปครับ',
    'สะดวกโทรคุยรายละเอียดช่วงบ่ายวันนี้ครับ',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col h-full min-h-[500px] overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">
                แชทสนทนาประจำสำนวนคดี
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ออนไลน์ เชื่อมโยงสด
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              คดี: {caseItem.title} • ลูกความ: {caseItem.clientName}
            </p>
          </div>
        </div>

        {/* Sender Role Switcher */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-2xs self-start sm:self-auto">
          <span className="text-slate-500 font-medium">พิมพ์ในฐานะ:</span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveSenderRole('lawyer')}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1 ${
                activeSenderRole === 'lawyer'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3 h-3" />
              <span>ทนายสมชาย</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSenderRole('client')}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1 ${
                activeSenderRole === 'client'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>ลูกความ ({caseItem.clientName})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        <div className="text-center my-2">
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            เริ่มต้นการปรึกษาสำนวนคดี ข้อความจะซิงก์ทั้งฝั่งทนายและลูกความอัตโนมัติ
          </span>
        </div>

        {(!caseItem.messages || caseItem.messages.length === 0) ? (
          <div className="text-center py-12 text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-600">ยังไม่มีข้อความสนทนาในคดีนี้</p>
            <p className="text-xs text-slate-400 mt-1">
              พิมพ์ข้อความแรกเพื่อเริ่มคุยกับลูกความ หรือเลือกข้อความสำเร็จรูปด้านล่าง
            </p>
          </div>
        ) : (
          caseItem.messages.map((msg) => {
            const isLawyer = msg.role === 'lawyer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
                  isLawyer ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                {/* Sender info */}
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-1 px-1">
                  <span className="font-semibold text-slate-700">
                    {isLawyer ? '👔 ทนายสมชาย' : `👤 ${msg.sender || caseItem.clientName}`}
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{msg.time}</span>
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs whitespace-pre-wrap break-words ${
                    isLawyer
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Drawer */}
      <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 text-xs flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <span className="font-semibold text-slate-600 flex items-center space-x-1 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>ข้อความด่วน:</span>
        </span>
        {(activeSenderRole === 'lawyer' ? lawyerSuggestions : clientSuggestions).map((sug, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendQuickPrompt(sug, activeSenderRole)}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition text-[11px] cursor-pointer shadow-2xs"
          >
            {sug.length > 28 ? sug.substring(0, 28) + '...' : sug}
          </button>
        ))}
      </div>

      {/* Chat Input Form */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeSenderRole === 'lawyer'
                ? 'พิมพ์ข้อความแจ้งลูกความ (ในฐานะทนาย)...'
                : 'พิมพ์ข้อความตอบกลับหรือสอบถามทนาย (ในฐานะลูกความ)...'
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
        >
          <span>ส่ง</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
