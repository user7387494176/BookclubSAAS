import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Heart, Zap, BookOpen, Brain, Moon, Users } from 'lucide-react';

const Survey: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    genres: [] as string[],
    mood: '',
    readingGoals: [] as string[],
    readingTime: '',
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

  const readingGoals = [
    'Expand knowledge', 'Entertainment & relaxation', 'Personal development',
    'Professional growth', 'Academic research', 'Creative inspiration',
    'Cultural understanding', 'Language improvement'
  ];

  const readingTimes = [
    { value: '15min', label: '15 minutes or less' },
    { value: '30min', label: '30 minutes' },
    { value: '1hour', label: '1 hour' },
    { value: '2hours', label: '2+ hours' }
  ];

  const bookLengths = [
    { value: 'short', label: 'Short (< 200 pages)' },
    { value: 'medium', label: 'Medium (200-400 pages)' },
    { value: 'long', label: 'Long (400+ pages)' },
    { value: 'any', label: 'Any length' }
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
      subtitle: 'Select all that apply',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {readingGoals.map((goal) => (
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
              className={`p-3 rounded-lg border-2 transition-all ${
                preferences.readingGoals.includes(goal)
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{goal}</span>
                {preferences.readingGoals.includes(goal) && (
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'How much time do you have for reading?',
      subtitle: 'Choose your typical reading session length',
      content: (
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
                <span className="font-medium">{time.label}</span>
                {preferences.readingTime === time.value && (
                  <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'Book length preference?',
      subtitle: 'What length books do you prefer?',
      content: (
        <div className="space-y-3">
          {bookLengths.map((length) => (
            <button
              key={length.value}
              onClick={() => setPreferences(prev => ({ ...prev, preferredLength: length.value }))}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                preferences.preferredLength === length.value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{length.label}</span>
                {preferences.preferredLength === length.value && (
                  <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save preferences and navigate to recommendations
      localStorage.setItem('focusreads-preferences', JSON.stringify(preferences));
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
      case 3: return preferences.readingTime !== '';
      case 4: return preferences.preferredLength !== '';
      default: return false;
    }
  };

  const getSelectedMood = () => {
    return moods.find(mood => mood.value === preferences.mood);
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