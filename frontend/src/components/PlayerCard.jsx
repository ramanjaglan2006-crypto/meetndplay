import React from 'react';
import { MapPin, Star, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PlayerCard = ({ player, isAIRecommendation = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}
    >
      {isAIRecommendation && (
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            background: 'var(--accent)', 
            padding: '4px 12px', 
            fontSize: '0.6rem', 
            fontWeight: 'bold',
            borderBottomLeftRadius: '12px'
          }}
        >
          AI MATCH
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '15px', 
          background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          {player.name.charAt(0)}
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{player.name}</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--primary)' }}>{player.sport_type}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={14} fill="currentColor" color="var(--warning)" /> {player.skill_level}
            </span>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '1rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <MapPin size={14} /> 1.2 km away
        </div>
        <button 
          className="glass-card" 
          style={{ 
            padding: '8px 16px', 
            background: 'rgba(255,255,255,0.05)', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '0.85rem',
            marginBottom: 0
          }}
        >
          <MessageCircle size={16} color="var(--primary)" />
          Invite
        </button>
      </div>
    </motion.div>
  );
};

export default PlayerCard;
