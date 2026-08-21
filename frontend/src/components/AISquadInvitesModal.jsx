import React, { useState } from 'react';
import { useAIRecommendedInvites } from '../hooks/queries/useAI';
import { inviteToMatch } from '../services/api';
import { Sparkles, UserPlus, Check, X } from 'lucide-react';

const AISquadInvitesModal = ({ matchId, isOpen, onClose }) => {
    const { data: recommendations, isLoading } = useAIRecommendedInvites(matchId, { enabled: isOpen });
    const [invitedIds, setInvitedIds] = useState([]);

    if (!isOpen) return null;

    const handleInvite = async (targetId) => {
        try {
            await inviteToMatch(matchId, [targetId]);
            setInvitedIds(prev => [...prev, targetId]);
        } catch (err) {
            console.error('Error inviting player:', err);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: 'var(--bg-dark, #121212)', border: '1px solid var(--border-color, #333)', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles color="var(--primary, #38bdf8)" size={20} />
                        <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main, #fff)' }}>AI Recommended Teammates</h2>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                        <X size={18} />
                    </button>
                </div>

                {isLoading ? (
                    <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>AI is finding optimal nearby players...</p>
                ) : !recommendations || recommendations.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No AI recommendations found nearby.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {recommendations.map((item) => {
                            const p = item.player;
                            const isInvited = invitedIds.includes(p._id || p.id);
                            return (
                                <div key={p._id || p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img
                                            src={p.photos?.[0]?.url || p.photos?.[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                                            alt={p.name}
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-main, #fff)' }}>{p.name}</div>
                                            <div style={{ fontSize: '0.78rem', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Sparkles size={11} /> {item.synergyScore}% Synergy
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleInvite(p._id || p.id)}
                                        disabled={isInvited}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '6px 14px',
                                            borderRadius: '20px',
                                            background: isInvited ? 'rgba(16, 185, 129, 0.2)' : 'var(--primary, #38bdf8)',
                                            color: isInvited ? '#34d399' : '#000',
                                            border: 'none',
                                            fontWeight: 'bold',
                                            fontSize: '0.8rem',
                                            cursor: isInvited ? 'default' : 'pointer'
                                        }}
                                    >
                                        {isInvited ? <><Check size={14} /> Invited</> : <><UserPlus size={14} /> Invite</>}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AISquadInvitesModal;
