export type UserRole = 'lawyer' | 'client';

export type CaseStatus = 'กำลังดำเนินการ' | 'กำลังตรวจ' | 'ตรวจแล้ว' | 'รอศาลนัด' | 'เสร็จสิ้น' | 'ปิดคดีแล้ว' | 'ชนะคดี' | 'ยอมความ';

export type DocStatus = 'ยังไม่ได้ส่ง' | 'ส่งแล้ว' | 'กำลังตรวจ' | 'ตรวจแล้ว';

export type NodeType =
  | 'case'
  | 'event'
  | 'person'
  | 'document'
  | 'evidence'
  | 'law'
  | 'strategy'
  | 'damages'
  | 'note';

export interface LegalLawNode {
  id: string;
  code: string; // e.g. "ป.พ.พ. มาตรา 387"
  title: string; // e.g. "การบอกเลิกสัญญาเพราะผิดนัด"
  description?: string;
  elements: Array<{ id: string; text: string; satisfied: boolean }>;
  relatedEventIds?: string[];
  imageUrl?: string;
  x?: number;
  y?: number;
}

export interface StrategyNode {
  id: string;
  title: string; // e.g. "ข้อต่อสู้อายุความ 2 ปี"
  side: 'our_claim' | 'opponent_defense'; // ฝ่ายเรา หรือ ฝ่ายคู่กรณี
  riskLevel: 'high' | 'medium' | 'low';
  keyArgument: string;
  counterPlan?: string;
  imageUrl?: string;
  x?: number;
  y?: number;
}

export interface DamagesNode {
  id: string;
  title: string; // e.g. "คำนวณยอดเงินเรียกร้องฟ้องคดี"
  items: Array<{ id: string; label: string; amount: number }>;
  interestRate?: number; // e.g. 5 (5% ต่อปี)
  imageUrl?: string;
  x?: number;
  y?: number;
}

export interface LawyerNoteNode {
  id: string;
  title: string;
  content: string;
  color?: 'amber' | 'purple' | 'blue' | 'rose' | 'emerald';
  imageUrl?: string;
  x?: number;
  y?: number;
}

export interface Person {
  id: string;
  name: string;
  role: string; // e.g. ลูกความ / โจทก์, บริษัทคู่สัญญา / จำเลย, พยาน
  phone?: string;
  relatedEventIds: string[];
  imageUrl?: string;
  x?: number;
  y?: number;
}

export interface CaseDocument {
  id: string;
  title: string;
  type: string; // บัตรประชาชน, สัญญา, หลักฐานการโอนเงิน, รูปภาพ, แชท, อื่นๆ
  status: DocStatus;
  date: string;
  fileSize?: string;
  fileName?: string;
  fileDataUrl?: string;
  uploadedBy: 'ทนาย' | 'ลูกความ';
  url?: string;
  notes?: string;
  relatedEventIds: string[];
  imageUrl?: string;
  x?: number;
  y?: number;
}

export interface CaseEvent {
  id: string;
  title: string;
  date: string; // e.g. "12 มกราคม 2025"
  rawDate?: string;
  description: string;
  relatedPersonNames: string[];
  relatedDocNames: string[];
  type?: 'contract' | 'breach' | 'notice' | 'negotiation' | 'lawsuit' | 'other';
  imageUrl?: string;
  x?: number;
  y?: number;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: 'client' | 'lawyer'; // ลูกความต้องส่ง หรือ ทนายต้องตรวจ
  status: DocStatus;
  dueText?: string;
  notes?: string;
  completedAt?: string;
}

export interface DeadlineItem {
  id: string;
  caseId: string;
  caseTitle: string;
  title: string;
  dueDate: string; // e.g. "30 ก.ย. 2026"
  urgency: 'high' | 'medium' | 'low';
  type: 'court' | 'document' | 'client';
}

export interface CaseMessage {
  id: string;
  sender: string;
  role: UserRole;
  text: string;
  time: string;
}

export type CaseTabType = 'overview' | 'mindmap' | 'timeline' | 'documents' | 'checklist' | 'chat';

export type LawyerNavType = 'dashboard' | 'cases' | 'calendar' | 'documents' | 'clients' | 'chat' | 'roadmap' | 'line_bot';

export interface CourtVerdict {
  verdictDate?: string; // วันที่ศาลมีคำสั่ง / อ่านคำพิพากษา
  verdictResult: string; // เช่น ชนะคดีตามฟ้อง, ยอมความตามสัญญาประนีประนอม, ยกฟ้อง
  courtName?: string; // เช่น ศาลแพ่งกรุงเทพใต้
  redCaseNumber?: string; // เช่น คดีหมายเลขแดงที่ พ. 1234/2569
  details: string; // สรุปคำพิพากษาและข้อบังคับตามคำสั่งศาล
  compensationAmount?: string; // เช่น 500,000 บาท พร้อมดอกเบี้ย 5% ต่อปี
  executionDeadline?: string; // เช่น ภายใน 30 วันนับแต่วันอ่านคำพิพากษา
}

export interface PostCaseLearning {
  summary: string; // สรุปภาพรวมลำดับเหตุการณ์หลังจบคดี
  keyLearnings: string[]; // ประเด็นเรียนรู้สำคัญ
  tacticalAnalysis: string; // วิเคราะห์ยุทธวิธีและจุดเปลี่ยนของคดี
  precedentTakeaways: string; // บรรทัดฐานและข้อสังเกตสำหรับคดีในอนาคต
  futurePrecautions: string[]; // ข้อพึงระวัง
  generatedAt: string;
}

export interface FutureUpdateItem {
  id: string;
  title: string;
  details?: string;
  targetDate?: string;
  category?: 'court' | 'client' | 'execution' | 'document' | 'general' | 'speech';
  isCompleted: boolean;
  createdAt: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'sky' | 'purple' | 'rose';
  bullets?: string[];
}

export interface CaseItem {
  id: string;
  title: string; // e.g. "นายสมชาย vs บริษัท ABC"
  type: string; // e.g. "คดีแพ่ง"
  status: CaseStatus;
  deadline: string; // e.g. "30 กันยายน 2026"
  clientName: string;
  description: string;
  events: CaseEvent[];
  documents: CaseDocument[];
  people: Person[];
  checklist: ChecklistItem[];
  deadlines: DeadlineItem[];
  messages: CaseMessage[];
  nextActions: string[];
  customLinks?: Array<{ id: string; fromId: string; toId: string; label?: string; color?: string }>;
  hiddenDefaultLinks?: string[]; // IDs of default links hidden/deleted by user
  legalLaws?: LegalLawNode[];
  strategies?: StrategyNode[];
  damages?: DamagesNode[];
  lawyerNotes?: LawyerNoteNode[];
  imageUrl?: string;
  x?: number;
  y?: number;
  deletedAt?: string; // If deleted and in trash
  courtVerdict?: CourtVerdict; // ข้อสรุปจากคำสั่งศาล
  postCaseLearning?: PostCaseLearning; // สรุปเหตุการณ์หลังจบคดี & บทเรียนสำหรับเรียนรู้
  futureUpdates?: FutureUpdateItem[]; // รายการที่จะ Update ในอนาคต
  closedAt?: string; // วันที่ปิดคดี
  closureReason?: string; // เหตุผลหรือข้อสรุปการปิดคดี
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  hasCompletedOnboarding: boolean;
  passwordHash?: string;
  createdAt?: string;
}

