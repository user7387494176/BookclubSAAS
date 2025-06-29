// Enhanced ISBN Lookup Service using Open Library API as primary source
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
  publisher?: string;
  language?: string;
  pages?: number;
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
    try {
      const normalizedISBN = this.normalizeISBN(isbn);
      
      if (!this.validateISBN(normalizedISBN)) {
        throw new Error('Invalid ISBN format');
      }

      // Use Open Library API as primary source
      const openLibraryResult = await this.lookupWithOpenLibrary(normalizedISBN);
      if (openLibraryResult) {
        return openLibraryResult;
      }

      // Fallback to Google Books API
      const googleBooksResult = await this.lookupWithGoogleBooks(normalizedISBN);
      if (googleBooksResult) {
        return googleBooksResult;
      }
      
      return null;
      
    } catch (error) {
      console.error('ISBN lookup failed:', error);
      return null;
    }
  }

  private static async lookupWithOpenLibrary(isbn: string): Promise<ISBNBookData | null> {
    try {
      const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const bookData = data[`ISBN:${isbn}`];
      
      if (bookData) {
        const authors = bookData.authors?.map((author: any) => author.name).join(', ') || 'Unknown Author';
        const title = bookData.title || 'Unknown Title';
        
        return {
          title,
          author: authors,
          cover: bookData.cover?.large || bookData.cover?.medium || bookData.cover?.small || this.generateCoverUrl(title),
          isbn: this.formatISBN(isbn),
          publishDate: bookData.publish_date || '',
          genre: bookData.subjects?.[0]?.name || '',
          description: bookData.excerpts?.[0]?.text || '',
          tags: bookData.subjects?.map((subject: any) => subject.name) || [],
          amazonUrl: `https://www.amazon.com/s?k=${isbn}&i=stripbooks`,
          publisher: bookData.publishers?.[0]?.name || '',
          language: 'English',
          pages: bookData.number_of_pages
        };
      }
      
      return null;
    } catch (error) {
      console.error('Open Library lookup failed:', error);
      return null;
    }
  }

  private static async lookupWithGoogleBooks(isbn: string): Promise<ISBNBookData | null> {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        
        return {
          title: book.title || 'Unknown Title',
          author: book.authors?.join(', ') || 'Unknown Author',
          cover: book.imageLinks?.large || book.imageLinks?.medium || book.imageLinks?.thumbnail || this.generateCoverUrl(book.title || 'Unknown Title'),
          isbn: this.formatISBN(isbn),
          publishDate: book.publishedDate || '',
          genre: book.categories?.[0] || '',
          description: book.description || '',
          tags: book.categories || [],
          amazonUrl: `https://www.amazon.com/s?k=${isbn}&i=stripbooks`,
          publisher: book.publisher || '',
          language: book.language || 'English',
          pages: book.pageCount
        };
      }
      
      return null;
    } catch (error) {
      console.error('Google Books lookup failed:', error);
      return null;
    }
  }

  private static generateCoverUrl(title: string): string {
    const colors = ['4F46E5', '059669', 'DC2626', 'D97706', 'C026D3', '0891B2', '7C2D12', '7C3AED', 'EA580C', '0D9488'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const encodedTitle = encodeURIComponent(title.substring(0, 20));
    return `https://ui-avatars.com/api/?name=${encodedTitle}&background=${color}&color=fff&size=400&bold=true`;
  }

  static async searchByTitle(title: string): Promise<ISBNBookData[]> {
    try {
      // Use Open Library search API
      const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=5`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const results: ISBNBookData[] = [];
      
      if (data.docs) {
        for (const doc of data.docs.slice(0, 5)) {
          const isbn = doc.isbn?.[0];
          if (isbn) {
            const bookData: ISBNBookData = {
              title: doc.title || 'Unknown Title',
              author: doc.author_name?.join(', ') || 'Unknown Author',
              cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : this.generateCoverUrl(doc.title || 'Unknown Title'),
              isbn: this.formatISBN(isbn),
              publishDate: doc.first_publish_year?.toString() || '',
              genre: doc.subject?.[0] || '',
              description: '',
              tags: doc.subject?.slice(0, 5) || [],
              amazonUrl: `https://www.amazon.com/s?k=${isbn}&i=stripbooks`,
              publisher: doc.publisher?.[0] || '',
              language: doc.language?.[0] || 'English',
              pages: doc.number_of_pages_median
            };
            results.push(bookData);
          }
        }
      }
      
      return results;
    } catch (error) {
      console.error('Title search failed:', error);
      return [];
    }
  }

  static validateISBN(isbn: string): boolean {
    const normalized = this.normalizeISBN(isbn);
    
    if (normalized.length === 10) {
      // ISBN-10 validation
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(normalized[i]) * (10 - i);
      }
      const checkDigit = normalized[9] === 'X' ? 10 : parseInt(normalized[9]);
      return (sum + checkDigit) % 11 === 0;
    } else if (normalized.length === 13) {
      // ISBN-13 validation
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        const digit = parseInt(normalized[i]);
        sum += (i % 2 === 0) ? digit : digit * 3;
      }
      const checkDigit = parseInt(normalized[12]);
      return (sum + checkDigit) % 10 === 0;
    }
    
    return false;
  }

  static formatISBN(isbn: string): string {
    const normalized = this.normalizeISBN(isbn);
    
    if (normalized.length === 13) {
      // Format as ISBN-13: 978-0-123-45678-9
      return `${normalized.slice(0, 3)}-${normalized.slice(3, 4)}-${normalized.slice(4, 7)}-${normalized.slice(7, 12)}-${normalized.slice(12)}`;
    } else if (normalized.length === 10) {
      // Format as ISBN-10: 0-123-45678-9
      return `${normalized.slice(0, 1)}-${normalized.slice(1, 4)}-${normalized.slice(4, 9)}-${normalized.slice(9)}`;
    }
    
    return isbn; // Return original if can't format
  }

  static async verifyAmazonUrl(url: string): Promise<{ valid: boolean; correctedUrl?: string }> {
    // Extract ASIN or ISBN from Amazon URL
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
    const isbnMatch = url.match(/\/dp\/(\d{10,13})/);
    
    if (asinMatch || isbnMatch) {
      return {
        valid: true,
        correctedUrl: url
      };
    }
    
    return { valid: false };
  }
}