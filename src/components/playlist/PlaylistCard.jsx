import { Card } from '../ui/Card';
import { useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';

export function PlaylistCard({ playlist }) {
  const navigate = useNavigate();

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={() => navigate(`/playlists/${playlist.id}`)}
    >
      <div className="aspect-square relative bg-gradient-to-br from-primary/20 to-primary/5">
        {playlist.cover_image_url ? (
          <img
            src={playlist.cover_image_url}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold truncate">{playlist.name}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {playlist.description || 'No description'}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {playlist.track_count || 0} tracks
          </span>
          {playlist.is_public && (
            <span className="text-xs text-primary">Public</span>
          )}
        </div>
      </div>
    </Card>
  );
}
