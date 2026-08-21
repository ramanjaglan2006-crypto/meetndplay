import React from 'react';
import { PlayCircle, MapPin, Users } from 'lucide-react';

const ProductNavigation = ({ activeTab = 'PLAY', onTabChange }) => {
    return (
        <div style={{
            display: 'flex',
            justify: 'center',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--card-bg, #1a1a1a)',
            padding: '6px',
            borderRadius: '50px',
            border: '1px solid var(--border-color, #2d2d2d)',
            width: 'fit-content',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
            <button
                type="button"
                onClick={() => onTabChange('PLAY')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 22px',
                    borderRadius: '30px',
                    background: activeTab === 'PLAY' ? 'var(--primary, #38bdf8)' : 'transparent',
                    color: activeTab === 'PLAY' ? '#000' : 'var(--text-muted, #aaa)',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <PlayCircle size={16} /> PLAY
            </button>

            <button
                type="button"
                onClick={() => onTabChange('BOOK')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 22px',
                    borderRadius: '30px',
                    background: activeTab === 'BOOK' ? 'var(--primary, #38bdf8)' : 'transparent',
                    color: activeTab === 'BOOK' ? '#000' : 'var(--text-muted, #aaa)',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <MapPin size={16} /> BOOK
            </button>

            <button
                type="button"
                onClick={() => onTabChange('CONNECT')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 22px',
                    borderRadius: '30px',
                    background: activeTab === 'CONNECT' ? 'var(--primary, #38bdf8)' : 'transparent',
                    color: activeTab === 'CONNECT' ? '#000' : 'var(--text-muted, #aaa)',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <Users size={16} /> CONNECT
            </button>
        </div>
    );
};

export default ProductNavigation;
