import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface PomodoroSession {
  id: string;
  startTime: string;
  endTime?: string;
  type: 'focus' | 'short-break' | 'long-break';
  completed: boolean;
}

interface PomodoroContextType {
  isActive: boolean;
  timeLeft: number;
  currentType: 'focus' | 'short-break' | 'long-break';
  session: number;
  totalSessions: number;
  sessions: PomodoroSession[];
  isMinimized: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipBreak: () => void;
  toggleMinimized: () => void;
  playChime: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [currentType, setCurrentType] = useState<'focus' | 'short-break' | 'long-break'>('focus');
  const [session, setSession] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create audio context for chime sound
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';
    
    // Load saved data
    const savedSessions = localStorage.getItem('focusreads-pomodoro-sessions');
    const savedTotalSessions = localStorage.getItem('focusreads-pomodoro-total');
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    if (savedTotalSessions) {
      setTotalSessions(parseInt(savedTotalSessions));
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('focusreads-pomodoro-sessions', JSON.stringify(sessions));
    localStorage.setItem('focusreads-pomodoro-total', totalSessions.toString());
  }, [sessions, totalSessions]);

  // Timer logic
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

  const playChime = () => {
    // Create a simple chime sound using Web Audio API
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
  };

  const handleSessionComplete = () => {
    setIsActive(false);
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
      // Determine break type
      const nextBreakType = session % 4 === 0 ? 'long-break' : 'short-break';
      setCurrentType(nextBreakType);
      setTimeLeft(nextBreakType === 'long-break' ? 15 * 60 : 5 * 60);
      
      // Auto-start break
      setTimeout(() => {
        startBreakSession(nextBreakType);
      }, 1000);
    } else {
      setCurrentType('focus');
      setTimeLeft(25 * 60);
      setSession(prev => prev + 1);
    }
  };

  const startBreakSession = (breakType: 'short-break' | 'long-break') => {
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      type: breakType,
      completed: false
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    setIsActive(true);
  };

  const startTimer = () => {
    if (!isActive && currentType === 'focus') {
      const newSession: PomodoroSession = {
        id: Date.now().toString(),
        startTime: new Date().toISOString(),
        type: 'focus',
        completed: false
      };
      
      setSessions(prev => [...prev, newSession]);
      setCurrentSessionId(newSession.id);
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
    
    if (currentSessionId) {
      setSessions(prev => prev.filter(s => s.id !== currentSessionId));
      setCurrentSessionId(null);
    }
    
    if (currentType === 'focus') {
      setTimeLeft(25 * 60);
    } else {
      setTimeLeft(currentType === 'long-break' ? 15 * 60 : 5 * 60);
    }
  };

  const skipBreak = () => {
    if (currentType !== 'focus') {
      setIsActive(false);
      
      if (currentSessionId) {
        setSessions(prev => prev.map(s => 
          s.id === currentSessionId 
            ? { ...s, endTime: new Date().toISOString(), completed: true }
            : s
        ));
      }
      
      setCurrentType('focus');
      setTimeLeft(25 * 60);
      setSession(prev => prev + 1);
    }
  };

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <PomodoroContext.Provider value={{
      isActive,
      timeLeft,
      currentType,
      session,
      totalSessions,
      sessions,
      isMinimized,
      startTimer,
      pauseTimer,
      resetTimer,
      skipBreak,
      toggleMinimized,
      playChime
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