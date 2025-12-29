
import React, { useMemo } from 'react';
import { Payment, Expense, Resident, UserRole } from '../types';
import { Wallet, ArrowUpRight, ArrowDownRight, Info, Calendar, Download, FileText, Lock } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface FinancialReportProps {
  payments: Payment[];
  expenses: Expense[];
  currentUser: Resident;
}

const FinancialReport: React.FC<FinancialReportProps> = ({ payments, expenses, currentUser }) => {
  const totalIncome = useMemo(() => payments.reduce((acc, p) => acc + p.amount, 0), [payments]);
  const totalExpense = useMemo(() => expenses.reduce((acc, e) => acc + e.amount, 0), [expenses]);
  const balance = totalIncome - totalExpense;

  const isAdmin = currentUser.role !== UserRole.WARGA;

  const handleDownloadPDF = () => {
    if (!isAdmin) return;

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('LAPORAN KEUANGAN KORWIL 1', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('PERUMAHAN AMBAR CIBINONG RESIDENCE', 105, 27, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);

    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${today}`, 20, 40);

    doc.setFontSize(14);
    doc.text('1. Ringkasan Kas', 20, 50);
    
    (doc as any).autoTable({
      startY: 55,
      head: [['Keterangan', 'Jumlah']],
      body: [
        ['Total Pemasukan', `Rp ${totalIncome.toLocaleString('id-ID')}`],
        ['Total Pengeluaran', `Rp ${totalExpense.toLocaleString('id-ID')}`],
        ['Saldo Akhir Kas', `Rp ${balance.toLocaleString('id-ID')}`]
      ],
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 }
    });

    const lastY = (doc as any).lastAutoTable.finalY || 80;
    doc.setFontSize(14);
    doc.text('2. Rincian Pemasukan (Iuran)', 20, lastY + 15);

    const paymentRows = payments.sort((a,b) => b.date.localeCompare(a.date)).map(p => [
      new Date(p.date).toLocaleDateString('id-ID'),
      p.residentName,
      p.type === 'iuran_wajib' ? 'Wajib' : 'Sumbangan',
      p.month,
      `Rp ${p.amount.toLocaleString('id-ID')}`
    ]);

    (doc as any).autoTable({
      startY: lastY + 20,
      head: [['Tanggal', 'Nama Warga', 'Jenis', 'Periode', 'Nominal']],
      body: paymentRows,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 8 },
      margin: { left: 20, right: 20 }
    });

    const lastY2 = (doc as any).lastAutoTable.finalY || 150;
    
    doc.setFontSize(14);
    if (lastY2 > 230) {
      doc.addPage();
      doc.text('3. Rincian Pengeluaran', 20, 20);
    } else {
      doc.text('3. Rincian Pengeluaran', 20, lastY2 + 15);
    }

    const expenseRows = expenses.sort((a,b) => b.date.localeCompare(a.date)).map(e => [
      new Date(e.date).toLocaleDateString('id-ID'),
      e.category,
      e.description,
      `Rp ${e.amount.toLocaleString('id-ID')}`
    ]);

    (doc as any).autoTable({
      startY: lastY2 > 230 ? 25 : lastY2 + 20,
      head: [['Tanggal', 'Kategori', 'Keterangan', 'Nominal']],
      body: expenseRows,
      theme: 'grid',
      headStyles: { fillColor: [244, 63, 94] },
      styles: { fontSize: 8 },
      margin: { left: 20, right: 20 }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 200;
    if (finalY > 240) doc.addPage();
    
    const signY = (finalY > 240 ? 40 : finalY + 20);
    doc.setFontSize(10);
    doc.text('Mengetahui,', 30, signY);
    doc.text('Ketua KORWIL 1', 30, signY + 5);
    doc.text('( ........................... )', 30, signY + 30);

    doc.text('Dibuat oleh,', 140, signY);
    doc.text('Bendahara', 140, signY + 5);
    doc.text('( ........................... )', 140, signY + 30);

    doc.save(`Laporan_Keuangan_SiWarga_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Laporan Kas Lingkungan</h2>
            <p className="text-slate-500 mt-1">Transparansi dana kas untuk seluruh pengurus dan warga.</p>
          </div>
          {isAdmin ? (
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              <Download className="w-5 h-5" />
              Cetak Laporan (PDF A4)
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 rounded-xl border border-slate-100 italic text-xs font-medium">
              <Lock className="w-4 h-4" /> Akses Cetak Hanya untuk Pengurus
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-600 p-6 md:p-8 rounded-[2rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
            <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="font-bold text-blue-100 text-xs uppercase tracking-widest">Saldo Kas KORWIL 1</span>
            </div>
            <p className="text-2xl md:text-3xl font-black">Rp {balance.toLocaleString('id-ID')}</p>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-blue-200 bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10">
              <Info className="w-3 h-3" /> Dana Tersedia Saat Ini
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:border-emerald-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">Total Pemasukan</span>
            </div>
            <p className="text-2xl md:text-3xl font-black text-slate-900">Rp {totalIncome.toLocaleString('id-ID')}</p>
            <p className="text-xs text-emerald-600 font-bold mt-2 uppercase tracking-wider">Iuran & Sumbangan</p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:border-rose-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">Total Pengeluaran</span>
            </div>
            <p className="text-2xl md:text-3xl font-black text-slate-900">Rp {totalExpense.toLocaleString('id-ID')}</p>
            <p className="text-xs text-rose-600 font-bold mt-2 uppercase tracking-wider">Alokasi Dana Keluar</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Catatan Pengeluaran Terbaru</h3>
            <p className="text-xs text-slate-400 font-medium">Data pemakaian dana kas lingkungan</p>
          </div>
          <FileText className="w-6 h-6 text-slate-200" />
        </div>
        <div className="divide-y divide-slate-100">
          {expenses.sort((a,b) => b.date.localeCompare(a.date)).slice(0, 10).map(e => (
            <div key={e.id} className="px-6 md:px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
              <div className="flex items-center gap-5 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors truncate">{e.description}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    {new Date(e.date).toLocaleDateString('id-ID')} • {e.category}
                  </p>
                </div>
              </div>
              <p className="font-black text-rose-600 text-sm whitespace-nowrap ml-4">- Rp {e.amount.toLocaleString('id-ID')}</p>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="p-16 text-center">
              <FileText className="w-12 h-12 text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 text-sm italic">Belum ada catatan pengeluaran bulan ini.</p>
            </div>
          )}
        </div>
        {expenses.length > 0 && (
          <div className="p-6 bg-slate-50 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menampilkan 10 Transaksi Terakhir</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialReport;
