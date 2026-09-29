import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book, Student } from '../types/library';
import {
  ShieldCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Download,
  Users,
  BookOpen,
  MapPin,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  TrendingUp,
  Mail,
  Send,
  Bell
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    books,
    students,
    borrowRecords,
    reservations,
    messages,
    openAddBookModal,
    openEditBookModal,
    deleteBook,
    openBookDetail,
    openLocationFinder,
    issueBook,
    returnBook,
    renewBook,
    sendDueReminder,
    replyToMessage,
    showToast,
    resetToDefaults
  } = useLibrary();

  const [adminTab, setAdminTab] = useState<'inventory' | 'circulation' | 'overdue' | 'students' | 'messages' | 'stats'>('inventory');
  const [adminSearch, setAdminSearch] = useState('');
  
  // Issue book form state
  const [issueBookId, setIssueBookId] = useState(books[0]?.id || '');
  const [issueStudentId, setIssueStudentId] = useState(students[0]?.id || '');
  const [issueDays, setIssueDays] = useState(14);

  // New student form state
  const [newStudentOpen, setNewStudentOpen] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    department: 'Computer Science & Engineering',
    semester: '1st Semester',
    phone: ''
  });

  // Message reply state
  const [replyInput, setReplyInput] = useState<{ [id: string]: string }>({});

  // Calculations for stats
  const totalBooks = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const totalIssued = books.reduce((acc, b) => acc + b.issuedCopies, 0);
  const totalAvailable = totalBooks - totalIssued;
  const overdueRecords = borrowRecords.filter(b => b.status === 'overdue');
  const activeRecords = borrowRecords.filter(b => b.status === 'active');
  const unreadMessages = messages.filter(m => m.status === 'unread');

  // Category-wise count
  const categoryCounts: { [cat: string]: number } = {};
  books.forEach(b => {
    categoryCounts[b.category] = (categoryCounts[b.category] || 0) + b.totalCopies;
  });

  const filteredBooks = books.filter(b => {
    if (!adminSearch.trim()) return true;
    const q = adminSearch.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.location.rackNumber.toLowerCase().includes(q)
    );
  });

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueBookId || !issueStudentId) return;
    issueBook(issueBookId, issueStudentId, issueDays);
  };

  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.name || !newStudentData.rollNumber) return;

    students.push({
      id: `std-${Date.now()}`,
      name: newStudentData.name,
      rollNumber: newStudentData.rollNumber,
      email: newStudentData.email || `${newStudentData.rollNumber.toLowerCase()}@university.edu`,
      department: newStudentData.department,
      semester: newStudentData.semester,
      phone: newStudentData.phone || '+1 (555) 000-0000',
      activeBorrowedCount: 0,
      maxBorrowLimit: 4
    });

    showToast(`Registered new student: ${newStudentData.name} (${newStudentData.rollNumber})`, 'success');
    setNewStudentOpen(false);
    setNewStudentData({
      name: '',
      rollNumber: '',
      email: '',
      department: 'Computer Science & Engineering',
      semester: '1st Semester',
      phone: ''
    });
  };

  // Export report to CSV
  const handleExportCSV = () => {
    const headers = ['Title', 'Author', 'ISBN', 'Category', 'Total Copies', 'Issued Copies', 'Available', 'Block', 'Floor', 'Room', 'Rack', 'Shelf', 'Position'];
    const rows = books.map(b => [
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.author.replace(/"/g, '""')}"`,
      `"${b.isbn}"`,
      `"${b.category}"`,
      b.totalCopies,
      b.issuedCopies,
      b.totalCopies - b.issuedCopies,
      `"Block ${b.location.block}"`,
      `"${b.location.floor}"`,
      `"${b.location.room}"`,
      `"${b.location.rackNumber}"`,
      `"${b.location.shelfNumber}"`,
      `"${b.location.position}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `librefind_inventory_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Library inventory report generated and downloaded as CSV!', 'success');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Admin Top Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-wider font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>CENTRAL LIBRARIAN MANAGEMENT & CIRCULATION CONSOLE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 font-display">
            Library Operations & Inventory Command
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Full authority to add books, configure rack coordinates, issue loans, manage student rosters, and view circulation statistics.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={openAddBookModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* 8. LIVE SMART LIBRARY STATISTICS KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Total Books</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">{totalBooks}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{books.length} unique titles</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Available on Shelf</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums mt-1">{totalAvailable}</div>
          <div className="text-[10px] text-emerald-700 font-mono mt-0.5">Ready for issue</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Issued Copies</div>
          <div className="text-2xl font-bold text-blue-700 font-mono tabular-nums mt-1">{totalIssued}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Active student loans</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Overdue Books</div>
          <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${overdueRecords.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {overdueRecords.length}
          </div>
          <div className="text-[10px] text-rose-700 font-mono mt-0.5">Action required</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Registered Students</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">{students.length}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Active library cards</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Student Inquiries</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">{messages.length}</div>
          <div className="text-[10px] text-blue-600 font-mono mt-0.5">{unreadMessages.length} unread</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 pt-4 border-b border-slate-200 flex items-center gap-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setAdminTab('inventory')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap relative ${
              adminTab === 'inventory' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Catalog Inventory ({books.length})
          </button>

          <button
            onClick={() => setAdminTab('circulation')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap relative ${
              adminTab === 'circulation' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Issue / Return Desk
          </button>

          <button
            onClick={() => setAdminTab('overdue')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap relative flex items-center gap-1.5 ${
              adminTab === 'overdue' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Overdue Tracker</span>
            {overdueRecords.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {overdueRecords.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('students')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap relative ${
              adminTab === 'students' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Student Roster ({students.length})
          </button>

          <button
            onClick={() => setAdminTab('messages')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap relative flex items-center gap-1.5 ${
              adminTab === 'messages' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Student Inquiries</span>
            {unreadMessages.length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {unreadMessages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('stats')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap relative ${
              adminTab === 'stats' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Analytics & Reports
          </button>
        </div>

        {/* TAB 1: CATALOG INVENTORY MANAGEMENT */}
        {adminTab === 'inventory' && (
          <div className="p-6 space-y-4">
            
            {/* Search filter inside inventory */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={e => setAdminSearch(e.target.value)}
                  placeholder="Filter by title, author, ISBN, rack..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="text-xs text-slate-500">
                Showing {filteredBooks.length} of {books.length} catalog items
              </div>
            </div>

            {/* Inventory Table */}
            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Book Details</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Exact Physical Location</th>
                    <th className="p-3 text-center">Stock</th>
                    <th className="p-3 text-center">Issued</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBooks.map(book => {
                    const available = book.totalCopies - book.issuedCopies;
                    const loc = book.location;

                    return (
                      <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              referrerPolicy="no-referrer"
                              className="w-10 h-14 rounded object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 
                                className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer truncate max-w-xs"
                                onClick={() => openBookDetail(book)}
                              >
                                {book.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 truncate">{book.author}</p>
                              <p className="text-[10px] text-slate-400 font-mono">ISBN: {book.isbn}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 text-slate-700 whitespace-nowrap">
                          <div>{book.category}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-xs">{book.department}</div>
                        </td>

                        <td className="p-3 whitespace-nowrap">
                          <div className="font-mono text-blue-700 font-bold">
                            Rack {loc.rackNumber} · Shelf {loc.shelfNumber}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {loc.floor}, {loc.room}
                          </div>
                          <div className="text-[10px] text-amber-700 font-medium">
                            {loc.position}
                          </div>
                        </td>

                        <td className="p-3 text-center font-mono font-bold text-slate-900">
                          {book.totalCopies}
                        </td>

                        <td className="p-3 text-center font-mono font-bold text-blue-700">
                          {book.issuedCopies}
                        </td>

                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openLocationFinder(book)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Locate Rack & Shelf"
                            >
                              <MapPin className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => openEditBookModal(book)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                              title="Edit Book Details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => deleteBook(book.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                              title="Delete Book"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: ISSUE / RETURN CIRCULATION DESK */}
        {adminTab === 'circulation' && (
          <div className="p-6 space-y-6">
            
            {/* Quick Issue Desk Form */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2 font-display">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Issue Book to Student</span>
              </h3>

              <form onSubmit={handleIssueSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Select Student
                  </label>
                  <select
                    value={issueStudentId}
                    onChange={e => setIssueStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Select Book
                  </label>
                  <select
                    value={issueBookId}
                    onChange={e => setIssueBookId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    {books.map(b => (
                      <option key={b.id} value={b.id} disabled={b.totalCopies - b.issuedCopies <= 0}>
                        {b.title} ({b.totalCopies - b.issuedCopies} avail · Rack {b.location.rackNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Loan Duration (Days)
                  </label>
                  <select
                    value={issueDays}
                    onChange={e => setIssueDays(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value={7}>7 Days (Standard Exam Term)</option>
                    <option value={14}>14 Days (Regular Term)</option>
                    <option value={30}>30 Days (Research Project)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                  >
                    Issue Book Now
                  </button>
                </div>
              </form>
            </div>

            {/* Currently Active Circulation Records */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Active Circulating Loans ({activeRecords.length})
              </h4>

              <div className="border border-slate-200 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Book Title</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Issue Date</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Circulation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeRecords.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">{rec.bookTitle}</td>
                        <td className="p-3">
                          <span className="font-medium text-slate-800">{rec.studentName}</span>
                          <span className="text-[10px] text-slate-400 font-mono ml-1.5">({rec.studentRoll})</span>
                        </td>
                        <td className="p-3 font-mono text-slate-600">{rec.issueDate}</td>
                        <td className="p-3 font-mono text-slate-900 font-bold">{rec.dueDate}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[11px] font-semibold border border-blue-200">
                            Active Loan
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => renewBook(rec.id)}
                            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 rounded text-xs font-medium"
                          >
                            Renew
                          </button>
                          <button
                            onClick={() => returnBook(rec.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                          >
                            Return
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: OVERDUE TRACKER */}
        {adminTab === 'overdue' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-display">
                  Overdue Loan Tracker & Reminder Alerts
                </h3>
                <p className="text-xs text-slate-500">
                  Students with past-due materials. Trigger automated return notices with 1 click.
                </p>
              </div>

              {overdueRecords.length > 0 && (
                <button
                  onClick={() => {
                    overdueRecords.forEach(r => sendDueReminder(r.id));
                  }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify All Overdue Borrowers</span>
                </button>
              )}
            </div>

            {overdueRecords.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No Overdue Books!</h4>
                <p className="text-xs text-slate-500">All books are within their authorized borrowing terms.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {overdueRecords.map(rec => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <h4 className="font-bold text-slate-900 text-sm">{rec.bookTitle}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Borrowed by <strong className="text-slate-900">{rec.studentName}</strong> ({rec.studentRoll})
                      </p>
                      <div className="text-xs text-rose-800 mt-1 font-mono">
                        Due Date: {rec.dueDate} · Current Accrued Fine: ${rec.fineAmount.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => sendDueReminder(rec.id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Send Return Notice</span>
                      </button>

                      <button
                        onClick={() => returnBook(rec.id)}
                        className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold border border-slate-300"
                      >
                        Mark Returned
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STUDENT ROSTER */}
        {adminTab === 'students' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-display">
                  Registered Students Directory
                </h3>
                <p className="text-xs text-slate-500">
                  Manage student library borrowing cards and check limits.
                </p>
              </div>

              <button
                onClick={() => setNewStudentOpen(!newStudentOpen)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register New Student</span>
              </button>
            </div>

            {/* Register Student Form Drawer */}
            {newStudentOpen && (
              <form onSubmit={handleRegisterStudent} className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
                <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider">
                  New Student Registration Form
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newStudentData.name}
                      onChange={e => setNewStudentData({ ...newStudentData, name: e.target.value })}
                      placeholder="e.g. Jordan Hayes"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Roll / ID Number *</label>
                    <input
                      type="text"
                      required
                      value={newStudentData.rollNumber}
                      onChange={e => setNewStudentData({ ...newStudentData, rollNumber: e.target.value })}
                      placeholder="e.g. CS2024-105"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Department</label>
                    <select
                      value={newStudentData.department}
                      onChange={e => setNewStudentData({ ...newStudentData, department: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                      <option value="Mathematics & Statistics">Mathematics & Statistics</option>
                      <option value="School of Management Studies">School of Management Studies</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setNewStudentOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                  >
                    Save Student
                  </button>
                </div>
              </form>
            )}

            {/* Students Table */}
            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Roll Number</th>
                    <th className="p-3">Department</th>
                    <th className="p-3 text-center">Active Loans</th>
                    <th className="p-3 text-center">Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(std => (
                    <tr key={std.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{std.name}</td>
                      <td className="p-3 font-mono text-blue-700 font-bold">{std.rollNumber}</td>
                      <td className="p-3 text-slate-600">{std.department}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-900">{std.activeBorrowedCount}</td>
                      <td className="p-3 text-center font-mono text-slate-500">{std.maxBorrowLimit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: STUDENT INQUIRIES & MESSAGES */}
        {adminTab === 'messages' && (
          <div className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm font-display">
              Student Help Desk Inquiries ({messages.length})
            </h3>

            {messages.length === 0 ? (
              <p className="text-xs text-slate-500">No incoming student messages.</p>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{msg.studentName}</span>
                        <span className="text-slate-400 font-mono ml-2">({msg.studentRoll})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                    </div>

                    <div className="text-xs">
                      <div className="font-semibold text-blue-900">{msg.subject}</div>
                      <p className="text-slate-700 mt-1">{msg.message}</p>
                    </div>

                    {msg.reply ? (
                      <div className="pl-3 border-l-2 border-emerald-500 bg-emerald-50/50 p-2.5 rounded-r-lg text-xs">
                        <span className="font-bold text-emerald-900">Your Response:</span>
                        <p className="text-emerald-950 mt-0.5">{msg.reply}</p>
                      </div>
                    ) : (
                      <div className="pt-2 flex gap-2">
                        <input
                          type="text"
                          value={replyInput[msg.id] || ''}
                          onChange={e => setReplyInput({ ...replyInput, [msg.id]: e.target.value })}
                          placeholder="Type reply to student..."
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                        <button
                          onClick={() => {
                            if (replyInput[msg.id]?.trim()) {
                              replyToMessage(msg.id, replyInput[msg.id].trim());
                            }
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SMART LIBRARY STATISTICS & CHARTS */}
        {adminTab === 'stats' && (
          <div className="p-6 space-y-6">
            
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                Smart Library Analytics & Utilization Overview
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time inventory distribution, checkout velocities, and shelf allocation across wings.
              </p>
            </div>

            {/* Category breakdown visual bars */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Category-Wise Book Volume
              </h4>

              <div className="space-y-3">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const percent = Math.round((count / totalBooks) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-800">{cat}</span>
                        <span className="text-slate-500 font-mono">{count} copies ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Most Borrowed Books Leaderboard */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Top Borrowed Titles This Academic Year</span>
              </h4>

              <div className="divide-y divide-slate-100">
                {[...books].sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 5).map((book, idx) => (
                  <div key={book.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-400 w-5">#{idx + 1}</span>
                      <div>
                        <div className="font-bold text-slate-900">{book.title}</div>
                        <div className="text-[11px] text-slate-500">
                          {book.author} · {book.location.room} (Rack {book.location.rackNumber})
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-blue-700">{book.borrowCount} loans</span>
                      <div className="text-[10px] text-slate-400">★ {book.rating.toFixed(1)} rating</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Reset Demo Trigger */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500">Need to reload sample dataset?</span>
              <button
                onClick={resetToDefaults}
                className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-medium transition-colors"
              >
                Reset Database to Demo State
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
