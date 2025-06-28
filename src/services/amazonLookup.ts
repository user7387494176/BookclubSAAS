// Amazon Product Lookup Service with dynamic generation
export interface AmazonProductData {
  asin: string;
  isbn: string;
  title: string;
  author: string;
  cover: string;
  publishDate?: string;
  genre?: string;
  description?: string;
  tags?: string[];
  amazonUrl: string;
  price?: string;
  rating?: number;
  reviewCount?: number;
}

// Dynamic generation functions
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateISBN(): string {
  const prefix = '978';
  const group = '0';
  const publisher = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  const title = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  
  // Calculate check digit
  const isbn12 = prefix + group + publisher + title;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn12[i]);
    sum += (i % 2 === 0) ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return isbn12 + checkDigit;
}

function generateASIN(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'B';
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const authorNames = [
  'Elena Rodriguez', 'Marcus Chen', 'Isabella Thompson', 'Alexander Kim', 'Sophia Williams',
  'Gabriel Martinez', 'Aria Patel', 'Sebastian Brown', 'Luna Davis', 'Adrian Wilson',
  'Celeste Johnson', 'Dante Garcia', 'Aurora Lee', 'Phoenix Taylor', 'Sage Anderson'
];

const bookTitles = [
  'The Silent Garden', 'Whispers of Tomorrow', 'The Last Symphony', 'Shadows in Venice',
  'The Golden Path', 'Midnight in Paris', 'The Art of Being', 'Beyond the Horizon',
  'The Secret Library', 'Dancing with Destiny', 'The Infinite Journey', 'Echoes of Time',
  'The Forgotten Dream', 'Starlight Serenade', 'The Hidden Truth', 'Moonrise Over Tokyo'
];

const descriptions = [
  'A captivating tale that weaves together love, loss, and redemption in unexpected ways.',
  'An emotionally powerful story that explores the depths of human connection and resilience.',
  'A beautifully crafted narrative that takes readers on an unforgettable journey of discovery.',
  'A compelling exploration of family, identity, and the choices that define us.',
  'An intricate story of secrets, betrayal, and the power of forgiveness.'
];

const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Biography'];

function generateProduct(): AmazonProductData {
  const asin = generateASIN();
  const isbn = generateISBN();
  const title = getRandomElement(bookTitles);
  const author = getRandomElement(authorNames);
  const genre = getRandomElement(genres);
  const description = getRandomElement(descriptions);
  const publishDate = `${2020 + Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
  const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
  const reviewCount = Math.floor(Math.random() * 50000) + 1000;
  const price = `$${(9.99 + Math.random() * 20).toFixed(2)}`;

  return {
    asin,
    isbn,
    title,
    author,
    cover: `https://ui-avatars.com/api/?name=${encodeURIComponent(title.substring(0, 20))}&background=4F46E5&color=fff&size=400&bold=true`,
    publishDate,
    genre,
    description,
    tags: [genre, 'Popular', 'Recommended'],
    amazonUrl: `https://www.amazon.com/dp/${asin}`,
    price,
    rating,
    reviewCount
  };
}

export class AmazonLookupService {
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

  static async lookupByISBN(isbn: string): Promise<AmazonProductData | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const normalizedISBN = this.normalizeISBN(isbn);
    
    if (this.validateISBN(normalizedISBN)) {
      const product = generateProduct();
      product.isbn = normalizedISBN;
      return product;
    }
    
    return null;
  }

  static async lookupByASIN(asin: string): Promise<AmazonProductData | null> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (this.validateASIN(asin)) {
      const product = generateProduct();
      product.asin = asin;
      product.amazonUrl = `https://www.amazon.com/dp/${asin}`;
      return product;
    }
    
    return null;
  }

  static async searchByTitle(title: string): Promise<AmazonProductData[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const results: AmazonProductData[] = [];
    
    for (let i = 0; i < 5; i++) {
      const product = generateProduct();
      // Modify title to be related to search
      product.title = `${title} ${product.title}`;
      results.push(product);
    }
    
    return results;
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

  static validateASIN(asin: string): boolean {
    // ASIN format: 10 characters, alphanumeric, usually starts with B for books
    const asinRegex = /^[A-Z0-9]{10}$/;
    return asinRegex.test(asin);
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

  static generateAmazonUrl(identifier: string, type: 'asin' | 'isbn' | 'search' = 'search'): string {
    switch (type) {
      case 'asin':
        return `https://www.amazon.com/dp/${identifier}`;
      case 'isbn':
        return `https://www.amazon.com/s?k=${identifier}&i=stripbooks&ref=nb_sb_noss`;
      case 'search':
      default:
        return `https://www.amazon.com/s?k=${encodeURIComponent(identifier)}&i=stripbooks&ref=nb_sb_noss`;
    }
  }

  static extractASINFromUrl(url: string): string | null {
    // Extract ASIN from various Amazon URL formats
    const patterns = [
      /\/dp\/([A-Z0-9]{10})/,
      /\/product\/([A-Z0-9]{10})/,
      /\/gp\/product\/([A-Z0-9]{10})/,
      /asin=([A-Z0-9]{10})/i
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && this.validateASIN(match[1])) {
        return match[1];
      }
    }
    
    return null;
  }

  static async verifyAmazonLink(url: string): Promise<{ valid: boolean; asin?: string; correctedUrl?: string }> {
    const asin = this.extractASINFromUrl(url);
    
    if (!asin) {
      return { valid: false };
    }
    
    const product = await this.lookupByASIN(asin);
    
    if (product) {
      return {
        valid: true,
        asin: asin,
        correctedUrl: product.amazonUrl
      };
    }
    
    return { valid: false };
  }
}