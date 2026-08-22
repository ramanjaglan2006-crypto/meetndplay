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

// Generate dynamic role slots based on teamSize (playersPerTeam)
// Team A = LEFT side (x: 14%-38%) | Team B = RIGHT side (x: 62%-86%)
// TOP Zone = Batsmen | MID Zone = All-Rounders | BOTTOM Zone = Bowlers | OUTER = Flex
const generateCricketSlots = (team = 'A', teamSize = 5) => {
    const isTeamA = team === 'A';
    const slots = [];

    let batCount = 2;
    let allCount = 1;
    let bowlCount = 2;
    let flexCount = 0;

    if (teamSize >= 8) {
        batCount = 3;
        allCount = 2;
        bowlCount = 3;
        flexCount = Math.max(0, teamSize - 8);
    } else if (teamSize === 6 || teamSize === 7) {
        batCount = 2;
        allCount = 2;
        bowlCount = teamSize - 4;
    }

    // 1. BATSMEN SLOTS (Top Zone: y = 18%-28%)
    const batCoordsA = [{ x: 18, y: 18 }, { x: 34, y: 18 }, { x: 26, y: 28 }];
    const batCoordsB = [{ x: 82, y: 18 }, { x: 66, y: 18 }, { x: 74, y: 28 }];

    for (let i = 0; i < batCount; i++) {
        const coords = isTeamA ? batCoordsA[i % batCoordsA.length] : batCoordsB[i % batCoordsB.length];
        slots.push({
            id: `${team}-bat-${i + 1}`,
            team,
            role: 'Batsman',
            roleIndex: i,
            x: coords.x,
            y: coords.y
        });
    }

    // 2. ALL-ROUNDER SLOTS (Center Zone: y = 46%-56%)
    const allCoordsA = [{ x: 20, y: 48 }, { x: 34, y: 56 }];
    const allCoordsB = [{ x: 80, y: 48 }, { x: 66, y: 56 }];

    for (let i = 0; i < allCount; i++) {
        const coords = isTeamA ? allCoordsA[i % allCoordsA.length] : allCoordsB[i % allCoordsB.length];
        slots.push({
            id: `${team}-all-${i + 1}`,
            team,
            role: 'All-Rounder',
            roleIndex: i,
            x: coords.x,
            y: coords.y
        });
    }

    // 3. BOWLER SLOTS (Bottom Zone: y = 72%-82%)
    const bowlCoordsA = [{ x: 18, y: 74 }, { x: 34, y: 82 }, { x: 26, y: 74 }];
    const bowlCoordsB = [{ x: 82, y: 74 }, { x: 66, y: 82 }, { x: 74, y: 74 }];

    for (let i = 0; i < bowlCount; i++) {
        const coords = isTeamA ? bowlCoordsA[i % bowlCoordsA.length] : bowlCoordsB[i % bowlCoordsB.length];
        slots.push({
            id: `${team}-bowl-${i + 1}`,
            team,
            role: 'Bowler',
            roleIndex: i,
            x: coords.x,
            y: coords.y
        });
    }

    // 4. FLEX / FIELD SLOTS (If teamSize > 8)
    const flexCoordsA = [{ x: 12, y: 36 }, { x: 12, y: 64 }, { x: 40, y: 36 }, { x: 40, y: 64 }];
    const flexCoordsB = [{ x: 88, y: 36 }, { x: 88, y: 64 }, { x: 60, y: 36 }, { x: 60, y: 64 }];

    for (let i = 0; i < flexCount; i++) {
        const coords = isTeamA ? flexCoordsA[i % flexCoordsA.length] : flexCoordsB[i % flexCoordsB.length];
        slots.push({
            id: `${team}-flex-${i + 1}`,
            team,
            role: 'Flex',
            roleIndex: i,
            x: coords.x,
            y: coords.y
        });
    }

    return slots;
};

