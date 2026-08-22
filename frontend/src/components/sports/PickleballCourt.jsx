import React, { useState } from 'react';
import { SPORT_CONFIGS } from '../../config/matchFormats';
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

const PickleballCourt = ({
    participants = [],
    onSelectPlayer,
    onSelectEmptySlot
}) => {
    const navigate = useNavigate();
    const [hoveredParticipant, setHoveredParticipant] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const config = SPORT_CONFIGS.pickleball;
    const slots = config.slots;

    const teamAParticipants = participants.filter(p => p.team === 'A');
    const teamBParticipants = participants.filter(p => p.team === 'B');

    const getSlotData = (slotConfig) => {
        const teamList = slotConfig.team === 'A' ? teamAParticipants : teamBParticipants;
        const slotIdx = slots.filter(s => s.team === slotConfig.team).indexOf(slotConfig);
        return teamList[slotIdx] || null;
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
            background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 50%, #0284c7 100%)', // Cyan pickleball court
            borderRadius: '18px',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            userSelect: 'none'
        }}>
            {/* Court Markings Outer */}
            <div style={{ position: 'absolute', inset: '16px', border: '2px solid rgba(255,255,255,0.85)', borderRadius: '2px', pointerEvents: 'none' }} />

            {/* Non-Volley Zone ("Kitchen") Areas */}
            <div style={{
                position: 'absolute',
                top: '36%',
                bottom: '36%',
                left: '16px',
                right: '16px',
                background: 'rgba(245, 158, 11, 0.15)',
                borderTop: '2px solid rgba(255,255,255,0.8)',
                borderBottom: '2px solid rgba(255,255,255,0.8)',
                pointerEvents: 'none'
            }} />
            <div style={{ position: 'absolute', top: '50%', left: '24px', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                KITCHEN (NON-VOLLEY ZONE)
            </div>

            {/* Center Net Divider Line */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '16px',
                right: '16px',
                height: '4px',
                background: '#fff',
                transform: 'translateY(-50%)',
                boxShadow: '0 0 8px rgba(255,255,255,0.9)',
                pointerEvents: 'none',
                zIndex: 5
            }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#000', color: '#fff', padding: '2px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 6 }}>
                NET
            </div>

            {/* Service Center Lines */}
            <div style={{ position: 'absolute', top: '16px', bottom: '36%', left: '50%', width: '1px', background: 'rgba(255,255,255,0.6)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '36%', bottom: '16px', left: '50%', width: '1px', background: 'rgba(255,255,255,0.6)', pointerEvents: 'none' }} />

            {/* Team Identifiers */}
            <div style={{ position: 'absolute', top: '20px', right: '24px', color: 'rgba(255,255,255,0.4)', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '2px' }}>TEAM B</div>
            <div style={{ position: 'absolute', bottom: '20px', right: '24px', color: 'rgba(255,255,255,0.4)', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '2px' }}>TEAM A</div>

            {/* 4 Pickleball Player Slots */}
            {slots.map((slotConfig) => {
                const participant = getSlotData(slotConfig);
                const isTeamA = slotConfig.team === 'A';
                const userId = participant?.user?._id || participant?.user?.id;

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
                                    background: 'rgba(15, 23, 42, 0.9)',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        {participant.user?.name?.split(' ')[0]}
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
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '50%',
                                    border: '2px dashed rgba(255,255,255,0.6)',
                                    background: 'rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff'
                                }}>
                                    <Plus size={20} />
                                </div>
                                <div style={{ marginTop: '3px', background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.9)', padding: '1px 6px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '700' }}>
                                    Open
                                </div>
                            </button>
                        )}
                    </div>
                );
            })}

            {/* Hover Tooltip */}
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
                        Pickleball · Level {hoveredParticipant.user?.skill_level || 3}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PickleballCourt;
