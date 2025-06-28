import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Moon, Sun, Settings, User, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { isDark, toggleDark } = useTheme();
  const { user, isAuthenticated, logout, guestMode } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/recommendations', label: 'Recommendations' },
    { path: '/focus', label: 'Focus Mode' },
    { path: '/notes', label: 'Notes' },
    { path: '/books', label: 'My Books' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="themed-card border-b theme-border sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Book className="w-8 h-8 theme-primary-text group-hover:opacity-80 transition-opacity duration-200" />
            <span className="text-xl font-bold theme-text">FocusReads</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'theme-primary-text bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                    : 'theme-text-secondary hover:theme-primary-text hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg themed-button-secondary transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 theme-text-secondary" />
              )}
            </button>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 rounded-lg themed-button-secondary transition-all duration-200 hover:scale-105"
            >
              <Settings className="w-5 h-5 theme-text-secondary" />
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=4F46E5&color=fff`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full ring-2 ring-indigo-500/20"
                  />
                  <span className="text-sm font-medium theme-text">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg themed-button-secondary transition-all duration-200 hover:scale-105"
                >
                  <LogOut className="w-5 h-5 theme-text-secondary" />
                </button>
              </div>
            ) : guestMode ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <User className="w-5 h-5 theme-text-secondary" />
                </div>
                <span className="text-sm font-medium theme-text">
                  Guest
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;