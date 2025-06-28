import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, BookOpen, Calendar, Tag, Star, Trash2, Edit3, Loader, AlertCircle, CheckCircle, Download, Upload, Settings, FileText, SortAsc } from 'lucide-react';
import { Book } from '../types';
import { ISBNLookupService, ISBNBookData } from '../services/isbnLookup';
import { PDFExportService } from '../services/pdfExport';

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isbnLookupLoading, setIsbnLookupLoading] = useState(false);
  const [isbnLookupStatus, setIsbnLookupStatus] = useState<'idle' | 'success' | 'error' | 'not-found'>('idle');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    cover: '',
    status: 'want-to-read' as 'reading' | 'completed' | 'want-to-read',
    tags: [] as string[],
    genre: '',
    description: ''
  });

  // Check if user has completed survey
  const hasCompletedSurvey = () => {
    const preferences = localStorage.getItem('focusreads-preferences');
    return preferences && JSON.parse(preferences).genres && JSON.parse(preferences).genres.length > 0;
  };

  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem('focusreads-books') || '[]');
    setBooks(savedBooks);
    setFilteredBooks(savedBooks);
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchTerm, statusFilter]);

  const filterAndSortBooks = () => {
    let filtered = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort alphabetically by title when showing all books
    if (statusFilter === 'all') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredBooks(filtered);
  };

  const saveBooks = (updatedBooks: Book[]) => {
    setBooks(updatedBooks);
    localStorage.setItem('focusreads-books', JSON.stringify(updatedBooks));
  };

  const handleISBNLookup = async () => {
    if (!newBook.isbn.trim()) return;
    
    setIsbnLookupLoading(true);
    setIsbnLookupStatus('idle');
    
    try {
      const bookData = await ISBNLookupService.lookupByISBN(newBook.isbn);
      
      if (bookData) {
        setNewBook(prev => ({
          ...prev,
          title: bookData.title,
          author: bookData.author,
          cover: bookData.cover,
          isbn: ISBNLookupService.formatISBN(bookData.isbn),
          genre: bookData.genre || '',
          description: bookData.description || '',
          tags: bookData.tags || []
        }));
        setIsbnLookupStatus('success');
      } else {
        setIsbnLookupStatus('not-found');
      }
    } catch (error) {
      console.error('ISBN lookup failed:', error);
      setIsbnLookupStatus('error');
    } finally {
      setIsbnLookupLoading(false);
    }
  };

  const handleAddBook = () => {
    if (!newBook.title.trim() || !newBook.author.trim()) return;

    const book: Book = {
      id: Date.now().toString(),
      title: newBook.title,
      author: newBook.author,
      isbn: newBook.isbn,
      cover: newBook.cover || `https://ui-avatars.com/api/?name=${encodeURIComponent(newBook.title)}&background=4F46E5&color=fff&size=400`,
      status: newBook.status,
      tags: newBook.tags,
      genre: newBook.genre,
      description: newBook.description,
      dateAdded: new Date().toISOString()
    };

    saveBooks([...books, book]);
    resetForm();
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      cover: book.cover || '',
      status: book.status || 'want-to-read',
      tags: book.tags || [],
      genre: book.genre || '',
      description: book.description || ''
    });
    setShowAddBook(true);
  };

  const handleUpdateBook = () => {
    if (!editingBook || !newBook.title.trim() || !newBook.author.trim()) return;

    const updatedBook: Book = {
      ...editingBook,
      title: newBook.title,
      author: newBook.author,
      isbn: newBook.isbn,
      cover: newBook.cover || editingBook.cover,
      status: newBook.status,
      tags: newBook.tags,
      genre: newBook.genre,
      description: newBook.description
    };

    const updatedBooks = books.map(book => 
      book.id === editingBook.id ? updatedBook : book
    );

    saveBooks(updatedBooks);
    resetForm();
  };

  const handleDeleteBook = (bookId: string) => {
    if (confirm('Are you sure you want to remove this book?')) {
      const updatedBooks = books.filter(book => book.id !== bookId);
      saveBooks(updatedBooks);
    }
  };

  const updateBookStatus = (bookId: string, status: 'reading' | 'completed' | 'want-to-read') => {
    const updatedBooks = books.map(book =>
      book.id === bookId ? { ...book, status } : book
    );
    saveBooks(updatedBooks);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !newBook.tags.includes(tag.trim())) {
      setNewBook(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewBook(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const resetForm = () => {
    setEditingBook(null);
    setNewBook({ 
      title: '', 
      author: '', 
      isbn: '', 
      cover: '', 
      status: 'want-to-read', 
      tags: [],
      genre: '',
      description: ''
    });
    setShowAddBook(false);
    setIsbnLookupStatus('idle');
  };

  const exportToPDF = async () => {
    await PDFExportService.exportToPDF();
  };

  const exportToJSON = async () => {
    await PDFExportService.exportToJSON();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Import all data
        if (data.books) localStorage.setItem('focusreads-books', JSON.stringify(data.books));
        if (data.notes) localStorage.setItem('focusreads-notes', JSON.stringify(data.notes));
        if (data.preferences) localStorage.setItem('focusreads-preferences', JSON.stringify(data.preferences));
        if (data.pomodoroSessions) localStorage.setItem('focusreads-pomodoro-sessions', JSON.stringify(data.pomodoroSessions));
        if (data.pomodoroTotal) localStorage.setItem('focusreads-pomodoro-total', data.pomodoroTotal);
        if (data.settings) {
          if (data.settings.theme) localStorage.setItem('focusreads-theme', data.settings.theme);
          if (data.settings.dark) localStorage.setItem('focusreads-dark', data.settings.dark);
          if (data.settings.background) localStorage.setItem('focusreads-background', data.settings.background);
        }

        alert('Data imported successfully! Please refresh the page to see your imported data.');
        window.location.reload();
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reading': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'want-to-read': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'reading': return 'Currently Reading';
      case 'completed': return 'Completed';
      case 'want-to-read': return 'Want to Read';
      default: return status;
    }
  };

  const getBookCounts = () => {
    return {
      total: books.length,
      reading: books.filter(b => b.status === 'reading').length,
      completed: books.filter(b => b.status === 'completed').length,
      wantToRead: books.filter(b => b.status === 'want-to-read').length
    };
  };

  const counts = getBookCounts();

  const handleStatClick = (filter: string) => {
    setStatusFilter(filter);
    setSearchTerm(''); // Clear search when filtering by status
  };

  return (
    <div className="min-h-screen theme-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold theme-text mb-2">
              My Books
            </h1>
            <p className="theme-text-secondary">
              Track your reading journey and organize your library
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
            {/* Update Recommendations Button */}
            {hasCompletedSurvey() && (
              <Link
                to="/update-survey"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Update My Recommendations</span>
              </Link>
            )}
            
            {/* Export/Import Controls */}
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={exportToPDF}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg transition-colors inline-flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Export as PDF</span>
                  </button>
                  <button
                    onClick={exportToJSON}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg transition-colors inline-flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export as JSON</span>
                  </button>
                </div>
              </div>
              
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Import Data</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>
            
            <button
              onClick={() => setShowAddBook(true)}
              className="themed-button-primary px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Book</span>
            </button>
          </div>
        </div>

        {/* Survey Prompt */}
        {!hasCompletedSurvey() && (
          <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Settings className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Get Personalized Book Recommendations
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Complete our quick survey to receive book recommendations tailored to your reading preferences, mood, and goals.
                </p>
                <Link
                  to="/survey"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Take Survey (2 minutes)</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats - Now Clickable */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => handleStatClick('all')}
            className={`themed-card rounded-lg shadow-lg p-6 text-center transition-all hover:shadow-xl hover:scale-105 ${
              statusFilter === 'all' ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''
            }`}
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <SortAsc className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div className="text-2xl font-bold theme-text">{counts.total}</div>
            </div>
            <div className="text-sm theme-text-secondary">All Books</div>
            {statusFilter === 'all' && (
              <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Sorted A-Z</div>
            )}
          </button>
          
          <button
            onClick={() => handleStatClick('reading')}
            className={`themed-card rounded-lg shadow-lg p-6 text-center transition-all hover:shadow-xl hover:scale-105 ${
              statusFilter === 'reading' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{counts.reading}</div>
            <div className="text-sm theme-text-secondary">Reading</div>
          </button>
          
          <button
            onClick={() => handleStatClick('completed')}
            className={`themed-card rounded-lg shadow-lg p-6 text-center transition-all hover:shadow-xl hover:scale-105 ${
              statusFilter === 'completed' ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : ''
            }`}
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{counts.completed}</div>
            <div className="text-sm theme-text-secondary">Completed</div>
          </button>
          
          <button
            onClick={() => handleStatClick('want-to-read')}
            className={`themed-card rounded-lg shadow-lg p-6 text-center transition-all hover:shadow-xl hover:scale-105 ${
              statusFilter === 'want-to-read' ? 'ring-2 ring-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : ''
            }`}
          >
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{counts.wantToRead}</div>
            <div className="text-sm theme-text-secondary">Want to Read</div>
          </button>
        </div>

        {/* Filters */}
        <div className="themed-card rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-secondary" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-secondary" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="reading">Currently Reading</option>
                <option value="completed">Completed</option>
                <option value="want-to-read">Want to Read</option>
              </select>
            </div>
          </div>
          
          {statusFilter !== 'all' && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm theme-text-secondary">
                Showing {filteredBooks.length} of {counts.total} books
              </div>
              <button
                onClick={() => handleStatClick('all')}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
              >
                Show All Books
              </button>
            </div>
          )}
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <div key={book.id} className="themed-card rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={book.cover || `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=4F46E5&color=fff&size=400`}
                    alt={book.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status || 'want-to-read')}`}>
                      {getStatusLabel(book.status || 'want-to-read')}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold theme-text mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="theme-text-secondary mb-3">by {book.author}</p>

                  {book.tags && book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {book.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {book.tags.length > 3 && (
                        <span className="text-xs theme-text-secondary">
                          +{book.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    {/* Status Selector */}
                    <select
                      value={book.status || 'want-to-read'}
                      onChange={(e) => updateBookStatus(book.id, e.target.value as any)}
                      className="w-full px-3 py-2 text-sm themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="want-to-read">Want to Read</option>
                      <option value="reading">Currently Reading</option>
                      <option value="completed">Completed</option>
                    </select>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditBook(book)}
                        className="flex-1 themed-button-secondary px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center space-x-1"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {book.dateAdded && (
                    <div className="flex items-center text-xs theme-text-secondary mt-3 pt-3 border-t theme-border">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Added {new Date(book.dateAdded).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 theme-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium theme-text mb-2">
              {statusFilter === 'all' ? 'No books found' : `No ${statusFilter.replace('-', ' ')} books`}
            </h3>
            <p className="theme-text-secondary mb-6">
              {statusFilter === 'all' 
                ? 'Start building your personal library by adding some books'
                : `You don't have any books marked as ${statusFilter.replace('-', ' ')} yet`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowAddBook(true)}
                className="themed-button-primary px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Book</span>
              </button>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => handleStatClick('all')}
                  className="themed-button-secondary px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View All Books
                </button>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Book Modal */}
        {showAddBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="themed-card rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold theme-text mb-6">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h3>

                {/* ISBN Lookup Section */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg theme-border">
                  <h4 className="font-medium theme-text mb-3">Quick Add with ISBN</h4>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newBook.isbn}
                      onChange={(e) => setNewBook(prev => ({ ...prev, isbn: e.target.value }))}
                      placeholder="Enter ISBN (10 or 13 digits)"
                      className="flex-1 px-3 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleISBNLookup}
                      disabled={!newBook.isbn.trim() || isbnLookupLoading}
                      className="themed-button-primary px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isbnLookupLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      <span>Lookup</span>
                    </button>
                  </div>
                  
                  {/* Lookup Status */}
                  {isbnLookupStatus === 'success' && (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Book information found and populated!</span>
                    </div>
                  )}
                  {isbnLookupStatus === 'not-found' && (
                    <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Book not found in database. Please fill in details manually.</span>
                    </div>
                  )}
                  {isbnLookupStatus === 'error' && (
                    <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Error looking up book. Please try again or fill in manually.</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newBook.title}
                      onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Book title"
                      className="w-full px-3 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={newBook.author}
                      onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Author name"
                      className="w-full px-3 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Genre */}
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2">
                      Genre
                    </label>
                    <input
                      type="text"
                      value={newBook.genre}
                      onChange={(e) => setNewBook(prev => ({ ...prev, genre: e.target.value }))}
                      placeholder="Fiction, Non-fiction, etc."
                      className="w-full px-3 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2">
                      Status
                    </label>
                    <select
                      value={newBook.status}
                      onChange={(e) => setNewBook(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="want-to-read">Want to Read</option>
                      <option value="reading">Currently Reading</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Cover URL */}
                <div className="mb-4">
                  <label className="block text-sm font-medium theme-text mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={newBook.cover}
                    onChange={(e) => setNewBook(prev => ({ ...prev, cover: e.target.value }))}
                    placeholder="https://example.com/book-cover.jpg"
                    className="w-full px-3 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-xs theme-text-secondary mt-1">
                    Leave empty to use a generated cover
                  </p>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium theme-text mb-2">
                    Description
                  </label>
                  <textarea
                    value={newBook.description}
                    onChange={(e) => setNewBook(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Book description..."
                    rows={3}
                    className="w-full px-3 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <label className="block text-sm font-medium theme-text mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {newBook.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add a tag and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 theme-text-secondary hover:theme-text transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingBook ? handleUpdateBook : handleAddBook}
                    disabled={!newBook.title.trim() || !newBook.author.trim()}
                    className="themed-button-primary px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingBook ? 'Update Book' : 'Add Book'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;