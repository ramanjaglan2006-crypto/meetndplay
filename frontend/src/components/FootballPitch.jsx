import React from 'react';
import { MATCH_FORMATS, POSITION_ABBREVIATIONS } from '../config/matchFormats';
import { Plus } from 'lucide-react';

const FootballPitch = ({
    format = '5-a-side',
    participants = [],
    onSelectPlayer,
    onSelectEmptySlot
}) => {
    const formatConfig = MATCH_FORMATS[format] || MATCH_FORMATS['5-a-side'];
    const slots = formatConfig.slots;

    // Separate participants into Team A and Team B
    const teamAParticipants = participants.filter(p => p.team === 'A');
    const teamBParticipants = participants.filter(p => p.team === 'B');

    // Map participants into defined slot slots
    const getSlotData = (slotConfig) => {
        const teamList = slotConfig.team === 'A' ? teamAParticipants : teamBParticipants;
        
        // Match player by position or fallback by index
        const samePos = teamList.filter(p => (p.position || '').toLowerCase() === slotConfig.position.toLowerCase());
        const slotIdx = slots.filter(s => s.team === slotConfig.team && s.position === slotConfig.position).indexOf(slotConfig);

        if (samePos[slotIdx]) return samePos[slotIdx];
        
        // Unmatched fallback within team
        const assignedSlotIds = slots.filter(s => s.team === slotConfig.team).map(s => s.id);
        const unassigned = teamList.find(p => !p.__assigned);
        if (unassigned) {
            unassigned.__assigned = true;
            return unassigned;
        }

        return null;
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1.4 / 1',
            minHeight: '340px',
            maxHeight: '620px',
            background: 'linear-gradient(180deg, #15803d 0%, #166534 100%)',
            borderRadius: '20px',
            border: '4px solid #f8fafc',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            userSelect: 'none'
        }}>
            {/* Field Stripes / Pattern */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 10%, transparent 10%, transparent 20%)',
                pointerEvents: 'none'
            }} />

            {/* Field Markings */}
            {/* Boundary Line */}
            <div style={{ position: 'absolute', inset: '12px', border: '2px solid rgba(255,255,255,0.7)', borderRadius: '4px', pointerEvents: 'none' }} />

            {/* Halfway Line */}
            <div style={{ position: 'absolute', top: '50%', left: '12px', right: '12px', height: '2px', background: 'rgba(255,255,255,0.7)', transform: 'translateY(-50%)', pointerEvents: 'none' }} />

            {/* Center Circle */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100px',
                height: '100px',
                border: '2px solid rgba(255,255,255,0.7)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
            }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '8px', height: '8px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />

            {/* Penalty Box Top (Team B Goal Area) */}
            <div style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                width: '45%',
                height: '22%',
                border: '2px solid rgba(255,255,255,0.7)',
                borderTop: 'none',
                transform: 'translateX(-50%)',
                pointerEvents: 'none'
            }} />
            {/* Goal Top */}
            <div style={{ position: 'absolute', top: '2px', left: '50%', width: '25%', height: '10px', background: 'rgba(255,255,255,0.3)', border: '2px solid #fff', borderTop: 'none', transform: 'translateX(-50%)', pointerEvents: 'none' }} />

            {/* Penalty Box Bottom (Team A Goal Area) */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                width: '45%',
                height: '22%',
                border: '2px solid rgba(255,255,255,0.7)',
                borderBottom: 'none',
                transform: 'translateX(-50%)',
                pointerEvents: 'none'
            }} />
            {/* Goal Bottom */}
            <div style={{ position: 'absolute', bottom: '2px', left: '50%', width: '25%', height: '10px', background: 'rgba(255,255,255,0.3)', border: '2px solid #fff', borderBottom: 'none', transform: 'translateX(-50%)', pointerEvents: 'none' }} />

            {/* Team Indicators on Pitch */}
            <div style={{ position: 'absolute', top: '18px', left: '20px', color: 'rgba(255,255,255,0.4)', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '2px' }}>TEAM B</div>
            <div style={{ position: 'absolute', bottom: '18px', left: '20px', color: 'rgba(255,255,255,0.4)', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '2px' }}>TEAM A</div>

            {/* Render 10 Player Slots */}
            {slots.map((slotConfig) => {
                const participant = getSlotData(slotConfig);
                const isTeamA = slotConfig.team === 'A';
                const posLabel = POSITION_ABBREVIATIONS[slotConfig.position] || slotConfig.label || 'PLY';

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
                            /* Occupied Player Node */
                            <button
                                type="button"
                                onClick={() => onSelectPlayer && onSelectPlayer(participant)}
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
                                    position: 'relative',
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    border: `3px solid ${isTeamA ? '#38bdf8' : '#f43f5e'}`,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
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
                                    marginTop: '4px',
                                    background: 'rgba(15, 23, 42, 0.85)',
                                    color: '#fff',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    whiteSpace: 'nowrap',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <span>{participant.user?.name?.split(' ')[0] || 'Player'}</span>
                                    <span style={{ color: isTeamA ? '#38bdf8' : '#f43f5e', fontSize: '0.65rem' }}>[{posLabel}]</span>
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
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    border: `2px dashed rgba(255,255,255,0.6)`,
                                    background: 'rgba(0,0,0,0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff'
                                }}>
                                    <Plus size={18} />
                                </div>
                                <div style={{
                                    marginTop: '4px',
                                    background: 'rgba(0, 0, 0, 0.6)',
                                    color: 'rgba(255,255,255,0.9)',
                                    padding: '2px 6px',
                                    borderRadius: '8px',
                                    fontSize: '0.65rem',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {slotConfig.position}
                                </div>
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default FootballPitch;
