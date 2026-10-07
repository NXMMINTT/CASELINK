import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { DeadlineItem } from '../../types.ts';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Gavel,
  FileText,
  User,
  CheckCircle2,
  X,
  Filter,
  Grid,
  List,
} from 'lucide-react';

const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const THAI_MONTH_SHORT_MAP: Record<string, number> = {
  'ม.ค.': 0,
  'ม.ค': 0,
  มกราคม: 0,
  'ก.พ.': 1,
  'ก.พ': 1,
  กุมภาพันธ์: 1,
  'มี.ค.': 2,
  'มี.ค': 2,
  มีนาคม: 2,
  'เม.ย.': 3,
  'เม.ย': 3,
  เมษายน: 3,
  'พ.ค.': 4,
  'พ.ค': 4,
  พฤษภาคม: 4,
  'มิ.ย.': 5,
  'มิ.ย': 5,
  มิถุนายน: 5,
  'ก.ค.': 6,
  'ก.ค': 6,
  กรกฎาคม: 6,
  'ส.ค.': 7,
  'ส.ค': 7,
  สิงหาคม: 7,
  'ก.ย.': 8,
  'ก.ย': 8,
  กันยายน: 8,
  'ต.ค.': 9,
  'ต.ค': 9,
  ตุลาคม: 9,
  'พ.ย.': 10,
  'พ.ย': 10,
  พฤศจิกายน: 10,
  'ธ.ค.': 11,
  'ธ.ค': 11,
  ธันวาคม: 11,
};

const WEEKDAYS = [
  { short: 'อา.', full: 'อาทิตย์', isWeekend: true, color: 'text-red-500' },
  { short: 'จ.', full: 'จันทร์', isWeekend: false, color: 'text-slate-700' },
  { short: 'อ.', full: 'อังคาร', isWeekend: false, color: 'text-slate-700' },
  { short: 'พ.', full: 'พุธ', isWeekend: false, color: 'text-slate-700' },
  { short: 'พฤ.', full: 'พฤหัสบดี', isWeekend: false, color: 'text-slate-700' },
  { short: 'ศ.', full: 'ศุกร์', isWeekend: false, color: 'text-slate-700' },
  { short: 'ส.', full: 'เสาร์', isWeekend: true, color: 'text-indigo-600' },
];

// Helper to parse Thai dates like "30 ก.ย. 2026" or "2026-09-30"
function parseThaiDate(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr) return null;

  // Pattern: "YYYY-MM-DD"
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr.trim())) {
    const [y, m, d] = dateStr.trim().split('-').map(Number);
    return { year: y, month: m - 1, day: d };
  }

  // Pattern: "30 ก.ย. 2026" or "30 กันยายน 2569"
  const tokens = dateStr.trim().split(/\s+/);
  if (tokens.length >= 3) {
    const day = parseInt(tokens[0], 10);
    const monthToken = tokens[1];
    let year = parseInt(tokens[2], 10);

    const monthIndex = THAI_MONTH_SHORT_MAP[monthToken] ?? -1;

    // Convert Buddhist era to A.D. if > 2500
    if (year > 2500) {
      year = year - 543;
    }

    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return { year, month: monthIndex, day };
    }
  }

  return null;
}

