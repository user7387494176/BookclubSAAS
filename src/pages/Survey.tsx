import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Heart, Zap, BookOpen, Brain, Moon, Users, Target, Lightbulb, Globe, Trophy, Clock } from 'lucide-react';

const Survey: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    genres: [] as string[],
    mood: '',
    readingGoals: [] as string[],
    readingTime: '',
    customReadingTime: '',
    preferredLength: ''
  });

  // Comprehensive genre list with sub-genres
  const genreCategories = {
    'Action & Adventure': ['Action & Adventure'],
    'Arts & Music': ['Arts & Music'],
    'Biographies & Memoirs': ['Biographies & Memoirs'],
    'Business & Investing': ['Business & Investing'],
    'Children\'s Books': ['Children\'s Books'],
    'Computers & Technology': ['Computers & Technology'],
    'Cooking, Food & Wine': ['Cooking, Food & Wine'],
    'Crafts & Hobbies': ['Crafts & Hobbies'],
    'Education & Reference': ['Education & Reference'],
    'Fiction': ['Fiction', 'Literary Fiction', 'Historical Fiction'],
    'Mystery & Thriller': ['Mystery & Thriller', 'Detective Fiction', 'Crime Fiction', 'Thriller', 'Espionage'],
    'Romance': ['Romance', 'Contemporary Romance', 'Historical Romance', 'Paranormal Romance', 'Erotic Romance'],
    'Science Fiction & Fantasy': ['Science Fiction & Fantasy', 'Epic Fantasy', 'Urban Fantasy', 'Paranormal Fantasy', 'Fantasy Romance', 'Cyberpunk', 'Dystopian', 'Space Opera', 'Time Travel'],
    'Health & Wellness': ['Health & Wellness'],
    'History': ['History'],
    'Humor': ['Humor'],
    'LGBTQ+ Books': ['LGBTQ+ Books'],
    'Medical': ['Medical'],
    'Outdoor & Sports': ['Outdoor & Sports', 'Sports & Outdoors'],
    'Parenting & Relationships': ['Parenting & Relationships'],
    'Pets': ['Pets'],
    'Politics & Social Sciences': ['Politics & Social Sciences'],
    'Psychology': ['Psychology'],
    'Religion & Spirituality': ['Religion & Spirituality'],
    'Science & Math': ['Science & Math'],
    'Self-Help': ['Self-Help'],
    'Travel': ['Travel'],
    'Young Adult': ['Young Adult']
  };

  // Flatten all genres for selection
  const allGenres = Object.keys(genreCategories);

  // Mood-based genre classification
  const moods = [
    { 
      value: 'uplifting', 
      label: 'Uplifting & Inspirational',
      description: 'Looking for motivation, personal growth, and positive stories',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300',
      genres: ['Biographies & Memoirs', 'Self-Help', 'Religion & Spirituality', 'Humor']
    },
    { 
      value: 'exciting', 
      label: 'Exciting & Thrilling',
      description: 'Craving adventure, suspense, and adrenaline-pumping stories',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300',
      genres: ['Action & Adventure', 'Mystery & Thriller', 'Science Fiction & Fantasy']
    },
    { 
      value: 'romantic', 
      label: 'Romantic & Emotional',
      description: 'Seeking love stories, emotional depth, and heartfelt narratives',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-pink-100 dark:bg-pink-900/30 border-pink-500 text-pink-700 dark:text-pink-300',
      genres: ['Romance', 'LGBTQ+ Books', 'Historical Fiction']
    },
    { 
      value: 'informative', 
      label: 'Informative & Educational',
      description: 'Want to learn new things and expand your knowledge',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300',
      genres: ['Education & Reference', 'Business & Investing', 'Science & Math', 'History']
    },
    { 
      value: 'dark', 
      label: 'Dark & Thought-Provoking',
      description: 'Interested in complex themes, psychological depth, and challenging content',
      icon: <Moon className="w-5 h-5" />,
      color: 'bg-gray-100 dark:bg-gray-700 border-gray-500 text-gray-700 dark:text-gray-300',
      genres: ['Mystery & Thriller', 'Psychology', 'Politics & Social Sciences']
    },
    { 
      value: 'relaxing', 
      label: 'Relaxing & Escapist',
      description: 'Looking for light, enjoyable reads to unwind and escape',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 text-purple-700 dark:text-purple-300',
      genres: ['Science Fiction & Fantasy', 'Historical Fiction', 'Travel']
    },
    { 
      value: 'serious', 
      label: 'Serious & Reflective',
      description: 'Seeking deep, meaningful content that challenges your thinking',
      icon: <Brain className="w-5 h-5" />,
      color: 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300',
      genres: ['Politics & Social Sciences', 'History', 'Psychology', 'Religion & Spirituality']
    }
  ];

  // Enhanced reading goals with categories and icons
  const readingGoalCategories = {
    'Personal Growth & Development': {
      icon: <Target className="w-5 h-5" />,
      color: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300',
      goals: [
        'Learn New Skills or Knowledge',
        'Improve Mental Health',
        'Develop Empathy and Understanding',
        'Establish a Reading Habit'
      ]
    },
    'Entertainment & Enjoyment': {
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-pink-100 dark:bg-pink-900/30 border-pink-500 text-pink-700 dark:text-pink-300',
      goals: [
        'Escape into a Different World',
        'Discover New Authors or Genres',
        'Set a Reading Target',
        'Join a Book Club or Discussion Group'
      ]
    },
    'Intellectual Curiosity': {
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'bg-amber-100 dark:bg-amber-900/30 border-amber-500 text-amber-700 dark:text-amber-300',
      goals: [
        'Explore New Topics or Subjects',
        'Stay Informed on Current Events',
        'Enhance Critical Thinking',
        'Read Classic Literature'
      ]
    },
    'Social & Community': {
      icon: <Globe className="w-5 h-5" />,
      color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300',
      goals: [
        'Connect with Others Through Reading',
        'Support Literacy and Education',
        'Read with a Child or Young Adult',
        'Participate in Reading Challenges'
      ]
    },
    'Personal Achievement': {
      icon: <Trophy className="w-5 h-5" />,
      color: 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 text-purple-700 dark:text-purple-300',
      goals: [
        'Set Page or Word Goals',
        'Finish a Long or Challenging Book',
        'Read Outside Your Comfort Zone',
        'Track Reading Progress'
      ]
    }
  };

  // Flatten all goals for easy access
  const allGoals = Object.values(readingGoalCategories).flatMap(category => category.goals);

  const readingTimes = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: 'custom', label: 'Custom time (enter below)' }
  ];

  // Updated book length preferences with detailed descriptions
  const bookLengths = [
    { 
      value: 'short', 
      label: 'Short Reads',
      description: 'Quick, engaging reads perfect for busy schedules',
      details: [
        'Novellas: 20,000-40,000 words (100-200 pages)',
        'Short Stories: Under 20,000 words'
      ],
      timeCommitment: 'Can be finished in 1-3 reading sessions',
      benefits: 'Great for trying new genres and authors'
    },
    { 
      value: 'medium', 
      label: 'Medium-Length Books',
      description: 'The sweet spot for most readers - substantial but manageable',
      details: [
        'Standard Novels: 40,000-80,000 words (200-400 pages)',
        'Most Nonfiction: Comprehensive yet focused topics'
      ],
      timeCommitment: 'Typically 1-2 weeks of regular reading',
      benefits: 'Perfect balance of depth and accessibility'
    },
    { 
      value: 'long', 
      label: 'Long Reads',
      description: 'Immersive experiences for dedicated readers',
      details: [
        'Epic Novels: 80,000-120,000 words (400-600 pages)',
        'Comprehensive Nonfiction: In-depth topic exploration'
      ],
      timeCommitment: '2-4 weeks of regular reading',
      benefits: 'Deep character development and complex plots'
    },
    { 
      value: 'very-long', 
      label: 'Very Long Reads',
      description: 'Epic journeys for the most committed readers',
      details: [
        'Literary Epics: 120,000+ words (600+ pages)',
        'Reference Books: Encyclopedias and textbooks'
      ],
      timeCommitment: '1+ months of dedicated reading',
      benefits: 'Comprehensive exploration of subjects'
    },
    { 
      value: 'any', 
      label: 'Any Length',
      description: 'Open to books of all sizes based on content',
      details: [
        'No preference on word count or page length',
        'Focus on quality and interest over length'
      ],
      timeCommitment: 'Varies by book selection',
      benefits: 'Maximum flexibility in book recommendations'
    }
  ];

  const steps = [
    {
      title: 'What genres interest you right now?',
      subtitle: 'Select all that apply - we\'ll use these to personalize your recommendations',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto custom-scrollbar">
            {allGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  setPreferences(prev => ({
                    ...prev,
                    genres: prev.genres.includes(genre)
                      ? prev.genres.filter(g => g !== genre)
                      : [...prev.genres, genre]
                  }));
                }}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  preferences.genres.includes(genre)
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{genre}</span>
                  {preferences.genres.includes(genre) && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  )}
                </div>
                {genreCategories[genre as keyof typeof genreCategories].length > 1 && (
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Includes: {genreCategories[genre as keyof typeof genreCategories].slice(1).join(', ')}
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> Select multiple genres to get diverse recommendations. 
              You can always update your preferences later in settings.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'What type of mood are you in?',
      subtitle: 'Choose the mood that best describes what you\'re looking for right now',
      content: (
        <div className="space-y-4">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setPreferences(prev => ({ ...prev, mood: mood.value }))}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                preferences.mood === mood.value
                  ? mood.color
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  preferences.mood === mood.value 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {mood.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {mood.label}
                    </h4>
                    {preferences.mood === mood.value && (
                      <Check className="w-5 h-5 text-current flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {mood.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {mood.genres.slice(0, 3).map((genre, index) => (
                      <span
                        key={genre}
                        className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        {genre}
                      </span>
                    ))}
                    {mood.genres.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        +{mood.genres.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'What are your reading goals?',
      subtitle: 'Select all that apply - these help us understand what you want to achieve through reading',
      content: (
        <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
          {Object.entries(readingGoalCategories).map(([categoryName, category]) => (
            <div key={categoryName} className="space-y-3">
              <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${category.color}`}>
                <div className="flex-shrink-0">
                  {category.icon}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {categoryName}
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                {category.goals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => {
                      setPreferences(prev => ({
                        ...prev,
                        readingGoals: prev.readingGoals.includes(goal)
                          ? prev.readingGoals.filter(g => g !== goal)
                          : [...prev.readingGoals, goal]
                      }));
                    }}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      preferences.readingGoals.includes(goal)
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{goal}</span>
                      {preferences.readingGoals.includes(goal) && (
                        <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Selected Goals:</strong> {preferences.readingGoals.length} of {allGoals.length} goals chosen. 
              These will help us recommend books that align with your reading objectives.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'How much time do you have for reading?',
      subtitle: 'This will set your default Pomodoro session duration to help you achieve your reading goals',
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            {readingTimes.map((time) => (
              <button
                key={time.value}
                onClick={() => setPreferences(prev => ({ ...prev, readingTime: time.value }))}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  preferences.readingTime === time.value
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium">{time.label}</span>
                  </div>
                  {preferences.readingTime === time.value && (
                    <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                {time.value !== 'custom' && (
                  <div className="mt-2 ml-8 text-sm text-gray-600 dark:text-gray-400">
                    Your Pomodoro sessions will be set to {time.label} by default
                  </div>
                )}
              </button>
            ))}
          </div>

          {preferences.readingTime === 'custom' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Enter your preferred reading time (in minutes):
              </label>
              <input
                type="number"
                min="5"
                max="240"
                value={preferences.customReadingTime}
                onChange={(e) => setPreferences(prev => ({ ...prev, customReadingTime: e.target.value }))}
                placeholder="e.g., 90 for 1.5 hours"
                className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                This will be your default Pomodoro session duration. You can always adjust it manually in Focus Mode.
              </p>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Smart Integration:</strong> Your reading time preference will automatically configure your Pomodoro timer 
              to match your available time, helping you stay focused and achieve your reading goals efficiently.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'What book length do you prefer?',
      subtitle: 'We\'ll recommend books that match your preferred reading commitment level',
      content: (
        <div className="space-y-4">
          {bookLengths.map((length) => (
            <button
              key={length.value}
              onClick={() => setPreferences(prev => ({ ...prev, preferredLength: length.value }))}
              className={`w-full p-6 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                preferences.preferredLength === length.value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                    {length.label}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {length.description}
                  </p>
                </div>
                {preferences.preferredLength === length.value && (
                  <Check className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    What to Expect:
                  </h5>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {length.details.map((detail, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                    <span className="font-medium text-blue-800 dark:text-blue-300">Time Commitment:</span>
                    <p className="text-blue-700 dark:text-blue-400">{length.timeCommitment}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    <span className="font-medium text-green-800 dark:text-green-300">Benefits:</span>
                    <p className="text-green-700 dark:text-green-400">{length.benefits}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>How We Use This:</strong> Your length preference helps us recommend books that fit your reading schedule and commitment level. 
              We'll prioritize books within your preferred range while occasionally suggesting exceptional titles outside it.
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save preferences and navigate to recommendations
      const finalPreferences = {
        ...preferences,
        // Set default Pomodoro duration based on reading time
        pomodoroMinutes: preferences.readingTime === 'custom' 
          ? parseInt(preferences.customReadingTime) || 25
          : parseInt(preferences.readingTime) || 25
      };
      
      localStorage.setItem('focusreads-preferences', JSON.stringify(finalPreferences));
      navigate('/recommendations');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 0: return preferences.genres.length > 0;
      case 1: return preferences.mood !== '';
      case 2: return preferences.readingGoals.length > 0;
      case 3: 
        if (preferences.readingTime === 'custom') {
          return preferences.customReadingTime !== '' && parseInt(preferences.customReadingTime) >= 5;
        }
        return preferences.readingTime !== '';
      case 4: return preferences.preferredLength !== '';
      default: return false;
    }
  };

  const getSelectedMood = () => {
    return moods.find(mood => mood.value === preferences.mood);
  };

  const getSelectedLength = () => {
    return bookLengths.find(length => length.value === preferences.preferredLength);
  };

  const getReadingTimeDisplay = () => {
    if (preferences.readingTime === 'custom') {
      return preferences.customReadingTime ? `${preferences.customReadingTime} minutes` : 'Custom time';
    }
    const time = readingTimes.find(t => t.value === preferences.readingTime);
    return time ? time.label : '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Survey Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {steps[currentStep].subtitle}
            </p>
          </div>

          <div className="mb-8">
            {steps[currentStep].content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              {currentStep === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Selected: {preferences.genres.length} genre{preferences.genres.length !== 1 ? 's' : ''}
                </div>
              )}
              
              {currentStep === 1 && preferences.mood && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Mood: {getSelectedMood()?.label}
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Goals: {preferences.readingGoals.length} selected
                </div>
              )}

              {currentStep === 3 && preferences.readingTime && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Time: {getReadingTimeDisplay()}
                </div>
              )}

              {currentStep === 4 && preferences.preferredLength && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Length: {getSelectedLength()?.label}
                </div>
              )}
              
              <button
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                <span>{currentStep === steps.length - 1 ? 'Get Personalized Recommendations' : 'Next'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;