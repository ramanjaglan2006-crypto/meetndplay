import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Award, Star, MapPin, Activity, User, MessageCircle } from 'lucide-react';

const PlayerPreviewModal = ({ participant, matchContext, isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen || !participant) return null;

    const user = participant.user || {};
    const primarySportObj = user.sports?.[0] || {};
    const profilePosition = typeof primarySportObj === 'object' ? (primarySportObj.positions?.[0] || 'Unspecified') : 'Unspecified';

    const handleViewProfile = () => {
        onClose();
        navigate(`/profile/${user._id || user.id}`, { state: { matchContext } });
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
                maxWidth: '420px',
                padding: '1.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                position: 'relative'
            }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', zIndex: 2 }}>
                    <X size={20} />
                </button>

                {/* Profile Header */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <img
                        src={user.photos?.[0]?.url || user.photos?.[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                        alt={user.name}
                        style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary, #38bdf8)' }}
                    />
                    <div>
                        <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main, #fff)', fontWeight: 'bold' }}>
                            {user.name}{user.age ? `, ${user.age}` : ''}
                        </h2>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #aaa)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin size={12} /> {user.locationName || 'Local Pitch'}
                        </div>
                    </div>
                </div>

                {/* Match Position vs Profile Position */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold' }}>Match Position</div>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{participant.position || 'Midfielder'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', fontWeight: 'bold' }}>Profile Primary</div>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{profilePosition}</div>
                    </div>
                </div>

                {/* Athlete Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-main, #fff)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <span style={{ color: '#aaa' }}>Sport Skill</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--success, #34d399)' }}>Level {user.skill_level || primarySportObj.skillLevel || 3}</span>
                    </div>
                    {user.reputation && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <span style={{ color: '#aaa' }}>Reputation Score</span>
                            <span style={{ fontWeight: 'bold', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Star size={12} fill="#fbbf24" /> {user.reputation} / 5.0
                            </span>
                        </div>
                    )}
                    {user.achievements && user.achievements.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <span style={{ color: '#aaa' }}>Achievements</span>
                            <span style={{ fontWeight: 'bold', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Award size={12} /> {user.achievements.length} Badges
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleViewProfile}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '12px',
                            background: 'var(--primary, #38bdf8)',
                            color: '#000',
                            border: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <User size={16} /> View Athlete Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerPreviewModal;
