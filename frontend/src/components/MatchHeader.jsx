import React from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MatchHeader = ({ match, capacity, isJoined, isOrganizer, onOpenJoin, onLeave }) => {
    const navigate = useNavigate();

    const matchDate = new Date(match.dateTime);
    const dateFormatted = matchDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    const timeFormatted = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let statusText = 'OPEN';
    let statusColor = '#34d399';
    let statusBg = 'rgba(16, 185, 129, 0.12)';

    if (match.status === 'full') {
        statusText = 'FULL';
        statusColor = '#f87171';
        statusBg = 'rgba(239, 68, 68, 0.12)';
    } else if (match.status === 'live') {
        statusText = 'LIVE';
        statusColor = '#fbbf24';
        statusBg = 'rgba(245, 158, 11, 0.12)';
    } else if (match.status === 'completed') {
        statusText = 'COMPLETED';
        statusColor = '#94a3b8';
        statusBg = 'rgba(148, 163, 184, 0.12)';
    }

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            {/* Top Navigation Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted, #aaa)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    <ArrowLeft size={16} /> Back to Matches
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        background: statusBg,
                        color: statusColor,
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        letterSpacing: '0.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        ● {statusText}
                    </span>
                </div>
            </div>

            {/* Compact Header Bar */}
            <div style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1.2rem 1.5rem',
                borderRadius: '16px',
                background: 'var(--card-bg, #1a1a1a)',
                border: '1px solid var(--border-color, #2d2d2d)'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main, #fff)' }}>
                            {match.sport} · {match.format || '5-a-side'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.85rem', color: 'var(--text-muted, #aaa)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} color="var(--primary, #38bdf8)" /> {match.locationName}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} color="var(--primary, #38bdf8)" /> {dateFormatted} · {timeFormatted}
                        </span>
                    </div>
                </div>

                {/* Primary CTA & Player Count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--primary, #38bdf8)' }}>
                            {capacity.joined} / {capacity.total} Players
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #aaa)' }}>
                            {capacity.remaining > 0 ? `${capacity.remaining} spots left` : 'Match Full'}
                        </div>
                    </div>

                    {!isJoined ? (
                        <button
                            onClick={onOpenJoin}
                            disabled={capacity.remaining <= 0}
                            style={{
                                padding: '10px 22px',
                                borderRadius: '10px',
                                background: capacity.remaining > 0 ? 'var(--primary, #38bdf8)' : 'rgba(255,255,255,0.08)',
                                color: capacity.remaining > 0 ? '#000' : '#666',
                                border: 'none',
                                fontWeight: '800',
                                fontSize: '0.9rem',
                                cursor: capacity.remaining > 0 ? 'pointer' : 'not-allowed'
                            }}
                        >
                            {capacity.remaining > 0 ? 'Join Match' : 'Match Full'}
                        </button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '8px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                <CheckCircle2 size={16} /> Joined
                            </span>
                            <button
                                onClick={onLeave}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '10px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#f87171',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    fontWeight: '600',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Leave
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchHeader;
