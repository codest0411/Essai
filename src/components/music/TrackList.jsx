import { Play, Pause, Heart, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAudio } from '../../context/AudioContext';
import { formatTime } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function TrackList({ tracks }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const handlePlay = (track, index) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, tracks, index);
    }
  };

  return (
    <div className="space-y-1">
      {tracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        
        return (
          <div
            key={track.id}
            className={cn(
              'flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors group cursor-pointer',
              isCurrentTrack && 'bg-accent'
            )}
            onClick={() => handlePlay(track, index)}
          >
            <div className="flex items-center justify-center w-10">
              {isCurrentTrack && isPlaying ? (
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pause className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                  <Play className="h-4 w-4" />
                </Button>
              )}
              {!isCurrentTrack && (
                <span className="text-sm text-muted-foreground group-hover:hidden">
                  {index + 1}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={cn('font-medium truncate', isCurrentTrack && 'text-primary')}>
                {track.title}
              </h4>
              <p className="text-sm text-muted-foreground truncate">
                {track.artist || 'Unknown Artist'}
              </p>
            </div>

            <div className="hidden md:block text-sm text-muted-foreground">
              {track.album || 'Single'}
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <Heart className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground w-16 justify-end">
                <Clock className="h-4 w-4" />
                {formatTime(track.duration)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
