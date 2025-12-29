
export enum UserRole {
  KETUA = 'KETUA',
  BENDAHARA = 'BENDAHARA',
  SEKRETARIS = 'SEKRETARIS',
  WARGA = 'WARGA'
}

export type ACRStatus = 'KTP ACR' | 'Non KTP ACR';

export interface Resident {
  id: string;
  name: string;
  address: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive';
  username?: string;
  password?: string;
  // Detail Fields baru
  kkNumber: string;
  nikNumber: string;
  pob: string; // Place of Birth
  dob: string; // Date of Birth
  spouseName: string;
  children: string; // List nama anak dipisah koma/newline
  acrStatus: ACRStatus;
}

export interface Payment {
  id: string;
  residentId: string;
  residentName: string;
  amount: number;
  month: string; // YYYY-MM
  date: string; // ISO string
  type: 'iuran_wajib' | 'iuran_sumbangan';
  verified: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
  recordedBy: string; // User ID
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  category: 'Urgent' | 'Info' | 'Kegiatan';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface AppState {
  residents: Resident[];
  payments: Payment[];
  expenses: Expense[];
  announcements: Announcement[];
  messages: ChatMessage[];
  currentUser: Resident | null;
}
