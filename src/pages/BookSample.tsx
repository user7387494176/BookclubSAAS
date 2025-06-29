import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Plus, Star, Clock, User } from 'lucide-react';
import { AmazonBooksService, AmazonBook } from '../services/amazonBooks';
import { RecentlyViewedService } from '../services/recentlyViewed';

const BookSample: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<AmazonBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBook = async () => {
      if (!id) {
        setError('Book ID not provided');
        setLoading(false);
        return;
      }

      try {
        const bookData = await AmazonBooksService.getBookById(id);
        if (bookData) {
          setBook(bookData);
          
          // Add to recently viewed when sample is loaded
          RecentlyViewedService.addBook({
            id: bookData.id,
            title: bookData.title,
            author: bookData.author,
            cover: bookData.cover,
            genre: bookData.genre,
            rating: bookData.rating,
            amazonUrl: bookData.amazonUrl
          }, 'sample-read');
        } else {
          setError('Book not found');
        }
      } catch (err) {
        setError('Failed to load book');
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const addToMyBooks = () => {
    if (!book) return;
    
    const existingBooks = JSON.parse(localStorage.getItem('focusreads-books') || '[]');
    const isAlreadyAdded = existingBooks.some((b: any) => b.id === book.id);
    
    if (!isAlreadyAdded) {
      const bookWithStatus = { 
        ...book, 
        status: 'want-to-read', 
        dateAdded: new Date().toISOString() 
      };
      localStorage.setItem('focusreads-books', JSON.stringify([...existingBooks, bookWithStatus]));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading book sample...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Book not found'}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Recommendations</span>
          </button>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Book Cover */}
              <div className="md:w-1/3 lg:w-1/4">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              
              {/* Book Info */}
              <div className="md:w-2/3 lg:w-3/4 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {book.title}
                    </h1>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                      <User className="w-4 h-4" />
                      <span>by {book.author}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>{book.publishDate}</span>
                      <span>•</span>
                      <span className="capitalize">{book.genre?.replace('-', ' ')}</span>
                      <span>•</span>
                      <span>{book.audience}</span>
                    </div>
                  </div>
                  
                  {book.rating && (
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {book.rating}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {book.reviewCount?.toLocaleString()} reviews
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {book.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buy on Amazon</span>
                    {book.price && <span>({book.price})</span>}
                  </a>
                  
                  <button
                    onClick={addToMyBooks}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to My Books</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Text */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Sample Reading
            </h2>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-l-4 border-indigo-500">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg font-serif italic">
                "{book.sampleText}"
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> This is a sample excerpt from the book. The full reading experience 
                includes much more content, character development, and story progression. 
                Purchase the complete book to continue reading.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center inline-flex items-center justify-center space-x-2"
              >
                <span>Continue Reading - Buy Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <button
                onClick={() => navigate('/recommendations')}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Browse More Books
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSample;