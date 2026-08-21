import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatchRoom, useJoinMatchRoom, useLeaveMatchRoom, useRemoveMatchParticipant } from '../hooks/queries/useMatchRoom';
import { useAuth } from '../context/AuthContext';

import MatchHeader from '../components/MatchHeader';
import MatchSummarySidebar from '../components/MatchSummarySidebar';
import FootballPitch from '../components/FootballPitch';
import JoinMatchModal from '../components/JoinMatchModal';
import PlayerPreviewModal from '../components/PlayerPreviewModal';
import OrganizerControls from '../components/OrganizerControls';

import { Shield, Zap, Info, FileText } from 'lucide-react';

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
                <div className="spin" style={{ width: '36px', height: '36px', border: '3px solid var(--border-color, #333)', borderTopColor: 'var(--primary, #38bdf8)', borderRadius: '50%' }} />
            </div>
        );
    }

    if (error || !roomData) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <h2>Match Not Found</h2>
                <p style={{ color: 'var(--text-muted, #aaa)' }}>This match may have been cancelled or deleted.</p>
                <button onClick={() => navigate('/discover')} style={{ marginTop: '1rem', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary, #38bdf8)', color: '#000', border: 'none', fontWeight: 'bold' }}>
                    Back to Matches
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
        if (window.confirm('Are you sure you want to leave this match? Your position slot will be freed.')) {
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

            {/* ABOVE THE FOLD — 2-Column Hero Layout (72% Pitch Left / 28% Sidebar Right) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2.4fr) minmax(0, 1fr)',
                gap: '1.5rem',
                alignItems: 'start'
            }} className="match-room-hero-grid">
                
                {/* LEFT HERO: Large Football Pitch (70-75% Width) */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-main, #fff)', letterSpacing: '0.5px' }}>
                            TACTICAL LINEUP
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #aaa)' }}>
                            Tap any player to view athlete profile
                        </span>
                    </div>

                    <FootballPitch
                        format={match.format || '5-a-side'}
                        participants={participants}
                        onSelectPlayer={(p) => setSelectedParticipantForPreview(p)}
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
                        onSelectParticipant={(p) => setSelectedParticipantForPreview(p)}
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
                    background: 'var(--card-bg, #1a1a1a)',
                    border: '1px solid var(--border-color, #2d2d2d)',
                    borderRadius: '16px',
                    padding: '1.25rem'
                }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main, #fff)', marginBottom: '0.75rem', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Info size={16} color="var(--primary, #38bdf8)" /> ABOUT THIS MATCH
                    </div>
                    
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #ccc)', margin: 0, lineHeight: 1.5 }}>
                        {match.description || 'Casual 5-a-side match. All skill levels welcome. Please arrive 10 minutes before kickoff.'}
                    </p>

                    {match.rules && (
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color, #2d2d2d)' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main, #fff)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FileText size={14} color="var(--primary, #38bdf8)" /> Match Rules
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #aaa)', margin: 0 }}>{match.rules}</p>
                        </div>
                    )}
                </div>

                {/* Detailed Roster Section */}
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main, #fff)', marginBottom: '1rem', letterSpacing: '0.5px' }}>
                        FULL ATHLETE ROSTER
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="match-roster-grid">
                        
                        {/* Team A Roster Cards */}
                        <div style={{ background: 'var(--card-bg, #1a1a1a)', border: '1px solid var(--border-color, #2d2d2d)', borderRadius: '16px', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                <Shield size={16} /> TEAM A ({teamAParticipants.length} / 5)
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {teamAParticipants.map((p) => (
                                    <div
                                        key={p.id || p.user?._id || p.user?.id}
                                        onClick={() => setSelectedParticipantForPreview(p)}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', cursor: 'pointer' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img
                                                src={p.user?.photos?.[0]?.url || p.user?.photos?.[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                                                alt={p.user?.name}
                                                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.88rem', color: 'var(--text-main, #fff)' }}>{p.user?.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Match Position: {p.position}</div>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #aaa)' }}>
                                            Level {p.user?.skill_level || 3}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Team B Roster Cards */}
                        <div style={{ background: 'var(--card-bg, #1a1a1a)', border: '1px solid var(--border-color, #2d2d2d)', borderRadius: '16px', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f43f5e', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                <Zap size={16} /> TEAM B ({teamBParticipants.length} / 5)
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {teamBParticipants.map((p) => (
                                    <div
                                        key={p.id || p.user?._id || p.user?.id}
                                        onClick={() => setSelectedParticipantForPreview(p)}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', cursor: 'pointer' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img
                                                src={p.user?.photos?.[0]?.url || p.user?.photos?.[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                                                alt={p.user?.name}
                                                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.88rem', color: 'var(--text-main, #fff)' }}>{p.user?.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#f43f5e' }}>Match Position: {p.position}</div>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #aaa)' }}>
                                            Level {p.user?.skill_level || 3}
                                        </span>
                                    </div>
                                ))}
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
                matchContext={`Playing in: ${match.sport} ${match.format || '5-a-side'} match at ${match.locationName}`}
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
