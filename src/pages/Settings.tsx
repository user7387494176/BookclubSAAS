import React, { useState, useRef } from 'react';
import { Save, Upload, Palette, Moon, Sun, Eye, Download, Trash2, Volume2, VolumeX } from 'lucide-react';
import { useTheme, themes } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { AudioService } from '../services/audioService';

const Settings: React.FC = () => {
  const { isDark, currentTheme, customBackground, toggleDark, setTheme, setCustomBackground } = useTheme();
  const { user, logout } = useAuth();
  const [uploadedBackground, setUploadedBackground] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTheme, setPreviewTheme] = useState(currentTheme);
  const [audioSettings, setAudioSettings] = useState(AudioService.getSettings());

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
      pomodoroTotal: localStorage.getItem('focusreads-pomodoro-total') || '0',
      audioSettings: JSON.parse(localStorage.getItem('focusreads-audio-settings') || '{}'),
      settings: {
        theme: currentTheme,
        isDark,
        customBackground
      },
      exportDate: new Date().toISOString()
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

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Import all data
        if (data.books) localStorage.setItem('focusreads-books', JSON.stringify(data.books));
        if (data.notes) localStorage.setItem('focusreads-notes', JSON.stringify(data.notes));
        if (data.preferences) localStorage.setItem('focusreads-preferences', JSON.stringify(data.preferences));
        if (data.pomodoroSessions) localStorage.setItem('focusreads-pomodoro-sessions', JSON.stringify(data.pomodoroSessions));
        if (data.pomodoroTotal) localStorage.setItem('focusreads-pomodoro-total', data.pomodoroTotal);
        if (data.audioSettings) localStorage.setItem('focusreads-audio-settings', JSON.stringify(data.audioSettings));
        if (data.settings) {
          if (data.settings.theme) {
            localStorage.setItem('focusreads-theme', data.settings.theme);
            setTheme(data.settings.theme);
          }
          if (data.settings.isDark !== undefined) {
            localStorage.setItem('focusreads-dark', JSON.stringify(data.settings.isDark));
            if (data.settings.isDark !== isDark) {
              toggleDark();
            }
          }
          if (data.settings.customBackground) {
            localStorage.setItem('focusreads-background', data.settings.customBackground);
            setCustomBackground(data.settings.customBackground);
          }
        }

        alert('Data imported successfully! Your books, notes, preferences, and settings have been restored.');
        window.location.reload();
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
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
      localStorage.removeItem('focusreads-audio-settings');
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

  const handleSoundToggle = () => {
    const newSoundEnabled = !audioSettings.soundEnabled;
    AudioService.setSoundEnabled(newSoundEnabled);
    setAudioSettings(AudioService.getSettings());
    AudioService.playSound('click');
  };

  const handleVolumeChange = (volume: number) => {
    AudioService.setVolume(volume);
    setAudioSettings(AudioService.getSettings());
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
            Customize your FocusReads experience and manage your data
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

          {/* Audio Settings Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Audio Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Control button sounds and audio feedback throughout the application.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {audioSettings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Button Sounds
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Play sounds when clicking buttons and performing actions
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSoundToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    audioSettings.soundEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      audioSettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {audioSettings.soundEnabled && (
                <div className="ml-8">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Volume:
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={audioSettings.volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="flex-1 max-w-xs"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                      {Math.round(audioSettings.volume * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => AudioService.playSound('click')}
                      className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded transition-colors"
                    >
                      Test Click
                    </button>
                    <button
                      onClick={() => AudioService.playSound('cashRegister')}
                      className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded transition-colors"
                    >
                      Test Cash Register
                    </button>
                    <button
                      onClick={() => AudioService.playSound('success')}
                      className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded transition-colors"
                    >
                      Test Success
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Data Management Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900  dark:text-white mb-4">
              Data Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Export your data to backup your books, notes, preferences, and Pomodoro sessions. 
              Import data to restore a previous backup or transfer from another device.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Export All Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download all your books, notes, survey preferences, Pomodoro sessions, and settings
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
                      Import Data
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Restore from a previous backup or transfer data from another device
                    </p>
                  </div>
                  <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Import</span>
                    <input
                      ref={importInputRef}
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                    />
                  </label>
                </div>
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
              <p>Features: PDF/EPUB readers, Audio player, Pomodoro timer, YouTube integration, ISBN lookup</p>
              <p>© 2025 FocusReads. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;