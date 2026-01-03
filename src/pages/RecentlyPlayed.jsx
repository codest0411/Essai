import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAudio } from '../context/AudioContext';
import { Play, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function RecentlyPlayed() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useAudio();

  useEffect(() => {
    fetchRecentlyPlayed();
  }, []);

  const fetchRecentlyPlayed = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getRecentlyPlayed();
      setTracks(response.data);
    } catch (error) {
      console.error('Error fetching recently played:', error);
      toast.error('Failed to load recently played');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    playTrack(track, tracks);
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
        <h1 className="text-4xl font-bold mb-2">Recently Played</h1>
        <p className="text-muted-foreground">{tracks.length} tracks</p>
      </div>

      {tracks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {tracks.map((track) => (
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
              </div>
              <h3 className="font-semibold truncate">{track.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No recently played tracks</p>
          <p className="text-sm text-muted-foreground mt-2">Start listening to music to see your history</p>
        </div>
      )}
    </div>
  );
}
