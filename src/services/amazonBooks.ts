// Amazon Books API service
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
}

// Mock Amazon Books data with real book information
const amazonBooksData: AmazonBook[] = [
  // Fiction
  {
    id: 'amz-1',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    cover: 'https://m.media-amazon.com/images/I/71FTb9X6wsL._SY522_.jpg',
    isbn: '9781501161933',
    publishDate: '2017-06-13',
    genre: 'fiction',
    audience: 'Adult',
    description: 'Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life. But when she chooses unknown magazine reporter Monique Grant for the job, no one is more astounded than Monique herself.',
    amazonUrl: 'https://www.amazon.com/Seven-Husbands-Evelyn-Hugo-Novel/dp/1501161933',
    sampleText: 'I have been married seven times. That is the fact that has defined my entire adult life. It is the fact that has made me famous. It is the fact that has made me rich. It is the fact that has made me hated. It is the fact that has made me loved.',
    rating: 4.6,
    reviewCount: 89234,
    price: '$16.99'
  },
  {
    id: 'amz-2',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    cover: 'https://m.media-amazon.com/images/I/81O55JbkOTL._SY522_.jpg',
    isbn: '9780735219090',
    publishDate: '2018-08-14',
    genre: 'fiction',
    audience: 'Adult',
    description: 'For years, rumors of the "Marsh Girl" have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl.',
    amazonUrl: 'https://www.amazon.com/Where-Crawdads-Sing-Delia-Owens/dp/0735219095',
    sampleText: 'The morning burned so August-hot, the marsh\'s moist breath hung the oaks and pines with fog. The palmetto patches stood unusually quiet except for the low, slow flap of the heron\'s wings lifting from the lagoon.',
    rating: 4.5,
    reviewCount: 156789,
    price: '$15.99'
  },
  {
    id: 'amz-3',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'https://m.media-amazon.com/images/I/71DKbV-LBSL._SY522_.jpg',
    isbn: '9780525559474',
    publishDate: '2020-08-13',
    genre: 'fiction',
    audience: 'Adult',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices...',
    amazonUrl: 'https://www.amazon.com/Midnight-Library-Matt-Haig/dp/0525559477',
    sampleText: 'Nineteen years before she decided to die, Nora Seed sat in the warmth of the school library, she had always loved libraries. Libraries were proof that people could get along.',
    rating: 4.3,
    reviewCount: 67432,
    price: '$14.99'
  },
  {
    id: 'amz-4',
    title: 'The Guest List',
    author: 'Lucy Foley',
    cover: 'https://m.media-amazon.com/images/I/81eB%2B7%2BCkuL._SY522_.jpg',
    isbn: '9780062868930',
    publishDate: '2020-06-02',
    genre: 'fiction',
    audience: 'Adult',
    description: 'On an island off the coast of Ireland, guests gather to celebrate two people joining their lives together as one. The groom: handsome and charming, a rising television star. The bride: smart and ambitious, a magazine publisher.',
    amazonUrl: 'https://www.amazon.com/Guest-List-Novel-Lucy-Foley/dp/0062868934',
    sampleText: 'I have a secret. It\'s a big one. And I\'ve never told anyone. I\'ve been thinking about it more and more recently. About whether I should tell. About what would happen if I did.',
    rating: 4.2,
    reviewCount: 45678,
    price: '$16.99'
  },

  // Non-Fiction
  {
    id: 'amz-5',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://m.media-amazon.com/images/I/81wgcld4wxL._SY522_.jpg',
    isbn: '9780735211292',
    publishDate: '2018-10-16',
    genre: 'non-fiction',
    audience: 'Adult',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    amazonUrl: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
    sampleText: 'It is so easy to overestimate the importance of one defining moment and underestimate the value of making small improvements on a daily basis. Too often, we convince ourselves that massive success requires massive action.',
    rating: 4.8,
    reviewCount: 234567,
    price: '$18.99'
  },
  {
    id: 'amz-6',
    title: 'Educated',
    author: 'Tara Westover',
    cover: 'https://m.media-amazon.com/images/I/81WojUxbbFL._SY522_.jpg',
    isbn: '9780399590504',
    publishDate: '2018-02-20',
    genre: 'non-fiction',
    audience: 'Adult',
    description: 'Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education, and no one to intervene when one of Tara\'s older brothers became violent.',
    amazonUrl: 'https://www.amazon.com/Educated-Memoir-Tara-Westover/dp/0399590501',
    sampleText: 'My strongest memory is not a memory. It\'s something I imagined, then came to remember as if it had happened. The memory was formed when I was five, just before I turned six, from a story my father told in such detail that I and my brothers and sister had each conjured our own cinematic version, with gunfire and shouts.',
    rating: 4.7,
    reviewCount: 178923,
    price: '$17.99'
  },
  {
    id: 'amz-7',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    cover: 'https://m.media-amazon.com/images/I/713jIoMO3UL._SY522_.jpg',
    isbn: '9780062316097',
    publishDate: '2015-02-10',
    genre: 'non-fiction',
    audience: 'Adult',
    description: 'From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be "human."',
    amazonUrl: 'https://www.amazon.com/Sapiens-Humankind-Yuval-Noah-Harari/dp/0062316095',
    sampleText: 'About 13.5 billion years ago, matter, energy, time and space came into being in what is known as the Big Bang. The story of these fundamental features of our universe is called physics.',
    rating: 4.5,
    reviewCount: 98765,
    price: '$19.99'
  },
  {
    id: 'amz-8',
    title: 'Becoming',
    author: 'Michelle Obama',
    cover: 'https://m.media-amazon.com/images/I/81h2gWPTYJL._SY522_.jpg',
    isbn: '9781524763138',
    publishDate: '2018-11-13',
    genre: 'non-fiction',
    audience: 'Adult',
    description: 'In a life filled with meaning and accomplishment, Michelle Obama has emerged as one of the most iconic and compelling women of our era. As First Lady of the United States of America—the first African American to serve in that role—she helped create the most welcoming and inclusive White House in history.',
    amazonUrl: 'https://www.amazon.com/Becoming-Michelle-Obama/dp/1524763136',
    sampleText: 'When I was a kid, my aspirations were simple. I wanted a dog. I wanted a house that had stairs in it—two floors for one family. I wanted, for some reason, a four-door car instead of the two-door Buick Electra that was my father\'s pride and joy.',
    rating: 4.9,
    reviewCount: 145632,
    price: '$20.99'
  },

  // Mystery
  {
    id: 'amz-9',
    title: 'The Thursday Murder Club',
    author: 'Richard Osman',
    cover: 'https://m.media-amazon.com/images/I/91Zqr7AlOTL._SY522_.jpg',
    isbn: '9780735210646',
    publishDate: '2020-09-03',
    genre: 'mystery',
    audience: 'Adult',
    description: 'In a peaceful retirement village, four unlikely friends meet weekly in the Jigsaw Room to discuss unsolved crimes; together they call themselves The Thursday Murder Club. When a local developer is found dead with a mysterious photograph left next to the body, the Thursday Murder Club suddenly find themselves in the middle of their first live case.',
    amazonUrl: 'https://www.amazon.com/Thursday-Murder-Club-Richard-Osman/dp/0735210640',
    sampleText: 'It is Thursday afternoon at Coopers Chase Retirement Village, and the Thursday Murder Club is about to convene. In the Jigsaw Room, with its mismatched chairs and its view of the car park, Elizabeth, Joyce, Ibrahim and Ron sit down with a cup of tea and a biscuit to discuss their latest case.',
    rating: 4.4,
    reviewCount: 87654,
    price: '$16.99'
  },
  {
    id: 'amz-10',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    cover: 'https://m.media-amazon.com/images/I/71W4KZs-8jL._SY522_.jpg',
    isbn: '9781250301697',
    publishDate: '2019-02-05',
    genre: 'mystery',
    audience: 'Adult',
    description: 'Alicia Berenson\'s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house overlooking a park in one of London\'s most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.',
    amazonUrl: 'https://www.amazon.com/Silent-Patient-Alex-Michaelides/dp/1250301696',
    sampleText: 'Alicia Berenson was thirty-three years old when she killed her husband. They had been married for seven years. They were both artists—Alicia was a painter, and Gabriel was a well-known fashion photographer.',
    rating: 4.3,
    reviewCount: 123456,
    price: '$15.99'
  },
  {
    id: 'amz-11',
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    cover: 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SY522_.jpg',
    isbn: '9780307588371',
    publishDate: '2012-06-05',
    genre: 'mystery',
    audience: 'Adult',
    description: 'On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne\'s fifth wedding anniversary. Presents are being wrapped and reservations are being made when Nick\'s clever and beautiful wife disappears from their rented McMansion on the Mississippi River.',
    amazonUrl: 'https://www.amazon.com/Gone-Girl-Gillian-Flynn/dp/030758837X',
    sampleText: 'When I think of my wife, I always think of her head. The shape of it, to begin with. The very first time I saw her, it was the back of the head I saw, and there was something lovely about it, the angles of it.',
    rating: 4.1,
    reviewCount: 234567,
    price: '$14.99'
  },
  {
    id: 'amz-12',
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    cover: 'https://m.media-amazon.com/images/I/91IGU6u-RCL._SY522_.jpg',
    isbn: '9780307949486',
    publishDate: '2008-09-16',
    genre: 'mystery',
    audience: 'Adult',
    description: 'Harriet Vanger, a scion of one of Sweden\'s wealthiest families disappeared over forty years ago. All these years later, her aged uncle continues to seek the truth. He hires Mikael Blomkvist, a crusading journalist recently trapped by a libel conviction, to investigate.',
    amazonUrl: 'https://www.amazon.com/Girl-Dragon-Tattoo-Millennium/dp/0307949486',
    sampleText: 'It happened every year, was almost a ritual. And this was his eighty-second birthday. When, as usual, the flower was delivered, he took off the wrapping paper and then picked up the telephone to call Detective Superintendent Morell who, when he retired, had moved to Lake Siljan in Dalarna.',
    rating: 4.2,
    reviewCount: 156789,
    price: '$15.99'
  },

  // Science Fiction
  {
    id: 'amz-13',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    cover: 'https://m.media-amazon.com/images/I/91vS2L5gKcL._SY522_.jpg',
    isbn: '9780593135204',
    publishDate: '2021-05-04',
    genre: 'science-fiction',
    audience: 'Adult',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn\'t know that. He can\'t even remember his own name, let alone the nature of his assignment or how to complete it.',
    amazonUrl: 'https://www.amazon.com/Project-Hail-Mary-Andy-Weir/dp/0593135202',
    sampleText: 'What\'s two plus two? Something is wrong. I don\'t know what it is, but something is definitely wrong. I can\'t see. I can\'t see anything. And I mean anything. It\'s not just darkness, it\'s... nothing.',
    rating: 4.7,
    reviewCount: 98765,
    price: '$17.99'
  },
  {
    id: 'amz-14',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    cover: 'https://m.media-amazon.com/images/I/71V2V2RU7tL._SY522_.jpg',
    isbn: '9780593318171',
    publishDate: '2021-03-02',
    genre: 'science-fiction',
    audience: 'Adult',
    description: 'Klara and the Sun, the first novel by Kazuo Ishiguro since he was awarded the Nobel Prize in Literature, tells the story of Klara, an Artificial Friend with outstanding observational qualities, who, from her place in the store, watches carefully the behavior of those who come in to browse, and of those who pass on the street outside.',
    amazonUrl: 'https://www.amazon.com/Klara-Sun-novel-Kazuo-Ishiguro/dp/0593318170',
    sampleText: 'When we were new, Rosa and I were mid-store, on the magazines table side, and could see through more than half of the window. So we were able to watch the outside—the office workers hurrying by, the taxis, the runners, the tourists, Beggar Man and his dog, the lower part of the RPO building.',
    rating: 4.1,
    reviewCount: 45678,
    price: '$16.99'
  },
  {
    id: 'amz-15',
    title: 'The Martian',
    author: 'Andy Weir',
    cover: 'https://m.media-amazon.com/images/I/81L2rU8C4PL._SY522_.jpg',
    isbn: '9780553418026',
    publishDate: '2014-02-11',
    genre: 'science-fiction',
    audience: 'Adult',
    description: 'Six days ago, astronaut Mark Watney became one of the first people to walk on Mars. Now, he\'s sure he\'ll be the first person to die there. After a dust storm nearly kills him and forces his crew to evacuate while thinking him dead, Mark finds himself stranded and completely alone with no way to even signal Earth that he\'s alive.',
    amazonUrl: 'https://www.amazon.com/Martian-Novel-Andy-Weir/dp/0553418025',
    sampleText: 'I\'m pretty much fucked. That\'s my considered opinion. Fucked. Six days into what should be the greatest two months of my life, and it\'s turned into a nightmare.',
    rating: 4.6,
    reviewCount: 187654,
    price: '$15.99'
  },
  {
    id: 'amz-16',
    title: 'Dune',
    author: 'Frank Herbert',
    cover: 'https://m.media-amazon.com/images/I/81ym2lBKYGL._SY522_.jpg',
    isbn: '9780441172719',
    publishDate: '1965-08-01',
    genre: 'science-fiction',
    audience: 'Adult',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
    amazonUrl: 'https://www.amazon.com/Dune-Frank-Herbert/dp/0441172717',
    sampleText: 'In the week before their departure to Arrakis, when all the final scurrying about had reached a nearly unbearable frenzy, an old crone came to visit the mother of the boy, Paul.',
    rating: 4.5,
    reviewCount: 234567,
    price: '$18.99'
  }
];

export class AmazonBooksService {
  private static books = amazonBooksData;

  static async getBooksByGenre(genre: string, limit: number = 4): Promise<AmazonBook[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (genre === 'all') {
      return this.books.slice(0, limit);
    }
    
    const filtered = this.books.filter(book => book.genre === genre);
    return filtered.slice(0, limit);
  }

  static async getBookById(id: string): Promise<AmazonBook | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.books.find(book => book.id === id) || null;
  }

  static async searchBooks(query: string): Promise<AmazonBook[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const searchTerm = query.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.description.toLowerCase().includes(searchTerm)
    );
  }

  static async getRandomBooksByGenre(genre: string, exclude: string[] = []): Promise<AmazonBook[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = this.books.filter(book => 
      book.genre === genre && !exclude.includes(book.id)
    );
    
    // Shuffle array
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
    
    return filtered.slice(0, 4);
  }

  static getAllGenres(): string[] {
    return [...new Set(this.books.map(book => book.genre))];
  }
}