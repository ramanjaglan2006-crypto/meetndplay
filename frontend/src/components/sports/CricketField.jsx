import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlayerNodeImage = ({ user, isTeamA }) => {
    const [imgError, setImgError] = useState(false);
    const photoUrl = user?.photos?.[0]?.url || user?.photos?.[0];

    const getInitials = (name = '') => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return (name[0] || 'P').toUpperCase();
    };

    return (
        <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: `3px solid ${isTeamA ? '#38bdf8' : '#f43f5e'}`,
            boxShadow: '0 8px 18px rgba(0,0,0,0.5)',
            background: '#0f172a',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '900',
            fontSize: '1.05rem'
        }}>
            {!imgError && photoUrl ? (
                <img
                    src={photoUrl}
                    alt={user?.name}
                    onError={() => setImgError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : (
                <span>{getInitials(user?.name)}</span>
            )}
        </div>
    );
};

// Calculate realistic vertical top-down cricket ground coordinates for Team A (TOP) and Team B (BOTTOM)
const getCricketCoordinates = (roleStr = '', team = 'A', roleIndex = 0) => {
    const isTeamA = team === 'A';
    const role = roleStr.toLowerCase();

    if (role.includes('keeper') || role.includes('wk')) {
        // Wicketkeeper: Directly behind their team's wicket
        return isTeamA ? { x: 50, y: 12 } : { x: 50, y: 88 };
    }

    if (role.includes('bat')) {
        // Batsmen: Natural placement near the team's crease
        const batOffsetsA = [{ x: 38, y: 22 }, { x: 62, y: 22 }, { x: 50, y: 26 }];
        const batOffsetsB = [{ x: 38, y: 78 }, { x: 62, y: 78 }, { x: 50, y: 74 }];
        const list = isTeamA ? batOffsetsA : batOffsetsB;
        return list[roleIndex % list.length];
    }

    if (role.includes('all') || role.includes('round')) {
        // All-rounders: Central / Middle region of the continuous field
        const allOffsetsA = [{ x: 26, y: 46 }, { x: 74, y: 46 }, { x: 32, y: 42 }];
        const allOffsetsB = [{ x: 26, y: 54 }, { x: 74, y: 54 }, { x: 68, y: 58 }];
        const list = isTeamA ? allOffsetsA : allOffsetsB;
        return list[roleIndex % list.length];
    }

    // Default: Bowlers (Distributed naturally around fielding area)
    const bowlOffsetsA = [{ x: 22, y: 34 }, { x: 78, y: 34 }, { x: 32, y: 38 }, { x: 68, y: 38 }];
    const bowlOffsetsB = [{ x: 22, y: 66 }, { x: 78, y: 66 }, { x: 32, y: 62 }, { x: 68, y: 62 }];
    const list = isTeamA ? bowlOffsetsA : bowlOffsetsB;
    return list[roleIndex % list.length];
};

