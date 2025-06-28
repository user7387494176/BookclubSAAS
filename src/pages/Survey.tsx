import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

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

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Business',
    'Philosophy', 'Psychology', 'Poetry', 'Drama', 'Adventure'
  ];

  const moods = [
    { value: 'relaxed', label: 'Relaxed & Contemplative' },
    { value: 'adventurous', label: 'Adventurous & Exciting' },
    { value: 'learning', label: 'Learning & Growth' },
    { value: 'escapist', label: 'Escapist & Immersive' },
    { value: 'inspiring', label: 'Inspiring & Motivational' }
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
      title: 'What genres interest you?',
      subtitle: 'Select all that apply',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {genres.map((genre) => (
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
              className={`p-3 rounded-lg border-2 transition-all ${
                preferences.genres.includes(genre)
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{genre}</span>
                {preferences.genres.includes(genre) && (
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'What\'s your current mood?',
      subtitle: 'Choose the option that best describes what you\'re looking for',
      content: (
        <div className="space-y-3">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setPreferences(prev => ({ ...prev, mood: mood.value }))}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                preferences.mood === mood.value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{mood.label}</span>
                {preferences.mood === mood.value && (
                  <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                )}
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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

            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Recommendations' : 'Next'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;