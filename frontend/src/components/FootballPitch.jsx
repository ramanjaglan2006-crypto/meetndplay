import React, { useState } from 'react';
import { MATCH_FORMATS, POSITION_ABBREVIATIONS } from '../config/matchFormats';
import { Plus } from 'lucide-react';

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
        setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1.35 / 1',
            maxHeight: '520px',
            background: 'linear-gradient(180deg, #14532d 0%, #15803d 50%, #14532d 100%)',
            borderRadius: '16px',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            userSelect: 'none'
        }}>
            {/* Field Turf Texture */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 20px, transparent 20px, transparent 40px)',
                pointerEvents: 'none'
            }} />

            {/* Field Boundary Lines */}
            <div style={{ position: 'absolute', inset: '10px', border: '1.5px solid rgba(255,255,255,0.6)', borderRadius: '2px', pointerEvents: 'none' }} />

            {/* Halfway Line */}
            <div style={{ position: 'absolute', top: '50%', left: '10px', right: '10px', height: '1.5px', background: 'rgba(255,255,255,0.6)', transform: 'translateY(-50%)', pointerEvents: 'none' }} />

            {/* Center Circle */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '80px',
                height: '80px',
                border: '1.5px solid rgba(255,255,255,0.6)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
            }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '6px', height: '6px', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />

            {/* Goal Area Top (Team B) */}
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '50%',
                width: '40%',
                height: '20%',
                border: '1.5px solid rgba(255,255,255,0.6)',
                borderTop: 'none',
                transform: 'translateX(-50%)',
                pointerEvents: 'none'
            }} />

            {/* Goal Area Bottom (Team A) */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                width: '40%',
                height: '20%',
                border: '1.5px solid rgba(255,255,255,0.6)',
                borderBottom: 'none',
                transform: 'translateX(-50%)',
                pointerEvents: 'none'
            }} />

            {/* Team Watermark Labels */}
            <div style={{ position: 'absolute', top: '14px', right: '16px', color: 'rgba(255,255,255,0.3)', fontWeight: '900', fontSize: '0.7rem', letterSpacing: '1.5px' }}>TEAM B</div>
            <div style={{ position: 'absolute', bottom: '14px', right: '16px', color: 'rgba(255,255,255,0.3)', fontWeight: '900', fontSize: '0.7rem', letterSpacing: '1.5px' }}>TEAM A</div>

            {/* Render 10 Compact Player Slots */}
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
                            /* Compact Player Node */
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
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    border: `2px solid ${isTeamA ? '#38bdf8' : '#f43f5e'}`,
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                                    background: '#0f172a',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        src={participant.user?.photos?.[0]?.url || participant.user?.photos?.[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                                        alt={participant.user?.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{
                                    marginTop: '2px',
                                    color: '#fff',
                                    fontSize: '0.68rem',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                                }}>
                                    <span>{participant.user?.name?.split(' ')[0]}</span>
                                    <span style={{ color: isTeamA ? '#38bdf8' : '#f43f5e', fontSize: '0.62rem' }}>{posAbbr}</span>
                                </div>
                            </button>
                        ) : (
                            /* Compact Empty Slot Node */
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
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    border: '1.5px dashed rgba(255,255,255,0.5)',
                                    background: 'rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff'
                                }}>
                                    <Plus size={14} />
                                </div>
                                <div style={{
                                    marginTop: '2px',
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: '0.62rem',
                                    fontWeight: '600',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
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
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    pointerEvents: 'none',
                    zIndex: 100,
                    whiteSpace: 'nowrap'
                }}>
                    <div>{hoveredParticipant.user?.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--primary, #38bdf8)', fontWeight: 'normal' }}>
                        {hoveredParticipant.position} · Level {hoveredParticipant.user?.skill_level || 3}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FootballPitch;
