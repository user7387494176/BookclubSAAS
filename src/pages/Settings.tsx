import React, { useState, useRef } from 'react';
import { Save, Upload, Palette, Moon, Sun, Eye, Download, Trash2 } from 'lucide-react';
import { useTheme, themes } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { isDark, currentTheme, customBackground, toggleDark, setTheme, setCustomBackground } = useTheme();
  const { user, logout } = useAuth();
  const [uploadedBackground, setUploadedBackground] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTheme, setPreviewTheme] = useState(currentTheme);

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedBackground(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyCustomBackground = () => {
    if (uploadedBackground) {
      setCustomBackground(uploadedBackground);
      setUploadedBackground('');
    }
  };

  const removeBackground = () => {
    setCustomBackground('');
    setUploadedBackground('');
  };

  const exportData = () => {
    const data = {
      books: JSON.parse(localStorage.getItem('focusreads-books') || '[]'),
      notes: JSON.parse(localStorage.getItem('focusreads-notes') || '[]'),
      preferences: JSON.parse(localStorage.getItem('focusreads-preferences') || '{}'),
      pomodoroSessions: JSON.parse(localStorage.getItem('focusreads-pomodoro-sessions') || '[]'),
      settings: {
        theme: currentTheme,
        isDark,
        customBackground
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusreads-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.removeItem('focusreads-books');
      localStorage.removeItem('focusreads-notes');
      localStorage.removeItem('focusreads-preferences');
      localStorage.removeItem('focusreads-background');
      localStorage.removeItem('focusreads-pomodoro-sessions');
      localStorage.removeItem('focusreads-pomodoro-total');
      localStorage.removeItem('focusreads-pomodoro-state');
      setCustomBackground('');
      alert('All data has been cleared.');
    }
  };

  const getThemeColorStyle = (themeKey: string) => {
    const theme = themes[themeKey as keyof typeof themes];
    return {
      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your FocusReads experience
          </p>
        </div>

        <div className="space-y-8">
          {/* Account Section */}
          {user && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Account
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=4F46E5&color=fff`}
                  alt={user.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Appearance Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Appearance
            </h2>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span className="font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </span>
              </div>
              <button
                onClick={toggleDark}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Theme Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Color Theme
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      currentTheme === key
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {theme.name}
                    </span>
                    {currentTheme === key && (
                      <div className="mt-2">
                        <div 
                          className="w-full h-2 rounded-full"
                          style={getThemeColorStyle(key)}
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Background */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Custom Background
              </h3>
              
              {customBackground && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Custom background is active
                    </span>
                    <button
                      onClick={removeBackground}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Background Image</span>
                  </button>
                </div>

                {uploadedBackground && (
                  <div className="space-y-3">
                    <div className="relative">
                      <img
                        src={uploadedBackground}
                        alt="Background preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={applyCustomBackground}
                        className="theme-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Apply Background</span>
                      </button>
                      <button
                        onClick={() => setUploadedBackground('')}
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Data Management
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Export Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download all your books, notes, preferences, and Pomodoro sessions
                  </p>
                </div>
                <button
                  onClick={exportData}
                  className="theme-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Clear All Data
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Remove all books, notes, settings, and Pomodoro data (cannot be undone)
                    </p>
                  </div>
                  <button
                    onClick={clearAllData}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reading Preferences Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Reading Preferences
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              These settings help improve your book recommendations and reading experience.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Focus Mode Notifications
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get browser notifications when Pomodoro sessions end
                  </p>
                </div>
                <button 
                  onClick={() => {
                    if (Notification.permission === 'default') {
                      Notification.requestPermission();
                    }
                  }}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Auto-pause Music
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically pause music when focus sessions end
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Persistent Timer
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Keep Pomodoro timer running when switching between pages
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              About FocusReads
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>Version 1.0.0</p>
              <p>Built with React, TypeScript, and Tailwind CSS</p>
              <p>Features: PDF/EPUB readers, Audio player, Pomodoro timer, YouTube integration</p>
              <p>© 2025 FocusReads. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;