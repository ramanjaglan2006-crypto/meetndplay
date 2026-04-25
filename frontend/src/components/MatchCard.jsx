import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, AlertCircle, ChevronDown, ChevronUp, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { joinMatch, leaveMatch, getMatchPlayers, inviteToMatch, getDiscoverUsers } from '../services/api';

const InviteModal = ({ matchId, currentUserId, onClose }) => {
    const [players, setPlayers] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        // Fetch 12 potential invites
        getDiscoverUsers(currentUserId, 22.7, 75.8, 1).then(res => setPlayers(res.data));
    }, [currentUserId]);

    const handleInvite = async () => {
        await inviteToMatch(matchId, selected);
        onClose();
        alert("Invites sent successfully!");
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '16px', width: '90%', maxWidth: '400px', maxHeight: '80vh', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ marginBottom: '1rem' }}>Invite Players</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, marginBottom: '1rem' }}>
                    {players.map(p => (
                        <div key={p.id} onClick={() => setSelected(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: selected.includes(p.id) ? 'rgba(16, 185, 129, 0.2)' : 'var(--glass)', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--glass-border)' }}>
                            <img src={p.photos[0]} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} alt=""/>
                            <div style={{ flex: 1, fontWeight: 'bold' }}>{p.name} <div style={{ fontWeight: 'normal', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Level {p.skill_level}</div></div>
                            {selected.includes(p.id) && <div style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</div>}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'var(--glass)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleInvite} disabled={selected.length === 0} style={{ flex: 1, padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: selected.length > 0 ? 'pointer' : 'not-allowed', opacity: selected.length > 0 ? 1 : 0.5 }}>Send Invites</button>
                </div>
            </div>
        </div>
    );
};

const MatchCard = ({ match, currentUserId }) => {
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(match.joinedPlayers.includes(currentUserId));
  const [joinedCount, setJoinedCount] = useState(match.joinedPlayers.length);
  const [isLoading, setIsLoading] = useState(false);
  
  const [showRoster, setShowRoster] = useState(false);
  const [roster, setRoster] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const slotsLeft = match.totalPlayers - joinedCount;
  
  useEffect(() => {
    setIsJoined(match.joinedPlayers.includes(currentUserId));
    setJoinedCount(match.joinedPlayers.length);
  }, [match.joinedPlayers, currentUserId]);
  
  const matchTime = new Date(match.dateTime).getTime();
  const now = Date.now();
  const isUrgent = (matchTime - now) < (3 * 60 * 60 * 1000) && (matchTime - now) > 0;

  const handleToggleJoin = async () => {
    if (isLoading) return;
    if (!isJoined && slotsLeft <= 0) return;

    const willJoin = !isJoined;
    setIsJoined(willJoin);
    setJoinedCount(prev => willJoin ? prev + 1 : prev - 1);
    setIsLoading(true);

    try {
      if (willJoin) await joinMatch(match.id, currentUserId);
      else await leaveMatch(match.id, currentUserId);
    } catch (err) {
      console.error(err);
      setIsJoined(!willJoin);
      setJoinedCount(prev => willJoin ? prev - 1 : prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRoster = async () => {
      setShowRoster(!showRoster);
      if (!showRoster) {
          const res = await getMatchPlayers(match.id);
          setRoster(res.data);
      }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
      style={{ marginBottom: '1rem', borderLeft: isUrgent ? '4px solid var(--secondary)' : '1px solid var(--glass-border)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{match.sport}</h3>
            {isUrgent && (
              <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.2)', color: 'var(--secondary)', fontSize: '0.6rem' }}>
                <AlertCircle size={10} style={{ marginRight: '4px' }} /> URGENT
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <MapPin size={14} /> {match.location}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>
            {slotsLeft > 0 ? `${slotsLeft} Players Needed` : 'Match Full'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {joinedCount}/{match.totalPlayers} Joined
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} color="var(--primary)" /> {new Date(match.dateTime).toLocaleDateString()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} color="var(--primary)" /> {new Date(match.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div 
            onClick={toggleRoster}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '50px', gap: '6px', fontSize: '0.8rem' }}
        >
          {showRoster ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          Roster
        </div>

        <button 
          onClick={handleToggleJoin}
          className="glass-card"
          disabled={isLoading || (!isJoined && slotsLeft <= 0)}
          style={{ 
            padding: '8px 20px', 
            background: isJoined ? (isLoading ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)') : (slotsLeft === 0 ? 'rgba(255,255,255,0.05)' : 'var(--primary)'),
            color: isJoined ? 'var(--success)' : 'white',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: 0,
            cursor: isLoading || (!isJoined && slotsLeft <= 0) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          {isLoading 
            ? 'Updating...' 
            : isJoined 
              ? 'Leave Match' 
              : slotsLeft === 0 
                ? 'Full' 
                : 'Join Match'
          }
        </button>
      </div>

      {showRoster && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Registered Players</h4>
                  {isJoined && (
                      <button onClick={() => setShowInviteModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--glass)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '50px', fontSize: '0.75rem', cursor: 'pointer' }}>
                          <UserPlus size={14} /> Invite
                      </button>
                  )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {roster.map(player => (
                      <div 
                          key={player.id} 
                          onClick={() => navigate(`/profile/${player.id}`, { state: { matchContext: `Playing in: ${match.sport} match at ${match.location}` } })}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      >
                          <img src={player.photos[0]} alt={player.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 'bold' }}>{player.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Lvl {player.skill_level}</div>
                      </div>
                  ))}
                  {roster.length === 0 && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading...</div>}
              </div>
          </motion.div>
      )}

      {showInviteModal && <InviteModal matchId={match.id} currentUserId={currentUserId} onClose={() => setShowInviteModal(false)} />}
    </motion.div>
  );
};

export default MatchCard;
