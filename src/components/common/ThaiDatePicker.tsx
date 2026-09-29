import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react';

interface ThaiDatePickerProps {
  value: string; // ISO date string "YYYY-MM-DD"
  onChange: (isoDate: string, thaiFormatted: string) => void;
  label?: string;
  required?: boolean;
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_DAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

export const formatToThaiFullDate = (isoStr: string) => {
  if (!isoStr) return '';
  const parts = isoStr.split('-');
  if (parts.length !== 3) return isoStr;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return isoStr;
  return `${d} ${THAI_MONTHS[m - 1]} ${y + 543}`;
};

export const ThaiDatePicker: React.FC<ThaiDatePickerProps> = ({
  value,
  onChange,
  label = 'กำหนดวันสำคัญ',
  required = false,
}) => {
  const today = new Date();
  const initialDate = value ? new Date(value) : today;
  const validInitialDate = isNaN(initialDate.getTime()) ? today : initialDate;

  const [currentYear, setCurrentYear] = useState<number>(validInitialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(validInitialDate.getMonth()); // 0-indexed

  // Calculate calendar grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  // Previous month trailing days
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const iso = `${currentYear}-${mStr}-${dStr}`;
    onChange(iso, formatToThaiFullDate(iso));
  };

  const handlePresetDays = (daysFromToday: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromToday);
    const y = target.getFullYear();
    const m = target.getMonth();
    const d = target.getDate();
    setCurrentYear(y);
    setCurrentMonth(m);
    const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    onChange(iso, formatToThaiFullDate(iso));
  };

  // Check if a day is today
  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  // Check if a day is selected
  const isSelected = (day: number) => {
    if (!value) return false;
    const parts = value.split('-');
    if (parts.length !== 3) return false;
    return (
      Number(parts[0]) === currentYear &&
      Number(parts[1]) === currentMonth + 1 &&
      Number(parts[2]) === day
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
          <CalendarIcon className="w-4 h-4 text-indigo-600" />
          <span>{label} {required && '*'}</span>
        </label>
        {value ? (
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200 flex items-center space-x-1 animate-in fade-in">
            <Check className="w-3 h-3 text-indigo-600" />
            <span>{formatToThaiFullDate(value)}</span>
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">คลิกเลือกวันในปฏิทิน</span>
        )}
      </div>

      {/* Visual Calendar Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden select-none">
        {/* Month & Year Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border-b border-slate-200">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition cursor-pointer"
            title="เดือนก่อนหน้า"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {THAI_MONTHS[currentMonth]} {currentYear + 543}
            </span>
            <span className="text-[10px] text-slate-400 font-mono ml-1.5">
              ({currentYear})
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition cursor-pointer"
            title="เดือนถัดไป"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 py-1.5 px-2 text-center text-[10px] font-bold text-slate-400">
          {THAI_DAYS.map((d, idx) => (
            <div key={d} className={idx === 0 ? 'text-rose-500' : ''}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-1 p-2 text-center text-xs">
          {/* Previous month filler */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => {
            const dayNum = prevMonthDays - firstDayOfWeek + i + 1;
            return (
              <div
                key={`prev-${i}`}
                className="h-8 flex items-center justify-center text-slate-300 text-[11px] cursor-not-allowed"
              >
                {dayNum}
              </div>
            );
          })}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const sel = isSelected(day);
            const tod = isToday(day);
            const dayOfWeek = (firstDayOfWeek + i) % 7;
            const isSunday = dayOfWeek === 0;

            return (
              <button
                key={`day-${day}`}
                type="button"
                onClick={() => handleSelectDay(day)}
                className={`h-8 rounded-xl font-medium transition cursor-pointer flex items-center justify-center relative ${
                  sel
                    ? 'bg-indigo-600 text-white font-bold shadow-xs scale-105 z-10'
                    : tod
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-300 hover:bg-indigo-100'
                    : isSunday
                    ? 'text-rose-600 hover:bg-slate-100 font-medium'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{day}</span>
                {tod && !sel && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick presets buttons */}
        <div className="flex items-center space-x-1.5 px-3 py-2 bg-slate-50/80 border-t border-slate-100 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-medium text-[10px] flex-shrink-0">ปุ่มลัด:</span>
          {[
            { label: 'วันนี้', days: 0 },
            { label: '+7 วัน (นัดด่วน)', days: 7 },
            { label: '+15 วัน (ยื่นคำให้การ)', days: 15 },
            { label: '+30 วัน (นัดพร้อม)', days: 30 },
            { label: '+60 วัน (สืบพยาน)', days: 60 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePresetDays(preset.days)}
              className="flex-shrink-0 px-2 py-0.5 rounded-md bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-600 border border-slate-200 transition cursor-pointer font-medium shadow-2xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
