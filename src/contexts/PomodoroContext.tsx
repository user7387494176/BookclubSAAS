import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface PomodoroSession {
  id: string;
  startTime: string;
  endTime?: string;
  type: 'focus' | 'short-break' | 'long-break';
  completed: boolean;
  duration: number; // in minutes
}

interface PomodoroContextType {
  isActive: boolean;
  timeLeft: number;
  currentType: 'focus' | 'short-break' | 'long-break';
  session: number;
  totalSessions: number;
  totalBreaks: number;
  sessions: PomodoroSession[];
  isMinimized: boolean;
  customDuration: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipBreak: () => void;
  toggleMinimized: () => void;
  playChime: () => void;
  setCustomDuration: (minutes: number) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [currentType, setCurrentType] = useState<'focus' | 'short-break' | 'long-break'>('focus');
  const [session, setSession] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalBreaks, setTotalBreaks] = useState(0);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [customDuration, setCustomDuration] = useState(25); // Default 25 minutes
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Initialize audio and load saved state
  useEffect(() => {
    // Create audio context for chime sound
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';
    
    // Load saved data
    const savedSessions = localStorage.getItem('focusreads-pomodoro-sessions');
    const savedTotalSessions = localStorage.getItem('focusreads-pomodoro-total');
    const savedTotalBreaks = localStorage.getItem('focusreads-pomodoro-breaks');
    const savedState = localStorage.getItem('focusreads-pomodoro-state');
    
    // Load custom duration from user preferences
    const preferences = localStorage.getItem('focusreads-preferences');
    if (preferences) {
      const parsed = JSON.parse(preferences);
      if (parsed.pomodoroMinutes) {
        setCustomDuration(parsed.pomodoroMinutes);
        setTimeLeft(parsed.pomodoroMinutes * 60);
      }
    }
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    if (savedTotalSessions) {
      setTotalSessions(parseInt(savedTotalSessions));
    }
    if (savedTotalBreaks) {
      setTotalBreaks(parseInt(savedTotalBreaks));
    }
    
    // Restore timer state if it was running
    if (savedState) {
      const state = JSON.parse(savedState);
      if (state.isActive && state.startTime) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const remaining = state.initialTime - elapsed;
        
        if (remaining > 0) {
          setTimeLeft(remaining);
          setCurrentType(state.currentType);
          setSession(state.session);
          setIsActive(true);
          startTimeRef.current = state.startTime;
        } else {
          // Timer should have completed while away
          localStorage.removeItem('focusreads-pomodoro-state');
        }
      }
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('focusreads-pomodoro-sessions', JSON.stringify(sessions));
    localStorage.setItem('focusreads-pomodoro-total', totalSessions.toString());
    localStorage.setItem('focusreads-pomodoro-breaks', totalBreaks.toString());
  }, [sessions, totalSessions, totalBreaks]);

  // Save timer state when active
  useEffect(() => {
    if (isActive && startTimeRef.current) {
      const state = {
        isActive,
        startTime: startTimeRef.current,
        initialTime: getSessionDuration(currentType),
        currentType,
        session
      };
      localStorage.setItem('focusreads-pomodoro-state', JSON.stringify(state));
    } else {
      localStorage.removeItem('focusreads-pomodoro-state');
    }
  }, [isActive, currentType, session]);

  const getSessionDuration = (type: 'focus' | 'short-break' | 'long-break') => {
    switch (type) {
      case 'focus': return customDuration * 60;
      case 'short-break': return Math.max(5, Math.floor(customDuration * 0.2)) * 60; // 20% of focus time, min 5 min
      case 'long-break': return Math.max(10, Math.floor(customDuration * 0.4)) * 60; // 40% of focus time, min 10 min
      default: return customDuration * 60;
    }
  };

  // Timer logic with persistent timing
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000);
          const initialTime = getSessionDuration(currentType);
          const remaining = initialTime - elapsed;
          
          if (remaining <= 0) {
            setTimeLeft(0);
            handleSessionComplete();
          } else {
            setTimeLeft(remaining);
          }
        }
      }, 1000);
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
  }, [isActive, currentType, customDuration]);

  const playChime = () => {
    // Create a simple chime sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio context not available');
    }
  };

  const pauseMusic = () => {
    // Try to pause any YouTube videos
    const iframes = document.querySelectorAll('iframe[src*="youtube"]');
    iframes.forEach(iframe => {
      try {
        (iframe as HTMLIFrameElement).contentWindow?.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          '*'
        );
      } catch (error) {
        console.log('Could not pause YouTube video');
      }
    });
  };

  const showBreakMessage = (breakType: 'short-break' | 'long-break') => {
    const messages = {
      'short-break': [
        '🧘‍♀️ Time for a short break! Stand up and stretch.',
        '💧 Take a moment to hydrate and rest your eyes.',
        '🌱 Step away from your screen and take a few deep breaths.',
        '🚶‍♂️ A quick walk will refresh your mind.',
        '☕ Perfect time for a quick coffee or tea break!'
      ],
      'long-break': [
        '🍃 Time for a longer break! Go for a walk outside.',
        '🥗 Consider having a healthy snack or meal.',
        '📞 Great time to connect with a friend or family member.',
        '🧘‍♀️ Try some meditation or light exercise.',
        '📚 Maybe read a few pages of a physical book!',
        '🌞 Get some fresh air and natural light.'
      ]
    };
    
    const randomMessage = messages[breakType][Math.floor(Math.random() * messages[breakType].length)];
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification('FocusReads Break Time! 🎉', {
        body: randomMessage,
        icon: '/vite.svg'
      });
    }
    
    // You could also show an in-app modal here
    alert(`Break Time! 🎉\n\n${randomMessage}`);
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    playChime();
    
    // Complete current session
    if (currentSessionId) {
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, endTime: new Date().toISOString(), completed: true }
          : s
      ));
    }

    if (currentType === 'focus') {
      setTotalSessions(prev => prev + 1);
      
      // Determine break type based on session count
      const nextBreakType = session % 4 === 0 ? 'long-break' : 'short-break';
      setCurrentType(nextBreakType);
      setTimeLeft(getSessionDuration(nextBreakType));
      
      // Pause music and show break message
      pauseMusic();
      showBreakMessage(nextBreakType);
      
      // Auto-start break after a short delay
      setTimeout(() => {
        startBreakSession(nextBreakType);
      }, 2000);
    } else {
      // Break completed
      setTotalBreaks(prev => prev + 1);
      setCurrentType('focus');
      setTimeLeft(getSessionDuration('focus'));
      setSession(prev => prev + 1);
      
      // Show completion message
      if (Notification.permission === 'granted') {
        new Notification('Break Complete! 📚', {
          body: 'Ready to get back to focused reading?',
          icon: '/vite.svg'
        });
      }
    }
  };

  const startBreakSession = (breakType: 'short-break' | 'long-break') => {
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      type: breakType,
      completed: false,
      duration: Math.floor(getSessionDuration(breakType) / 60)
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    setIsActive(true);
  };

  const startTimer = () => {
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    if (!isActive && currentType === 'focus') {
      const newSession: PomodoroSession = {
        id: Date.now().toString(),
        startTime: new Date().toISOString(),
        type: 'focus',
        completed: false,
        duration: customDuration
      };
      
      setSessions(prev => [...prev, newSession]);
      setCurrentSessionId(newSession.id);
    }
    
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
    } else {
      // Resuming from pause
      const pauseDuration = Date.now() - (startTimeRef.current + pausedTimeRef.current);
      pausedTimeRef.current += pauseDuration;
    }
    
    setIsActive(true);
    playChime();
  };

  const pauseTimer = () => {
    setIsActive(false);
    playChime();
  };

  const resetTimer = () => {
    setIsActive(false);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    
    if (currentSessionId) {
      setSessions(prev => prev.filter(s => s.id !== currentSessionId));
      setCurrentSessionId(null);
    }
    
    setTimeLeft(getSessionDuration(currentType));
  };

  const skipBreak = () => {
    if (currentType !== 'focus') {
      setIsActive(false);
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
      
      if (currentSessionId) {
        setSessions(prev => prev.map(s => 
          s.id === currentSessionId 
            ? { ...s, endTime: new Date().toISOString(), completed: true }
            : s
        ));
        setTotalBreaks(prev => prev + 1);
      }
      
      setCurrentType('focus');
      setTimeLeft(getSessionDuration('focus'));
      setSession(prev => prev + 1);
    }
  };

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSetCustomDuration = (minutes: number) => {
    setCustomDuration(minutes);
    if (currentType === 'focus' && !isActive) {
      setTimeLeft(minutes * 60);
    }
    
    // Save to preferences
    const preferences = JSON.parse(localStorage.getItem('focusreads-preferences') || '{}');
    preferences.pomodoroMinutes = minutes;
    localStorage.setItem('focusreads-preferences', JSON.stringify(preferences));
  };

  return (
    <PomodoroContext.Provider value={{
      isActive,
      timeLeft,
      currentType,
      session,
      totalSessions,
      totalBreaks,
      sessions,
      isMinimized,
      customDuration,
      startTimer,
      pauseTimer,
      resetTimer,
      skipBreak,
      toggleMinimized,
      playChime,
      setCustomDuration: handleSetCustomDuration
    }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};