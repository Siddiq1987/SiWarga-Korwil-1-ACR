
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Resident, Payment, Expense, UserRole } from '../types';
import { Users, CreditCard, ArrowUpRight, ArrowDownRight, Wallet, ShieldCheck, KeyRound } from 'lucide-react';

interface DashboardProps {
  residents: Resident[];
  payments: Payment[];
  expenses: Expense[];
  role: UserRole;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Dashboard: React.FC<DashboardProps> = ({ residents, payments, expenses, role }) => {
  const totalIncome = useMemo(() => payments.reduce((acc, p) => acc + p.amount, 0), [payments]);
  const totalExpense = useMemo(() => expenses.reduce((acc, e) => acc + e.amount, 0), [expenses]);
  const balance = totalIncome - totalExpense;
  const isKetua = role === UserRole.KETUA;

  const combinedData = useMemo(() => {
    const data: Record<string, { month: string; income: number; expense: number }> = {};
    
    payments.forEach(p => {
      if (!data[p.month]) data[p.month] = { month: p.month, income: 0, expense: 0 };
      data[p.month].income += p.amount;
    });
    
    expenses.forEach(e => {
      const month = e.date.substring(0, 7);
      if (!data[month]) data[month] = { month, income: 0, expense: 0 };
      data[month].expense += e.amount;
    });

    return Object.values(data).sort((a, b) => a.month.localeCompare(b.month));
  }, [payments, expenses]);

  const typeData = useMemo(() => {
    const data: Record<string, number> = {};
    payments.forEach(p => {
      data[p.type] = (data[p.type] || 0) + p.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name: name.replace('_', ' ').toUpperCase(), value }));
  }, [payments]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Saldo Kas KORWIL 1" 
          value={`Rp ${balance.toLocaleString('id-ID')}`} 
          icon={<Wallet className="w-6 h-6 text-blue-600" />} 
          trend={<span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Aktif</span>}
        />
        <StatCard 
          title="Total Pemasukan" 
          value={`Rp ${totalIncome.toLocaleString('id-ID')}`} 
          icon={<ArrowUpRight className="w-6 h-6 text-emerald-500" />} 
          trend={<span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Iuran</span>}
        />
        <StatCard 
          title="Total Pengeluaran" 
          value={`Rp ${totalExpense.toLocaleString('id-ID')}`} 
          icon={<ArrowDownRight className="w-6 h-6 text-rose-500" />} 
          trend={<span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Keluar</span>}
        />
        <StatCard 
          title="Total Warga" 
          value={residents.length.toString()} 
          icon={<Users className="w-6 h-6 text-indigo-500" />} 
          trend={<span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-bold uppercase tracking-wider">KK</span>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Arus Kas Bulanan</h3>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
               <div className="flex items-center gap-1.5 text-emerald-500"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Masuk</div>
               <div className="flex items-center gap-1.5 text-rose-500"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> Keluar</div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar name="Masuk" dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} barSize={32} />
                <Bar name="Keluar" dataKey="expense" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Distribusi Iuran</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={typeData} 
                    cx="50%" cy="50%" 
                    innerRadius={60} 
                    outerRadius={80} 
                    paddingAngle={8} 
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {typeData.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                    <span className="text-slate-500 font-medium">{t.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">Rp {t.value.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          </div>

          {isKetua && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] shadow-xl shadow-blue-100 text-white relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <ShieldCheck className="w-10 h-10 mb-4 text-blue-200" />
                <h3 className="text-lg font-bold mb-2">Manajemen Akun</h3>
                <p className="text-blue-100 text-xs leading-relaxed mb-6 opacity-80">Anda memiliki akses penuh untuk mengelola kredensial login warga demi keamanan data.</p>
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                   <div className="text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-1">Total Akun</p>
                      <p className="text-xl font-bold">{residents.length}</p>
                   </div>
                   <div className="w-px h-8 bg-white/20"></div>
                   <div className="text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-1">Admin</p>
                      <p className="text-xl font-bold">{residents.filter(r => r.role !== UserRole.WARGA).length}</p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend?: React.ReactNode }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      {trend}
    </div>
    <div className="mt-6">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{value}</p>
    </div>
  </div>
);

export default Dashboard;
