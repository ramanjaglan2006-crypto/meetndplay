import React, { useState, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMatches } from '../hooks/queries/useMatches';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { SEED_MATCHES } from '../config/seedMatches';

import ProductNavigation from '../components/home/ProductNavigation';
import HomeHero from '../components/home/HomeHero';
import SportSelector from '../components/home/SportSelector';
import QuickActions from '../components/home/QuickActions';
import PickedForYou from '../components/home/PickedForYou';
import ActiveMatchesFeed from '../components/home/UpcomingGames';
import ConnectAthletes from '../components/home/ConnectAthletes';
import BookVenues from '../components/home/BookVenues';
import SportsCommunities from '../components/home/SportsCommunities';
import MatchCard from '../components/MatchCard';

import { MapPin, Filter, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { socket } = useSocket();
    const { user } = useAuth();
    const currentUserId = user?.id || user?._id || 'u1';
    const currentUserName = user?.name || 'Player';

    // Navigation & Scroll state
    const [activeNavTab, setActiveNavTab] = useState('PLAY');
    const [selectedSport, setSelectedSport] = useState('All');
    const [sortBy, setSortBy] = useState('Soonest'); // 'Soonest', 'Closest', 'Most Players', 'Spots Remaining'

    const activeMatchesRef = useRef(null);
    const bookVenuesRef = useRef(null);
    const connectAthletesRef = useRef(null);

    // Fetch API Matches
    const { data: apiMatches = [], isLoading: matchesLoading } = useMatches();

    // Merge API matches with seed dataset (16 matches total)
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

    // Handle Top Product Navigation click
    const handleTabChange = (tab) => {
        setActiveNavTab(tab);
        if (tab === 'PLAY') {
            activeMatchesRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else if (tab === 'BOOK') {
            bookVenuesRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else if (tab === 'CONNECT') {
            connectAthletesRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Filter & Sort matches
    const displayedMatches = useMemo(() => {
        let list = [...allMatches];

        // Sport Filter
        if (selectedSport !== 'All') {
            list = list.filter(m => (m.sport || '').toLowerCase() === selectedSport.toLowerCase());
        }

        // Sorting
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
    }, [allMatches, selectedSport, sortBy]);

    // Recommended matches (Picked For You)
    const pickedMatches = useMemo(() => {
        return allMatches.filter(m => (m.joinedPlayers?.length || 0) >= Math.floor((m.totalPlayers || 10) * 0.6)).slice(0, 3);
    }, [allMatches]);

    // User's joined matches
    const upcomingUserMatches = useMemo(() => {
        return allMatches.filter(m => (m.joinedPlayers || []).some(id => (id._id || id) === currentUserId));
    }, [allMatches, currentUserId]);

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem' }}>
            
            {/* Top Product Navigation: PLAY | BOOK | CONNECT */}
            <ProductNavigation activeTab={activeNavTab} onTabChange={handleTabChange} />

            {/* Homepage Hero */}
            <HomeHero
                onPlayNow={() => activeMatchesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                onExploreAthletes={() => navigate('/discover')}
            />

            {/* Quick Action Buttons */}
            <QuickActions onFindMatch={() => activeMatchesRef.current?.scrollIntoView({ behavior: 'smooth' })} />

            {/* Picked For You (Recommendations) */}
            <PickedForYou matches={pickedMatches} currentUserId={currentUserId} />

            {/* MAIN SECTION: Active Matches Marketplace */}
            <section ref={activeMatchesRef} style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main, #fff)', margin: '0 0 4px 0' }}>
                            ACTIVE MATCHES
                        </h2>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #aaa)', margin: 0 }}>
                            Games happening soon. Find your spot.
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        {/* Location Indicator */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted, #aaa)', background: 'var(--card-bg, #1a1a1a)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-color, #2d2d2d)' }}>
                            <MapPin size={14} color="var(--primary, #38bdf8)" /> Near You: <span style={{ color: 'var(--text-main, #fff)', fontWeight: 'bold' }}>Bhopal</span>
                        </div>

                        {/* Sort Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ArrowUpDown size={14} color="var(--text-muted, #aaa)" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    background: 'var(--card-bg, #1a1a1a)',
                                    color: 'var(--text-main, #fff)',
                                    border: '1px solid var(--border-color, #2d2d2d)',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="Soonest">Soonest</option>
                                <option value="Closest">Closest</option>
                                <option value="Most Players">Most Players</option>
                                <option value="Spots Remaining">Spots Remaining</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Sport Selector Filter Bar */}
                <SportSelector selectedSport={selectedSport} onSelectSport={(sport) => setSelectedSport(sport)} />

                {/* 3-Column Desktop Grid for Active Matches */}
                {displayedMatches.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--card-bg, #1a1a1a)', borderRadius: '16px', border: '1px solid var(--border-color, #2d2d2d)' }}>
                        <p style={{ color: 'var(--text-muted, #aaa)', margin: '0 0 1rem 0' }}>No {selectedSport} matches found nearby.</p>
                        <button
                            onClick={() => navigate('/create')}
                            style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--primary, #38bdf8)', color: '#000', border: 'none', fontWeight: 'bold' }}
                        >
                            Host a {selectedSport} Match
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                        {displayedMatches.map((match) => (
                            <MatchCard
                                key={match._id || match.id}
                                match={match}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Upcoming Games Section */}
            {upcomingUserMatches.length > 0 && (
                <ActiveMatchesFeed matches={allMatches} currentUserId={currentUserId} onFindMatch={() => activeMatchesRef.current?.scrollIntoView({ behavior: 'smooth' })} />
            )}

            {/* CONNECT Section: Athlete Discovery */}
            <div ref={connectAthletesRef}>
                <ConnectAthletes />
            </div>

            {/* BOOK Section: Venue Booking Preview */}
            <div ref={bookVenuesRef}>
                <BookVenues />
            </div>

            {/* Sports Communities Discovery */}
            <SportsCommunities />

        </div>
    );
};

export default Dashboard;
