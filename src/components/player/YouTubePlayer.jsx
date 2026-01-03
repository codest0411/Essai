import { useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

export function YouTubePlayer({ videoId, onReady, onStateChange, onError }) {
  const playerRef = useRef(null);

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
    },
  };

  const handleReady = (event) => {
    playerRef.current = event.target;
    if (onReady) onReady(event);
  };

  return (
    <div style={{ position: 'absolute', left: '-9999px' }}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={onStateChange}
        onError={onError}
      />
    </div>
  );
}
