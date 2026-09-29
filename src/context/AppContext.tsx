import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CaseItem,
  UserProfile,
  UserRole,
  CaseEvent,
  CaseDocument,
  ChecklistItem,
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
  addCustomLink: (caseId: string, fromId: string, toId: string, label?: string) => void;
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
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_CASES = 'caselink_cases_v2';
const LOCAL_STORAGE_KEY_DELETED_CASES = 'caselink_deleted_cases_v2';
const LOCAL_STORAGE_KEY_USER = 'caselink_user_v2';

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
          return {
            ...c,
            imageUrl: c.imageUrl || init?.imageUrl,
            events: (c.events || []).map((ev) => ({
              ...ev,
              imageUrl: ev.imageUrl || init?.events?.find((e) => e.id === ev.id)?.imageUrl,
            })),
            people: (c.people || []).map((p) => ({
              ...p,
              imageUrl: p.imageUrl || init?.people?.find((ip) => ip.id === p.id)?.imageUrl,
            })),
            documents: (c.documents || []).map((d) => ({
              ...d,
              imageUrl: d.imageUrl || init?.documents?.find((idoc) => idoc.id === d.id)?.imageUrl,
            })),
            legalLaws: (c.legalLaws || init?.legalLaws || []).map((l) => ({
              ...l,
              imageUrl: l.imageUrl || init?.legalLaws?.find((il) => il.id === l.id)?.imageUrl,
            })),
            strategies: (c.strategies || init?.strategies || []).map((s) => ({
              ...s,
              imageUrl: s.imageUrl || init?.strategies?.find((is) => is.id === s.id)?.imageUrl,
            })),
            damages: (c.damages || init?.damages || []).map((dm) => ({
              ...dm,
              imageUrl: dm.imageUrl || init?.damages?.find((idm) => idm.id === dm.id)?.imageUrl,
            })),
            lawyerNotes: (c.lawyerNotes || init?.lawyerNotes || []).map((n) => ({
              ...n,
              imageUrl: n.imageUrl || init?.lawyerNotes?.find((inote) => inote.id === n.id)?.imageUrl,
            })),
            customLinks: c.customLinks || init?.customLinks || [],
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
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

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
    const newId = `case-${Date.now()}`;
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
        { id: `p-${Date.now()}-1`, name: newCaseData.clientName || 'ลูกความ', role: 'ลูกความ / โจทก์', relatedEventIds: [] }
      ],
      checklist: newCaseData.checklist || [
        { id: `chk-${Date.now()}-1`, title: 'บัตรประชาชน', category: 'client', status: 'ยังไม่ได้ส่ง' },
        { id: `chk-${Date.now()}-2`, title: 'สัญญาว่าจ้าง/เอกสารที่เกี่ยวข้อง', category: 'client', status: 'ยังไม่ได้ส่ง' },
        { id: `chk-${Date.now()}-3`, title: 'ตรวจข้อเท็จจริงเบื้องต้น', category: 'lawyer', status: 'กำลังตรวจ' },
      ],
      deadlines: newCaseData.deadlines || [],
      messages: [
        {
          id: `msg-${Date.now()}`,
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
      id: `ev-${Date.now()}`,
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
      id: `doc-${Date.now()}`,
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
          return {
            ...c,
            documents: c.documents.map((d) => (d.id === docId ? { ...d, status } : d)),
          };
        }
        return c;
      })
    );
  };

  const addChecklistItem = (caseId: string, itemData: Omit<ChecklistItem, 'id'>) => {
    const newItem: ChecklistItem = {
      ...itemData,
      id: `chk-${Date.now()}`,
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

  const toggleChecklistStatus = (caseId: string, itemId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            checklist: c.checklist.map((item) => {
              if (item.id === itemId) {
                const nextStatus: CaseDocument['status'] =
                  item.status === 'ตรวจแล้ว' ? 'ยังไม่ได้ส่ง' : 'ตรวจแล้ว';
                return { ...item, status: nextStatus };
              }
              return item;
            }),
          };
        }
        return c;
      })
    );
  };

  const addPerson = (caseId: string, personData: Omit<Person, 'id'>) => {
    const newPerson: Person = {
      ...personData,
      id: `p-${Date.now()}`,
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
      id: `law-${Date.now()}`,
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
      id: `strat-${Date.now()}`,
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
      id: `dmg-${Date.now()}`,
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
              items: [...dm.items, { id: `item-${Date.now()}`, ...item }],
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
      id: `note-${Date.now()}`,
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

  const addCustomLink = (caseId: string, fromId: string, toId: string, label?: string) => {
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
            { id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, fromId, toId, label },
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
      id: `msg-${Date.now()}`,
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

  // AI Organize Mind Map: Intelligently orders nodes into clean architectural columns
  const autoOrganizeMindMap = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;

        // Column 0: Involved People (Left)
        const people = (c.people || []).map((p, idx) => ({
          ...p,
          x: 80,
          y: 120 + idx * 190,
        }));

        // Column 1: Root Case Node & Sequential Timeline Events (Center)
        const events = (c.events || []).map((e, idx) => ({
          ...e,
          x: 420,
          y: 380 + idx * 220,
        }));

        // Column 2: Documents & Evidence (Right 1)
        const documents = (c.documents || []).map((d, idx) => ({
          ...d,
          x: 840,
          y: 120 + idx * 220,
        }));

        // Column 3: Legal Laws & Statutes (Right 2)
        const legalLaws = (c.legalLaws || []).map((l, idx) => ({
          ...l,
          x: 1240,
          y: 120 + idx * 260,
        }));

        // Left Bottom: Strategy & Counter-arguments
        const strategies = (c.strategies || []).map((s, idx) => ({
          ...s,
          x: 80,
          y: 580 + idx * 260,
        }));

        // Right 1 Bottom: Damages calculation
        const docBottom = documents.length > 0 ? 120 + documents.length * 220 + 40 : 580;
        const damages = (c.damages || []).map((dmg, idx) => ({
          ...dmg,
          x: 840,
          y: Math.max(docBottom, 580) + idx * 280,
        }));

        // Right 2 Bottom: Lawyer Notes
        const lawBottom = legalLaws.length > 0 ? 120 + legalLaws.length * 260 + 40 : 580;
        const lawyerNotes = (c.lawyerNotes || []).map((n, idx) => ({
          ...n,
          x: 1240,
          y: Math.max(lawBottom, 580) + idx * 230,
        }));

        return {
          ...c,
          x: 420,
          y: 140,
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

  const resetDemoData = () => {
    setCases(INITIAL_CASES);
    setDeletedCases([]);
    setSelectedCaseId('case-abc-001');
    setCurrentUser(DEMO_LAWYER);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CASES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_DELETED_CASES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
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
