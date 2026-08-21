import React, { useState } from 'react';
import { useAISynergy } from '../hooks/queries/useAI';
import { Sparkles, Info, X } from 'lucide-react';

const AISynergyBadge = ({ targetUserId, compact = false }) => {
    const { data: synergy, isLoading } = useAISynergy(targetUserId);
    const [showDetails, setShowDetails] = useState(false);

    if (isLoading || !synergy) {
        return (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', fontSize: '0.8rem', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                <Sparkles size={12} className="spin" /> Calculating...
            </div>
        );
    }

    const score = synergy.synergyScore || 75;
    const breakdown = synergy.breakdown || { skillMatch: 25, positionSynergy: 25, distanceScore: 15, interestMatch: 10 };

    // Badge color dynamically based on score
    let badgeBg = 'rgba(168, 85, 247, 0.15)';
    let badgeColor = '#c084fc';
    let borderColor = 'rgba(168, 85, 247, 0.3)';

    if (score >= 85) {
        badgeBg = 'rgba(16, 185, 129, 0.15)';
        badgeColor = '#34d399';
        borderColor = 'rgba(16, 185, 129, 0.3)';
    } else if (score < 70) {
        badgeBg = 'rgba(245, 158, 11, 0.15)';
        badgeColor = '#fbbf24';
        borderColor = 'rgba(245, 158, 11, 0.3)';
    }

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: compact ? '4px 10px' : '6px 14px',
                    borderRadius: '20px',
                    background: badgeBg,
                    color: badgeColor,
                    border: `1px solid ${borderColor}`,
                    fontSize: compact ? '0.78rem' : '0.88rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                }}
            >
                <Sparkles size={compact ? 13 : 15} />
                <span>{score}% Synergy</span>
                <Info size={12} style={{ opacity: 0.7 }} />
            </button>

            {/* Breakdown Tooltip / Popover */}
            {showDetails && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        zIndex: 100,
                        width: '240px',
                        padding: '1rem',
                        background: 'var(--bg-dark, #121212)',
                        border: '1px solid var(--border-color, #333)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        color: 'var(--text-main, #fff)',
                        fontSize: '0.85rem'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles size={14} color={badgeColor} /> Synergy Breakdown
                        </strong>
                        <button onClick={() => setShowDetails(false)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}>
                            <X size={14} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                                <span>Skill Match</span>
                                <span>{breakdown.skillMatch}/30</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px' }}>
                                <div style={{ width: `${(breakdown.skillMatch / 30) * 100}%`, height: '100%', background: badgeColor, borderRadius: '2px' }} />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                                <span>Position Compatibility</span>
                                <span>{breakdown.positionSynergy}/35</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px' }}>
                                <div style={{ width: `${(breakdown.positionSynergy / 35) * 100}%`, height: '100%', background: badgeColor, borderRadius: '2px' }} />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                                <span>Location Proximity</span>
                                <span>{breakdown.distanceScore}/25</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px' }}>
                                <div style={{ width: `${(breakdown.distanceScore / 25) * 100}%`, height: '100%', background: badgeColor, borderRadius: '2px' }} />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                                <span>Shared Interests</span>
                                <span>{breakdown.interestMatch}/10</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px' }}>
                                <div style={{ width: `${(breakdown.interestMatch / 10) * 100}%`, height: '100%', background: badgeColor, borderRadius: '2px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AISynergyBadge;
