import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatchRoom, useJoinMatchRoom, useLeaveMatchRoom, useRemoveMatchParticipant } from '../hooks/queries/useMatchRoom';
import { useAuth } from '../context/AuthContext';

import MatchHeader from '../components/MatchHeader';
import MatchSummarySidebar from '../components/MatchSummarySidebar';
import SportVisualizer from '../components/sports/SportVisualizer';
import JoinMatchModal from '../components/JoinMatchModal';
import PlayerPreviewModal from '../components/PlayerPreviewModal';
import OrganizerControls from '../components/OrganizerControls';

import { Shield, Zap, Info, FileText, ArrowLeft } from 'lucide-react';

export default function MatchRoom() {
    const { id: matchId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const currentUserId = currentUser?.id || currentUser?._id;

    const { data: roomData, isLoading, error } = useMatchRoom(matchId);

    const joinMatchMutation = useJoinMatchRoom();
    const leaveMatchMutation = useLeaveMatchRoom();
    const removeParticipantMutation = useRemoveMatchParticipant();

    // Modals & Popover state
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [selectedSlotPosition, setSelectedSlotPosition] = useState('Midfielder');
    const [selectedParticipantForPreview, setSelectedParticipantForPreview] = useState(null);

    if (isLoading) {
        return (
            <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spin" style={{ width: '36px', height: '36px', border: '3px solid var(--border-color, #E3E6E2)', borderTopColor: 'var(--primary, #F5B91E)', borderRadius: '50%' }} />
            </div>
        );
    }

    if (error || !roomData) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <h2>Match Not Found</h2>
                <p style={{ color: 'var(--text-muted, #626762)' }}>This match may have been cancelled or deleted.</p>
                <button onClick={() => navigate('/play')} style={{ marginTop: '1rem', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary, #F5B91E)', color: '#000', border: 'none', fontWeight: 'bold' }}>
                    Back to Play
                </button>
            </div>
        );
    }

    const { match, organizer, participants = [], capacity } = roomData;
    const isJoined = participants.some(p => (p.user?._id || p.user?.id) === currentUserId);
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
        if (window.confirm('Are you sure you want to leave this match? Your spot will be freed.')) {
            leaveMatchMutation.mutate(matchId);
        }
    };

    const handleOpenJoinSlot = (slotConfig) => {
        if (isJoined) return;
        setSelectedSlotPosition(slotConfig?.position || slotConfig?.role || 'Midfielder');
        setIsJoinModalOpen(true);
    };

    const handleRemovePlayer = (targetUserId) => {
        removeParticipantMutation.mutate({ matchId, userId: targetUserId });
    };

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem' }}>
            
            {/* Header Navigation & Status Bar */}
            <MatchHeader
                match={match}
                capacity={capacity}
                isJoined={isJoined}
                isOrganizer={isOrganizer}
                onOpenJoin={() => setIsJoinModalOpen(true)}
                onLeave={handleLeave}
            />

            {/* ABOVE THE FOLD — 2-Column Hero Layout (70-75% Sport Visualizer Left / 25-30% Sidebar Right) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2.4fr) minmax(0, 1fr)',
                gap: '1.5rem',
                alignItems: 'start'
            }} className="match-room-hero-grid">
                
                {/* LEFT HERO: Dynamic Sport Visualizer (Football Pitch, Badminton Court, Tennis Court, Pickleball Court, Cricket Field) */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-main, #171817)', letterSpacing: '0.5px' }}>
                            {match.sport?.toUpperCase() || 'MATCH'} VISUALIZATION
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #626762)' }}>
                            Tap any athlete to view profile
                        </span>
                    </div>

                    <SportVisualizer
                        match={match}
                        participants={participants}
                        onSelectPlayer={(p) => {
                            const userId = p.user?._id || p.user?.id;
                            if (userId) navigate(`/athlete/${userId}`);
                            else setSelectedParticipantForPreview(p);
                        }}
                        onSelectEmptySlot={(slot) => handleOpenJoinSlot(slot)}
                    />
                </div>

                {/* RIGHT SIDEBAR: Match Summary & Teams (25-30% Width) */}
                <div>
                    <MatchSummarySidebar
                        match={match}
                        organizer={organizer}
                        participants={participants}
                        capacity={capacity}
                        isJoined={isJoined}
                        onOpenJoin={() => setIsJoinModalOpen(true)}
                        onSelectParticipant={(p) => {
                            const userId = p.user?._id || p.user?.id;
                            if (userId) navigate(`/athlete/${userId}`);
                            else setSelectedParticipantForPreview(p);
                        }}
                    />
                </div>
            </div>

            {/* BELOW THE FOLD — Detailed Information & Full Roster */}
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Organizer Management Panel (If Host) */}
                {isOrganizer && (
                    <OrganizerControls
                        isOrganizer={isOrganizer}
                        participants={participants}
                        onRemovePlayer={handleRemovePlayer}
                    />
                )}

                {/* About & Match Rules */}
                <div style={{
                    background: 'var(--card-bg, #ffffff)',
                    border: '1px solid var(--border-color, #E3E6E2)',
                    borderRadius: '16px',
                    padding: '1.25rem'
                }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '0.75rem', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Info size={16} color="var(--primary-dark, #E5A900)" /> ABOUT THIS MATCH
                    </div>
                    
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #626762)', margin: 0, lineHeight: 1.5 }}>
                        {match.description || `Casual ${match.sport || 'sports'} match. All skill levels welcome. Please arrive 10 minutes before start time.`}
                    </p>

                    {match.rules && (
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color, #E3E6E2)' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main, #171817)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FileText size={14} color="var(--primary-dark, #E5A900)" /> Match Rules
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #626762)', margin: 0 }}>{match.rules}</p>
                        </div>
                    )}
                </div>

                {/* Detailed Roster Section */}
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '1rem', letterSpacing: '0.5px' }}>
                        FULL ATHLETE ROSTER
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="match-roster-grid">
                        
                        {/* Team A Roster Cards */}
                        <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '16px', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                <Shield size={16} /> TEAM A ({teamAParticipants.length} / {Math.ceil(capacity.total / 2)})
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {teamAParticipants.map((p) => {
                                    const uid = p.user?._id || p.user?.id;
                                    return (
                                        <div
                                            key={p.id || uid}
                                            onClick={() => uid ? navigate(`/athlete/${uid}`) : setSelectedParticipantForPreview(p)}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-dark, #F6F7F5)', borderRadius: '10px', cursor: 'pointer' }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img
                                                    src={p.user?.photos?.[0]?.url || p.user?.photos?.[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                                                    alt={p.user?.name}
                                                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '0.88rem', color: 'var(--text-main, #171817)' }}>{p.user?.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#0284c7' }}>{p.position || p.role || 'Player'}</div>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #626762)' }}>
                                                Level {p.user?.skill_level || 3}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Team B Roster Cards */}
                        <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '16px', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                <Zap size={16} /> TEAM B ({teamBParticipants.length} / {Math.floor(capacity.total / 2)})
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {teamBParticipants.map((p) => {
                                    const uid = p.user?._id || p.user?.id;
                                    return (
                                        <div
                                            key={p.id || uid}
                                            onClick={() => uid ? navigate(`/athlete/${uid}`) : setSelectedParticipantForPreview(p)}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-dark, #F6F7F5)', borderRadius: '10px', cursor: 'pointer' }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img
                                                    src={p.user?.photos?.[0]?.url || p.user?.photos?.[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                                                    alt={p.user?.name}
                                                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '0.88rem', color: 'var(--text-main, #171817)' }}>{p.user?.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#e11d48' }}>{p.position || p.role || 'Player'}</div>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #626762)' }}>
                                                Level {p.user?.skill_level || 3}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals & Popovers */}
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
                matchContext={`Playing in: ${match.sport} ${match.format || ''} match at ${match.locationName}`}
                isOpen={!!selectedParticipantForPreview}
                onClose={() => setSelectedParticipantForPreview(null)}
            />

            <style dangerouslySetInnerHTML={{__html: `
                @media (max-width: 880px) {
                    .match-room-hero-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .match-roster-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}} />
        </div>
    );
}
