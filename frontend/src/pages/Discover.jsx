import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDiscoverUsers, postSwipe, sendConnectionRequest, getUserProfile, getMatches, joinMatch } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, X, MapPin, UserPlus, Search, Users, Calendar, Fingerprint, Crosshair, Filter, Navigation, RefreshCw } from 'lucide-react';
import MatchCard from '../components/MatchCard';
import { useAuth } from '../context/AuthContext';

import AISynergyBadge from '../components/AISynergyBadge';

export default function Discover() {
    const { user } = useAuth();
    const currentUserId = user?.id || 'u1';
    const navigate = useNavigate();
    
    // Core state
    const [activeTab, setActiveTab] = useState('players'); // 'players', 'matches', 'search'
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(false);
    const [manualCity, setManualCity] = useState('');
    
    // Players Tab State
    const [players, setPlayers] = useState([]);
    const [page, setPage] = useState(1);
    
    // Filters State
    const [showFilters, setShowFilters] = useState(false);
    const [sportFilter, setSportFilter] = useState('All');
    const [skillFilter, setSkillFilter] = useState('All');
    
    // Search Tab State
    const [searchId, setSearchId] = useState('');
    const [searchType, setSearchType] = useState('player'); // 'player', 'match'
    const [searchResult, setSearchResult] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');

    // Matches Tab State
    const [activeMatches, setActiveMatches] = useState([]);

    // Players Query
    const { data: rawPlayers = [], isLoading: loadingPlayers, refetch: refetchPlayers } = useQuery({
        queryKey: ['discoverPlayers', currentUserId, location?.lat, location?.lon, page],
        queryFn: async () => {
            if (!location) return []; // Wait for location
            const res = await getDiscoverUsers(currentUserId, location.lat, location.lon, page);
            return res.data;
        },
        enabled: activeTab === 'players' && !!location
    });

    // Matches Query
    const { data: rawMatches = [], isLoading: loadingMatches, refetch: refetchMatches } = useQuery({
        queryKey: ['activeMatches'],
        queryFn: async () => {
            const res = await getMatches();
            return res.data;
        },
        enabled: activeTab === 'matches'
    });

    useEffect(() => {
        if (rawPlayers.length > 0) {
            setPlayers(prev => {
                if (page === 1) return rawPlayers;
                const existing = new Set(prev.map(p => p.id));
                const newIds = rawPlayers.filter(p => !existing.has(p.id));
                return [...prev, ...newIds];
            });
        }
    }, [rawPlayers, page]);

    useEffect(() => {
        if (rawMatches.length > 0) {
            setActiveMatches(rawMatches.filter(m => m.status === 'open'));
        }
    }, [rawMatches]);

    const loadPlayers = (pageNum = 1, reset = false) => {
        if (reset) {
            setPage(1);
            setPlayers([]);
            setTimeout(() => refetchPlayers(), 0);
        } else {
            setPage(pageNum);
        }
    };

    const loadMatches = () => {
        refetchMatches();
    };

    const handleAction = async (targetUserId, action) => {
        await postSwipe(currentUserId, targetUserId, action);
        setPlayers(prev => prev.filter(p => p.id !== targetUserId));
    };

    const handleConnect = async (targetUserId) => {
        try {
            await sendConnectionRequest(currentUserId, targetUserId);
            alert("Friend request sent!");
        } catch (e) {
            alert("Failed to send request or request already pending.");
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId.trim()) return;
        
        setSearchLoading(true);
        setSearchError('');
        setSearchResult(null);
        
        try {
            if (searchType === 'player') {
                const res = await getUserProfile(searchId);
                setSearchResult({ type: 'player', data: res.data });
            } else {
                // To fetch a single match, we fetch all and find it (since backend lacks GET /matches/:id)
                const res = await getMatches();
                const match = res.data.find(m => m.id === searchId);
                if (!match) throw new Error("Match not found");
                setSearchResult({ type: 'match', data: match });
            }
        } catch (err) {
            setSearchError(searchType === 'player' ? 'Player not found' : 'Match not found');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleJoinMatch = async (matchId) => {
        try {
            await joinMatch(matchId, currentUserId);
            alert("Joined match successfully!");
            loadMatches();
        } catch (e) {
            alert("Could not join match (might be full or you already joined).");
        }
    };

    const applyFilters = () => {
        setShowFilters(false);
    };

    const filteredPlayers = players.filter(p => {
        let match = true;
        if (sportFilter !== 'All') {
            match = match && (p.sports || [p.sport_type]).includes(sportFilter);
        }
        if (skillFilter !== 'All') {
            match = match && p.skill_level === parseInt(skillFilter);
        }
        return match;
    });

    // Restore geolocation effect
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                    setLocationError(false);
                },
                () => {
                    console.warn('GPS denied or failed');
                    setLocationError(true);
                },
                { timeout: 10000 }
            );
        } else {
            setLocationError(true);
        }
    }, []);

    const handleManualLocationSubmit = (e) => {
        e.preventDefault();
        if (manualCity.trim().toLowerCase() === 'new york') {
            setLocation({ lat: 40.7128, lon: -74.0060 });
        } else if (manualCity.trim().toLowerCase() === 'london') {
            setLocation({ lat: 51.5074, lon: -0.1278 });
        } else {
            // Default mock for other cities
            setLocation({ lat: 22.7196, lon: 75.8577 });
        }
        setLocationError(false);
    };

    return (
        <div style={{ padding: '1.5rem', paddingBottom: '90px' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Discovery Dashboard</h1>
            
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--glass)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <button onClick={() => setActiveTab('players')} style={getTabStyle(activeTab === 'players')}><Users size={18} /> Players</button>
                <button onClick={() => setActiveTab('matches')} style={getTabStyle(activeTab === 'matches')}><Calendar size={18} /> Matches</button>
                <button onClick={() => setActiveTab('search')} style={getTabStyle(activeTab === 'search')}><Search size={18} /> Search</button>
            </div>

            {/* LOCATION FALLBACK */}
            {activeTab === 'players' && locationError && !location && (
                <div style={{ background: 'var(--glass)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '1rem' }}><MapPin size={20} /> Location Required</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>We need your location to find players near you. Please enable GPS or enter your city manually.</p>
                    <form onSubmit={handleManualLocationSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                            type="text" 
                            placeholder="Enter your city (e.g. New York)" 
                            value={manualCity}
                            onChange={(e) => setManualCity(e.target.value)}
                            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-main)', outline: 'none' }}
                        />
                        <button type="submit" style={{ background: 'var(--primary)', color: 'black', border: 'none', padding: '0 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Set Location</button>
                    </form>
                </div>
            )}
            
            {/* WAITING FOR LOCATION */}
            {activeTab === 'players' && !locationError && !location && (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                    <MapPin size={32} className="spin" style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                    <p>Detecting your location...</p>
                </div>
            )}

            {/* TAB: PLAYERS */}
            {activeTab === 'players' && location && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h2 style={{ fontSize: '1.2rem' }}>Nearby Players</h2>
                            <button onClick={() => refetchPlayers()} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <RefreshCw size={16} className={loadingPlayers ? "spin" : ""} />
                            </button>
                        </div>
                        <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
                            <Filter size={18} /> Filters
                        </button>
                    </div>

                    {showFilters && (
                        <div style={{ background: 'var(--glass)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ flex: 1, minWidth: '120px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sport</label>
                                <select value={sportFilter} onChange={e => setSportFilter(e.target.value)} style={filterInputStyle}>
                                    <option value="All">All Sports</option>
                                    <option value="Football">Football</option>
                                    <option value="Badminton">Badminton</option>
                                    <option value="Basketball">Basketball</option>
                                    <option value="Tennis">Tennis</option>
                                </select>
                            </div>
                            <div style={{ flex: 1, minWidth: '120px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Skill Level</label>
                                <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)} style={filterInputStyle}>
                                    <option value="All">All Levels</option>
                                    {[1,2,3,4,5].map(lvl => <option key={lvl} value={lvl}>Level {lvl}</option>)}
                                </select>
                            </div>
                            <button onClick={applyFilters} style={{ background: 'var(--primary)', color: 'black', border: 'none', padding: '0 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', height: '42px', alignSelf: 'flex-end' }}>Apply</button>
                        </div>
                    )}

                    {filteredPlayers.length > 0 ? (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                                {filteredPlayers.map(p => (
                                    <div key={p.id} style={{ background: 'var(--glass)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ position: 'relative' }}>
                                            <img src={p.photos[0] || 'https://via.placeholder.com/150'} alt={p.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                                            <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Fingerprint size={10} /> ID: {p.id}
                                            </div>
                                        </div>
                                        <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ fontWeight: 'bold' }}>{p.name}, {p.age || 20}</div>
                                                <AISynergyBadge targetUserId={p._id || p.id} compact={true} />
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>Level {p.skill_level} • {p.sports?.[0]?.sport || p.sports?.[0] || p.sport_type}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0 8px' }}>
                                                <MapPin size={12} /> {Math.round(p.distanceKm || 0)}km away
                                            </div>
                                            
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => handleConnect(p.id)} style={actionBtnStyle('var(--primary)', 'black')}><UserPlus size={16} /> Invite</button>
                                                    <button onClick={() => handleAction(p.id, 'right')} style={actionBtnStyle('rgba(16,185,129,0.1)', '#10b981')}><Heart size={16} /> Like</button>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => navigate(`/profile/${p.id}`)} style={{ flex: 1, padding: '6px', borderRadius: '8px', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--glass-border)', cursor: 'pointer', fontSize: '0.8rem' }}>View Profile</button>
                                                    <button onClick={() => handleAction(p.id, 'left')} style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,0,0,0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => loadPlayers(page + 1)} disabled={loadingPlayers} style={{ width: '100%', padding: '1rem', marginTop: '2rem', borderRadius: '12px', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', cursor: loadingPlayers ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                                {loadingPlayers ? 'Scanning...' : 'Load Next Players'}
                            </button>
                        </>
                    ) : (
                        !loadingPlayers && (
                            <div style={{ background: 'var(--glass)', borderRadius: '16px', padding: '2rem', textAlign: 'center', border: '1px solid var(--glass-border)', marginTop: '2rem' }}>
                                <Crosshair size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>No Players Found Nearby</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>We couldn't find anyone matching your exact criteria right now.</p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <button onClick={() => { setSportFilter('All'); setSkillFilter('All'); loadPlayers(1, true); }} style={fallbackBtnStyle('var(--primary)', 'black')}>
                                        Reset Filters & Find Players Nearby
                                    </button>
                                    <button onClick={() => setActiveTab('matches')} style={fallbackBtnStyle('var(--glass)', 'var(--text-main)')}>
                                        Browse Active Matches Instead
                                    </button>
                                    <button onClick={() => setActiveTab('search')} style={fallbackBtnStyle('var(--glass)', 'var(--text-main)')}>
                                        Search by Specific Player ID
                                    </button>
                                    <button onClick={() => { alert('Expanding radius natively supported by backend on next refresh!'); loadPlayers(1, true); }} style={{ ...fallbackBtnStyle('transparent', 'var(--text-main)'), border: '1px dashed var(--text-muted)' }}>
                                        <Navigation size={16} /> Force Expand Search Radius
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </>
            )}

            {/* TAB: MATCHES */}
            {activeTab === 'matches' && (
                <>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Active Matches</h2>
                    {loadingMatches ? <p>Loading matches...</p> : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {activeMatches.map(match => (
                                <MatchCard key={match.id} match={match} currentUserId={currentUserId} />
                            ))}
                            {activeMatches.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem', gridColumn: '1 / -1' }}>No active matches right now.</p>}
                        </div>
                    )}
                </>
            )}

            {/* TAB: SEARCH */}
            {activeTab === 'search' && (
                <div style={{ background: 'var(--glass)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="radio" checked={searchType === 'player'} onChange={() => setSearchType('player')} /> Player ID
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="radio" checked={searchType === 'match'} onChange={() => setSearchType('match')} /> Match ID
                        </label>
                    </div>

                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                        <input 
                            type="text" 
                            placeholder={`Enter ${searchType === 'player' ? 'Player' : 'Match'} ID (e.g. ${searchType === 'player' ? 'u1' : 'm1'})`}
                            value={searchId}
                            onChange={e => setSearchId(e.target.value)}
                            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-main)', outline: 'none' }}
                        />
                        <button type="submit" disabled={searchLoading} style={{ background: 'var(--primary)', color: 'black', border: 'none', padding: '0 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                            {searchLoading ? '...' : 'Search'}
                        </button>
                    </form>

                    {searchError && <p style={{ color: '#ef4444', textAlign: 'center' }}>{searchError}</p>}
                    
                    {searchResult && searchResult.type === 'player' && (
                        <div style={{ border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                            <img src={searchResult.data.photos?.[0]} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />
                            <h3 style={{ marginBottom: '0.25rem' }}>{searchResult.data.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{searchResult.data.sports?.join(', ')} • Level {searchResult.data.skill_level}</p>
                            <button onClick={() => navigate(`/profile/${searchResult.data.id}`)} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>View Full Profile</button>
                        </div>
                    )}

                    {searchResult && searchResult.type === 'match' && (
                        <div style={{ border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
                            <h3>{searchResult.data.sport} Match</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}><MapPin size={12}/> {searchResult.data.location}</p>
                            <button onClick={() => handleJoinMatch(searchResult.data.id)} style={{ background: 'var(--primary)', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '0.5rem' }}>Join Match</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Utility Styles
const getTabStyle = (isActive) => ({
    flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
    background: isActive ? 'var(--primary)' : 'transparent',
    color: isActive ? 'black' : 'var(--text-muted)',
    fontWeight: isActive ? 'bold' : 'normal',
    cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px',
    transition: 'all 0.2s'
});

const filterInputStyle = {
    width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)',
    background: 'rgba(128,128,128,0.1)', color: 'var(--text-main)', outline: 'none', marginTop: '4px'
};

const actionBtnStyle = (bg, color) => ({
    flex: 1, padding: '8px', borderRadius: '8px', background: bg, color: color,
    border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px'
});

const fallbackBtnStyle = (bg, color) => ({
    width: '100%', padding: '12px', borderRadius: '8px', background: bg, color: color,
    border: bg === 'var(--glass)' ? '1px solid var(--glass-border)' : 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
});
