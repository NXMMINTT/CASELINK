import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  CaseItem,
  UserProfile,
  UserRole,
  CaseEvent,
  CaseDocument,
  ChecklistItem,
  DocStatus,
  DeadlineItem,
  Person,
  LegalLawNode,
  StrategyNode,
  DamagesNode,
  LawyerNoteNode,
  CaseTabType,
  LawyerNavType,
  CourtVerdict,
  PostCaseLearning,
  FutureUpdateItem,
} from '../types.ts';
import { api, ApiError, CORE_CASE_FIELDS, SERVER_ONLY_CASE_FIELDS, toCaseMessage } from '../lib/api.ts';

type AuthResult = { success: boolean; error?: string };
export type SyncStatus = 'idle' | 'saving' | 'error';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  cases: CaseItem[];
  deletedCases: CaseItem[];
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  currentCase: CaseItem | undefined;

  // Navigation states
  activeLawyerNav: LawyerNavType;
  setActiveLawyerNav: (nav: LawyerNavType) => void;
  isViewingCaseDetail: boolean;
  setIsViewingCaseDetail: (val: boolean) => void;
  activeCaseTab: CaseTabType;
  setActiveCaseTab: (tab: CaseTabType) => void;
  activeClientTab: 'overview' | 'documents' | 'todos' | 'messages';
  setActiveClientTab: (tab: 'overview' | 'documents' | 'todos' | 'messages') => void;

  // Modals & Overlays
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  showHelpModal: boolean;
  setShowHelpModal: (show: boolean) => void;

  // Case Recovery & Trash
  lastDeletedToast: { case: CaseItem; timestamp: number } | null;
  setLastDeletedToast: (toast: { case: CaseItem; timestamp: number } | null) => void;
  restoreCase: (caseId: string) => void;
  permanentlyDeleteCase: (caseId: string) => void;
  clearAllTrash: () => void;

  // Actions
  createCase: (newCase: Partial<CaseItem>) => Promise<string>;
  deleteCase: (caseId: string) => void;
  closeCase: (caseId: string, verdict: CourtVerdict, reason?: string) => void;
  reopenCase: (caseId: string) => void;
  updateCourtVerdict: (caseId: string, verdict: CourtVerdict) => void;
  generatePostCaseAnalysis: (caseId: string, customAnalysis?: PostCaseLearning) => void;
  addFutureUpdate: (caseId: string, item: Omit<FutureUpdateItem, 'id' | 'createdAt' | 'isCompleted'>) => void;
  updateFutureUpdate: (caseId: string, item: FutureUpdateItem) => void;
  toggleFutureUpdate: (caseId: string, updateId: string) => void;
  deleteFutureUpdate: (caseId: string, updateId: string) => void;
  addEvent: (caseId: string, event: Omit<CaseEvent, 'id'>) => void;
  updateEvent: (caseId: string, event: CaseEvent) => void;
  deleteEvent: (caseId: string, eventId: string) => void;
  addDocument: (caseId: string, doc: Omit<CaseDocument, 'id'>) => void;
  updateDocument: (caseId: string, doc: CaseDocument) => void;
  deleteDocument: (caseId: string, docId: string) => void;
  updateDocStatus: (caseId: string, docId: string, status: CaseDocument['status']) => void;
  addChecklistItem: (caseId: string, item: Omit<ChecklistItem, 'id'>) => void;
  toggleChecklistStatus: (caseId: string, itemId: string) => void;
  updateChecklistStatus: (caseId: string, itemId: string, status: DocStatus) => void;
  addDeadline: (caseId: string, deadline: Omit<DeadlineItem, 'id' | 'caseId' | 'caseTitle'>) => void;
  deleteDeadline: (caseId: string, deadlineId: string) => void;
  addPerson: (caseId: string, person: Omit<Person, 'id'>) => void;
  deletePerson: (caseId: string, personId: string) => void;
  updateNodePosition: (
    caseId: string,
    nodeType: 'case' | 'event' | 'person' | 'document' | 'law' | 'strategy' | 'damages' | 'note',
    id: string,
    x: number,
    y: number
  ) => void;
  addLegalLaw: (caseId: string, law: Omit<LegalLawNode, 'id'>) => void;
  deleteLegalLaw: (caseId: string, lawId: string) => void;
  toggleLawElement: (caseId: string, lawId: string, elemId: string) => void;
  addStrategy: (caseId: string, strat: Omit<StrategyNode, 'id'>) => void;
  deleteStrategy: (caseId: string, stratId: string) => void;
  addDamagesNode: (caseId: string, dmg: Omit<DamagesNode, 'id'>) => void;
  deleteDamagesNode: (caseId: string, dmgId: string) => void;
  addDamageItem: (caseId: string, dmgId: string, item: { label: string; amount: number }) => void;
  deleteDamageItem: (caseId: string, dmgId: string, itemId: string) => void;
  addLawyerNote: (caseId: string, note: Omit<LawyerNoteNode, 'id'>) => void;
  deleteLawyerNote: (caseId: string, noteId: string) => void;
  updateLawyerNote: (caseId: string, note: LawyerNoteNode) => void;
  updateNodeImage: (
    caseId: string,
    nodeType: 'case' | 'event' | 'person' | 'document' | 'law' | 'strategy' | 'damages' | 'note',
    id: string,
    imageUrl?: string
  ) => void;
  addCustomLink: (caseId: string, fromId: string, toId: string, label?: string, color?: string) => void;
  removeCustomLink: (caseId: string, linkId: string) => void;
  hideDefaultLink: (caseId: string, linkId: string) => void;
  restoreAllDefaultLinks: (caseId: string) => void;
  sendMessage: (caseId: string, text: string) => Promise<void>;
  autoOrganizeMindMap: (caseId: string) => void;
  lineStyle: 'orthogonal' | 'bezier';
  setLineStyle: (style: 'orthogonal' | 'bezier') => void;
  isLeftChatOpen: boolean;
  setIsLeftChatOpen: (open: boolean) => void;
  unreadChatCount: number;
  setUnreadChatCount: React.Dispatch<React.SetStateAction<number>>;
  chatNotification: { text: string; sender: string; timestamp: number } | null;
  setChatNotification: (toast: { text: string; sender: string; timestamp: number } | null) => void;
  showPrivacyModal: boolean;
  setShowPrivacyModal: (show: boolean) => void;
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  isFirstTimeUser: boolean;
  syncStatus: SyncStatus;
  syncError: string | null;
  logoutUser: () => void;
  registerUser: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    lawyerLicenseId?: string
  ) => Promise<AuthResult>;
  loginUser: (email: string, password: string) => Promise<AuthResult>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_VISITED = 'caselink_visited_flag_v2';