export const CalendarView: React.FC = () => {
  const {
    cases,
    setSelectedCaseId,
    setActiveLawyerNav,
    setActiveCaseTab,
    setIsViewingCaseDetail,
    addDeadline,
  } = useApp();

  // Current calendar viewing state (Default to real local current date)
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(() => new Date().getDate());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCaseFilter, setSelectedCaseFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New appointment form state
  const [newTitle, setNewTitle] = useState('');
  const [newCaseId, setNewCaseId] = useState(cases[0]?.id || '');
  const [newDay, setNewDay] = useState(() => new Date().getDate());
  const [newUrgency, setNewUrgency] = useState<'high' | 'medium' | 'low'>('high');
  const [newType, setNewType] = useState<'court' | 'document' | 'client'>('court');

  // Collect all deadlines from all cases
  const allDeadlines = useMemo(() => {
    return cases.flatMap((c) =>
      (c.deadlines || []).map((dl) => ({
        ...dl,
        caseTitle: c.title,
        caseId: c.id,
        parsedDate: parseThaiDate(dl.dueDate),
      }))
    );
  }, [cases]);

  // Filter deadlines by selected case
  const filteredDeadlines = useMemo(() => {
    if (selectedCaseFilter === 'all') return allDeadlines;
    return allDeadlines.filter((dl) => dl.caseId === selectedCaseFilter);
  }, [allDeadlines, selectedCaseFilter]);

  // Filter deadlines for the current month
  const currentMonthDeadlines = useMemo(() => {
    return filteredDeadlines.filter((dl) => {
      if (!dl.parsedDate) return false;
      return (
        dl.parsedDate.year === currentYear && dl.parsedDate.month === currentMonth
      );
    });
  }, [filteredDeadlines, currentYear, currentMonth]);

  // Map of deadlines by day number (e.g. 30 -> [deadline1, deadline2])
  const deadlinesByDay = useMemo(() => {
    const map: Record<number, typeof allDeadlines> = {};
    currentMonthDeadlines.forEach((dl) => {
      if (dl.parsedDate) {
        const day = dl.parsedDate.day;
        if (!map[day]) map[day] = [];
        map[day].push(dl);
      }
    });
    return map;
  }, [currentMonthDeadlines]);

  // Calculate days in current month & starting weekday
  const { totalDays, startWeekday, prevMonthDays } = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const prevLastDay = new Date(currentYear, currentMonth, 0);

    return {
      totalDays: lastDay.getDate(),
      startWeekday: firstDay.getDay(), // 0 = Sunday
      prevMonthDays: prevLastDay.getDate(),
    };
  }, [currentYear, currentMonth]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(now.getDate());
  };

  const handleOpenCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setIsViewingCaseDetail(true);
    setActiveLawyerNav('cases');
    setActiveCaseTab('overview');
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCaseId) return;

    const thaiMonthStr = THAI_MONTHS[currentMonth];
    const dueDateStr = `${newDay} ${thaiMonthStr.substring(0, 3)}. ${currentYear}`;

    addDeadline(newCaseId, {
      title: newTitle.trim(),
      dueDate: dueDateStr,
      urgency: newUrgency,
      type: newType,
    });

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  // Deadlines for selected day
  const selectedDayDeadlines = selectedDate ? deadlinesByDay[selectedDate] || [] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              ปฏิทินและตารางนัดหมาย
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
              {filteredDeadlines.length} นัดหมายทั้งหมด
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            ติดตามวันขึ้นศาล กำหนดยื่นเอกสาร และตารางการทำงานของทุกคดีในรูปแบบตารางปฏิทิน
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>ตารางปฏิทิน</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>รายการนัด</span>
            </button>
          </div>

          {/* Add Appointment Button */}
          <button
            onClick={() => {
              setNewDay(selectedDate || 1);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3.5 rounded-xl shadow-xs transition text-xs sm:text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>เพิ่มนัดหมาย</span>
          </button>
        </div>
      </div>

      {/* Calendar Navigation Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Selector with Arrows */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-2xs"
              title="เดือนก่อนหน้า"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleGoToToday}
              className="px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-white rounded-lg transition cursor-pointer"
            >
              วันนี้
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-2xs"
              title="เดือนถัดไป"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-lg sm:text-xl font-semibold text-slate-900">
            {THAI_MONTHS[currentMonth]} {currentYear + 543}
            <span className="text-xs font-medium text-slate-400 ml-2">
              (ค.ศ. {currentYear})
            </span>
          </div>
        </div>

        {/* Case Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 font-medium">กรองตามคดี:</span>
          <select
            value={selectedCaseFilter}
            onChange={(e) => setSelectedCaseFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="all">ทุกคดี ({cases.length} คดี)</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: CALENDAR TABLE GRID */}
      {viewMode === 'grid' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Weekday Header (7 columns: อาทิตย์ - เสาร์) */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center py-3">
              {WEEKDAYS.map((wd, index) => (
                <div key={index} className="text-xs font-bold uppercase tracking-wider">
                  <span className={wd.color}>{wd.short}</span>
                  <span className="hidden md:inline text-slate-500 font-medium text-[11px] ml-1">
                    ({wd.full})
                  </span>
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 bg-slate-100/40">
              {/* Previous month trailing days */}
              {Array.from({ length: startWeekday }).map((_, i) => {
                const dayNum = prevMonthDays - startWeekday + i + 1;
                return (
                  <div
                    key={`prev-${i}`}
                    className="min-h-[90px] sm:min-h-[110px] p-2 bg-slate-50/50 text-slate-300 text-xs font-medium select-none"
                  >
                    <span>{dayNum}</span>
                  </div>
                );
              })}

              {/* Current month days */}
              {Array.from({ length: totalDays }).map((_, i) => {
                const dayNum = i + 1;
                const dayDeadlines = deadlinesByDay[dayNum] || [];
                const isSelected = selectedDate === dayNum;
                const now = new Date();
                const isToday =
                  currentYear === now.getFullYear() &&
                  currentMonth === now.getMonth() &&
                  dayNum === now.getDate();

                return (
                  <div
                    key={`curr-${dayNum}`}
                    onClick={() => setSelectedDate(dayNum)}
                    className={`min-h-[90px] sm:min-h-[115px] p-1.5 sm:p-2.5 transition flex flex-col justify-between cursor-pointer relative ${
                      isSelected
                        ? 'bg-indigo-50/60 ring-2 ring-indigo-500 ring-inset z-10'
                        : 'bg-white hover:bg-slate-50/90'
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition ${
                          isToday
                            ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                            : isSelected
                            ? 'bg-indigo-100 text-indigo-900 font-semibold'
                            : 'text-slate-700'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {/* Small Indicator if has appointments */}
                      {dayDeadlines.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {dayDeadlines.length}
                        </span>
                      )}
                    </div>

                    {/* Appointment Chips inside Day Cell */}
                    <div className="mt-1.5 space-y-1 overflow-hidden">
                      {dayDeadlines.slice(0, 2).map((dl) => (
                        <div
                          key={dl.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(dayNum);
                          }}
                          className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold truncate flex items-center space-x-1 border transition shadow-2xs ${
                            dl.urgency === 'high'
                              ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                              : dl.type === 'court'
                              ? 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
                              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          }`}
                          title={`${dl.title} (${dl.caseTitle})`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              dl.urgency === 'high'
                                ? 'bg-red-500'
                                : dl.type === 'court'
                                ? 'bg-sky-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          <span className="truncate">{dl.title}</span>
                        </div>
                      ))}

                      {dayDeadlines.length > 2 && (
                        <div className="text-[10px] font-semibold text-slate-500 pl-1">
                          +อีก {dayDeadlines.length - 2} รายการ
                        </div>
                      )}
                    </div>

                    {/* Today label if today */}
                    {isToday && (
                      <span className="text-[9px] font-bold text-indigo-600 self-end mt-1">
                        วันนี้
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Next month trailing days to complete 35 or 42 grid cells */}
              {(() => {
                const filledCells = startWeekday + totalDays;
                const totalCells = filledCells > 35 ? 42 : 35;
                const remaining = totalCells - filledCells;
                return Array.from({ length: remaining }).map((_, i) => (
                  <div
                    key={`next-${i}`}
                    className="min-h-[90px] sm:min-h-[110px] p-2 bg-slate-50/50 text-slate-300 text-xs font-medium select-none"
                  >
                    <span>{i + 1}</span>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Selected Date Detail Drawer / Bottom Panel */}
          {selectedDate && (
            <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base border border-indigo-100">
                    {selectedDate}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      นัดหมายวันที่ {selectedDate} {THAI_MONTHS[currentMonth]} {currentYear + 543}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedDayDeadlines.length > 0
                        ? `มี ${selectedDayDeadlines.length} รายการนัดหมายและกำหนดส่ง`
                        : 'ไม่มีกำหนดนัดหมายในวันนี้'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setNewDay(selectedDate);
                    setIsAddModalOpen(true);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-xs font-semibold transition border border-slate-200 hover:border-indigo-200 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มนัดหมายในวันนี้</span>
                </button>
              </div>

              {/* List of items for selected date */}
              {selectedDayDeadlines.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <CalendarIcon className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-sm font-medium">ยังไม่มีรายการนัดหมายสำหรับวันที่เลือก</p>
                  <p className="text-xs text-slate-400">
                    คุณสามารถกดปุ่ม "+ เพิ่มนัดหมายในวันนี้" เพื่อบันทึกวันนัดใหม่ได้ทันที
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {selectedDayDeadlines.map((dl) => (
                    <div
                      key={dl.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-3 -mx-3 rounded-xl transition"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            dl.type === 'court'
                              ? 'bg-sky-50 text-sky-700 border border-sky-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}
                        >
                          {dl.type === 'court' ? (
                            <Gavel className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 leading-snug">
                            {dl.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-1">
                            <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                              {dl.caseTitle}
                            </span>
                            <span>•</span>
                            <span className="text-slate-600">กำหนด: {dl.dueDate}</span>
                            <span>•</span>
                            <span
                              className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                                dl.urgency === 'high'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-amber-50 text-amber-800'
                              }`}
                            >
                              {dl.urgency === 'high' ? 'ด่วนมาก' : 'ปกติ'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenCase(dl.caseId)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition self-end sm:self-auto cursor-pointer"
                      >
                        <span>ไปที่สำนวนคดี</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: DETAILED LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>รายการนัดหมายทั้งหมด ({filteredDeadlines.length} รายการ)</span>
          </h2>

          <div className="divide-y divide-slate-100">
            {filteredDeadlines.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">ไม่พบนัดหมายตามเงื่อนไขที่เลือก</p>
              </div>
            ) : (
              filteredDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  onClick={() => handleOpenCase(dl.caseId)}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-3 -mx-3 rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-700 flex-shrink-0">
                      <span className="text-[10px] font-bold uppercase">วันนัด</span>
                      <CalendarIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {dl.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {dl.caseTitle}
                        </span>
                        <span>•</span>
                        <span className="text-indigo-600 font-medium">{dl.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        dl.urgency === 'high'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {dl.urgency === 'high' ? 'ด่วนมาก' : 'กำลังจะถึง'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-md w-full shadow-lg border border-slate-200 p-6 text-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">เพิ่มนัดหมายใหม่</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  หัวข้อนัดหมาย / รายการที่ต้องทำ
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="เช่น นัดชี้สองสถานและไกล่เกลี่ย"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  เกี่ยวข้องกับคดี
                </label>
                <select
                  value={newCaseId}
                  onChange={(e) => setNewCaseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer font-medium"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.clientName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    วันที่ (ในเดือน {THAI_MONTHS[currentMonth]})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={totalDays}
                    value={newDay}
                    onChange={(e) => setNewDay(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ระดับความเร่งด่วน
                  </label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
                  >
                    <option value="high">ด่วนมาก</option>
                    <option value="medium">ปกติ / กำลังจะถึง</option>
                    <option value="low">ทั่วไป</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ประเภทนัดหมาย
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setNewType('court')}
                    className={`py-2 px-3 rounded-lg border font-semibold cursor-pointer ${
                      newType === 'court'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    นัดศาล
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('document')}
                    className={`py-2 px-3 rounded-lg border font-semibold cursor-pointer ${
                      newType === 'document'
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    ส่งเอกสาร
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-xs cursor-pointer"
                >
                  บันทึกนัดหมาย
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
