
import React, { useState, useEffect } from 'react';
import { UserRole, Resident, Payment, Expense, Announcement } from './types';
import { INITIAL_RESIDENTS, INITIAL_PAYMENTS, INITIAL_EXPENSES, INITIAL_ANNOUNCEMENTS } from './constants';
import Dashboard from './components/Dashboard';
import ResidentList from './components/ResidentList';
import PaymentList from './components/PaymentList';
import ExpenseList from './components/ExpenseList';
import FinancialReport from './components/FinancialReport';
import AnnouncementList from './components/AnnouncementList';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  LogOut, 
  Menu, 
  X,
  Home,
  ArrowDownCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Coins,
  UserCircle,
  ArrowLeft,
  AlertCircle,
  PenTool,
  Megaphone
} from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Resident | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const savedResidents = localStorage.getItem('siwarga_residents');
    const savedPayments = localStorage.getItem('siwarga_payments');
    const savedExpenses = localStorage.getItem('siwarga_expenses');
    const savedAnnouncements = localStorage.getItem('siwarga_announcements');
    
    if (savedResidents) setResidents(JSON.parse(savedResidents));
    else setResidents(INITIAL_RESIDENTS);

    if (savedPayments) setPayments(JSON.parse(savedPayments));
    else setPayments(INITIAL_PAYMENTS);

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    else setExpenses(INITIAL_EXPENSES);

    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
    else setAnnouncements(INITIAL_ANNOUNCEMENTS);
  }, []);

  useEffect(() => {
    if (residents.length > 0) localStorage.setItem('siwarga_residents', JSON.stringify(residents));
    if (payments.length > 0) localStorage.setItem('siwarga_payments', JSON.stringify(payments));
    if (expenses.length > 0) localStorage.setItem('siwarga_expenses', JSON.stringify(expenses));
    if (announcements.length > 0) localStorage.setItem('siwarga_announcements', JSON.stringify(announcements));
  }, [residents, payments, expenses, announcements]);

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const user = residents.find(r => 
      r.role === selectedRole && 
      r.username === username && 
      r.password === password
    );
    if (user) {
      setCurrentUser(user);
      setActiveTab('dashboard');
      setUsername(''); 
      setPassword(''); 
      setSelectedRole(null);
    } else {
      setLoginError('Username atau password salah.');
    }
  };

  const addResident = (r: Omit<Resident, 'id'>) => {
    const newResident = { ...r, id: Math.random().toString(36).substr(2, 9) };
    setResidents(prev => [...prev, newResident]);
  };

  const updateResident = (updated: Resident) => {
    setResidents(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const deleteResident = (id: string) => {
    setResidents(prev => prev.filter(r => r.id !== id));
  };

  const addPayment = (p: Omit<Payment, 'id' | 'verified' | 'date' | 'residentName'>) => {
    const res = residents.find(r => r.id === p.residentId);
    const newPayment: Payment = {
      ...p,
      id: 'p' + Math.random().toString(36).substr(2, 9),
      residentName: res?.name || 'Unknown',
      date: new Date().toISOString(),
      verified: currentUser?.role !== UserRole.WARGA
    };
    setPayments(prev => [newPayment, ...prev]);
  };

  const verifyPayment = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, verified: true } : p));
  };

  const addExpense = (e: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...e, id: 'e' + Math.random().toString(36).substr(2, 9) };
    setExpenses(prev => [...prev, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addAnnouncement = (a: Omit<Announcement, 'id' | 'date' | 'author'>) => {
    const newA: Announcement = {
      ...a,
      id: 'ann' + Date.now(),
      date: new Date().toISOString(),
      author: currentUser?.name || 'Admin'
    };
    setAnnouncements(prev => [newA, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-6">
              <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-200">
                <Home className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">SiWarga</h1>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 leading-tight">Portal Digital Lingkungan KORWIL 1 AMBAR CIBINONG RESIDENCE</h2>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-md hidden md:block">Data warga lengkap, iuran transparan, dan informasi terpusat dalam satu aplikasi.</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col min-h-[480px]">
            {!selectedRole ? (
              <>
                <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Pilih Akses Menu</h3>
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  <LoginCard onClick={() => setSelectedRole(UserRole.KETUA)} title="Ketua KORWIL" desc="Laporan & Persetujuan" icon={<ShieldCheck className="w-6 h-6" />} color="bg-purple-100 text-purple-600" />
                  <LoginCard onClick={() => setSelectedRole(UserRole.BENDAHARA)} title="Bendahara" desc="Kelola Kas & Iuran" icon={<Coins className="w-6 h-6" />} color="bg-amber-100 text-amber-600" />
                  <LoginCard onClick={() => setSelectedRole(UserRole.SEKRETARIS)} title="Sekretaris" desc="Kelola Warga & Info" icon={<PenTool className="w-6 h-6" />} color="bg-emerald-100 text-emerald-600" />
                  <LoginCard onClick={() => setSelectedRole(UserRole.WARGA)} title="Warga" desc="Lihat Info & Laporan" icon={<UserCircle className="w-6 h-6" />} color="bg-blue-100 text-blue-600" />
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50"><p className="text-slate-400 text-[10px] font-bold text-center tracking-widest uppercase">Managed by Ash Siddiq ST</p></div>
              </>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
                <button onClick={() => setSelectedRole(null)} className="flex items-center gap-2 text-slate-400 mb-6 text-sm font-medium hover:text-slate-600 transition-colors"><ArrowLeft className="w-4 h-4" /> Kembali</button>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-slate-900">Masuk sebagai {selectedRole === UserRole.KETUA ? 'Ketua KORWIL' : selectedRole}</h3>
                </div>
                <form onSubmit={handleCredentialLogin} className="space-y-4 flex-1">
                  {loginError && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2"><AlertCircle className="w-4 h-4" />{loginError}</div>}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Username</label>
                    <input required type="text" placeholder="Username" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={username} onChange={e => setUsername(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Password</label>
                    <input required type="password" placeholder="Password" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                  <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all mt-6 active:scale-95 shadow-blue-100">Masuk ke Portal</button>
                </form>                
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.role !== UserRole.WARGA;
  const menuItems = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'informasi', label: 'Informasi', icon: Megaphone },
    { id: 'warga', label: 'Data Warga', icon: Users },
    { id: 'iuran', label: isAdmin ? 'Pemasukan' : 'Iuran Saya', icon: Wallet },
    ...(isAdmin ? [{ id: 'pengeluaran', label: 'Pengeluaran', icon: ArrowDownCircle }] : []),
    { id: 'laporan', label: 'Laporan Kas', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r sticky top-0 h-screen overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">SiWarga</span>
          </div>
          <nav className="space-y-2">
            {menuItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <item.icon className="w-5 h-5" />{item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8 border-t bg-slate-50/50">
          <button 
            onClick={() => setCurrentUser(null)} 
            className="w-full flex items-center gap-4 px-5 py-4 text-rose-600 font-bold text-sm bg-rose-50 hover:bg-rose-100 rounded-2xl transition-all border border-rose-100"
          >
            <LogOut className="w-5 h-5" /> 
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"><Menu className="w-6 h-6" /></button>
            <span className="text-xl font-bold text-blue-600">SiWarga</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-slate-800">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-5">
             <div className="flex items-center gap-3 pr-2 md:pr-4 border-r border-slate-100">
                <div className="text-right hidden sm:block">
                   <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                   <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{currentUser.role === UserRole.KETUA ? 'KETUA KORWIL' : currentUser.role}</p>
                </div>
                <div className="w-9 h-9 md:w-10 md:h-10 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center font-bold text-slate-600 border border-slate-200/50">
                  {currentUser.name.charAt(0)}
                </div>
             </div>
             <button 
               onClick={() => setCurrentUser(null)}
               className="p-2 md:p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all group flex items-center gap-2"
               title="Keluar"
             >
               <LogOut className="w-5 h-5" />
               <span className="text-xs font-bold hidden md:block">Keluar</span>
             </button>
          </div>
        </header>

        <div className="p-4 md:p-10 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <Dashboard residents={residents} payments={payments} expenses={expenses} role={currentUser.role} />}
          {activeTab === 'informasi' && <AnnouncementList announcements={announcements} onAdd={addAnnouncement} onDelete={deleteAnnouncement} isAdmin={isAdmin} />}
          {activeTab === 'warga' && <ResidentList residents={residents} onAdd={addResident} onUpdate={updateResident} onDelete={deleteResident} currentUser={currentUser} />}
          {activeTab === 'iuran' && <PaymentList payments={payments} residents={residents} onAdd={addPayment} onVerify={verifyPayment} currentUser={currentUser} />}
          {activeTab === 'pengeluaran' && isAdmin && <ExpenseList expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} currentUser={currentUser} />}
          {activeTab === 'laporan' && <FinancialReport payments={payments} expenses={expenses} currentUser={currentUser} />}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 lg:hidden backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsSidebarOpen(false)}>
          <aside className="w-80 bg-white h-full p-8 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-12">
               <span className="text-2xl font-bold text-blue-600">SiWarga</span>
               <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-slate-50 rounded-xl">
                 <X className="w-6 h-6 text-slate-400" />
               </button>
             </div>
             <nav className="space-y-3 flex-1">
               {menuItems.map(item => (
                 <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
                   <item.icon className="w-5 h-5" />{item.label}
                 </button>
               ))}
             </nav>
             <button 
              onClick={() => { setCurrentUser(null); setIsSidebarOpen(false); }} 
              className="mt-auto w-full flex items-center gap-4 px-5 py-4 text-rose-600 font-bold text-sm bg-rose-50 border border-rose-100 rounded-2xl"
             >
              <LogOut className="w-5 h-5" /> Keluar Sistem
             </button>
          </aside>
        </div>
      )}
    </div>
  );
};

const LoginCard = ({ onClick, title, desc, icon, color }: any) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 md:gap-5 p-4 bg-white border border-slate-100 rounded-2xl md:rounded-3xl hover:border-blue-500 hover:shadow-xl hover:shadow-slate-100 transition-all group">
    <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl flex-shrink-0 ${color}`}>{icon}</div>
    <div className="text-left flex-1 min-w-0">
      <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">{title}</p>
      <p className="text-[10px] text-slate-400 font-medium truncate">{desc}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
  </button>
);

export default App;
