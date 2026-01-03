import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AudioProvider } from './context/AudioContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import { Landing } from './pages/Landing';
import Auth from './pages/Auth';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { Search } from './pages/Search';
import { Favorites } from './pages/Favorites';
import { RecentlyPlayed } from './pages/RecentlyPlayed';
import { Playlists } from './pages/Playlists';
import { PlaylistDetail } from './pages/PlaylistDetail';
import { Profile } from './pages/Profile';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AudioProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />

              <Route path="/home" element={
                <Layout>
                  <Home />
                </Layout>
              } />

              <Route path="/browse" element={
                <Layout>
                  <Browse />
                </Layout>
              } />

              <Route path="/search" element={
                <Layout>
                  <Search />
                </Layout>
              } />

              <Route path="/favorites" element={
                <ProtectedRoute>
                  <Layout>
                    <Favorites />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/recently-played" element={
                <ProtectedRoute>
                  <Layout>
                    <RecentlyPlayed />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/playlists" element={
                <ProtectedRoute>
                  <Layout>
                    <Playlists />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/playlists/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <PlaylistDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-right" richColors />
          </Router>
        </AudioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
