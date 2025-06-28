// Amazon Books API service with dynamic book generation
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

// Dynamic book generation data
const bookTitleTemplates = {
  fiction: [
    'The {adjective} {noun}',
    '{adjective} {timeOfDay}',
    'The {noun} of {place}',
    '{character}\'s {journey}',
    'Beyond the {noun}',
    'The Last {noun}',
    'Whispers of {place}',
    'The {adjective} Garden',
    'Shadows in {place}',
    'The {noun} Chronicles'
  ],
  'non-fiction': [
    'The Art of {skill}',
    'Mastering {concept}',
    '{concept}: A Complete Guide',
    'The {adjective} Mind',
    'Unlocking {potential}',
    'The Science of {concept}',
    'Building {skill}',
    'The {adjective} Leader',
    'Principles of {concept}',
    'The {skill} Revolution'
  ],
  mystery: [
    'The {place} Mystery',
    'Murder in {place}',
    'The {adjective} Detective',
    'Secrets of {place}',
    'The {noun} Conspiracy',
    'Death in {place}',
    'The {adjective} Case',
    'Blood on {place}',
    'The {place} Murders',
    'Silent {noun}'
  ],
  'science-fiction': [
    'The {planet} Protocol',
    'Beyond {place}',
    'The {adjective} Galaxy',
    '{character} Rising',
    'The {noun} Wars',
    'Quantum {concept}',
    'The {adjective} Future',
    'Stars of {place}',
    'The {noun} Paradox',
    'Digital {concept}'
  ]
};

const wordLists = {
  adjective: ['Silent', 'Hidden', 'Forgotten', 'Ancient', 'Mysterious', 'Golden', 'Silver', 'Dark', 'Bright', 'Lost', 'Sacred', 'Eternal', 'Infinite', 'Perfect', 'Broken'],
  noun: ['Heart', 'Soul', 'Dream', 'Shadow', 'Light', 'Key', 'Door', 'Path', 'Journey', 'Secret', 'Truth', 'Memory', 'Hope', 'Promise', 'Legacy'],
  place: ['Paris', 'London', 'Tokyo', 'Venice', 'Prague', 'Barcelona', 'Vienna', 'Florence', 'Amsterdam', 'Edinburgh', 'Santorini', 'Kyoto', 'Marrakech', 'Istanbul', 'Dubrovnik'],
  character: ['Elena', 'Marcus', 'Isabella', 'Alexander', 'Sophia', 'Gabriel', 'Aria', 'Sebastian', 'Luna', 'Adrian', 'Celeste', 'Dante', 'Aurora', 'Phoenix', 'Sage'],
  journey: ['Quest', 'Adventure', 'Discovery', 'Awakening', 'Transformation', 'Redemption', 'Legacy', 'Destiny', 'Revolution', 'Renaissance'],
  timeOfDay: ['Dawn', 'Midnight', 'Twilight', 'Sunrise', 'Sunset', 'Moonrise', 'Daybreak', 'Dusk', 'Evening', 'Morning'],
  skill: ['Leadership', 'Innovation', 'Communication', 'Creativity', 'Focus', 'Resilience', 'Mindfulness', 'Productivity', 'Influence', 'Strategy'],
  concept: ['Success', 'Happiness', 'Growth', 'Change', 'Excellence', 'Purpose', 'Balance', 'Wisdom', 'Courage', 'Freedom'],
  potential: ['Potential', 'Creativity', 'Intelligence', 'Intuition', 'Imagination', 'Innovation', 'Inspiration', 'Insight', 'Vision', 'Genius'],
  planet: ['Mars', 'Europa', 'Titan', 'Proxima', 'Kepler', 'Gliese', 'Trappist', 'Alpha', 'Beta', 'Gamma']
};

const authorNames = [
  'Elena Rodriguez', 'Marcus Chen', 'Isabella Thompson', 'Alexander Kim', 'Sophia Williams',
  'Gabriel Martinez', 'Aria Patel', 'Sebastian Brown', 'Luna Davis', 'Adrian Wilson',
  'Celeste Johnson', 'Dante Garcia', 'Aurora Lee', 'Phoenix Taylor', 'Sage Anderson',
  'Maya Singh', 'Oliver Zhang', 'Zara Ahmed', 'Leo Nakamura', 'Iris Kowalski',
  'Felix Dubois', 'Nova Petrov', 'Kai Johansson', 'Vera Rossi', 'Atlas Murphy'
];

