import React from 'react';
import { Play, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomeHero = ({ onPlayNow, onExploreAthletes }) => {
    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid var(--border-color, #2d2d2d)',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            marginBottom: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                borderRadius: '20px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--primary, #38bdf8)',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
                <Sparkles size={14} /> Find your people. Play your sport.
            </div>

            <h1 style={{
                fontSize: '2.6rem',
                fontWeight: '900',
                margin: '0 0 0.75rem 0',
                color: '#fff',
                letterSpacing: '-0.5px',
                lineHeight: 1.15
            }}>
                PLAY. BOOK. CONNECT.
            </h1>

            <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-muted, #aaa)',
                maxWidth: '560px',
                margin: '0 auto 1.75rem auto',
                lineHeight: 1.5
            }}>
                Your next game is closer than you think. Find players, join active matches, and discover your local sports community.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                    onClick={onPlayNow}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 28px',
                        borderRadius: '12px',
                        background: 'var(--primary, #38bdf8)',
                        color: '#000',
                        border: 'none',
                        fontWeight: '800',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)'
                    }}
                >
                    <Play size={16} fill="#000" /> PLAY NOW
                </button>

                <button
                    onClick={onExploreAthletes}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 28px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.15)',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        cursor: 'pointer'
                    }}
                >
                    <Users size={16} /> EXPLORE ATHLETES
                </button>
            </div>
        </div>
    );
};

export default HomeHero;
