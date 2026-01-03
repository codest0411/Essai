import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, Clock, ListMusic, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Browse', href: '/browse', icon: Compass },
  { name: 'Favorites', href: '/favorites', icon: Heart },
  { name: 'Recently Played', href: '/recently-played', icon: Clock },
  { name: 'Playlists', href: '/playlists', icon: ListMusic },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 bottom-20 w-64 bg-card border-r border-border overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