const CricketField = ({
    match = {},
    participants = [],
    onSelectPlayer,
    onSelectEmptySlot
}) => {
    const navigate = useNavigate();
    const [hoveredParticipant, setHoveredParticipant] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const teamSize = match.playersPerTeam || Math.ceil((match.totalPlayers || 10) / 2) || 5;

    const teamASlots = generateCricketSlots('A', teamSize);
    const teamBSlots = generateCricketSlots('B', teamSize);
    const allSlots = [...teamASlots, ...teamBSlots];

    const teamAParticipants = participants.filter(p => p.team === 'A');
    const teamBParticipants = participants.filter(p => p.team === 'B');

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
        return 'FLEX';
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1.35 / 1',
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

            {/* Boundary Line */}
            <div style={{
                position: 'absolute',
                inset: '16px',
                border: '2.5px dashed rgba(255,255,255,0.7)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />

            {/* 30-Yard Inner Circle */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '68%',
                height: '70%',
                border: '1.5px solid rgba(255,255,255,0.35)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
            }} />

            {/* Central Vertical 22-Yard Pitch Strip */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '54px',
                height: '65%',
                background: 'linear-gradient(180deg, #c2410c 0%, #d97706 50%, #c2410c 100%)',
                border: '2px solid rgba(255,255,255,0.85)',
                borderRadius: '4px',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                boxShadow: '0 0 16px rgba(0,0,0,0.4)',
                zIndex: 2
            }}>
                {/* Top Wicket & Crease */}
                <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', height: '2px', background: '#fff' }} />
                <div style={{ position: 'absolute', top: '6%', left: '50%', transform: 'translateX(-50%)', width: '24px', height: '4px', background: '#fef08a', border: '1px solid #78350f', borderRadius: '1px' }} />

                {/* Bottom Wicket & Crease */}
                <div style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%', height: '2px', background: '#fff' }} />
                <div style={{ position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)', width: '24px', height: '4px', background: '#fef08a', border: '1px solid #78350f', borderRadius: '1px' }} />

                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: '0.62rem', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    22 YARDS
                </div>
            </div>

            {/* Team Identifiers */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '24px',
                background: '#0284c7',
                color: '#ffffff',
                padding: '4px 14px',
                borderRadius: '12px',
                fontWeight: '900',
                fontSize: '0.85rem',
                letterSpacing: '1px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                zIndex: 15
            }}>
                🛡 TEAM A ({teamAParticipants.length}/{teamSize})
            </div>

            <div style={{
                position: 'absolute',
                top: '20px',
                right: '24px',
                background: '#e11d48',
                color: '#ffffff',
                padding: '4px 14px',
                borderRadius: '12px',
                fontWeight: '900',
                fontSize: '0.85rem',
                letterSpacing: '1px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                zIndex: 15
            }}>
                ⚡ TEAM B ({teamBParticipants.length}/{teamSize})
            </div>

            {/* Subtle Role Zone Indicators */}
            <div style={{ position: 'absolute', top: '22px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: '900', letterSpacing: '1px' }}>
                BATSMEN (TOP)
            </div>
            <div style={{ position: 'absolute', top: '50%', left: '22px', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px' }}>
                ALL-ROUNDERS
            </div>
            <div style={{ position: 'absolute', bottom: '22px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: '900', letterSpacing: '1px' }}>
                BOWLERS (BOTTOM)
            </div>

            {/* Render Dynamic Cricket Player & Empty Position Slots */}
            {allSlots.map((slotConfig) => {
                const participant = getSlotParticipant(slotConfig);
                const isTeamA = slotConfig.team === 'A';
                const userId = participant?.user?._id || participant?.user?.id;
                const roleAbbr = getRoleAbbr(participant?.position || participant?.role || slotConfig.role);

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
                                    background: 'rgba(15, 23, 42, 0.95)',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    border: `1.5px solid ${isTeamA ? '#38bdf8' : '#f43f5e'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
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
                                    border: `2px dashed ${isTeamA ? 'rgba(56, 189, 248, 0.7)' : 'rgba(244, 63, 94, 0.7)'}`,
                                    background: 'rgba(0,0,0,0.35)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff'
                                }}>
                                    <Plus size={18} color={isTeamA ? '#38bdf8' : '#f43f5e'} />
                                </div>
                                <div style={{ marginTop: '3px', background: 'rgba(0,0,0,0.65)', color: 'rgba(255,255,255,0.9)', padding: '1px 6px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700' }}>
                                    (+) {slotConfig.role}
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
