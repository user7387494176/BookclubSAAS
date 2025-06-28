// Amazon Books API service with dynamic book generation based on user preferences
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

// Comprehensive genre-specific content templates
const bookTitleTemplates = {
  fiction: [
    'The {adjective} {noun}', '{adjective} {timeOfDay}', 'The {noun} of {place}',
    '{character}\'s {journey}', 'Beyond the {noun}', 'The Last {noun}',
    'Whispers of {place}', 'The {adjective} Garden', 'Shadows in {place}',
    'The {noun} Chronicles', 'Letters from {place}', 'The {adjective} Heart'
  ],
  'non-fiction': [
    'The Art of {skill}', 'Mastering {concept}', '{concept}: A Complete Guide',
    'The {adjective} Mind', 'Unlocking {potential}', 'The Science of {concept}',
    'Building {skill}', 'The {adjective} Leader', 'Principles of {concept}',
    'The {skill} Revolution', 'Thinking {adjective}', 'The Power of {concept}'
  ],
  mystery: [
    'The {place} Mystery', 'Murder in {place}', 'The {adjective} Detective',
    'Secrets of {place}', 'The {noun} Conspiracy', 'Death in {place}',
    'The {adjective} Case', 'Blood on {place}', 'The {place} Murders',
    'Silent {noun}', 'The {adjective} Witness', 'Shadows of {place}'
  ],
  'science-fiction': [
    'The {planet} Protocol', 'Beyond {place}', 'The {adjective} Galaxy',
    '{character} Rising', 'The {noun} Wars', 'Quantum {concept}',
    'The {adjective} Future', 'Stars of {place}', 'The {noun} Paradox',
    'Digital {concept}', 'The {adjective} Dimension', 'Chronicles of {planet}'
  ],
  fantasy: [
    'The {adjective} Realm', 'Chronicles of {place}', 'The {noun} Prophecy',
    'Legends of {character}', 'The {adjective} Crown', 'Realm of {noun}',
    'The {place} Saga', 'Magic of {place}', 'The {adjective} Throne',
    'Quest for {noun}', 'The {adjective} Sword', 'Tales of {place}'
  ],
  romance: [
    '{adjective} Hearts', 'Love in {place}', 'The {adjective} Promise',
    '{character}\'s Heart', 'Passion in {place}', 'The {adjective} Kiss',
    'Romance in {place}', 'The {adjective} Wedding', 'Hearts of {place}',
    'The {adjective} Bride', 'Love\'s {adjective} {noun}', 'The {place} Romance'
  ],
  biography: [
    'The Life of {character}', '{character}: A Biography', 'The {adjective} Life',
    'Journey of {character}', '{character}\'s Story', 'The {adjective} Years',
    'Memoirs of {character}', 'The {character} Chronicles', 'Life and Times of {character}',
    'The {adjective} Legacy', '{character}: An Autobiography', 'The {character} Story'
  ],
  history: [
    'The {adjective} Era', 'History of {place}', 'The {place} Chronicles',
    'Tales from {place}', 'The {adjective} Century', 'Secrets of {place}',
    'The {place} Story', 'Ancient {place}', 'The {adjective} Empire',
    'Legends of {place}', 'The {place} Legacy', 'Chronicles of {adjective} Times'
  ],
  'self-help': [
    'The {adjective} You', 'Transform Your {concept}', 'The Art of {skill}',
    'Mastering {concept}', 'The {adjective} Mind', 'Unlock Your {potential}',
    'The Power of {concept}', 'Building {skill}', 'The {adjective} Life',
    'Discover Your {potential}', 'The {skill} Method', 'Creating {adjective} {concept}'
  ],
  business: [
    'The {adjective} Leader', 'Business {concept}', 'The Art of {skill}',
    'Strategic {concept}', 'The {adjective} Company', 'Leadership {concept}',
    'The {skill} Advantage', 'Building {adjective} Teams', 'The {concept} Revolution',
    'Innovative {concept}', 'The {adjective} Strategy', 'Mastering {skill}'
  ],
  philosophy: [
    'The {adjective} Mind', 'Thoughts on {concept}', 'The Nature of {concept}',
    'Philosophy of {concept}', 'The {adjective} Truth', 'Wisdom of {concept}',
    'The {concept} Question', 'Understanding {concept}', 'The {adjective} Path',
    'Reflections on {concept}', 'The {concept} Paradox', 'The {adjective} Way'
  ],
  psychology: [
    'The {adjective} Mind', 'Psychology of {concept}', 'Understanding {concept}',
    'The {concept} Brain', 'Mental {concept}', 'The {adjective} Psyche',
    'Cognitive {concept}', 'The Mind\'s {noun}', 'Behavioral {concept}',
    'The {adjective} Self', 'Psychology Today: {concept}', 'The {concept} Effect'
  ],
  poetry: [
    '{adjective} Verses', 'Songs of {place}', 'The {adjective} Collection',
    'Poems from {place}', '{adjective} Words', 'The {noun} Poems',
    'Verses of {concept}', 'The {adjective} Voice', 'Poetry of {place}',
    '{adjective} Reflections', 'The {place} Anthology', 'Words of {concept}'
  ],
  drama: [
    'The {adjective} Stage', 'Drama in {place}', 'The {place} Play',
    'Acts of {concept}', 'The {adjective} Performance', 'Scenes from {place}',
    'The {noun} Drama', 'Theater of {concept}', 'The {adjective} Act',
    'Plays from {place}', 'The {concept} Stage', 'Drama and {concept}'
  ],
  adventure: [
    'Quest for {noun}', 'Adventure in {place}', 'The {adjective} Journey',
    'Expedition to {place}', 'The {place} Adventure', 'Journey to {place}',
    'The {adjective} Quest', 'Adventures of {character}', 'The {place} Expedition',
    'Voyage to {place}', 'The {adjective} Trail', 'Exploring {place}'
  ]
};

