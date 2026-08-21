import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COMMUNITIES = [
    { name: 'Football Bhopal', players: '1.2K Players', icon: '⚽', color: '#38bdf8' },
    { name: 'Cricket Club', players: '850 Players', icon: '🏏', color: '#fbbf24' },
    { name: 'Shuttle Masters', players: '620 Players', icon: '🏸', color: '#34d399' },
    { name: 'Tennis Smashers', players: '430 Players', icon: '🎾', color: '#c084fc' },
    { name: 'Pickleball Bhopal', players: '280 Players', icon: '🥒', color: '#f43f5e' }
];

const SportsCommunities = () => {
    const navigate = useNavigate();

    return (
        <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--primary, #38bdf8)" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main, #fff)', margin: 0 }}>
                        YOUR SPORTS COMMUNITIES
                    </h2>
                </div>
                <button
                    onClick={() => navigate('/communities')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary, #38bdf8)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    Explore Communities <ArrowRight size={14} />
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {COMMUNITIES.map((c, i) => (
                    <div
                        key={i}
                        onClick={() => navigate('/communities')}
                        style={{
                            background: 'var(--card-bg, #1a1a1a)',
                            border: '1px solid var(--border-color, #2d2d2d)',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{c.icon}</div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-main, #fff)' }}>{c.name}</div>
                        <div style={{ fontSize: '0.78rem', color: c.color, fontWeight: 'bold', marginTop: '2px' }}>{c.players}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SportsCommunities;
