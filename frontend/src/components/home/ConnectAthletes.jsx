import React from 'react';
import { Users, User, MapPin, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEMO_ATHLETES = [
    { id: 'u2', name: 'Arjun Verma', sport: 'Football', position: 'Midfielder', level: 'Advanced', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
    { id: 'u3', name: 'Ananya Sharma', sport: 'Badminton', position: 'Doubles', level: 'Intermediate', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
    { id: 'u4', name: 'Vikram Singh', sport: 'Cricket', position: 'All-Rounder', level: 'Competitive', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150' },
    { id: 'u5', name: 'Rohan Patel', sport: 'Tennis', position: 'Singles', level: 'Advanced', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' }
];

const ConnectAthletes = () => {
    const navigate = useNavigate();

    return (
        <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="#c084fc" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main, #fff)', margin: 0 }}>
                        CONNECT WITH ATHLETES
                    </h2>
                </div>
                <button
                    onClick={() => navigate('/discover')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary, #38bdf8)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                    Explore All →
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {DEMO_ATHLETES.map(a => (
                    <div
                        key={a.id}
                        style={{
                            background: 'var(--card-bg, #1a1a1a)',
                            border: '1px solid var(--border-color, #2d2d2d)',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <img
                            src={a.photo}
                            alt={a.name}
                            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', border: '2px solid var(--primary, #38bdf8)' }}
                        />
                        <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-main, #fff)' }}>{a.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#c084fc', margin: '2px 0 6px 0', fontWeight: '600' }}>
                            {a.sport} · {a.position}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #aaa)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                            <MapPin size={12} /> {a.city} • <Award size={12} /> {a.level}
                        </div>
                        <button
                            onClick={() => navigate(`/profile/${a.id}`)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '10px',
                                background: 'rgba(255,255,255,0.06)',
                                color: 'var(--text-main, #fff)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                            }}
                        >
                            View Profile
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ConnectAthletes;
