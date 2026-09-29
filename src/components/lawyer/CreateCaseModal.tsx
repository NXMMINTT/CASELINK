import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { X, Briefcase, Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { ThaiDatePicker, formatToThaiFullDate } from '../common/ThaiDatePicker.tsx';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createCase, setActiveLawyerNav, setActiveCaseTab } = useApp();

  const [title, setTitle] = useState('');
  const [caseType, setCaseType] = useState('คดีแพ่ง');
  const [clientName, setClientName] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to 30 days from today
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [deadline, setDeadline] = useState('');
  const [deadlineNote, setDeadlineNote] = useState('นัดศาล / ครบกำหนดยื่นคำให้การ');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('กรุณากรอกชื่อคดี');
      return;
    }

    const resolvedDeadline = deadline.trim() || (selectedDate ? formatToThaiFullDate(selectedDate) : '30 วันนับจากวันนี้');

    createCase({
      title: title.trim(),
      type: caseType,
      clientName: clientName.trim() || 'ลูกความ',
      deadline: resolvedDeadline,
      description: description.trim() || 'แฟ้มคดีใหม่',
    });

    setErrorMessage(null);
    setTitle('');
    setClientName('');
    setSelectedDate('');
    setDeadline('');
    setDescription('');
    onClose();
    setActiveLawyerNav('cases');
    setActiveCaseTab('overview');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                สร้างคดีใหม่
              </h3>
              <p className="text-xs text-slate-500">กรอกข้อมูลเบื้องต้นเพื่อเปิดแฟ้มคดี</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-medium">
              {errorMessage}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อคดี (โจทก์ vs จำเลย) *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="เช่น นายสมชาย vs บริษัท ABC"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ประเภทคดี
              </label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="คดีแพ่ง">คดีแพ่ง</option>
                <option value="คดีอาญา">คดีอาญา</option>
                <option value="คดีแรงงาน">คดีแรงงาน</option>
                <option value="คดีมรดก">คดีมรดก</option>
                <option value="คดีครอบครัว">คดีครอบครัว</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อลูกความ
              </label>
              <input
                type="text"
                placeholder="เช่น นายสมชาย"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <ThaiDatePicker
            value={selectedDate}
            onChange={(iso, thaiFormatted) => {
              setSelectedDate(iso);
              setDeadline(thaiFormatted);
            }}
            label="กำหนดวันสำคัญ (เลือกจากปฏิทิน)"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียดเบื้องต้น
            </label>
            <textarea
              rows={2}
              placeholder="สรุปข้อเท็จจริงสั้นๆ เช่น ผิดสัญญาจ้างทำของ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>สร้างคดี</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
