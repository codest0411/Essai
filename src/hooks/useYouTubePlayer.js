import { useEffect, useRef, useState, useCallback } from 'react';

export function useYouTubePlayer() {
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [playerState, setPlayerState] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Wait for YouTube API to be ready
    const checkYouTubeAPI = () => {
      if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
        console.log('✅ YouTube API loaded, initializing player');
        initializePlayer();
      } else {
        console.log('⏳ Waiting for YouTube API...');
        setTimeout(checkYouTubeAPI, 100);
      }
    };

    const initializePlayer = () => {
      if (!playerContainerRef.current || playerRef.current) return;

      console.log('🎵 Creating YouTube player...');
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 1,  // Enable autoplay
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          iv_load_policy: 3,
          mute: 0,  // Don't mute initially
        },
        events: {
          onReady: () => {
            console.log('✅ YouTube player ready');
            setIsReady(true);
          },
          onStateChange: (event) => {
            const states = {
              '-1': 'UNSTARTED',
              '0': 'ENDED',
              '1': 'PLAYING',
              '2': 'PAUSED',
              '3': 'BUFFERING',
              '5': 'CUED'
            };
            console.log('🎬 YouTube player state:', states[event.data] || event.data);
            setPlayerState(event.data);

            // Start time tracking when playing
            if (event.data === window.YT.PlayerState.PLAYING) {
              startTimeTracking();
            } else {
              stopTimeTracking();
            }
          },
          onError: (event) => {
            console.error('❌ YouTube player error:', event.data);
          },
        },
      });
    };

    checkYouTubeAPI();

    return () => {
      stopTimeTracking();
      if (playerRef.current && playerRef.current.destroy) {
        console.log('🗑️ Destroying YouTube player');
        playerRef.current.destroy();
      }
    };
  }, []);

  const startTimeTracking = () => {
    stopTimeTracking();
    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
        if (playerRef.current.getDuration) {
          setDuration(playerRef.current.getDuration());
        }
      }
    }, 100);
  };

  const stopTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const loadVideo = useCallback((videoId) => {
    if (playerRef.current && isReady) {
      console.log('🎬 YouTube player loading video:', videoId);
      // Simple loadVideoById
      playerRef.current.loadVideoById(videoId);
    } else {
      console.warn('⚠️ YouTube player not ready or not initialized');
    }
  }, [isReady]);

  const play = useCallback(() => {
    if (playerRef.current && isReady) {
      console.log('▶️ YouTube player play command');
      try {
        playerRef.current.playVideo();
      } catch (error) {
        console.error('❌ Error playing video:', error);
      }
    } else {
      console.warn('⚠️ Cannot play - YouTube player not ready');
    }
  }, [isReady]);

  const pause = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.pauseVideo();
    }
  }, [isReady]);

  const seekTo = useCallback((seconds) => {
    if (playerRef.current && isReady) {
      playerRef.current.seekTo(seconds, true);
    }
  }, [isReady]);

  const setVolume = useCallback((volume) => {
    if (playerRef.current && isReady) {
      playerRef.current.setVolume(volume * 100);
    }
  }, [isReady]);

  const mute = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.mute();
    }
  }, [isReady]);

  const unMute = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.unMute();
    }
  }, [isReady]);

  const isPlaying = playerState === window.YT?.PlayerState?.PLAYING;
  const isEnded = playerState === window.YT?.PlayerState?.ENDED;

  return {
    playerContainerRef,
    isReady,
    isPlaying,
    isEnded,
    currentTime,
    duration,
    loadVideo,
    play,
    pause,
    seekTo,
    setVolume,
    mute,
    unMute,
  };
}
