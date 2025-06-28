// Amazon Books API service with enhanced ASIN/ISBN verification
import { AmazonLookupService, AmazonProductData } from './amazonLookup';

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

// Convert AmazonProductData to AmazonBook format
const convertToAmazonBook = (product: AmazonProductData): AmazonBook => ({
  id: product.asin,
  title: product.title,
  author: product.author,
  cover: product.cover,
  isbn: product.isbn,
  publishDate: product.publishDate || '',
  genre: product.genre || 'Unknown',
  audience: 'Adult', // Default audience
  description: product.description || '',
  amazonUrl: product.amazonUrl,
  sampleText: generateSampleText(product.title),
  rating: product.rating,
  reviewCount: product.reviewCount,
  price: product.price,
  asin: product.asin
});

const generateSampleText = (title: string): string => {
  const sampleTexts = [
    'In the beginning, there was a story waiting to be told. The pages rustled with anticipation as the reader opened the book, ready to embark on a journey through words and imagination.',
    'The morning sun cast long shadows across the landscape, painting everything in hues of gold and amber. It was a day that would change everything, though none could have predicted the events that were about to unfold.',
    'She had always believed that books held magic within their pages, but she never expected to discover that some stories had the power to reshape reality itself.',
    'The old library stood silent in the moonlight, its windows dark and mysterious. Inside, among the countless volumes, lay secrets that had been waiting centuries to be discovered.',
    'Time moved differently in this place, where past and present seemed to blur together like watercolors in the rain. Every step forward was also a step back into memory.'
  ];
  
  return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
};

export class AmazonBooksService {
  private static async getAllProducts(): Promise<AmazonBook[]> {
    // In a real implementation, this would fetch from Amazon Product Advertising API
    // For now, we'll use our enhanced lookup service
    const genres = ['fiction', 'non-fiction', 'science-fiction', 'mystery'];
    const allBooks: AmazonBook[] = [];
    
    for (const genre of genres) {
      const books = await this.getBooksByGenre(genre, 4);
      allBooks.push(...books);
    }
    
    return allBooks;
  }

  static async getBooksByGenre(genre: string, limit: number = 4): Promise<AmazonBook[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use the Amazon lookup service to get verified products
    const searchTerms = {
      'fiction': ['novel', 'fiction', 'story'],
      'non-fiction': ['biography', 'memoir', 'history'],
      'science-fiction': ['sci-fi', 'space', 'future'],
      'mystery': ['mystery', 'thriller', 'detective'],
      'all': ['bestseller', 'popular', 'recommended']
    };
    
    const terms = searchTerms[genre as keyof typeof searchTerms] || searchTerms['all'];
    const allResults: AmazonBook[] = [];
    
    // Search by multiple terms to get variety
    for (const term of terms) {
      try {
        const results = await AmazonLookupService.searchByTitle(term);
        const books = results
          .filter(product => !genre || genre === 'all' || product.genre?.toLowerCase().includes(genre.replace('-', ' ')))
          .map(convertToAmazonBook);
        allResults.push(...books);
      } catch (error) {
        console.error(`Error searching for ${term}:`, error);
      }
    }
    
    // Remove duplicates and limit results
    const uniqueBooks = allResults.filter((book, index, self) => 
      index === self.findIndex(b => b.id === book.id)
    );
    
    return uniqueBooks.slice(0, limit);
  }

  static async getBookById(id: string): Promise<AmazonBook | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Try to lookup by ASIN first
    const product = await AmazonLookupService.lookupByASIN(id);
    if (product) {
      return convertToAmazonBook(product);
    }
    
    // Fallback to searching all books
    const allBooks = await this.getAllProducts();
    return allBooks.find(book => book.id === id) || null;
  }

  static async searchBooks(query: string): Promise<AmazonBook[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const results = await AmazonLookupService.searchByTitle(query);
    return results.map(convertToAmazonBook);
  }

  static async getRandomBooksByGenre(genre: string, exclude: string[] = []): Promise<AmazonBook[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let books = await this.getBooksByGenre(genre, 8);
    
    // Filter out excluded books
    books = books.filter(book => !exclude.includes(book.id));
    
    // Shuffle array
    for (let i = books.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [books[i], books[j]] = [books[j], books[i]];
    }
    
    return books.slice(0, 4);
  }

  static getAllGenres(): string[] {
    return ['fiction', 'non-fiction', 'mystery', 'science-fiction'];
  }

  static async verifyAmazonUrl(url: string): Promise<{ valid: boolean; correctedUrl?: string; asin?: string }> {
    return await AmazonLookupService.verifyAmazonLink(url);
  }

  static generateAmazonSearchUrl(query: string): string {
    return AmazonLookupService.generateAmazonUrl(query, 'search');
  }
}