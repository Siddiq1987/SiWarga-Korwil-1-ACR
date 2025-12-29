
import React, { useState } from 'react';
import { Announcement } from '../types';
import { Megaphone, Plus, Trash2, Calendar, X } from 'lucide-react';

interface AnnouncementListProps {
  announcements: Announcement[];
  onAdd: (a: Omit<Announcement, 'id' | 'date' | 'author'>) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({ announcements, onAdd, onDelete, isAdmin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Info' as Announcement['category']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setIsModalOpen(false);
    setFormData({ title: '', content: '', category: 'Info' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Informasi Lingkungan</h2>
          <p className="text-slate-500 mt-1">Berita terbaru dan kegiatan di KORWIL 1 Ambar Cibinong Residence.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 transition-all"
          >
            <Plus className="w-5 h-5" /> Post Info Baru
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map(a => (
          <div key={a.id} className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm relative group hover:border-blue-200 transition-all">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                a.category === 'Urgent' ? 'bg-rose-100 text-rose-600' : 
                a.category === 'Kegiatan' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {a.category}
              </span>
              {isAdmin && (
                <button 
                  onClick={() => onDelete(a.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{a.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">{a.content}</p>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">{new Date(a.date).toLocaleDateString('id-ID')}</span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Oleh: {a.author}</span>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[2rem] border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
            <Megaphone className="w-12 h-12 mb-4 opacity-10" />
            <p className="font-medium">Belum ada informasi terbaru.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Buat Informasi Baru</h3>
            <p className="text-slate-500 text-sm mb-8">Informasi akan dapat dilihat oleh seluruh warga.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Kategori</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Info', 'Urgent', 'Kegiatan'] as const).map(cat => (
                    <button 
                      key={cat} 
                      type="button"
                      onClick={() => setFormData({...formData, category: cat})}
                      className={`py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        formData.category === cat ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Judul Informasi</label>
                <input required type="text" placeholder="Masukkan judul info..." className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Isi Pesan / Detail</label>
                <textarea required rows={5} placeholder="Tuliskan detail informasi di sini..." className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-blue-700 transition-all mt-6 shadow-blue-100">
                Publikasikan Sekarang
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;
