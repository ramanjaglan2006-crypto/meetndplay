import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const SPORT_ICONS = {
    'Football': '⚽',
    'Cricket': '🏏',
    'Tennis': '🎾',
    'Badminton': '🏸',
    'Pickleball': '🥒',
    'Basketball': '🏀',
    'Volleyball': '🏐'
};

const MatchCard = ({ match, currentUserId }) => {
    const navigate = useNavigate();

    const joinedPlayersList = match.joinedPlayers || [];
    const [isJoined, setIsJoined] = useState(joinedPlayersList.some(p => (p._id || p) === currentUserId));
    const [joinedCount, setJoinedCount] = useState(joinedPlayersList.length);

    useEffect(() => {
        setIsJoined(joinedPlayersList.some(p => (p._id || p) === currentUserId));
        setJoinedCount(joinedPlayersList.length);
    }, [joinedPlayersList, currentUserId]);

    const totalPlayers = match.totalPlayers || 10;
    const slotsLeft = Math.max(0, totalPlayers - joinedCount);
    const occupancyPercent = Math.min(100, Math.round((joinedCount / totalPlayers) * 100));

    // Dynamic Status Calculation
    let statusLabel = 'Open';
    let statusColor = '#34d399';
    let statusBg = 'rgba(16, 185, 129, 0.15)';

    if (joinedCount >= totalPlayers) {
        statusLabel = 'Full';
        statusColor = '#f87171';
        statusBg = 'rgba(239, 68, 68, 0.15)';
    } else if (occupancyPercent >= 85) {
        statusLabel = 'Almost Full';
        statusColor = '#f43f5e';
        statusBg = 'rgba(244, 63, 94, 0.15)';
    } else if (occupancyPercent >= 70) {
        statusLabel = '🔥 Filling Fast';
        statusColor = '#fbbf24';
        statusBg = 'rgba(245, 158, 11, 0.15)';
    }

    const sportIcon = SPORT_ICONS[match.sport] || '⚽';
    const matchDate = new Date(match.dateTime || Date.now());
    const dateFormatted = matchDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    const timeFormatted = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const handleCardClick = (e) => {
        if (e.target.closest('button')) return;
        navigate(`/matches/${match._id || match.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleCardClick}
            style={{
                background: 'var(--card-bg, #1a1a1a)',
                border: '1px solid var(--border-color, #2d2d2d)',
                borderRadius: '16px',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, boxShadow 0.2s',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
            }}
            whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
        >
            {/* Top Row: Sport Icon & Status Badge */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.4rem' }}>{sportIcon}</span>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main, #fff)' }}>
                                {match.sport}
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #aaa)' }}>
                                {match.format || '5-a-side'}
                            </span>
                        </div>
                    </div>

                    <span style={{
                        background: statusBg,
                        color: statusColor,
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        letterSpacing: '0.3px'
                    }}>
                        {statusLabel}
                    </span>
                </div>

                {/* Location & Time */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem', color: 'var(--text-muted, #aaa)', margin: '10px 0 14px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="var(--primary, #38bdf8)" />
                        <span style={{ color: 'var(--text-main, #eee)', fontWeight: '600' }}>{match.locationName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={13} color="var(--primary, #38bdf8)" /> {dateFormatted}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} color="var(--primary, #38bdf8)" /> {timeFormatted}
                        </span>
                    </div>
                </div>

                {/* Visual Occupancy Progress Bar */}
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', fontWeight: '600' }}>
                        <span style={{ color: 'var(--text-main, #fff)' }}>
                            {joinedCount} / {totalPlayers} Joined
                        </span>
                        <span style={{ color: slotsLeft > 0 ? 'var(--primary, #38bdf8)' : '#f87171' }}>
                            {slotsLeft > 0 ? `${slotsLeft} spots left` : 'Full'}
                        </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${occupancyPercent}%`,
                            height: '100%',
                            background: occupancyPercent >= 85 ? '#f43f5e' : 'var(--primary, #38bdf8)',
                            borderRadius: '3px',
                            transition: 'width 0.3s'
                        }} />
                    </div>
                </div>
            </div>

            {/* Bottom Row: Participant Avatar Stack & Action Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Participant Avatars */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {(match.participantAvatars || []).slice(0, 3).map((url, i) => (
                        <img
                            key={i}
                            src={url}
                            alt="player"
                            style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                border: '2px solid var(--card-bg, #1a1a1a)',
                                marginLeft: i === 0 ? 0 : '-8px',
                                objectFit: 'cover'
                            }}
                        />
                    ))}
                    {joinedCount > 3 && (
                        <span style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-muted, #aaa)',
                            marginLeft: '6px',
                            fontWeight: 'bold'
                        }}>
                            +{joinedCount - 3}
                        </span>
                    )}
                </div>

                {/* Primary CTA */}
                <button
                    type="button"
                    onClick={() => navigate(`/matches/${match._id || match.id}`)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '7px 16px',
                        borderRadius: '20px',
                        background: isJoined ? 'rgba(16, 185, 129, 0.15)' : (slotsLeft === 0 ? 'rgba(255,255,255,0.06)' : 'var(--primary, #38bdf8)'),
                        color: isJoined ? '#34d399' : (slotsLeft === 0 ? '#aaa' : '#000'),
                        border: 'none',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                    }}
                >
                    {isJoined ? 'Enter Match' : (slotsLeft === 0 ? 'View Match' : 'Join Match')}
                    <ArrowRight size={13} />
                </button>
            </div>
        </motion.div>
    );
};

export default MatchCard;
