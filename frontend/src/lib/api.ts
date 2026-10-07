import { CaseItem, CaseMessage, UserProfile, UserRole } from '../types.ts';

interface ApiErrorPayload {
  error?: string;
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export interface ApiMessage {
  id: string;
  caseId: string;
  sender: string;
  role: UserRole;
  text: string;
  createdAt?: string;
}

interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lawyerLicenseId?: string;
  avatar?: string;
}

// Core case fields live in their own columns on the server; everything else is stored under `data`.
export const CORE_CASE_FIELDS = ['title', 'type', 'status', 'deadline', 'clientName', 'clientEmail', 'description'] as const;
// Fields the server owns or that are synced through their own endpoints.
export const SERVER_ONLY_CASE_FIELDS = new Set(['id', 'messages', 'deletedAt', 'updatedAt', 'isOwner']);

export function formatMessageTime(createdAt?: string): string {
  if (!createdAt) return 'เพิ่งส่ง';
  const date = new Date(createdAt);
  const time = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday ? `${time} น.` : `${date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} ${time} น.`;
}

export function toCaseMessage(message: ApiMessage): CaseMessage {
  return {
    id: message.id,
    sender: message.sender,
    role: message.role,
    text: message.text,
    time: formatMessageTime(message.createdAt),
    createdAt: message.createdAt,
  };
}

export function toCaseItem(raw: Record<string, unknown>): CaseItem {
  const c = raw as unknown as CaseItem & { messages?: ApiMessage[] };
  return {
    ...c,
    events: c.events || [],
    documents: c.documents || [],
    people: c.people || [],
    checklist: c.checklist || [],
    deadlines: c.deadlines || [],
    nextActions: c.nextActions || [],
    messages: (c.messages || []).map((m) => toCaseMessage(m as unknown as ApiMessage)),
  };
}

function toUserProfile(user: ApiUser): UserProfile {
  return { ...user, hasCompletedOnboarding: true };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
    throw new ApiError(payload.error || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export const api = {
  register: async (input: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    lawyerLicenseId?: string;
  }) => {
    const { user } = await request<{ user: ApiUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return toUserProfile(user);
  },

  login: async (email: string, password: string) => {
    const { user } = await request<{ user: ApiUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return toUserProfile(user);
  },

  logout: () => request<void>('/api/auth/logout', { method: 'POST' }),

  me: async () => {
    const { user } = await request<{ user: ApiUser }>('/api/auth/me');
    return toUserProfile(user);
  },

  listCases: async () => {
    const { cases } = await request<{ cases: Record<string, unknown>[] }>('/api/cases');
    return cases.map(toCaseItem);
  },

  listTrash: async () => {
    const { cases } = await request<{ cases: Record<string, unknown>[] }>('/api/cases/trash');
    return cases.map(toCaseItem);
  },

  createCase: async (input: Record<string, unknown>) => {
    const { case: created } = await request<{ case: Record<string, unknown> }>('/api/cases', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return toCaseItem(created);
  },

  updateCase: (id: string, input: Record<string, unknown>) =>
    request<{ case: Record<string, unknown> }>(`/api/cases/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),

  deleteCase: (id: string) =>
    request<void>(`/api/cases/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  deleteCasePermanently: (id: string) =>
    request<void>(`/api/cases/${encodeURIComponent(id)}?permanent=1`, { method: 'DELETE' }),

  restoreCase: async (id: string) => {
    const { case: restored } = await request<{ case: Record<string, unknown> }>(
      `/api/cases/${encodeURIComponent(id)}/restore`,
      { method: 'POST' }
    );
    return toCaseItem(restored);
  },

  sendMessage: async (caseId: string, text: string) => {
    const { message } = await request<{ message: ApiMessage }>(
      `/api/cases/${encodeURIComponent(caseId)}/messages`,
      { method: 'POST', body: JSON.stringify({ text }) }
    );
    return message;
  },

  messagesSince: (since?: string) =>
    request<{ messages: ApiMessage[]; serverTime: string }>(
      `/api/cases/messages${since ? `?since=${encodeURIComponent(since)}` : ''}`
    ),
};
