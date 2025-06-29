// Enhanced Open Library API service with ISBN lookup integration
export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  subject?: string[];
  publisher?: string[];
  language?: string[];
  number_of_pages_median?: number;
  ratings_average?: number;
  ratings_count?: number;
  first_sentence?: string[];
}

export interface BookData {
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
  subjects?: string[];
}

export class OpenLibraryService {
  private static readonly BASE_URL = 'https://openlibrary.org';
  private static readonly COVERS_URL = 'https://covers.openlibrary.org/b';

  // Enhanced genre mapping with more comprehensive coverage
  private static readonly GENRE_MAPPING: Record<string, string[]> = {
    'fiction': ['fiction', 'novels', 'literature', 'literary fiction'],
    'mystery-thriller': ['mystery', 'thriller', 'detective', 'crime', 'suspense', 'police procedural'],
    'romance': ['romance', 'love stories', 'romantic fiction', 'contemporary romance'],
    'science-fiction-fantasy': ['science fiction', 'fantasy', 'sci-fi', 'speculative fiction', 'dystopian', 'space opera'],
    'self-help': ['self-help', 'personal development', 'psychology', 'motivation', 'self improvement'],
    'business-investing': ['business', 'economics', 'finance', 'investing', 'entrepreneurship', 'management'],
    'health-wellness': ['health', 'wellness', 'fitness', 'nutrition', 'medicine', 'mental health'],
    'biographies-memoirs': ['biography', 'memoir', 'autobiography', 'life stories', 'personal narratives'],
    'history': ['history', 'historical', 'world history', 'american history', 'ancient history'],
    'science-math': ['science', 'mathematics', 'physics', 'chemistry', 'biology', 'astronomy'],
    'education-reference': ['education', 'reference', 'textbooks', 'academic', 'study guides'],
    'arts-music': ['art', 'music', 'photography', 'design', 'creativity', 'visual arts'],
    'cooking-food-wine': ['cooking', 'food', 'recipes', 'culinary', 'wine', 'baking'],
    'travel': ['travel', 'geography', 'adventure', 'exploration', 'guidebooks'],
    'religion-spirituality': ['religion', 'spirituality', 'philosophy', 'theology', 'meditation'],
    'politics-social-sciences': ['politics', 'sociology', 'social science', 'government', 'anthropology'],
    'young-adult': ['young adult', 'teen', 'coming of age', 'ya fiction', 'teenage'],
    'childrens-books': ['children', 'juvenile', 'kids', 'picture books', 'early readers'],
    'humor': ['humor', 'comedy', 'funny', 'satire', 'wit'],
    'psychology': ['psychology', 'mental health', 'cognitive science', 'behavioral science'],
    'crafts-hobbies': ['crafts', 'hobbies', 'diy', 'making', 'handicrafts'],
    'computers-technology': ['computers', 'technology', 'programming', 'software', 'internet'],
    'lgbtq-books': ['lgbtq', 'gay', 'lesbian', 'transgender', 'queer', 'gender studies'],
    'action-adventure': ['adventure', 'action', 'thriller', 'excitement', 'suspense'],
    'outdoor-sports': ['sports', 'outdoor', 'recreation', 'athletics', 'fitness'],
    'parenting-relationships': ['parenting', 'relationships', 'family', 'marriage', 'child care'],
    'pets': ['pets', 'animals', 'dogs', 'cats', 'veterinary'],
    'medical': ['medical', 'medicine', 'health care', 'nursing', 'anatomy']
  };

  static async getBooksByGenre(genre: string, limit: number = 20): Promise<BookData[]> {
    try {
      const subjects = this.GENRE_MAPPING[genre.toLowerCase()] || [genre];
      const allBooks: BookData[] = [];
      
      // Try multiple subjects to get variety
      for (const subject of subjects.slice(0, 4)) {
        try {
          const url = `${this.BASE_URL}/subjects/${encodeURIComponent(subject)}.json?limit=${Math.ceil(limit / subjects.length)}&offset=${Math.floor(Math.random() * 200)}`;
          const response = await fetch(url);
          
          if (response.ok) {
            const data = await response.json();
            const books = await this.processBooks(data.works || [], genre);
            allBooks.push(...books);
          }
        } catch (error) {
          console.warn(`Failed to fetch books for subject: ${subject}`, error);
        }
      }

      // Remove duplicates and shuffle
      const uniqueBooks = this.removeDuplicates(allBooks);
      const shuffled = uniqueBooks.sort(() => 0.5 - Math.random());
      
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Error fetching books by genre:', error);
      return [];
    }
  }

