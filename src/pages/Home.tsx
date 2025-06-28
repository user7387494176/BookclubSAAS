import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Target, Music, PenTool, BookOpen, Star, ArrowRight, SkipForward } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GoogleSignIn from '../components/Auth/GoogleSignIn';

const Home: React.FC = () => {
  const { isAuthenticated, guestMode, setGuestMode } = useAuth();

  const features = [
    {
      icon: <Star className="w-6 h-6" />,
      title: "Personalized Recommendations",
      description: "Discover books tailored to your preferences and reading goals"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Focus Mode",
      description: "Pomodoro timer with curated music to enhance your reading sessions"
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      title: "Smart Notes",
      description: "Take notes, add tags, and organize your thoughts seamlessly"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Reading Tracker",
      description: "Monitor your progress and build consistent reading habits"
    }
  ];

  if (!isAuthenticated && !guestMode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Book className="mx-auto h-16 w-16 text-indigo-600 dark:text-indigo-400" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to FocusReads
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your personal book club for deeper reading experiences
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <GoogleSignIn />
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
            </div>

            <button
              onClick={() => setGuestMode(true)}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Continue as Guest
            </button>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>Sign in to sync your data across devices</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Your Personal
              <span className="text-indigo-600 dark:text-indigo-400"> Book Club</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover, focus, and engage more deeply with books through personalized recommendations, 
              immersive reading sessions, and thoughtful note-taking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/survey"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>Get Personalized Recommendations</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/recommendations"
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <SkipForward className="w-5 h-5" />
                <span>Skip to Browse Books</span>
              </Link>
              <Link
                to="/focus"
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Try Focus Mode
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need for focused reading
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform your reading experience with tools designed to enhance focus, 
              comprehension, and engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                  <div className="text-indigo-600 dark:text-indigo-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to transform your reading?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of readers who've discovered a better way to engage with books.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/survey"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
            >
              <span>Take the Survey</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/recommendations"
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;