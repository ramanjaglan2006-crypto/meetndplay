import React from 'react';
import { MapPin, Clock, ShieldAlert } from 'lucide-react';

const VENUE_CATEGORIES = [
    { name: 'Football Turfs', icon: '⚽', count: '12 Turfs Available' },
    { name: 'Cricket Grounds', icon: '🏏', count: '8 Grounds' },
    { name: 'Tennis Courts', icon: '🎾', count: '6 Courts' },
    { name: 'Badminton Courts', icon: '🏸', count: '15 Indoor Courts' },
    { name: 'Pickleball Courts', icon: '🥒', count: '5 Courts' },
    { name: 'Basketball Courts', icon: '🏀', count: '7 Complexes' }
];

const BookVenues = () => {
    return (
        <section style={{ marginBottom: '2.5rem' }}>
            <div style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid var(--border-color, #2d2d2d)',
                borderRadius: '20px',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>
                            <Clock size={12} /> VENUE DISCOVERY & BOOKING — COMING SOON
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main, #fff)', margin: 0 }}>
                            BOOK YOUR SPORTS VENUE
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted, #aaa)', margin: '4px 0 0 0' }}>
                            Find and reserve top turfs, courts, and complexes in your city.
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.08)',
                            color: 'var(--text-muted, #aaa)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            cursor: 'default'
                        }}
                    >
                        Explore Venues — Coming Soon
                    </button>
                </div>

                {/* Venue Category Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                    {VENUE_CATEGORIES.map((cat, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '14px',
                                padding: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start'
                            }}
                        >
                            <span style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{cat.icon}</span>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main, #fff)' }}>{cat.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #aaa)', marginTop: '2px' }}>{cat.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BookVenues;
