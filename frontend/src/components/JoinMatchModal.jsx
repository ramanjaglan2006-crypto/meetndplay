import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Check, Shield } from 'lucide-react';

const POSITIONS = [
    { key: 'Goalkeeper', label: 'Goalkeeper', abbr: 'GK' },
    { key: 'Defender', label: 'Defender', abbr: 'DEF' },
    { key: 'Midfielder', label: 'Midfielder', abbr: 'MID' },
    { key: 'Winger', label: 'Winger', abbr: 'WIN' },
    { key: 'Striker', label: 'Striker', abbr: 'ST' }
];

const JoinMatchModal = ({ match, initialPosition = 'Midfielder', isOpen, onClose, onConfirm, isLoading }) => {
    const { user } = useAuth();
    const [selectedPosition, setSelectedPosition] = useState(initialPosition);
    const [openToOtherPositions, setOpenToOtherPositions] = useState(true);

    if (!isOpen || !match) return null;

    const primaryProfilePosition = user?.sports?.[0]?.positions?.[0] || 'Striker';

    const handleConfirm = () => {
        onConfirm({
            position: selectedPosition,
            openToOtherPositions
        });
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(6px)'
        }}>
            <div className="glass-card" style={{
                background: 'var(--bg-dark, #121212)',
                border: '1px solid var(--border-color, #333)',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '460px',
                padding: '1.75rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--text-main, #fff)', fontWeight: '800' }}>Join Football Match</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #aaa)', margin: '2px 0 0 0' }}>
                            {match.format || '5-a-side'} • {match.locationName}
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Profile Reference */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                        src={user?.photos?.[0]?.url || user?.photos?.[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                        alt={user?.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main, #fff)' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #aaa)' }}>
                            Profile Primary: <span style={{ color: 'var(--primary, #38bdf8)', fontWeight: '600' }}>{primaryProfilePosition}</span>
                        </div>
                    </div>
                </div>

                {/* Choose Match Position */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main, #fff)', marginBottom: '8px' }}>
                        Select Match Position:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {POSITIONS.map((pos) => {
                            const isSelected = selectedPosition === pos.key;
                            return (
                                <button
                                    key={pos.key}
                                    type="button"
                                    onClick={() => setSelectedPosition(pos.key)}
                                    style={{
                                        padding: '10px 8px',
                                        borderRadius: '12px',
                                        border: `1.5px solid ${isSelected ? 'var(--primary, #38bdf8)' : 'rgba(255,255,255,0.1)'}`,
                                        background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                                        color: isSelected ? 'var(--primary, #38bdf8)' : 'var(--text-main, #fff)',
                                        fontWeight: 'bold',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '2px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <span>{pos.label}</span>
                                    <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>[{pos.abbr}]</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Open to other positions Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                    <input
                        type="checkbox"
                        id="openToOther"
                        checked={openToOtherPositions}
                        onChange={(e) => setOpenToOtherPositions(e.target.checked)}
                        style={{ accentColor: 'var(--primary, #38bdf8)', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="openToOther" style={{ fontSize: '0.85rem', color: 'var(--text-main, #fff)', cursor: 'pointer' }}>
                        Open to playing other positions if needed
                    </label>
                </div>

                {/* Confirm Button */}
                <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        background: 'var(--primary, #38bdf8)',
                        color: '#000',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    {isLoading ? 'Joining Match...' : 'Confirm & Join Match'}
                </button>
            </div>
        </div>
    );
};

export default JoinMatchModal;
