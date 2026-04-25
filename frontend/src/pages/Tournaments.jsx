import React, { useState, useEffect } from 'react';
import { getTournaments, registerTournament } from '../services/api';
import { Trophy, Calendar, MapPin, Users, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTournaments = async () => {
    try {
      const res = await getTournaments();
      setTournaments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleRegister = async (tId) => {
    const teamName = prompt("Enter your Team Name:");
    if (!teamName) return;
    try {
      await registerTournament(tId, teamName);
      alert(`Team ${teamName} registered successfully!`);
      fetchTournaments();
    } catch (err) {
      alert("Registration failed");
    }
  };

  const active = tournaments.filter(t => t.status === 'active');
  const upcoming = tournaments.filter(t => t.status === 'upcoming');

  const TournamentCard = ({ t }) => (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '4px' }}>{t.name}</h3>
          <span className="badge badge-skill" style={{ fontSize: '0.6rem' }}>{t.sport}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>{t.prizePool}</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Prize Pool</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={14} color="var(--primary)" /> Starts: {new Date(t.startDate).toLocaleDateString()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={14} color="var(--primary)" /> {t.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={14} color="var(--primary)" /> {t.teamsRegistered.length} Teams Registered
        </div>
      </div>

      <button 
        onClick={() => handleRegister(t.id)}
        style={{ 
          width: '100%', 
          padding: '10px', 
          background: 'var(--primary)', 
          color: 'black', 
          border: 'none', 
          borderRadius: '8px', 
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Register Team ({t.entryFee})
      </button>
    </div>
  );

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '100px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>Tournaments</h1>
        <button className="glass-card" style={{ padding: '10px', borderRadius: '12px', marginBottom: 0 }}>
          <PlusCircle size={20} color="var(--primary)" />
        </button>
      </header>

      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <Trophy size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Active Now</h2>
        </div>
        {active.map(t => <TournamentCard key={t.id} t={t} />)}
        {active.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No live tournaments</p>}
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <Calendar size={20} color="var(--accent)" />
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Upcoming</h2>
        </div>
        {upcoming.map(t => <TournamentCard key={t.id} t={t} />)}
      </section>
    </div>
  );
};

export default Tournaments;
