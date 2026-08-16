import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, MapPin, Users } from 'lucide-react';
import { useCommunities } from '../hooks/queries/useCommunities';
import CommunityCard from '../components/CommunityCard';

const Communities = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('recommended'); // recommended, nearby, popular, joined
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const { data: allCommunities = [], isLoading, error } = useCommunities();

    const categories = ['All', ...new Set(allCommunities.map(c => c.category || 'General'))];
    
    // Filter communities based on search and category
    const communities = allCommunities.filter(community => {
        const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (community.description && community.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || community.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const tabs = [
        { id: 'recommended', label: 'Recommended' },
        { id: 'nearby', label: 'Nearby' },
        { id: 'popular', label: 'Popular' },
        { id: 'joined', label: 'Joined' }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
            {/* Header & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '280px', maxWidth: '500px' }}>
                    <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        type="text" 
                        placeholder="Search communities by name, sport, or city..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 16px 14px 48px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--surface-color)',
                            color: 'var(--text-color)',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                
                <button 
                    className="btn-primary" 
                    onClick={() => navigate('/create-community')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
                >
                    <Plus size={20} /> Create Community
                </button>
            </div>

            {/* Hero Section */}
            {!searchQuery && (
                <div style={{ 
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    borderRadius: '24px',
                    padding: '3rem 2rem',
                    marginBottom: '2.5rem',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-color)' }}>
                        Find your people. Play together.
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '2rem', lineHeight: 1.6 }}>
                        Join local groups, discover matches, and build your sports network. From casual weekend badminton to competitive football leagues.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>320+</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Active Groups</span>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>15,000+</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Players</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '2rem', 
                borderBottom: '1px solid var(--border-color)',
                overflowX: 'auto',
                paddingBottom: '2px'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '12px 16px',
                            fontSize: '1rem',
                            fontWeight: activeTab === tab.id ? 600 : 500,
                            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                            borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            {isLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{ height: '280px', background: 'var(--surface-color)', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
                    ))}
                </div>
            ) : communities.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {communities.map(community => (
                        <CommunityCard key={community._id} community={community} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', marginBottom: '1.5rem' }}>
                        <Users size={32} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No communities found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        {searchQuery ? `We couldn't find anything matching "${searchQuery}".` : "There are no communities in this category yet."}
                    </p>
                    {searchQuery && (
                        <button className="btn-secondary" onClick={() => setSearchQuery('')}>
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Communities;
