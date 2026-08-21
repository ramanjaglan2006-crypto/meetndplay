import React from 'react';
import { Shield, Zap, User, MapPin, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MatchSummarySidebar = ({
    match,
    organizer,
    participants = [],
    capacity,
    isJoined,
    onOpenJoin,
    onSelectParticipant
}) => {
    const navigate = useNavigate();

    const teamAParticipants = participants.filter(p => p.team === 'A');
    const teamBParticipants = participants.filter(p => p.team === 'B');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Unified Match Summary Container */}
            <div style={{
                background: 'var(--card-bg, #1a1a1a)',
                border: '1px solid var(--border-color, #2d2d2d)',
                borderRadius: '16px',
                padding: '1.25rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color, #2d2d2d)' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main, #fff)', letterSpacing: '0.5px' }}>
                        MATCH SUMMARY
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary, #38bdf8)' }}>
                        {capacity.joined} / {capacity.total} Joined
                    </span>
                </div>

                {/* TEAM A Roster Panel */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <span style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Shield size={14} /> TEAM A
                        </span>
                        <span style={{ color: 'var(--text-muted, #aaa)' }}>{teamAParticipants.length} / 5</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {teamAParticipants.map((p) => (
                            <div
                                key={p.id || p.user?._id || p.user?.id}
                                onClick={() => onSelectParticipant && onSelectParticipant(p)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '6px 10px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '8px',
                                    fontSize: '0.82rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
                                    <span style={{ color: 'var(--text-main, #fff)', fontWeight: '600' }}>{p.user?.name?.split(' ')[0]}</span>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 'bold' }}>
                                    {p.position}
                                </span>
                            </div>
                        ))}
                        {teamAParticipants.length < 5 && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #888)', fontStyle: 'italic', padding: '4px 10px' }}>
                                + {5 - teamAParticipants.length} spots open
                            </div>
                        )}
                    </div>
                </div>

                {/* TEAM B Roster Panel */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <span style={{ color: '#f43f5e', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Zap size={14} /> TEAM B
                        </span>
                        <span style={{ color: 'var(--text-muted, #aaa)' }}>{teamBParticipants.length} / 5</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {teamBParticipants.map((p) => (
                            <div
                                key={p.id || p.user?._id || p.user?.id}
                                onClick={() => onSelectParticipant && onSelectParticipant(p)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '6px 10px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '8px',
                                    fontSize: '0.82rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f43f5e' }} />
                                    <span style={{ color: 'var(--text-main, #fff)', fontWeight: '600' }}>{p.user?.name?.split(' ')[0]}</span>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: '#f43f5e', fontWeight: 'bold' }}>
                                    {p.position}
                                </span>
                            </div>
                        ))}
                        {teamBParticipants.length < 5 && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #888)', fontStyle: 'italic', padding: '4px 10px' }}>
                                + {5 - teamBParticipants.length} spots open
                            </div>
                        )}
                    </div>
                </div>

                {/* Host Section */}
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color, #2d2d2d)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                            src={organizer?.photos?.[0]?.url || organizer?.photos?.[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                            alt={organizer?.name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main, #fff)' }}>{organizer?.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--primary, #38bdf8)' }}>Organizer</div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/profile/${organizer?._id || organizer?.id}`)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted, #aaa)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        View Profile
                    </button>
                </div>
            </div>

            {/* Quick Join Card if not joined */}
            {!isJoined && capacity.remaining > 0 && (
                <button
                    onClick={onOpenJoin}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'var(--primary, #38bdf8)',
                        color: '#000',
                        border: 'none',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                    }}
                >
                    <Plus size={16} /> Choose Position & Join
                </button>
            )}
        </div>
    );
};

export default MatchSummarySidebar;
