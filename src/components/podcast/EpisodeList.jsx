import { Play, Pause, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAudio } from '../../context/AudioContext';
import { formatTime } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function EpisodeList({ episodes, podcastInfo }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const handlePlay = (episode, index) => {
    const trackData = {
      id: episode.id,
      title: episode.title,
      artist: podcastInfo?.host || 'Podcast',
      audio_url: episode.audio_url,
      cover_image_url: podcastInfo?.cover_image_url,
      duration: episode.duration,
    };

    if (currentTrack?.id === episode.id) {
      togglePlay();
    } else {
      const episodeTracks = episodes.map((ep, idx) => ({
        id: ep.id,
        title: ep.title,
        artist: podcastInfo?.host || 'Podcast',
        audio_url: ep.audio_url,
        cover_image_url: podcastInfo?.cover_image_url,
        duration: ep.duration,
      }));
      playTrack(trackData, episodeTracks, index);
    }
  };

  return (
    <div className="space-y-2">
      {episodes.map((episode, index) => {
        const isCurrentEpisode = currentTrack?.id === episode.id;
        
        return (
          <div
            key={episode.id}
            className={cn(
              'flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors group cursor-pointer',
              isCurrentEpisode && 'bg-accent'
            )}
            onClick={() => handlePlay(episode, index)}
          >
            <div className="flex items-center justify-center w-10 pt-1">
              {isCurrentEpisode && isPlaying ? (
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pause className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                  <Play className="h-4 w-4" />
                </Button>
              )}
              {!isCurrentEpisode && (
                <span className="text-sm text-muted-foreground group-hover:hidden">
                  {episode.episode_number || index + 1}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={cn('font-medium', isCurrentEpisode && 'text-primary')}>
                {episode.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {episode.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(episode.duration)}
                </span>
                {episode.published_at && (
                  <span>{new Date(episode.published_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
