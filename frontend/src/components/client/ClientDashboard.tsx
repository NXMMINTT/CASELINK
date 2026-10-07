import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { DocumentUploadModal } from './DocumentUploadModal.tsx';
import {
  FileText,
  FileUp,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Shield,
  User,
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const {
    currentCase,
    activeClientTab,
    setActiveClientTab,
    sendMessage,
  } = useApp();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState<string>('สัญญา');
  const [chatInput, setChatInput] = useState('');

  if (!currentCase) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-600 font-medium">ยังไม่มีข้อมูลคดีที่เชื่อมโยง</p>
      </div>
    );
  }

  // Items client must submit
  const pendingDocs = currentCase.checklist.filter(
    (i) => i.category === 'client' && i.status !== 'ตรวจแล้ว'
  );

  const clientSubmittedDocs = currentCase.documents.filter(
    (d) => d.uploadedBy === 'ลูกความ'
  );

  const handleOpenUpload = (type: string = 'สัญญา') => {
    setUploadDocType(type);
    setIsUploadModalOpen(true);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    void sendMessage(currentCase.id, chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Client Header - Clean and reassuring */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              พื้นที่สำหรับลูกความ
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">
              คดีของฉัน
            </h1>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              {currentCase.title}
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 text-amber-800 self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-bold">สถานะ: {currentCase.status}</span>
          </div>
        </div>

        {/* Section 17 Navigation Tabs for Client: ภาพรวม / เอกสาร / สิ่งที่ต้องทำ / ข้อความ */}
        <div className="flex items-center space-x-2 border-t border-slate-100 pt-4 mt-5 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveClientTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeClientTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            ภาพรวม
          </button>
          <button
            onClick={() => setActiveClientTab('todos')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeClientTab === 'todos'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            สิ่งที่ต้องทำ ({pendingDocs.length})
          </button>
          <button
            onClick={() => setActiveClientTab('documents')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeClientTab === 'documents'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            เอกสาร ({clientSubmittedDocs.length})
          </button>
          <button
            onClick={() => setActiveClientTab('messages')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeClientTab === 'messages'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            ข้อความจากทนาย
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW (Section 16: CLIENT HOME) */}
      {activeClientTab === 'overview' && (
        <div className="space-y-6">
          {/* Action Box: สิ่งที่คุณต้องทำ */}
          <div className="bg-white rounded-xl p-6 text-slate-900 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
              <FileUp className="w-4 h-4" />
              <span>สิ่งที่คุณต้องทำ</span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <span>ส่งเอกสาร {pendingDocs.length > 0 ? pendingDocs.length : '0'} รายการ</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg leading-relaxed">
                ทนายความต้องการเอกสารเหล่านี้เพื่อใช้ประกอบการดำเนินคดี กรุณาถ่ายภาพหรืออัปโหลดไฟล์
              </p>
            </div>

            {/* Big Primary Button: “ดูเอกสารที่ต้องส่ง” (Section 16) */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveClientTab('todos')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer"
              >
                <span>ดูเอกสารที่ต้องส่ง</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleOpenUpload('สัญญา')}
                className="px-5 py-3 bg-white/10 hover:bg-white/15 text-slate-900 font-semibold text-sm rounded-xl backdrop-blur-xs transition flex items-center space-x-2 cursor-pointer border border-white/10"
              >
                <FileUp className="w-4 h-4 text-emerald-600" />
                <span>ส่งเอกสารทันที</span>
              </button>
            </div>
          </div>

          {/* Quick Checklist Teaser */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">รายการเอกสารสำคัญ</h3>
            <div className="space-y-2.5">
              {currentCase.checklist
                .filter((i) => i.category === 'client')
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      {item.status === 'ตรวจแล้ว' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                      <span className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          item.status === 'ตรวจแล้ว'
                            ? 'bg-emerald-50 text-emerald-800'
                            : item.status === 'กำลังตรวจ'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.status}
                      </span>

                      {item.status !== 'ตรวจแล้ว' && (
                        <button
                          onClick={() => handleOpenUpload(item.title)}
                          className="px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                        >
                          ส่งไฟล์
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Section 16: “ข้อความจากทนาย” */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">ข้อความจากทนาย</h3>
              </div>
              <button
                onClick={() => setActiveClientTab('messages')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                ดูการสนทนาทั้งหมด
              </button>
            </div>

            <div className="space-y-3">
              {currentCase.messages.slice(-2).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'lawyer'
                      ? 'bg-indigo-50/60 border-indigo-100 text-indigo-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-xs font-bold text-slate-700">
                    <span className="flex items-center space-x-1">
                      {msg.role === 'lawyer' ? (
                        <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{msg.sender}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">{msg.time}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TODOS / สิ่งที่ต้องทำ */}
      {activeClientTab === 'todos' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">เอกสารที่ทนายความร้องขอ</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              กรุณากดปุ่ม "ส่งเอกสาร" ในรายการที่ยังไม่ได้ส่ง
            </p>
          </div>

          <div className="space-y-3">
            {currentCase.checklist
              .filter((i) => i.category === 'client')
              .map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                    <span className="text-xs text-slate-400">
                      สถานะ: {item.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        item.status === 'ตรวจแล้ว'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.status === 'กำลังตรวจ'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>

                    {item.status !== 'ตรวจแล้ว' && (
                      <button
                        onClick={() => handleOpenUpload(item.title)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1"
                      >
                        <FileUp className="w-3.5 h-3.5" />
                        <span>ส่งเอกสารนี้</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENTS / เอกสารที่ส่งแล้ว */}
      {activeClientTab === 'documents' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">เอกสารที่คุณส่งให้ทนาย</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                ติดตามว่าทนายความได้รับและตรวจสอบเอกสารแล้วหรือไม่
              </p>
            </div>
            <button
              onClick={() => handleOpenUpload('อื่นๆ')}
              className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-xs flex items-center space-x-1.5"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>ส่งเอกสารเพิ่ม</span>
            </button>
          </div>

          <div className="space-y-3">
            {clientSubmittedDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{doc.title}</h4>
                    <div className="text-xs text-slate-400 mt-0.5">
                      ประเภท: {doc.type} • ส่งเมื่อ: {doc.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      doc.status === 'ตรวจแล้ว'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MESSAGES / ข้อความ */}
      {activeClientTab === 'messages' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">บทสนทนากับทนายความ</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                สอบถามหรือปรึกษาความคืบหน้าของคดีได้ที่นี่ ข้อความเชื่อมต่อกับหน้าจอทนายความทันที
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              ออนไลน์
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
            {(!currentCase.messages || currentCase.messages.length === 0) ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                ยังไม่มีข้อความสนทนา พิมพ์ข้อความหรือเลือกข้อความด่วนด้านล่างเพื่อเริ่มคุยกับทนายความ
              </div>
            ) : (
              currentCase.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl max-w-md text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    m.role === 'client'
                      ? 'ml-auto bg-blue-600 text-white rounded-tr-xs'
                      : 'mr-auto bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <div
                    className={`text-[10px] font-bold mb-1 ${
                      m.role === 'client' ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {m.role === 'client' ? 'ท่าน (ลูกความ)' : `👔 ${m.sender || 'ทนายความ'}`} • {m.time}
                  </div>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Quick Prompts for Client */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] text-slate-500 font-semibold flex-shrink-0">ส่งด่วน:</span>
            {[
              'ส่งไฟล์สลิปและเอกสารเพิ่มเติมผ่านระบบให้แล้วครับ',
              'สอบถามเรื่องกรอบเวลาขั้นตอนถัดไปของคดีครับ',
              'สะดวกโทรคุยรายละเอียดช่วงบ่ายวันนี้ครับ',
            ].map((text, i) => (
              <button
                key={i}
                type="button"
                onClick={() => void sendMessage(currentCase.id, text)}
                className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 transition cursor-pointer"
              >
                {text}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              placeholder="พิมพ์ข้อความถึงทนายความ..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <span>ส่งข้อความ</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        caseId={currentCase.id}
        initialType={uploadDocType}
      />
    </div>
  );
};
