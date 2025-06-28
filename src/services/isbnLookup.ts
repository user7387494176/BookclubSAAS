// Enhanced ISBN Lookup Service with Amazon integration
import { AmazonLookupService, AmazonProductData } from './amazonLookup';

export interface ISBNBookData {
  title: string;
  author: string;
  cover: string;
  isbn: string;
  publishDate?: string;
  genre?: string;
  description?: string;
  tags?: string[];
  amazonUrl?: string;
  price?: string;
  asin?: string;
}

export class ISBNLookupService {
  private static normalizeISBN(isbn: string): string {
    // Remove all non-digit characters
    const digits = isbn.replace(/[^\d]/g, '');
    
    // Convert ISBN-10 to ISBN-13 if needed
    if (digits.length === 10) {
      const isbn10 = digits;
      const prefix = '978';
      const body = isbn10.slice(0, 9);
      
      // Calculate ISBN-13 check digit
      let sum = 0;
      const isbn13WithoutCheck = prefix + body;
      
      for (let i = 0; i < 12; i++) {
        const digit = parseInt(isbn13WithoutCheck[i]);
        sum += (i % 2 === 0) ? digit : digit * 3;
      }
      
      const checkDigit = (10 - (sum % 10)) % 10;
      return isbn13WithoutCheck + checkDigit;
    }
    
    // Return ISBN-13 as is
    return digits;
  }

  static async lookupByISBN(isbn: string): Promise<ISBNBookData | null> {
    // First try Amazon lookup for verified data
    const amazonData = await AmazonLookupService.lookupByISBN(isbn);
    
    if (amazonData) {
      return {
        title: amazonData.title,
        author: amazonData.author,
        cover: amazonData.cover,
        isbn: amazonData.isbn,
        publishDate: amazonData.publishDate,
        genre: amazonData.genre,
        description: amazonData.description,
        tags: amazonData.tags,
        amazonUrl: amazonData.amazonUrl,
        price: amazonData.price,
        asin: amazonData.asin
      };
    }
    
    // Fallback to basic ISBN validation and search URL generation
    const normalizedISBN = this.normalizeISBN(isbn);
    
    if (this.validateISBN(normalizedISBN)) {
      return {
        title: `Book with ISBN ${isbn}`,
        author: 'Unknown Author',
        cover: `https://ui-avatars.com/api/?name=Book+${normalizedISBN.slice(-4)}&background=4F46E5&color=fff&size=400`,
        isbn: normalizedISBN,
        publishDate: new Date().getFullYear().toString(),
        genre: 'Unknown',
        description: `This book was looked up by ISBN ${isbn}. Complete metadata not available in our database.`,
        tags: ['Unknown Genre'],
        amazonUrl: AmazonLookupService.generateAmazonUrl(normalizedISBN, 'isbn'),
        price: 'Price not available'
      };
    }
    
    return null;
  }

  static async searchByTitle(title: string): Promise<ISBNBookData[]> {
    // Use Amazon search first
    const amazonResults = await AmazonLookupService.searchByTitle(title);
    
    return amazonResults.map(amazonData => ({
      title: amazonData.title,
      author: amazonData.author,
      cover: amazonData.cover,
      isbn: amazonData.isbn,
      publishDate: amazonData.publishDate,
      genre: amazonData.genre,
      description: amazonData.description,
      tags: amazonData.tags,
      amazonUrl: amazonData.amazonUrl,
      price: amazonData.price,
      asin: amazonData.asin
    }));
  }

  static validateISBN(isbn: string): boolean {
    return AmazonLookupService.validateISBN(isbn);
  }

  static formatISBN(isbn: string): string {
    return AmazonLookupService.formatISBN(isbn);
  }

  static async verifyAmazonUrl(url: string): Promise<{ valid: boolean; correctedUrl?: string }> {
    const verification = await AmazonLookupService.verifyAmazonLink(url);
    return {
      valid: verification.valid,
      correctedUrl: verification.correctedUrl
    };
  }
}