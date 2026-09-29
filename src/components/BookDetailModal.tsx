import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  X,
  MapPin,
  Bookmark,
  Calendar,
  Building2,
  BookCopy,
  Hash,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Sparkles
} from 'lucide-react';

export const BookDetailModal: React.FC = () => {
  const {
    selectedBook,
    closeBookDetail,
    openLocationFinder,
    favorites,
    toggleFavorite,
    reserveBook,
    calculateBookStatus,
    setContactModalOpen
  } = useLibrary();

  if (!selectedBook) return null;

  const status = calculateBookStatus(selectedBook);
  const availableCopies = selectedBook.totalCopies - selectedBook.issuedCopies;
  const isFav = favorites.includes(selectedBook.id);

  const getStatusDisplay = () => {
    switch (status) {
      case 'available':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          label: 'Available on Shelf',
          desc: `${availableCopies} copies ready for immediate checkout`,
          colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        };
      case 'limited':
        return {
          icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
          label: 'Limited Copies Available',
          desc: `Only ${availableCopies} copy remaining on shelf`,
          colorClass: 'text-amber-700 bg-amber-50 border-amber-200'
        };
      case 'issued':
        return {
          icon: <Clock className="w-4 h-4 text-rose-600" />,
          label: 'Currently Issued to Students',
          desc: `All ${selectedBook.totalCopies} copies currently checked out. Return expected: ${selectedBook.expectedReturnDate || 'Next Monday'}`,
          colorClass: 'text-rose-700 bg-rose-50 border-rose-200'
        };
      case 'reserved':
        return {
          icon: <Clock className="w-4 h-4 text-blue-600" />,
          label: 'Reserved on Hold',
          desc: `${selectedBook.reservationCount} active student reservations in queue`,
          colorClass: 'text-blue-700 bg-blue-50 border-blue-200'
        };
    }
  };

  const statusInfo = getStatusDisplay();
  const loc = selectedBook.location;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Book Catalog</span>
            <span>·</span>
            <span>{selectedBook.department}</span>
            <span>·</span>
            <span>{selectedBook.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(selectedBook.id)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
                isFav
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
              title={isFav ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Bookmark className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{isFav ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={closeBookDetail}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Book Cover Visual */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative w-44 sm:w-48 aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
                <img
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-amber-400 text-xs px-2 py-0.5 rounded font-bold font-mono">
                  ★ {selectedBook.rating.toFixed(1)}
                </div>
              </div>

              <div className="mt-3 text-center text-xs text-slate-500 font-mono">
                Borrowed {selectedBook.borrowCount} times this term
              </div>
            </div>

            {/* Book Primary Info */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug font-display">
                  {selectedBook.title}
                </h1>
                <p className="text-sm font-medium text-slate-700 mt-1">
                  by <span className="text-blue-600 font-semibold">{selectedBook.author}</span>
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
                  <span>Edition: <strong className="text-slate-800">{selectedBook.edition}</strong></span>
                  <span>·</span>
                  <span>Published: <strong className="text-slate-800">{selectedBook.publicationYear}</strong></span>
                  <span>·</span>
                  <span>Publisher: <strong className="text-slate-800">{selectedBook.publisher}</strong></span>
                </div>
              </div>

              {/* Status Box */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${statusInfo.colorClass}`}>
                <div className="mt-0.5 shrink-0">{statusInfo.icon}</div>
                <div className="text-xs">
                  <div className="font-bold text-sm leading-none mb-1">{statusInfo.label}</div>
                  <p className="text-slate-700">{statusInfo.desc}</p>
                </div>
              </div>

              {/* Inventory Breakdown */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                    {selectedBook.totalCopies}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                    Total Copies
                  </div>
                </div>
                <div className="border-x border-slate-200">
                  <div className="text-lg font-bold text-emerald-600 font-mono tabular-nums">
                    {availableCopies}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                    Available
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-600 font-mono tabular-nums">
                    {selectedBook.issuedCopies}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                    Issued
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Overview
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedBook.description}
                </p>
              </div>

              {/* Keywords / Tags (Unboxed text with dots) */}
              {selectedBook.keywords && selectedBook.keywords.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Related Topics
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 flex-wrap">
                    {selectedBook.keywords.map((kw, i) => (
                      <React.Fragment key={i}>
                        <span className="hover:text-blue-600 transition-colors">#{kw}</span>
                        {i < selectedBook.keywords.length - 1 && <span className="text-slate-300">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* EXACT PHYSICAL LOCATION CARD (Prominent Highlight) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-xl p-5 border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
                  <MapPin className="w-4 h-4 animate-bounce" />
                  <span>EXACT PHYSICAL LOCATION IN LIBRARY</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs mt-2">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Building Block</span>
                    <span className="font-bold text-white text-sm">Block {loc.block}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Floor Level</span>
                    <span className="font-bold text-white text-sm">{loc.floor}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Room / Section</span>
                    <span className="font-bold text-white text-sm">{loc.room}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Rack Number</span>
                    <span className="font-bold text-blue-300 text-sm font-mono">{loc.rackNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Shelf Tier</span>
                    <span className="font-bold text-blue-300 text-sm font-mono">{loc.shelfNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Exact Position</span>
                    <span className="font-bold text-amber-300 text-sm">{loc.position}</span>
                  </div>
                </div>
              </div>

              {/* Big "📍 FIND MY BOOK" Button */}
              <button
                onClick={() => {
                  closeBookDetail();
                  openLocationFinder(selectedBook);
                }}
                className="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 shrink-0 group active:scale-95"
              >
                <MapPin className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span className="tracking-wide">📍 FIND MY BOOK</span>
              </button>
            </div>
          </div>

          {/* Technical Metadata Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-bold text-slate-700">
              Bibliographic Specifications
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-white">
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">ISBN-13</span>
                  <span className="font-mono font-medium text-slate-900">{selectedBook.isbn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Classification Call</span>
                  <span className="font-mono font-medium text-slate-900">QA76.9.{selectedBook.isbn.slice(-4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Language</span>
                  <span className="text-slate-900">English</span>
                </div>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department</span>
                  <span className="text-slate-900 text-right">{selectedBook.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subject Category</span>
                  <span className="text-slate-900">{selectedBook.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Catalog Entry Date</span>
                  <span className="text-slate-900 font-mono">{selectedBook.addedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => {
              setContactModalOpen(true);
            }}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>Ask Librarian About This Book</span>
          </button>

          <div className="flex items-center gap-2">
            {availableCopies <= 0 && (
              <button
                onClick={() => reserveBook(selectedBook.id)}
                className="px-4 py-2.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition-colors shadow-xs"
              >
                Join Waiting List / Reserve
              </button>
            )}

            <button
              onClick={() => {
                closeBookDetail();
                openLocationFinder(selectedBook);
              }}
              className="px-4 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4" />
              <span>📍 Find on Shelf</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
