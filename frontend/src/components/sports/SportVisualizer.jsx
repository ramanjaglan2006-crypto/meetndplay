import React from 'react';
import FootballPitch from '../FootballPitch';
import BadmintonCourt from './BadmintonCourt';
import TennisCourt from './TennisCourt';
import PickleballCourt from './PickleballCourt';
import CricketField from './CricketField';

const SportVisualizer = ({
    match = {},
    participants = [],
    onSelectPlayer,
    onSelectEmptySlot
}) => {
    const sportName = (match.sport || 'Football').toLowerCase();

    if (sportName.includes('badminton')) {
        return (
            <BadmintonCourt
                participants={participants}
                onSelectPlayer={onSelectPlayer}
                onSelectEmptySlot={onSelectEmptySlot}
            />
        );
    }

    if (sportName.includes('tennis') && !sportName.includes('table')) {
        return (
            <TennisCourt
                participants={participants}
                onSelectPlayer={onSelectPlayer}
                onSelectEmptySlot={onSelectEmptySlot}
            />
        );
    }

    if (sportName.includes('pickleball')) {
        return (
            <PickleballCourt
                participants={participants}
                onSelectPlayer={onSelectPlayer}
                onSelectEmptySlot={onSelectEmptySlot}
            />
        );
    }

    if (sportName.includes('cricket')) {
        return (
            <CricketField
                match={match}
                participants={participants}
                onSelectPlayer={onSelectPlayer}
                onSelectEmptySlot={onSelectEmptySlot}
            />
        );
    }

    // Default: Football Pitch
    return (
        <FootballPitch
            format={match.format || '5-a-side'}
            participants={participants}
            onSelectPlayer={onSelectPlayer}
            onSelectEmptySlot={onSelectEmptySlot}
        />
    );
};

export default SportVisualizer;