const publishYears = ['2020', '2021', '2022', '2023', '2024'];

const descriptions = {
  fiction: [
    'A captivating tale that weaves together love, loss, and redemption in unexpected ways.',
    'An emotionally powerful story that explores the depths of human connection and resilience.',
    'A beautifully crafted narrative that takes readers on an unforgettable journey of discovery.',
    'A compelling exploration of family, identity, and the choices that define us.',
    'An intricate story of secrets, betrayal, and the power of forgiveness.',
    'A mesmerizing tale that blends reality with imagination in stunning detail.',
    'A profound meditation on life, love, and the meaning we create from our experiences.',
    'An epic story spanning generations, revealing how the past shapes our present.',
    'A tender yet powerful exploration of hope, healing, and second chances.',
    'A richly layered narrative that examines the complexity of human relationships.'
  ],
  'non-fiction': [
    'A groundbreaking exploration of cutting-edge research and practical applications.',
    'An insightful guide that combines scientific evidence with actionable strategies.',
    'A comprehensive examination of proven methods for personal and professional growth.',
    'A thought-provoking analysis that challenges conventional wisdom and offers new perspectives.',
    'An accessible yet thorough investigation into the principles that drive success.',
    'A practical handbook filled with evidence-based techniques and real-world examples.',
    'An illuminating study that reveals the hidden patterns behind extraordinary achievement.',
    'A transformative guide that bridges the gap between theory and practical application.',
    'An engaging exploration of the latest discoveries in psychology and neuroscience.',
    'A compelling synthesis of research, case studies, and actionable insights.'
  ],
  mystery: [
    'A gripping thriller that keeps readers guessing until the final page.',
    'An intricate puzzle filled with red herrings, shocking twists, and dark secrets.',
    'A masterfully plotted mystery that explores the darker side of human nature.',
    'A suspenseful tale of deception, betrayal, and the pursuit of justice.',
    'An atmospheric thriller that combines psychological depth with edge-of-your-seat tension.',
    'A complex web of lies and secrets that slowly unravels to reveal a stunning truth.',
    'A haunting mystery that delves into the shadows of a seemingly perfect community.',
    'A cleverly constructed puzzle that challenges readers to solve the case alongside the detective.',
    'A dark and twisting tale that explores the lengths people will go to protect their secrets.',
    'A compelling investigation that reveals how the past can come back to haunt the present.'
  ],
  'science-fiction': [
    'A visionary exploration of humanity\'s future among the stars.',
    'A thought-provoking tale that examines the intersection of technology and human nature.',
    'An epic space opera that spans galaxies and challenges our understanding of reality.',
    'A compelling vision of the future that feels both fantastical and eerily plausible.',
    'An innovative story that explores the consequences of scientific advancement.',
    'A mind-bending journey through time, space, and the possibilities of human evolution.',
    'A thrilling adventure that combines cutting-edge science with timeless human drama.',
    'An imaginative exploration of alien worlds and the universal quest for meaning.',
    'A sophisticated tale that questions what it means to be human in an age of artificial intelligence.',
    'A sweeping narrative that examines the delicate balance between progress and preservation.'
  ]
};

const sampleTexts = [
  'The morning light filtered through the ancient oak trees, casting dancing shadows on the cobblestone path. Sarah had walked this route countless times, but today felt different—charged with possibility and tinged with an inexplicable sense of destiny.',
  'In the quiet moments before dawn, when the world holds its breath between night and day, extraordinary things become possible. It was in such a moment that everything changed, though none of us could have predicted how profoundly.',
  'The letter arrived on a Tuesday, unremarkable in every way except for the elegant script that spelled out her name and the weight of secrets it carried within its cream-colored envelope.',
  'Time moves differently in places touched by magic, where past and present blur together like watercolors in the rain. Here, in this forgotten corner of the world, stories write themselves.',
  'She had always believed that books held power, but she never imagined that some stories could reach out from their pages and reshape reality itself.',
  'The city never sleeps, they say, but in the hours before dawn, even the most restless metropolis finds moments of profound stillness—moments when anything seems possible.',
  'Memory is a strange thing, selective and unreliable, yet sometimes it preserves the most important truths in the smallest details: the scent of jasmine on a summer evening, the sound of laughter echoing through empty halls.',
  'There are places in this world where the veil between what is and what could be grows thin, where ordinary people discover they are capable of extraordinary things.',
  'The photograph was faded, its edges worn soft by time and handling, but the eyes that looked back from its surface were as vivid and alive as the day it was taken.',
  'In every ending lies the seed of a new beginning, though we rarely recognize it at the time. Sometimes the most profound transformations begin with the smallest steps.'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateTitle(genre: string): string {
  const templates = bookTitleTemplates[genre as keyof typeof bookTitleTemplates] || bookTitleTemplates.fiction;
  const template = getRandomElement(templates);
  
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const wordList = wordLists[key as keyof typeof wordLists];
    return wordList ? getRandomElement(wordList) : match;
  });
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

