import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShoppingCart, Heart, Star, BookOpen, Check, RefreshCw, Settings, Target, Download, Upload, TrendingUp } from 'lucide-react';
import { AmazonBooksService, AmazonBook } from '../services/amazonBooks';

interface UserPreferences {
  genres: string[];
  mood: string;
  readingGoals: string[];
  readingTime: string;
  preferredLength: string;
}

const Recommendations: React.FC = () => {
  const [books, setBooks] = useState<AmazonBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [readBooks, setReadBooks] = useState<Set<string>>(new Set());
  const [refreshingBook, setRefreshingBook] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [isTrendingMode, setIsTrendingMode] = useState(false);

  // Trending genres when no survey is completed
  const trendingGenres = [
    'Fiction',
    'Mystery & Thriller', 
    'Romance',
    'Science Fiction & Fantasy',
    'Self-Help',
    'Business & Investing',
    'Health & Wellness',
    'Biographies & Memoirs'
  ];

  useEffect(() => {
    loadUserPreferences();
    loadBooks();
  }, [selectedGenre]);

  useEffect(() => {
    // Load read books from localStorage
    const myBooks = JSON.parse(localStorage.getItem('focusreads-books') || '[]');
    const readBookIds = new Set(myBooks.filter((book: any) => book.status === 'completed').map((book: any) => book.id));
    setReadBooks(readBookIds);
  }, []);

  const loadUserPreferences = () => {
    const preferences = localStorage.getItem('focusreads-preferences');
    if (preferences) {
      const parsedPreferences: UserPreferences = JSON.parse(preferences);
      setUserPreferences(parsedPreferences);
      setIsTrendingMode(false);
      
      // Use user's selected genres directly
      setAvailableGenres(['all', ...parsedPreferences.genres]);
    } else {
      // No survey completed - use trending genres
      setUserPreferences(null);
      setIsTrendingMode(true);
      setAvailableGenres(['all', ...trendingGenres]);
    }
  };

  const loadBooks = async () => {
    setLoading(true);
    try {
      let booksData: AmazonBook[];
      
      if (userPreferences && selectedGenre === 'all') {
        // Load books from user's preferred genres
        const preferredGenres = userPreferences.genres;
        
        // Get books from each preferred genre
        const allBooks: AmazonBook[] = [];
        const booksPerGenre = Math.ceil(8 / preferredGenres.length);
        
        for (const genre of preferredGenres) {
          const genreBooks = await AmazonBooksService.getBooksByGenre(genre.toLowerCase().replace(/\s+/g, '-'), booksPerGenre);
          allBooks.push(...genreBooks);
        }
        
        booksData = allBooks.slice(0, 8);
      } else if (!userPreferences && selectedGenre === 'all') {
        // No survey - load trending books
        const allBooks: AmazonBook[] = [];
        const booksPerGenre = Math.ceil(8 / trendingGenres.length);
        
        for (const genre of trendingGenres) {
          const genreBooks = await AmazonBooksService.getBooksByGenre(genre.toLowerCase().replace(/\s+/g, '-'), booksPerGenre);
          allBooks.push(...genreBooks);
        }
        
        booksData = allBooks.slice(0, 8);
      } else {
        // Load books for specific genre
        const genreKey = selectedGenre.toLowerCase().replace(/\s+/g, '-');
        booksData = await AmazonBooksService.getBooksByGenre(genreKey, 8);
      }
      
      setBooks(booksData);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToMyBooks = (book: AmazonBook) => {
    const existingBooks = JSON.parse(localStorage.getItem('focusreads-books') || '[]');
    const isAlreadyAdded = existingBooks.some((b: any) => b.id === book.id);
    
    if (!isAlreadyAdded) {
      const bookWithStatus = { ...book, status: 'want-to-read', dateAdded: new Date().toISOString() };
      localStorage.setItem('focusreads-books', JSON.stringify([...existingBooks, bookWithStatus]));
    }
  };

  const markAsRead = async (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      const existingBooks = JSON.parse(localStorage.getItem('focusreads-books') || '[]');
      const bookWithStatus = { ...book, status: 'completed', dateAdded: new Date().toISOString() };
      
      const filteredBooks = existingBooks.filter((b: any) => b.id !== bookId);
      localStorage.setItem('focusreads-books', JSON.stringify([...filteredBooks, bookWithStatus]));
      
      setReadBooks(prev => new Set([...prev, bookId]));
      
      await generateNewRecommendation(bookId, book.genre || 'fiction');
    }
  };

  const generateNewRecommendation = async (excludeId: string, genre: string) => {
    setRefreshingBook(excludeId);
    
    try {
      const currentBookIds = books.map(b => b.id);
      const newBooks = await AmazonBooksService.getRandomBooksByGenre(genre.toLowerCase(), currentBookIds);
      
      if (newBooks.length > 0) {
        setBooks(prev => prev.map(book => 
          book.id === excludeId ? newBooks[0] : book
        ));
      }
    } catch (error) {
      console.error('Failed to generate new recommendation:', error);
    } finally {
      setRefreshingBook(null);
    }
  };

  const exportData = () => {
    const data = {
      books: JSON.parse(localStorage.getItem('focusreads-books') || '[]'),
      notes: JSON.parse(localStorage.getItem('focusreads-notes') || '[]'),
      preferences: JSON.parse(localStorage.getItem('focusreads-preferences') || '{}'),
      pomodoroSessions: JSON.parse(localStorage.getItem('focusreads-pomodoro-sessions') || '[]'),
      pomodoroTotal: localStorage.getItem('focusreads-pomodoro-total') || '0',
      settings: {
        theme: localStorage.getItem('focusreads-theme') || 'serenityBlue',
        dark: localStorage.getItem('focusreads-dark') || 'false',
        background: localStorage.getItem('focusreads-background') || ''
      },
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusreads-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const getGenreDisplayName = (genre: string) => {
    if (genre === 'all') return 'All Genres';
    return genre;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {isTrendingMode ? 'Finding trending books for you...' : 'Finding perfect books for you...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isTrendingMode ? 'Trending Genres' : 'Personalized Recommendations'}
                </h1>
                {isTrendingMode && <TrendingUp className="w-6 h-6 text-orange-500" />}
                {userPreferences && <Target className="w-6 h-6 text-green-500" />}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {isTrendingMode 
                  ? 'Complete Survey to Tailor Your Recommendations'
                  : 'Books curated based on your preferences and reading goals'
                }
              </p>
            </div>
            
            {/* Export/Import Controls */}
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={exportData}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              
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
          </div>
        </div>

        {/* Survey Prompt for trending mode */}
        {isTrendingMode && (
          <div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Currently Showing Trending Genres
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  These are popular books across trending genres. Take our quick survey to receive book recommendations tailored specifically to your reading preferences, goals, and interests.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/survey"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Take Survey (2 minutes)</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personalized Genre Filter for survey users */}
        {userPreferences && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Preferred Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedGenre === genre
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {getGenreDisplayName(genre)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Genre Filter for non-survey users */}
        {isTrendingMode && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Trending Genres
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedGenre === genre
                      ? 'bg-orange-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {getGenreDisplayName(genre)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
              {refreshingBook === book.id && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center z-10 rounded-lg">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Finding new recommendation...</p>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  {userPreferences && (
                    <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <Target className="w-3 h-3" />
                      <span>For You</span>
                    </div>
                  )}
                  {isTrendingMode && (
                    <div className="flex items-center space-x-1 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      <span>Trending</span>
                    </div>
                  )}
                  {book.rating && (
                    <div className="flex items-center space-x-1 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white px-2 py-1 rounded-full text-xs font-medium">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{book.rating}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">by {book.author}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{book.publishDate}</span>
                    <span>•</span>
                    <span className="capitalize">{book.genre?.replace('-', ' ')}</span>
                    <span>•</span>
                    <span>{book.audience}</span>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {book.description}
                </p>

                <div className="space-y-3">
                  {/* Already Read Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => markAsRead(book.id)}
                      disabled={readBooks.has(book.id) || refreshingBook === book.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center space-x-2 ${
                        readBooks.has(book.id)
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 cursor-not-allowed'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{readBooks.has(book.id) ? 'Already Read' : 'Mark as Read'}</span>
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    <a
                      href={book.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Buy</span>
                      {book.price && <span className="text-xs">({book.price})</span>}
                    </a>
                    <button
                      onClick={() => addToMyBooks(book)}
                      className="bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Interested</span>
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/book-sample/${book.id}`}
                      className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center justify-center space-x-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read Sample</span>
                    </Link>
                    <a
                      href={book.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Details</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No books found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {userPreferences 
                ? 'Try selecting a different genre or update your preferences.'
                : 'Try selecting a different genre or take our survey for personalized recommendations.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;