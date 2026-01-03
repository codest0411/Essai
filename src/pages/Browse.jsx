import { useState, useEffect } from 'react';
import { tracksAPI } from '../services/api';
import { useAudio } from '../context/AudioContext';
import { Play } from 'lucide-react';
import { toast } from 'sonner';

export function Browse() {
  const [tracks, setTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [loading, setLoading] = useState(true);
  const { playTrack } = useAudio();

  useEffect(() => {
    fetchGenres();
    fetchTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre]);

  const fetchGenres = async () => {
    try {
      const response = await tracksAPI.getGenres();
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const params = selectedGenre !== 'all' ? { genre: selectedGenre } : {};
      const response = await tracksAPI.getAll(params);
      setTracks(response.data);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast.error('Failed to load tracks');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    playTrack(track, tracks);
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Browse Music</h1>
        <p className="text-muted-foreground">Explore tracks by genre</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedGenre('all')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
            selectedGenre === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          All Genres
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedGenre === genre
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
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
              <p className="text-xs text-muted-foreground truncate">{track.genre}</p>
            </div>
          ))}
        </div>
      )}

      {tracks.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tracks found for this genre.</p>
        </div>
      )}
    </div>
  );
}
