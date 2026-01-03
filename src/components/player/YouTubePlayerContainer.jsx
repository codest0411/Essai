import { useEffect } from 'react';
import { useYouTubePlayer } from '../../hooks/useYouTubePlayer';

export function YouTubePlayerContainer({ 
  videoId, 
  isPlaying, 
  volume, 
  isMuted,
  onTimeUpdate,
  onDurationChange,
  onEnded,
  onReady,
  onPlay,
  onPause,
  seekTo
}) {
  const {
    playerContainerRef,
    isReady,
    isPlaying: ytIsPlaying,
    isEnded,
    currentTime,
    duration,
    loadVideo,
    play,
    pause,
    seekTo: ytSeekTo,
    setVolume,
    mute,
    unMute,
  } = useYouTubePlayer();

  // Load video when videoId changes
  useEffect(() => {
    if (videoId && isReady) {
      loadVideo(videoId);
    }
  }, [videoId, isReady, loadVideo]);

  // Handle play/pause state
  useEffect(() => {
    if (!isReady) return;
    
    if (isPlaying && !ytIsPlaying) {
      play();
    } else if (!isPlaying && ytIsPlaying) {
      pause();
    }
  }, [isPlaying, ytIsPlaying, isReady, play, pause]);

  // Handle volume changes
  useEffect(() => {
    if (!isReady) return;
    
    if (isMuted) {
      mute();
    } else {
      unMute();
      setVolume(volume);
    }
  }, [volume, isMuted, isReady, setVolume, mute, unMute]);

  // Handle seek
  useEffect(() => {
    if (seekTo !== undefined && isReady) {
      ytSeekTo(seekTo);
    }
  }, [seekTo, isReady, ytSeekTo]);

  // Notify parent of time updates
  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(currentTime);
    }
  }, [currentTime, onTimeUpdate]);

  // Notify parent of duration
  useEffect(() => {
    if (duration && onDurationChange) {
      onDurationChange(duration);
    }
  }, [duration, onDurationChange]);

  // Notify parent when video ends
  useEffect(() => {
    if (isEnded && onEnded) {
      onEnded();
    }
  }, [isEnded, onEnded]);

  // Notify parent when ready
  useEffect(() => {
    if (isReady && onReady) {
      onReady();
    }
  }, [isReady, onReady]);

  // Notify parent of play state changes
  useEffect(() => {
    if (ytIsPlaying && onPlay) {
      onPlay();
    } else if (!ytIsPlaying && onPause) {
      onPause();
    }
  }, [ytIsPlaying, onPlay, onPause]);

  return (
    <div 
      ref={playerContainerRef} 
      style={{ 
        position: 'absolute', 
        left: '-9999px',
        width: '0',
        height: '0',
        overflow: 'hidden'
      }} 
    />
  );
}
