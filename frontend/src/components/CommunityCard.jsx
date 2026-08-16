import React from 'react';
import { Users, MapPin, CheckCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommunityCard = ({ community }) => {
    const navigate = useNavigate();

    return (
        <div 
            className="glass-card community-card" 
            style={{ 
                padding: 0, 
                overflow: 'hidden', 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column'
            }}
            onClick={() => navigate(`/community/${community.slug}`)}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--card-shadow)';
            }}
        >
            <div 
                style={{ 
                    height: '100px', 
                    background: community.coverImage ? `url(${community.coverImage}) center/cover` : 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    position: 'relative'
                }}
            >
                <div style={{
                    position: 'absolute',
                    bottom: '-25px',
                    left: '16px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'var(--surface-color)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    {community.logo ? (
                        <img src={community.logo} alt={community.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <Users size={24} color="var(--primary)" />
                    )}
                </div>
                
                {community.verified && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: '50%',
                        display: 'flex',
                        padding: '2px'
                    }}>
                        <CheckCircle size={18} color="var(--primary)" />
                    </div>
                )}
            </div>
            
            <div style={{ padding: '36px 16px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-color)' }}>
                    {community.name}
                </h3>
                
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {community.sports && community.sports.length > 0 && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            🏸 {community.sports[0]}
                        </span>
                    )}
                    {community.locationName && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} /> {community.locationName.split(',')[0]}
                        </span>
                    )}
                </div>
                
                <p style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--text-muted)', 
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1
                }}>
                    {community.description || 'A sports community on MeetNDPlay.'}
                </p>
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={16} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            {community.stats?.memberCount || 0} members
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                        Join <ChevronRight size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityCard;
