import React, { useState, useMemo } from 'react';
import { useMatches } from '../hooks/queries/useMatches';
import { useAuth } from '../context/AuthContext';
import { SEED_MATCHES } from '../config/seedMatches';

import SportSelector from '../components/home/SportSelector';
import MatchCard from '../components/MatchCard';

import { Search, MapPin, Filter, ArrowUpDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PlayPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const currentUserId = user?.id || user?._id || 'u1';

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');
    const [selectedSkill, setSelectedSkill] = useState('All');
    const [sortBy, setSortBy] = useState('Soonest');

    const { data: apiMatches = [], isLoading: matchesLoading } = useMatches();

    // Merge API matches with seed dataset
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

    // Filter & Sort
    const filteredMatches = useMemo(() => {
        let list = [...allMatches];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(m => 
                (m.sport || '').toLowerCase().includes(q) ||
                (m.locationName || '').toLowerCase().includes(q) ||
                (m.title || '').toLowerCase().includes(q)
            );
        }

        if (selectedSport !== 'All') {
            list = list.filter(m => (m.sport || '').toLowerCase() === selectedSport.toLowerCase());
        }

        if (selectedSkill !== 'All') {
            const lvlMap = { 'Beginner': 2, 'Intermediate': 3, 'Advanced': 4 };
            const targetLvl = lvlMap[selectedSkill] || 3;
            list = list.filter(m => (m.skillLevel || 3) === targetLvl);
        }

        if (sortBy === 'Soonest') {
            list.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        } else if (sortBy === 'Closest') {
            list.sort((a, b) => (a.distanceKm || 99) - (b.distanceKm || 99));
        } else if (sortBy === 'Most Players') {
            list.sort((a, b) => (b.joinedPlayers?.length || 0) - (a.joinedPlayers?.length || 0));
        } else if (sortBy === 'Spots Remaining') {
            list.sort((a, b) => ((a.totalPlayers - a.joinedPlayers?.length) - (b.totalPlayers - b.joinedPlayers?.length)));
        }

        return list;
    }, [allMatches, searchQuery, selectedSport, selectedSkill, sortBy]);

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem' }}>
            
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main, #171817)', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                        PLAY — Active Sports Matches
                    </h1>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted, #626762)', margin: 0 }}>
                        Find your next game, select your position, and get on the field.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/play/create')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        borderRadius: '14px',
                        background: 'var(--primary, #F5B91E)',
                        color: '#000',
                        fontWeight: '900',
                        fontSize: '0.95rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(245, 185, 30, 0.4)'
                    }}
                >
                    <Plus size={20} strokeWidth={3} /> CREATE MATCH
                </button>
            </div>

            {/* Search & Filter Controls */}
            <div style={{
                background: 'var(--card-bg, #ffffff)',
                border: '1px solid var(--border-color, #E3E6E2)',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                        <Search size={18} color="var(--text-muted, #626762)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search matches, venues, cities..."
                            style={{
                                width: '100%',
                                padding: '10px 14px 10px 42px',
                                borderRadius: '10px',
                                border: '1px solid var(--border-color, #E3E6E2)',
                                background: 'var(--bg-dark, #F6F7F5)',
                                color: 'var(--text-main, #171817)',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color, #E3E6E2)',
                            background: 'var(--bg-dark, #F6F7F5)',
                            color: 'var(--text-main, #171817)',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            outline: 'none'
                        }}
                    >
                        <option value="All">All Skill Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color, #E3E6E2)',
                            background: 'var(--bg-dark, #F6F7F5)',
                            color: 'var(--text-main, #171817)',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            outline: 'none'
                        }}
                    >
                        <option value="Soonest">Sort by: Soonest</option>
                        <option value="Closest">Sort by: Closest</option>
                        <option value="Most Players">Sort by: Most Players</option>
                        <option value="Spots Remaining">Sort by: Spots Remaining</option>
                    </select>
                </div>

                <SportSelector selectedSport={selectedSport} onSelectSport={(sport) => setSelectedSport(sport)} />
            </div>

            {/* Matches Grid */}
            {matchesLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading active matches...</div>
            ) : filteredMatches.length === 0 ? (
                <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    background: 'var(--card-bg, #ffffff)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color, #E3E6E2)'
                }}>
                    <p style={{ color: 'var(--text-muted, #626762)', margin: '0 0 1rem 0' }}>No matches found matching your filters.</p>
                    <button
                        onClick={() => navigate('/play/create')}
                        style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--primary, #F5B91E)', color: '#000', border: 'none', fontWeight: 'bold' }}
                    >
                        Host a Match
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {filteredMatches.map((match) => (
                        <MatchCard
                            key={match._id || match.id}
                            match={match}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
