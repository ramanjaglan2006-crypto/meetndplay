import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, MapPin, CheckCircle, Share2, Plus, MessageSquare, Heart, Loader2 } from 'lucide-react';
import { joinCommunity, leaveCommunity } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommunityChat from '../components/CommunityChat';
import { useCommunityDetail, useJoinCommunity, useLeaveCommunity } from '../hooks/queries/useCommunities';
import { useCommunityPosts, useCreateCommunityPost } from '../hooks/queries/useCommunityPosts';

const CommunityDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [activeTab, setActiveTab] = useState('feed'); // feed, chat, matches, events, members, about
    const [newPostContent, setNewPostContent] = useState('');
    
    // React Query Hooks
    const { data: community, isLoading: loading } = useCommunityDetail(slug);
    
    const isMember = community?.membership && community.membership.status === 'active';
    const isPending = community?.membership && community.membership.status === 'pending';
    const hasAccess = community?.privacy === 'public' || isMember;

    const { data: posts = [] } = useCommunityPosts(community?._id, { enabled: !!community && hasAccess });
    
    const joinMutation = useJoinCommunity();
    const leaveMutation = useLeaveCommunity();
    const createPostMutation = useCreateCommunityPost(community?._id);

    const handleJoin = async () => {
        if (!user) return navigate('/login');
        joinMutation.mutate(community._id);
    };

    const handleLeave = async () => {
        if (window.confirm("Are you sure you want to leave this community?")) {
            leaveMutation.mutate(community._id);
        }
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;
        createPostMutation.mutate(
            { content: newPostContent, type: 'General' },
            { onSuccess: () => setNewPostContent('') }
        );
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 size={32} className="spinner" /></div>;
    }

    if (!community) return null;

    const tabs = [
        { id: 'feed', label: 'Overview' },
        { id: 'chat', label: 'Chat' },
        { id: 'matches', label: 'Matches' },
        { id: 'events', label: 'Events' },
        { id: 'members', label: 'Members' }
    ];

    return (
        <div style={{ padding: '0 0 100px 0', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header/Cover Section */}
            <div style={{ 
                height: '250px', 
                background: community.coverImage ? `url(${community.coverImage}) center/cover` : 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                borderRadius: '0 0 24px 24px',
                position: 'relative',
                marginBottom: '4rem'
            }}>
                <div style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '40px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '24px',
                    width: 'calc(100% - 80px)'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '20px',
                        background: 'var(--surface-color)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        border: '4px solid var(--background-color)',
                        overflow: 'hidden'
                    }}>
                        {community.logo ? (
                            <img src={community.logo} alt={community.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <Users size={48} color="var(--primary)" />
                        )}
                    </div>
                    
                    <div style={{ flex: 1, paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{community.name}</h1>
                            {community.verified && <CheckCircle size={24} color="var(--primary)" />}
                        </div>
                        <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            {community.sports && community.sports.length > 0 && <span>🏸 {community.sports[0]}</span>}
                            {community.locationName && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {community.locationName.split(',')[0]}</span>}
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14}/> {community.stats?.memberCount || 0} members</span>
                        </div>
                    </div>
                    
                    <div style={{ paddingBottom: '8px', display: 'flex', gap: '12px' }}>
                        <button className="btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Share2 size={18} /> Share
                        </button>
                        
                        {isMember ? (
                            <div style={{ position: 'relative' }} className="dropdown-container">
                                <button className="btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--success)', borderColor: 'var(--success)' }}>
                                    <CheckCircle size={18} /> Joined
                                </button>
                                {/* In a real app, this would be an actual dropdown menu */}
                                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--surface-color)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', padding: '8px', zIndex: 10, width: '150px' }}>
                                    <button onClick={handleLeave} style={{ width: '100%', padding: '8px', textAlign: 'left', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', borderRadius: '4px' }}>
                                        Leave Community
                                    </button>
                                </div>
                            </div>
                        ) : isPending ? (
                            <button className="btn-secondary" disabled>Request Pending</button>
                        ) : (
                            <button className="btn-primary" onClick={handleJoin} disabled={joinMutation.isPending}>
                                {joinMutation.isPending ? 'Joining...' : 'Join Community'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div style={{ padding: '0 40px' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
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
                                cursor: 'pointer'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                    {/* Main Content Area */}
                    <div>
                        {(community.privacy !== 'public' && !isMember) ? (
                            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                <Users size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <h3>This community is {community.privacy}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>You must be a member to view its content.</p>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'feed' && (
                                    <div>
                                        {isMember && (
                                            <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                                                        {user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <textarea 
                                                        placeholder="Create a post..."
                                                        value={newPostContent}
                                                        onChange={(e) => setNewPostContent(e.target.value)}
                                                        style={{ flex: 1, background: 'var(--background-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px', color: 'white', resize: 'vertical', minHeight: '80px' }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                                                    <button className="btn-primary" onClick={handleCreatePost} disabled={!newPostContent.trim() || createPostMutation.isPending}>
                                                        {createPostMutation.isPending ? 'Posting...' : 'Post'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {posts.length === 0 ? (
                                            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                                                <MessageSquare size={32} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                                <p style={{ color: 'var(--text-muted)' }}>No posts yet. Be the first to start a discussion!</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {posts.map(post => (
                                                    <div key={post._id} className="glass-card" style={{ padding: '1.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-dark)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                                                                {post.author?.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: 600 }}>{post.author?.name || 'Unknown User'}</div>
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                                                            </div>
                                                            {post.pinned && <div style={{ marginLeft: 'auto', fontSize: '0.8rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '12px' }}>📌 Pinned</div>}
                                                        </div>
                                                        <p style={{ marginBottom: '1rem', lineHeight: 1.5 }}>{post.content}</p>
                                                        <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                                                            <button style={{ background: 'none', border: 'none', color: post.hasLiked ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                                                <Heart size={18} fill={post.hasLiked ? 'var(--primary)' : 'none'} /> {post.likes?.length || 0}
                                                            </button>
                                                            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                                                <MessageSquare size={18} /> {post.commentsCount || 0}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {activeTab === 'chat' && (
                                    <CommunityChat community={community} />
                                )}
                                
                                {activeTab === 'matches' && (
                                    <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                        <h3>Community Matches</h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Matches organized by this community will appear here.</p>
                                        {isMember && <button className="btn-primary">Create Match</button>}
                                    </div>
                                )}
                                
                                {activeTab === 'events' && (
                                    <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                        <h3>Upcoming Events</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>No upcoming events scheduled.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>About Community</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                                {community.description || 'No description provided.'}
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Privacy</span>
                                    <span style={{ textTransform: 'capitalize' }}>{community.privacy}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Created</span>
                                    <span>{new Date(community.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Owner</span>
                                    <span>{community.owner?.name || 'Unknown'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Community Stats</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--background-color)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{community.stats?.memberCount || 0}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Members</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--background-color)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{community.stats?.postCount || 0}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posts</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--background-color)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{community.stats?.matchCount || 0}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Matches</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--background-color)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{community.stats?.eventCount || 0}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Events</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityDetail;
