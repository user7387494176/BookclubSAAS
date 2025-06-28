import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Tag, Edit3, Trash2, BookOpen, Calendar, Filter, Book, Target, Lightbulb, Globe, Trophy, Heart } from 'lucide-react';
import { Note, Book as BookType } from '../types';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [books, setBooks] = useState<BookType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    content: '',
    tags: [] as string[],
    bookId: ''
  });

  // Get user reading goals from localStorage
  const getUserGoals = () => {
    try {
      const preferences = localStorage.getItem('focusreads-preferences');
      if (preferences) {
        const parsed = JSON.parse(preferences);
        return parsed.readingGoals || [];
      }
    } catch (error) {
      console.error('Error parsing preferences:', error);
    }
    return [];
  };

  const userGoals = getUserGoals();

  // Reading goal categories with icons
  const readingGoalCategories = {
    'Personal Growth & Development': {
      icon: <Target className="w-4 h-4" />,
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      goals: [
        'Learn New Skills or Knowledge',
        'Improve Mental Health',
        'Develop Empathy and Understanding',
        'Establish a Reading Habit'
      ]
    },
    'Entertainment & Enjoyment': {
      icon: <Heart className="w-4 h-4" />,
      color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
      goals: [
        'Escape into a Different World',
        'Discover New Authors or Genres',
        'Set a Reading Target',
        'Join a Book Club or Discussion Group'
      ]
    },
    'Intellectual Curiosity': {
      icon: <Lightbulb className="w-4 h-4" />,
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      goals: [
        'Explore New Topics or Subjects',
        'Stay Informed on Current Events',
        'Enhance Critical Thinking',
        'Read Classic Literature'
      ]
    },
    'Social & Community': {
      icon: <Globe className="w-4 h-4" />,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      goals: [
        'Connect with Others Through Reading',
        'Support Literacy and Education',
        'Read with a Child or Young Adult',
        'Participate in Reading Challenges'
      ]
    },
    'Personal Achievement': {
      icon: <Trophy className="w-4 h-4" />,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      goals: [
        'Set Page or Word Goals',
        'Finish a Long or Challenging Book',
        'Read Outside Your Comfort Zone',
        'Track Reading Progress'
      ]
    }
  };

  const getGoalCategory = (goal: string) => {
    for (const [categoryName, category] of Object.entries(readingGoalCategories)) {
      if (category.goals.includes(goal)) {
        return { name: categoryName, ...category };
      }
    }
    return null;
  };

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('focusreads-notes') || '[]');
    const savedBooks = JSON.parse(localStorage.getItem('focusreads-books') || '[]');
    setNotes(savedNotes);
    setBooks(savedBooks);
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('focusreads-notes', JSON.stringify(updatedNotes));
  };

  const handleAddNote = () => {
    if (!newNote.content.trim() || !newNote.bookId) return;

    const note: Note = {
      id: Date.now().toString(),
      bookId: newNote.bookId,
      content: newNote.content,
      tags: newNote.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveNotes([...notes, note]);
    setNewNote({ content: '', tags: [], bookId: '' });
    setShowAddNote(false);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      content: note.content,
      tags: note.tags,
      bookId: note.bookId
    });
    setShowAddNote(true);
  };

  const handleUpdateNote = () => {
    if (!editingNote || !newNote.content.trim()) return;

    const updatedNote: Note = {
      ...editingNote,
      content: newNote.content,
      tags: newNote.tags,
      bookId: newNote.bookId,
      updatedAt: new Date().toISOString()
    };

    const updatedNotes = notes.map(note => 
      note.id === editingNote.id ? updatedNote : note
    );

    saveNotes(updatedNotes);
    setEditingNote(null);
    setNewNote({ content: '', tags: [], bookId: '' });
    setShowAddNote(false);
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !newNote.tags.includes(tag.trim())) {
      setNewNote(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getAllTags = () => {
    const allTags = notes.flatMap(note => note.tags);
    return [...new Set(allTags)];
  };

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBook = selectedBook === 'all' || note.bookId === selectedBook;
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
    
    return matchesSearch && matchesBook && matchesTag;
  });

  return (
    <div className="min-h-screen theme-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold theme-text mb-2">
              Your Notes
            </h1>
            <p className="theme-text-secondary">
              Capture and organize your thoughts while reading
            </p>
          </div>
          <button
            onClick={() => setShowAddNote(true)}
            disabled={books.length === 0}
            className="mt-4 sm:mt-0 themed-button-primary px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span>Add Note</span>
          </button>
        </div>

        {/* Reading Goals Section */}
        {userGoals.length > 0 && (
          <div className="mb-8 themed-card rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 theme-primary-text" />
              <h2 className="text-lg font-semibold theme-text">Your Reading Goals</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {userGoals.map((goal, index) => {
                const category = getGoalCategory(goal);
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${category ? category.color : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <div className="flex items-center space-x-2">
                      {category?.icon}
                      <span className="text-sm font-medium">{goal}</span>
                    </div>
                    {category && (
                      <div className="text-xs opacity-75 mt-1">{category.name}</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Tip:</strong> Use your notes to track progress toward these goals. 
                Tag notes with goal-related keywords to easily find insights later.
              </p>
            </div>
          </div>
        )}

        {/* No Books Warning */}
        {books.length === 0 && (
          <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Book className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold theme-text mb-2">
                  No Books in Your Library
                </h3>
                <p className="theme-text-secondary mb-4">
                  You need to add books to your library before you can create notes. Notes are always associated with specific books to help you organize your thoughts and insights.
                </p>
                <Link
                  to="/books"
                  className="themed-button-primary px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Your First Book</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filters - Only show if there are books */}
        {books.length > 0 && (
          <div className="themed-card rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-secondary" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Book Filter */}
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-secondary" />
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Books</option>
                  {books.map(book => (
                    <option key={book.id} value={book.id}>{book.title}</option>
                  ))}
                </select>
              </div>

              {/* Tag Filter */}
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-secondary" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Tags</option>
                  {getAllTags().map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <div key={note.id} className="themed-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2 text-sm theme-text-secondary">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">{getBookTitle(note.bookId)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-1 theme-text-secondary hover:theme-primary-text transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 theme-text-secondary hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="theme-text mb-4 line-clamp-4">
                  {note.content}
                </p>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center text-xs theme-text-secondary">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 theme-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium theme-text mb-2">
              No notes found
            </h3>
            <p className="theme-text-secondary mb-6">
              Start adding notes to capture your reading insights
            </p>
            <button
              onClick={() => setShowAddNote(true)}
              className="themed-button-primary px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Note</span>
            </button>
          </div>
        ) : null}

        {/* Add/Edit Note Modal */}
        {showAddNote && books.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="themed-card rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold theme-text mb-6">
                  {editingNote ? 'Edit Note' : 'Add New Note'}
                </h3>

                {/* Book Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium theme-text mb-2">
                    Book
                  </label>
                  <select
                    value={newNote.bookId}
                    onChange={(e) => setNewNote(prev => ({ ...prev, bookId: e.target.value }))}
                    className="w-full px-3 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a book</option>
                    {books.map(book => (
                      <option key={book.id} value={book.id}>{book.title}</option>
                    ))}
                  </select>
                </div>

                {/* Note Content */}
                <div className="mb-4">
                  <label className="block text-sm font-medium theme-text mb-2">
                    Note Content
                  </label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your note here..."
                    rows={6}
                    className="w-full px-3 py-2 themed-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <label className="block text-sm font-medium theme-text mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {newNote.tags.map(tag => (
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
                  
                  {/* Suggested tags based on reading goals */}
                  {userGoals.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs theme-text-secondary mb-2">Suggested tags based on your reading goals:</p>
                      <div className="flex flex-wrap gap-1">
                        {userGoals.slice(0, 5).map(goal => {
                          const shortTag = goal.split(' ').slice(0, 2).join(' ');
                          return (
                            <button
                              key={goal}
                              onClick={() => addTag(shortTag)}
                              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                            >
                              {shortTag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowAddNote(false);
                      setEditingNote(null);
                      setNewNote({ content: '', tags: [], bookId: '' });
                    }}
                    className="px-4 py-2 theme-text-secondary hover:theme-text transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingNote ? handleUpdateNote : handleAddNote}
                    disabled={!newNote.content.trim() || !newNote.bookId}
                    className="themed-button-primary px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingNote ? 'Update Note' : 'Add Note'}
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

export default Notes;