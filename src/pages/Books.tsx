import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, BookOpen, Calendar, Tag, Star, Trash2, Edit3 } from 'lucide-react';
import { Book } from '../types';

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    cover: '',
    status: 'want-to-read' as 'reading' | 'completed' | 'want-to-read',
    tags: [] as string[]
  });

  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem('focusreads-books') || '[]');
    setBooks(savedBooks);
  }, []);

  const saveBooks = (updatedBooks: Book[]) => {
    setBooks(updatedBooks);
    localStorage.setItem('focusreads-books', JSON.stringify(updatedBooks));
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
      dateAdded: new Date().toISOString()
    };

    saveBooks([...books, book]);
    setNewBook({ title: '', author: '', isbn: '', cover: '', status: 'want-to-read', tags: [] });
    setShowAddBook(false);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      cover: book.cover || '',
      status: book.status || 'want-to-read',
      tags: book.tags || []
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
      tags: newBook.tags
    };

    const updatedBooks = books.map(book => 
      book.id === editingBook.id ? updatedBook : book
    );

    saveBooks(updatedBooks);
    setEditingBook(null);
    setNewBook({ title: '', author: '', isbn: '', cover: '', status: 'want-to-read', tags: [] });
    setShowAddBook(false);
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

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getBookCounts = () => {
    return {
      total: books.length,
      reading: books.filter(b => b.status === 'reading').length,
      completed: books.filter(b => b.status === 'completed').length,
      wantToRead: books.filter(b => b.status === 'want-to-read').length
    };
  };

  const counts = getBookCounts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Books
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your reading journey and organize your library
            </p>
          </div>
          <button
            onClick={() => setShowAddBook(true)}
            className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Book</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{counts.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Books</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{counts.reading}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reading</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{counts.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{counts.wantToRead}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Want to Read</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="reading">Currently Reading</option>
                <option value="completed">Completed</option>
                <option value="want-to-read">Want to Read</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <div key={book.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">by {book.author}</p>

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
                        <span className="text-xs text-gray-500 dark:text-gray-400">
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
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="want-to-read">Want to Read</option>
                      <option value="reading">Currently Reading</option>
                      <option value="completed">Completed</option>
                    </select>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditBook(book)}
                        className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center space-x-1"
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
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
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
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No books found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start building your personal library by adding some books
            </p>
            <button
              onClick={() => setShowAddBook(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Book</span>
            </button>
          </div>
        )}

        {/* Add/Edit Book Modal */}
        {showAddBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newBook.title}
                      onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Book title"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={newBook.author}
                      onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Author name"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* ISBN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ISBN
                    </label>
                    <input
                      type="text"
                      value={newBook.isbn}
                      onChange={(e) => setNewBook(prev => ({ ...prev, isbn: e.target.value }))}
                      placeholder="ISBN"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={newBook.status}
                      onChange={(e) => setNewBook(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="want-to-read">Want to Read</option>
                      <option value="reading">Currently Reading</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Cover URL */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={newBook.cover}
                    onChange={(e) => setNewBook(prev => ({ ...prev, cover: e.target.value }))}
                    placeholder="https://example.com/book-cover.jpg"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Leave empty to use a generated cover
                  </p>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowAddBook(false);
                      setEditingBook(null);
                      setNewBook({ title: '', author: '', isbn: '', cover: '', status: 'want-to-read', tags: [] });
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingBook ? handleUpdateBook : handleAddBook}
                    disabled={!newBook.title.trim() || !newBook.author.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
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