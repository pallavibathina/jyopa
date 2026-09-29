import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  MapPin,
  X,
  Compass,
  Layers,
  BookOpen,
  ArrowRight,
  Share2,
  Check,
  Navigation,
  Info,
  Maximize2
} from 'lucide-react';

export const LocationVisualizerModal: React.FC = () => {
  const { locationModalBook, closeLocationFinder, openBookDetail, showToast } = useLibrary();
  const [activeView, setActiveView] = useState<'blueprint' | 'rack' | 'shelf' | 'steps'>('blueprint');
  const [copied, setCopied] = useState(false);

  if (!locationModalBook) return null;

  const loc = locationModalBook.location;
  const rackNum = loc.rackNumber || 'R-05';
  const shelfNum = loc.shelfNumber || 'S-03';
  const posIndex = loc.positionIndex || 4;
  const totalBooks = loc.totalBooksOnShelf || 16;

  // Racks in the room grid
  const sampleRacks = [
    { id: 'R-01', name: 'R-01: Mathematics & Calc', aisle: 'Aisle 1' },
    { id: 'R-02', name: 'R-02: Algorithms & Theory', aisle: 'Aisle 1' },
    { id: 'R-03', name: 'R-03: Systems Programming', aisle: 'Aisle 2' },
    { id: 'R-04', name: 'R-04: Network Protocols', aisle: 'Aisle 2' },
    { id: 'R-05', name: 'R-05: Databases & Storage', aisle: 'Aisle 3' },
    { id: 'R-06', name: 'R-06: Web Tech & Cloud', aisle: 'Aisle 3' },
    { id: 'R-07', name: 'R-07: Hardware & Microarch', aisle: 'Aisle 4' },
    { id: 'R-08', name: 'R-08: VLSI & Circuits', aisle: 'Aisle 4' },
    { id: 'R-09', name: 'R-09: Robotics & Mechatronics', aisle: 'Aisle 5' },
    { id: 'R-10', name: 'R-10: Cyber & Security', aisle: 'Aisle 5' },
    { id: 'R-11', name: 'R-11: Data Science & AI', aisle: 'Aisle 6' },
    { id: 'R-12', name: 'R-12: Deep Learning & Vision', aisle: 'Aisle 6' }
  ];

  const shelvesList = [
    { id: 'S-01', label: 'Top Tier (S-01)', height: '185 cm', count: '14 Books' },
    { id: 'S-02', label: 'Upper Tier (S-02)', height: '160 cm', count: '15 Books' },
    { id: 'S-03', label: 'Eye Level (S-03)', height: '135 cm', count: `${totalBooks} Books (Target)` },
    { id: 'S-04', label: 'Lower Tier (S-04)', height: '100 cm', count: '18 Books' },
    { id: 'S-05', label: 'Base Tier (S-05)', height: '65 cm', count: '12 Books' }
  ];

  const handleCopyLocation = () => {
    const text = `Library Location Ticket:\nBook: ${locationModalBook.title}\nBlock: ${loc.block}\nFloor: ${loc.floor}\nRoom: ${loc.room}\nRack: ${loc.rackNumber}\nShelf: ${loc.shelfNumber}\nPosition: ${loc.position}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    showToast('Location coordinates copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-400">
              <MapPin className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-blue-300 font-medium">
                <span>Exact Physical Location Finder</span>
                <span>·</span>
                <span className="text-slate-400">Library GPS</span>
              </div>
              <h2 className="text-lg font-bold truncate text-white tracking-tight font-display">
                {locationModalBook.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLocation}
              title="Copy location ticket"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={closeLocationFinder}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Location Breadcrumb Badges Summary */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 flex-wrap font-medium">
            <span className="text-slate-900 font-semibold">{loc.block.length > 2 ? loc.block : `Block ${loc.block}`}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-semibold">{loc.floor}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-semibold">{loc.room}</span>
            <span className="text-slate-400">/</span>
            <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Rack {loc.rackNumber}
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Shelf {loc.shelfNumber}
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {loc.position}
            </span>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Walk time: ~1 min (45m from Entrance)</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="px-5 pt-3 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-medium">
            <button
              onClick={() => setActiveView('blueprint')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeView === 'blueprint'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>1. Floor Plan & Rack Map</span>
            </button>

            <button
              onClick={() => setActiveView('rack')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeView === 'rack'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2. Rack Elevation ({loc.rackNumber})</span>
            </button>

            <button
              onClick={() => setActiveView('shelf')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeView === 'shelf'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>3. Exact Shelf Row ({loc.shelfNumber})</span>
            </button>

            <button
              onClick={() => setActiveView('steps')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeView === 'steps'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>4. Walking Directions</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* VIEW 1: 2D ARCHITECTURAL FLOORPLAN */}
          {activeView === 'blueprint' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-800">
                  {loc.floor} Architectural Layout — {loc.room}
                </span>
                <span className="text-blue-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  Target Rack: {loc.rackNumber}
                </span>
              </div>

              {/* Interactive Floorplan Canvas */}
              <div className="relative w-full bg-slate-900 rounded-xl p-4 sm:p-6 text-white border border-slate-800 shadow-inner overflow-hidden">
                {/* Blueprint grid background */}
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                {/* Compass Marker */}
                <div className="absolute top-3 right-3 text-[10px] text-slate-400 font-mono flex flex-col items-center bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
                  <span className="font-bold text-blue-400">N</span>
                  <span>▲</span>
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Top: Study Cabins & Windows */}
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                      [North Windows & Quiet Study Zone]
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Wi-Fi 6 Zone
                    </div>
                  </div>

                  {/* Main Rack Grid Matrix */}
                  <div>
                    <div className="text-xs text-slate-400 mb-2 font-mono flex justify-between">
                      <span>RACK AISLES (AISLE 1 → AISLE 6)</span>
                      <span className="text-blue-300">Click any rack to inspect</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {sampleRacks.map(rack => {
                        const isTarget = rack.id === rackNum;
                        return (
                          <div
                            key={rack.id}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                              isTarget
                                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/30 ring-2 ring-blue-300 ring-offset-2 ring-offset-slate-900 scale-105'
                                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-bold font-mono ${isTarget ? 'text-white' : 'text-slate-200'}`}>
                                {rack.id}
                              </span>
                              {isTarget && (
                                <span className="bg-amber-400 text-slate-950 font-extrabold text-[9px] px-1 py-0.2 rounded font-mono uppercase tracking-wider">
                                  HERE
                                </span>
                              )}
                            </div>
                            <div className={`text-[10px] leading-tight truncate ${isTarget ? 'text-blue-100 font-medium' : 'text-slate-400'}`}>
                              {rack.name.split(':')[1]?.trim() || rack.name}
                            </div>
                            <div className="text-[9px] text-slate-400/80 font-mono mt-1">
                              {rack.aisle}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Walking Route Visualization */}
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/60 rounded font-mono text-[10px]">
                        MAIN ENTRANCE
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <ArrowRight className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                        <span>Central Corridor</span>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                        <span className="text-white font-semibold">Turn Right into Aisle 3</span>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                        <span className="text-blue-400 font-bold">Rack {rackNum}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveView('rack')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors flex items-center gap-1 shrink-0"
                    >
                      <span>View Shelf Elevation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom: Librarian Help Desk & Self-Checkout */}
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                    <div>Librarian Assistance Desk & RFID Scanner Station</div>
                    <div>Floor Capacity: 450 Students</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: MULTI-TIER RACK ELEVATION */}
          {activeView === 'rack' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-800">
                  Rack {rackNum} Frontal Shelving Unit ({loc.room})
                </span>
                <span className="text-slate-500">
                  Total Capacity: 5 Tiers · ~80 Books
                </span>
              </div>

              {/* Physical Shelving Unit Graphic */}
              <div className="bg-slate-100 p-4 sm:p-6 rounded-xl border border-slate-300">
                <div className="max-w-xl mx-auto bg-amber-950/10 p-3 rounded-lg border-4 border-slate-700 bg-slate-800 text-white shadow-xl">
                  {/* Rack Header Plate */}
                  <div className="bg-slate-900 text-center py-2 border-b-2 border-slate-700 font-mono text-sm tracking-wider font-bold text-blue-400 flex items-center justify-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>RACK {rackNum} · COMPUTER SYSTEMS & DATABASES</span>
                  </div>

                  {/* 5 Shelves Elevation */}
                  <div className="divide-y-4 divide-slate-700 bg-slate-900/90">
                    {shelvesList.map(shelf => {
                      const isTargetShelf = shelf.id === shelfNum;
                      return (
                        <div
                          key={shelf.id}
                          className={`p-3 transition-all relative ${
                            isTargetShelf
                              ? 'bg-blue-950/70 border-l-4 border-l-amber-400 ring-2 ring-blue-500 shadow-inner'
                              : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold font-mono ${isTargetShelf ? 'text-amber-400' : 'text-slate-300'}`}>
                                {shelf.id}
                              </span>
                              <span className="text-xs text-slate-300">{shelf.label}</span>
                              {isTargetShelf && (
                                <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.5 rounded font-bold font-mono">
                                  YOUR BOOK IS HERE
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Height: {shelf.height}
                            </div>
                          </div>

                          {/* Simulated mini books representation on this shelf */}
                          <div className="h-10 bg-slate-950/60 rounded p-1 flex items-end gap-1 overflow-hidden border border-slate-800">
                            {Array.from({ length: 14 }).map((_, i) => {
                              const isTargetBook = isTargetShelf && i + 1 === posIndex;
                              const heightClass = i % 3 === 0 ? 'h-8' : i % 2 === 0 ? 'h-7' : 'h-6';
                              return (
                                <div
                                  key={i}
                                  className={`rounded-xs transition-transform ${
                                    isTargetBook
                                      ? 'w-4 h-9 bg-amber-400 border border-white shadow-md shadow-amber-400/50 scale-110 z-10'
                                      : isTargetShelf
                                      ? 'w-3 ' + heightClass + ' bg-blue-500/40 border border-blue-400/30'
                                      : 'w-3 ' + heightClass + ' bg-slate-700/60'
                                  }`}
                                  title={isTargetBook ? `Target: ${locationModalBook.title}` : `Book #${i + 1}`}
                                />
                              );
                            })}
                          </div>

                          {isTargetShelf && (
                            <div className="mt-2 flex items-center justify-between text-xs text-blue-200">
                              <span>Position on shelf: <strong>{loc.position}</strong></span>
                              <button
                                onClick={() => setActiveView('shelf')}
                                className="text-amber-400 hover:text-amber-300 font-semibold underline flex items-center gap-1"
                              >
                                <span>Inspect Shelf Books</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Rack Base Footer */}
                  <div className="bg-slate-900 py-1.5 px-3 border-t-2 border-slate-700 text-[10px] text-slate-400 font-mono flex justify-between">
                    <span>Floor Level Base Support</span>
                    <span>Load Limit: 300kg</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: EXACT SHELF ROW & BOOK SPINES */}
          {activeView === 'shelf' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-800">
                  Shelf {shelfNum} Spines Row (Eye-Level View)
                </span>
                <span className="text-blue-700 font-semibold">
                  Counting from Left to Right
                </span>
              </div>

              {/* Detailed Shelf Books View */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl overflow-x-auto text-white">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Left Edge</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="bg-blue-900/60 text-blue-200 px-3 py-1 rounded text-xs border border-blue-700 font-mono">
                    Target: #{posIndex} — {locationModalBook.title}
                  </div>
                  <div className="text-slate-400">Right Edge</div>
                </div>

                {/* Visual Shelf Surface with Spines */}
                <div className="relative pt-12 pb-4">
                  
                  {/* Floating Marker Pointer directly over target book */}
                  <div 
                    className="absolute top-0 transition-all flex flex-col items-center z-20 pointer-events-none"
                    style={{ left: `calc(${(posIndex - 0.5) * 44}px + 12px)` }}
                  >
                    <div className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded shadow-lg text-[10px] whitespace-nowrap animate-bounce font-mono">
                      📍 #{posIndex} THIS BOOK
                    </div>
                    <div className="w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-amber-400" />
                  </div>

                  {/* Horizontal Spines Container */}
                  <div className="flex items-end gap-1.5 px-3 border-b-8 border-amber-900/80 bg-slate-950/70 pt-4 pb-0 rounded-t-lg min-w-max">
                    {Array.from({ length: totalBooks }).map((_, i) => {
                      const bookIndex = i + 1;
                      const isTarget = bookIndex === posIndex;
                      const height = isTarget ? 130 : 100 + ((i * 13) % 25);
                      const width = isTarget ? 48 : 34 + ((i * 7) % 12);

                      return (
                        <div
                          key={bookIndex}
                          style={{ height: `${height}px`, width: `${width}px` }}
                          className={`relative flex flex-col justify-between p-1.5 rounded-t cursor-pointer transition-all ${
                            isTarget
                              ? 'bg-blue-600 text-white border-2 border-amber-400 shadow-xl shadow-blue-500/40 -translate-y-2 z-10'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                          }`}
                          onClick={() => {
                            if (isTarget) {
                              openBookDetail(locationModalBook);
                            }
                          }}
                        >
                          {/* Number badge on spine top */}
                          <div className={`text-[9px] font-mono font-bold text-center ${isTarget ? 'text-amber-300' : 'text-slate-500'}`}>
                            #{bookIndex}
                          </div>

                          {/* Spine text */}
                          <div className="my-auto overflow-hidden text-center">
                            <span 
                              className={`block text-[10px] font-medium leading-none truncate ${
                                isTarget ? 'text-white font-bold' : 'text-slate-400'
                              }`}
                              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                            >
                              {isTarget ? locationModalBook.title : `Call 00${bookIndex}.Ref`}
                            </span>
                          </div>

                          {/* Call Number / Spine Label at bottom */}
                          <div className={`text-[8px] font-mono text-center rounded px-0.5 ${
                            isTarget ? 'bg-white text-slate-900 font-bold' : 'bg-slate-900/80 text-slate-400'
                          }`}>
                            {isTarget ? 'QA76' : '004'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shelf wooden bar */}
                  <div className="h-4 bg-amber-950 border-t border-amber-700/60 rounded-b shadow-md flex items-center justify-between px-4 text-[9px] text-amber-200 font-mono">
                    <span>SHELF {shelfNum} · FRONT RAIL</span>
                    <span>AISLE 3 FACING</span>
                  </div>
                </div>

                {/* Target Book Details Card */}
                <div className="mt-4 p-4 bg-slate-800/80 rounded-lg border border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-22 bg-slate-950 rounded shrink-0 overflow-hidden border border-slate-700 shadow-md">
                    <img
                      src={locationModalBook.coverImage}
                      alt={locationModalBook.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="text-xs text-amber-400 font-semibold mb-0.5">
                      Selected Target Book
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      {locationModalBook.title}
                    </h3>
                    <p className="text-xs text-slate-300 mb-2">
                      by {locationModalBook.author}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap justify-center sm:justify-start">
                      <span>ISBN: <strong className="text-slate-200">{locationModalBook.isbn}</strong></span>
                      <span>·</span>
                      <span>Shelf Position: <strong className="text-amber-300">{loc.position}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => openBookDetail(locationModalBook)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-sm"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: TURN-BY-TURN WALKING DIRECTIONS */}
          {activeView === 'steps' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 font-semibold">
                Turn-by-Turn Guidance to Rack {rackNum}, Shelf {shelfNum}
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: '01',
                    title: `Enter ${loc.block.length > 2 ? loc.block : `Block ${loc.block}`} Main Entrance`,
                    desc: 'Swipe your student RFID card or scan QR at the primary turnstile gates in the Ground Floor lobby.',
                    detail: 'Lobby Security Desk & Directory Board'
                  },
                  {
                    step: '02',
                    title: `Ascend to ${loc.floor}`,
                    desc: 'Take the central glass elevators or the North stairwell directly up to the 2nd Floor.',
                    detail: 'Estimated transit: 30 seconds'
                  },
                  {
                    step: '03',
                    title: `Enter "${loc.room}"`,
                    desc: 'Push through the double acoustic glass doors marked "Digital Library & Computer Science Wing".',
                    detail: 'Adjacent to quiet study cubicles'
                  },
                  {
                    step: '04',
                    title: `Walk down ${loc.aisle || 'Aisle 3'} to Rack ${rackNum}`,
                    desc: 'Proceed along the main blue carpeted runner. Rack ' + rackNum + ' is prominently labelled overhead on the right side.',
                    detail: 'Classification sign: 004–006 Computers & Databases'
                  },
                  {
                    step: '05',
                    title: `Locate Shelf ${shelfNum} and pick Book ${loc.position}`,
                    desc: `Shelf ${shelfNum} is at eye level (~135cm height). Count from the left edge of the shelf to the ${posIndex}th book spine.`,
                    detail: `Spine Call Tag matches ISBN: ${locationModalBook.isbn}`
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-blue-100">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{item.detail}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs text-slate-600">
            Need physical help? Ask at <strong>Counter 2 (Digital Desk)</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLocation}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {copied ? 'Copied Details' : 'Copy Coordinates'}
            </button>
            <button
              onClick={closeLocationFinder}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Close Locator
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