const wordLists = {
  adjective: ['Silent', 'Hidden', 'Forgotten', 'Ancient', 'Mysterious', 'Golden', 'Silver', 'Dark', 'Bright', 'Lost', 'Sacred', 'Eternal', 'Infinite', 'Perfect', 'Broken', 'Wild', 'Gentle', 'Fierce', 'Peaceful', 'Bold'],
  noun: ['Heart', 'Soul', 'Dream', 'Shadow', 'Light', 'Key', 'Door', 'Path', 'Journey', 'Secret', 'Truth', 'Memory', 'Hope', 'Promise', 'Legacy', 'Vision', 'Spirit', 'Destiny', 'Wonder', 'Magic'],
  place: ['Paris', 'London', 'Tokyo', 'Venice', 'Prague', 'Barcelona', 'Vienna', 'Florence', 'Amsterdam', 'Edinburgh', 'Santorini', 'Kyoto', 'Marrakech', 'Istanbul', 'Dubrovnik', 'Tuscany', 'Provence', 'Bali', 'Patagonia', 'Iceland'],
  character: ['Elena', 'Marcus', 'Isabella', 'Alexander', 'Sophia', 'Gabriel', 'Aria', 'Sebastian', 'Luna', 'Adrian', 'Celeste', 'Dante', 'Aurora', 'Phoenix', 'Sage', 'Maya', 'Oliver', 'Zara', 'Leo', 'Iris'],
  journey: ['Quest', 'Adventure', 'Discovery', 'Awakening', 'Transformation', 'Redemption', 'Legacy', 'Destiny', 'Revolution', 'Renaissance', 'Odyssey', 'Pilgrimage', 'Voyage', 'Expedition', 'Mission'],
  timeOfDay: ['Dawn', 'Midnight', 'Twilight', 'Sunrise', 'Sunset', 'Moonrise', 'Daybreak', 'Dusk', 'Evening', 'Morning', 'Noon', 'Starlight', 'Moonlight', 'Sundown', 'Nightfall'],
  skill: ['Leadership', 'Innovation', 'Communication', 'Creativity', 'Focus', 'Resilience', 'Mindfulness', 'Productivity', 'Influence', 'Strategy', 'Negotiation', 'Empathy', 'Collaboration', 'Vision', 'Execution'],
  concept: ['Success', 'Happiness', 'Growth', 'Change', 'Excellence', 'Purpose', 'Balance', 'Wisdom', 'Courage', 'Freedom', 'Innovation', 'Transformation', 'Achievement', 'Fulfillment', 'Breakthrough'],
  potential: ['Potential', 'Creativity', 'Intelligence', 'Intuition', 'Imagination', 'Innovation', 'Inspiration', 'Insight', 'Vision', 'Genius', 'Talent', 'Ability', 'Capacity', 'Power', 'Strength'],
  planet: ['Mars', 'Europa', 'Titan', 'Proxima', 'Kepler', 'Gliese', 'Trappist', 'Alpha', 'Beta', 'Gamma', 'Centauri', 'Vega', 'Sirius', 'Arcturus', 'Polaris']
};

