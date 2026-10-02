import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CaseItem,
  UserProfile,
  UserRole,
  CaseEvent,
  CaseDocument,
  ChecklistItem,
  DocStatus,
  DeadlineItem,
  CaseMessage,
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
import { DEMO_LAWYER, DEMO_CLIENT, INITIAL_CASES } from '../mockData.ts';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
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
  authModal: 'login' | 'register' | null;
  setAuthModal: (modal: 'login' | 'register' | null) => void;

  // Case Recovery & Trash
  lastDeletedToast: { case: CaseItem; timestamp: number } | null;
  setLastDeletedToast: (toast: { case: CaseItem; timestamp: number } | null) => void;
  restoreCase: (caseId: string) => void;
  permanentlyDeleteCase: (caseId: string) => void;
  clearAllTrash: () => void;

  // Actions
  createCase: (newCase: Partial<CaseItem>) => string;
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
  sendMessage: (caseId: string, text: string, asRole?: UserRole, senderName?: string) => void;
  simulateClientMessage: (caseId: string, customText?: string) => void;
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
  setIsAuthenticated: (auth: boolean) => void;
  isFirstTimeUser: boolean;
  logoutUser: () => void;
  quickDemoLogin: (role: UserRole) => void;
  registerUser: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    lawyerLicenseId?: string
  ) => { success: boolean; error?: string };
  loginUser: (email: string, password: string) => { success: boolean; error?: string };
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_CASES = 'caselink_cases_v2';
const LOCAL_STORAGE_KEY_DELETED_CASES = 'caselink_deleted_cases_v2';
const LOCAL_STORAGE_KEY_USER = 'caselink_user_v2';
const LOCAL_STORAGE_KEY_REGISTERED_USERS = 'caselink_registered_accounts_v2';
const LOCAL_STORAGE_KEY_SESSION = 'caselink_auth_session_active_v2';
const LOCAL_STORAGE_KEY_VISITED = 'caselink_visited_flag_v2';

