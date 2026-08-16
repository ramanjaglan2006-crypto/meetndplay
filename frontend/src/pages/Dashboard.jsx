import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getMatchRecommendations } from '../services/api';
import { useMatches } from '../hooks/queries/useMatches';
import MatchCard from '../components/MatchCard';
import { Bell, Sparkles, Filter, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const Dashboard = ({ theme, toggleTheme }) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const [filterOpen, setFilterOpen] = useState(false);
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id || 'u1';
  const currentUserName = user?.name || 'Player';

  // React Query: Fetch All Matches via centralized hook
  const { data: allMatches = [], isLoading: matchesLoading } = useMatches();

  // React Query: Fetch Recommended Matches
  // Temporarily disabled or could be a hook `useMatchRecommendations`
  const recommendedMatches = [];
  const recsLoading = false;

  // Real-time WebSockets logic
  useEffect(() => {
    if (!socket) return;
    
    const handleMatchUpdated = (updatedMatch) => {
      // Live Update Player Count & Joined List globally across the app
      queryClient.setQueryData(['matches'], (oldMatches) => {
        if (!oldMatches) return [];
        return oldMatches.map(m => m.id === updatedMatch.id ? updatedMatch : m);
      });
      
      queryClient.setQueryData(['recommendations', currentUserId], (oldRecs) => {
        if (!oldRecs) return [];
        return oldRecs.map(m => m.id === updatedMatch.id ? updatedMatch : m);
      });
    };

    socket.on('match_updated', handleMatchUpdated);

    return () => {
      socket.off('match_updated', handleMatchUpdated);
    };
  }, [queryClient, socket, currentUserId]);

  const filteredMatches = filterOpen 
    ? allMatches.filter(m => m.joinedPlayers.length < m.totalPlayers) 
    : allMatches;

  return (
    <div style={{ width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back,</p>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{currentUserName} <span style={{ fontSize: '1.2rem' }}>👋</span></h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button 
                onClick={toggleTheme}
                className="glass-card" 
                style={{ 
                    padding: '10px', 
                    borderRadius: '14px', 
                    marginBottom: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)'
                }}
            >
                {theme === 'light' ? <Moon size={20} color="var(--text-main)" /> : <Sun size={20} color="var(--text-main)" />}
            </button>
            <div className="glass-card" style={{ padding: '10px', borderRadius: '14px', marginBottom: 0, display: 'flex', alignItems: 'center' }}>
                <Bell size={20} color="var(--text-main)" />
            </div>
        </div>
      </header>

      {/* AI Recommendations */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <Sparkles size={18} color="var(--accent)" />
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Picked For You</h2>
        </div>
        
        {recsLoading ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Optimizing matches...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {recommendedMatches.map(match => (
              <MatchCard 
                key={match._id || match.id} 
                match={{...match, id: match._id || match.id}} 
                currentUserId={currentUserId} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Regular Feed */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Active Matches</h2>
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            style={{ 
              background: filterOpen ? 'var(--primary)' : 'rgba(0,0,0,0.05)', 
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              color: filterOpen ? 'black' : 'var(--text-main)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Filter size={14} /> {filterOpen ? 'Open Slots Only' : 'All Matches'}
          </button>
        </div>
        
        {matchesLoading ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading matches...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {filteredMatches.map(match => (
              <MatchCard 
                key={match._id || match.id} 
                match={{...match, id: match._id || match.id}} 
                currentUserId={currentUserId} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
