import React, { useState, useEffect } from 'react';
import { ExternalLink, ShoppingCart, Plus, Star, BookOpen } from 'lucide-react';
import { Book } from '../types';

const Recommendations: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const genres = ['all', 'fiction', 'non-fiction', 'mystery', 'romance', 'science-fiction', 'fantasy', 'biography'];

  // Sample books data - in a real app, this would come from an API
  const sampleBooks: Book[] = [
    {
      id: '1',
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
      isbn: '9781501161933',
      publishDate: '2017',
      genre: 'fiction',
      audience: 'Adult',
      description: 'A reclusive Hollywood icon finally tells her story to a young journalist, revealing the truth about her seven marriages and the price of fame.',
      amazonUrl: 'https://amazon.com/dp/1501161933',
      sampleUrl: 'https://example.com/sample'
    },
    {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
      isbn: '9780735211292',
      publishDate: '2018',
      genre: 'non-fiction',
      audience: 'Adult',
      description: 'A comprehensive guide to building good habits and breaking bad ones, backed by scientific research and real-world examples.',
      amazonUrl: 'https://amazon.com/dp/0735211292',
      sampleUrl: 'https://example.com/sample'
    },
    {
      id: '3',
      title: 'The Thursday Murder Club',
      author: 'Richard Osman',
      cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
      isbn: '9780735210642',
      publishDate: '2020',
      genre: 'mystery',
      audience: 'Adult',
      description: 'Four unlikely friends meet weekly to investigate cold cases, but soon find themselves in the middle of their first live case.',
      amazonUrl: 'https://amazon.com/dp/0735210642',
      sampleUrl: 'https://example.com/sample'
    },
    {
      id: '4',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      cover: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=400&fit=crop',
      isbn: '9780593135204',
      publishDate: '2021',
      genre: 'science-fiction',
      audience: 'Adult',
      description: 'A lone astronaut must save humanity from extinction, but first he has to figure out what happened to his crew and himself.',
      amazonUrl: 'https://amazon.com/dp/0593135204',
      sampleUrl: 'https://example.com/sample'
    },
    {
      id: '5',
      title: 'The Invisible Life of Addie LaRue',
      author: 'V.E. Schwab',
      cover: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=300&h=400&fit=crop',
      isbn: '9780765387561',
      publishDate: '2020',
      genre: 'fantasy',
      audience: 'Young Adult',
      description: 'A young woman makes a Faustian bargain to live forever but is cursed to be forgotten by everyone she meets.',
      amazonUrl: 'https://amazon.com/dp/0765387565',
      sampleUrl: 'https://example.com/sample'
    },
    {
      id: '6',
      title: 'Educated',
      author: 'Tara Westover',
      cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
      isbn: '9780399590504',
      publishDate: '2018',
      genre: 'biography',
      audience: 'Adult',
      description: 'A memoir about a woman who grows up in a survivalist family in Idaho and eventually earns a PhD from Cambridge.',
      amazonUrl: 'https://amazon.com/dp/0399590501',
      sampleUrl: 'https://example.com/sample'
    }
  ];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setBooks(sampleBooks);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredBooks = selectedGenre === 'all' 
    ? books 
    : books.filter(book => book.genre === selectedGenre);

  const addToMyBooks = (book: Book) => {
    const existingBooks = JSON.parse(localStorage.getItem('focusreads-books') || '[]');
    const isAlreadyAdded = existingBooks.some((b: Book) => b.id === book.id);
    
    if (!isAlreadyAdded) {
      const bookWithStatus = { ...book, status: 'want-to-read', dateAdded: new Date().toISOString() };
      localStorage.setItem('focusreads-books', JSON.stringify([...existingBooks, bookWithStatus]));
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Recommended</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
                  <div className="flex space-x-2">
                    <a
                      href={book.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Buy on Amazon</span>
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
                    <a
                      href={book.sampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center justify-center space-x-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read Sample</span>
                    </a>
                    <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
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