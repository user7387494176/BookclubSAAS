// Service for managing recently viewed books
export interface RecentlyViewedBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre?: string;
  rating?: number;
  amazonUrl: string;
  viewedAt: string;
  interactionType: 'viewed' | 'sample-read';
}

export class RecentlyViewedService {
  private static readonly STORAGE_KEY = 'focusreads-recent-books';
  private static readonly EXPIRY_MINUTES = 35;

  static addBook(book: Omit<RecentlyViewedBook, 'viewedAt'>, interactionType: 'viewed' | 'sample-read' = 'viewed'): void {
    const recentBook: RecentlyViewedBook = {
      ...book,
      viewedAt: new Date().toISOString(),
      interactionType
    };

    const existing = this.getRecentBooks();
    
    // Remove any existing entry for this book
    const filtered = existing.filter(b => b.id !== book.id);
    
    // Add the new entry at the beginning
    const updated = [recentBook, ...filtered];
    
    // Keep only the most recent 50 entries to prevent storage bloat
    const trimmed = updated.slice(0, 50);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
  }

  static getRecentBooks(): RecentlyViewedBook[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const books: RecentlyViewedBook[] = JSON.parse(stored);
      const now = Date.now();
      const cutoff = this.EXPIRY_MINUTES * 60 * 1000;

      // Filter books within the time window
      const recentBooks = books.filter(book => {
        const viewedTime = new Date(book.viewedAt).getTime();
        return (now - viewedTime) <= cutoff;
      });

      // Update storage if we filtered out expired books
      if (recentBooks.length !== books.length) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentBooks));
      }

      return recentBooks;
    } catch (error) {
      console.error('Error loading recent books:', error);
      return [];
    }
  }

  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static cleanupExpired(): void {
    const recentBooks = this.getRecentBooks();
    // The getRecentBooks method already handles cleanup
  }

  static getBookCount(): number {
    return this.getRecentBooks().length;
  }

  static hasRecentBooks(): boolean {
    return this.getBookCount() > 0;
  }
}