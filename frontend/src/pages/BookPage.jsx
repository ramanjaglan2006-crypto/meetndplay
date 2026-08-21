import React, { useState } from 'react';
import { MapPin, Clock, Star, ShieldCheck, Sparkles } from 'lucide-react';

const MOCK_VENUES = [
    { id: 'v1', name: 'Power Play Arena', sport: 'Football', location: 'MP Nagar, Bhopal', rating: 4.8, price: '₹1,200/hr', image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=400', amenities: ['Night Floodlights', 'Parking', 'Changing Rooms'] },
    { id: 'v2', name: 'City Cricket Turf', sport: 'Cricket', location: 'Arera Colony, Bhopal', rating: 4.7, price: '₹1,500/hr', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=400', amenities: ['Box Cricket Nets', 'Equipment Rental', 'Cafeteria'] },
    { id: 'v3', name: 'Smash Shuttle Club', sport: 'Badminton', location: 'Gulmohar, Bhopal', rating: 4.9, price: '₹400/hr', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=400', amenities: ['Wooden Courts', 'Air Conditioned', 'Pro Shop'] },
    { id: 'v4', name: 'Grand Slam Tennis Hub', sport: 'Tennis', location: 'Kolar Road, Bhopal', rating: 4.6, price: '₹600/hr', image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=400', amenities: ['Synthetic Hard Courts', 'Coaching Available'] }
];

export default function BookPage() {
    const [selectedSport, setSelectedSport] = useState('All');

    const filteredVenues = selectedSport === 'All' ? MOCK_VENUES : MOCK_VENUES.filter(v => v.sport.toLowerCase() === selectedSport.toLowerCase());

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem' }}>
            
            {/* Page Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-soft, #FFF3C7)', color: 'var(--primary-dark, #E5A900)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 'bold', marginBottom: '8px' }}>
                    <Sparkles size={13} /> VENUE DISCOVERY & BOOKING — COMING SOON
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main, #171817)', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                    BOOK — Find Your Court. Book Your Game.
                </h1>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted, #626762)', margin: 0 }}>
                    Discover top-rated sports turfs, courts, and complexes near you.
                </p>
            </div>

            {/* Sport Category Filter */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
                {['All', 'Football', 'Cricket', 'Badminton', 'Tennis', 'Pickleball', 'Basketball'].map((sport) => (
                    <button
                        key={sport}
                        onClick={() => setSelectedSport(sport)}
                        style={{
                            padding: '8px 18px',
                            borderRadius: '30px',
                            background: selectedSport === sport ? 'var(--primary, #F5B91E)' : 'var(--card-bg, #ffffff)',
                            color: selectedSport === sport ? '#000' : 'var(--text-main, #171817)',
                            border: `1px solid ${selectedSport === sport ? 'var(--primary, #F5B91E)' : 'var(--border-color, #E3E6E2)'}`,
                            fontWeight: 'bold',
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {sport}
                    </button>
                ))}
            </div>

            {/* Venue Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {filteredVenues.map((v) => (
                    <div
                        key={v.id}
                        style={{
                            background: 'var(--card-bg, #ffffff)',
                            border: '1px solid var(--border-color, #E3E6E2)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ position: 'relative', height: '160px' }}>
                            <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                COMING SOON
                            </span>
                        </div>

                        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main, #171817)', margin: 0 }}>{v.name}</h3>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', fontWeight: 'bold', color: '#f59e0b' }}>
                                        <Star size={14} fill="#f59e0b" /> {v.rating}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted, #626762)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                                    <MapPin size={13} /> {v.location}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                                    {v.amenities.map((am, i) => (
                                        <span key={i} style={{ fontSize: '0.72rem', background: 'var(--bg-dark, #F6F7F5)', color: 'var(--text-muted, #626762)', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>
                                            {am}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color, #E3E6E2)' }}>
                                <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-main, #171817)' }}>{v.price}</span>
                                <button
                                    disabled
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '10px',
                                        background: 'var(--bg-dark, #F6F7F5)',
                                        color: 'var(--text-muted, #626762)',
                                        border: '1px solid var(--border-color, #E3E6E2)',
                                        fontWeight: 'bold',
                                        fontSize: '0.8rem',
                                        cursor: 'default'
                                    }}
                                >
                                    Book Now — Soon
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
