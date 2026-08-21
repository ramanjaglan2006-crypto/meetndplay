import React from 'react';
import MatchCard from '../MatchCard';
import { Sparkles } from 'lucide-react';

const PickedForYou = ({ matches = [], currentUserId }) => {
    if (!matches || matches.length === 0) return null;

    return (
        <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Sparkles size={18} color="var(--primary, #38bdf8)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main, #fff)', margin: 0 }}>
                    PICKED FOR YOU
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #aaa)', marginLeft: '4px' }}>
                    Based on your active sports & location
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {matches.slice(0, 3).map((match) => (
                    <MatchCard
                        key={match._id || match.id}
                        match={match}
                        currentUserId={currentUserId}
                    />
                ))}
            </div>
        </section>
    );
};

export default PickedForYou;
