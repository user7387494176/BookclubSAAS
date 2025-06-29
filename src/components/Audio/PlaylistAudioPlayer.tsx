import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Clock, Headphones, X, Upload, Trash2, GripVertical, Shuffle, Repeat } from 'lucide-react';

interface AudioFile {
  id: string;
  file: File;
  name: string;
  duration?: number;
  currentTime?: number;
}

interface PlaylistAudioPlayerProps {
  onClose: () => void;
}

const PlaylistAudioPlayer: React.FC<PlaylistAudioPlayerProps> = ({ onClose }) => {
  const [playlist, setPlaylist] = useState<AudioFile[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTrack = playlist[currentTrackIndex];

  // Load saved playlist and state on mount
  useEffect(() => {
    const savedPlaylist = localStorage.getItem('focusreads-playlist');
    const savedState = localStorage.getItem('focusreads-playlist-state');
    
    if (savedPlaylist) {
      try {
        const playlistData = JSON.parse(savedPlaylist);
        // Note: We can't restore File objects from localStorage, so we'll just show the structure
        // In a real app, you'd need a more sophisticated approach for persistent audio files
      } catch (error) {
        console.error('Error loading saved playlist:', error);
      }
    }
    
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setCurrentTrackIndex(state.currentTrackIndex || 0);
        setVolume(state.volume || 1);
        setPlaybackRate(state.playbackRate || 1);
        setRepeatMode(state.repeatMode || 'none');
        setIsShuffled(state.isShuffled || false);
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Save playlist state when it changes
  useEffect(() => {
    if (playlist.length > 0) {
      const state = {
        currentTrackIndex,
        volume,
        playbackRate,
        repeatMode,
        isShuffled,
        currentTime: audioRef.current?.currentTime || 0
      };
      localStorage.setItem('focusreads-playlist-state', JSON.stringify(state));
    }
  }, [currentTrackIndex, volume, playbackRate, repeatMode, isShuffled]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const url = URL.createObjectURL(currentTrack.file);
      audioRef.current.src = url;
      setLoading(true);
      setError('');
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setLoading(false);
    };
    const handleError = () => {
      setError('Failed to load audio file');
      setLoading(false);
    };
    const handleEnded = () => {
      handleTrackEnd();
    };
    const handleLoadStart = () => setLoading(true);
    const handleCanPlay = () => setLoading(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentTrack]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const audioFiles = files.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'flac'].includes(extension || '');
    });

    const newTracks: AudioFile[] = audioFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      name: file.name.replace(/\.[^/.]+$/, "")
    }));

    setPlaylist(prev => [...prev, ...newTracks]);
    
    if (playlist.length === 0 && newTracks.length > 0) {
      setCurrentTrackIndex(0);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const audioFiles = files.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'flac'].includes(extension || '');
    });

    const newTracks: AudioFile[] = audioFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      name: file.name.replace(/\.[^/.]+$/, "")
    }));

    setPlaylist(prev => [...prev, ...newTracks]);
    
    if (playlist.length === 0 && newTracks.length > 0) {
      setCurrentTrackIndex(0);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const togglePlay = async () => {
    if (!currentTrack || !audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error('Error playing audio:', err);
      setError('Failed to play audio');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 15);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 15);
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      // Repeat current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'all' || currentTrackIndex < playlist.length - 1) {
      // Go to next track or loop back to first
      const nextIndex = currentTrackIndex < playlist.length - 1 ? currentTrackIndex + 1 : 0;
      setCurrentTrackIndex(nextIndex);
      setIsPlaying(true);
    } else {
      // Stop playing
      setIsPlaying(false);
    }
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const previousTrack = () => {
    const prevIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1;
    setCurrentTrackIndex(prevIndex);
    if (isPlaying) {
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    const nextIndex = currentTrackIndex < playlist.length - 1 ? currentTrackIndex + 1 : 0;
    setCurrentTrackIndex(nextIndex);
    if (isPlaying) {
      setIsPlaying(true);
    }
  };

  const removeTrack = (index: number) => {
    const newPlaylist = playlist.filter((_, i) => i !== index);
    setPlaylist(newPlaylist);
    
    if (index === currentTrackIndex) {
      if (newPlaylist.length === 0) {
        setCurrentTrackIndex(0);
        setIsPlaying(false);
      } else if (index >= newPlaylist.length) {
        setCurrentTrackIndex(newPlaylist.length - 1);
      }
    } else if (index < currentTrackIndex) {
      setCurrentTrackIndex(prev => prev - 1);
    }
  };

  const shufflePlaylist = () => {
    if (playlist.length <= 1) return;
    
    const currentTrack = playlist[currentTrackIndex];
    const otherTracks = playlist.filter((_, i) => i !== currentTrackIndex);
    const shuffledOthers = [...otherTracks].sort(() => Math.random() - 0.5);
    const newPlaylist = [currentTrack, ...shuffledOthers];
    
    setPlaylist(newPlaylist);
    setCurrentTrackIndex(0);
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newPlaylist = [...playlist];
    const draggedItem = newPlaylist[draggedIndex];
    newPlaylist.splice(draggedIndex, 1);
    newPlaylist.splice(index, 0, draggedItem);
    
    // Update current track index if needed
    if (draggedIndex === currentTrackIndex) {
      setCurrentTrackIndex(index);
    } else if (draggedIndex < currentTrackIndex && index >= currentTrackIndex) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else if (draggedIndex > currentTrackIndex && index <= currentTrackIndex) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
    
    setPlaylist(newPlaylist);
    setDraggedIndex(index);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-6 max-w-4xl w-full">
      <audio ref={audioRef} preload="metadata" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 theme-primary rounded-lg flex items-center justify-center">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Focus Music Playlist
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {playlist.length} track{playlist.length !== 1 ? 's' : ''} • Persistent across pages
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Upload Area */}
      <div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center mb-6 transition-colors hover:border-indigo-400 dark:hover:border-indigo-500"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Drag and drop audio files here or click to browse
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
          Supports MP3, WAV, M4A, OGG, AAC, FLAC
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,.m4a,.ogg,.aac,.flac"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="theme-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Choose Files
        </button>
      </div>

      {playlist.length > 0 && (
        <>
          {/* Current Track Display */}
          {currentTrack && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Headphones className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {currentTrack.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track {currentTrackIndex + 1} of {playlist.length}
                  </p>
                </div>
              </div>

              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {!loading && !error && (
                <>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <button
                      onClick={shufflePlaylist}
                      className={`p-2 rounded-full transition-colors ${
                        isShuffled 
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                          : 'bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Shuffle className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={previousTrack}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                    >
                      <SkipBack className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    
                    <button
                      onClick={skipBackward}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                    >
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">-15</span>
                    </button>
                    
                    <button
                      onClick={togglePlay}
                      disabled={loading}
                      className="w-12 h-12 rounded-full theme-primary hover:opacity-90 flex items-center justify-center text-white transition-all disabled:opacity-50"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </button>
                    
                    <button
                      onClick={skipForward}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                    >
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">+15</span>
                    </button>
                    
                    <button
                      onClick={nextTrack}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                    >
                      <SkipForward className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    
                    <button
                      onClick={toggleRepeat}
                      className={`p-2 rounded-full transition-colors relative ${
                        repeatMode !== 'none'
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                          : 'bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Repeat className="w-4 h-4" />
                      {repeatMode === 'one' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">1</span>}
                    </button>
                  </div>

                  {/* Additional Controls */}
                  <div className="flex items-center justify-between">
                    {/* Volume */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleMute}
                        className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Playback Speed */}
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <select
                        value={playbackRate}
                        onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                        className="text-sm bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded px-2 py-1 text-gray-900 dark:text-white"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Playlist */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Playlist</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {playlist.map((track, index) => (
                <div
                  key={track.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onDragEnter={() => handleDragEnter(index)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentTrackIndex
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800'
                      : 'bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500'
                  } ${draggedIndex === index ? 'opacity-50' : ''}`}
                  onClick={() => playTrack(index)}
                >
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {track.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Track {index + 1}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrack(index);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlaylistAudioPlayer;