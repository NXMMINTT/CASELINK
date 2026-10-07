// Timezone-safe Thai date utilities without external dependencies

export const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

const MONTH_MAP: Record<string, number> = {
  'ม.ค.': 0, 'ม.ค': 0, 'มกราคม': 0,
  'ก.พ.': 1, 'ก.พ': 1, 'กุมภาพันธ์': 1,
  'มี.ค.': 2, 'มี.ค': 2, 'มีนาคม': 2,
  'เม.ย.': 3, 'เม.ย': 3, 'เมษายน': 3,
  'พ.ค.': 4, 'พ.ค': 4, 'พฤษภาคม': 4,
  'มิ.ย.': 5, 'มิ.ย': 5, 'มิถุนายน': 5,
  'ก.ค.': 6, 'ก.ค': 6, 'กรกฎาคม': 6,
  'ส.ค.': 7, 'ส.ค': 7, 'สิงหาคม': 7,
  'ก.ย.': 8, 'ก.ย': 8, 'กันยายน': 8,
  'ต.ค.': 9, 'ต.ค': 9, 'ตุลาคม': 9,
  'พ.ย.': 10, 'พ.ย': 10, 'พฤศจิกายน': 10,
  'ธ.ค.': 11, 'ธ.ค': 11, 'ธันวาคม': 11,
};

export interface ParsedDate {
  year: number; // A.D.
  month: number; // 0-indexed (0 = Jan)
  day: number;
}

export function parseThaiDateString(dateStr: string): ParsedDate | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();

  // Pattern: "YYYY-MM-DD"
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number);
    return { year: y, month: m - 1, day: d };
  }

  // Tokenize
  const tokens = trimmed.split(/\s+/);
  if (tokens.length >= 3) {
    const day = parseInt(tokens[0], 10);
    const monthToken = tokens[1];
    let year = parseInt(tokens[2], 10);

    const monthIndex = MONTH_MAP[monthToken] ?? -1;

    // Convert Buddhist Era to A.D.
    if (year > 2500) {
      year = year - 543;
    }

    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return { year, month: monthIndex, day };
    }
  }

  return null;
}

/**
 * Calculates day difference from today to target date (positive = in future, 0 = today, negative = past)
 */
export function getDaysDifferenceFromToday(parsed: ParsedDate): number {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetMidnight = new Date(parsed.year, parsed.month, parsed.day).getTime();
  const diffTime = targetMidnight - todayMidnight;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format relative countdown string like "วันนี้", "พรุ่งนี้", "อีก 3 วัน", "ย้อนหลัง 2 วัน"
 */
export function formatRelativeDaysBadge(parsed: ParsedDate): { label: string; urgencyClass: string } {
  const diff = getDaysDifferenceFromToday(parsed);
  if (diff === 0) {
    return { label: 'วันนี้', urgencyClass: 'bg-red-100 text-red-800 border-red-200' };
  } else if (diff === 1) {
    return { label: 'พรุ่งนี้', urgencyClass: 'bg-amber-100 text-amber-800 border-amber-200' };
  } else if (diff > 1) {
    return {
      label: `อีก ${diff} วัน`,
      urgencyClass: diff <= 3 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
  } else {
    return {
      label: `ครบกำหนดแล้ว`,
      urgencyClass: 'bg-slate-100 text-slate-600 border-slate-200',
    };
  }
}
