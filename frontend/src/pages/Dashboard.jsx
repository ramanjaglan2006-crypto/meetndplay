import React, { useMemo } from 'react';
import { useMatches } from '../hooks/queries/useMatches';
import { useAuth } from '../context/AuthContext';
import { SEED_MATCHES } from '../config/seedMatches';
import MatchCard from '../components/MatchCard';

import { PlayCircle, MapPin, Users, Sparkles, ArrowRight, Calendar, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEMO_ATHLETES = [
    { id: 'u2', name: 'Arjun Verma', sport: 'Football', position: 'Midfielder', level: 'Advanced', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
    { id: 'u3', name: 'Ananya Sharma', sport: 'Badminton', position: 'Doubles', level: 'Intermediate', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
    { id: 'u4', name: 'Vikram Singh', sport: 'Cricket', position: 'All-Rounder', level: 'Competitive', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150' }
];

const DEMO_COMMUNITIES = [
    { name: 'Football Bhopal', players: '1.2K players', icon: '⚽' },
    { name: 'Cricket Club', players: '850 players', icon: '🏏' },
    { name: 'Shuttle Masters', players: '620 players', icon: '🏸' }
];

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const currentUserId = user?.id || user?._id || 'u1';
    const currentUserName = user?.name || 'Player';

    const { data: apiMatches = [] } = useMatches();

    const allMatches = useMemo(() => {
        const merged = [...apiMatches];
        const existingIds = new Set(merged.map(m => m._id || m.id));
        SEED_MATCHES.forEach(seed => {
            if (!existingIds.has(seed.id)) {
                merged.push(seed);
            }
        });
        return merged;
    }, [apiMatches]);

    const upcomingUserMatches = useMemo(() => {
        return allMatches.filter(m => (m.joinedPlayers || []).some(id => (id._id || id) === currentUserId)).slice(0, 3);
    }, [allMatches, currentUserId]);

    const recommendedMatches = useMemo(() => {
        return allMatches.filter(m => (m.joinedPlayers?.length || 0) >= Math.floor((m.totalPlayers || 10) * 0.6)).slice(0, 3);
    }, [allMatches]);

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem' }}>
            
            {/* Premium Hero Banner (No clutter, 340px height) */}
            <div style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #FFF3C7 100%)',
                border: '1px solid var(--border-color, #E3E6E2)',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                marginBottom: '2.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    background: 'rgba(245, 185, 30, 0.2)',
                    color: 'var(--primary-dark, #E5A900)',
                    fontSize: '0.82rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                }}>
                    <Sparkles size={14} /> Welcome back, {currentUserName}!
                </div>

                <h1 style={{
                    fontSize: '2.6rem',
                    fontWeight: '900',
                    margin: '0 0 0.75rem 0',
                    color: 'var(--text-main, #171817)',
                    letterSpacing: '-0.5px',
                    lineHeight: 1.15
                }}>
                    PLAY. BOOK. CONNECT.
                </h1>

                <p style={{
                    fontSize: '1.05rem',
                    color: 'var(--text-muted, #626762)',
                    maxWidth: '540px',
                    margin: '0 auto 1.75rem auto',
                    lineHeight: 1.5
                }}>
                    Your next game is closer than you think. Find active matches, book courts, and discover your local sports community.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/play')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 28px',
                            borderRadius: '12px',
                            background: 'var(--primary, #F5B91E)',
                            color: '#000000',
                            border: 'none',
                            fontWeight: '800',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(245, 185, 30, 0.3)'
                        }}
                    >
                        <PlayCircle size={18} /> PLAY NOW
                    </button>

                    <button
                        onClick={() => navigate('/connect')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 28px',
                            borderRadius: '12px',
                            background: '#ffffff',
                            color: 'var(--text-main, #171817)',
                            border: '1px solid var(--border-color, #E3E6E2)',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            cursor: 'pointer'
                        }}
                    >
                        <Users size={18} /> EXPLORE ATHLETES
                    </button>
                </div>
            </div>

            {/* 1. Your Upcoming Games (Max 3 cards) */}
            {upcomingUserMatches.length > 0 && (
                <section style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={18} color="var(--secondary, #20A66A)" />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main, #171817)', margin: 0 }}>
                                YOUR UPCOMING GAMES
                            </h2>
                        </div>
                        <button
                            onClick={() => navigate('/play')}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-dark, #E5A900)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                            View All →
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                        {upcomingUserMatches.map(match => (
                            <MatchCard key={match._id || match.id} match={match} currentUserId={currentUserId} />
                        ))}
                    </div>
                </section>
            )}

            {/* 2. Recommended Matches (Max 3 cards) */}
            <section style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={18} color="var(--primary-dark, #E5A900)" />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main, #171817)', margin: 0 }}>
                            RECOMMENDED MATCHES
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/play')}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-dark, #E5A900)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        View All Matches <ArrowRight size={14} />
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {recommendedMatches.map(match => (
                        <MatchCard key={match._id || match.id} match={match} currentUserId={currentUserId} />
                    ))}
                </div>
            </section>

            {/* 3. Athletes You May Know (Max 3 cards) */}
            <section style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={18} color="var(--primary-dark, #E5A900)" />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main, #171817)', margin: 0 }}>
                            ATHLETES YOU MAY KNOW
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/connect')}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-dark, #E5A900)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        Explore Athletes <ArrowRight size={14} />
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    {DEMO_ATHLETES.map(a => (
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
                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                            }}
                        >
                            <img
                                src={a.photo}
                                alt={a.name}
                                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', border: '2.5px solid var(--primary, #F5B91E)' }}
                            />
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main, #171817)', margin: '0 0 2px 0' }}>{a.name}</h3>
                            <div style={{ fontSize: '0.78rem', color: 'var(--primary-dark, #E5A900)', fontWeight: 'bold', marginBottom: '4px' }}>
                                {a.sport} · {a.position}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #626762)', marginBottom: '12px' }}>
                                {a.city} • {a.level}
                            </div>
                            <button
                                onClick={() => navigate(`/profile/${a.id}`)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    background: 'var(--bg-dark, #F6F7F5)',
                                    color: 'var(--text-main, #171817)',
                                    border: '1px solid var(--border-color, #E3E6E2)',
                                    fontWeight: 'bold',
                                    fontSize: '0.78rem',
                                    cursor: 'pointer'
                                }}
                            >
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Venue Discovery Teaser */}
            <section style={{ marginBottom: '2.5rem' }}>
                <div style={{
                    background: 'var(--card-bg, #ffffff)',
                    border: '1px solid var(--border-color, #E3E6E2)',
                    borderRadius: '20px',
                    padding: '1.75rem',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--primary-soft, #FFF3C7)', color: 'var(--primary-dark, #E5A900)', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '6px' }}>
                            <MapPin size={12} /> BOOK SPORTS VENUES — COMING SOON
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main, #171817)', margin: 0 }}>
                            Need a venue for your next match?
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #626762)', margin: '4px 0 0 0' }}>
                            Discover top-rated turfs, badminton courts, and sports complexes near you.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/book')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            background: 'var(--primary, #F5B91E)',
                            color: '#000000',
                            border: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.88rem',
                            cursor: 'pointer'
                        }}
                    >
                        Explore Venues →
                    </button>
                </div>
            </section>

            {/* 5. Popular Communities Preview */}
            <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main, #171817)', margin: 0 }}>
                        POPULAR COMMUNITIES
                    </h2>
                    <button
                        onClick={() => navigate('/communities')}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-dark, #E5A900)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        View Communities <ArrowRight size={14} />
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {DEMO_COMMUNITIES.map((c, i) => (
                        <div
                            key={i}
                            onClick={() => navigate('/communities')}
                            style={{
                                background: 'var(--card-bg, #ffffff)',
                                border: '1px solid var(--border-color, #E3E6E2)',
                                borderRadius: '14px',
                                padding: '1.1rem',
                                cursor: 'pointer'
                            }}
                        >
                            <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '6px' }}>{c.icon}</span>
                            <h4 style={{ fontSize: '0.92rem', fontWeight: 'bold', color: 'var(--text-main, #171817)', margin: '0 0 2px 0' }}>{c.name}</h4>
                            <span style={{ fontSize: '0.78rem', color: 'var(--primary-dark, #E5A900)', fontWeight: 'bold' }}>{c.players}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom Section: Explore Everything (PLAY | BOOK | CONNECT) */}
            <div style={{
                background: 'var(--bg-dark, #F6F7F5)',
                border: '1px solid var(--border-color, #E3E6E2)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '0.5rem' }}>
                    Explore Everything on MeetNDPlay
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted, #626762)', marginBottom: '1.25rem' }}>
                    Your ultimate sports social platform. Find games, book venues, and connect with athletes.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/play')}
                        style={{ padding: '10px 24px', borderRadius: '30px', background: 'var(--primary, #F5B91E)', color: '#000', border: 'none', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        <PlayCircle size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> PLAY
                    </button>
                    <button
                        onClick={() => navigate('/book')}
                        style={{ padding: '10px 24px', borderRadius: '30px', background: '#ffffff', color: 'var(--text-main, #171817)', border: '1px solid var(--border-color, #E3E6E2)', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> BOOK
                    </button>
                    <button
                        onClick={() => navigate('/connect')}
                        style={{ padding: '10px 24px', borderRadius: '30px', background: '#ffffff', color: 'var(--text-main, #171817)', border: '1px solid var(--border-color, #E3E6E2)', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        <Users size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> CONNECT
                    </button>
                </div>
            </div>
        </div>
    );
}
