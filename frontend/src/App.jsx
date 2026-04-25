import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Communities from './pages/Communities';
import DiscordHub from './pages/DiscordHub';
import Chat from './pages/Chat';
import DirectMessageChat from './pages/DirectMessageChat';
import Profile from './pages/Profile';
import Tournaments from './pages/Tournaments';
import Auth from './pages/Auth';
import BottomNav from './components/BottomNav';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(() => {
      const saved = localStorage.getItem('meet_user');
      return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (!user) {
      return (
          <Router>
              <div className="app-container">
                  <main style={{ flex: 1, overflowY: 'auto' }}>
                      <Routes>
                          <Route path="*" element={<Auth onAuthSuccess={(userId) => {
                              const updatedUser = JSON.parse(localStorage.getItem('meet_user'));
                              setUser(updatedUser);
                          }} />} />
                      </Routes>
                  </main>
              </div>
          </Router>
      );
  }

  return (
    <Router>
      <div className="app-container">
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/community" element={<Communities />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/discord" element={<DiscordHub />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/dm/:userId" element={<DirectMessageChat />} />
            <Route path="/create" element={<div style={{ padding: '2rem' }}><h1>Host Match</h1><p>Feature under development...</p></div>} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
