import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCommunities } from '../services/api';
import { Users, ChevronRight, MessageSquare } from 'lucide-react';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCommunities().then(res => setCommunities(res.data));
  }, []);

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '80px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Communities</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join groups from your college or city.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {communities.map((comm) => (
          <div 
            key={comm.id} 
            className="glass-card" 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/discord')}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px', 
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Users size={24} color="var(--primary)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>{comm.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{comm.sport} • {comm.members.length} Members</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: '10px' }}>Active</span>
                <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Communities;
