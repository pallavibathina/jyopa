import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Send, X, MessageSquare, BookOpen, Check } from 'lucide-react';

export const ContactLibrarianModal: React.FC = () => {
  const {
    isContactModalOpen,
    setContactModalOpen,
    sendMessageToLibrarian,
    currentStudent,
    books
  } = useLibrary();

  const [subject, setSubject] = useState('');
  const [selectedBookTitle, setSelectedBookTitle] = useState('');
  const [message, setMessage] = useState('');

  if (!isContactModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    sendMessageToLibrarian(subject.trim(), message.trim(), selectedBookTitle || undefined);
    setSubject('');
    setSelectedBookTitle('');
    setMessage('');
    setContactModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base font-display">Contact Library Desk</h3>
          </div>
          <button
            onClick={() => setContactModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs text-blue-900">
            Sending inquiry as <strong>{currentStudent.name}</strong> ({currentStudent.rollNumber} · {currentStudent.department})
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Inquiry Topic / Subject *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Can't find book on shelf R-05, Request renewal, Suggest new title"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Associated Book (Optional)
            </label>
            <select
              value={selectedBookTitle}
              onChange={e => setSelectedBookTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 bg-white"
            >
              <option value="">-- None / General Library Question --</option>
              {books.map(b => (
                <option key={b.id} value={b.title}>
                  {b.title} (Rack {b.location.rackNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Message to Librarian *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Provide any details about the book you need, shelf discrepancies, or course requirements..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setContactModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
