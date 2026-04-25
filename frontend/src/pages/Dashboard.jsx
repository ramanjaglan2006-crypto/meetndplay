import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMatches, getMatchRecommendations } from '../services/api';
import MatchCard from '../components/MatchCard';
import { Bell, Sparkles, Filter, Moon, Sun } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

const Dashboard = ({ theme, toggleTheme }) => {
  const queryClient = useQueryClient();
  const [filterOpen, setFilterOpen] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem('meet_user') || '{}');
  const currentUserId = loggedInUser.id || 'u1';
  const currentUserName = loggedInUser.name || 'Raman';

  // React Query: Fetch All Matches
  const { data: allMatches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const res = await getMatches();
      return res.data;
    }
  });

  // React Query: Fetch Recommended Matches 
  const { data: recommendedMatches = [], isLoading: recsLoading } = useQuery({
    queryKey: ['recommendations', currentUserId],
    queryFn: async () => {
      const res = await getMatchRecommendations(currentUserId);
      return res.data.recommendations || [];
    }
  });

  // Real-time WebSockets logic
  useEffect(() => {
    socket.on('match_updated', (updatedMatch) => {
      // Live Update Player Count & Joined List globally across the app
      queryClient.setQueryData(['matches'], (oldMatches) => {
        if (!oldMatches) return [];
        return oldMatches.map(m => m.id === updatedMatch.id ? updatedMatch : m);
      });
      
      queryClient.setQueryData(['recommendations', currentUserId], (oldRecs) => {
        if (!oldRecs) return [];
        return oldRecs.map(m => m.id === updatedMatch.id ? updatedMatch : m);
      });
    });

    return () => {
      socket.off('match_updated');
    };
  }, [queryClient]);

  const filteredMatches = filterOpen 
    ? allMatches.filter(m => m.joinedPlayers.length < m.totalPlayers) 
    : allMatches;

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '90px' }}>
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
          recommendedMatches.map(match => (
            <MatchCard 
              key={match.id} 
              match={match} 
              currentUserId={currentUserId} 
            />
          ))
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredMatches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
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
