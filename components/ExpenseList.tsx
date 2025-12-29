import React, { useState } from 'react';
import { Expense, Resident, UserRole } from '../types';
// Removed non-existent import and unused icons
import { Plus, Trash2, Calendar, X } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onAdd: (e: Omit<Expense, 'id'>) => void;
  onDelete: (id: string) => void;
  currentUser: Resident | null;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onAdd, onDelete, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().substring(0, 10)
  });

  const canManage = currentUser?.role !== UserRole.WARGA;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      recordedBy: currentUser?.id || 'unknown'
    });
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ amount: 0, category: '', description: '', date: new Date().toISOString().substring(0, 10) });
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pengeluaran Dana Kas</h2>
          <p className="text-sm text-slate-500 mt-1">Catatan real-time pemakaian dana kas KORWIL 1</p>
        </div>
        
        {canManage && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-2xl transition-all font-bold text-sm shadow-lg shadow-rose-100"
          >
            <Plus className="w-4 h-4" />
            Catat Pengeluaran
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-8 py-4">Tanggal</th>
              <th className="px-6 py-4">Kategori / Jenis</th>
              <th className="px-6 py-4">Deskripsi</th>
              <th className="px-6 py-4">Jumlah</th>
              {canManage && <th className="px-8 py-4 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.sort((a,b) => b.date.localeCompare(a.date)).map(e => (
              <tr key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 text-sm text-slate-600 font-medium">{new Date(e.date).toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    {e.category}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-slate-600 max-w-xs truncate">{e.description}</td>
                <td className="px-6 py-5 font-black text-rose-600 text-sm">- Rp {e.amount.toLocaleString('id-ID')}</td>
                {canManage && (
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => onDelete(e.id)} 
                      className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-slate-400 text-sm italic">
                  Belum ada catatan pengeluaran bulan ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={closeModal} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Input Pengeluaran</h3>
            <p className="text-slate-500 text-sm mb-8">Pastikan data pengeluaran dicatat dengan teliti.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Jenis / Kategori Pengeluaran</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Contoh: Kebersihan, Listrik, Konsumsi..."
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none text-sm transition-all" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Nominal (Rp)</label>
                <input 
                  required 
                  type="number" 
                  placeholder="0"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none text-sm transition-all font-bold" 
                  value={formData.amount || ''} 
                  onChange={e => setFormData({...formData, amount: parseInt(e.target.value) || 0})} 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Keterangan / Deskripsi</label>
                <textarea 
                  required 
                  rows={3}
                  placeholder="Penjelasan detail pemakaian dana..."
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none text-sm transition-all" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tanggal Pengeluaran</label>
                <input 
                  required 
                  type="date" 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none text-sm transition-all" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                />
              </div>

              <div className="flex gap-4 mt-10">
                <button type="button" onClick={closeModal} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
                  Batal
                </button>
                <button type="submit" className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold text-sm hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all">
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
