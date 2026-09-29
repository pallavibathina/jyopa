import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Book,
  Student,
  BorrowRecord,
  ReservationRecord,
  LibrarianMessage,
  UserRole,
  BookStatus
} from '../types/library';
import {
  INITIAL_BOOKS,
  INITIAL_STUDENTS,
  INITIAL_BORROW_RECORDS,
  INITIAL_RESERVATIONS,
  INITIAL_MESSAGES
} from '../data/initialData';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface LibraryContextType {
  books: Book[];
  students: Student[];
  borrowRecords: BorrowRecord[];
  reservations: ReservationRecord[];
  messages: LibrarianMessage[];
  favorites: string[];
  currentStudent: Student;
  userRole: UserRole;
  selectedBook: Book | null;
  locationModalBook: Book | null;
  isScannerOpen: boolean;
  isContactModalOpen: boolean;
  isAddEditModalOpen: boolean;
  editingBook: Book | null;
  activeNavTab: string;
  searchQuery: string;
  selectedDepartment: string;
  toasts: ToastNotification[];

  // Actions
  setUserRole: (role: UserRole) => void;
  setCurrentStudent: (student: Student) => void;
  setActiveNavTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedDepartment: (dept: string) => void;
  toggleFavorite: (bookId: string) => void;
  openBookDetail: (book: Book) => void;
  closeBookDetail: () => void;
  openLocationFinder: (book: Book) => void;
  closeLocationFinder: () => void;
  setScannerOpen: (open: boolean) => void;
  setContactModalOpen: (open: boolean) => void;
  openAddBookModal: () => void;
  openEditBookModal: (book: Book) => void;
  closeAddEditModal: () => void;
  saveBook: (bookData: Partial<Book> & { title: string; author: string }) => void;
  deleteBook: (bookId: string) => void;
  reserveBook: (bookId: string) => boolean;
  cancelReservation: (reservationId: string) => void;
  issueBook: (bookId: string, studentId: string, days?: number) => boolean;
  returnBook: (recordId: string) => void;
  renewBook: (recordId: string) => void;
  sendMessageToLibrarian: (subject: string, message: string, bookTitle?: string) => void;
  replyToMessage: (messageId: string, reply: string) => void;
  sendDueReminder: (recordId: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  resetToDefaults: () => void;
  calculateBookStatus: (book: Book) => BookStatus;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BOOKS: 'librefind_books_v1',
  STUDENTS: 'librefind_students_v1',
  BORROWS: 'librefind_borrows_v1',
  RESERVATIONS: 'librefind_reservations_v1',
  MESSAGES: 'librefind_messages_v1',
  FAVORITES: 'librefind_favorites_v1',
  ROLE: 'librefind_role_v1',
  CURRENT_STUDENT: 'librefind_curr_student_v1'
};

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to defaults
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKS);
      return stored ? JSON.parse(stored) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return stored ? JSON.parse(stored) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BORROWS);
      return stored ? JSON.parse(stored) : INITIAL_BORROW_RECORDS;
    } catch {
      return INITIAL_BORROW_RECORDS;
    }
  });

  const [reservations, setReservations] = useState<ReservationRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      return stored ? JSON.parse(stored) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  const [messages, setMessages] = useState<LibrarianMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return stored ? JSON.parse(stored) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : ['book-001', 'book-003'];
    } catch {
      return ['book-001', 'book-003'];
    }
  });

  const [currentStudent, setCurrentStudentState] = useState<Student>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
      return stored ? JSON.parse(stored) : INITIAL_STUDENTS[0];
    } catch {
      return INITIAL_STUDENTS[0];
    }
  });

  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROLE);
      return stored === 'admin' ? 'admin' : 'student';
    } catch {
      return 'student';
    }
  });

  // Modal / Interaction states
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [locationModalBook, setLocationModalBook] = useState<Book | null>(null);
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Navigation / Search state
  const [activeNavTab, setActiveNavTab] = useState<'dashboard' | 'search' | 'account' | 'admin' | string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    } catch (e) {
      console.warn('Failed saving books', e);
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.warn('Failed saving students', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BORROWS, JSON.stringify(borrowRecords));
    } catch (e) {
      console.warn('Failed saving borrows', e);
    }
  }, [borrowRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    } catch (e) {
      console.warn('Failed saving reservations', e);
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed saving messages', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed saving favorites', e);
    }
  }, [favorites]);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch {}
    if (role === 'admin' && activeNavTab !== 'admin') {
      setActiveNavTab('admin');
    } else if (role === 'student' && activeNavTab === 'admin') {
      setActiveNavTab('dashboard');
    }
  };

  const setCurrentStudent = (student: Student) => {
    setCurrentStudentState(student);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(student));
    } catch {}
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const calculateBookStatus = (book: Book): BookStatus => {
    const availableCopies = book.totalCopies - book.issuedCopies;
    if (availableCopies <= 0) {
      return 'issued';
    }
    if (book.reservationCount >= availableCopies) {
      return 'reserved';
    }
    if (availableCopies <= 2) {
      return 'limited';
    }
    return 'available';
  };

  const toggleFavorite = (bookId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(bookId);
      const updated = exists ? prev.filter(id => id !== bookId) : [...prev, bookId];
      showToast(exists ? 'Removed from saved favorites' : 'Saved to favorites!', 'info');
      return updated;
    });
  };

  const openBookDetail = (book: Book) => {
    setSelectedBook(book);
  };

  const closeBookDetail = () => {
    setSelectedBook(null);
  };

  const openLocationFinder = (book: Book) => {
    // If book detail is open, we can keep or switch; we set locationModalBook directly
    setLocationModalBook(book);
  };

  const closeLocationFinder = () => {
    setLocationModalBook(null);
  };

  const openAddBookModal = () => {
    setEditingBook(null);
    setAddEditModalOpen(true);
  };

  const openEditBookModal = (book: Book) => {
    setEditingBook(book);
    setAddEditModalOpen(true);
  };

  const closeAddEditModal = () => {
    setEditingBook(null);
    setAddEditModalOpen(false);
  };

  const saveBook = (bookData: Partial<Book> & { title: string; author: string }) => {
    if (editingBook) {
      // Edit existing
      setBooks(prev =>
        prev.map(b => (b.id === editingBook.id ? { ...b, ...bookData } as Book : b))
      );
      showToast(`Updated "${bookData.title}" successfully`, 'success');
    } else {
      // Create new book
      const newBook: Book = {
        id: `book-${Date.now()}`,
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn || '978-' + Math.floor(1000000000 + Math.random() * 9000000000),
        publisher: bookData.publisher || 'University Press',
        edition: bookData.edition || '1st Edition',
        publicationYear: bookData.publicationYear || 2024,
        category: bookData.category || 'General Science',
        department: bookData.department || 'Computer Science & Engineering',
        description: bookData.description || 'Scholarly educational reference textbook.',
        totalCopies: bookData.totalCopies || 5,
        issuedCopies: 0,
        coverImage: bookData.coverImage || '/src/assets/images/book_cover_dbms_1790654202444.jpg',
        location: bookData.location || {
          block: 'A',
          floor: '2nd Floor',
          room: 'Digital Library',
          rackNumber: 'R-05',
          shelfNumber: 'S-01',
          position: '1st Book from Left',
          positionIndex: 1,
          totalBooksOnShelf: 15,
          aisle: 'Aisle 3'
        },
        reservationCount: 0,
        rating: 4.5,
        borrowCount: 0,
        addedDate: new Date().toISOString().split('T')[0],
        keywords: bookData.keywords || [bookData.title, bookData.author]
      };
      setBooks(prev => [newBook, ...prev]);
      showToast(`Added "${bookData.title}" to library catalog`, 'success');
    }
    closeAddEditModal();
  };

  const deleteBook = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    setBooks(prev => prev.filter(b => b.id !== bookId));
    if (selectedBook?.id === bookId) setSelectedBook(null);
    if (locationModalBook?.id === bookId) setLocationModalBook(null);
    showToast(`Removed "${book?.title || 'Book'}" from catalog`, 'info');
  };

  const reserveBook = (bookId: string): boolean => {
    const book = books.find(b => b.id === bookId);
    if (!book) return false;

    // Check if already reserved by student
    const existing = reservations.find(
      r => r.bookId === bookId && r.studentId === currentStudent.id && r.status === 'pending'
    );
    if (existing) {
      showToast('You already have an active reservation for this book', 'info');
      return false;
    }

    const newReservation: ReservationRecord = {
      id: `res-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentRoll: currentStudent.rollNumber,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      queuePosition: book.reservationCount + 1
    };

    setReservations(prev => [newReservation, ...prev]);
    setBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, reservationCount: b.reservationCount + 1 } : b))
    );

    showToast(`Reserved "${book.title}"! Queue position: #${newReservation.queuePosition}`, 'success');
    return true;
  };

  const cancelReservation = (reservationId: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
    );
    setBooks(prev =>
      prev.map(b =>
        b.id === res.bookId ? { ...b, reservationCount: Math.max(0, b.reservationCount - 1) } : b
      )
    );
    showToast('Reservation cancelled', 'info');
  };

  const issueBook = (bookId: string, studentId: string, days = 14): boolean => {
    const book = books.find(b => b.id === bookId);
    const student = students.find(s => s.id === studentId);
    if (!book || !student) {
      showToast('Book or student not found', 'error');
      return false;
    }

    const availableCopies = book.totalCopies - book.issuedCopies;
    if (availableCopies <= 0) {
      showToast('No copies available to issue right now', 'error');
      return false;
    }

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + days);

    const newRecord: BorrowRecord = {
      id: `rec-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      studentId: student.id,
      studentName: student.name,
      studentRoll: student.rollNumber,
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'active',
      fineAmount: 0
    };

    setBorrowRecords(prev => [newRecord, ...prev]);
    setBooks(prev =>
      prev.map(b =>
        b.id === bookId
          ? { ...b, issuedCopies: b.issuedCopies + 1, borrowCount: b.borrowCount + 1 }
          : b
      )
    );
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId
          ? { ...s, activeBorrowedCount: s.activeBorrowedCount + 1 }
          : s
      )
    );

    // If current student matches
    if (currentStudent.id === studentId) {
      setCurrentStudentState(prev => ({
        ...prev,
        activeBorrowedCount: prev.activeBorrowedCount + 1
      }));
    }

    showToast(`Issued "${book.title}" to ${student.name} (Due in ${days} days)`, 'success');
    return true;
  };

  const returnBook = (recordId: string) => {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record || record.status === 'returned') return;

    const today = new Date().toISOString().split('T')[0];

    setBorrowRecords(prev =>
      prev.map(r => (r.id === recordId ? { ...r, status: 'returned', returnDate: today } : r))
    );
    setBooks(prev =>
      prev.map(b =>
        b.id === record.bookId
          ? { ...b, issuedCopies: Math.max(0, b.issuedCopies - 1) }
          : b
      )
    );
    setStudents(prev =>
      prev.map(s =>
        s.id === record.studentId
          ? { ...s, activeBorrowedCount: Math.max(0, s.activeBorrowedCount - 1) }
          : s
      )
    );

    if (currentStudent.id === record.studentId) {
      setCurrentStudentState(prev => ({
        ...prev,
        activeBorrowedCount: Math.max(0, prev.activeBorrowedCount - 1)
      }));
    }

    showToast(`Returned "${record.bookTitle}". Inventory updated!`, 'success');
  };

  const renewBook = (recordId: string) => {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record || record.status === 'returned') return;

    const currentDue = new Date(record.dueDate);
    currentDue.setDate(currentDue.getDate() + 14);
    const newDueDate = currentDue.toISOString().split('T')[0];

    setBorrowRecords(prev =>
      prev.map(r =>
        r.id === recordId
          ? { ...r, dueDate: newDueDate, status: 'active', fineAmount: 0 }
          : r
      )
    );

    showToast(`Renewed "${record.bookTitle}"! New due date: ${newDueDate}`, 'success');
  };

  const sendMessageToLibrarian = (subject: string, message: string, bookTitle?: string) => {
    const newMsg: LibrarianMessage = {
      id: `msg-${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentRoll: currentStudent.rollNumber,
      subject,
      message,
      bookTitle,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'unread'
    };
    setMessages(prev => [newMsg, ...prev]);
    showToast('Your message has been sent to the library desk!', 'success');
  };

  const replyToMessage = (messageId: string, reply: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? {
              ...m,
              reply,
              status: 'replied',
              replyTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          : m
      )
    );
    showToast('Reply sent to student', 'success');
  };

  const sendDueReminder = (recordId: string) => {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;
    showToast(`Reminder alert sent to ${record.studentName} (${record.studentRoll})`, 'info');
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setBooks(INITIAL_BOOKS);
    setStudents(INITIAL_STUDENTS);
    setBorrowRecords(INITIAL_BORROW_RECORDS);
    setReservations(INITIAL_RESERVATIONS);
    setMessages(INITIAL_MESSAGES);
    setFavorites(['book-001', 'book-003']);
    setCurrentStudentState(INITIAL_STUDENTS[0]);
    setUserRoleState('student');
    showToast('Library database reset to initial demo state', 'info');
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        students,
        borrowRecords,
        reservations,
        messages,
        favorites,
        currentStudent,
        userRole,
        selectedBook,
        locationModalBook,
        isScannerOpen,
        isContactModalOpen,
        isAddEditModalOpen,
        editingBook,
        activeNavTab,
        searchQuery,
        selectedDepartment,
        toasts,
        setUserRole,
        setCurrentStudent,
        setActiveNavTab,
        setSearchQuery,
        setSelectedDepartment,
        toggleFavorite,
        openBookDetail,
        closeBookDetail,
        openLocationFinder,
        closeLocationFinder,
        setScannerOpen,
        setContactModalOpen,
        openAddBookModal,
        openEditBookModal,
        closeAddEditModal,
        saveBook,
        deleteBook,
        reserveBook,
        cancelReservation,
        issueBook,
        returnBook,
        renewBook,
        sendMessageToLibrarian,
        replyToMessage,
        sendDueReminder,
        showToast,
        resetToDefaults,
        calculateBookStatus
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
