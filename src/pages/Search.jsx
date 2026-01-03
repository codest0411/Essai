import { useState } from 'react';
import { tracksAPI } from '../services/api';
import { useAudio } from '../context/AudioContext';
import { Search as SearchIcon, Play } from 'lucide-react';
import { toast } from 'sonner';

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { playTrack } = useAudio();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const response = await tracksAPI.search(query);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching tracks:', error);
      toast.error('Failed to search tracks');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    playTrack(track, results);
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Search</h1>
        <p className="text-muted-foreground">Find your favorite tracks</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-2xl">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for tracks, artists, or albums..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : searched ? (
        results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((track) => (
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
                <p className="text-xs text-muted-foreground truncate">{track.album}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found for "{query}"</p>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Start searching for music</p>
        </div>
      )}
    </div>
  );
}