const authorNames = [
  'Elena Rodriguez', 'Marcus Chen', 'Isabella Thompson', 'Alexander Kim', 'Sophia Williams',
  'Gabriel Martinez', 'Aria Patel', 'Sebastian Brown', 'Luna Davis', 'Adrian Wilson',
  'Celeste Johnson', 'Dante Garcia', 'Aurora Lee', 'Phoenix Taylor', 'Sage Anderson',
  'Maya Singh', 'Oliver Zhang', 'Zara Ahmed', 'Leo Nakamura', 'Iris Kowalski',
  'Felix Dubois', 'Nova Petrov', 'Kai Johansson', 'Vera Rossi', 'Atlas Murphy',
  'Raven Blake', 'Orion Cross', 'Stella Reyes', 'Jasper Stone', 'Lyra Moon'
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
  ],
  fantasy: [
    'An enchanting tale of magic, adventure, and the eternal struggle between good and evil.',
    'A richly imagined world where ancient prophecies and modern heroes collide.',
    'An epic fantasy that weaves together mythology, magic, and unforgettable characters.',
    'A spellbinding journey through realms where anything is possible and everything is at stake.',
    'A masterful blend of world-building, character development, and magical storytelling.',
    'An immersive fantasy that explores themes of power, destiny, and the courage to change fate.',
    'A captivating adventure that transports readers to a world of wonder and danger.',
    'An intricate tale of kingdoms, quests, and the magic that binds all living things.',
    'A powerful story of heroes rising to meet their destiny in a world on the brink of chaos.',
    'An unforgettable fantasy that celebrates the triumph of hope over darkness.'
  ],
  romance: [
    'A heartwarming love story that celebrates the power of connection and second chances.',
    'A passionate romance that explores the depths of love, loss, and redemption.',
    'A tender tale of two hearts finding their way to each other against all odds.',
    'A captivating love story that weaves together destiny, desire, and devotion.',
    'A romantic journey that proves love can conquer even the greatest obstacles.',
    'A beautiful exploration of love in all its forms, from first attraction to lasting commitment.',
    'A steamy romance that combines passion with emotional depth and character growth.',
    'A sweet love story that reminds us that the best relationships are built on friendship and trust.',
    'A compelling romance that examines how love can transform and heal even the most broken hearts.',
    'An enchanting tale of love that transcends time, distance, and circumstance.'
  ],
  biography: [
    'An inspiring portrait of a life lived with purpose, passion, and unwavering determination.',
    'A comprehensive examination of a remarkable individual who changed the course of history.',
    'An intimate look at the personal struggles and triumphs that shaped an extraordinary life.',
    'A meticulously researched biography that reveals the human story behind the public figure.',
    'An engaging narrative that brings to life the challenges and achievements of a true pioneer.',
    'A thoughtful exploration of how one person\'s vision and courage can impact the world.',
    'A compelling story of resilience, innovation, and the pursuit of excellence.',
    'An authoritative account that separates myth from reality in the life of a legendary figure.',
    'A nuanced portrait that examines both the public achievements and private struggles of greatness.',
    'An illuminating biography that offers fresh insights into a life that continues to inspire.'
  ],
  history: [
    'A fascinating exploration of pivotal moments that shaped our modern world.',
    'A comprehensive examination of historical events through the lens of contemporary scholarship.',
    'An engaging narrative that brings the past to life with vivid detail and compelling storytelling.',
    'A thought-provoking analysis of how historical forces continue to influence our present.',
    'A meticulously researched account that challenges conventional understanding of the past.',
    'An accessible yet authoritative exploration of complex historical developments.',
    'A gripping tale of human drama set against the backdrop of world-changing events.',
    'An illuminating study that reveals the hidden connections between past and present.',
    'A balanced examination that presents multiple perspectives on controversial historical topics.',
    'A compelling narrative that demonstrates how individual actions can alter the course of history.'
  ],
  'self-help': [
    'A practical guide that provides actionable strategies for personal transformation and growth.',
    'An empowering book that helps readers unlock their potential and achieve their goals.',
    'A comprehensive approach to building resilience, confidence, and lasting success.',
    'An insightful exploration of the mindset and habits that lead to extraordinary achievement.',
    'A transformative guide that combines ancient wisdom with modern psychological research.',
    'A step-by-step program for creating positive change in every area of your life.',
    'An inspiring book that shows how to overcome obstacles and turn challenges into opportunities.',
    'A practical toolkit for developing emotional intelligence and building stronger relationships.',
    'A powerful guide to finding purpose, meaning, and fulfillment in both work and life.',
    'An accessible approach to mastering the skills and mindset needed for lasting happiness.'
  ],
  business: [
    'A strategic guide to building and leading successful organizations in the modern economy.',
    'An innovative approach to management that combines proven principles with cutting-edge insights.',
    'A comprehensive examination of the leadership skills needed to thrive in today\'s business environment.',
    'A practical handbook for entrepreneurs and executives seeking sustainable competitive advantage.',
    'An insightful analysis of market trends and business strategies that drive long-term success.',
    'A transformative approach to organizational culture and employee engagement.',
    'A data-driven exploration of the factors that separate high-performing companies from the rest.',
    'A forward-thinking guide to navigating disruption and driving innovation in any industry.',
    'A practical framework for building resilient businesses that can adapt to changing markets.',
    'An authoritative resource for leaders seeking to create value for all stakeholders.'
  ],
  philosophy: [
    'A profound exploration of fundamental questions about existence, meaning, and human nature.',
    'A thoughtful examination of ethical principles and their application to modern life.',
    'An accessible introduction to complex philosophical concepts and their practical implications.',
    'A rigorous analysis of consciousness, reality, and the nature of knowledge.',
    'A compelling argument for new ways of thinking about age-old philosophical problems.',
    'An interdisciplinary approach that bridges philosophy with science, psychology, and culture.',
    'A contemplative journey through the great questions that have puzzled humanity for millennia.',
    'A practical philosophy that offers guidance for living a more examined and meaningful life.',
    'A scholarly yet engaging exploration of how philosophical thinking can inform everyday decisions.',
    'A transformative work that challenges readers to question their assumptions about reality and truth.'
  ],
  psychology: [
    'A groundbreaking exploration of the human mind and the factors that shape behavior.',
    'An accessible guide to understanding cognitive biases and improving decision-making.',
    'A comprehensive examination of the latest research in neuroscience and psychology.',
    'An insightful analysis of how emotions, thoughts, and behaviors interact to create our experience.',
    'A practical application of psychological principles to enhance well-being and performance.',
    'A fascinating look at the unconscious processes that influence our daily lives.',
    'An evidence-based approach to understanding and improving mental health and resilience.',
    'A compelling exploration of how social and cultural factors shape psychological development.',
    'A thought-provoking examination of the relationship between mind, brain, and behavior.',
    'An innovative synthesis of research findings with real-world applications for personal growth.'
  ],
  poetry: [
    'A beautiful collection of verses that captures the essence of human emotion and experience.',
    'An evocative exploration of love, loss, and the profound moments that define our lives.',
    'A lyrical journey through landscapes both external and internal, real and imagined.',
    'A powerful collection that gives voice to universal themes through deeply personal expression.',
    'An intimate anthology that celebrates the beauty and complexity of the human condition.',
    'A moving collection of poems that explores the intersection of memory, identity, and place.',
    'A contemplative work that finds extraordinary meaning in ordinary moments.',
    'A passionate exploration of nature, spirituality, and our connection to the world around us.',
    'A diverse collection that showcases the range and power of contemporary poetic expression.',
    'An inspiring anthology that demonstrates poetry\'s ability to heal, challenge, and transform.'
  ],
  drama: [
    'A powerful theatrical work that explores the depths of human conflict and resolution.',
    'A compelling drama that examines contemporary social issues through compelling characters.',
    'A thought-provoking play that challenges audiences to confront difficult truths about society.',
    'An emotionally charged work that brings complex relationships to vivid life on stage.',
    'A masterful drama that weaves together personal stories with universal themes.',
    'An innovative theatrical piece that pushes the boundaries of traditional dramatic form.',
    'A gripping play that explores the consequences of choice and the nature of responsibility.',
    'A nuanced drama that examines how the past continues to influence the present.',
    'A powerful work that gives voice to marginalized perspectives and untold stories.',
    'An engaging play that combines entertainment with meaningful social commentary.'
  ],
  adventure: [
    'A thrilling expedition that takes readers to the far corners of the earth and beyond.',
    'An action-packed journey filled with danger, discovery, and personal transformation.',
    'A gripping adventure that combines physical challenges with emotional and spiritual growth.',
    'An epic quest that tests the limits of human endurance and the power of determination.',
    'A heart-pounding adventure that explores uncharted territories and unknown possibilities.',
    'A compelling tale of survival against overwhelming odds in hostile environments.',
    'An exhilarating journey that celebrates the human spirit of exploration and discovery.',
    'A riveting adventure that combines historical detail with edge-of-your-seat excitement.',
    'A transformative expedition that reveals how extreme challenges can lead to profound insights.',
    'An unforgettable adventure that demonstrates the courage required to pursue one\'s dreams.'
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
  const colors = ['4F46E5', '059669', 'DC2626', 'D97706', 'C026D3', '0891B2', '7C2D12', '7C3AED', 'EA580C', '0D9488'];
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
    const availableGenres = Object.keys(bookTitleTemplates);
    const targetGenre = genre === 'all' ? getRandomElement(availableGenres) : genre;
    
    for (let i = 0; i < limit; i++) {
      const bookGenre = genre === 'all' ? getRandomElement(availableGenres) : targetGenre;
      books.push(generateBook(bookGenre));
    }
    
    return books;
  }

  static async getBookById(id: string): Promise<AmazonBook | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate a book based on the ID
    const genres = Object.keys(bookTitleTemplates);
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
    const genres = Object.keys(bookTitleTemplates);
    
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
    const availableGenres = Object.keys(bookTitleTemplates);
    const targetGenre = genre === 'all' ? getRandomElement(availableGenres) : genre;
    
    for (let i = 0; i < 4; i++) {
      const bookGenre = genre === 'all' ? getRandomElement(availableGenres) : targetGenre;
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
    return Object.keys(bookTitleTemplates);
  }
}