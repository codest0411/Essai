import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { REPEAT_MODES, PLAYER_STORAGE_KEY } from '../lib/constants';
import { shuffleArray } from '../lib/utils';
import { userAPI } from '../services/api';

const AudioContext = createContext({});

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState(REPEAT_MODES.OFF);
  const [isShuffled, setIsShuffled] = useState(false);
  const [originalQueue, setOriginalQueue] = useState([]);

  const playTrack = useCallback(async (track, trackQueue = [], index = 0) => {
    if (!track) return;

    try {
      const audio = audioRef.current;

      audio.pause();
      audio.currentTime = 0;
      setCurrentTime(0);
      setDuration(0);

      console.log('Loading track:', track.title, 'URL:', track.audio_url);
      audio.src = track.audio_url;
      audio.load();

      setCurrentTrack(track);
      setQueue(trackQueue.length > 0 ? trackQueue : [track]);
      setCurrentIndex(index);

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Audio load timeout')), 10000);
        const onCanPlay = () => {
          clearTimeout(timeout);
          audio.removeEventListener('error', onError);
          resolve();
        };
        const onError = () => {
          clearTimeout(timeout);
          audio.removeEventListener('canplay', onCanPlay);
          reject(new Error('Audio load failed'));
        };
        audio.addEventListener('canplay', onCanPlay, { once: true });
        audio.addEventListener('error', onError, { once: true });
      });

      await audio.play();
      setIsPlaying(true);

      if (track.id) {
        userAPI.addRecentlyPlayed(track.id).catch(console.error);
      }
    } catch (error) {
      console.error('Error playing track:', error);
      console.error('Track details:', track);
      setIsPlaying(false);
      if (trackQueue.length > index + 1) {
        setTimeout(() => {
          playTrack(trackQueue[index + 1], trackQueue, index + 1);
        }, 1000);
      }
    }
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play:', error);
    }
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    if (queue.length === 0) return;

    if (repeatMode === REPEAT_MODES.ONE) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    let nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === REPEAT_MODES.ALL) {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    setCurrentIndex(nextIndex);
    playTrack(queue[nextIndex], queue, nextIndex);
  }, [queue, currentIndex, repeatMode, playTrack]);

  const handlePrevious = useCallback(() => {
    if (queue.length === 0) return;

    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = repeatMode === REPEAT_MODES.ALL ? queue.length - 1 : 0;
    }

    setCurrentIndex(prevIndex);
    playTrack(queue[prevIndex], queue, prevIndex);
  }, [queue, currentIndex, currentTime, repeatMode, playTrack]);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((vol) => {
    setVolumeState(vol);
    audioRef.current.volume = vol;
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  }, [isMuted]);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((mode) => {
      if (mode === REPEAT_MODES.OFF) return REPEAT_MODES.ALL;
      if (mode === REPEAT_MODES.ALL) return REPEAT_MODES.ONE;
      return REPEAT_MODES.OFF;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    if (!isShuffled) {
      setOriginalQueue([...queue]);
      const shuffled = shuffleArray([...queue]);
      setQueue(shuffled);
      const newIndex = shuffled.findIndex((t) => t.id === currentTrack?.id);
      setCurrentIndex(newIndex >= 0 ? newIndex : 0);
    } else {
      setQueue(originalQueue);
      const newIndex = originalQueue.findIndex((t) => t.id === currentTrack?.id);
      setCurrentIndex(newIndex >= 0 ? newIndex : 0);
    }
    setIsShuffled(!isShuffled);
  }, [isShuffled, queue, originalQueue, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      const savedState = localStorage.getItem(PLAYER_STORAGE_KEY);
      if (savedState) {
        const { trackId, position } = JSON.parse(savedState);
        if (currentTrack?.id === trackId && position) {
          audio.currentTime = position;
        }
      }
    };
    const handleError = (e) => {
      console.error('Audio loading error:', e);
      console.error('Failed to load:', audio.src);
      setIsPlaying(false);
      if (queue.length > 1) {
        setTimeout(() => handleNext(), 1000);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack, handleNext, queue.length]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (currentTrack && currentTime > 0) {
        localStorage.setItem(
          PLAYER_STORAGE_KEY,
          JSON.stringify({
            trackId: currentTrack.id,
            position: currentTime,
          })
        );
      }
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [currentTrack, currentTime]);

  const value = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    queue,
    currentIndex,
    repeatMode,
    isShuffled,
    togglePlay,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    playTrack,
    setCurrentTime,
    setDuration,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
