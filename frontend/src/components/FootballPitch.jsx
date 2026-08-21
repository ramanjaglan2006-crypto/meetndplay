import React, { useState } from 'react';
import { MATCH_FORMATS, POSITION_ABBREVIATIONS } from '../config/matchFormats';
import { Plus } from 'lucide-react';

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
            border: `2.5px solid ${isTeamA ? '#38bdf8' : '#f43f5e'}`,
            boxShadow: '0 6px 14px rgba(0,0,0,0.5)',
            background: '#0f172a',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '900',
            fontSize: '1rem'
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

const FootballPitch = ({
    format = '5-a-side',
    participants = [],
    onSelectPlayer,
    onSelectEmptySlot
}) => {
    const [hoveredParticipant, setHoveredParticipant] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const formatConfig = MATCH_FORMATS[format] || MATCH_FORMATS['5-a-side'];
    const slots = formatConfig.slots;

    const teamAParticipants = participants.filter(p => p.team === 'A');
    const teamBParticipants = participants.filter(p => p.team === 'B');

    const getSlotData = (slotConfig) => {
        const teamList = slotConfig.team === 'A' ? teamAParticipants : teamBParticipants;
        
        const samePos = teamList.filter(p => (p.position || '').toLowerCase() === slotConfig.position.toLowerCase());
        const slotIdx = slots.filter(s => s.team === slotConfig.team && s.position === slotConfig.position).indexOf(slotConfig);

        if (samePos[slotIdx]) return samePos[slotIdx];
        
        const unassigned = teamList.find(p => !p.__assigned);
        if (unassigned) {
            unassigned.__assigned = true;
            return unassigned;
        }

        return null;
    };

    const handleMouseEnter = (e, participant) => {
        setHoveredParticipant(participant);
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 12 });
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1.45 / 1',
            background: 'linear-gradient(180deg, #14532d 0%, #15803d 50%, #14532d 100%)',
            borderRadius: '18px',
            border: '2px solid rgba(255,255,255,0.25)',
            boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            userSelect: 'none'
        }}>
            {/* Field Turf Pattern */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 24px, transparent 24px, transparent 48px)',
                pointerEvents: 'none'
            }} />

            {/* Field Markings */}
            <div style={{ position: 'absolute', inset: '12px', border: '2px solid rgba(255,255,255,0.65)', borderRadius: '2px', pointerEvents: 'none' }} />

            {/* Halfway Line */}
            <div style={{ position: 'absolute', top: '50%', left: '12px', right: '12px', height: '2px', background: 'rgba(255,255,255,0.65)', transform: 'translateY(-50%)', pointerEvents: 'none' }} />

            {/* Center Circle */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100px',
                height: '100px',
                border: '2px solid rgba(255,255,255,0.65)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
            }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '8px', height: '8px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />

            {/* Goal Area Top (Team B Goal Area) */}
            <div style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                width: '42%',
                height: '22%',
                border: '2px solid rgba(255,255,255,0.65)',
                borderTop: 'none',
                transform: 'translateX(-50%)',
                pointerEvents: 'none'
            }} />

            {/* Goal Area Bottom (Team A Goal Area) */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                width: '42%',
                height: '22%',
                border: '2px solid rgba(255,255,255,0.65)',
                borderBottom: 'none',
                transform: 'translateX(-50%)',
                pointerEvents: 'none'
            }} />

            {/* Subtle Team Watermarks */}
            <div style={{ position: 'absolute', top: '16px', right: '20px', color: 'rgba(255,255,255,0.3)', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '2px' }}>TEAM B</div>
            <div style={{ position: 'absolute', bottom: '16px', right: '20px', color: 'rgba(255,255,255,0.3)', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '2px' }}>TEAM A</div>

            {/* Render 10 Large Player Slots */}
            {slots.map((slotConfig) => {
                const participant = getSlotData(slotConfig);
                const isTeamA = slotConfig.team === 'A';
                const posAbbr = POSITION_ABBREVIATIONS[slotConfig.position] || slotConfig.label || 'PLY';

                return (
                    <div
                        key={slotConfig.id}
                        style={{
                            position: 'absolute',
                            left: `${slotConfig.x}%`,
                            top: `${slotConfig.y}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10
                        }}
                    >
                        {participant ? (
                            /* Large Player Node (52px Avatar + 14px Name + 12px Tag) */
                            <button
                                type="button"
                                onClick={() => onSelectPlayer && onSelectPlayer(participant)}
                                onMouseEnter={(e) => handleMouseEnter(e, participant)}
                                onMouseLeave={() => setHoveredParticipant(null)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                <PlayerNodeImage user={participant.user} isTeamA={isTeamA} />
                                
                                <div style={{
                                    marginTop: '4px',
                                    background: 'rgba(15, 23, 42, 0.9)',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        {participant.user?.name?.split(' ')[0]}
                                    </span>
                                    <span style={{ color: isTeamA ? '#38bdf8' : '#f43f5e', fontSize: '0.75rem', fontWeight: '900' }}>
                                        {posAbbr}
                                    </span>
                                </div>
                            </button>
                        ) : (
                            /* Empty Slot Node */
                            <button
                                type="button"
                                onClick={() => onSelectEmptySlot && onSelectEmptySlot(slotConfig)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    border: '2px dashed rgba(255,255,255,0.6)',
                                    background: 'rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff'
                                }}>
                                    <Plus size={18} />
                                </div>
                                <div style={{
                                    marginTop: '3px',
                                    background: 'rgba(0,0,0,0.6)',
                                    color: 'rgba(255,255,255,0.9)',
                                    padding: '1px 6px',
                                    borderRadius: '8px',
                                    fontSize: '0.72rem',
                                    fontWeight: '700',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {posAbbr}
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
                        {hoveredParticipant.position} · Level {hoveredParticipant.user?.skill_level || 3}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FootballPitch;