let idCounter = 0;
export const generateUniqueId = (prefix: string = 'id'): string => {
  idCounter += 1;
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${Date.now()}-${idCounter}-${rand}`;
};

function deduplicateAndEnsureUnique<T extends { id: string }>(items: T[], prefix: string): T[] {
  if (!items || !Array.isArray(items)) return [];
  const seenFp = new Set<string>();
  const seenIds = new Set<string>();
  const result: T[] = [];

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    if (!item) continue;
    // Fingerprint based on content to prevent duplicate nodes
    const { id, x, y, ...rest } = item as any;
    const fp = JSON.stringify(rest);
    if (seenFp.has(fp)) {
      // Skip exact duplicate entity
      continue;
    }
    seenFp.add(fp);

    let finalId = item.id;
    if (!finalId || seenIds.has(finalId)) {
      finalId = generateUniqueId(`${prefix}-${idx}`);
    }
    seenIds.add(finalId);
    result.push({ ...item, id: finalId });
  }

  return result;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEMO_LAWYER;
  });

  const [cases, setCases] = useState<CaseItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CASES);
      if (saved) {
        const parsed: CaseItem[] = JSON.parse(saved);
        return parsed.map((c) => {
          const init = INITIAL_CASES.find((ic) => ic.id === c.id);
          const sanitizedEvents = deduplicateAndEnsureUnique(c.events || [], 'ev');
          const sanitizedPeople = deduplicateAndEnsureUnique(c.people || [], 'p');
          const sanitizedDocs = deduplicateAndEnsureUnique(c.documents || [], 'doc');
          const sanitizedLaws = deduplicateAndEnsureUnique(c.legalLaws || init?.legalLaws || [], 'law');
          const sanitizedStrats = deduplicateAndEnsureUnique(c.strategies || init?.strategies || [], 'strat');
          const sanitizedDmgs = deduplicateAndEnsureUnique(c.damages || init?.damages || [], 'dmg');
          const sanitizedNotes = deduplicateAndEnsureUnique(c.lawyerNotes || init?.lawyerNotes || [], 'note');
          const sanitizedChecklist = deduplicateAndEnsureUnique(c.checklist || init?.checklist || [], 'chk');
          const sanitizedDeadlines = deduplicateAndEnsureUnique(c.deadlines || init?.deadlines || [], 'dl');

          const rawLinks = c.customLinks || init?.customLinks || [];
          const seenLinkIds = new Set<string>();
          const sanitizedLinks = rawLinks
            .filter((link, i, arr) => arr.findIndex((l) => l.fromId === link.fromId && l.toId === link.toId) === i)
            .map((link, idx) => {
              let linkId = link.id;
              if (!linkId || seenLinkIds.has(linkId)) {
                linkId = generateUniqueId(`link-${idx}`);
              }
              seenLinkIds.add(linkId);
              return { ...link, id: linkId };
            });

          return {
            ...c,
            imageUrl: c.imageUrl || init?.imageUrl,
            events: sanitizedEvents.map((ev) => ({
              ...ev,
              imageUrl: ev.imageUrl || init?.events?.find((e) => e.id === ev.id)?.imageUrl,
            })),
            people: sanitizedPeople.map((p) => ({
              ...p,
              imageUrl: p.imageUrl || init?.people?.find((ip) => ip.id === p.id)?.imageUrl,
            })),
            documents: sanitizedDocs.map((d) => ({
              ...d,
              imageUrl: d.imageUrl || init?.documents?.find((idoc) => idoc.id === d.id)?.imageUrl,
            })),
            legalLaws: sanitizedLaws.map((l) => ({
              ...l,
              imageUrl: l.imageUrl || init?.legalLaws?.find((il) => il.id === l.id)?.imageUrl,
            })),
            strategies: sanitizedStrats.map((s) => ({
              ...s,
              imageUrl: s.imageUrl || init?.strategies?.find((is) => is.id === s.id)?.imageUrl,
            })),
            damages: sanitizedDmgs.map((dm) => ({
              ...dm,
              imageUrl: dm.imageUrl || init?.damages?.find((idm) => idm.id === dm.id)?.imageUrl,
            })),
            lawyerNotes: sanitizedNotes.map((n) => ({
              ...n,
              imageUrl: n.imageUrl || init?.lawyerNotes?.find((inote) => inote.id === n.id)?.imageUrl,
            })),
            checklist: sanitizedChecklist,
            deadlines: sanitizedDeadlines,
            customLinks: sanitizedLinks,
            hiddenDefaultLinks: Array.from(new Set(c.hiddenDefaultLinks || [])),
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CASES;
  });

  const [deletedCases, setDeletedCases] = useState<CaseItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DELETED_CASES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [lastDeletedToast, setLastDeletedToast] = useState<{ case: CaseItem; timestamp: number } | null>(null);

  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-abc-001');
  const [activeLawyerNav, setActiveLawyerNav] = useState<LawyerNavType>('dashboard');
  const [isViewingCaseDetail, setIsViewingCaseDetail] = useState<boolean>(true);
  const [activeCaseTab, setActiveCaseTab] = useState<CaseTabType>('overview');
  const [activeClientTab, setActiveClientTab] = useState<'overview' | 'documents' | 'todos' | 'messages'>('overview');
  
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY_SESSION) === 'true';
    } catch {
      return false;
    }
  });

  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY_VISITED) !== 'true';
    } catch {
      return true;
    }
  });

  // Quick Chat Drawer & Notification states
  const [isLeftChatOpen, setIsLeftChatOpen] = useState<boolean>(false);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [chatNotification, setChatNotification] = useState<{ text: string; sender: string; timestamp: number } | null>(null);
  const [lineStyle, setLineStyle] = useState<'orthogonal' | 'bezier'>('orthogonal');

  // Sync cases to local storage with debounce to eliminate drag lag/delay
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_CASES, JSON.stringify(cases));
      } catch (e) {
        console.error(e);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [cases]);

  // Sync deleted cases to local storage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_DELETED_CASES, JSON.stringify(deletedCases));
      } catch (e) {
        console.error(e);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [deletedCases]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(currentUser));
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    if (role === 'lawyer') {
      setCurrentUser(DEMO_LAWYER);
      setActiveLawyerNav('dashboard');
    } else {
      setCurrentUser(DEMO_CLIENT);
      setActiveClientTab('overview');
    }
  };

  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const createCase = (newCaseData: Partial<CaseItem>): string => {
    const newId = generateUniqueId('case');
    const newCase: CaseItem = {
      id: newId,
      title: newCaseData.title || 'คดีใหม่',
      type: newCaseData.type || 'คดีแพ่ง',
      status: 'กำลังดำเนินการ',
      deadline: newCaseData.deadline || 'ไม่ระบุวัน',
      clientName: newCaseData.clientName || 'ลูกความ',
      description: newCaseData.description || 'รายละเอียดคดี',
      events: newCaseData.events || [],
      documents: newCaseData.documents || [],
      people: newCaseData.people || [
        { id: generateUniqueId('p'), name: newCaseData.clientName || 'ลูกความ', role: 'ลูกความ / โจทก์', relatedEventIds: [] }
      ],
      checklist: newCaseData.checklist || [
        { id: generateUniqueId('chk'), title: 'บัตรประชาชน', category: 'client', status: 'ยังไม่ได้ส่ง' },
        { id: generateUniqueId('chk'), title: 'สัญญาว่าจ้าง/เอกสารที่เกี่ยวข้อง', category: 'client', status: 'ยังไม่ได้ส่ง' },
        { id: generateUniqueId('chk'), title: 'ตรวจข้อเท็จจริงเบื้องต้น', category: 'lawyer', status: 'กำลังตรวจ' },
      ],
      deadlines: newCaseData.deadlines || [],
      messages: [
        {
          id: generateUniqueId('msg'),
          sender: 'ทนายสมชาย',
          role: 'lawyer',
          text: 'ยินดีต้อนรับสู่ CASELINK ทางเราเปิดแฟ้มคดีให้เรียบร้อยแล้วครับ หากมีเอกสารสามารถส่งในระบบได้ทันที',
          time: 'เพิ่งส่ง',
        },
      ],
      nextActions: ['ติดต่อลูกความเพื่อขอเอกสารเริ่มต้น', 'สรุปข้อเท็จจริงลง Timeline'],
    };

    setCases((prev) => [newCase, ...prev]);
    setSelectedCaseId(newId);
    return newId;
  };

  const deleteCase = (caseId: string) => {
    const targetCase = cases.find((c) => c.id === caseId);
    if (!targetCase) return;

    const caseWithDeletedAt: CaseItem = {
      ...targetCase,
      deletedAt: new Date().toISOString(),
    };

    // Move to deletedCases
    setDeletedCases((prev) => [caseWithDeletedAt, ...prev.filter((c) => c.id !== caseId)]);

    // Remove from active cases
    setCases((prev) => prev.filter((c) => c.id !== caseId));

    // Show undo toast
    setLastDeletedToast({ case: targetCase, timestamp: Date.now() });

    // Update selected case if active was deleted
    if (selectedCaseId === caseId) {
      const remaining = cases.filter((c) => c.id !== caseId);
      if (remaining.length > 0) {
        setSelectedCaseId(remaining[0].id);
      }
    }
  };

  const restoreCase = (caseId: string) => {
    const caseToRestore = deletedCases.find((c) => c.id === caseId);
    if (!caseToRestore) return;

    // Clean deletedAt
    const restoredCase: CaseItem = {
      ...caseToRestore,
      deletedAt: undefined,
    };

    // Remove from deletedCases and prepend to active cases
    setDeletedCases((prev) => prev.filter((c) => c.id !== caseId));
    setCases((prev) => [restoredCase, ...prev.filter((c) => c.id !== caseId)]);
    setSelectedCaseId(caseId);
    setLastDeletedToast(null);
  };

  const permanentlyDeleteCase = (caseId: string) => {
    setDeletedCases((prev) => prev.filter((c) => c.id !== caseId));
  };

  const clearAllTrash = () => {
    setDeletedCases([]);
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
          return {
            ...c,
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

  const sendMessage = (caseId: string, text: string, asRole?: UserRole, senderName?: string) => {
    const role = asRole || currentUser.role;
    const targetCase = cases.find((c) => c.id === caseId);
    let resolvedSender: string = role === 'lawyer' ? 'ทนายสมชาย' : (targetCase?.clientName || 'ลูกความ');
    if (senderName) {
      resolvedSender = senderName;
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} น.`;

    const newMsg: CaseMessage = {
      id: generateUniqueId('msg'),
      sender: resolvedSender,
      role,
      text,
      time: timeStr,
    };

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            messages: [...(c.messages || []), newMsg],
          };
        }
        return c;
      })
    );

    // If sent by client, increment unread count & show prominent notification
    if (role === 'client') {
      setUnreadChatCount((prev) => prev + 1);
      setChatNotification({
        text,
        sender: targetCase?.clientName || 'ลูกความ',
        timestamp: Date.now(),
      });
      playNotificationSound();
    }
  };

  const simulateClientMessage = (caseId: string, customText?: string) => {
    const promptList = [
      'สวัสดีครับทนาย อยากสอบถามว่าเอกสารสัญญาเพิ่มเติมต้องเซ็นตรงไหนบ้างครับ?',
      'คุณทนายครับ ได้รับไฟล์สลิปโอนเงินที่ส่งไปในระบบหรือยังครับ?',
      'สอบถามเรื่องวันนัดขึ้นศาลครั้งแรกครับ ทางศาลส่งหมายมาหรือยังครับ?',
      'ปรึกษาเพิ่มเติมครับ ทางคู่กรณีติดต่อมาขอเจรจาไกล่เกลี่ย เราควรตอบอย่างไรดีครับ?',
      'รบกวนทนายช่วยตรวจสอบข้อกฎหมายเรื่องการผิดนัดชำระหนี้ด้วยครับ',
    ];
    const chosenText = customText || promptList[Math.floor(Math.random() * promptList.length)];
    const target = cases.find((c) => c.id === caseId) || cases[0];
    if (target) {
      sendMessage(target.id, chosenText, 'client', target.clientName);
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

  const logoutUser = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_SESSION);
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setAuthModal('login');
  };

  const quickDemoLogin = (role: UserRole) => {
    const user = role === 'lawyer' ? DEMO_LAWYER : DEMO_CLIENT;
    setCurrentUser(user);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(LOCAL_STORAGE_KEY_SESSION, 'true');
      localStorage.setItem(LOCAL_STORAGE_KEY_VISITED, 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(true);
    setIsFirstTimeUser(false);
    if (role === 'lawyer') {
      setActiveLawyerNav('dashboard');
    } else {
      setActiveClientTab('overview');
    }
  };

  const registerUser = (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    lawyerLicenseId?: string
  ): { success: boolean; error?: string } => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const savedAccounts = localStorage.getItem(LOCAL_STORAGE_KEY_REGISTERED_USERS);
      const accounts: UserProfile[] = savedAccounts ? JSON.parse(savedAccounts) : [];
      if (accounts.some((acc) => acc.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'อีเมลนี้ถูกใช้งานแล้วในระบบอุปกรณ์นี้' };
      }
      const newUser: UserProfile = {
        id: generateUniqueId('usr'),
        name: name.trim(),
        email: cleanEmail,
        role,
        hasCompletedOnboarding: false,
        passwordHash: btoa(password), // Obfuscated client-side vault token
        lawyerLicenseId: lawyerLicenseId?.trim(),
        createdAt: new Date().toISOString(),
      };
      accounts.push(newUser);
      localStorage.setItem(LOCAL_STORAGE_KEY_REGISTERED_USERS, JSON.stringify(accounts));
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(newUser));
      localStorage.setItem(LOCAL_STORAGE_KEY_SESSION, 'true');
      localStorage.setItem(LOCAL_STORAGE_KEY_VISITED, 'true');
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      setIsFirstTimeUser(false);
      if (role === 'lawyer') {
        setActiveLawyerNav('dashboard');
      } else {
        setActiveClientTab('overview');
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: 'ไม่สามารถสร้างบัญชีได้: ' + (e?.message || 'ข้อผิดพลาดระบบ') };
    }
  };

  const loginUser = (email: string, password: string): { success: boolean; error?: string } => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const savedAccounts = localStorage.getItem(LOCAL_STORAGE_KEY_REGISTERED_USERS);
      const accounts: UserProfile[] = savedAccounts ? JSON.parse(savedAccounts) : [];

      const found = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);
      if (found) {
        if (found.passwordHash && found.passwordHash !== btoa(password)) {
          return { success: false, error: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' };
        }
        setCurrentUser(found);
        localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(found));
        localStorage.setItem(LOCAL_STORAGE_KEY_SESSION, 'true');
        localStorage.setItem(LOCAL_STORAGE_KEY_VISITED, 'true');
        setIsAuthenticated(true);
        setIsFirstTimeUser(false);
        if (found.role === 'lawyer') {
          setActiveLawyerNav('dashboard');
        } else {
          setActiveClientTab('overview');
        }
        return { success: true };
      }

      // Demo accounts fallback
      if (cleanEmail === DEMO_LAWYER.email.toLowerCase()) {
        quickDemoLogin('lawyer');
        return { success: true };
      }
      if (cleanEmail === DEMO_CLIENT.email.toLowerCase()) {
        quickDemoLogin('client');
        return { success: true };
      }

      // If user typed anything with lawyer/client, allow quick demo login
      if (cleanEmail.includes('lawyer') || cleanEmail.includes('ทนาย')) {
        const u = { ...DEMO_LAWYER, email: cleanEmail };
        setCurrentUser(u);
        localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(u));
        localStorage.setItem(LOCAL_STORAGE_KEY_SESSION, 'true');
        localStorage.setItem(LOCAL_STORAGE_KEY_VISITED, 'true');
        setIsAuthenticated(true);
        setIsFirstTimeUser(false);
        setActiveLawyerNav('dashboard');
        return { success: true };
      }
      if (cleanEmail.includes('client') || cleanEmail.includes('ลูกความ')) {
        const u = { ...DEMO_CLIENT, email: cleanEmail };
        setCurrentUser(u);
        localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(u));
        localStorage.setItem(LOCAL_STORAGE_KEY_SESSION, 'true');
        localStorage.setItem(LOCAL_STORAGE_KEY_VISITED, 'true');
        setIsAuthenticated(true);
        setIsFirstTimeUser(false);
        setActiveClientTab('overview');
        return { success: true };
      }

      return { success: false, error: 'ไม่พบบัญชีผู้ใช้นี้ กรุณาสร้างบัญชีก่อนเข้าสู่ระบบ' };
    } catch (e: any) {
      return { success: false, error: 'เข้าสู่ระบบไม่สำเร็จ: ' + (e?.message || 'ข้อผิดพลาดระบบ') };
    }
  };

  const resetDemoData = () => {
    setCases(INITIAL_CASES);
    setDeletedCases([]);
    setSelectedCaseId('case-abc-001');
    setCurrentUser(DEMO_LAWYER);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CASES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_DELETED_CASES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SESSION);
    localStorage.removeItem(LOCAL_STORAGE_KEY_VISITED);
    setIsAuthenticated(false);
    setIsFirstTimeUser(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
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
        authModal,
        setAuthModal,
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
        simulateClientMessage,
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
        setIsAuthenticated,
        isFirstTimeUser,
        logoutUser,
        quickDemoLogin,
        registerUser,
        loginUser,
        resetDemoData,
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
