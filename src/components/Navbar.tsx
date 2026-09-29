import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  QrCode,
  ShieldCheck,
  User,
  Search,
  BookMarked,
  LayoutDashboard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeNavTab,
    setActiveNavTab,
    userRole,
    setUserRole,
    currentStudent,
    setScannerOpen,
    borrowRecords
  } = useLibrary();

  // Active student borrowings
  const activeBorrows = borrowRecords.filter(
    b => b.studentId === currentStudent.id && b.status === 'active'
  ).length;

  const hasOverdue = borrowRecords.some(
    b => b.studentId === currentStudent.id && b.status === 'overdue'
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element brand wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveNavTab('dashboard')}
            className="text-xl font-bold tracking-tight text-slate-900 font-display hover:text-blue-700 transition-colors flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              LF
            </div>
            <span>LibreFind</span>
          </button>
          
          <span className="hidden sm:inline-block text-slate-300 font-light">|</span>
          <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
            Smart Digital Library
          </span>
        </div>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveNavTab('dashboard')}
            className={`transition-colors relative py-1 ${
              activeNavTab === 'dashboard'
                ? 'text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard
            {activeNavTab === 'dashboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveNavTab('search')}
            className={`transition-colors relative py-1 ${
              activeNavTab === 'search'
                ? 'text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Smart Search
            {activeNavTab === 'search' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setScannerOpen(true)}
            className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-blue-600" />
            <span>Scan Book QR</span>
          </button>

          <button
            onClick={() => setActiveNavTab('account')}
            className={`transition-colors relative py-1 flex items-center gap-1.5 ${
              activeNavTab === 'account'
                ? 'text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Library</span>
            {activeBorrows > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                hasOverdue ? 'bg-rose-500 text-white animate-pulse' : 'bg-blue-100 text-blue-800'
              }`}>
                {activeBorrows}
              </span>
            )}
            {activeNavTab === 'account' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700 rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setUserRole('admin');
              setActiveNavTab('admin');
            }}
            className={`transition-colors relative py-1 flex items-center gap-1 ${
              activeNavTab === 'admin'
                ? 'text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Librarian Admin</span>
            {activeNavTab === 'admin' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Quick QR Trigger for mobile & desktop */}
          <button
            onClick={() => setScannerOpen(true)}
            className="p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
            title="Scan Book QR / Barcode"
          >
            <QrCode className="w-5 h-5" />
          </button>

          {/* Role Mode Segmented Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              onClick={() => {
                setUserRole('student');
                if (activeNavTab === 'admin') setActiveNavTab('dashboard');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                userRole === 'student'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Student</span>
            </button>

            <button
              onClick={() => {
                setUserRole('admin');
                setActiveNavTab('admin');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                userRole === 'admin'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Librarian</span>
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar for seamless thumb ergonomics */}
      <div className="md:hidden border-t border-slate-200 bg-white/95 px-3 py-1 flex items-center justify-around text-xs">
        <button
          onClick={() => setActiveNavTab('dashboard')}
          className={`py-2 px-2.5 flex flex-col items-center gap-1 ${
            activeNavTab === 'dashboard' ? 'text-blue-700 font-semibold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveNavTab('search')}
          className={`py-2 px-2.5 flex flex-col items-center gap-1 ${
            activeNavTab === 'search' ? 'text-blue-700 font-semibold' : 'text-slate-500'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px]">Search</span>
        </button>

        <button
          onClick={() => setScannerOpen(true)}
          className="py-1 px-3 -mt-3 rounded-full bg-blue-600 text-white shadow-md flex flex-col items-center justify-center gap-0.5"
        >
          <QrCode className="w-4 h-4" />
          <span className="text-[9px] font-bold">SCAN</span>
        </button>

        <button
          onClick={() => setActiveNavTab('account')}
          className={`py-2 px-2.5 flex flex-col items-center gap-1 relative ${
            activeNavTab === 'account' ? 'text-blue-700 font-semibold' : 'text-slate-500'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span className="text-[10px]">My Books</span>
          {activeBorrows > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-blue-600" />
          )}
        </button>

        <button
          onClick={() => {
            setUserRole('admin');
            setActiveNavTab('admin');
          }}
          className={`py-2 px-2.5 flex flex-col items-center gap-1 ${
            activeNavTab === 'admin' ? 'text-blue-700 font-semibold' : 'text-slate-500'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px]">Admin</span>
        </button>
      </div>
    </header>
  );
};
