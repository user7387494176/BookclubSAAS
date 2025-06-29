// Amazon Books API service using Open Library for real book data
import { OpenLibraryService, BookData } from './openLibraryApi';

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

function convertToAmazonBook(bookData: BookData): AmazonBook {
  return {
    id: bookData.id,
    title: bookData.title,
    author: bookData.author,
    cover: bookData.cover,
    isbn: bookData.isbn,
    publishDate: bookData.publishDate,
    genre: bookData.genre,
    audience: bookData.audience,
    description: bookData.description,
    amazonUrl: bookData.amazonUrl,
    sampleText: bookData.sampleText,
    rating: bookData.rating,
    reviewCount: bookData.reviewCount,
    price: bookData.price,
    asin: bookData.isbn ? bookData.isbn.replace(/-/g, '').substring(3, 13) : undefined
  };
}

export class AmazonBooksService {
  static async getBooksByGenre(genre: string, limit: number = 8): Promise<AmazonBook[]> {
    try {
      const books = await OpenLibraryService.getBooksByGenre(genre, limit);
      return books.map(convertToAmazonBook);
    } catch (error) {
      console.error('Error fetching books by genre:', error);
      return [];
    }
  }

  static async getBookById(id: string): Promise<AmazonBook | null> {
    try {
      const book = await OpenLibraryService.getBookById(id);
      return book ? convertToAmazonBook(book) : null;
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      return null;
    }
  }

  static async searchBooks(query: string): Promise<AmazonBook[]> {
    try {
      const books = await OpenLibraryService.searchBooks(query);
      return books.map(convertToAmazonBook);
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }

  static async getRandomBooksByGenre(genre: string, exclude: string[] = []): Promise<AmazonBook[]> {
    try {
      const books = await OpenLibraryService.getRandomBooksByGenre(genre, exclude);
      return books.map(convertToAmazonBook);
    } catch (error) {
      console.error('Error getting random books:', error);
      return [];
    }
  }

  static getAllGenres(): string[] {
    return OpenLibraryService.getAllGenres();
  }
}