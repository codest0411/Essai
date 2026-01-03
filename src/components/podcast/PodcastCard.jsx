import { Card } from '../ui/Card';
import { useNavigate } from 'react-router-dom';

export function PodcastCard({ podcast }) {
  const navigate = useNavigate();

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={() => navigate(`/podcasts/${podcast.id}`)}
    >
      <div className="aspect-square relative">
        <img
          src={podcast.cover_image_url || '/placeholder-podcast.png'}
          alt={podcast.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold truncate">{podcast.title}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {podcast.host || 'Unknown Host'}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{podcast.category}</span>
          <span className="text-xs text-muted-foreground">
            {podcast.total_episodes || 0} episodes
          </span>
        </div>
      </div>
    </Card>
  );
}
