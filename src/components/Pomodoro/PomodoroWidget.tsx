import React from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Minimize2, Maximize2, SkipForward, Target, Settings } from 'lucide-react';
import { usePomodoro } from '../../contexts/PomodoroContext';

const PomodoroWidget: React.FC = () => {
  const {
    isActive,
    timeLeft,
    currentType,
    session,
    totalSessions,
    totalBreaks,
    isMinimized,
    customDuration,
    isPaused,
    startTimer,
    pauseTimer,
    resetTimer,
    skipBreak,
    toggleMinimized,
    setCustomDuration
  } = usePomodoro();

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTypeColor = () => {
    switch (currentType) {
      case 'focus': return 'theme-primary border-indigo-500';
      case 'short-break': return 'bg-green-600 border-green-500';
      case 'long-break': return 'bg-purple-600 border-purple-500';
      default: return 'theme-primary border-indigo-500';
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

  const getProgress = () => {
    const totalTime = currentType === 'focus' ? customDuration * 60 : 
                     currentType === 'short-break' ? Math.max(5, Math.floor(customDuration * 0.2)) * 60 : 
                     Math.max(10, Math.floor(customDuration * 0.4)) * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getMotivationalGoal = () => {
    if (userGoals.length === 0) return null;
    
    // Rotate through goals based on session number
    const goalIndex = (session - 1) % userGoals.length;
    return userGoals[goalIndex];
  };

  const motivationalGoal = getMotivationalGoal();

  // Create gradient style based on progress
  const getGradientStyle = () => {
    const progress = getProgress();
    const opacity = Math.min(0.9, 0.3 + (progress / 100) * 0.6); // Starts at 0.3, goes to 0.9
    
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

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div 
          className={`${getTypeColor()} text-white rounded-lg shadow-lg border-2 p-3 cursor-pointer hover:shadow-xl transition-all`}
          style={getGradientStyle()}
          onClick={toggleMinimized}
        >
          <div className="flex items-center space-x-2">
            {getTypeIcon()}
            <span className="font-mono text-sm font-medium">{formatTime(timeLeft)}</span>
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white pomodoro-pulse' : isPaused ? 'bg-yellow-300' : 'bg-white/50'}`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-4 w-80"
        style={getGradientStyle()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getTypeIcon()}
            <span className="font-medium text-gray-900 dark:text-white">{getTypeLabel()}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Session {session}</span>
            {isPaused && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">PAUSED</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {totalSessions}F • {totalBreaks}B
            </span>
            <button
              onClick={toggleMinimized}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Custom Duration Setting for Focus Mode */}
        {currentType === 'focus' && !isActive && !isPaused && (
          <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Session Duration</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="10"
                max="240"
                value={customDuration}
                onChange={(e) => setCustomDuration(parseInt(e.target.value) || 10)}
                className="w-16 px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <span className="text-xs text-blue-700 dark:text-blue-300">minutes (min: 10)</span>
            </div>
          </div>
        )}

        {/* Reading Goal Motivation */}
        {motivationalGoal && currentType === 'focus' && (
          <div className="mb-3 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center space-x-2">
              <Target className="w-3 h-3 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                Today's Goal: {motivationalGoal}
              </span>
            </div>
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center mb-4">
          <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white mb-1">
            {formatTime(timeLeft)}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                currentType === 'focus' ? 'theme-primary' : 
                currentType === 'short-break' ? 'bg-green-600' : 'bg-purple-600'
              }`}
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {Math.round(getProgress())}% complete
            {isPaused && ' • Timer paused'}
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
                  ? 'theme-primary hover:opacity-90'
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
            {isActive ? 'Active' : isPaused ? 'Paused' : 'Ready'} • 
            {currentType === 'focus' ? ` ${customDuration} min focus` : 
             currentType === 'short-break' ? ` ${Math.max(5, Math.floor(customDuration * 0.2))} min break` : 
             ` ${Math.max(10, Math.floor(customDuration * 0.4))} min break`}
          </div>
          {isPaused && (
            <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Auto-reset in 35 minutes if not resumed
            </div>
          )}
        </div>

        {/* Session Summary */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Focus Sessions: {totalSessions}</span>
            <span>Breaks Taken: {totalBreaks}</span>
          </div>
          {userGoals.length > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              <span className="font-medium">{userGoals.length} Reading Goals Set</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroWidget;