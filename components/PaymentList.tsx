
import React, { useState } from 'react';
import { Payment, Resident, UserRole } from '../types';
import { PAYMENT_TYPES } from '../constants';
import { Receipt, Plus, Filter, Download } from 'lucide-react';

interface PaymentListProps {
  payments: Payment[];
  residents: Resident[];
  onAdd: (p: Omit<Payment, 'id' | 'verified' | 'date' | 'residentName'>) => void;
  onVerify: (id: string) => void;
  currentUser: Resident | null;
}

const PaymentList: React.FC<PaymentListProps> = ({ payments, residents, onAdd, onVerify, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    residentId: '',
    amount: 90000,
    month: new Date().toISOString().substring(0, 7),
    type: 'iuran_wajib' as Payment['type']
  });

  const canManage = currentUser?.role !== UserRole.WARGA;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setIsModalOpen(false);
    // Reset but keep the default amount
    setFormData({
      residentId: '',
      amount: 90000,
      month: new Date().toISOString().substring(0, 7),
      type: 'iuran_wajib'
    });
  };

  const filteredPayments = currentUser?.role === UserRole.WARGA 
    ? payments.filter(p => p.residentId === currentUser.id)
    : payments;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Riwayat Iuran</h2>
          <p className="text-sm text-gray-500 mt-1">Daftar transaksi pembayaran warga</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-sm transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-sm transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
          {canManage && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> Catat Bayar
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Warga</th>
              <th className="px-6 py-4">Tipe</th>
              <th className="px-6 py-4">Periode</th>
              <th className="px-6 py-4">Jumlah</th>
              <th className="px-6 py-4">Tgl Bayar</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPayments.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 text-sm">{p.residentName}</td>
                <td className="px-6 py-4">
                  <span className="text-gray-500 text-xs font-medium">
                    {PAYMENT_TYPES.find(t => t.value === p.type)?.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{p.month}</td>
                <td className="px-6 py-4 font-black text-gray-900 text-sm">Rp {p.amount.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4 text-gray-500 text-xs">{new Date(p.date).toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    p.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.verified ? 'Terverifikasi' : 'Menunggu'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {!p.verified && canManage && (
                    <button 
                      onClick={() => onVerify(p.id)}
                      className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                    >
                      Verifikasi
                    </button>
                  )}
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 ml-2 transition-all">
                    <Receipt className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Catat Pembayaran</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Pilih Warga</label>
                <select 
                  required
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  value={formData.residentId}
                  onChange={e => setFormData({...formData, residentId: e.target.value})}
                >
                  <option value="">-- Pilih Warga --</option>
                  {residents.map(r => <option key={r.id} value={r.id}>{r.name} ({r.address})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nominal (Rp)</label>
                <input 
                  required
                  type="number"
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tipe Iuran</label>
                <select 
                  required
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as Payment['type']})}
                >
                  {PAYMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div className="flex gap-4 mt-10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all">Batal</button>
                <button type="submit" className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-100 transition-all">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
