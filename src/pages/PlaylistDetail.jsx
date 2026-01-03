import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playlistsAPI } from '../services/api';
import { useAudio } from '../context/AudioContext';
import { Play, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useAudio();

  useEffect(() => {
    fetchPlaylist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const response = await playlistsAPI.getById(id);
      setPlaylist(response.data);
    } catch (error) {
      console.error('Error fetching playlist:', error);
      toast.error('Failed to load playlist');
      navigate('/playlists');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    if (playlist?.tracks) {
      playTrack(track, playlist.tracks);
    }
  };

  const handleRemoveTrack = async (trackId, e) => {
    e.stopPropagation();
    try {
      await playlistsAPI.removeTrack(id, trackId);
      setPlaylist({
        ...playlist,
        tracks: playlist.tracks.filter(t => t.id !== trackId)
      });
      toast.success('Track removed from playlist');
    } catch (error) {
      console.error('Error removing track:', error);
      toast.error('Failed to remove track');
    }
  };

  const handleDeletePlaylist = async () => {
    if (!confirm('Are you sure you want to delete this playlist?')) {
      return;
    }

    try {
      await playlistsAPI.delete(id);
      toast.success('Playlist deleted');
      navigate('/playlists');
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!playlist) {
    return null;
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/playlists')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-muted-foreground">{playlist.description || 'No description'}</p>
          <p className="text-sm text-muted-foreground mt-1">{playlist.tracks?.length || 0} tracks</p>
        </div>
        <Button variant="destructive" onClick={handleDeletePlaylist}>
          <Trash2 className="h-5 w-5 mr-2" />
          Delete Playlist
        </Button>
      </div>

      {playlist.tracks && playlist.tracks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlist.tracks.map((track) => (
            <div
              key={track.id}
              className="group relative bg-card rounded-lg p-4 hover:bg-accent transition-all cursor-pointer"
              onClick={() => handlePlay(track)}
            >
              <div className="relative aspect-square mb-3">
                <img
                  src={track.cover_image_url || 'https://via.placeholder.com/300'}
                  alt={track.title}
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-primary text-primary-foreground rounded-full p-3 hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 fill-current" />
                  </button>
                </div>
                <button
                  onClick={(e) => handleRemoveTrack(track.id, e)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
              <h3 className="font-semibold truncate">{track.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">This playlist is empty</p>
          <p className="text-sm text-muted-foreground mt-2">Add tracks from Browse or Search</p>
        </div>
      )}
    </div>
  );
}
