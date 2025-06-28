// ISBN Lookup Service for Amazon Book Data
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
}

// Mock ISBN database with real book data
const isbnDatabase: Record<string, ISBNBookData> = {
  '9780735219090': {
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    cover: 'https://m.media-amazon.com/images/I/81O55JbkOTL._SY522_.jpg',
    isbn: '9780735219090',
    publishDate: '2018-08-14',
    genre: 'Fiction',
    description: 'For years, rumors of the "Marsh Girl" have haunted Barkley Cove, a quiet town on the North Carolina coast.',
    tags: ['Fiction', 'Mystery', 'Coming of Age', 'Nature'],
    amazonUrl: 'https://www.amazon.com/Where-Crawdads-Sing-Delia-Owens/dp/0735219095',
    price: '$15.99'
  },
  '9780735211292': {
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://m.media-amazon.com/images/I/81wgcld4wxL._SY522_.jpg',
    isbn: '9780735211292',
    publishDate: '2018-10-16',
    genre: 'Self-Help',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day.',
    tags: ['Self-Help', 'Productivity', 'Habits', 'Personal Development'],
    amazonUrl: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
    price: '$18.99'
  },
  '9781501161933': {
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    cover: 'https://m.media-amazon.com/images/I/71FTb9X6wsL._SY522_.jpg',
    isbn: '9781501161933',
    publishDate: '2017-06-13',
    genre: 'Fiction',
    description: 'Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.',
    tags: ['Fiction', 'Historical Fiction', 'Romance', 'Hollywood'],
    amazonUrl: 'https://www.amazon.com/Seven-Husbands-Evelyn-Hugo-Novel/dp/1501161933',
    price: '$16.99'
  },
  '9780525559474': {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'https://m.media-amazon.com/images/I/71DKbV-LBSL._SY522_.jpg',
    isbn: '9780525559474',
    publishDate: '2020-08-13',
    genre: 'Fiction',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever.',
    tags: ['Fiction', 'Philosophy', 'Fantasy', 'Life Choices'],
    amazonUrl: 'https://www.amazon.com/Midnight-Library-Matt-Haig/dp/0525559477',
    price: '$14.99'
  },
  '9780399590504': {
    title: 'Educated',
    author: 'Tara Westover',
    cover: 'https://m.media-amazon.com/images/I/81WojUxbbFL._SY522_.jpg',
    isbn: '9780399590504',
    publishDate: '2018-02-20',
    genre: 'Memoir',
    description: 'Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom.',
    tags: ['Memoir', 'Education', 'Family', 'Survival'],
    amazonUrl: 'https://www.amazon.com/Educated-Memoir-Tara-Westover/dp/0399590501',
    price: '$17.99'
  },
  '9780062316097': {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    cover: 'https://m.media-amazon.com/images/I/713jIoMO3UL._SY522_.jpg',
    isbn: '9780062316097',
    publishDate: '2015-02-10',
    genre: 'History',
    description: 'From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution.',
    tags: ['History', 'Anthropology', 'Evolution', 'Science'],
    amazonUrl: 'https://www.amazon.com/Sapiens-Humankind-Yuval-Noah-Harari/dp/0062316095',
    price: '$19.99'
  },
  '9781524763138': {
    title: 'Becoming',
    author: 'Michelle Obama',
    cover: 'https://m.media-amazon.com/images/I/81h2gWPTYJL._SY522_.jpg',
    isbn: '9781524763138',
    publishDate: '2018-11-13',
    genre: 'Biography',
    description: 'In a life filled with meaning and accomplishment, Michelle Obama has emerged as one of the most iconic and compelling women of our era.',
    tags: ['Biography', 'Politics', 'Inspiration', 'Leadership'],
    amazonUrl: 'https://www.amazon.com/Becoming-Michelle-Obama/dp/1524763136',
    price: '$20.99'
  },
  '9780593135204': {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    cover: 'https://m.media-amazon.com/images/I/91vS2L5gKcL._SY522_.jpg',
    isbn: '9780593135204',
    publishDate: '2021-05-04',
    genre: 'Science Fiction',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.',
    tags: ['Science Fiction', 'Space', 'Adventure', 'Humor'],
    amazonUrl: 'https://www.amazon.com/Project-Hail-Mary-Andy-Weir/dp/0593135202',
    price: '$17.99'
  },
  '9780553418026': {
    title: 'The Martian',
    author: 'Andy Weir',
    cover: 'https://m.media-amazon.com/images/I/81L2rU8C4PL._SY522_.jpg',
    isbn: '9780553418026',
    publishDate: '2014-02-11',
    genre: 'Science Fiction',
    description: 'Six days ago, astronaut Mark Watney became one of the first people to walk on Mars. Now, he\'s sure he\'ll be the first person to die there.',
    tags: ['Science Fiction', 'Space', 'Survival', 'Humor'],
    amazonUrl: 'https://www.amazon.com/Martian-Novel-Andy-Weir/dp/0553418025',
    price: '$15.99'
  },
  '9780441172719': {
    title: 'Dune',
    author: 'Frank Herbert',
    cover: 'https://m.media-amazon.com/images/I/81ym2lBKYGL._SY522_.jpg',
    isbn: '9780441172719',
    publishDate: '1965-08-01',
    genre: 'Science Fiction',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.',
    tags: ['Science Fiction', 'Epic Fantasy', 'Politics', 'Desert'],
    amazonUrl: 'https://www.amazon.com/Dune-Frank-Herbert/dp/0441172717',
    price: '$18.99'
  }
};

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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const normalizedISBN = this.normalizeISBN(isbn);
    
    // Check our mock database first
    const bookData = isbnDatabase[normalizedISBN];
    if (bookData) {
      return bookData;
    }
    
    // If not found in our database, try to generate reasonable data
    // In a real implementation, this would call the Amazon Product Advertising API
    // or Google Books API, or Open Library API
    
    if (normalizedISBN.length === 13 && normalizedISBN.startsWith('978')) {
      // Generate a mock response for demonstration
      return {
        title: `Book with ISBN ${isbn}`,
        author: 'Unknown Author',
        cover: `https://ui-avatars.com/api/?name=Book+${normalizedISBN.slice(-4)}&background=4F46E5&color=fff&size=400`,
        isbn: normalizedISBN,
        publishDate: new Date().getFullYear().toString(),
        genre: 'Unknown',
        description: `This book was looked up by ISBN ${isbn}. Complete metadata not available in our database.`,
        tags: ['Unknown Genre'],
        amazonUrl: `https://www.amazon.com/s?k=${normalizedISBN}`,
        price: 'Price not available'
      };
    }
    
    return null;
  }

  static async searchByTitle(title: string): Promise<ISBNBookData[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const searchTerm = title.toLowerCase();
    const results = Object.values(isbnDatabase).filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );
    
    return results.slice(0, 5); // Return top 5 results
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
}