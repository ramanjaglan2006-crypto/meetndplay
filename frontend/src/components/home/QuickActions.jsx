import React from 'react';
import { Search, PlusCircle, UserCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ onFindMatch }) => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '2rem'
        }}>
            <button
                type="button"
                onClick={onFindMatch}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: 'var(--card-bg, #1a1a1a)',
                    border: '1px solid var(--border-color, #2d2d2d)',
                    color: 'var(--text-main, #fff)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <Search size={18} color="var(--primary, #38bdf8)" /> Find a Match
            </button>

            <button
                type="button"
                onClick={() => navigate('/create')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: 'var(--card-bg, #1a1a1a)',
                    border: '1px solid var(--border-color, #2d2d2d)',
                    color: 'var(--text-main, #fff)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <PlusCircle size={18} color="#34d399" /> Host a Match
            </button>

            <button
                type="button"
                onClick={() => navigate('/discover')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: 'var(--card-bg, #1a1a1a)',
                    border: '1px solid var(--border-color, #2d2d2d)',
                    color: 'var(--text-main, #fff)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <UserCheck size={18} color="#c084fc" /> Find Athletes
            </button>

            <button
                type="button"
                onClick={() => navigate('/communities')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: 'var(--card-bg, #1a1a1a)',
                    border: '1px solid var(--border-color, #2d2d2d)',
                    color: 'var(--text-main, #fff)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <Users size={18} color="#fbbf24" /> Explore Communities
            </button>
        </div>
    );
};

export default QuickActions;
