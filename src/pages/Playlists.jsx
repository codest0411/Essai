import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playlistsAPI } from '../services/api';
import { Plus, Music } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await playlistsAPI.getAll();
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    
    if (!newPlaylistName.trim()) {
      toast.error('Playlist name is required');
      return;
    }

    try {
      setCreating(true);
      const response = await playlistsAPI.create({
        name: newPlaylistName,
        description: newPlaylistDescription
      });
      setPlaylists([response.data, ...playlists]);
      setShowCreateModal(false);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      toast.success('Playlist created successfully');
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    } finally {
      setCreating(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Playlists</h1>
          <p className="text-muted-foreground">{playlists.length} playlists</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Create Playlist
        </Button>
      </div>

      {playlists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => navigate(`/playlists/${playlist.id}`)}
              className="group bg-card rounded-lg p-4 hover:bg-accent transition-all cursor-pointer"
            >
              <div className="aspect-square mb-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-md flex items-center justify-center">
                <Music className="h-12 w-12 text-primary" />
              </div>
              <h3 className="font-semibold truncate">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {playlist.description || 'No description'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No playlists yet</p>
          <p className="text-sm text-muted-foreground mt-2">Create your first playlist to get started</p>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Create Playlist</h2>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="My Awesome Playlist"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <Input
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="A collection of my favorite songs"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating} className="flex-1">
                  {creating ? 'Creating...' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
