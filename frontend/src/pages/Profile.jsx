import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { sendConnectionRequest, acceptConnection, getUserConnections } from '../services/api';
import { useProfile } from '../hooks/queries/useUsers';
import { MapPin, Clock, Award, Activity, ChevronLeft, ChevronRight, User, Check, MessageCircle, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isOwnProfile = !id || id === user?.id;
  const userId = id || user?.id;
  const currentUserId = user?.id;

  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('not_connected'); // not_connected, pending, accepted
  const [connectionId, setConnectionId] = useState(null);
  
  const matchContext = location.state?.matchContext;

  const { data: profile, isLoading: loading } = useProfile(userId);

  useEffect(() => {
    const fetchConnection = async () => {
      if (userId && currentUserId && userId !== currentUserId) {
        try {
            const connRes = await getUserConnections(currentUserId);
            const conn = connRes.data.find(c => c.senderId === userId || c.receiverId === userId);
            if (conn) {
                setConnectionStatus(conn.status);
                setConnectionId(conn.id);
            }
        } catch (err) {
            console.error(err);
        }
      }
    };
    fetchConnection();
  }, [userId, currentUserId]);

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
    <div className="profile-layout" style={{ minHeight: '100vh', padding: '2rem 1.5rem 100px 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Photo Carousel (Tinder Style for mobile, Fixed container for Desktop) */}
      <div className="profile-photo-container">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentPhoto}
            src={profile.photos && profile.photos.length > 0 ? profile.photos[currentPhoto].url || profile.photos[currentPhoto] : 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=800'} 
            alt={profile.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AnimatePresence>
        
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>{profile.name}{profile.age ? `, ${profile.age}` : ''}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.9 }}>
            <MapPin size={16} /> {profile.locationName || 'Unknown Location'}
          </div>
        </div>

        {profile.photos && profile.photos.length > 1 && (
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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Compatibility Score */}
        {userId !== currentUserId && (
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>Compatibility</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Based on sports & location</p>
            </div>
            <div style={{ background: 'var(--primary)', color: 'black', padding: '10px 15px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={18} />
              {/* Simple mock compatibility score for now, could be dynamic */}
              {Math.floor(Math.random() * (98 - 75) + 75)}%
            </div>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <div className="glass-card">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>About Me</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{profile.bio}</p>
          </div>
        )}

        {/* Play Stats / Sports hierarchy */}
        <section>
          <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Sports I Play</h2>
              {profile.sports && profile.sports.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {profile.sports.map((sportObj, i) => (
                    <div key={i} style={{ padding: '12px', background: 'var(--background-color)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>{sportObj.sport}</span>
                          <span className="badge badge-skill">{sportObj.skillLevel}</span>
                        </div>
                        {sportObj.positions && sportObj.positions.length > 0 && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <span style={{ fontWeight: '600' }}>Roles:</span> {sportObj.positions.join(', ')}
                          </div>
                        )}
                        {sportObj.experienceYears && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <span style={{ fontWeight: '600' }}>Experience:</span> {sportObj.experienceYears} yrs
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No sports added yet.</p>
              )}
          </div>

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Interests</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile.interests.map((interest, i) => (
                  <span key={i} className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '20px' }}>
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Match Context Notice */}
        {matchContext && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '12px', color: 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: connectionStatus === 'pending' ? 0.6 : 1,
                      cursor: connectionStatus === 'not_connected' ? 'pointer' : 'default',
                      marginBottom: 0
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
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: connectionStatus === 'accepted' ? 1 : 0.5,
                      cursor: connectionStatus === 'accepted' ? 'pointer' : 'not-allowed',
                      marginBottom: 0
                  }}
              >
                  <MessageCircle size={18} /> Message
              </button>
            </div>
        )}
        
        {userId === currentUserId && (
            <button 
                onClick={() => navigate('/profile/edit')}
                className="glass-card" 
                style={{ 
                    width: '100%', 
                    background: 'var(--glass)', 
                    color: 'var(--text-main)', 
                    border: '1px solid var(--glass-border)', 
                    fontWeight: 'bold', 
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginBottom: 0
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
