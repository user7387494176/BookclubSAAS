import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Coffee, Upload, FileText, BookOpen, Headphones, X, Settings, Music, Target, Lightbulb, Globe, Trophy, Heart } from 'lucide-react';
import PDFReader from '../components/Reader/PDFReader';
import EPUBReader from '../components/Reader/EPUBReader';
import AudioPlayer from '../components/Audio/AudioPlayer';
import PlaylistAudioPlayer from '../components/Audio/PlaylistAudioPlayer';
import { usePomodoro } from '../contexts/PomodoroContext';

interface YouTubeMusic {
  id: string;
  title: string;
}

const FocusMode: React.FC = () => {
  const {
    isActive,
    timeLeft,
    currentType,
    session,
    customDuration,
    isPaused,
    startTimer,
    pauseTimer,
    resetTimer,
    setCustomDuration
  } = usePomodoro();

  const [selectedMusic, setSelectedMusic] = useState<YouTubeMusic | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  // File handling states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'epub' | 'audio' | null>(null);
  const [showReader, setShowReader] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showPlaylistPlayer, setShowPlaylistPlayer] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user reading goals from localStorage
  const getUserGoals = () => {
    try {
      const preferences = localStorage.getItem('focusreads-preferences');
      if (preferences) {
        const parsed = JSON.parse(preferences);
        return parsed.readingGoals || [];
      }
    } catch (error) {
      console.error('Error parsing preferences:', error);
    }
    return [];
  };

  const userGoals = getUserGoals();

  // Reading goal categories with icons
  const readingGoalCategories = {
    'Personal Growth & Development': {
      icon: <Target className="w-4 h-4" />,
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      goals: [
        'Learn New Skills or Knowledge',
        'Improve Mental Health',
        'Develop Empathy and Understanding',
        'Establish a Reading Habit'
      ]
    },
    'Entertainment & Enjoyment': {
      icon: <Heart className="w-4 h-4" />,
      color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
      goals: [
        'Escape into a Different World',
        'Discover New Authors or Genres',
        'Set a Reading Target',
        'Joined A Book Club'
      ]
    },
    'Intellectual Curiosity': {
      icon: <Lightbulb className="w-4 h-4" />,
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      goals: [
        'Explore New Topics or Subjects',
        'Stay Informed on Current Events',
        'Enhance Critical Thinking',
        'Read Classic Literature'
      ]
    },
    'Social & Community': {
      icon: <Globe className="w-4 h-4" />,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      goals: [
        'Connect with Others Through Reading',
        'Support Literacy and Education',
        'Read with a Child or Young Adult',
        'Participate in Reading Challenges'
      ]
    },
    'Personal Achievement': {
      icon: <Trophy className="w-4 h-4" />,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      goals: [
        'Set Page or Word Goals',
        'Finish a Long or Challenging Book',
        'Read Outside Your Comfort Zone',
        'Track Reading Progress'
      ]
    }
  };

  const getGoalCategory = (goal: string) => {
    for (const [categoryName, category] of Object.entries(readingGoalCategories)) {
      if (category.goals.includes(goal)) {
        return { name: categoryName, ...category };
      }
    }
    return null;
  };

  const musicOptions: YouTubeMusic[] = [
    { "id": "jfKfPfyJRdk", "title": "Lofi Hip Hop Radio - Beats to Relax/Study" },
    { "id": "5qap5aO4i9A", "title": "Deep Focus Music - Ambient Study Music" },
    { "id": "DWcJFNfaw9c", "title": "Peaceful Piano Music for Studying" },
    { "id": "lTRiuFIWV54", "title": "Nature Sounds - Forest Rain" },
    { "id": "UfcAVejslrU", "title": "Cafe Jazz Music - Relaxing Background" },
    { "id": "MVPTGNGiI-4", "title": "Classical Music for Brain Power" },
    { "id": "WPni755-Krg", "title": "Ambient Space Music" },
    { "id": "kHnFDa96vjY", "title": "Brown Noise for Focus" },
    { "id": "n61ULEU7CO0", "title": "Meditation Music - Zen Garden" },
    { "id": "1ZYbU82GVz4", "title": "Synthwave Study Session" },
    { "id": "4xDzrJKXOOY", "title": "Ocean Waves - Natural Sounds" },
    { "id": "hHW1oY26kxQ", "title": "Library Ambience - Study Atmosphere" }
  ];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = currentType === 'focus' 
    ? (customDuration * 60 - timeLeft) / (customDuration * 60)
    : currentType === 'short-break' 
      ? (Math.max(5, Math.floor(customDuration * 0.2)) * 60 - timeLeft) / (Math.max(5, Math.floor(customDuration * 0.2)) * 60)
      : (Math.max(10, Math.floor(customDuration * 0.4)) * 60 - timeLeft) / (Math.max(10, Math.floor(customDuration * 0.4)) * 60);

  // Create gradient style based on progress
  const getGradientStyle = () => {
    const opacity = Math.min(0.9, 0.3 + (progress * 0.6)); // Starts at 0.3, goes to 0.9
    
    switch (currentType) {
      case 'focus':
        return {
          background: `linear-gradient(135deg, rgba(79, 70, 229, ${opacity}) 0%, rgba(99, 102, 241, ${opacity * 0.8}) 100%)`
        };
      case 'short-break':
        return {
          background: `linear-gradient(135deg, rgba(34, 197, 94, ${opacity}) 0%, rgba(22, 163, 74, ${opacity * 0.8}) 100%)`
        };
      case 'long-break':
        return {
          background: `linear-gradient(135deg, rgba(147, 51, 234, ${opacity}) 0%, rgba(126, 34, 206, ${opacity * 0.8}) 100%)`
        };
      default:
        return {
          background: `linear-gradient(135deg, rgba(79, 70, 229, ${opacity}) 0%, rgba(99, 102, 241, ${opacity * 0.8}) 100%)`
        };
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (extension === 'pdf') {
        setFileType('pdf');
      } else if (extension === 'epub') {
        setFileType('epub');
      } else if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(extension || '')) {
        setFileType('audio');
      } else {
        alert('Unsupported file type. Please upload PDF, EPUB, or audio files (MP3, WAV, OGG, M4A, AAC, FLAC).');
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (extension === 'pdf') {
        setFileType('pdf');
      } else if (extension === 'epub') {
        setFileType('epub');
      } else if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(extension || '')) {
        setFileType('audio');
      } else {
        alert('Unsupported file type. Please upload PDF, EPUB, or audio files (MP3, WAV, OGG, M4A, AAC, FLAC).');
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const openReader = () => {
    if (fileType === 'pdf' || fileType === 'epub') {
      setShowReader(true);
    } else if (fileType === 'audio') {
      setShowAudioPlayer(true);
    }
  };

  const closeReader = () => {
    setShowReader(false);
    setShowAudioPlayer(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileType(null);
    setShowReader(false);
    setShowAudioPlayer(false);
  };

  const selectMusic = (music: YouTubeMusic) => {
    setSelectedMusic(music);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Focus Mode
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Enhance your reading with Pomodoro technique, file readers, and ambient music
          </p>
        </div>

        {/* Reading Goals Section */}
        {userGoals.length > 0 && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Reading Goals</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {userGoals.map((goal, index) => {
                const category = getGoalCategory(goal);
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${category ? category.color : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <div className="flex items-center space-x-2">
                      {category?.icon}
                      <span className="text-sm font-medium">{goal}</span>
                    </div>
                    {category && (
                      <div className="text-xs opacity-75 mt-1">{category.name}</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Focus Tip:</strong> Use your Pomodoro sessions to make progress toward these goals. 
                Each focused reading session brings you closer to achieving your reading objectives.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timer Section */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            style={getGradientStyle()}
          >
            <div className="text-center">
              {/* Session Info */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Session {session}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  {currentType === 'focus' ? <Clock className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
                  <span>{currentType === 'focus' ? 'Focus Time' : currentType === 'short-break' ? 'Short Break' : 'Long Break'}</span>
                </div>
                {isPaused && (
                  <div className="flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400">
                    <Pause className="w-4 h-4" />
                    <span>Paused</span>
                  </div>
                )}
              </div>

              {/* Manual Duration Control */}
              {currentType === 'focus' && !isActive && !isPaused && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center space-x-3">
                    <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Session Duration:</span>
                    <input
                      type="number"
                      min="10"
                      max="240"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(parseInt(e.target.value) || 10)}
                      className="w-20 px-2 py-1 text-sm border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <span className="text-sm text-blue-700 dark:text-blue-300">minutes</span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 text-center">
                    Minimum 10 minutes • Breaks: Short ({Math.max(5, Math.floor(customDuration * 0.2))} min) • Long ({Math.max(10, Math.floor(customDuration * 0.4))} min)
                  </p>
                </div>
              )}

              {/* Circular Progress */}
              <div className="relative inline-flex items-center justify-center mb-8">
                <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 256 256">
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 112}`}
                    strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress)}`}
                    className={`transition-all duration-1000 ${
                      currentType === 'focus' ? 'theme-primary-text' : 'text-green-500'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {currentType === 'focus' ? `${customDuration} min focus` : 
                       currentType === 'short-break' ? `${Math.max(5, Math.floor(customDuration * 0.2))} min break` : 
                       `${Math.max(10, Math.floor(customDuration * 0.4))} min break`}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {Math.round(progress * 100)}% complete
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={isActive ? pauseTimer : startTimer}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-medium transition-all hover:scale-105 ${
                    isActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : currentType === 'focus'
                        ? 'theme-primary hover:opacity-90'
                        : currentType === 'short-break'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </button>
                
                <button
                  onClick={resetTimer}
                  className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Reading Material Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Reading Material
              </h3>

              {!uploadedFile ? (
                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center transition-colors hover:border-indigo-400 dark:hover:border-indigo-500"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4">
                      <FileText className="w-12 h-12 text-gray-400" />
                      <BookOpen className="w-12 h-12 text-gray-400" />
                      <Headphones className="w-12 h-12 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Upload Your Reading Material
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Support for PDF, EPUB, and audio files (MP3, WAV, M4A, etc.)
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                        Drag and drop files here or click to browse
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.epub,.mp3,.wav,.ogg,.m4a,.aac,.flac"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="theme-primary hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Choose File</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {fileType === 'pdf' && <FileText className="w-8 h-8 text-red-500" />}
                        {fileType === 'epub' && <BookOpen className="w-8 h-8 text-blue-500" />}
                        {fileType === 'audio' && <Headphones className="w-8 h-8 text-green-500" />}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {uploadedFile.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {fileType?.toUpperCase()} • {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={openReader}
                      className="flex-1 theme-primary hover:opacity-90 text-white px-4 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
                    >
                      {fileType === 'audio' ? <Headphones className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                      <span>{fileType === 'audio' ? 'Play Audio' : 'Open Reader'}</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Change</span>
                    </button>
                  </div>

                  {/* Audio Player Integration */}
                  {fileType === 'audio' && showAudioPlayer && (
                    <AudioPlayer file={uploadedFile} onClose={() => setShowAudioPlayer(false)} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Play Your Focus Music While You Read Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Music className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Play Your Focus Music While You Read
                </h3>
              </div>
              <button
                onClick={() => setShowPlaylistPlayer(!showPlaylistPlayer)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Your Own WAV, MP3, or M4A Files</span>
              </button>
            </div>

            {showPlaylistPlayer && (
              <div className="mb-6">
                <PlaylistAudioPlayer onClose={() => setShowPlaylistPlayer(false)} />
              </div>
            )}

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Choose from curated focus music or upload your own audio files to create the perfect reading atmosphere.
            </p>
          </div>
        </div>

        {/* YouTube Music Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Curated Focus Music
              </h3>
              {selectedMusic && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              )}
            </div>

            {selectedMusic ? (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Now Playing: {selectedMusic.title}
                  </h4>
                  <div className="youtube-container">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedMusic.id}?enablejsapi=1&autoplay=0&controls=1&rel=0&modestbranding=1${isMuted ? '&mute=1' : ''}`}
                      title={selectedMusic.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMusic(null)}
                  className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Choose Different Music
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto custom-scrollbar">
                {musicOptions.map((music) => (
                  <button
                    key={music.id}
                    onClick={() => selectMusic(music)}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${music.id}/mqdefault.jpg`}
                      alt={music.title}
                      className="w-16 h-12 object-cover rounded"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {music.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Enhanced Focus Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 theme-primary-text" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Smart Pausing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pause preserves your progress and auto-resets after 35 minutes of inactivity
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Digital Reading</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload and read PDF, EPUB files with drag-and-drop support
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Headphones className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Audio Playlists</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create custom playlists with drag-and-drop reordering for perfect focus music
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Coffee className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Smart Breaks</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automated breaks calculated based on your focus duration (minimum 10 minutes)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* File Readers */}
      {showReader && fileType === 'pdf' && (
        <PDFReader file={uploadedFile} onClose={closeReader} />
      )}
      
      {showReader && fileType === 'epub' && (
        <EPUBReader file={uploadedFile} onClose={closeReader} />
      )}
    </div>
  );
};

export default FocusMode;