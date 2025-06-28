export interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  isbn?: string;
  publishDate?: string;
  genre?: string;
  audience?: string;
  description?: string;
  amazonUrl?: string;
  sampleUrl?: string;
  dateAdded?: string;
  status?: 'reading' | 'completed' | 'want-to-read';
  tags?: string[];
  notes?: Note[];
  rating?: number;
  reviewCount?: number;
  price?: string;
  sampleText?: string;
}

export interface Note {
  id: string;
  bookId: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    genres: string[];
    mood: string;
    readingGoals: string[];
  };
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface YouTubeMusic {
  id: string;
  title: string;
}

export interface PomodoroSession {
  id: string;
  startTime: string;
  endTime?: string;
  type: 'focus' | 'short-break' | 'long-break';
  completed: boolean;
}