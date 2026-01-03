import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAudio } from '../context/AudioContext';
import { Play, Heart } from 'lucide-react';
import { toast } from 'sonner';

export function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useAudio();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getFavorites();
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    playTrack(track, favorites);
  };

  const handleRemoveFavorite = async (trackId, e) => {
    e.stopPropagation();
    try {
      await userAPI.removeFavorite(trackId);
      setFavorites(favorites.filter(t => t.id !== trackId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Your Favorites</h1>
        <p className="text-muted-foreground">{favorites.length} liked songs</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((track) => (
            <div
              key={track.id}
              className="group relative bg-card rounded-lg p-4 hover:bg-accent transition-all cursor-pointer"
              onClick={() => handlePlay(track)}
            >
              <div className="relative aspect-square mb-3">
                <img
                  src={track.cover_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(track.title)}&size=300&background=random&color=fff`}
                  alt={track.title}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(track.title)}&size=300&background=random&color=fff`;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-primary text-primary-foreground rounded-full p-3 hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 fill-current" />
                  </button>
                </div>
                <button
                  onClick={(e) => handleRemoveFavorite(track.id, e)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors"
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </button>
              </div>
              <h3 className="font-semibold truncate">{track.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No favorite tracks yet</p>
          <p className="text-sm text-muted-foreground mt-2">Start liking songs to see them here</p>
        </div>
      )}
    </div>
  );
}
