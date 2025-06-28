import React from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Minimize2, Maximize2, SkipForward } from 'lucide-react';
import { usePomodoro } from '../../contexts/PomodoroContext';

const PomodoroWidget: React.FC = () => {
  const {
    isActive,
    timeLeft,
    currentType,
    session,
    totalSessions,
    isMinimized,
    startTimer,
    pauseTimer,
    resetTimer,
    skipBreak,
    toggleMinimized
  } = usePomodoro();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTypeColor = () => {
    switch (currentType) {
      case 'focus': return 'bg-indigo-600 border-indigo-500';
      case 'short-break': return 'bg-green-600 border-green-500';
      case 'long-break': return 'bg-purple-600 border-purple-500';
      default: return 'bg-indigo-600 border-indigo-500';
    }
  };

  const getTypeIcon = () => {
    return currentType === 'focus' ? <Clock className="w-4 h-4" /> : <Coffee className="w-4 h-4" />;
  };

  const getTypeLabel = () => {
    switch (currentType) {
      case 'focus': return 'Focus';
      case 'short-break': return 'Short Break';
      case 'long-break': return 'Long Break';
      default: return 'Focus';
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`${getTypeColor()} text-white rounded-lg shadow-lg border-2 p-3 cursor-pointer hover:shadow-xl transition-all`}
             onClick={toggleMinimized}>
          <div className="flex items-center space-x-2">
            {getTypeIcon()}
            <span className="font-mono text-sm font-medium">{formatTime(timeLeft)}</span>
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-white/50'}`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-4 w-80">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getTypeIcon()}
            <span className="font-medium text-gray-900 dark:text-white">{getTypeLabel()}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Session {session}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total: {totalSessions}</span>
            <button
              onClick={toggleMinimized}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-4">
          <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white mb-1">
            {formatTime(timeLeft)}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                currentType === 'focus' ? 'bg-indigo-600' : 
                currentType === 'short-break' ? 'bg-green-600' : 'bg-purple-600'
              }`}
              style={{
                width: `${((currentType === 'focus' ? 25 * 60 : 
                          currentType === 'short-break' ? 5 * 60 : 15 * 60) - timeLeft) / 
                         (currentType === 'focus' ? 25 * 60 : 
                          currentType === 'short-break' ? 5 * 60 : 15 * 60) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={isActive ? pauseTimer : startTimer}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium transition-all hover:scale-105 ${
              isActive
                ? 'bg-red-500 hover:bg-red-600'
                : currentType === 'focus'
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : currentType === 'short-break'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          
          <button
            onClick={resetTimer}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all hover:scale-105"
          >
            <RotateCcw className="w-3 h-3 text-gray-600 dark:text-gray-400" />
          </button>

          {currentType !== 'focus' && (
            <button
              onClick={skipBreak}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all hover:scale-105"
              title="Skip break"
            >
              <SkipForward className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Status */}
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isActive ? 'Active' : 'Paused'} • 
            {currentType === 'focus' ? ' Focus time' : 
             currentType === 'short-break' ? ' Short break' : ' Long break'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroWidget;