import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getUserProfile, getUserConnections, sendConnectionRequest, acceptConnection } from '../services/api';
import { MapPin, Clock, Award, Activity, ChevronLeft, ChevronRight, User, Check, MessageCircle, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('meet_user') || '{}');
  const currentUserId = user.id || 'u1';
  const userId = id || currentUserId;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('not_connected'); // not_connected, pending, accepted
  const [connectionId, setConnectionId] = useState(null);
  
  const matchContext = location.state?.matchContext;

  useEffect(() => {
    const fetchProfileAndConnection = async () => {
      try {
        const res = await getUserProfile(userId);
        setProfile(res.data);
        
        if (userId !== currentUserId) {
            const connRes = await getUserConnections(currentUserId);
            const conn = connRes.data.find(c => c.senderId === userId || c.receiverId === userId);
            if (conn) {
                setConnectionStatus(conn.status);
                setConnectionId(conn.id);
            }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndConnection();
  }, [userId]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;
  if (!profile) return <div style={{ padding: '2rem', textAlign: 'center' }}>Profile not found</div>;

  const nextPhoto = () => setCurrentPhoto(p => (p + 1) % profile.photos.length);
  const prevPhoto = () => setCurrentPhoto(p => (p - 1 + profile.photos.length) % profile.photos.length);

  const handleConnect = async () => {
      try {
          const res = await sendConnectionRequest(currentUserId, userId);
          setConnectionStatus('pending');
          setConnectionId(res.data.id);
      } catch (err) {
          console.error("Error sending connection request", err);
      }
  };

  const handleMessage = () => {
      if (connectionStatus === 'accepted') {
          navigate(`/dm/${userId}`, { state: { matchContext, profileName: profile.name } });
      }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Photo Carousel (Tinder Style) */}
      <div style={{ position: 'relative', width: '100%', height: '450px', background: '#000' }}>
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentPhoto}
            src={profile.photos[currentPhoto]} 
            alt={profile.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AnimatePresence>
        
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>{profile.name}, {profile.age || 20}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.9 }}>
            <MapPin size={16} /> {profile.location_name}
          </div>
        </div>

        {profile.photos.length > 1 && (
          <>
            <button onClick={prevPhoto} style={{ position: 'absolute', left: '10px', top: '50%', background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', borderRadius: '50%', padding: '5px' }}><ChevronLeft size={24} /></button>
            <button onClick={nextPhoto} style={{ position: 'absolute', right: '10px', top: '50%', background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', borderRadius: '50%', padding: '5px' }}><ChevronRight size={24} /></button>
            <div style={{ position: 'absolute', top: '10px', width: '100%', display: 'flex', gap: '4px', padding: '0 10px' }}>
              {profile.photos.map((_, i) => (
                <div key={i} style={{ flex: 1, height: '4px', background: i === currentPhoto ? 'white' : 'rgba(255,255,255,0.3)', borderRadius: '2px' }} />
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* Play Stats */}
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
            <div className="glass-card" style={{ flex: 1, textAlign: 'center', padding: '1rem', marginBottom: 0 }}>
              <Award size={20} color="var(--primary)" style={{ marginBottom: '4px' }} />
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Level</p>
              <p style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{profile.play_level}</p>
            </div>
            <div className="glass-card" style={{ flex: 1, textAlign: 'center', padding: '1rem', marginBottom: 0 }}>
              <Clock size={20} color="var(--primary)" style={{ marginBottom: '4px' }} />
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Timing</p>
              <p style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.8rem' }}>{profile.preferred_time}</p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Sports I Play</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profile.sports.map(sport => (
              <span key={sport} className="badge badge-skill" style={{ padding: '8px 16px' }}>{sport}</span>
            ))}
          </div>
        </section>

        {/* Match Context Notice */}
        {matchContext && (
            <div style={{ marginBottom: '1.5rem', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '12px', color: 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} />
                {matchContext}
            </div>
        )}

        {/* Action Buttons */}
        {userId !== currentUserId && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                  onClick={connectionStatus === 'not_connected' ? handleConnect : undefined}
                  disabled={connectionStatus === 'pending'}
                  className="glass-card" 
                  style={{ 
                      flex: 1, 
                      background: connectionStatus === 'accepted' ? 'rgba(16,185,129,0.2)' : 'var(--primary)', 
                      color: connectionStatus === 'accepted' ? 'var(--success)' : 'black', 
                      border: 'none', 
                      fontWeight: 'bold', 
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: connectionStatus === 'pending' ? 0.6 : 1,
                      cursor: connectionStatus === 'not_connected' ? 'pointer' : 'default'
                  }}
              >
                  {connectionStatus === 'not_connected' && <><UserPlus size={18} /> Connect</>}
                  {connectionStatus === 'pending' && 'Request Sent'}
                  {connectionStatus === 'accepted' && <><Check size={18} /> Connected</>}
              </button>
              <button 
                  onClick={handleMessage}
                  disabled={connectionStatus !== 'accepted'}
                  className="glass-card" 
                  style={{ 
                      flex: 1, 
                      background: 'var(--glass)', 
                      color: connectionStatus === 'accepted' ? 'var(--text-main)' : 'var(--text-muted)', 
                      border: '1px solid var(--glass-border)', 
                      fontWeight: 'bold', 
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: connectionStatus === 'accepted' ? 1 : 0.5,
                      cursor: connectionStatus === 'accepted' ? 'pointer' : 'not-allowed'
                  }}
              >
                  <MessageCircle size={18} /> Message
              </button>
            </div>
        )}
        
        {userId === currentUserId && (
            <button 
                className="glass-card" 
                style={{ 
                    width: '100%', 
                    background: 'var(--glass)', 
                    color: 'var(--text-main)', 
                    border: '1px solid var(--glass-border)', 
                    fontWeight: 'bold', 
                    padding: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                }}
            >
                Edit Profile
            </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
