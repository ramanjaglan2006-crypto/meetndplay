import React from 'react';
import MatchCard from '../MatchCard';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpcomingGames = ({ matches = [], currentUserId, onFindMatch }) => {
    const joinedMatches = matches.filter(m => 
        (m.joinedPlayers || []).some(id => (id._id || id) === currentUserId)
    );

    return (
        <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Calendar size={18} color="#34d399" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main, #fff)', margin: 0 }}>
                    YOUR UPCOMING GAMES
                </h2>
            </div>

            {joinedMatches.length === 0 ? (
                <div style={{
                    background: 'var(--card-bg, #1a1a1a)',
                    border: '1px solid var(--border-color, #2d2d2d)',
                    borderRadius: '16px',
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--text-muted, #aaa)'
                }}>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem' }}>You haven't joined a match yet.</p>
                    <button
                        onClick={onFindMatch}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            background: 'var(--primary, #38bdf8)',
                            color: '#000',
                            border: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                    >
                        Find a Match
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {joinedMatches.map((match) => (
                        <MatchCard
                            key={match._id || match.id}
                            match={match}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default UpcomingGames;
