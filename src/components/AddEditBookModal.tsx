import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book, BookLocation } from '../types/library';
import { X, Save, Layers, MapPin, Image, Check } from 'lucide-react';

export const AddEditBookModal: React.FC = () => {
  const {
    isAddEditModalOpen,
    closeAddEditModal,
    editingBook,
    saveBook
  } = useLibrary();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: 'University Press',
    edition: '1st Edition',
    publicationYear: 2024,
    category: 'Computer Science',
    department: 'Computer Science & Engineering',
    description: '',
    totalCopies: 5,
    coverImage: '/src/assets/images/book_cover_dbms_1790654202444.jpg',
    block: 'A',
    floor: '2nd Floor',
    room: 'Digital Library',
    rackNumber: 'R-05',
    shelfNumber: 'S-03',
    position: '4th Book from Left',
    positionIndex: 4,
    totalBooksOnShelf: 16,
    aisle: 'Aisle 3',
    keywords: ''
  });

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        isbn: editingBook.isbn,
        publisher: editingBook.publisher,
        edition: editingBook.edition,
        publicationYear: editingBook.publicationYear,
        category: editingBook.category,
        department: editingBook.department,
        description: editingBook.description,
        totalCopies: editingBook.totalCopies,
        coverImage: editingBook.coverImage,
        block: editingBook.location.block,
        floor: editingBook.location.floor,
        room: editingBook.location.room,
        rackNumber: editingBook.location.rackNumber,
        shelfNumber: editingBook.location.shelfNumber,
        position: editingBook.location.position,
        positionIndex: editingBook.location.positionIndex,
        totalBooksOnShelf: editingBook.location.totalBooksOnShelf,
        aisle: editingBook.location.aisle || 'Aisle 3',
        keywords: editingBook.keywords ? editingBook.keywords.join(', ') : ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '978-' + Math.floor(1000000000 + Math.random() * 9000000000),
        publisher: 'Oxford / MIT Press',
        edition: '2nd Edition',
        publicationYear: 2025,
        category: 'Computer Science',
        department: 'Computer Science & Engineering',
        description: '',
        totalCopies: 6,
        coverImage: '/src/assets/images/book_cover_algorithms_1790654217356.jpg',
        block: 'A',
        floor: '2nd Floor',
        room: 'Digital Library',
        rackNumber: 'R-05',
        shelfNumber: 'S-02',
        position: '3rd Book from Left',
        positionIndex: 3,
        totalBooksOnShelf: 16,
        aisle: 'Aisle 3',
        keywords: 'Computing, Engineering, Systems'
      });
    }
  }, [editingBook, isAddEditModalOpen]);

  if (!isAddEditModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) return;

    const loc: BookLocation = {
      block: formData.block,
      floor: formData.floor,
      room: formData.room,
      rackNumber: formData.rackNumber,
      shelfNumber: formData.shelfNumber,
      position: formData.position,
      positionIndex: Number(formData.positionIndex) || 1,
      totalBooksOnShelf: Number(formData.totalBooksOnShelf) || 16,
      aisle: formData.aisle
    };

    const kwArray = formData.keywords
      ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean)
      : [formData.title, formData.author];

    saveBook({
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn,
      publisher: formData.publisher,
      edition: formData.edition,
      publicationYear: Number(formData.publicationYear),
      category: formData.category,
      department: formData.department,
      description: formData.description || 'Comprehensive university reference textbook.',
      totalCopies: Number(formData.totalCopies),
      coverImage: formData.coverImage,
      location: loc,
      keywords: kwArray
    });
  };

  const coverOptions = [
    { label: 'Database Grid (Navy)', url: '/src/assets/images/book_cover_dbms_1790654202444.jpg' },
    { label: 'Algorithms Nodes (Sapphire)', url: '/src/assets/images/book_cover_algorithms_1790654217356.jpg' },
    { label: 'AI Principles (Cyan & Indigo)', url: '/src/assets/images/book_cover_ai_ml_1790654228932.jpg' },
    { label: 'Microprocessors (Electric Blue)', url: '/src/assets/images/book_cover_circuits_1790654240988.jpg' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base font-display">
              {editingBook ? `Edit: ${editingBook.title}` : 'Add New Book to Library Catalog'}
            </h3>
          </div>
          <button
            onClick={closeAddEditModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Section 1: Book Core Metadata */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1.5 font-display">
              1. Bibliographic Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Distributed Database Systems"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Author(s) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. Dr. Jane Doe & John Smith"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ISBN Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.isbn}
                  onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Publisher
                </label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={e => setFormData({ ...formData, publisher: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Edition
                </label>
                <input
                  type="text"
                  value={formData.edition}
                  onChange={e => setFormData({ ...formData, edition: e.target.value })}
                  placeholder="e.g. 4th Global Edition"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.publicationYear}
                    onChange={e => setFormData({ ...formData, publicationYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Copies
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalCopies}
                    onChange={e => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                  <option value="Business & Management">Business & Management</option>
                  <option value="Robotics & Mechanical">Robotics & Mechanical</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Department
                </label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                  <option value="Mathematics & Statistics">Mathematics & Statistics</option>
                  <option value="School of Management Studies">School of Management Studies</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Short Book Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Overview of topics, textbook syllabus scope, and course prerequisites..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 resize-none"
              />
            </div>
          </div>

          {/* Section 2: Exact Location Configuration (Crucial Requirement) */}
          <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold text-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>2. Exact Physical Shelf & Rack Location Configuration</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              This powers the student &quot;📍 FIND MY BOOK&quot; interactive rack and shelf visualizer.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Library Block *
                </label>
                <select
                  value={formData.block}
                  onChange={e => setFormData({ ...formData, block: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                >
                  <option value="A">Block A (North Tech Wing)</option>
                  <option value="B">Block B (Computing & AI Wing)</option>
                  <option value="C">Block C (Sciences & Management)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Floor Level *
                </label>
                <select
                  value={formData.floor}
                  onChange={e => setFormData({ ...formData, floor: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                >
                  <option value="Ground Floor">Ground Floor</option>
                  <option value="1st Floor">1st Floor</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="3rd Floor">3rd Floor</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Room / Section *
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={e => setFormData({ ...formData, room: e.target.value })}
                  placeholder="e.g. Digital Library"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Rack Number *
                </label>
                <input
                  type="text"
                  value={formData.rackNumber}
                  onChange={e => setFormData({ ...formData, rackNumber: e.target.value })}
                  placeholder="e.g. R-05"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Shelf Number *
                </label>
                <input
                  type="text"
                  value={formData.shelfNumber}
                  onChange={e => setFormData({ ...formData, shelfNumber: e.target.value })}
                  placeholder="e.g. S-03"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Position Description *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={e => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g. 4th Book from Left"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Position Index (#)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.positionIndex}
                  onChange={e => setFormData({ ...formData, positionIndex: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Books on Shelf
                </label>
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={formData.totalBooksOnShelf}
                  onChange={e => setFormData({ ...formData, totalBooksOnShelf: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Aisle Name
                </label>
                <input
                  type="text"
                  value={formData.aisle}
                  onChange={e => setFormData({ ...formData, aisle: e.target.value })}
                  placeholder="e.g. Aisle 3 (North)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Book Cover Selection */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1.5 font-display flex items-center gap-1.5">
              <Image className="w-4 h-4 text-blue-600" />
              <span>3. Book Cover Artwork</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {coverOptions.map(c => {
                const isSelected = formData.coverImage === c.url;
                return (
                  <div
                    key={c.url}
                    onClick={() => setFormData({ ...formData, coverImage: c.url })}
                    className={`cursor-pointer rounded-xl p-2 border text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="aspect-[3/4] w-full rounded-lg overflow-hidden mb-1.5 bg-slate-100 border border-slate-200">
                      <img
                        src={c.url}
                        alt={c.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[10px] font-medium text-slate-800 leading-tight">
                      {c.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Search Keywords */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Search Keywords & Tags (Comma Separated)
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={e => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="SQL, Transactions, Query Optimization, NoSQL..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
            />
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeAddEditModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{editingBook ? 'Save Book Changes' : 'Add to Catalog'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
