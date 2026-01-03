import { useState, useEffect } from 'react';
import { tracksAPI } from '../services/api';
import { useAudio } from '../context/AudioContext';
import { Play } from 'lucide-react';
import { toast } from 'sonner';

export function Home() {
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useAudio();

  useEffect(() => {
    fetchFeaturedTracks();
  }, []);

  const fetchFeaturedTracks = async () => {
    try {
      setLoading(true);
      const response = await tracksAPI.getFeatured();
      setFeaturedTracks(response.data);
    } catch (error) {
      console.error('Error fetching featured tracks:', error);
      toast.error('Failed to load featured tracks');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    playTrack(track, featuredTracks);
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
        <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Discover your favorite music</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Tracks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {featuredTracks.map((track) => (
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
      </section>

      {featuredTracks.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tracks available. Populate the database first.</p>
        </div>
      )}
    </div>
  );
}