  static async searchBooks(query: string, limit: number = 20): Promise<BookData[]> {
    try {
      const url = `${this.BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${Math.floor(Math.random() * 100)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return await this.processBooks(data.docs || [], 'search');
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }

  static async getBookById(id: string): Promise<BookData | null> {
    try {
      // Try to get book by work key
      const url = `${this.BASE_URL}/works/${id}.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return null;
      }

      const work = await response.json();
      
      // Get editions to find ISBN and other details
      const editionsUrl = `${this.BASE_URL}/works/${id}/editions.json?limit=1`;
      const editionsResponse = await fetch(editionsUrl);
      
      let edition = null;
      if (editionsResponse.ok) {
        const editionsData = await editionsResponse.json();
        edition = editionsData.entries?.[0];
      }

      return this.convertToBookData(work, edition, 'fiction');
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      return null;
    }
  }

  static async getRandomBooksByGenre(genre: string, excludeIds: string[] = []): Promise<BookData[]> {
    try {
      // Get books with random offset
      const offset = Math.floor(Math.random() * 500);
      const subjects = this.GENRE_MAPPING[genre.toLowerCase()] || [genre];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      
      const url = `${this.BASE_URL}/subjects/${encodeURIComponent(subject)}.json?limit=30&offset=${offset}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const books = await this.processBooks(data.works || [], genre);
      
      // Filter out excluded books
      const filtered = books.filter(book => !excludeIds.includes(book.id));
      
      // Shuffle and return up to 6 books
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 6);
    } catch (error) {
      console.error('Error getting random books:', error);
      return [];
    }
  }

  private static async processBooks(works: any[], genre: string): Promise<BookData[]> {
    const books: BookData[] = [];
    
    for (const work of works.slice(0, 30)) {
      try {
        const book = await this.convertToBookData(work, null, genre);
        if (book && book.isbn) {
          books.push(book);
        }
      } catch (error) {
        console.warn('Error processing book:', error);
      }
    }
    
    return books;
  }

  private static async convertToBookData(work: any, edition: any = null, genre: string): Promise<BookData | null> {
    try {
      const workKey = work.key || work.work_key;
      if (!workKey) return null;

      const id = workKey.replace('/works/', '');
      const title = work.title || 'Unknown Title';
      const authors = work.authors || work.author_name || [];
      const author = Array.isArray(authors) 
        ? authors.map(a => typeof a === 'string' ? a : a.name).join(', ')
        : typeof authors === 'string' ? authors : 'Unknown Author';

      // Get ISBN from edition or work
      let isbn = '';
      if (edition?.isbn_13?.length > 0) {
        isbn = edition.isbn_13[0];
      } else if (edition?.isbn_10?.length > 0) {
        isbn = edition.isbn_10[0];
      } else if (work.isbn?.length > 0) {
        isbn = work.isbn[0];
      }

      // Skip books without ISBN for better data quality
      if (!isbn) return null;

      // Try to get enhanced data from ISBN lookup
      let enhancedCover = '';
      try {
        const { ISBNLookupService } = await import('./isbnLookup');
        const isbnData = await ISBNLookupService.lookupByISBN(isbn);
        if (isbnData && isbnData.cover) {
          enhancedCover = isbnData.cover;
        }
      } catch (error) {
        console.warn('ISBN lookup failed for', isbn, error);
      }

      // Get cover image - prefer ISBN lookup result
      const coverId = work.cover_i || edition?.covers?.[0];
      const cover = enhancedCover || 
        (coverId ? `${this.COVERS_URL}/id/${coverId}-L.jpg` : 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(title.substring(0, 20))}&background=4F46E5&color=fff&size=400&bold=true`);

      // Get publication year
      const publishYear = work.first_publish_year || edition?.publish_date || '';
      const publishDate = publishYear ? publishYear.toString() : '';

      // Get description
      let description = '';
      if (work.description) {
        description = typeof work.description === 'string' 
          ? work.description 
          : work.description.value || '';
      } else if (work.first_sentence) {
        description = Array.isArray(work.first_sentence) 
          ? work.first_sentence.join(' ') 
          : work.first_sentence;
      }

      // Generate Amazon URL
      const amazonUrl = `https://www.amazon.com/s?k=${isbn}&i=stripbooks&ref=nb_sb_noss`;

      // Generate sample text
      const sampleText = this.generateSampleText(title, author, description);

      // Get subjects for genre classification
      const subjects = work.subject || [];
      const detectedGenre = this.detectGenre(subjects) || this.formatGenre(genre);

      return {
        id,
        title,
        author,
        cover,
        isbn: this.formatISBN(isbn),
        publishDate,
        genre: detectedGenre,
        audience: 'Adult',
        description: description || `A compelling work by ${author} that explores themes of ${detectedGenre.toLowerCase()}.`,
        amazonUrl,
        sampleText,
        rating: work.ratings_average ? Math.round(work.ratings_average * 10) / 10 : undefined,
        reviewCount: work.ratings_count || undefined,
        price: this.generatePrice(),
        subjects: subjects.slice(0, 5)
      };
    } catch (error) {
      console.error('Error converting work to book data:', error);
      return null;
    }
  }

  private static formatISBN(isbn: string): string {
    // Remove all non-digit characters
    const digits = isbn.replace(/[^\d]/g, '');
    
    if (digits.length === 13) {
      // Format as ISBN-13: 978-0-123-45678-9
      return `${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(4, 7)}-${digits.slice(7, 12)}-${digits.slice(12)}`;
    } else if (digits.length === 10) {
      // Format as ISBN-10: 0-123-45678-9
      return `${digits.slice(0, 1)}-${digits.slice(1, 4)}-${digits.slice(4, 9)}-${digits.slice(9)}`;
    }
    
    return isbn;
  }

  private static detectGenre(subjects: string[]): string | null {
    if (!subjects || subjects.length === 0) return null;

    const subjectStr = subjects.join(' ').toLowerCase();
    
    for (const [genre, keywords] of Object.entries(this.GENRE_MAPPING)) {
      for (const keyword of keywords) {
        if (subjectStr.includes(keyword.toLowerCase())) {
          return this.formatGenre(genre);
        }
      }
    }
    
    return null;
  }

  private static formatGenre(genre: string): string {
    return genre
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' & ');
  }

  private static generateSampleText(title: string, author: string, description: string): string {
    const samples = [
      `In this compelling narrative, ${author} weaves a story that captivates from the very first page. The opening chapter sets the tone for what becomes an unforgettable journey through the themes and characters that define this remarkable work.`,
      
      `"${title}" begins with a moment that changes everything. ${author} masterfully introduces us to a world where every detail matters, and every character has a story worth telling. This opening passage draws readers into the heart of the narrative.`,
      
      `The story opens on a day that seems ordinary but holds extraordinary significance. ${author} has crafted a beginning that immediately establishes the tone and atmosphere that will carry readers through this engaging tale.`,
      
      `From the opening lines, it's clear that ${author} has created something special with "${title}". The narrative voice draws you in, promising a story that will resonate long after the final page is turned.`,
      
      `${author} begins this remarkable work with a scene that perfectly encapsulates the themes and emotions that will unfold throughout the story. It's an opening that promises depth, insight, and genuine human connection.`
    ];
    
    return samples[Math.floor(Math.random() * samples.length)];
  }

  private static generatePrice(): string {
    const prices = ['$12.99', '$14.99', '$16.99', '$18.99', '$19.99', '$22.99', '$24.99'];
    return prices[Math.floor(Math.random() * prices.length)];
  }

  private static removeDuplicates(books: BookData[]): BookData[] {
    const seen = new Set<string>();
    return books.filter(book => {
      const key = `${book.title}-${book.author}`.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  static getAllGenres(): string[] {
    return Object.keys(this.GENRE_MAPPING).map(genre => this.formatGenre(genre));
  }

  static getAvailableGenres(books: BookData[]): string[] {
    const genres = new Set<string>();
    books.forEach(book => {
      if (book.genre) {
        genres.add(book.genre);
      }
    });
    return Array.from(genres).sort();
  }
}