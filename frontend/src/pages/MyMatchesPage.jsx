import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMyMatches } from '../hooks/queries/useMatches';
import { useAuth } from '../context/AuthContext';
import SportSelector from '../components/home/SportSelector';
import MatchCard from '../components/MatchCard';
import {
    Trophy, Calendar, Clock, MapPin, Plus, PlayCircle, Shield, Zap,
    CheckCircle2, AlertCircle, ArrowRight, UserCheck, Flame
} from 'lucide-react';

export default function MyMatchesPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const currentUserId = user?.id || user?._id || 'u1';

    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'all'; // 'all', 'created', 'joined'
    const activeFilter = searchParams.get('filter') || 'upcoming'; // 'upcoming', 'past', 'cancelled', 'all'
    const selectedSport = searchParams.get('sport') || 'All';

    const { data: myMatchesData, isLoading } = useMyMatches();

    const createdList = myMatchesData?.created || [];
    const joinedList = myMatchesData?.joined || [];
    const stats = myMatchesData?.stats || { createdCount: 0, joinedCount: 0, upcomingCount: 0, completedCount: 0 };
    const nextGame = myMatchesData?.nextGame || null;

    // URL Query State Updater
    const setTab = (tab) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('tab', tab);
        setSearchParams(newParams);
    };

    const setFilter = (filter) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('filter', filter);
        setSearchParams(newParams);
    };

    const setSport = (sport) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sport', sport);
        setSearchParams(newParams);
    };

    // Filter Matches Logic
    const displayMatches = useMemo(() => {
        let baseList = [];
        if (activeTab === 'created') {
            baseList = createdList.map(m => ({ ...m, isHost: true }));
        } else if (activeTab === 'joined') {
            baseList = joinedList.map(m => ({ ...m, isJoinedPlayer: true }));
        } else {
            const hostTagged = createdList.map(m => ({ ...m, isHost: true }));
            const joinedTagged = joinedList.map(m => ({ ...m, isJoinedPlayer: true }));
            baseList = [...hostTagged, ...joinedTagged];
        }

        const now = new Date();

        // Secondary Time/Status Filter
        if (activeFilter === 'upcoming') {
            baseList = baseList.filter(m => new Date(m.dateTime) >= now && m.status !== 'cancelled');
        } else if (activeFilter === 'past') {
            baseList = baseList.filter(m => new Date(m.dateTime) < now || m.status === 'completed');
        } else if (activeFilter === 'cancelled') {
            baseList = baseList.filter(m => m.status === 'cancelled');
        }

        // Sport Filter
        if (selectedSport !== 'All') {
            baseList = baseList.filter(m => (m.sport || '').toLowerCase() === selectedSport.toLowerCase());
        }

        return baseList;
    }, [createdList, joinedList, activeTab, activeFilter, selectedSport]);

    if (isLoading) {
        return (
            <div style={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spin" style={{ width: '36px', height: '36px', border: '3px solid var(--border-color, #E3E6E2)', borderTopColor: 'var(--primary, #F5B91E)', borderRadius: '50%' }} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem' }}>
            
            {/* Page Header & Play Sub-Navigation */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main, #171817)', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
                            MY MATCHES
                        </h1>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted, #626762)', margin: 0 }}>
                            Your games, all in one place.
                        </p>
                    </div>

                    {/* Subnav Pill Tabs (Find Matches | My Matches | + Create Match) */}
                    <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-dark, #F6F7F5)', padding: '4px', borderRadius: '14px', border: '1px solid var(--border-color, #E3E6E2)' }}>
                        <button
                            onClick={() => navigate('/play')}
                            style={{ padding: '8px 16px', borderRadius: '10px', background: 'transparent', border: 'none', color: 'var(--text-muted, #626762)', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                            Find Matches
                        </button>
                        <button
                            style={{ padding: '8px 16px', borderRadius: '10px', background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', color: 'var(--text-main, #171817)', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
                        >
                            My Matches
                        </button>
                        <button
                            onClick={() => navigate('/play/create')}
                            style={{ padding: '8px 16px', borderRadius: '10px', background: 'var(--primary, #F5B91E)', border: 'none', color: '#000', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            <Plus size={16} strokeWidth={3} /> Create Match
                        </button>
                    </div>
                </div>

                {/* Compact Stats Summary Bar */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '14px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 185, 30, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark, #E5A900)', fontWeight: '900' }}>
                            <Trophy size={18} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #626762)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CREATED</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main, #171817)' }}>{stats.createdCount}</div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '14px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', fontWeight: '900' }}>
                            <UserCheck size={18} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #626762)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>JOINED</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main, #171817)' }}>{stats.joinedCount}</div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '14px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: '900' }}>
                            <Clock size={18} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #626762)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>UPCOMING</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main, #171817)' }}>{stats.upcomingCount}</div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '14px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-dark, #F6F7F5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted, #626762)', fontWeight: '900' }}>
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #626762)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>COMPLETED</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main, #171817)' }}>{stats.completedCount}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* "YOUR NEXT GAME" Hero Highlight Card (Compact top feature) */}
            {nextGame && (
                <div style={{
                    background: 'linear-gradient(135deg, #171817 0%, #262826 100%)',
                    borderRadius: '20px',
                    padding: '1.25rem 1.5rem',
                    color: '#fff',
                    marginBottom: '1.75rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(245, 185, 30, 0.2)', border: '1.5px solid var(--primary, #F5B91E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                            {nextGame.sport === 'Cricket' ? '🏏' : (nextGame.sport === 'Badminton' ? '🏸' : (nextGame.sport === 'Tennis' ? '🎾' : '⚽'))}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary, #F5B91E)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                YOUR NEXT GAME
                            </div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '2px 0 4px 0', color: '#fff' }}>
                                {nextGame.title || `${nextGame.format || ''} ${nextGame.sport} Match`}
                            </h3>
                            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span><MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />{nextGame.locationName}</span>
                                <span><Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />{new Date(nextGame.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {nextGame.myPosition && (
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                Position: <span style={{ color: 'var(--primary, #F5B91E)' }}>{nextGame.myPosition}</span>
                            </div>
                        )}
                        <button
                            onClick={() => navigate(`/matches/${nextGame._id || nextGame.id}`)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '12px',
                                background: 'var(--primary, #F5B91E)',
                                color: '#000',
                                fontWeight: '900',
                                fontSize: '0.88rem',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            Enter Match Room <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Filter Bar: Primary Tabs + Secondary Filter Pills */}
            <div style={{
                background: 'var(--card-bg, #ffffff)',
                border: '1px solid var(--border-color, #E3E6E2)',
                borderRadius: '16px',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                {/* Primary Tabs: All | Created | Joined */}
                <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-dark, #F6F7F5)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color, #E3E6E2)' }}>
                    {['all', 'created', 'joined'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            style={{
                                padding: '8px 18px',
                                borderRadius: '10px',
                                background: activeTab === t ? 'var(--card-bg, #ffffff)' : 'transparent',
                                border: activeTab === t ? '1px solid var(--border-color, #E3E6E2)' : 'none',
                                color: activeTab === t ? 'var(--text-main, #171817)' : 'var(--text-muted, #626762)',
                                fontWeight: activeTab === t ? '900' : '700',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                boxShadow: activeTab === t ? '0 2px 6px rgba(0,0,0,0.04)' : 'none'
                            }}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Secondary Filters: Upcoming | Past | Cancelled | All */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['upcoming', 'past', 'cancelled', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '20px',
                                background: activeFilter === f ? 'var(--text-main, #171817)' : 'var(--bg-dark, #F6F7F5)',
                                color: activeFilter === f ? '#fff' : 'var(--text-muted, #626762)',
                                fontWeight: '700',
                                fontSize: '0.8rem',
                                border: '1px solid var(--border-color, #E3E6E2)',
                                cursor: 'pointer'
                            }}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sport Filter Pills */}
            <div style={{ marginBottom: '1.5rem' }}>
                <SportSelector selectedSport={selectedSport} onSelectSport={(s) => setSport(s)} />
            </div>

            {/* Matches Grid or Smart Empty State */}
            {displayMatches.length === 0 ? (
                <div style={{
                    padding: '3.5rem 2rem',
                    textAlign: 'center',
                    background: 'var(--card-bg, #ffffff)',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color, #E3E6E2)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-dark, #F6F7F5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', color: 'var(--text-muted, #626762)' }}>
                        <Trophy size={32} />
                    </div>

                    {activeTab === 'created' ? (
                        <>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main, #171817)', marginBottom: '0.5rem' }}>
                                You Haven't Created a Match Yet
                            </h3>
                            <p style={{ color: 'var(--text-muted, #626762)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Host a game, invite players, and manage your tactical squad.
                            </p>
                            <button
                                onClick={() => navigate('/play/create')}
                                style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--primary, #F5B91E)', color: '#000', fontWeight: '900', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Plus size={18} strokeWidth={3} /> Create a Match
                            </button>
                        </>
                    ) : activeTab === 'joined' ? (
                        <>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main, #171817)', marginBottom: '0.5rem' }}>
                                You Haven't Joined a Match Yet
                            </h3>
                            <p style={{ color: 'var(--text-muted, #626762)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Explore active games nearby and reserve your spot on the team.
                            </p>
                            <button
                                onClick={() => navigate('/play')}
                                style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--primary, #F5B91E)', color: '#000', fontWeight: '900', border: 'none', cursor: 'pointer' }}
                            >
                                Find a Match
                            </button>
                        </>
                    ) : (
                        <>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main, #171817)', marginBottom: '0.5rem' }}>
                                No Matches Found
                            </h3>
                            <p style={{ color: 'var(--text-muted, #626762)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                No games match your selected filters.
                            </p>
                            <button
                                onClick={() => navigate('/play')}
                                style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--primary, #F5B91E)', color: '#000', fontWeight: '900', border: 'none', cursor: 'pointer' }}
                            >
                                Explore Matches
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {displayMatches.map((match) => {
                        const mid = match._id || match.id;
                        const isHost = match.isHost || (match.hostId?._id || match.hostId) === currentUserId;

                        return (
                            <div key={mid} style={{ position: 'relative' }}>
                                {/* Custom Membership Badge Header */}
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    zIndex: 10,
                                    background: isHost ? '#fef3c7' : '#e0f2fe',
                                    color: isHost ? '#b45309' : '#0369a1',
                                    padding: '3px 8px',
                                    borderRadius: '8px',
                                    fontSize: '0.72rem',
                                    fontWeight: '900',
                                    border: `1px solid ${isHost ? '#fcd34d' : '#7dd3fc'}`
                                }}>
                                    {isHost ? 'HOST · Created by you' : `PLAYER · ${match.myPosition || 'Joined ✓'}`}
                                </div>

                                <MatchCard
                                    match={match}
                                    currentUserId={currentUserId}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
