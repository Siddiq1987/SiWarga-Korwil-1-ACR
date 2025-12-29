
import { Resident, UserRole, Payment, Expense, Announcement } from './types';

export const INITIAL_RESIDENTS: Resident[] = [
  { 
    id: '1', 
    name: 'Bpk. Ahmad (Ketua)', 
    address: 'Blok A No. 1', 
    phone: '08123456789', 
    role: UserRole.KETUA, 
    status: 'active',
    username: 'ketua',
    password: '123',
    kkNumber: '3201234567890001',
    nikNumber: '3201234567890001',
    pob: 'Bogor',
    dob: '1980-05-15',
    spouseName: 'Ibu Fatimah',
    children: 'Anisa, Budi',
    acrStatus: 'KTP ACR'
  },
  { 
    id: '2', 
    name: 'Ibu Siti', 
    address: 'Blok A No. 5', 
    phone: '08223456789', 
    role: UserRole.BENDAHARA, 
    status: 'active',
    username: 'bendahara',
    password: '123',
    kkNumber: '3201234567890002',
    nikNumber: '3201234567890002',
    pob: 'Jakarta',
    dob: '1985-08-20',
    spouseName: 'Bpk. Hendra',
    children: 'Siska',
    acrStatus: 'KTP ACR'
  },
  { 
    id: '3', 
    name: 'Budi Santoso', 
    address: 'Blok B No. 12', 
    phone: '08333456789', 
    role: UserRole.WARGA, 
    status: 'active',
    username: 'budi',
    password: '123',
    kkNumber: '3201234567890003',
    nikNumber: '3201234567890003',
    pob: 'Cibinong',
    dob: '1990-12-12',
    spouseName: 'Sinta',
    children: '-',
    acrStatus: 'Non KTP ACR'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  { id: 'p1', residentId: '3', residentName: 'Budi Santoso', amount: 90000, month: '2024-01', date: '2024-01-05T10:00:00Z', type: 'iuran_wajib', verified: true }
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'e1', amount: 100000, category: 'Kebersihan', description: 'Pembelian kantong sampah dan sapu', date: '2024-01-10T09:00:00Z', recordedBy: '2' }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Gotong Royong Kebersihan Lingkungan',
    content: 'Diharapkan kehadirannya untuk seluruh warga KORWIL 1 dalam kegiatan gotong royong membersihkan saluran air pada hari Minggu besok jam 07.00 WIB.',
    date: new Date().toISOString(),
    author: 'Ketua KORWIL 1',
    category: 'Kegiatan'
  }
];

export const PAYMENT_TYPES = [
  { value: 'iuran_wajib', label: 'Iuran Wajib' },
  { value: 'iuran_sumbangan', label: 'Iuran Sumbangan' }
];

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
