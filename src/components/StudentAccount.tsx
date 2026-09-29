import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  User,
  BookOpen,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Bookmark,
  Clock,
  CheckCircle,
  MessageSquare,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Send,
  Sparkles
} from 'lucide-react';

export const StudentAccount: React.FC = () => {
  const {
    currentStudent,
    setCurrentStudent,
    students,
    books,
    borrowRecords,
    reservations,
    favorites,
    toggleFavorite,
    openBookDetail,
    openLocationFinder,
    renewBook,
    returnBook,
    cancelReservation,
    setContactModalOpen,
    messages
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'current' | 'favorites' | 'history' | 'reservations' | 'messages'>('current');

  // Filter records for this student
  const myActiveLoans = borrowRecords.filter(
    b => b.studentId === currentStudent.id && (b.status === 'active' || b.status === 'overdue')
  );

  const myPastHistory = borrowRecords.filter(
    b => b.studentId === currentStudent.id && b.status === 'returned'
  );

  const myReservations = reservations.filter(
    r => r.studentId === currentStudent.id
  );

  const myFavoritesList = books.filter(b => favorites.includes(b.id));

  const myMessages = messages.filter(
    m => m.studentId === currentStudent.id
  );

  // Calculate days remaining or overdue
  const getDueStatus = (dueDateStr: string) => {
    const today = new Date('2026-09-28'); // Current system date
    const due = new Date(dueDateStr);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `Overdue by ${Math.abs(diffDays)} days!`,
        isOverdue: true,
        days: diffDays,
        colorClass: 'text-rose-700 bg-rose-50 border-rose-200'
      };
    } else if (diffDays <= 3) {
      return {
        label: `Due soon: ${diffDays} days left`,
        isOverdue: false,
        days: diffDays,
        colorClass: 'text-amber-800 bg-amber-50 border-amber-200'
      };
    } else {
      return {
        label: `Due in ${diffDays} days (${dueDateStr})`,
        isOverdue: false,
        days: diffDays,
        colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200'
      };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Student Profile Identity Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl font-display shadow-md">
            {currentStudent.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 font-display">
                {currentStudent.name}
              </h1>
              <span className="text-xs bg-blue-50 text-blue-700 font-mono px-2 py-0.5 rounded border border-blue-200 font-bold">
                {currentStudent.rollNumber}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentStudent.department} · {currentStudent.semester}
            </p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              {currentStudent.email} · Phone: {currentStudent.phone}
            </p>
          </div>
        </div>

        {/* Switch Student Profile Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Switch Student:</span>
          <select
            value={currentStudent.id}
            onChange={e => {
              const std = students.find(s => s.id === e.target.value);
              if (std) setCurrentStudent(std);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Account Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Active Loans</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {myActiveLoans.length} <span className="text-xs text-slate-400 font-normal">/ {currentStudent.maxBorrowLimit} limit</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Overdue Books</div>
          <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
            myActiveLoans.some(b => b.status === 'overdue') ? 'text-rose-600' : 'text-slate-900'
          }`}>
            {myActiveLoans.filter(b => b.status === 'overdue').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Saved Favorites</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {favorites.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Pending Reservations</div>
          <div className="text-2xl font-bold text-blue-700 font-mono tabular-nums mt-1">
            {myReservations.filter(r => r.status === 'pending').length}
          </div>
        </div>
      </div>

      {/* Account Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 pt-4 border-b border-slate-200 flex items-center gap-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('current')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap relative ${
              activeTab === 'current'
                ? 'text-blue-700 border-b-2 border-blue-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Loans & Due Dates ({myActiveLoans.length})
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap relative ${
              activeTab === 'favorites'
                ? 'text-blue-700 border-b-2 border-blue-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Saved Books ({favorites.length})
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap relative ${
              activeTab === 'reservations'
                ? 'text-blue-700 border-b-2 border-blue-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Reservations ({myReservations.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap relative ${
              activeTab === 'history'
                ? 'text-blue-700 border-b-2 border-blue-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Borrowing History ({myPastHistory.length})
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap relative ${
              activeTab === 'messages'
                ? 'text-blue-700 border-b-2 border-blue-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Librarian Messages ({myMessages.length})
          </button>
        </div>

        {/* Tab 1: Current Loans with Due Dates & Reminders */}
        {activeTab === 'current' && (
          <div className="p-6 space-y-4">
            {myActiveLoans.length === 0 ? (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">You do not have any currently borrowed books.</p>
              </div>
            ) : (
              myActiveLoans.map(record => {
                const book = books.find(b => b.id === record.bookId);
                const dueStatus = getDueStatus(record.dueDate);

                return (
                  <div
                    key={record.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex gap-4">
                      {book && (
                        <div 
                          className="w-16 h-22 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300 cursor-pointer"
                          onClick={() => openBookDetail(book)}
                        >
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <div className="text-xs text-slate-500 font-medium">
                          Issued on {record.issueDate}
                        </div>
                        <h4 
                          className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors cursor-pointer"
                          onClick={() => book && openBookDetail(book)}
                        >
                          {record.bookTitle}
                        </h4>
                        <p className="text-xs text-slate-600">by {record.bookAuthor}</p>

                        {/* Due status banner */}
                        <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${dueStatus.colorClass}`}>
                          {dueStatus.isOverdue ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          <span>{dueStatus.label}</span>
                          {dueStatus.isOverdue && (
                            <span className="font-mono text-rose-800">
                              (Late fine accrued: ${record.fineAmount.toFixed(2)})
                            </span>
                          )}
                        </div>

                        {book && (
                          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-mono">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            <span>Return Drop Box: {book.location.room} or Front Circulation Desk</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => renewBook(record.id)}
                        className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Renew (+14 Days)</span>
                      </button>

                      <button
                        onClick={() => returnBook(record.id)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Saved Favorites */}
        {activeTab === 'favorites' && (
          <div className="p-6">
            {myFavoritesList.length === 0 ? (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">No saved books yet. Click the bookmark icon on any book to save it.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myFavoritesList.map(book => (
                  <div
                    key={book.id}
                    className="p-4 rounded-xl border border-slate-200 flex gap-3 items-center justify-between"
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-16 rounded object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 
                          onClick={() => openBookDetail(book)}
                          className="font-bold text-slate-900 text-xs truncate cursor-pointer hover:text-blue-600"
                        >
                          {book.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{book.author}</p>
                        <p className="text-[10px] text-blue-700 font-mono mt-0.5">
                          Rack {book.location.rackNumber} / Shelf {book.location.shelfNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openLocationFinder(book)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Locate Shelf"
                      >
                        <MapPin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleFavorite(book.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Remove"
                      >
                        <Bookmark className="w-4 h-4 fill-rose-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Reservations */}
        {activeTab === 'reservations' && (
          <div className="p-6 space-y-3">
            {myReservations.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs">No active reservations.</p>
              </div>
            ) : (
              myReservations.map(res => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono text-blue-600 uppercase font-bold">
                      Requested {res.requestDate} · Queue Position #{res.queuePosition}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                      {res.bookTitle}
                    </h4>
                    <span className="text-xs text-slate-500">
                      Status: {res.status === 'ready_for_pickup' ? 'Ready for Pickup at Counter 1' : 'Pending in waitlist'}
                    </span>
                  </div>

                  {res.status === 'pending' && (
                    <button
                      onClick={() => cancelReservation(res.id)}
                      className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium border border-rose-200"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Borrowing History */}
        {activeTab === 'history' && (
          <div className="p-6 space-y-3">
            {myPastHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="text-xs">No completed return history yet.</p>
              </div>
            ) : (
              myPastHistory.map(rec => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-900">{rec.bookTitle}</h5>
                    <p className="text-slate-500">
                      Issued: {rec.issueDate} · Returned: {rec.returnDate || 'Returned'}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded font-semibold text-[11px] border border-emerald-200">
                    Returned on Time
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 5: Librarian Communication */}
        {activeTab === 'messages' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs text-slate-500">
                Inquiries & requests sent to library staff
              </span>
              <button
                onClick={() => setContactModalOpen(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Contact Librarian</span>
              </button>
            </div>

            {myMessages.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No past messages. Click above to send an inquiry to the desk.
              </div>
            ) : (
              myMessages.map(msg => (
                <div key={msg.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <h5 className="font-bold text-slate-900">{msg.subject}</h5>
                    <span className="text-slate-400 font-mono text-[10px]">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700">{msg.message}</p>

                  {msg.reply && (
                    <div className="mt-2 pl-3 border-l-2 border-blue-500 bg-blue-50/50 p-2 rounded-r-lg">
                      <div className="text-[11px] font-bold text-blue-900">
                        Librarian Response · {msg.replyTimestamp}
                      </div>
                      <p className="text-xs text-blue-950 mt-0.5">{msg.reply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>

    </div>
  );
};
