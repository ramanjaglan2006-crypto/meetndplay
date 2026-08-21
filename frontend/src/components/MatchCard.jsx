import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
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
    let statusLabel = 'OPEN';
    let statusColor = '#20A66A';
    let statusBg = '#E5F7EE';

    if (joinedCount >= totalPlayers) {
        statusLabel = 'FULL';
        statusColor = '#E65A5A';
        statusBg = '#FDECEC';
    } else if (occupancyPercent >= 85) {
        statusLabel = 'ALMOST FULL';
        statusColor = '#E65A5A';
        statusBg = '#FDECEC';
    } else if (occupancyPercent >= 70) {
        statusLabel = 'FILLING FAST';
        statusColor = '#E5A900';
        statusBg = '#FFF3C7';
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
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleCardClick}
            style={{
                background: 'var(--card-bg, #ffffff)',
                border: '1px solid var(--border-color, #E3E6E2)',
                borderRadius: '16px',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'transform 0.2s, boxShadow 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
            whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}
        >
            {/* Top Row: Sport Icon & Status Badge */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.4rem' }}>{sportIcon}</span>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main, #171817)' }}>
                                {match.sport}
                            </h3>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted, #626762)', fontWeight: '500' }}>
                                {match.format || '5-a-side'}
                            </span>
                        </div>
                    </div>

                    <span style={{
                        background: statusBg,
                        color: statusColor,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        letterSpacing: '0.4px'
                    }}>
                        {statusLabel}
                    </span>
                </div>

                {/* Location & Time */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.85rem', color: 'var(--text-muted, #626762)', margin: '12px 0 14px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main, #171817)', fontWeight: '600' }}>
                        <MapPin size={15} color="var(--primary-dark, #E5A900)" />
                        <span>{match.locationName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} color="var(--text-muted, #626762)" /> {dateFormatted}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} color="var(--text-muted, #626762)" /> {timeFormatted}
                        </span>
                    </div>
                </div>

                {/* Visual Occupancy Progress Bar */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px', fontWeight: '600' }}>
                        <span style={{ color: 'var(--text-main, #171817)' }}>
                            {joinedCount} / {totalPlayers} joined
                        </span>
                        <span style={{ color: slotsLeft > 0 ? 'var(--secondary, #20A66A)' : 'var(--danger, #E65A5A)' }}>
                            {slotsLeft > 0 ? `${slotsLeft} spots left` : 'Full'}
                        </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-dark, #F6F7F5)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${occupancyPercent}%`,
                            height: '100%',
                            background: occupancyPercent >= 85 ? 'var(--danger, #E65A5A)' : 'var(--secondary, #20A66A)',
                            borderRadius: '3px',
                            transition: 'width 0.3s'
                        }} />
                    </div>
                </div>
            </div>

            {/* Bottom Row: Participant Avatar Stack & Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color, #E3E6E2)' }}>
                {/* Participant Avatars */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {(match.participantAvatars || []).slice(0, 3).map((url, i) => (
                        <img
                            key={i}
                            src={url}
                            alt="player"
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                border: '2px solid var(--card-bg, #ffffff)',
                                marginLeft: i === 0 ? 0 : '-8px',
                                objectFit: 'cover'
                            }}
                        />
                    ))}
                    {joinedCount > 3 && (
                        <span style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-muted, #626762)',
                            marginLeft: '6px',
                            fontWeight: 'bold'
                        }}>
                            +{joinedCount - 3}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        type="button"
                        onClick={() => navigate(`/matches/${match._id || match.id}`)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '10px',
                            background: 'var(--bg-dark, #F6F7F5)',
                            color: 'var(--text-main, #171817)',
                            border: '1px solid var(--border-color, #E3E6E2)',
                            fontWeight: 'bold',
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                        }}
                    >
                        View Match
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(`/matches/${match._id || match.id}`)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 14px',
                            borderRadius: '10px',
                            background: isJoined ? 'var(--success-soft, #E5F7EE)' : (slotsLeft === 0 ? 'var(--bg-dark, #F6F7F5)' : 'var(--primary, #F5B91E)'),
                            color: isJoined ? 'var(--success, #20A66A)' : (slotsLeft === 0 ? 'var(--text-muted, #626762)' : '#000000'),
                            border: 'none',
                            fontWeight: '800',
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                        }}
                    >
                        {isJoined ? 'Joined ✓' : (slotsLeft === 0 ? 'Full' : 'Join Match')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MatchCard;
