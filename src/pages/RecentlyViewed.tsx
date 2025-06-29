import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Eye, Trash2, ArrowLeft, Star, ExternalLink } from 'lucide-react';

interface RecentlyViewedBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre?: string;
  rating?: number;
  amazonUrl: string;
  viewedAt: string;
  interactionType: 'viewed' | 'sample-read';
}

const RecentlyViewed: React.FC = () => {
  const [recentBooks, setRecentBooks] = useState<RecentlyViewedBook[]>([]);

  useEffect(() => {
    loadRecentBooks();
    
    // Set up interval to clean old entries every minute
    const cleanupInterval = setInterval(() => {
      cleanOldEntries();
    }, 60000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, []);

  const loadRecentBooks = () => {
    const stored = localStorage.getItem('focusreads-recent-books');
    if (stored) {
      const books: RecentlyViewedBook[] = JSON.parse(stored);
      const now = Date.now();
      const cutoff = 35 * 60 * 1000; // 35 minutes in milliseconds
      
      // Filter books viewed within last 35 minutes
      const recentBooks = books.filter(book => {
        const viewedTime = new Date(book.viewedAt).getTime();
        return (now - viewedTime) <= cutoff;
      });
      
      // Remove duplicates, keeping the most recent
      const uniqueBooks = recentBooks.reduce((acc, book) => {
        const existing = acc.find(b => b.id === book.id);
        if (!existing || new Date(book.viewedAt) > new Date(existing.viewedAt)) {
          return [...acc.filter(b => b.id !== book.id), book];
        }
        return acc;
      }, [] as RecentlyViewedBook[]);
      
      // Sort by most recent first
      uniqueBooks.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());
      
      setRecentBooks(uniqueBooks);
      
      // Update localStorage with cleaned data
      localStorage.setItem('focusreads-recent-books', JSON.stringify(uniqueBooks));
    }
  };

  const cleanOldEntries = () => {
    const stored = localStorage.getItem('focusreads-recent-books');
    if (stored) {
      const books: RecentlyViewedBook[] = JSON.parse(stored);
      const now = Date.now();
      const cutoff = 35 * 60 * 1000; // 35 minutes in milliseconds
      
      const recentBooks = books.filter(book => {
        const viewedTime = new Date(book.viewedAt).getTime();
        return (now - viewedTime) <= cutoff;
      });
      
      if (recentBooks.length !== books.length) {
        localStorage.setItem('focusreads-recent-books', JSON.stringify(recentBooks));
        setRecentBooks(recentBooks);
      }
    }
  };

  const clearAllRecent = () => {
    localStorage.removeItem('focusreads-recent-books');
    setRecentBooks([]);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = Date.now();
    const viewedTime = new Date(dateString).getTime();
    const diffMinutes = Math.floor((now - viewedTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  return (
    <div className="min-h-screen theme-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="mb-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Eye className="w-8 h-8 theme-primary-text" />
                <h1 className="text-3xl font-bold theme-text">
                  Recently Viewed Books
                </h1>
              </div>
              <p className="theme-text-secondary">
                Books you've viewed or read samples from in the last 35 minutes
              </p>
            </div>
            
            {recentBooks.length > 0 && (
              <button
                onClick={clearAllRecent}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Auto-cleanup notice */}
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">
                Auto-Cleanup Enabled
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Books are automatically removed from this list after 35 minutes. 
                This helps you find books you may have missed while browsing.
              </p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {recentBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentBooks.map((book) => (
              <div key={`${book.id}-${book.viewedAt}`} className="themed-card rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=4F46E5&color=fff&size=400`;
                    }}
                  />
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      book.interactionType === 'sample-read' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {book.interactionType === 'sample-read' ? (
                        <>
                          <BookOpen className="w-3 h-3" />
                          <span>Sample Read</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Viewed</span>
                        </>
                      )}
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
                    <h3 className="text-xl font-semibold theme-text mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="theme-text-secondary mb-1">by {book.author}</p>
                    <div className="flex items-center justify-between text-sm theme-text-secondary">
                      {book.genre && (
                        <span className="capitalize">{book.genre.replace('-', ' ')}</span>
                      )}
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(book.viewedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Link
                        to={`/book-sample/${book.id}`}
                        className="flex-1 theme-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Read Sample</span>
                      </Link>
                      <a
                        href={book.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 theme-text px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Amazon</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 theme-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium theme-text mb-2">
              No Recently Viewed Books
            </h3>
            <p className="theme-text-secondary mb-6">
              Books you view or read samples from will appear here for 35 minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/recommendations"
                className="theme-primary hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Browse Recommendations</span>
              </Link>
              <Link
                to="/books"
                className="themed-button-secondary px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>My Books</span>
              </Link>
            </div>
          </div>
        )}

        {/* Statistics */}
        {recentBooks.length > 0 && (
          <div className="mt-12 themed-card rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold theme-text mb-4">Recent Activity Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold theme-primary-text">{recentBooks.length}</div>
                <div className="text-sm theme-text-secondary">Total Books</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {recentBooks.filter(b => b.interactionType === 'sample-read').length}
                </div>
                <div className="text-sm theme-text-secondary">Samples Read</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {recentBooks.filter(b => b.interactionType === 'viewed').length}
                </div>
                <div className="text-sm theme-text-secondary">Just Viewed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {new Set(recentBooks.map(b => b.genre)).size}
                </div>
                <div className="text-sm theme-text-secondary">Genres Explored</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewed;