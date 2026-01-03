import { GENRES } from '../../lib/constants';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export function GenreFilter({ selectedGenre, onGenreChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((genre) => (
        <Button
          key={genre}
          variant={selectedGenre === genre ? 'default' : 'outline'}
          size="sm"
          onClick={() => onGenreChange(genre)}
          className={cn(
            'whitespace-nowrap',
            selectedGenre === genre && 'pointer-events-none'
          )}
        >
          {genre}
        </Button>
      ))}
    </div>
  );
}
