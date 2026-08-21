import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMatchRoom, useJoinMatchRoom, useLeaveMatchRoom, useUpdateMatchPosition, useRemoveMatchParticipant } from '../hooks/queries/useMatchRoom';
import { useAuth } from '../context/AuthContext';
import FootballPitch from '../components/FootballPitch';
import JoinMatchModal from '../components/JoinMatchModal';
import PlayerPreviewModal from '../components/PlayerPreviewModal';
import OrganizerControls from '../components/OrganizerControls';
import AISquadBuilder from '../components/AISquadBuilder';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Shield, Zap, Sparkles, UserPlus, Info, CheckCircle2 } from 'lucide-react';

export default function MatchRoom() {
    const { id: matchId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const currentUserId = currentUser?.id || currentUser?._id;

    const { data: roomData, isLoading, error } = useMatchRoom(matchId);

    const joinMatchMutation = useJoinMatchRoom();
    const leaveMatchMutation = useLeaveMatchRoom();
    const updatePositionMutation = useUpdateMatchPosition();
    const removeParticipantMutation = useRemoveMatchParticipant();

    // Modals state
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [selectedSlotPosition, setSelectedSlotPosition] = useState('Midfielder');
    const [selectedParticipantForPreview, setSelectedParticipantForPreview] = useState(null);

    if (isLoading) {
        return (
            <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
            </div>
        );
    }

    if (error || !roomData) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <h2>Match Not Found</h2>
                <p style={{ color: 'var(--text-muted)' }}>This match may have been cancelled or deleted.</p>
                <button onClick={() => navigate('/discover')} style={{ marginTop: '1rem', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', border: 'none', fontWeight: 'bold' }}>
                    Back to Discover
                </button>
            </div>
        );
    }

    const { match, organizer, participants = [], capacity } = roomData;
    const isJoined = participants.some(p => (p.user?._id || p.user?.id) === currentUserId);
    const myParticipantData = participants.find(p => (p.user?._id || p.user?.id) === currentUserId);
    const isOrganizer = (organizer?._id || organizer?.id) === currentUserId;

    const teamAParticipants = participants.filter(p => p.team === 'A');
    const teamBParticipants = participants.filter(p => p.team === 'B');

    const handleJoinConfirm = ({ position, openToOtherPositions }) => {
        joinMatchMutation.mutate({
            matchId,
            position,
            openToOtherPositions
        }, {
            onSuccess: () => setIsJoinModalOpen(false)
        });
    };

    const handleLeave = () => {
        if (window.confirm('Are you sure you want to leave this match?')) {
            leaveMatchMutation.mutate(matchId);
        }
    };

    const handleOpenJoinSlot = (slotConfig) => {
        if (isJoined) return;
        setSelectedSlotPosition(slotConfig?.position || 'Midfielder');
        setIsJoinModalOpen(true);
    };

    const handleRemovePlayer = (targetUserId) => {
        removeParticipantMutation.mutate({ matchId, userId: targetUserId });
    };

    // Format date & time
    const matchDate = new Date(match.dateTime);
    const dateFormatted = matchDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    const timeFormatted = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.5rem' }}>
            
            {/* Navigation Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    <ArrowLeft size={18} /> Back to Matches
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge" style={{ background: match.status === 'open' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: match.status === 'open' ? '#34d399' : '#f87171', border: `1px solid ${match.status === 'open' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                        {match.status === 'open' ? '🟢 Open' : match.status === 'full' ? '🔴 Full' : '⚪ Completed'}
                    </span>
                </div>
            </div>

            {/* Match Room Main Header Banner */}
            <div className="glass-card" style={{ padding: '1.5rem 2rem', borderRadius: '20px', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ background: 'var(--primary)', color: '#000', padding: '2px 10px', borderRadius: '12px', fontWeight: '800', fontSize: '0.8rem' }}>
                            {match.sport}
                        </span>
                        <span style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '2px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                            {match.format || '5-a-side'}
                        </span>
                    </div>
                    <h1 style={{ fontSize: '2rem', margin: '4px 0 8px 0', fontWeight: '900', color: '#fff' }}>
                        {match.title || `${match.format || '5-a-side'} ${match.sport} Match`}
                    </h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={16} color="var(--primary)" /> {dateFormatted}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={16} color="var(--primary)" /> {timeFormatted}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={16} color="var(--primary)" /> {match.locationName}
                        </span>
                    </div>
                </div>

                {/* Capacity Summary & Action */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary)' }}>
                            {capacity.joined} / {capacity.total} Players
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                            {capacity.remaining > 0 ? `${capacity.remaining} spots remaining` : 'Match is Full'}
                        </div>
                    </div>

                    {!isJoined ? (
                        <button
                            onClick={() => setIsJoinModalOpen(true)}
                            disabled={capacity.remaining <= 0}
                            style={{
                                padding: '12px 28px',
                                borderRadius: '12px',
                                background: capacity.remaining > 0 ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                color: capacity.remaining > 0 ? '#000' : '#888',
                                border: 'none',
                                fontWeight: '900',
                                fontSize: '1rem',
                                cursor: capacity.remaining > 0 ? 'pointer' : 'not-allowed'
                            }}
                        >
                            {capacity.remaining > 0 ? 'Join Match' : 'Match Full'}
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handleLeave}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    color: '#f87171',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Leave Match
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Grid: Pitch (60%) vs Sidebar (40%) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '2rem' }} className="match-room-grid">
                
                {/* LEFT / CENTER: Tactical Football Pitch */}
                <div>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 'bold', color: 'var(--text-main)' }}>Tactical Lineup</h2>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tap any player node to view athlete profile</span>
                    </div>

                    <FootballPitch
                        format={match.format || '5-a-side'}
                        participants={participants}
                        onSelectPlayer={(p) => setSelectedParticipantForPreview(p)}
                        onSelectEmptySlot={(slot) => handleOpenJoinSlot(slot)}
                    />

                    {/* AI Squad Auto-Balancer Widget */}
                    <div style={{ marginTop: '2rem' }}>
                        <AISquadBuilder matchId={matchId} playerIds={participants.map(p => p.user?._id || p.user?.id)} sport={match.sport} />
                    </div>
                </div>

                {/* RIGHT SIDEBAR: Roster & Match Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Organizer Controls */}
                    <OrganizerControls
                        isOrganizer={isOrganizer}
                        participants={participants}
                        onRemovePlayer={handleRemovePlayer}
                    />

                    {/* Team A Roster */}
                    <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: '900', fontSize: '1.05rem' }}>
                                <Shield size={18} /> TEAM A ({teamAParticipants.length} / 5)
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {teamAParticipants.map((p) => (
                                <div
                                    key={p.id || p.user?._id || p.user?.id}
                                    onClick={() => setSelectedParticipantForPreview(p)}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img
                                            src={p.user?.photos?.[0]?.url || p.user?.photos?.[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                                            alt={p.user?.name}
                                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>{p.user?.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Match Role: {p.position}</div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                                        Lvl {p.user?.skill_level || 3}
                                    </span>
                                </div>
                            ))}
                            {teamAParticipants.length === 0 && (
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No players assigned yet.</div>
                            )}
                        </div>
                    </div>

                    {/* Team B Roster */}
                    <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: '900', fontSize: '1.05rem' }}>
                                <Zap size={18} /> TEAM B ({teamBParticipants.length} / 5)
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {teamBParticipants.map((p) => (
                                <div
                                    key={p.id || p.user?._id || p.user?.id}
                                    onClick={() => setSelectedParticipantForPreview(p)}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img
                                            src={p.user?.photos?.[0]?.url || p.user?.photos?.[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                                            alt={p.user?.name}
                                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>{p.user?.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#f43f5e' }}>Match Role: {p.position}</div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                                        Lvl {p.user?.skill_level || 3}
                                    </span>
                                </div>
                            ))}
                            {teamBParticipants.length === 0 && (
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No players assigned yet.</div>
                            )}
                        </div>
                    </div>

                    {/* Organizer & Description */}
                    <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Match Host</div>
                        <div
                            onClick={() => navigate(`/profile/${organizer?._id || organizer?.id}`)}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                        >
                            <img
                                src={organizer?.photos?.[0]?.url || organizer?.photos?.[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                                alt={organizer?.name}
                                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                                <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{organizer?.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Organizer</div>
                            </div>
                        </div>

                        {match.description && (
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {match.description}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <JoinMatchModal
                match={match}
                initialPosition={selectedSlotPosition}
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                onConfirm={handleJoinConfirm}
                isLoading={joinMatchMutation.isPending}
            />

            <PlayerPreviewModal
                participant={selectedParticipantForPreview}
                matchContext={`Playing in: ${match.sport} ${match.format || '5-a-side'} match at ${match.locationName}`}
                isOpen={!!selectedParticipantForPreview}
                onClose={() => setSelectedParticipantForPreview(null)}
            />

            <style dangerouslySetInnerHTML={{__html: `
                @media (max-width: 900px) {
                    .match-room-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}} />
        </div>
    );
}
