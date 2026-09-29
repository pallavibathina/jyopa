import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types/library';
import {
  Search,
  BookOpen,
  MapPin,
  CheckCircle,
  TrendingUp,
  Bookmark,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Users,
  Compass,
  QrCode
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    books,
    openBookDetail,
    openLocationFinder,
    favorites,
    toggleFavorite,
    setActiveNavTab,
    setSearchQuery,
    setSelectedDepartment,
    setScannerOpen,
    currentStudent,
    borrowRecords,
    calculateBookStatus
  } = useLibrary();

  const [inputVal, setInputVal] = useState('');

  // Calculations
  const totalBooksCount = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const totalIssuedCount = books.reduce((acc, b) => acc + b.issuedCopies, 0);
  const availableCopies = totalBooksCount - totalIssuedCount;
  const uniqueAuthors = new Set(books.map(b => b.author)).size;
  const uniqueCategories = new Set(books.map(b => b.category)).size;

  // Student active borrows
  const myActiveBorrows = borrowRecords.filter(
    b => b.studentId === currentStudent.id && b.status === 'active'
  );

  // Popular and Recommended
  const popularBooks = [...books].sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 4);
  const recentlyAdded = [...books].sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()).slice(0, 4);
  const recommendedBooks = [...books].filter(b => b.rating >= 4.7).slice(0, 4);

  const categoriesList = Array.from(new Set(books.map(b => b.category)));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchQuery(inputVal.trim());
      setActiveNavTab('search');
    }
  };

  const handleCategoryClick = (cat: string) => {
    setSearchQuery(cat);
    setActiveNavTab('search');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Section: Welcome & Instant Search Assistant */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-slate-800">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs text-blue-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>DIGITAL LIBRARY ASSISTANT · LIVE SHELF TRACKING</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
            Find any book & navigate to its exact shelf in seconds.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Welcome back, <strong className="text-white">{currentStudent.name}</strong>. Search across {books.length} academic titles or scan a shelf QR code to trace physical rack & shelf coordinates.
          </p>

          {/* Large Smart Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Search by book title, author, ISBN, subject, or keywords..."
                className="w-full px-3 py-3 text-slate-900 text-sm sm:text-base placeholder:text-slate-400 bg-transparent focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shrink-0 shadow-xs flex items-center gap-2"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline" />
              </button>
            </div>
          </form>

          {/* Instant Search Suggestions / Trending Keywords */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 flex-wrap">
            <span className="text-slate-300 font-medium">Quick Suggestions:</span>
            {['Database Management', 'Algorithms', 'Artificial Intelligence', 'Operating Systems', 'Microprocessors'].map((kw, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchQuery(kw);
                  setActiveNavTab('search');
                }}
                className="text-blue-300 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Location Action Button on Hero */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Block A, B & C Integrated Mapping</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>RFID Shelf Accuracy: 99.8%</span>
            </div>
          </div>

          <button
            onClick={() => setScannerOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 transition-colors flex items-center gap-1.5 font-medium"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan Physical Shelf Tag</span>
          </button>
        </div>
      </div>

      {/* 1. KEY INVENTORY METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-medium">Total Books Inventory</div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {totalBooksCount}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{books.length} titles</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-blue-600" />
            <span>Full catalog collection</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-medium">Available on Shelves</div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono tabular-nums">
              {availableCopies}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium font-mono">
              {Math.round((availableCopies / totalBooksCount) * 100)}% ready
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>Ready for checkout</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-medium">Currently Borrowed</div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-bold text-blue-700 font-mono tabular-nums">
              {totalIssuedCount}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">In Circulation</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>Active student loans</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-medium">Academic Disciplines</div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {uniqueCategories}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Categories</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-blue-600" />
            <span>Across 4 major wings</span>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-medium">Scholarly Authors</div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {uniqueAuthors}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Curated Faculty</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-blue-600" />
            <span>Global press publications</span>
          </div>
        </div>
      </div>

      {/* 2. PROMINENT SPOTLIGHT: EXACT LOCATION HIGHLIGHT (Database Management Systems) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-700 font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Exact Location Highlight & Student Guide</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1 font-display">
              Physical Library Coordinates Demo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click &quot;📍 FIND MY BOOK&quot; to test the live rack, shelf, and floorplan locator in real time.
            </p>
          </div>

          <button
            onClick={() => openLocationFinder(books[0])}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <MapPin className="w-4 h-4 text-amber-300" />
            <span>📍 FIND MY BOOK</span>
          </button>
        </div>

        {/* Highlight Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-3 flex justify-center">
            <div 
              className="w-36 aspect-[3/4] rounded-xl overflow-hidden shadow-md border border-slate-200 cursor-pointer hover:scale-102 transition-transform"
              onClick={() => openBookDetail(books[0])}
            >
              <img
                src={books[0].coverImage}
                alt={books[0].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-9 space-y-3">
            <div>
              <div className="text-xs text-slate-500 font-medium">
                {books[0].department} · {books[0].category}
              </div>
              <h3 
                className="text-base sm:text-lg font-bold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors font-display"
                onClick={() => openBookDetail(books[0])}
              >
                {books[0].title}
              </h3>
              <p className="text-xs text-slate-600">
                by {books[0].author} · {books[0].edition}
              </p>
            </div>

            {/* Exact Location Badges Container */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block font-mono">LIBRARY BLOCK</span>
                <span className="font-bold text-slate-900">Block {books[0].location.block}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono">FLOOR</span>
                <span className="font-bold text-slate-900">{books[0].location.floor}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono">ROOM</span>
                <span className="font-bold text-slate-900">{books[0].location.room}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono">RACK NUMBER</span>
                <span className="font-bold text-blue-700 font-mono">{books[0].location.rackNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono">SHELF NUMBER</span>
                <span className="font-bold text-blue-700 font-mono">{books[0].location.shelfNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-mono">POSITION</span>
                <span className="font-bold text-amber-700">{books[0].location.position}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-2">
              <span className="text-slate-600">
                Availability: <strong className="text-emerald-700 font-bold">{books[0].totalCopies - books[0].issuedCopies} of {books[0].totalCopies} copies available</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openBookDetail(books[0])}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  Full Details
                </button>
                <button
                  onClick={() => openLocationFinder(books[0])}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Navigate to Rack {books[0].location.rackNumber}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. POPULAR & RECOMMENDED BOOKS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Most In-Demand</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Popular & Recommended Books
            </h2>
          </div>

          <button
            onClick={() => setActiveNavTab('search')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
          >
            <span>View All Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularBooks.map(book => {
            const status = calculateBookStatus(book);
            const isFav = favorites.includes(book.id);
            const available = book.totalCopies - book.issuedCopies;

            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Cover + Favorite Button */}
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-3">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    
                    {/* Favorite toggle */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(book.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-rose-600 shadow-xs transition-colors"
                      title={isFav ? 'Remove favorite' : 'Save book'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Shelf Location Tag on Image Bottom */}
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs text-white p-1.5 text-[10px] flex items-center justify-between font-mono">
                      <span>{book.location.rackNumber} · {book.location.shelfNumber}</span>
                      <span className="text-amber-300">Pos #{book.location.positionIndex}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="text-[11px] text-slate-500 font-medium truncate mb-1">
                    {book.department}
                  </div>

                  <h3
                    onClick={() => openBookDetail(book)}
                    className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                    title={book.title}
                  >
                    {book.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 truncate">
                    {book.author}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-xs border-t border-slate-100 pt-2">
                    <span className={`font-semibold ${
                      available > 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {available > 0 ? `${available} available` : 'Checked out'}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      ★ {book.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 pt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openBookDetail(book)}
                    className="px-2.5 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors text-center"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => openLocationFinder(book)}
                    className="px-2.5 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Locate</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. RECENTLY ADDED BOOKS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Fresh Acquisitions</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Recently Added to Library
            </h2>
          </div>

          <button
            onClick={() => setActiveNavTab('search')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentlyAdded.map(book => {
            const available = book.totalCopies - book.issuedCopies;

            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-4 hover:border-blue-200 transition-all"
              >
                <div 
                  className="w-20 sm:w-24 aspect-[3/4] rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200 cursor-pointer"
                  onClick={() => openBookDetail(book)}
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    {book.category} · Added {book.addedDate}
                  </div>
                  <h3
                    onClick={() => openBookDetail(book)}
                    className="font-bold text-slate-900 text-sm leading-snug truncate cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-600 truncate mt-0.5">
                    {book.author}
                  </p>

                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                    <span className="text-blue-700 font-mono font-medium">
                      {book.location.rackNumber} / {book.location.shelfNumber}
                    </span>
                    <span>·</span>
                    <span className="text-slate-600">{book.location.room}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => openLocationFinder(book)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 border border-blue-200"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Find Location</span>
                    </button>
                    <button
                      onClick={() => openBookDetail(book)}
                      className="px-3 py-1 text-slate-600 hover:text-slate-900 text-xs font-medium"
                    >
                      View Specs
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. EXPLORE BY DISCIPLINE / CATEGORIES */}
      <div className="bg-slate-100/70 rounded-2xl p-6 border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          Explore by Subject & Category
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="px-3.5 py-2 bg-white hover:bg-blue-600 hover:text-white text-slate-700 rounded-xl text-xs font-medium border border-slate-200 shadow-xs transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
