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
  'action-&-adventure': [
    'The {adjective} {noun}', 'Quest for {noun}', 'The {place} Adventure',
    'Journey to {place}', 'The {adjective} Quest', 'Adventures of {character}',
    'The {place} Expedition', 'Voyage to {place}', 'The {adjective} Trail'
  ],
  'arts-&-music': [
    'The Art of {concept}', 'Music of {place}', 'The {adjective} Symphony',
    'Canvas of {concept}', 'The {adjective} Melody', 'Rhythm of {place}',
    'The {concept} Gallery', 'Songs of {place}', 'The {adjective} Performance'
  ],
  'biographies-&-memoirs': [
    'The Life of {character}', '{character}: A Biography', 'The {adjective} Life',
    'Journey of {character}', '{character}\'s Story', 'The {adjective} Years',
    'Memoirs of {character}', 'The {character} Chronicles', 'Life and Times of {character}'
  ],
  'business-&-investing': [
    'The {adjective} Leader', 'Business {concept}', 'The Art of {skill}',
    'Strategic {concept}', 'The {adjective} Company', 'Leadership {concept}',
    'The {skill} Advantage', 'Building {adjective} Teams', 'The {concept} Revolution'
  ],
  'children\'s-books': [
    'The {adjective} {animal}', '{character} and the {noun}', 'The Magic {noun}',
    '{character}\'s Adventure', 'The {adjective} Forest', 'Tales of {character}',
    'The {noun} Friends', '{character} Learns {concept}', 'The {adjective} Day'
  ],
  'computers-&-technology': [
    'The {adjective} Code', 'Digital {concept}', 'The {concept} Revolution',
    'Programming {concept}', 'The {adjective} Algorithm', 'Tech {concept}',
    'The {concept} Framework', 'Coding {concept}', 'The {adjective} System'
  ],
  'cooking,-food-&-wine': [
    'The {adjective} Kitchen', 'Flavors of {place}', 'The {concept} Cookbook',
    'Cooking with {concept}', 'The {adjective} Recipe', 'Taste of {place}',
    'The {concept} Table', 'Culinary {concept}', 'The {adjective} Feast'
  ],
  'crafts-&-hobbies': [
    'The Art of {skill}', 'Crafting {concept}', 'The {adjective} Project',
    'DIY {concept}', 'The {skill} Guide', 'Creating {concept}',
    'The {adjective} Craft', 'Handmade {concept}', 'The {skill} Workshop'
  ],
  'education-&-reference': [
    'The Complete Guide to {concept}', 'Understanding {concept}', 'The {concept} Handbook',
    'Mastering {skill}', 'The {adjective} Reference', 'Learning {concept}',
    'The {concept} Encyclopedia', 'Study of {concept}', 'The {adjective} Manual'
  ],
  'fiction': [
    'The {adjective} {noun}', '{adjective} {timeOfDay}', 'The {noun} of {place}',
    '{character}\'s {journey}', 'Beyond the {noun}', 'The Last {noun}',
    'Whispers of {place}', 'The {adjective} Garden', 'Shadows in {place}'
  ],
  'historical-fiction': [
    'The {place} Chronicles', 'Tales from {place}', 'The {adjective} Century',
    'Secrets of {place}', 'The {place} Story', 'Ancient {place}',
    'The {adjective} Empire', 'Legends of {place}', 'The {place} Legacy'
  ],
  'literary-fiction': [
    'The {adjective} {noun}', 'Memories of {place}', 'The {concept} Garden',
    'Letters from {place}', 'The {adjective} Heart', 'Echoes of {place}',
    'The {noun} Keeper', 'Stories of {place}', 'The {adjective} Season'
  ],
  'mystery-&-thriller': [
    'The {place} Mystery', 'Murder in {place}', 'The {adjective} Detective',
    'Secrets of {place}', 'The {noun} Conspiracy', 'Death in {place}',
    'The {adjective} Case', 'Blood on {place}', 'The {place} Murders'
  ],
  'romance': [
    '{adjective} Hearts', 'Love in {place}', 'The {adjective} Promise',
    '{character}\'s Heart', 'Passion in {place}', 'The {adjective} Kiss',
    'Romance in {place}', 'The {adjective} Wedding', 'Hearts of {place}'
  ],
  'science-fiction-&-fantasy': [
    'The {planet} Protocol', 'Beyond {place}', 'The {adjective} Galaxy',
    '{character} Rising', 'The {noun} Wars', 'Quantum {concept}',
    'The {adjective} Future', 'Stars of {place}', 'The {noun} Paradox'
  ],
  'health-&-wellness': [
    'The {adjective} Body', 'Healing {concept}', 'The {concept} Way',
    'Wellness {concept}', 'The {adjective} Mind', 'Health {concept}',
    'The {concept} Solution', 'Living {adjective}', 'The {adjective} Life'
  ],
  'history': [
    'The {adjective} Era', 'History of {place}', 'The {place} Chronicles',
    'Tales from {place}', 'The {adjective} Century', 'Secrets of {place}',
    'The {place} Story', 'Ancient {place}', 'The {adjective} Empire'
  ],
  'humor': [
    'The {adjective} {noun}', 'Laughing at {concept}', 'The {concept} Comedy',
    'Funny {concept}', 'The {adjective} Joke', 'Comedy of {concept}',
    'The {concept} Humor', 'Jokes about {concept}', 'The {adjective} Laugh'
  ],
  'lgbtq+-books': [
    'The {adjective} {noun}', 'Pride in {place}', 'The {concept} Story',
    'Love and {concept}', 'The {adjective} Heart', 'Stories of {concept}',
    'The {concept} Journey', 'Finding {concept}', 'The {adjective} Truth'
  ],
  'medical': [
    'The {adjective} Doctor', 'Medical {concept}', 'The {concept} Cure',
    'Healing {concept}', 'The {adjective} Patient', 'Medicine {concept}',
    'The {concept} Treatment', 'Clinical {concept}', 'The {adjective} Diagnosis'
  ],
  'outdoor-&-sports': [
    'The {adjective} Trail', 'Adventures in {place}', 'The {concept} Challenge',
    'Outdoor {concept}', 'The {adjective} Mountain', 'Sports {concept}',
    'The {concept} Adventure', 'Wild {place}', 'The {adjective} Journey'
  ],
  'parenting-&-relationships': [
    'The {adjective} Parent', 'Raising {adjective} Children', 'The {concept} Family',
    'Parenting {concept}', 'The {adjective} Child', 'Family {concept}',
    'The {concept} Relationship', 'Love and {concept}', 'The {adjective} Home'
  ],
  'pets': [
    'The {adjective} {animal}', 'Life with {animal}', 'The {concept} Pet',
    'Caring for {animal}', 'The {adjective} Companion', 'Pet {concept}',
    'The {animal} Guide', 'Stories of {animal}', 'The {adjective} Friend'
  ],
  'politics-&-social-sciences': [
    'The {adjective} State', 'Politics of {concept}', 'The {concept} Society',
    'Social {concept}', 'The {adjective} Government', 'Democracy {concept}',
    'The {concept} System', 'Political {concept}', 'The {adjective} Nation'
  ],
  'psychology': [
    'The {adjective} Mind', 'Psychology of {concept}', 'Understanding {concept}',
    'The {concept} Brain', 'Mental {concept}', 'The {adjective} Psyche',
    'Cognitive {concept}', 'The Mind\'s {noun}', 'Behavioral {concept}'
  ],
  'religion-&-spirituality': [
    'The {adjective} Spirit', 'Faith in {concept}', 'The {concept} Path',
    'Spiritual {concept}', 'The {adjective} Soul', 'Sacred {concept}',
    'The {concept} Journey', 'Divine {concept}', 'The {adjective} Way'
  ],
  'science-&-math': [
    'The {adjective} Universe', 'Science of {concept}', 'The {concept} Theory',
    'Mathematical {concept}', 'The {adjective} Equation', 'Physics {concept}',
    'The {concept} Formula', 'Scientific {concept}', 'The {adjective} Discovery'
  ],
  'self-help': [
    'The {adjective} You', 'Transform Your {concept}', 'The Art of {skill}',
    'Mastering {concept}', 'The {adjective} Mind', 'Unlock Your {potential}',
    'The Power of {concept}', 'Building {skill}', 'The {adjective} Life'
  ],
  'sports-&-outdoors': [
    'The {adjective} Game', 'Sports {concept}', 'The {concept} Champion',
    'Athletic {concept}', 'The {adjective} Player', 'Competition {concept}',
    'The {concept} Victory', 'Training {concept}', 'The {adjective} Season'
  ],
  'travel': [
    'Journey to {place}', 'Exploring {place}', 'The {adjective} Traveler',
    'Adventures in {place}', 'The {place} Guide', 'Discovering {place}',
    'The {concept} Journey', 'Wandering {place}', 'The {adjective} Voyage'
  ],
  'young-adult': [
    'The {adjective} {noun}', '{character}\'s {journey}', 'The {concept} Academy',
    'Teen {concept}', 'The {adjective} High School', 'Young {concept}',
    'The {concept} Club', 'Coming of {concept}', 'The {adjective} Summer'
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
  planet: ['Mars', 'Europa', 'Titan', 'Proxima', 'Kepler', 'Gliese', 'Trappist', 'Alpha', 'Beta', 'Gamma', 'Centauri', 'Vega', 'Sirius', 'Arcturus', 'Polaris'],
  animal: ['Cat', 'Dog', 'Bird', 'Fish', 'Rabbit', 'Horse', 'Lion', 'Tiger', 'Bear', 'Wolf', 'Fox', 'Deer', 'Elephant', 'Dolphin', 'Whale']
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
  'action-&-adventure': [
    'A thrilling expedition that takes readers to the far corners of the earth and beyond.',
    'An action-packed journey filled with danger, discovery, and personal transformation.',
    'A gripping adventure that combines physical challenges with emotional and spiritual growth.',
    'An epic quest that tests the limits of human endurance and the power of determination.',
    'A heart-pounding adventure that explores uncharted territories and unknown possibilities.'
  ],
  'arts-&-music': [
    'A beautiful exploration of creativity and artistic expression in all its forms.',
    'An inspiring journey through the world of music and visual arts.',
    'A captivating look at how art transforms lives and communities.',
    'A passionate celebration of creativity and the artistic spirit.',
    'An intimate portrait of artists and their creative processes.'
  ],
  'biographies-&-memoirs': [
    'An inspiring portrait of a life lived with purpose, passion, and unwavering determination.',
    'A comprehensive examination of a remarkable individual who changed the course of history.',
    'An intimate look at the personal struggles and triumphs that shaped an extraordinary life.',
    'A meticulously researched biography that reveals the human story behind the public figure.',
    'An engaging narrative that brings to life the challenges and achievements of a true pioneer.'
  ],
  'business-&-investing': [
    'A strategic guide to building and leading successful organizations in the modern economy.',
    'An innovative approach to management that combines proven principles with cutting-edge insights.',
    'A comprehensive examination of the leadership skills needed to thrive in today\'s business environment.',
    'A practical handbook for entrepreneurs and executives seeking sustainable competitive advantage.',
    'An insightful analysis of market trends and business strategies that drive long-term success.'
  ],
  'children\'s-books': [
    'A delightful story that sparks imagination and teaches valuable life lessons.',
    'A charming tale filled with adventure, friendship, and important discoveries.',
    'An engaging story that helps children understand the world around them.',
    'A fun and educational adventure that encourages curiosity and learning.',
    'A heartwarming story about friendship, courage, and growing up.'
  ],
  'computers-&-technology': [
    'A comprehensive guide to understanding and leveraging cutting-edge technology.',
    'An accessible exploration of how technology is reshaping our world.',
    'A practical handbook for navigating the digital landscape.',
    'An insightful analysis of emerging technologies and their implications.',
    'A forward-thinking guide to the future of computing and innovation.'
  ],
  'cooking,-food-&-wine': [
    'A culinary journey that celebrates the art and science of cooking.',
    'A delicious exploration of flavors, techniques, and food traditions.',
    'A comprehensive guide to creating memorable meals and experiences.',
    'An inspiring cookbook that brings restaurant-quality dishes to your home.',
    'A passionate celebration of food culture and culinary creativity.'
  ],
  'crafts-&-hobbies': [
    'A comprehensive guide to mastering traditional and modern crafting techniques.',
    'An inspiring collection of projects that celebrate creativity and handmade artistry.',
    'A practical handbook for developing new skills and exploring creative hobbies.',
    'A detailed guide to creating beautiful, functional items with your own hands.',
    'An encouraging resource for crafters of all skill levels and interests.'
  ],
  'education-&-reference': [
    'A comprehensive resource that provides essential knowledge and practical guidance.',
    'An authoritative reference that serves as an invaluable learning tool.',
    'A thorough examination of key concepts and their real-world applications.',
    'A well-organized guide that makes complex subjects accessible and understandable.',
    'An essential reference that supports both learning and professional development.'
  ],
  'fiction': [
    'A captivating tale that weaves together love, loss, and redemption in unexpected ways.',
    'An emotionally powerful story that explores the depths of human connection and resilience.',
    'A beautifully crafted narrative that takes readers on an unforgettable journey of discovery.',
    'A compelling exploration of family, identity, and the choices that define us.',
    'An intricate story of secrets, betrayal, and the power of forgiveness.'
  ],
  'historical-fiction': [
    'A vivid recreation of a bygone era that brings history to life through compelling characters.',
    'An immersive historical narrative that illuminates the human experience across time.',
    'A meticulously researched story that captures the essence of a pivotal historical moment.',
    'A sweeping tale that weaves personal stories into the fabric of historical events.',
    'A powerful exploration of how historical forces shape individual lives and destinies.'
  ],
  'literary-fiction': [
    'A profound meditation on the human condition told through exquisite prose.',
    'An elegant exploration of memory, identity, and the passage of time.',
    'A sophisticated narrative that examines the complexities of modern life.',
    'A beautifully written story that captures the subtleties of human emotion.',
    'A thoughtful examination of relationships, loss, and the search for meaning.'
  ],
  'mystery-&-thriller': [
    'A gripping thriller that keeps readers guessing until the final page.',
    'An intricate puzzle filled with red herrings, shocking twists, and dark secrets.',
    'A masterfully plotted mystery that explores the darker side of human nature.',
    'A suspenseful tale of deception, betrayal, and the pursuit of justice.',
    'An atmospheric thriller that combines psychological depth with edge-of-your-seat tension.'
  ],
  'romance': [
    'A heartwarming love story that celebrates the power of connection and second chances.',
    'A passionate romance that explores the depths of love, loss, and redemption.',
    'A tender tale of two hearts finding their way to each other against all odds.',
    'A captivating love story that weaves together destiny, desire, and devotion.',
    'A romantic journey that proves love can conquer even the greatest obstacles.'
  ],
  'science-fiction-&-fantasy': [
    'A visionary exploration of humanity\'s future among the stars.',
    'An enchanting tale of magic, adventure, and the eternal struggle between good and evil.',
    'A thought-provoking story that examines the intersection of technology and human nature.',
    'An epic space opera that spans galaxies and challenges our understanding of reality.',
    'A richly imagined world where ancient prophecies and modern heroes collide.'
  ],
  'health-&-wellness': [
    'A comprehensive guide to achieving optimal health and well-being.',
    'An evidence-based approach to improving physical and mental health.',
    'A practical handbook for creating sustainable healthy lifestyle changes.',
    'An inspiring guide to holistic wellness and personal transformation.',
    'A thoughtful exploration of the mind-body connection and healing.'
  ],
  'history': [
    'A fascinating exploration of pivotal moments that shaped our modern world.',
    'A comprehensive examination of historical events through the lens of contemporary scholarship.',
    'An engaging narrative that brings the past to life with vivid detail and compelling storytelling.',
    'A thought-provoking analysis of how historical forces continue to influence our present.',
    'A meticulously researched account that challenges conventional understanding of the past.'
  ],
  'humor': [
    'A hilarious collection of observations about modern life and human nature.',
    'A witty and entertaining exploration of the absurdities of everyday existence.',
    'A laugh-out-loud funny book that finds humor in the most unexpected places.',
    'A clever and satirical look at contemporary culture and society.',
    'A delightfully funny story that combines humor with heart and wisdom.'
  ],
  'lgbtq+-books': [
    'A powerful story of identity, acceptance, and the courage to live authentically.',
    'An inspiring tale of love, family, and finding your place in the world.',
    'A moving exploration of LGBTQ+ experiences and the journey toward self-acceptance.',
    'A heartfelt story that celebrates diversity and the strength of community.',
    'An important narrative that gives voice to underrepresented experiences and perspectives.'
  ],
  'medical': [
    'A comprehensive guide to understanding medical conditions and treatment options.',
    'An accessible exploration of cutting-edge medical research and breakthroughs.',
    'A practical handbook for navigating the healthcare system and making informed decisions.',
    'An insightful examination of the art and science of medicine.',
    'A thorough resource for understanding health, disease, and healing.'
  ],
  'outdoor-&-sports': [
    'An inspiring guide to outdoor adventures and athletic pursuits.',
    'A comprehensive handbook for exploring nature and staying active.',
    'An exciting exploration of extreme sports and outdoor challenges.',
    'A practical guide to fitness, training, and athletic performance.',
    'An adventure-filled journey through the world of outdoor recreation.'
  ],
  'parenting-&-relationships': [
    'A thoughtful guide to building strong, healthy family relationships.',
    'A practical handbook for navigating the challenges and joys of parenting.',
    'An insightful exploration of communication and connection in relationships.',
    'A comprehensive resource for creating a loving, supportive family environment.',
    'A wise and compassionate guide to raising confident, resilient children.'
  ],
  'pets': [
    'A comprehensive guide to caring for and understanding your beloved pet.',
    'A heartwarming collection of stories about the special bond between humans and animals.',
    'A practical handbook for pet owners seeking to provide the best care possible.',
    'An entertaining and informative look at pet behavior and training.',
    'A loving tribute to the joy and companionship that pets bring to our lives.'
  ],
  'politics-&-social-sciences': [
    'A thought-provoking analysis of contemporary political and social issues.',
    'A comprehensive examination of how societies function and evolve.',
    'An insightful exploration of power, governance, and social change.',
    'A critical look at the forces shaping our political and social landscape.',
    'A scholarly yet accessible study of human behavior in social and political contexts.'
  ],
  'psychology': [
    'A groundbreaking exploration of the human mind and the factors that shape behavior.',
    'An accessible guide to understanding cognitive biases and improving decision-making.',
    'A comprehensive examination of the latest research in neuroscience and psychology.',
    'An insightful analysis of how emotions, thoughts, and behaviors interact to create our experience.',
    'A practical application of psychological principles to enhance well-being and performance.'
  ],
  'religion-&-spirituality': [
    'A profound exploration of faith, meaning, and the spiritual dimension of human experience.',
    'An inspiring guide to spiritual growth and personal transformation.',
    'A thoughtful examination of religious traditions and their contemporary relevance.',
    'A compassionate exploration of the search for meaning and purpose in life.',
    'A wise and accessible guide to spiritual practices and beliefs.'
  ],
  'science-&-math': [
    'A fascinating exploration of the natural world and the laws that govern it.',
    'An accessible introduction to complex scientific concepts and mathematical principles.',
    'A comprehensive examination of cutting-edge research and scientific discoveries.',
    'An engaging look at how science and mathematics shape our understanding of reality.',
    'A thought-provoking exploration of the beauty and elegance of scientific knowledge.'
  ],
  'self-help': [
    'A practical guide that provides actionable strategies for personal transformation and growth.',
    'An empowering book that helps readers unlock their potential and achieve their goals.',
    'A comprehensive approach to building resilience, confidence, and lasting success.',
    'An insightful exploration of the mindset and habits that lead to extraordinary achievement.',
    'A transformative guide that combines ancient wisdom with modern psychological research.'
  ],
  'sports-&-outdoors': [
    'An inspiring guide to athletic excellence and outdoor adventure.',
    'A comprehensive handbook for sports enthusiasts and outdoor adventurers.',
    'An exciting exploration of competitive sports and recreational activities.',
    'A practical guide to training, performance, and athletic achievement.',
    'An adventure-filled journey through the world of sports and outdoor recreation.'
  ],
  'travel': [
    'An inspiring guide to exploring the world and discovering new cultures.',
    'A comprehensive handbook for travelers seeking authentic experiences.',
    'An exciting journey through some of the world\'s most fascinating destinations.',
    'A practical guide to travel planning and cultural immersion.',
    'An adventure-filled exploration of the transformative power of travel.'
  ],
  'young-adult': [
    'A compelling coming-of-age story that explores identity, friendship, and growing up.',
    'An engaging tale of teenage life, challenges, and self-discovery.',
    'A powerful story about finding your voice and standing up for what you believe in.',
    'An inspiring narrative about overcoming obstacles and pursuing your dreams.',
    'A heartfelt exploration of the complexities of adolescence and young adulthood.'
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
    genre: genre.charAt(0).toUpperCase() + genre.slice(1).replace(/-/g, ' '),
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