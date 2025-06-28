import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShoppingCart, Plus, Star, BookOpen, Check, RefreshCw, Settings, Target } from 'lucide-react';
import { AmazonBooksService, AmazonBook } from '../services/amazonBooks';

const Recommendations: React.FC = () => {
  const [books, setBooks] = useState<AmazonBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [readBooks, setReadBooks] = useState<Set<string>>(new Set());
  const [refreshingBook, setRefreshingBook] = useState<string | null>(null);
  const [showSurveyPrompt, setShowSurveyPrompt] = useState(false);

  const genres = ['all', 'fiction', 'non-fiction', 'mystery', 'science-fiction'];

  useEffect(() => {
    loadBooks();
  }, [selectedGenre]);

  useEffect(() => {
    // Load read books from localStorage
    const myBooks = JSON.parse(localStorage.getItem('focusreads-books') || '[]');
    const readBookIds = new Set(myBooks.filter((book: any) => book.status === 'completed').map((book: any) => book.id));
    setReadBooks(readBookIds);

    // Check if user has taken survey
    const preferences = localStorage.getItem('focusreads-preferences');
    if (!preferences) {
      setShowSurveyPrompt(true);
    }
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const booksData = await AmazonBooksService.getBooksByGenre(selectedGenre, 8);
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
    // Add to my books as completed
    const book = books.find(b => b.id === bookId);
    if (book) {
      const existingBooks = JSON.parse(localStorage.getItem('focusreads-books') || '[]');
      const bookWithStatus = { ...book, status: 'completed', dateAdded: new Date().toISOString() };
      
      // Remove if already exists and add with new status
      const filteredBooks = existingBooks.filter((b: any) => b.id !== bookId);
      localStorage.setItem('focusreads-books', JSON.stringify([...filteredBooks, bookWithStatus]));
      
      // Update local state
      setReadBooks(prev => new Set([...prev, bookId]));
      
      // Generate new recommendation for this genre
      await generateNewRecommendation(bookId, book.genre || 'fiction');
    }
  };

  const generateNewRecommendation = async (excludeId: string, genre: string) => {
    setRefreshingBook(excludeId);
    
    try {
      // Get all currently displayed book IDs to exclude
      const currentBookIds = books.map(b => b.id);
      const newBooks = await AmazonBooksService.getRandomBooksByGenre(genre, currentBookIds);
      
      if (newBooks.length > 0) {
        // Replace the read book with a new recommendation
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Finding perfect books for you...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Recommended for You
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover books tailored to your preferences and reading goals
          </p>
        </div>

        {/* Survey Prompt */}
        {showSurveyPrompt && (
          <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Get Personalized Recommendations
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Take our quick survey to receive book recommendations tailored specifically to your reading preferences, goals, and interests.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/survey"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Take Survey (2 minutes)</span>
                  </Link>
                  <button
                    onClick={() => setShowSurveyPrompt(false)}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Genre Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === genre
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

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
                  <div className="flex items-center space-x-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Recommended</span>
                  </div>
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
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
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
              Try selecting a different genre or take our survey to get personalized recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;