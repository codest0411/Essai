import { Play, Pause, Heart, MoreVertical } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAudio } from '../../context/AudioContext';
import { useState, useCallback } from 'react';
import { userAPI } from '../../services/api';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export function TrackCard({ track, tracks = [] }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      const trackIndex = tracks.findIndex(t => t.id === track.id);
      playTrack(track, tracks.length > 0 ? tracks : [track], trackIndex >= 0 ? trackIndex : 0);
    }
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) {
      return;
    }
    try {
      if (isFavorite) {
        await userAPI.removeFavorite(track.id);
        setIsFavorite(false);
      } else {
        await userAPI.addFavorite(track.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const coverImage = !imageError && track.cover_image_url
    ? track.cover_image_url
    : `https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=600&q=80`;

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square relative">
        <img
          src={coverImage}
          alt={track.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={handlePlay}
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold truncate">{track.title}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {track.artist || 'Unknown Artist'}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{track.genre}</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleFavorite}
            >
              <Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500 text-red-500')} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
