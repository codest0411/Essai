import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AudioPlayer } from '../player/AudioPlayer';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 mb-20 p-6">
          {children}
        </main>
      </div>
      <AudioPlayer />
    </div>
  );
}
