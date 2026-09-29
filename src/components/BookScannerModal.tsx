import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  QrCode,
  X,
  Camera,
  MapPin,
  Sparkles,
  CheckCircle2,
  Scan,
  RotateCw,
  Search
} from 'lucide-react';

export const BookScannerModal: React.FC = () => {
  const {
    isScannerOpen,
    setScannerOpen,
    books,
    openBookDetail,
    openLocationFinder,
    showToast
  } = useLibrary();

  const [simulatedScanning, setSimulatedScanning] = useState(false);
  const [scannedBookId, setScannedBookId] = useState<string | null>(null);

  if (!isScannerOpen) return null;

  const handleSimulateScan = (bookId: string) => {
    setSimulatedScanning(true);
    setScannedBookId(null);

    setTimeout(() => {
      setSimulatedScanning(false);
      setScannedBookId(bookId);
      const book = books.find(b => b.id === bookId);
      if (book) {
        showToast(`QR Decoded: ${book.title}`, 'success');
      }
    }, 1100);
  };

  const scannedBook = books.find(b => b.id === scannedBookId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 text-white overflow-hidden flex flex-col my-auto">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm tracking-tight text-white font-display">
              Scan Book RFID / QR Barcode
            </h3>
          </div>
          <button
            onClick={() => {
              setScannerOpen(false);
              setScannedBookId(null);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="p-6 flex flex-col items-center">
          
          <div className="relative w-64 h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
            
            {/* Viewfinder Target Box with Corner Markers */}
            <div className="relative w-48 h-48 border-2 border-dashed border-blue-500/50 rounded-xl flex items-center justify-center">
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400 -mt-0.5 -ml-0.5" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400 -mt-0.5 -mr-0.5" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400 -mb-0.5 -ml-0.5" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400 -mb-0.5 -mr-0.5" />

              {/* Scanning red laser line */}
              {simulatedScanning && (
                <div className="absolute inset-x-0 h-0.5 bg-rose-500 shadow-md shadow-rose-500/80 animate-bounce" />
              )}

              <div className="text-center p-4">
                <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-[11px] text-slate-400 leading-tight">
                  {simulatedScanning ? 'Analyzing QR code...' : 'Point camera at book spine barcode or shelf QR tag'}
                </p>
              </div>
            </div>

            {/* Live scanning indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/90 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>OPTICAL SENSOR ACTIVE</span>
            </div>
          </div>

          {/* Quick Demo Tag Barcode Triggers */}
          <div className="mt-5 w-full space-y-2">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Test Simulated Library Tags:</span>
              <span className="text-[10px] text-blue-400">Click to scan instantly</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSimulateScan('book-001')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 transition-colors text-xs"
              >
                <div className="font-bold text-white truncate">Database Systems</div>
                <div className="text-[10px] text-slate-400 font-mono">Tag: QA76.9-DBMS-001</div>
              </button>

              <button
                onClick={() => handleSimulateScan('book-002')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 transition-colors text-xs"
              >
                <div className="font-bold text-white truncate">Modern Algorithms</div>
                <div className="text-[10px] text-slate-400 font-mono">Tag: MIT-ALGO-002</div>
              </button>

              <button
                onClick={() => handleSimulateScan('book-003')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 transition-colors text-xs"
              >
                <div className="font-bold text-white truncate">Artificial Intelligence</div>
                <div className="text-[10px] text-slate-400 font-mono">Tag: AI-NORVIG-003</div>
              </button>

              <button
                onClick={() => handleSimulateScan('book-004')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 transition-colors text-xs"
              >
                <div className="font-bold text-white truncate">Digital Microprocessors</div>
                <div className="text-[10px] text-slate-400 font-mono">Tag: EE-MANO-004</div>
              </button>
            </div>
          </div>

          {/* Decoded Scanned Book Card */}
          {scannedBook && (
            <div className="mt-5 w-full bg-slate-800/90 rounded-2xl p-4 border border-blue-500/40 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Book Recognized in Library Database!</span>
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-14 h-18 rounded bg-slate-900 overflow-hidden shrink-0 border border-slate-700">
                  <img
                    src={scannedBook.coverImage}
                    alt={scannedBook.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white text-sm truncate">{scannedBook.title}</h4>
                  <p className="text-xs text-slate-300 truncate">by {scannedBook.author}</p>
                  <div className="text-xs text-blue-300 font-mono mt-1">
                    Location: {scannedBook.location.rackNumber} · {scannedBook.location.shelfNumber} ({scannedBook.location.position})
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setScannerOpen(false);
                    openBookDetail(scannedBook);
                  }}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  View Details
                </button>

                <button
                  onClick={() => {
                    setScannerOpen(false);
                    openLocationFinder(scannedBook);
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>📍 Locate Shelf</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Compatible with ISO/IEC 18000-6C RFID tags</span>
          <button
            onClick={() => {
              setScannerOpen(false);
              setScannedBookId(null);
            }}
            className="text-slate-300 hover:text-white"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
