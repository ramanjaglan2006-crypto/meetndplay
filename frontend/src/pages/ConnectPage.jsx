import React from 'react';
import { Users, MapPin, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEMO_ATHLETES = [
    { id: 'u2', name: 'Arjun Verma', sport: 'Football', position: 'Midfielder', level: 'Advanced', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
    { id: 'u3', name: 'Ananya Sharma', sport: 'Badminton', position: 'Doubles', level: 'Intermediate', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
    { id: 'u4', name: 'Vikram Singh', sport: 'Cricket', position: 'All-Rounder', level: 'Competitive', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150' },
    { id: 'u5', name: 'Rohan Patel', sport: 'Tennis', position: 'Singles', level: 'Advanced', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' }
];

const DEMO_COMMUNITIES = [
    { slug: 'football-bhopal', name: 'Football Bhopal', players: '1.2K players', sport: 'Football', icon: '⚽' },
    { slug: 'cricket-club', name: 'Cricket Club', players: '850 players', sport: 'Cricket', icon: '🏏' },
    { slug: 'shuttle-masters', name: 'Shuttle Masters', players: '620 players', sport: 'Badminton', icon: '🏸' },
    { slug: 'tennis-smashers', name: 'Tennis Smashers', players: '430 players', sport: 'Tennis', icon: '🎾' }
];

export default function ConnectPage() {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem' }}>
            
            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main, #171817)', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                    CONNECT — Find People Who Play Like You
                </h1>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted, #626762)', margin: 0 }}>
                    Discover local athletes, build your sports network, and join active sports communities.
                </p>
            </div>

            {/* Section 1: Athletes Discovery */}
            <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main, #171817)', margin: 0 }}>
                        FIND ATHLETES
                    </h2>
                    <button
                        onClick={() => navigate('/discover')}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-dark, #E5A900)', fontWeight: 'bold', fontSize: '0.88rem', cursor: 'pointer' }}
                    >
                        View All Athletes →
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    {DEMO_ATHLETES.map((a) => (
                        <div
                            key={a.id}
                            style={{
                                background: 'var(--card-bg, #ffffff)',
                                border: '1px solid var(--border-color, #E3E6E2)',
                                borderRadius: '16px',
                                padding: '1.25rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}
                        >
                            <img
                                src={a.photo}
                                alt={a.name}
                                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', border: '3px solid var(--primary, #F5B91E)' }}
                            />
                            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main, #171817)', margin: '0 0 2px 0' }}>{a.name}</h3>
                            <div style={{ fontSize: '0.82rem', color: 'var(--primary-dark, #E5A900)', fontWeight: 'bold', marginBottom: '6px' }}>
                                {a.sport} · {a.position}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #626762)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '14px' }}>
                                <MapPin size={12} /> {a.city} • <Award size={12} /> {a.level}
                            </div>
                            <button
                                onClick={() => navigate(`/profile/${a.id}`)}
                                style={{
                                    width: '100%',
                                    padding: '9px',
                                    borderRadius: '10px',
                                    background: 'var(--bg-dark, #F6F7F5)',
                                    color: 'var(--text-main, #171817)',
                                    border: '1px solid var(--border-color, #E3E6E2)',
                                    fontWeight: 'bold',
                                    fontSize: '0.82rem',
                                    cursor: 'pointer'
                                }}
                            >
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 2: Popular Sports Communities */}
            <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main, #171817)', margin: 0 }}>
                        SPORTS COMMUNITIES
                    </h2>
                    <button
                        onClick={() => navigate('/communities')}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-dark, #E5A900)', fontWeight: 'bold', fontSize: '0.88rem', cursor: 'pointer' }}
                    >
                        Explore Communities →
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    {DEMO_COMMUNITIES.map((c, i) => (
                        <div
                            key={i}
                            onClick={() => navigate('/communities')}
                            style={{
                                background: 'var(--card-bg, #ffffff)',
                                border: '1px solid var(--border-color, #E3E6E2)',
                                borderRadius: '16px',
                                padding: '1.25rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                transition: 'transform 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>{c.icon}</span>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main, #171817)', margin: '0 0 4px 0' }}>{c.name}</h3>
                            <div style={{ fontSize: '0.82rem', color: 'var(--primary-dark, #E5A900)', fontWeight: 'bold' }}>{c.players}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
