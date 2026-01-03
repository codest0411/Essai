import { useAudio } from '../../context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { formatTime } from '../../lib/utils';
import { REPEAT_MODES } from '../../lib/constants';
import { cn } from '../../lib/utils';

export function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
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
  } = useAudio();

  if (!currentTrack) return null;

  const handleSeek = (value) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case REPEAT_MODES.ONE:
        return <Repeat1 className="h-5 w-5" />;
      case REPEAT_MODES.ALL:
        return <Repeat className="h-5 w-5 text-primary" />;
      default:
        return <Repeat className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {currentTrack.cover_image_url && (
              <img
                src={currentTrack.cover_image_url}
                alt={currentTrack.title}
                className="h-14 w-14 rounded object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold truncate">{currentTrack.title}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {currentTrack.artist || 'Unknown Artist'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleShuffle}
                className={cn(isShuffled && 'text-primary')}
              >
                <Shuffle className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={handlePrevious}>
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                variant="default"
                size="icon"
                onClick={togglePlay}
                className="h-10 w-10"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <SkipForward className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={toggleRepeat}>
                {getRepeatIcon()}
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full max-w-2xl">
              <span className="text-xs text-muted-foreground w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-12">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
