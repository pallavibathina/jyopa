import React from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { BookSearch } from './components/BookSearch';
import { StudentAccount } from './components/StudentAccount';
import { AdminDashboard } from './components/AdminDashboard';
import { LocationVisualizerModal } from './components/LocationVisualizerModal';
import { BookDetailModal } from './components/BookDetailModal';
import { BookScannerModal } from './components/BookScannerModal';
import { ContactLibrarianModal } from './components/ContactLibrarianModal';
import { AddEditBookModal } from './components/AddEditBookModal';
import {
  MapPin,
  Clock,
  BookOpen,
  Phone,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeNavTab, toasts, userRole, setActiveNavTab } = useLibrary();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* 3-Zone Navigation Header */}
      <Navbar />

      {/* Main Body Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20 md:pb-12">
        {activeNavTab === 'dashboard' && <StudentDashboard />}
        {activeNavTab === 'search' && <BookSearch />}
        {activeNavTab === 'account' && <StudentAccount />}
        {activeNavTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals & Overlay Portals */}
      <LocationVisualizerModal />
      <BookDetailModal />
      <BookScannerModal />
      <ContactLibrarianModal />
      <AddEditBookModal />

      {/* Floating Toast Notifications */}
      <div className="fixed bottom-20 md:bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
                : toast.type === 'error'
                ? 'bg-rose-950 text-rose-100 border-rose-800'
                : 'bg-slate-900 text-slate-100 border-slate-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Quiet University Library Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-display">LibreFind Digital Library</span>
            <span>·</span>
            <span>University Central Library Wing</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 flex-wrap justify-center">
            <span>Hours: Mon–Sat 08:00 – 22:00</span>
            <span>·</span>
            <span>Block A, B & C Connected</span>
            <span>·</span>
            <button
              onClick={() => setActiveNavTab('search')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse Catalog
            </button>
          </div>

          <div className="text-slate-400 text-[11px] font-mono">
            RFID Locator Engine · Exact Shelf GPS
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <AppContent />
    </LibraryProvider>
  );
}
