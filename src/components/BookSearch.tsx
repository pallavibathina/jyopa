import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types/library';
import {
  Search,
  MapPin,
  Filter,
  Bookmark,
  X,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers
} from 'lucide-react';

export const BookSearch: React.FC = () => {
  const {
    books,
    openBookDetail,
    openLocationFinder,
    favorites,
    toggleFavorite,
    searchQuery,
    setSearchQuery,
    calculateBookStatus
  } = useLibrary();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'title' | 'rating'>('popular');

  const departments = ['All', ...Array.from(new Set(books.map(b => b.department)))];
  const categories = ['All', ...Array.from(new Set(books.map(b => b.category)))];

  // Dynamic search suggestions matching title, author, category, or keywords
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const matches: string[] = [];

    books.forEach(b => {
      if (b.title.toLowerCase().includes(q) && !matches.includes(b.title)) {
        matches.push(b.title);
      }
      if (b.author.toLowerCase().includes(q) && !matches.includes(b.author)) {
        matches.push(b.author);
      }
      if (b.category.toLowerCase().includes(q) && !matches.includes(b.category)) {
        matches.push(b.category);
      }
      b.keywords.forEach(kw => {
        if (kw.toLowerCase().includes(q) && !matches.includes(kw)) {
          matches.push(kw);
        }
      });
    });

    return matches.slice(0, 5);
  }, [books, searchQuery]);

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = book.title.toLowerCase().includes(q);
        const matchAuthor = book.author.toLowerCase().includes(q);
        const matchIsbn = book.isbn.toLowerCase().includes(q);
        const matchCat = book.category.toLowerCase().includes(q);
        const matchDept = book.department.toLowerCase().includes(q);
        const matchKw = book.keywords.some(kw => kw.toLowerCase().includes(q));
        const matchLoc = `${book.location.block} ${book.location.room} ${book.location.rackNumber}`.toLowerCase().includes(q);

        if (!matchTitle && !matchAuthor && !matchIsbn && !matchCat && !matchDept && !matchKw && !matchLoc) {
          return false;
        }
      }

      // Department filter
      if (selectedDept !== 'All' && book.department !== selectedDept) {
        return false;
      }

      // Category filter
      if (selectedCat !== 'All' && book.category !== selectedCat) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all') {
        const status = calculateBookStatus(book);
        if (selectedStatus === 'available' && status !== 'available' && status !== 'limited') return false;
        if (selectedStatus === 'issued' && status !== 'issued') return false;
        if (selectedStatus === 'reserved' && status !== 'reserved') return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.borrowCount - a.borrowCount;
      if (sortBy === 'newest') return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [books, searchQuery, selectedDept, selectedCat, selectedStatus, sortBy, calculateBookStatus]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDept('All');
    setSelectedCat('All');
    setSelectedStatus('all');
    setSortBy('popular');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Search Controller */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Smart Academic Book Search
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search by title, author, ISBN barcode, subject, department, or rack number.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <div className="relative flex items-center bg-slate-50 rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="e.g. Database Management Systems, Raghu Ramakrishnan, 978-0072465631, R-05..."
              className="w-full px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Instant Search Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20 text-xs">
              <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Instant Matches & Suggestions
              </div>
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(sug)}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-between border-t border-slate-100 first:border-t-0"
                >
                  <span className="font-medium">{sug}</span>
                  <span className="text-[10px] text-slate-400">Click to apply</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Category / Subject
            </label>
            <select
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Availability
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
            >
              <option value="all">All Books</option>
              <option value="available">Available on Shelf Only</option>
              <option value="issued">Currently Issued</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
            >
              <option value="popular">Most Borrowed</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Recently Added</option>
              <option value="title">Book Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Tags & Clear All */}
        {(searchQuery || selectedDept !== 'All' || selectedCat !== 'All' || selectedStatus !== 'all') && (
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span>Showing {filteredBooks.length} results</span>
              <span>·</span>
              <span className="text-slate-400">Filters active</span>
            </div>

            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Search Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <span>Found <strong className="text-slate-900">{filteredBooks.length}</strong> books matching criteria</span>
        <span className="text-slate-400">Total catalog inventory: {books.length} titles</span>
      </div>

      {/* Results List */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No matching books found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn&apos;t find any books matching your query. Try searching for broader terms like &quot;Database&quot;, &quot;Computer&quot;, or reset your filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors inline-block mt-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBooks.map(book => {
            const status = calculateBookStatus(book);
            const available = book.totalCopies - book.issuedCopies;
            const isFav = favorites.includes(book.id);
            const loc = book.location;

            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-4">
                    {/* Book Cover */}
                    <div 
                      className="w-24 sm:w-28 aspect-[3/4] rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 cursor-pointer shadow-xs hover:scale-102 transition-transform"
                      onClick={() => openBookDetail(book)}
                    >
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-[11px] text-slate-500 font-medium truncate">
                          {book.department}
                        </div>
                        <button
                          onClick={() => toggleFavorite(book.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 -mt-1 -mr-1"
                          title={isFav ? 'Remove favorite' : 'Add favorite'}
                        >
                          <Bookmark className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      <h3
                        onClick={() => openBookDetail(book)}
                        className="font-bold text-slate-900 text-base leading-snug cursor-pointer hover:text-blue-600 transition-colors line-clamp-2 mt-0.5 font-display"
                      >
                        {book.title}
                      </h3>

                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        by {book.author}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5 font-mono">
                        <span>ISBN: {book.isbn}</span>
                        <span>·</span>
                        <span>{book.edition}</span>
                      </div>

                      {/* Status indicator unboxed text */}
                      <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold">
                        {status === 'available' && (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {available} of {book.totalCopies} Copies Available
                          </span>
                        )}
                        {status === 'limited' && (
                          <span className="text-amber-700 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Limited ({available} copy left)
                          </span>
                        )}
                        {status === 'issued' && (
                          <span className="text-rose-600 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            All Copies Checked Out (Due {book.expectedReturnDate || 'Next Week'})
                          </span>
                        )}
                        {status === 'reserved' && (
                          <span className="text-blue-600 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Reserved ({book.reservationCount} in waitlist)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Physical Location Summary Box */}
                  <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">Physical Coordinates</span>
                      <span className="text-blue-600 font-mono">{loc.room}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[9px]">BLOCK/FLOOR</span>
                        <span className="text-slate-900 font-bold">Blk {loc.block} · {loc.floor}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">RACK & SHELF</span>
                        <span className="text-blue-700 font-bold">{loc.rackNumber} / {loc.shelfNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">POSITION</span>
                        <span className="text-amber-700 font-bold truncate block">{loc.position}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openBookDetail(book)}
                    className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    View Full Info
                  </button>

                  <button
                    onClick={() => openLocationFinder(book)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>📍 FIND MY BOOK</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
