// Amazon Books API service with real ISBN integration
import { RealBookDataService, RealBookData } from './realBookData';

export interface AmazonBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  isbn: string;
  publishDate: string;
  genre: string;
  audience: string;
  description: string;
  amazonUrl: string;
  sampleText?: string;
  rating?: number;
  reviewCount?: number;
  price?: string;
  asin?: string;
}

function convertRealBookToAmazon(realBook: RealBookData): AmazonBook {
  return {
    id: realBook.isbn,
    title: realBook.title,
    author: realBook.author,
    cover: realBook.cover,
    isbn: realBook.isbn,
    publishDate: realBook.publishDate,
    genre: realBook.genre,
    audience: 'Adult',
    description: realBook.description,
    amazonUrl: realBook.amazonUrl,
    sampleText: realBook.sampleText,
    rating: realBook.rating,
    reviewCount: realBook.reviewCount,
    price: realBook.price,
    asin: realBook.isbn.replace(/-/g, '').substring(3, 13) // Convert ISBN to ASIN-like format
  };
}

export class AmazonBooksService {
  static async getBooksByGenre(genre: string, limit: number = 8): Promise<AmazonBook[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const realBooks = RealBookDataService.getBooksByGenre(genre, limit);
    return realBooks.map(convertRealBookToAmazon);
  }

  static async getBookById(id: string): Promise<AmazonBook | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const realBook = RealBookDataService.getBookById(id);
    return realBook ? convertRealBookToAmazon(realBook) : null;
  }

  static async searchBooks(query: string): Promise<AmazonBook[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const realBooks = RealBookDataService.searchBooks(query);
    return realBooks.map(convertRealBookToAmazon);
  }

  static async getRandomBooksByGenre(genre: string, exclude: string[] = []): Promise<AmazonBook[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let availableBooks = RealBookDataService.getBooksByGenre(genre, 20);
    
    // Filter out excluded books
    availableBooks = availableBooks.filter(book => !exclude.includes(book.isbn));
    
    // Shuffle and take first 4
    const shuffled = availableBooks.sort(() => 0.5 - Math.random());
    const selectedBooks = shuffled.slice(0, 4);
    
    return selectedBooks.map(convertRealBookToAmazon);
  }

  static getAllGenres(): string[] {
    return RealBookDataService.getAllGenres();
  }
}