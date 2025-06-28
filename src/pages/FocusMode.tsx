import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Coffee } from 'lucide-react';

interface YouTubeMusic {
  id: string;
  title: string;
}

const FocusMode: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<YouTubeMusic | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [session, setSession] = useState(1);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<any>(null);

  const musicOptions: YouTubeMusic[] = [
    { "id": "eWLVBP3VrO4", "title": "Soulful Amapiano Focus Mix" },
    { "id": "-vvpsIiUVKY", "title": "Marconi Union – Weightless 10h Version" },
    { "id": "CDgxzo4dyFI", "title": "Lofi Hip Hop Radio" },
    { "id": "qYnA9wWFHLI", "title": "Synthwave Focus Station" },
    { "id": "e8dxG3dTBgM", "title": "New York Café Ambience" },
    { "id": "J65GxJ2v9Wg", "title": "Deep Focus for Work" },
    { "id": "vnhmqWqs7kI", "title": "ADHD Relief Focus Music" },
    { "id": "8sYK7lm3UKg", "title": "Intense Study Music" },
    { "id": "CwRF8alr6vo", "title": "Classical Focus" },
    { "id": "6e5958fKwe4", "title": "Brown Noise" },
    { "id": "a4tNJTZHzPg", "title": "852 Hz Meditation Focus" },
    { "id": "jfKfPfyJRdk", "title": "Lo-fi Chillhop" }
  ];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(25 * 60);
      setSession(prev => prev + 1);
    } else {
      setIsBreak(true);
      setTimeLeft(session % 4 === 0 ? 15 * 60 : 5 * 60); // Long break every 4 sessions
    }
    
    // Pause music when session ends
    if (playerRef.current && playerRef.current.pauseVideo) {
      playerRef.current.pauseVideo();
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    
    if (selectedMusic && playerRef.current) {
      if (!isActive) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? (session % 4 === 0 ? 15 * 60 : 5 * 60) : 25 * 60);
    
    if (playerRef.current && playerRef.current.pauseVideo) {
      playerRef.current.pauseVideo();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? (session % 4 === 0 ? 15 * 60 - timeLeft : 5 * 60 - timeLeft) / (session % 4 === 0 ? 15 * 60 : 5 * 60)
    : (25 * 60 - timeLeft) / (25 * 60);

  const selectMusic = (music: YouTubeMusic) => {
    setSelectedMusic(music);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
    }
  };

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    if (isMuted) {
      playerRef.current.mute();
    }
  };

  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Focus Mode
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Enhance your reading with Pomodoro technique and ambient music
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timer Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center">
              {/* Session Info */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Session {session}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  {isBreak ? <Coffee className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  <span>{isBreak ? 'Break Time' : 'Focus Time'}</span>
                </div>
              </div>

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
                      isBreak ? 'text-green-500' : 'text-indigo-600 dark:text-indigo-400'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {isBreak ? 'Break' : 'Focus'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={toggleTimer}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-medium transition-all hover:scale-105 ${
                    isActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : isBreak 
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-indigo-600 hover:bg-indigo-700'
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

          {/* Music Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Focus Music
                </h3>
                {selectedMusic && (
                  <button
                    onClick={toggleMute}
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
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${selectedMusic.id}?enablejsapi=1&autoplay=0&controls=1&rel=0`}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {musicOptions.map((music) => (
                    <button
                      key={music.id}
                      onClick={() => selectMusic(music)}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${music.id}/hqdefault.jpg`}
                        alt={music.title}
                        className="w-16 h-12 object-cover rounded"
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
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Pomodoro Tips for Better Focus
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">25 Minutes Focus</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Work with complete concentration for 25 minutes
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Coffee className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">5 Minute Break</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Take a short break to recharge
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <RotateCcw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Repeat Cycle</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continue the cycle for maximum productivity
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Coffee className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Long Break</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Take a 15-30 minute break every 4 cycles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;