const CricketField = ({
    participants = [],
    onSelectPlayer,
    onSelectEmptySlot
}) => {
    const navigate = useNavigate();
    const [hoveredParticipant, setHoveredParticipant] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const teamAParticipants = participants.filter(p => p.team === 'A');
    const teamBParticipants = participants.filter(p => p.team === 'B');

    // Default 12 Cricket slots (6 Team A, 6 Team B)
    const DEFAULT_SLOTS = [
        { id: 'a-bat-1', team: 'A', role: 'Batsman', roleIndex: 0 },
        { id: 'a-bat-2', team: 'A', role: 'Batsman', roleIndex: 1 },
        { id: 'a-wk-1', team: 'A', role: 'Wicketkeeper', roleIndex: 0 },
        { id: 'a-all-1', team: 'A', role: 'All-Rounder', roleIndex: 0 },
        { id: 'a-bowl-1', team: 'A', role: 'Bowler', roleIndex: 0 },
        { id: 'a-bowl-2', team: 'A', role: 'Bowler', roleIndex: 1 },

        { id: 'b-bat-1', team: 'B', role: 'Batsman', roleIndex: 0 },
        { id: 'b-bat-2', team: 'B', role: 'Batsman', roleIndex: 1 },
        { id: 'b-wk-1', team: 'B', role: 'Wicketkeeper', roleIndex: 0 },
        { id: 'b-all-1', team: 'B', role: 'All-Rounder', roleIndex: 0 },
        { id: 'b-bowl-1', team: 'B', role: 'Bowler', roleIndex: 0 },
        { id: 'b-bowl-2', team: 'B', role: 'Bowler', roleIndex: 1 }
    ];

    const getSlotParticipant = (slotConfig) => {
        const teamList = slotConfig.team === 'A' ? teamAParticipants : teamBParticipants;
        const sameRole = teamList.filter(p => (p.position || p.role || '').toLowerCase().includes(slotConfig.role.toLowerCase()));
        
        if (sameRole[slotConfig.roleIndex]) return sameRole[slotConfig.roleIndex];
        if (teamList[slotConfig.roleIndex]) return teamList[slotConfig.roleIndex];

        return null;
    };

    const handleMouseEnter = (e, participant) => {
        setHoveredParticipant(participant);
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 12 });
    };

    const getRoleAbbr = (role = '') => {
        const r = role.toLowerCase();
        if (r.includes('keeper') || r.includes('wk')) return 'WK';
        if (r.includes('bat')) return 'BAT';
        if (r.includes('all') || r.includes('round')) return 'ALL';
        if (r.includes('bowl')) return 'BOWL';
        return 'PLY';
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '0.9 / 1', // Vertical Top-Down Cricket Ground
            background: 'radial-gradient(ellipse at center, #15803d 0%, #166534 60%, #14532d 100%)',
            borderRadius: '24px',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 20px 48px rgba(0,0,0,0.45)',
            overflow: 'hidden',
            userSelect: 'none'
        }}>
            {/* Turf Grass Pattern */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'repeating-radial-gradient(circle at center, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 30px, transparent 30px, transparent 60px)',
                pointerEvents: 'none'
            }} />

            {/* Boundary Rope (Dashed White Oval) */}
            <div style={{
                position: 'absolute',
                inset: '16px',
                border: '2.5px dashed rgba(255,255,255,0.7)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />

            {/* 30-Yard Circle (Inner Fielding Ellipse) */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '68%',
                height: '62%',
                border: '1.5px solid rgba(255,255,255,0.35)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
            }} />

            {/* Central 22-Yard Vertical Pitch Strip */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '68px',
                height: '52%',
                background: 'linear-gradient(180deg, #c2410c 0%, #d97706 50%, #c2410c 100%)',
                border: '2px solid rgba(255,255,255,0.8)',
                borderRadius: '4px',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                boxShadow: '0 0 16px rgba(0,0,0,0.4)',
                zIndex: 2
            }}>
                {/* Top Wicket & Popping Crease */}
                <div style={{ position: 'absolute', top: '12%', left: '10%', right: '10%', height: '2px', background: '#fff' }} />
                <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', width: '26px', height: '4px', background: '#fef08a', border: '1px solid #78350f', borderRadius: '1px' }} />

                {/* Bottom Wicket & Popping Crease */}
                <div style={{ position: 'absolute', bottom: '12%', left: '10%', right: '10%', height: '2px', background: '#fff' }} />
                <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', width: '26px', height: '4px', background: '#fef08a', border: '1px solid #78350f', borderRadius: '1px' }} />

                {/* Pitch Label */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: '0.62rem', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    22 YARDS
                </div>
            </div>

            {/* Subtle Team End Identifiers */}
            <div style={{ position: 'absolute', top: '24px', left: '24px', background: 'rgba(56, 189, 248, 0.25)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '2px 10px', borderRadius: '10px', fontWeight: '900', fontSize: '0.75rem', letterSpacing: '1px' }}>
                TEAM A (TOP END)
            </div>
            <div style={{ position: 'absolute', bottom: '24px', right: '24px', background: 'rgba(244, 63, 94, 0.25)', border: '1px solid #f43f5e', color: '#f43f5e', padding: '2px 10px', borderRadius: '10px', fontWeight: '900', fontSize: '0.75rem', letterSpacing: '1px' }}>
                TEAM B (BOTTOM END)
            </div>

            {/* Render Cricket Player Nodes according to role and team placement */}
            {DEFAULT_SLOTS.map((slotConfig) => {
                const participant = getSlotParticipant(slotConfig);
                const isTeamA = slotConfig.team === 'A';
                const coords = getCricketCoordinates(participant?.position || participant?.role || slotConfig.role, slotConfig.team, slotConfig.roleIndex);
                const userId = participant?.user?._id || participant?.user?.id;
                const roleAbbr = getRoleAbbr(participant?.position || participant?.role || slotConfig.role);

                return (
                    <div
                        key={slotConfig.id}
                        style={{
                            position: 'absolute',
                            left: `${coords.x}%`,
                            top: `${coords.y}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10
                        }}
                    >
                        {participant ? (
                            <button
                                type="button"
                                onClick={() => {
                                    if (userId) navigate(`/athlete/${userId}`);
                                    else if (onSelectPlayer) onSelectPlayer(participant);
                                }}
                                onMouseEnter={(e) => handleMouseEnter(e, participant)}
                                onMouseLeave={() => setHoveredParticipant(null)}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                <PlayerNodeImage user={participant.user} isTeamA={isTeamA} />
                                
                                <div style={{
                                    marginTop: '4px',
                                    background: 'rgba(15, 23, 42, 0.95)',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    border: `1px solid ${isTeamA ? 'rgba(56, 189, 248, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 'bold' }}>
                                        {participant.user?.name?.split(' ')[0]}
                                    </span>
                                    <span style={{ color: isTeamA ? '#38bdf8' : '#f43f5e', fontSize: '0.72rem', fontWeight: '900' }}>
                                        • {roleAbbr}
                                    </span>
                                </div>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onSelectEmptySlot && onSelectEmptySlot(slotConfig)}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    border: '2px dashed rgba(255,255,255,0.6)',
                                    background: 'rgba(0,0,0,0.35)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff'
                                }}>
                                    <Plus size={18} />
                                </div>
                                <div style={{ marginTop: '3px', background: 'rgba(0,0,0,0.65)', color: 'rgba(255,255,255,0.9)', padding: '1px 6px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700' }}>
                                    {getRoleAbbr(slotConfig.role)}
                                </div>
                            </button>
                        )}
                    </div>
                );
            })}

            {/* Desktop Hover Tooltip */}
            {hoveredParticipant && (
                <div style={{
                    position: 'fixed',
                    left: `${tooltipPos.x}px`,
                    top: `${tooltipPos.y}px`,
                    transform: 'translate(-50%, -100%)',
                    background: 'rgba(15, 23, 42, 0.95)',
                    color: '#fff',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    pointerEvents: 'none',
                    zIndex: 100,
                    whiteSpace: 'nowrap'
                }}>
                    <div>{hoveredParticipant.user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary, #38bdf8)', fontWeight: 'normal', marginTop: '2px' }}>
                        Cricket · {hoveredParticipant.position || 'Player'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CricketField;