function generateCoverUrl(title: string): string {
  const colors = ['4F46E5', '059669', 'DC2626', 'D97706', 'C026D3', '0891B2', '7C2D12'];
  const color = getRandomElement(colors);
  const encodedTitle = encodeURIComponent(title.substring(0, 20));
  return `https://ui-avatars.com/api/?name=${encodedTitle}&background=${color}&color=fff&size=400&bold=true`;
}

function generateBook(genre: string): AmazonBook {
  const title = generateTitle(genre);
  const author = getRandomElement(authorNames);
  const isbn = generateISBN();
  const asin = generateASIN();
  const publishDate = getRandomElement(publishYears);
  const description = getRandomElement(descriptions[genre as keyof typeof descriptions] || descriptions.fiction);
  const sampleText = getRandomElement(sampleTexts);
  const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
  const reviewCount = Math.floor(Math.random() * 50000) + 1000;
  const price = `$${(9.99 + Math.random() * 20).toFixed(2)}`;

  return {
    id: asin,
    title,
    author,
    cover: generateCoverUrl(title),
    isbn,
    publishDate,
    genre: genre.charAt(0).toUpperCase() + genre.slice(1).replace('-', ' '),
    audience: 'Adult',
    description,
    amazonUrl: `https://www.amazon.com/dp/${asin}`,
    sampleText,
    rating,
    reviewCount,
    price,
    asin
  };
}

export class AmazonBooksService {
  static async getBooksByGenre(genre: string, limit: number = 8): Promise<AmazonBook[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const books: AmazonBook[] = [];
    const targetGenre = genre === 'all' ? getRandomElement(['fiction', 'non-fiction', 'mystery', 'science-fiction']) : genre;
    
    for (let i = 0; i < limit; i++) {
      const bookGenre = genre === 'all' ? getRandomElement(['fiction', 'non-fiction', 'mystery', 'science-fiction']) : targetGenre;
      books.push(generateBook(bookGenre));
    }
    
    return books;
  }

  static async getBookById(id: string): Promise<AmazonBook | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate a book based on the ID
    const genres = ['fiction', 'non-fiction', 'mystery', 'science-fiction'];
    const genre = getRandomElement(genres);
    const book = generateBook(genre);
    book.id = id;
    book.asin = id;
    book.amazonUrl = `https://www.amazon.com/dp/${id}`;
    
    return book;
  }

  static async searchBooks(query: string): Promise<AmazonBook[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const books: AmazonBook[] = [];
    const genres = ['fiction', 'non-fiction', 'mystery', 'science-fiction'];
    
    for (let i = 0; i < 5; i++) {
      const genre = getRandomElement(genres);
      const book = generateBook(genre);
      // Modify title to include search query
      book.title = `${query}: ${book.title}`;
      books.push(book);
    }
    
    return books;
  }

  static async getRandomBooksByGenre(genre: string, exclude: string[] = []): Promise<AmazonBook[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const books: AmazonBook[] = [];
    const targetGenre = genre === 'all' ? getRandomElement(['fiction', 'non-fiction', 'mystery', 'science-fiction']) : genre;
    
    for (let i = 0; i < 4; i++) {
      const bookGenre = genre === 'all' ? getRandomElement(['fiction', 'non-fiction', 'mystery', 'science-fiction']) : targetGenre;
      const book = generateBook(bookGenre);
      
      // Ensure we don't generate excluded IDs
      while (exclude.includes(book.id)) {
        book.id = generateASIN();
        book.asin = book.id;
        book.amazonUrl = `https://www.amazon.com/dp/${book.id}`;
      }
      
      books.push(book);
    }
    
    return books;
  }

  static getAllGenres(): string[] {
    return ['fiction', 'non-fiction', 'mystery', 'science-fiction'];
  }
}