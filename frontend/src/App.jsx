import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PlayPage = lazy(() => import('./pages/PlayPage'));
const BookPage = lazy(() => import('./pages/BookPage'));
const ConnectPage = lazy(() => import('./pages/ConnectPage'));
const Discover = lazy(() => import('./pages/Discover'));
const Communities = lazy(() => import('./pages/Communities'));
const CreateCommunity = lazy(() => import('./pages/CreateCommunity'));
const CommunityDetail = lazy(() => import('./pages/CommunityDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const ProfileEdit = lazy(() => import('./pages/ProfileEdit'));
const Tournaments = lazy(() => import('./pages/Tournaments'));
const MatchRoom = lazy(() => import('./pages/MatchRoom'));
const Auth = lazy(() => import('./pages/Auth'));

function AppRoutes() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Routes>
      <Route path="/login" element={
        <Suspense fallback={<div className="loading-state">Loading...</div>}>
          {isAuthenticated ? <Navigate to="/" replace /> : <Auth />}
        </Suspense>
      } />
      <Route path="/*" element={
        <ProtectedRoute>
          <MainLayout theme={theme} toggleTheme={toggleTheme}>
            <Suspense fallback={<div className="loading-state">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Dashboard theme={theme} toggleTheme={toggleTheme} />} />
                <Route path="/play" element={<PlayPage />} />
                <Route path="/book" element={<BookPage />} />
                <Route path="/connect" element={<ConnectPage />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/create-community" element={<CreateCommunity />} />
                <Route path="/community/:slug" element={<CommunityDetail />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/matches/:id" element={<MatchRoom />} />
                <Route path="/match/:id" element={<MatchRoom />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/athlete/:id" element={<Profile />} />
                <Route path="/create" element={<div style={{ padding: '2rem' }}><h1>Host Match</h1><p>Feature under development...</p></div>} />
              </Routes>
            </Suspense>
          </MainLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="app-container">
            <AppRoutes />
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
