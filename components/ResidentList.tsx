
import React, { useState, useRef } from 'react';
import { Resident, UserRole, ACRStatus } from '../types';
import { 
  UserPlus, Search, Edit2, Trash2, 
  KeyRound, User as UserIcon, X, 
  Download, Upload, FileJson,
  MapPin, Users as UsersGroup, MessageSquare, Info
} from 'lucide-react';

interface ResidentListProps {
  residents: Resident[];
  onAdd: (r: Omit<Resident, 'id'>) => void;
  onUpdate: (r: Resident) => void;
  onDelete: (id: string) => void;
  currentUser: Resident | null;
}

const ResidentList: React.FC<ResidentListProps> = ({ residents, onAdd, onUpdate, onDelete, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ 
    name: '', 
    address: '', 
    phone: '', 
    role: UserRole.WARGA,
    username: '',
    password: '123',
    kkNumber: '',
    nikNumber: '',
    pob: '',
    dob: '',
    spouseName: '',
    children: '',
    acrStatus: 'KTP ACR' as ACRStatus
  });

  const isKetua = currentUser?.role === UserRole.KETUA;
  const canManage = currentUser?.role !== UserRole.WARGA;

  const filtered = residents.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.nikNumber?.includes(searchTerm) ||
    r.kkNumber?.includes(searchTerm)
  );

  const handleEdit = (r: Resident) => {
    setEditingId(r.id);
    setFormData({
      name: r.name,
      address: r.address,
      phone: r.phone,
      role: r.role,
      username: r.username || '',
      password: r.password || '123',
      kkNumber: r.kkNumber || '',
      nikNumber: r.nikNumber || '',
      pob: r.pob || '',
      dob: r.dob || '',
      spouseName: r.spouseName || '',
      children: r.children || '',
      acrStatus: r.acrStatus || 'KTP ACR'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate({ ...formData, id: editingId, status: 'active' });
    } else {
      onAdd({ ...formData, status: 'active' });
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ 
      name: '', address: '', phone: '', role: UserRole.WARGA, 
      username: '', password: '123', kkNumber: '', nikNumber: '',
      pob: '', dob: '', spouseName: '', children: '', acrStatus: 'KTP ACR'
    });
  };

  const downloadTemplate = () => {
    const headers = ["Nama", "Alamat", "No WA", "KK", "NIK", "Tempat Lahir", "Tgl Lahir", "Istri/Suami", "Anak", "Status Kependudukan", "Username"];
    const example = ["Budi Santoso", "Blok B No. 12", "08123456789", "320101...", "320101...", "Jakarta", "1990-05-20", "Sinta", "Andi; Rina", "KTP ACR", "budi123"];
    const csvContent = [headers.join(","), example.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Template_Import_Warga_SiWarga.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToCSV = () => {
    const headers = ["Nama", "Alamat", "No WA", "KK", "NIK", "Tempat Lahir", "Tgl Lahir", "Istri/Suami", "Anak", "Status Kependudukan", "Username", "Role"];
    const csvContent = [
      headers.join(","),
      ...residents.map(r => [
        `"${r.name}"`, 
        `"${r.address}"`, 
        `"${r.phone}"`, 
        `'${r.kkNumber}`,
        `'${r.nikNumber}`,
        `"${r.pob}"`,
        `"${r.dob}"`,
        `"${r.spouseName}"`,
        `"${r.children.replace(/\n/g, '; ')}"`,
        `"${r.acrStatus}"`,
        `"${r.username || ''}"`,
        `"${r.role}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Warga_SiWarga_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(line => line.trim().length > 0);
      
      lines.slice(1).forEach(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (values.length >= 10) {
          const clean = (val: string) => val.replace(/^"|"$/g, '').replace(/^'/, '').trim();
          onAdd({
            name: clean(values[0]),
            address: clean(values[1]),
            phone: clean(values[2]),
            kkNumber: clean(values[3]),
            nikNumber: clean(values[4]),
            pob: clean(values[5]),
            dob: clean(values[6]),
            spouseName: clean(values[7]),
            children: clean(values[8]),
            acrStatus: (clean(values[9]) === 'KTP ACR' ? 'KTP ACR' : 'Non KTP ACR') as ACRStatus,
            role: UserRole.WARGA,
            status: 'active',
            username: clean(values[10]) || 'user_' + Math.random().toString(36).substr(2, 5),
            password: '123'
          });
        }
      });
      alert('Data warga berhasil diimpor!');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const openWA = (phone: string) => {
    const formatted = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${formatted.startsWith('0') ? '62' + formatted.substring(1) : formatted}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-4 md:p-8 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Database Warga</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola data kependudukan dan akses akun warga ACR</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] md:min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama, NIK, atau KK..." 
              className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {canManage && (
              <>
                <button 
                  onClick={downloadTemplate}
                  className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 border border-indigo-100 transition-all flex items-center gap-2 text-xs font-bold"
                  title="Unduh Format Template CSV"
                >
                  <FileJson className="w-4 h-4" /> <span className="hidden sm:inline">Format Template</span>
                </button>
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 border border-slate-100 transition-all flex items-center gap-2 text-xs font-bold"
                  title="Impor CSV"
                >
                  <Upload className="w-4 h-4" /> <span className="hidden sm:inline">Impor CSV</span>
                </button>
                <button 
                  onClick={exportToCSV}
                  className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 border border-slate-100 transition-all flex items-center gap-2 text-xs font-bold"
                  title="Ekspor CSV"
                >
                  <Download className="w-4 h-4" /> <span className="hidden sm:inline">Ekspor CSV</span>
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl transition-all font-bold text-sm shadow-lg shadow-blue-100"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden md:inline">Tambah Warga</span>
                  <span className="md:hidden">Baru</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-8 py-4">Warga & Status</th>
              <th className="px-6 py-4">NIK & KK</th>
              <th className="px-6 py-4 hidden md:table-cell">Keluarga</th>
              <th className="px-6 py-4">Kontak / Alamat</th>
              <th className="px-8 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(r => (
              <tr key={r.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors flex-shrink-0">
                      {r.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate max-w-[120px] md:max-w-none">{r.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          r.acrStatus === 'KTP ACR' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {r.acrStatus}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                          {r.role === UserRole.KETUA ? 'KETUA' : r.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1 min-w-[100px]">
                    <p className="text-xs font-mono text-slate-600"><span className="text-[9px] font-bold text-slate-300">NIK:</span> {r.nikNumber || '-'}</p>
                    <p className="text-xs font-mono text-slate-600"><span className="text-[9px] font-bold text-slate-300">KK:</span> {r.kkNumber || '-'}</p>
                  </div>
                </td>
                <td className="px-6 py-5 hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-slate-600"><span className="text-[9px] font-bold text-slate-300">ISTRI/SUAMI:</span> {r.spouseName || '-'}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[150px]"><span className="text-[9px] font-bold text-slate-300">ANAK:</span> {r.children || '-'}</p>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    {r.phone}
                    <button onClick={() => openWA(r.phone)} className="text-emerald-500 hover:scale-110 transition-transform">
                      <MessageSquare className="w-4 h-4 fill-emerald-500/10" />
                    </button>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[150px]">{r.address}</p>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canManage && (
                      <>
                        <button 
                          onClick={() => handleEdit(r)}
                          className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 hover:text-blue-600 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(r.id)}
                          className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            <button onClick={closeModal} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all z-10">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{editingId ? 'Update Data Warga' : 'Pendaftaran Warga Baru'}</h3>
            <p className="text-slate-500 text-sm mb-8">Lengkapi data kependudukan sesuai dengan identitas resmi (KK/KTP).</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <UserIcon className="w-4 h-4 text-blue-500" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Data Pribadi</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <InputWrapper label="Nama Lengkap">
                    <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </InputWrapper>
                  <InputWrapper label="Nomor NIK">
                    <input required type="text" maxLength={16} className="form-input font-mono" value={formData.nikNumber} onChange={e => setFormData({...formData, nikNumber: e.target.value})} />
                  </InputWrapper>
                  <InputWrapper label="Nomor KK">
                    <input required type="text" maxLength={16} className="form-input font-mono" value={formData.kkNumber} onChange={e => setFormData({...formData, kkNumber: e.target.value})} />
                  </InputWrapper>
                  <InputWrapper label="Tempat Lahir">
                    <input required type="text" className="form-input" value={formData.pob} onChange={e => setFormData({...formData, pob: e.target.value})} />
                  </InputWrapper>
                  <InputWrapper label="Tanggal Lahir">
                    <input required type="date" className="form-input" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                  </InputWrapper>
                  <InputWrapper label="Nomor WA/Telepon">
                    <input required type="text" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </InputWrapper>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <UsersGroup className="w-4 h-4 text-blue-500" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Data Keluarga</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputWrapper label="Nama Istri / Suami">
                    <input type="text" placeholder="Kosongkan jika belum ada" className="form-input" value={formData.spouseName} onChange={e => setFormData({...formData, spouseName: e.target.value})} />
                  </InputWrapper>
                  <InputWrapper label="Data Anak">
                    <input type="text" placeholder="Contoh: Andi, Rina, ..." className="form-input" value={formData.children} onChange={e => setFormData({...formData, children: e.target.value})} />
                  </InputWrapper>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Domisili & Peran</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2">
                    <InputWrapper label="Alamat (Blok / No)">
                      <input required type="text" className="form-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </InputWrapper>
                  </div>
                  <InputWrapper label="Status Kependudukan">
                    <select className="form-input" value={formData.acrStatus} onChange={e => setFormData({...formData, acrStatus: e.target.value as ACRStatus})}>
                      <option value="KTP ACR">KTP ACR</option>
                      <option value="Non KTP ACR">Non KTP ACR</option>
                    </select>
                  </InputWrapper>
                  <InputWrapper label="Peran di KORWIL">
                    <select className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                      <option value={UserRole.WARGA}>Warga</option>
                      <option value={UserRole.BENDAHARA}>Bendahara</option>
                      <option value={UserRole.SEKRETARIS}>Sekretaris</option>
                      <option value={UserRole.KETUA}>Ketua KORWIL</option>
                    </select>
                  </InputWrapper>
                  <InputWrapper label="Username Login">
                    <input required type="text" className="form-input" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                  </InputWrapper>
                  <InputWrapper label="Password">
                    <input required type="text" className="form-input font-mono" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </InputWrapper>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-50">
                <button type="button" onClick={closeModal} className="w-full md:flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
                  Batal
                </button>
                <button type="submit" className="w-full md:flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                  {editingId ? 'Simpan Perubahan' : 'Daftarkan Warga'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .form-input {
          width: 100%;
          padding: 0.75rem 1.25rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .form-input:focus {
          border-color: #3b82f6;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
};

const InputWrapper = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {children}
  </div>
);

export default ResidentList;
