import React, { useState } from 'react';
import { useAISquadBalance } from '../hooks/queries/useAI';
import { Sparkles, Users, AlertTriangle, RefreshCw, Shield, Zap } from 'lucide-react';

const AISquadBuilder = ({ matchId, playerIds = [], sport = 'football' }) => {
    const squadBalanceMutation = useAISquadBalance();
    const [squadData, setSquadData] = useState(null);

    const handleBalance = () => {
        squadBalanceMutation.mutate(
            { matchId, playerIds, sport },
            {
                onSuccess: (data) => setSquadData(data),
            }
        );
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color, #333)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles color="var(--primary, #38bdf8)" size={20} />
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main, #fff)' }}>AI Squad Auto-Balancer</h3>
                </div>
                <button
                    onClick={handleBalance}
                    disabled={squadBalanceMutation.isPending}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        background: 'var(--primary, #38bdf8)',
                        color: '#000',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        opacity: squadBalanceMutation.isPending ? 0.7 : 1
                    }}
                >
                    <RefreshCw size={14} className={squadBalanceMutation.isPending ? 'spin' : ''} />
                    {squadBalanceMutation.isPending ? 'Balancing...' : 'Auto-Balance Teams'}
                </button>
            </div>

            {!squadData ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #aaa)', margin: 0 }}>
                    Click "Auto-Balance Teams" to have AI analyze player skills and positions, partition 50/50 balanced teams, and flag missing key roles.
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1rem' }}>
                    {/* Balance Meter */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>
                            <span style={{ color: '#38bdf8' }}>Team Alpha ({squadData.balanceScore}%)</span>
                            <span style={{ color: '#f43f5e' }}>Team Omega ({(100 - squadData.balanceScore).toFixed(1)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                            <div style={{ width: `${squadData.balanceScore}%`, background: '#38bdf8', height: '100%' }} />
                            <div style={{ width: `${100 - squadData.balanceScore}%`, background: '#f43f5e', height: '100%' }} />
                        </div>
                    </div>

                    {/* Team Roster Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* Team Alpha */}
                        <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '1rem', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: '#38bdf8', fontWeight: 'bold' }}>
                                <Shield size={16} /> Team Alpha
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {(squadData.teamA || []).map((p, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                                        <span>{p.name || 'Player'}</span>
                                        <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>Lv {p.skill_level || 3}</span>
                                    </div>
                                ))}
                            </div>
                            {squadData.missingRoles?.teamA?.length > 0 && (
                                <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <AlertTriangle size={12} /> Missing: {squadData.missingRoles.teamA.join(', ')}
                                </div>
                            )}
                        </div>

                        {/* Team Omega */}
                        <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '1rem', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: '#f43f5e', fontWeight: 'bold' }}>
                                <Zap size={16} /> Team Omega
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {(squadData.teamB || []).map((p, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                                        <span>{p.name || 'Player'}</span>
                                        <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>Lv {p.skill_level || 3}</span>
                                    </div>
                                ))}
                            </div>
                            {squadData.missingRoles?.teamB?.length > 0 && (
                                <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <AlertTriangle size={12} /> Missing: {squadData.missingRoles.teamB.join(', ')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AISquadBuilder;
