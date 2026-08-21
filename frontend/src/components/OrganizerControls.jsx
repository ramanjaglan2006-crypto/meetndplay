import React, { useState } from 'react';
import { Settings, UserX, AlertOctagon, Edit, CheckCircle } from 'lucide-react';

const OrganizerControls = ({ isOrganizer, participants = [], onRemovePlayer, onCancelMatch }) => {
    const [selectedToRemove, setSelectedToRemove] = useState('');

    if (!isOrganizer) return null;

    const handleRemoveSubmit = () => {
        if (!selectedToRemove) return;
        if (window.confirm('Are you sure you want to remove this player from the match?')) {
            onRemovePlayer(selectedToRemove);
            setSelectedToRemove('');
        }
    };

    return (
        <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.03)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#fbbf24', fontWeight: 'bold' }}>
                <Settings size={18} /> Organizer Management Controls
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Remove Player Select */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                        value={selectedToRemove}
                        onChange={(e) => setSelectedToRemove(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'var(--bg-dark, #121212)',
                            color: 'var(--text-main, #fff)',
                            border: '1px solid var(--border-color, #444)',
                            fontSize: '0.85rem'
                        }}
                    >
                        <option value="">Select player to remove...</option>
                        {participants.map(p => (
                            <option key={p.user?._id || p.user?.id} value={p.user?._id || p.user?.id}>
                                {p.user?.name} ({p.team} - {p.position})
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleRemoveSubmit}
                        disabled={!selectedToRemove}
                        style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            cursor: selectedToRemove ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <UserX size={14} /> Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrganizerControls;
