import React from 'react';

const SPORTS = [
    { key: 'All', label: 'All Sports', icon: '⚡' },
    { key: 'Football', label: 'Football', icon: '⚽' },
    { key: 'Cricket', label: 'Cricket', icon: '🏏' },
    { key: 'Tennis', label: 'Tennis', icon: '🎾' },
    { key: 'Badminton', label: 'Badminton', icon: '🏸' },
    { key: 'Pickleball', label: 'Pickleball', icon: '🥒' },
    { key: 'Basketball', label: 'Basketball', icon: '🏀' },
    { key: 'Volleyball', label: 'Volleyball', icon: '🏐' }
];

const SportSelector = ({ selectedSport = 'All', onSelectSport }) => {
    return (
        <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '1.75rem',
            scrollbarWidth: 'none'
        }}>
            {SPORTS.map((s) => {
                const isSelected = selectedSport.toLowerCase() === s.key.toLowerCase();
                return (
                    <button
                        key={s.key}
                        type="button"
                        onClick={() => onSelectSport(s.key)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 18px',
                            borderRadius: '30px',
                            background: isSelected ? 'var(--primary, #38bdf8)' : 'var(--card-bg, #1a1a1a)',
                            color: isSelected ? '#000' : 'var(--text-main, #fff)',
                            border: `1px solid ${isSelected ? 'var(--primary, #38bdf8)' : 'var(--border-color, #2d2d2d)'}`,
                            fontWeight: 'bold',
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>{s.icon}</span>
                        <span>{s.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default SportSelector;