const CASE_POLL_MS = 15000;
const MESSAGE_POLL_MS = 4000;
const SYNC_DEBOUNCE_MS = 700;
// Clients may only change these parts of a case (mirrors the server rule).
const CLIENT_WRITABLE_KEYS = new Set(['documents', 'checklist']);

const SIGNED_OUT_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  role: 'lawyer',
  hasCompletedOnboarding: true,
};

let idCounter = 0;
export const generateUniqueId = (prefix: string = 'id'): string => {
  idCounter += 1;
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${Date.now()}-${idCounter}-${rand}`;
};

type CaseSnapshot = Record<string, string>;

// JSON of each syncable top-level field, used to work out what changed since the last save.
function snapshotOf(c: CaseItem): CaseSnapshot {
  const snapshot: CaseSnapshot = {};
  for (const [key, value] of Object.entries(c)) {
    if (SERVER_ONLY_CASE_FIELDS.has(key) || value === undefined) continue;
    snapshot[key] = JSON.stringify(value);
  }
  return snapshot;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function rememberVisited() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_VISITED, 'true');
  } catch {
    // Storage can be unavailable (private mode); the flag only picks the default auth tab.
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(SIGNED_OUT_USER);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [deletedCases, setDeletedCases] = useState<CaseItem[]>([]);

  const [lastDeletedToast, setLastDeletedToast] = useState<{ case: CaseItem; timestamp: number } | null>(null);

  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [activeLawyerNav, setActiveLawyerNav] = useState<LawyerNavType>('dashboard');
  const [isViewingCaseDetail, setIsViewingCaseDetail] = useState<boolean>(true);
  const [activeCaseTab, setActiveCaseTab] = useState<CaseTabType>('overview');
  const [activeClientTab, setActiveClientTab] = useState<'overview' | 'documents' | 'todos' | 'messages'>('overview');

  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [isFirstTimeUser] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY_VISITED) !== 'true';
    } catch {
      return true;
    }
  });
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);

  // Quick Chat Drawer & Notification states
  const [isLeftChatOpen, setIsLeftChatOpen] = useState<boolean>(false);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [chatNotification, setChatNotification] = useState<{ text: string; sender: string; timestamp: number } | null>(null);
  const [lineStyle, setLineStyle] = useState<'orthogonal' | 'bezier'>('orthogonal');

  // ---- Server sync -------------------------------------------------------
  const casesRef = useRef<CaseItem[]>(cases);
  casesRef.current = cases;
  const currentUserRef = useRef<UserProfile>(currentUser);
  currentUserRef.current = currentUser;
  // Last state of each case known to be saved on the server.
  const syncedRef = useRef<Map<string, CaseSnapshot>>(new Map());
  const flushingRef = useRef(false);
  const flushAgainRef = useRef(false);
  const lastMessageTimeRef = useRef<string | undefined>(undefined);

  const remember = (c: CaseItem) => {
    syncedRef.current.set(c.id, snapshotOf(c));
  };

  // Builds a PATCH body with only the fields changed since the last save, or null if nothing changed.
  const buildPatch = (c: CaseItem): Record<string, unknown> | null => {
    const saved = syncedRef.current.get(c.id);
    if (!saved) return null;
    const now = snapshotOf(c);
    const canEditAll = c.isOwner !== false;
    const patch: Record<string, unknown> = {};
    const data: Record<string, unknown> = {};

    for (const key of new Set([...Object.keys(saved), ...Object.keys(now)])) {
      if (saved[key] === now[key]) continue;
      if (!canEditAll && !CLIENT_WRITABLE_KEYS.has(key)) continue;
      const value = (c as unknown as Record<string, unknown>)[key];
      if ((CORE_CASE_FIELDS as readonly string[]).includes(key)) {
        if (value !== undefined) patch[key] = value;
      } else {
        data[key] = value === undefined ? null : value;
      }
    }
    if (Object.keys(data).length > 0) patch.data = data;
    return Object.keys(patch).length > 0 ? patch : null;
  };

  const flushChanges = useCallback(async () => {
    if (flushingRef.current) {
      flushAgainRef.current = true;
      return;
    }
    flushingRef.current = true;
    try {
      do {
        flushAgainRef.current = false;
        for (const c of casesRef.current) {
          const patch = buildPatch(c);
          if (!patch) continue;
          const sent = snapshotOf(c);
          setSyncStatus('saving');
          try {
            await api.updateCase(c.id, patch);
            syncedRef.current.set(c.id, sent);
            setSyncError(null);
          } catch (error) {
            setSyncStatus('error');
            setSyncError(errorMessage(error, 'บันทึกข้อมูลไม่สำเร็จ'));
            if (error instanceof ApiError && error.status === 401) {
              setIsAuthenticated(false);
            }
            return;
          }
        }
      } while (flushAgainRef.current);
      setSyncStatus('idle');
    } finally {
      flushingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => {
      void flushChanges();
    }, SYNC_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [cases, isAuthenticated, flushChanges]);

  // Pull changes made by the other party (e.g. client uploads) without clobbering unsaved local edits.
  const refreshCases = useCallback(async () => {
    try {
      const serverCases = await api.listCases();
      setCases((prev) => {
        const localById = new Map(prev.map((c) => [c.id, c]));
        return serverCases.map((serverCase) => {
          const local = localById.get(serverCase.id);
          if (local && buildPatch(local)) return local;
          remember(serverCase);
          if (local && local.updatedAt === serverCase.updatedAt) {
            return { ...local, messages: serverCase.messages };
          }
          return serverCase;
        });
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) setIsAuthenticated(false);
    }
  }, []);

  const playNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12); // E6
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.19);
    } catch {
      // Audio autoplay policy catch
    }
  };

  const pollMessages = useCallback(async () => {
    try {
      const { messages, serverTime } = await api.messagesSince(lastMessageTimeRef.current);
      lastMessageTimeRef.current = serverTime;
      if (messages.length === 0) return;

      setCases((prev) =>
        prev.map((c) => {
          const incoming = messages.filter((m) => m.caseId === c.id);
          if (incoming.length === 0) return c;
          const known = new Set((c.messages || []).map((m) => m.id));
          const fresh = incoming.filter((m) => !known.has(m.id)).map(toCaseMessage);
          return fresh.length > 0 ? { ...c, messages: [...(c.messages || []), ...fresh] } : c;
        })
      );

      const me = currentUserRef.current;
      const fromOthers = messages.filter((m) => m.role !== me.role);
      if (me.role === 'lawyer' && fromOthers.length > 0) {
        const latest = fromOthers[fromOthers.length - 1];
        setUnreadChatCount((prev) => prev + fromOthers.length);
        setChatNotification({ text: latest.text, sender: latest.sender, timestamp: Date.now() });
        playNotificationSound();
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const caseTimer = setInterval(() => void refreshCases(), CASE_POLL_MS);
    const messageTimer = setInterval(() => void pollMessages(), MESSAGE_POLL_MS);
    return () => {
      clearInterval(caseTimer);
      clearInterval(messageTimer);
    };
  }, [isAuthenticated, refreshCases, pollMessages]);

  const startSession = async (user: UserProfile) => {
    const [serverCases, trash, messageCursor] = await Promise.all([
      api.listCases(),
      user.role === 'lawyer' ? api.listTrash() : Promise.resolve([] as CaseItem[]),
      api.messagesSince(new Date().toISOString()),
    ]);
    syncedRef.current = new Map();
    serverCases.forEach(remember);
    lastMessageTimeRef.current = messageCursor.serverTime;
    setCurrentUser(user);
    setCases(serverCases);
    setDeletedCases(trash);
    setSelectedCaseId(serverCases[0]?.id || '');
    setIsViewingCaseDetail(false);
    setActiveLawyerNav('dashboard');
    setActiveClientTab('overview');
    setSyncStatus('idle');
    setSyncError(null);
    setIsAuthenticated(true);
    rememberVisited();
  };

  // Restore an existing session from the HttpOnly cookie.
  useEffect(() => {
    let cancelled = false;
    api
      .me()
      .then((user) => (cancelled ? undefined : startSession(user)))
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setIsCheckingSession(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const createCase = async (newCaseData: Partial<CaseItem>): Promise<string> => {
    const clientName = newCaseData.clientName || 'ลูกความ';
    const data: Record<string, unknown> = {
      events: newCaseData.events || [],
      documents: newCaseData.documents || [],
      people: newCaseData.people || [
        { id: generateUniqueId('p'), name: clientName, role: 'ลูกความ / โจทก์', relatedEventIds: [] },
      ],
      checklist: newCaseData.checklist || [
        { id: generateUniqueId('chk'), title: 'บัตรประชาชน', category: 'client', status: 'ยังไม่ได้ส่ง' },
        { id: generateUniqueId('chk'), title: 'สัญญาว่าจ้าง/เอกสารที่เกี่ยวข้อง', category: 'client', status: 'ยังไม่ได้ส่ง' },
        { id: generateUniqueId('chk'), title: 'ตรวจข้อเท็จจริงเบื้องต้น', category: 'lawyer', status: 'กำลังตรวจ' },
      ],
      deadlines: newCaseData.deadlines || [],
      nextActions: ['ติดต่อลูกความเพื่อขอเอกสารเริ่มต้น', 'สรุปข้อเท็จจริงลง Timeline'],
    };

    const created = await api.createCase({
      title: newCaseData.title || 'คดีใหม่',
      type: newCaseData.type || 'คดีแพ่ง',
      status: 'กำลังดำเนินการ',
      deadline: newCaseData.deadline || 'ไม่ระบุวัน',
      clientName,
      clientEmail: newCaseData.clientEmail || '',
      description: newCaseData.description || 'รายละเอียดคดี',
      data,
    });
    remember(created);
    setCases((prev) => [created, ...prev]);
    setSelectedCaseId(created.id);
    return created.id;
  };

  const deleteCase = (caseId: string) => {
    const targetCase = cases.find((c) => c.id === caseId);
    if (!targetCase) return;

    api
      .deleteCase(caseId)
      .then(() => {
        setDeletedCases((prev) => [{ ...targetCase, deletedAt: new Date().toISOString() }, ...prev.filter((c) => c.id !== caseId)]);
        setCases((prev) => prev.filter((c) => c.id !== caseId));
        syncedRef.current.delete(caseId);
        setLastDeletedToast({ case: targetCase, timestamp: Date.now() });
        if (selectedCaseId === caseId) {
          const remaining = casesRef.current.filter((c) => c.id !== caseId);
          setSelectedCaseId(remaining[0]?.id || '');
        }
      })
      .catch((error) => setSyncError(errorMessage(error, 'ย้ายคดีไปถังขยะไม่สำเร็จ')));
  };

  const restoreCase = (caseId: string) => {
    api
      .restoreCase(caseId)
      .then((restored) => {
        remember(restored);
        setDeletedCases((prev) => prev.filter((c) => c.id !== caseId));
        setCases((prev) => [restored, ...prev.filter((c) => c.id !== caseId)]);
        setSelectedCaseId(caseId);
        setLastDeletedToast(null);
      })
      .catch((error) => setSyncError(errorMessage(error, 'กู้คืนคดีไม่สำเร็จ')));
  };

  const permanentlyDeleteCase = (caseId: string) => {
    api
      .deleteCasePermanently(caseId)
      .then(() => setDeletedCases((prev) => prev.filter((c) => c.id !== caseId)))
      .catch((error) => setSyncError(errorMessage(error, 'ลบคดีถาวรไม่สำเร็จ')));
  };

  const clearAllTrash = () => {
    deletedCases.forEach((c) => permanentlyDeleteCase(c.id));
  };

  const closeCase = (caseId: string, verdict: CourtVerdict, reason?: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status: 'ปิดคดีแล้ว',
            courtVerdict: verdict,
            closedAt: new Date().toISOString(),
            closureReason: reason || verdict.verdictResult,
          };
        }
        return c;
      })
    );
  };

  const reopenCase = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status: 'กำลังดำเนินการ',
            closedAt: undefined,
          };
        }
        return c;
      })
    );
  };

  const updateCourtVerdict = (caseId: string, verdict: CourtVerdict) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            courtVerdict: verdict,
          };
        }
        return c;
      })
    );
  };

  const generatePostCaseAnalysis = (caseId: string, customAnalysis?: PostCaseLearning) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const generatedAnalysis: PostCaseLearning = customAnalysis || {
            summary: `วิเคราะห์สังเคราะห์ผลการดำเนินคดีสำหรับ "${c.title}" สรุปข้อเท็จจริงและหลักฐานตามแนวคำพิพากษาของศาล`,
            keyLearnings: [
              'ความครบถ้วนของพยานเอกสารและไทม์ไลน์ที่จัดหมวดหมู่ชัดเจน ช่วยให้ข้อต่อสู้มีน้ำหนักน่าเชื่อถือ',
              'การตรวจทานข้อสัญญาและการแจ้งเตือนบอกเลิกสัญญาล่วงหน้าเป็นปัจจัยชี้ขาดในคดี',
              'การประสานงานข้อมูลระหว่างทนายความและลูกความอย่างใกล้ชิดช่วยอุดช่องโหว่ทางคดีได้ทันท่วงที'
            ],
            tacticalAnalysis: 'ยุทธวิธีทางคดีมุ่งเน้นการจัดลำดับพยานหลักฐานตาม Timeline และจับประเด็นข้อต่อสู้หลัก ทำให้ศาลเห็นภาพชัดเจนตั้งแต่ชั้นไต่สวน',
            precedentTakeaways: 'ยึดถือเป็นแนวทางปฏิบัติสำหรับการจัดทำคำฟ้องและเอกสารแนบท้ายในคดีประเภทเดียวกัน',
            futurePrecautions: [
              'ควรเก็บบันทึกหลักฐานดิจิทัลและหนังสือบอกกล่าวเป็นลายลักษณ์อักษรเสมอ',
              'ควรติดตามการบังคับคดีตามกรอบระยะเวลาที่ศาลกำหนด'
            ],
            generatedAt: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }),
          };
          return {
            ...c,
            postCaseLearning: generatedAnalysis,
          };
        }
        return c;
      })
    );
  };

  const addFutureUpdate = (caseId: string, item: Omit<FutureUpdateItem, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newItem: FutureUpdateItem = {
      ...item,
      id: `fut-${Date.now()}`,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            futureUpdates: [...(c.futureUpdates || []), newItem],
          };
        }
        return c;
      })
    );
  };

  const updateFutureUpdate = (caseId: string, item: FutureUpdateItem) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId && c.futureUpdates) {
          return {
            ...c,
            futureUpdates: c.futureUpdates.map((u) => (u.id === item.id ? item : u)),
          };
        }
        return c;
      })
    );
  };

  const toggleFutureUpdate = (caseId: string, updateId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId && c.futureUpdates) {
          return {
            ...c,
            futureUpdates: c.futureUpdates.map((u) =>
              u.id === updateId ? { ...u, isCompleted: !u.isCompleted } : u
            ),
          };
        }
        return c;
      })
    );
  };

  const deleteFutureUpdate = (caseId: string, updateId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId && c.futureUpdates) {
          return {
            ...c,
            futureUpdates: c.futureUpdates.filter((u) => u.id !== updateId),
          };
        }
        return c;
      })
    );
  };

  const addEvent = (caseId: string, eventData: Omit<CaseEvent, 'id'>) => {
    const newEvent: CaseEvent = {
      ...eventData,
      id: generateUniqueId('ev'),
    };
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            events: [...c.events, newEvent],
          };
        }
        return c;
      })
    );
  };

  const updateEvent = (caseId: string, updatedEvent: CaseEvent) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            events: c.events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
          };
        }
        return c;
      })
    );
  };

  const deleteEvent = (caseId: string, eventId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            events: c.events.filter((e) => e.id !== eventId),
          };
        }
        return c;
      })
    );
  };

  const addDocument = (caseId: string, docData: Omit<CaseDocument, 'id'>) => {
    const newDoc: CaseDocument = {
      ...docData,
      id: generateUniqueId('doc'),
    };
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const updatedChecklist = c.checklist.map((item) => {
            if (
              item.status === 'ยังไม่ได้ส่ง' &&
              (item.title.trim().toLowerCase() === docData.title.trim().toLowerCase() ||
                item.title.includes(docData.type) ||
                docData.title.includes(item.title))
            ) {
              return { ...item, status: docData.status, dueText: 'ส่งแล้ว (รอตรวจ)' };
            }
            return item;
          });
          return {
            ...c,
            checklist: updatedChecklist,
            documents: [newDoc, ...c.documents],
          };
        }
        return c;
      })
    );
  };

  const updateDocStatus = (caseId: string, docId: string, status: CaseDocument['status']) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const targetDoc = c.documents.find((d) => d.id === docId);
          const updatedDocs = c.documents.map((d) => (d.id === docId ? { ...d, status } : d));
          // Synchronize matching checklist item if it exists with same or similar title
          const updatedChecklist = targetDoc
            ? c.checklist.map((item) => {
                if (
                  item.title.trim().toLowerCase() === targetDoc.title.trim().toLowerCase() ||
                  item.title.includes(targetDoc.title) ||
                  targetDoc.title.includes(item.title)
                ) {
                  return { ...item, status };
                }
                return item;
              })
            : c.checklist;
          return {
            ...c,
            documents: updatedDocs,
            checklist: updatedChecklist,
          };
        }
        return c;
      })
    );
  };

  const addChecklistItem = (caseId: string, itemData: Omit<ChecklistItem, 'id'>) => {
    const newItem: ChecklistItem = {
      ...itemData,
      id: generateUniqueId('chk'),
    };
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            checklist: [...c.checklist, newItem],
          };
        }
        return c;
      })
    );
  };

  const updateChecklistStatus = (caseId: string, itemId: string, status: DocStatus) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const targetItem = c.checklist.find((item) => item.id === itemId);
          const updatedChecklist = c.checklist.map((item) =>
            item.id === itemId ? { ...item, status } : item
          );
          // Synchronize matching document if it exists
          const updatedDocs = targetItem
            ? c.documents.map((doc) => {
                if (
                  doc.title.trim().toLowerCase() === targetItem.title.trim().toLowerCase() ||
                  doc.title.includes(targetItem.title) ||
                  targetItem.title.includes(doc.title)
                ) {
                  return { ...doc, status };
                }
                return doc;
              })
            : c.documents;
          return {
            ...c,
            checklist: updatedChecklist,
            documents: updatedDocs,
          };
        }
        return c;
      })
    );
  };

  const toggleChecklistStatus = (caseId: string, itemId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          let targetTitle = '';
          let nextStatus: DocStatus = 'ตรวจแล้ว';
          const updatedChecklist = c.checklist.map((item) => {
            if (item.id === itemId) {
              targetTitle = item.title;
              nextStatus = item.status === 'ตรวจแล้ว' ? 'ยังไม่ได้ส่ง' : 'ตรวจแล้ว';
              return { ...item, status: nextStatus };
            }
            return item;
          });
          const updatedDocs = targetTitle
            ? c.documents.map((doc) => {
                if (
                  doc.title.trim().toLowerCase() === targetTitle.trim().toLowerCase() ||
                  doc.title.includes(targetTitle) ||
                  targetTitle.includes(doc.title)
                ) {
                  return { ...doc, status: nextStatus };
                }
                return doc;
              })
            : c.documents;
          return {
            ...c,
            checklist: updatedChecklist,
            documents: updatedDocs,
          };
        }
        return c;
      })
    );
  };

  const addDeadline = (
    caseId: string,
    deadlineData: Omit<DeadlineItem, 'id' | 'caseId' | 'caseTitle'>
  ) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const newDeadline: DeadlineItem = {
            ...deadlineData,
            id: generateUniqueId('dl'),
            caseId: c.id,
            caseTitle: c.title,
          };
          return {
            ...c,
            deadlines: [...(c.deadlines || []), newDeadline],
          };
        }
        return c;
      })
    );
  };

  const deleteDeadline = (caseId: string, deadlineId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            deadlines: (c.deadlines || []).filter((d) => d.id !== deadlineId),
          };
        }
        return c;
      })
    );
  };

  const addPerson = (caseId: string, personData: Omit<Person, 'id'>) => {
    const newPerson: Person = {
      ...personData,
      id: generateUniqueId('p'),
    };
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            people: [...c.people, newPerson],
          };
        }
        return c;
      })
    );
  };

  const updateDocument = (caseId: string, updatedDoc: CaseDocument) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            documents: c.documents.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)),
          };
        }
        return c;
      })
    );
  };

  const deleteDocument = (caseId: string, docId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            documents: c.documents.filter((d) => d.id !== docId),
          };
        }
        return c;
      })
    );
  };

  const deletePerson = (caseId: string, personId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            people: c.people.filter((p) => p.id !== personId),
          };
        }
        return c;
      })
    );
  };

  const updateNodePosition = (
    caseId: string,
    nodeType: 'case' | 'event' | 'person' | 'document' | 'law' | 'strategy' | 'damages' | 'note',
    id: string,
    x: number,
    y: number
  ) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        if (nodeType === 'case') {
          return {
            ...c,
            x,
            y,
          };
        }
        if (nodeType === 'event') {
          return {
            ...c,
            events: c.events.map((e) => (e.id === id ? { ...e, x, y } : e)),
          };
        }
        if (nodeType === 'person') {
          return {
            ...c,
            people: c.people.map((p) => (p.id === id ? { ...p, x, y } : p)),
          };
        }
        if (nodeType === 'document') {
          return {
            ...c,
            documents: c.documents.map((d) => (d.id === id ? { ...d, x, y } : d)),
          };
        }
        if (nodeType === 'law') {
          return {
            ...c,
            legalLaws: (c.legalLaws || []).map((l) => (l.id === id ? { ...l, x, y } : l)),
          };
        }
        if (nodeType === 'strategy') {
          return {
            ...c,
            strategies: (c.strategies || []).map((s) => (s.id === id ? { ...s, x, y } : s)),
          };
        }
        if (nodeType === 'damages') {
          return {
            ...c,
            damages: (c.damages || []).map((dm) => (dm.id === id ? { ...dm, x, y } : dm)),
          };
        }
        if (nodeType === 'note') {
          return {
            ...c,
            lawyerNotes: (c.lawyerNotes || []).map((n) => (n.id === id ? { ...n, x, y } : n)),
          };
        }
        return c;
      })
    );
  };

  const addLegalLaw = (caseId: string, lawData: Omit<LegalLawNode, 'id'>) => {
    const newLaw: LegalLawNode = {
      ...lawData,
      id: generateUniqueId('law'),
    };
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          legalLaws: [...(c.legalLaws || []), newLaw],
        };
      })
    );
  };

  const deleteLegalLaw = (caseId: string, lawId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          legalLaws: (c.legalLaws || []).filter((l) => l.id !== lawId),
        };
      })
    );
  };

  const toggleLawElement = (caseId: string, lawId: string, elemId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          legalLaws: (c.legalLaws || []).map((law) => {
            if (law.id !== lawId) return law;
            return {
              ...law,
              elements: law.elements.map((el) =>
                el.id === elemId ? { ...el, satisfied: !el.satisfied } : el
              ),
            };
          }),
        };
      })
    );
  };

  const addStrategy = (caseId: string, stratData: Omit<StrategyNode, 'id'>) => {
    const newStrat: StrategyNode = {
      ...stratData,
      id: generateUniqueId('strat'),
    };
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          strategies: [...(c.strategies || []), newStrat],
        };
      })
    );
  };

  const deleteStrategy = (caseId: string, stratId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          strategies: (c.strategies || []).filter((s) => s.id !== stratId),
        };
      })
    );
  };

  const addDamagesNode = (caseId: string, dmgData: Omit<DamagesNode, 'id'>) => {
    const newDmg: DamagesNode = {
      ...dmgData,
      id: generateUniqueId('dmg'),
    };
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          damages: [...(c.damages || []), newDmg],
        };
      })
    );
  };

  const deleteDamagesNode = (caseId: string, dmgId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          damages: (c.damages || []).filter((d) => d.id !== dmgId),
        };
      })
    );
  };

  const addDamageItem = (
    caseId: string,
    dmgId: string,
    item: { label: string; amount: number }
  ) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          damages: (c.damages || []).map((dm) => {
            if (dm.id !== dmgId) return dm;
            return {
              ...dm,
              items: [...dm.items, { id: generateUniqueId('item'), ...item }],
            };
          }),
        };
      })
    );
  };

  const deleteDamageItem = (caseId: string, dmgId: string, itemId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          damages: (c.damages || []).map((dm) => {
            if (dm.id !== dmgId) return dm;
            return {
              ...dm,
              items: dm.items.filter((i) => i.id !== itemId),
            };
          }),
        };
      })
    );
  };

  const addLawyerNote = (caseId: string, noteData: Omit<LawyerNoteNode, 'id'>) => {
    const newNote: LawyerNoteNode = {
      ...noteData,
      id: generateUniqueId('note'),
    };
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          lawyerNotes: [...(c.lawyerNotes || []), newNote],
        };
      })
    );
  };

  const deleteLawyerNote = (caseId: string, noteId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          lawyerNotes: (c.lawyerNotes || []).filter((n) => n.id !== noteId),
        };
      })
    );
  };

  const updateLawyerNote = (caseId: string, note: LawyerNoteNode) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          lawyerNotes: (c.lawyerNotes || []).map((n) => (n.id === note.id ? note : n)),
        };
      })
    );
  };

  const updateNodeImage = (
    caseId: string,
    nodeType: 'case' | 'event' | 'person' | 'document' | 'law' | 'strategy' | 'damages' | 'note',
    id: string,
    imageUrl?: string
  ) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        if (nodeType === 'case') {
          return { ...c, imageUrl };
        }
        if (nodeType === 'event') {
          return {
            ...c,
            events: c.events.map((e) => (e.id === id ? { ...e, imageUrl } : e)),
          };
        }
        if (nodeType === 'person') {
          return {
            ...c,
            people: c.people.map((p) => (p.id === id ? { ...p, imageUrl } : p)),
          };
        }
        if (nodeType === 'document') {
          return {
            ...c,
            documents: c.documents.map((d) => (d.id === id ? { ...d, imageUrl } : d)),
          };
        }
        if (nodeType === 'law') {
          return {
            ...c,
            legalLaws: (c.legalLaws || []).map((l) => (l.id === id ? { ...l, imageUrl } : l)),
          };
        }
        if (nodeType === 'strategy') {
          return {
            ...c,
            strategies: (c.strategies || []).map((s) => (s.id === id ? { ...s, imageUrl } : s)),
          };
        }
        if (nodeType === 'damages') {
          return {
            ...c,
            damages: (c.damages || []).map((dm) => (dm.id === id ? { ...dm, imageUrl } : dm)),
          };
        }
        if (nodeType === 'note') {
          return {
            ...c,
            lawyerNotes: (c.lawyerNotes || []).map((n) => (n.id === id ? { ...n, imageUrl } : n)),
          };
        }
        return c;
      })
    );
  };

  const addCustomLink = (caseId: string, fromId: string, toId: string, label?: string, color?: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const currentLinks = c.customLinks || [];
        // Don't add duplicate
        if (currentLinks.some((l) => l.fromId === fromId && l.toId === toId)) return c;
        return {
          ...c,
          customLinks: [
            ...currentLinks,
            { id: generateUniqueId('link'), fromId, toId, label, color },
          ],
        };
      })
    );
  };

  const removeCustomLink = (caseId: string, linkId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          customLinks: (c.customLinks || []).filter((l) => l.id !== linkId),
        };
      })
    );
  };

  const hideDefaultLink = (caseId: string, linkId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const currentHidden = c.hiddenDefaultLinks || [];
        if (currentHidden.includes(linkId)) return c;
        return {
          ...c,
          hiddenDefaultLinks: [...currentHidden, linkId],
        };
      })
    );
  };

  const restoreAllDefaultLinks = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          hiddenDefaultLinks: [],
        };
      })
    );
  };

  const sendMessage = async (caseId: string, text: string): Promise<void> => {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      const message = toCaseMessage(await api.sendMessage(caseId, trimmed));
      setCases((prev) =>
        prev.map((c) => {
          if (c.id !== caseId || (c.messages || []).some((m) => m.id === message.id)) return c;
          return { ...c, messages: [...(c.messages || []), message] };
        })
      );
    } catch (error) {
      setSyncError(errorMessage(error, 'ส่งข้อความไม่สำเร็จ'));
    }
  };

  // AI Organize Mind Map: Intelligently orders nodes into clean architectural columns without overlapping
  const autoOrganizeMindMap = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;

        // Column 0 (x: 80): บุคคลที่เกี่ยวข้อง (People) & กลยุทธ์ต่อสู้ (Strategies)
        let curPersonY = 100;
        const people = (c.people || []).map((p) => {
          const y = curPersonY;
          const cardH = p.imageUrl ? 300 : 210;
          curPersonY += cardH + 45;
          return { ...p, x: 80, y };
        });

        let curStratY = Math.max(curPersonY + 40, 520);
        const strategies = (c.strategies || []).map((s) => {
          const y = curStratY;
          const cardH = 260 + (s.counterPlan ? 40 : 0) + (s.imageUrl ? 80 : 0);
          curStratY += cardH + 45;
          return { ...s, x: 80, y };
        });

        // Column 1 (x: 440): คดีหลัก (Case Root) & ไทม์ไลน์เหตุการณ์ (Timeline Events)
        const caseX = 440;
        const caseY = 100; // Case root height is ~360px
        let curEventY = 530; // Clear clearance below Case Root so they never overlap

        const events = (c.events || []).map((e) => {
          const y = curEventY;
          const descLen = (e.description || '').length;
          const descExtra = Math.min(Math.floor(descLen / 50) * 16, 80);
          const imgExtra = e.imageUrl ? 80 : 0;
          const peopleExtra = (e.relatedPersonNames?.length || 0) > 0 ? 24 : 0;
          const cardH = 250 + descExtra + imgExtra + peopleExtra;
          curEventY += cardH + 50;
          return { ...e, x: 440, y };
        });

        // Column 2 (x: 840): พยานเอกสารและหลักฐาน (Documents) & ค่าเสียหาย (Damages)
        let curDocY = 100;
        const documents = (c.documents || []).map((d) => {
          const y = curDocY;
          const cardH = d.imageUrl ? 320 : (d.fileName ? 270 : 220);
          curDocY += cardH + 45;
          return { ...d, x: 840, y };
        });

        let curDmgY = Math.max(curDocY + 40, 800);
        const damages = (c.damages || []).map((dmg) => {
          const y = curDmgY;
          const itemsCount = dmg.items?.length || 1;
          const cardH = 250 + itemsCount * 45 + (dmg.imageUrl ? 80 : 0);
          curDmgY += cardH + 50;
          return { ...dmg, x: 840, y };
        });

        // Column 3 (x: 1260): ข้อกฎหมาย (Legal Laws) & บันทึกยุทธวิธีทนาย (Lawyer Notes)
        let curLawY = 100;
        const legalLaws = (c.legalLaws || []).map((l) => {
          const y = curLawY;
          const elemCount = l.elements?.length || 0;
          const cardH = 260 + elemCount * 40 + (l.imageUrl ? 80 : 0);
          curLawY += cardH + 50;
          return { ...l, x: 1260, y };
        });

        let curNoteY = Math.max(curLawY + 40, 800);
        const lawyerNotes = (c.lawyerNotes || []).map((n) => {
          const y = curNoteY;
          const contentLen = (n.content || '').length;
          const contentExtra = Math.min(Math.floor(contentLen / 50) * 16, 90);
          const cardH = 230 + contentExtra + (n.imageUrl ? 80 : 0);
          curNoteY += cardH + 50;
          return { ...n, x: 1260, y };
        });

        return {
          ...c,
          x: caseX,
          y: caseY,
          people,
          events,
          documents,
          legalLaws,
          strategies,
          damages,
          lawyerNotes,
        };
      })
    );
  };

  const endSession = () => {
    syncedRef.current = new Map();
    lastMessageTimeRef.current = undefined;
    setIsAuthenticated(false);
    setCurrentUser(SIGNED_OUT_USER);
    setCases([]);
    setDeletedCases([]);
    setSelectedCaseId('');
    setUnreadChatCount(0);
    setChatNotification(null);
    setLastDeletedToast(null);
    setSyncStatus('idle');
    setSyncError(null);
  };

  const logoutUser = () => {
    // Save pending edits before the session cookie is cleared.
    void flushChanges()
      .catch(() => undefined)
      .then(() => api.logout())
      .catch(() => undefined)
      .finally(endSession);
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    lawyerLicenseId?: string
  ): Promise<AuthResult> => {
    try {
      const user = await api.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        lawyerLicenseId: lawyerLicenseId?.trim() || undefined,
      });
      await startSession(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error, 'สร้างบัญชีไม่สำเร็จ') };
    }
  };

  const loginUser = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const user = await api.login(email.trim().toLowerCase(), password);
      await startSession(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error, 'เข้าสู่ระบบไม่สำเร็จ') };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        cases,
        deletedCases,
        lastDeletedToast,
        setLastDeletedToast,
        restoreCase,
        permanentlyDeleteCase,
        clearAllTrash,
        selectedCaseId,
        setSelectedCaseId,
        currentCase,
        activeLawyerNav,
        setActiveLawyerNav,
        isViewingCaseDetail,
        setIsViewingCaseDetail,
        activeCaseTab,
        setActiveCaseTab,
        activeClientTab,
        setActiveClientTab,
        showOnboarding,
        setShowOnboarding,
        showHelpModal,
        setShowHelpModal,
        createCase,
        deleteCase,
        closeCase,
        reopenCase,
        updateCourtVerdict,
        generatePostCaseAnalysis,
        addFutureUpdate,
        updateFutureUpdate,
        toggleFutureUpdate,
        deleteFutureUpdate,
        addEvent,
        updateEvent,
        deleteEvent,
        addDocument,
        updateDocument,
        deleteDocument,
        updateDocStatus,
        addChecklistItem,
        toggleChecklistStatus,
        updateChecklistStatus,
        addDeadline,
        deleteDeadline,
        addPerson,
        deletePerson,
        updateNodePosition,
        addLegalLaw,
        deleteLegalLaw,
        toggleLawElement,
        addStrategy,
        deleteStrategy,
        addDamagesNode,
        deleteDamagesNode,
        addDamageItem,
        deleteDamageItem,
        addLawyerNote,
        deleteLawyerNote,
        updateLawyerNote,
        updateNodeImage,
        addCustomLink,
        removeCustomLink,
        hideDefaultLink,
        restoreAllDefaultLinks,
        sendMessage,
        autoOrganizeMindMap,
        lineStyle,
        setLineStyle,
        isLeftChatOpen,
        setIsLeftChatOpen,
        unreadChatCount,
        setUnreadChatCount,
        chatNotification,
        setChatNotification,
        showPrivacyModal,
        setShowPrivacyModal,
        isAuthenticated,
        isCheckingSession,
        syncStatus,
        syncError,
        isFirstTimeUser,
        logoutUser,
        registerUser,
        loginUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
