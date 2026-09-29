export type BookStatus = 'available' | 'limited' | 'issued' | 'reserved';

export interface BookLocation {
  block: string;       // e.g. "A", "Block A"
  floor: string;       // e.g. "2nd Floor"
  room: string;        // e.g. "Digital Library"
  rackNumber: string;  // e.g. "R-05"
  shelfNumber: string; // e.g. "S-03"
  position: string;    // e.g. "4th Book from Left"
  positionIndex: number; // 4
  totalBooksOnShelf: number; // 18
  aisle?: string;      // e.g. "Aisle 3"
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  edition: string;
  publicationYear: number;
  category: string;
  department: string;
  description: string;
  totalCopies: number;
  issuedCopies: number;
  coverImage: string;
  location: BookLocation;
  expectedReturnDate?: string;
  reservationCount: number;
  rating: number;
  borrowCount: number;
  addedDate: string;
  keywords: string[];
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  semester: string;
  phone: string;
  avatarUrl?: string;
  activeBorrowedCount: number;
  maxBorrowLimit: number;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  fineAmount: number;
}

export interface ReservationRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  requestDate: string;
  status: 'pending' | 'ready_for_pickup' | 'fulfilled' | 'cancelled';
  queuePosition: number;
}

export interface LibrarianMessage {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  subject: string;
  message: string;
  bookTitle?: string;
  timestamp: string;
  status: 'unread' | 'replied';
  reply?: string;
  replyTimestamp?: string;
}

export type UserRole = 'student' | 'admin';
