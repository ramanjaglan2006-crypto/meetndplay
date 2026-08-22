import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { createMatch } from '../services/api';
import { queryKeys } from '../hooks/queries/queryKeys';
import {
    Trophy, Calendar, Clock, MapPin, Navigation, Shield, CheckCircle2,
    ArrowLeft, ArrowRight, Activity, Users, Lock, Eye, Sparkles, HelpCircle, Share2
} from 'lucide-react';

const SPORTS_LIST = [
    { id: 'Football', name: 'Football', icon: '⚽', desc: 'Find players for a 5-a-side, 7-a-side, or 11-a-side match.' },
    { id: 'Cricket', name: 'Cricket', icon: '🏏', desc: 'Create a box cricket or full pitch game and build your squad.' },
    { id: 'Tennis', name: 'Tennis', icon: '🎾', desc: 'Singles or doubles match on hard, clay, or grass court.' },
    { id: 'Badminton', name: 'Badminton', icon: '🏸', desc: 'Singles or doubles fast-paced indoor shuttle battle.' },
    { id: 'Pickleball', name: 'Pickleball', icon: '🥒', desc: 'Singles or doubles social game on non-volley kitchen court.' },
    { id: 'Basketball', name: 'Basketball', icon: '🏀', desc: '3v3 half-court or 5v5 full-court hoops battle.' },
    { id: 'Volleyball', name: 'Volleyball', icon: '🏐', desc: '6v6 beach or indoor volleyball spike session.' },
    { id: 'Table Tennis', name: 'Table Tennis', icon: '🏓', desc: 'Singles or doubles ping pong match.' }
];

const SPORT_FORMATS = {
    Football: [
        { name: '5-a-side', perTeam: 5, total: 10 },
        { name: '7-a-side', perTeam: 7, total: 14 },
        { name: '11-a-side', perTeam: 11, total: 22 },
        { name: 'Custom', perTeam: 5, total: 10 }
    ],
    Cricket: [
        { name: '6-a-side', perTeam: 6, total: 12 },
        { name: '8-a-side', perTeam: 8, total: 16 },
        { name: '11-a-side', perTeam: 11, total: 22 },
        { name: 'Custom', perTeam: 6, total: 12 }
    ],
    Tennis: [
        { name: 'Singles (1v1)', perTeam: 1, total: 2 },
        { name: 'Doubles (2v2)', perTeam: 2, total: 4 }
    ],
    Badminton: [
        { name: 'Singles (1v1)', perTeam: 1, total: 2 },
        { name: 'Doubles (2v2)', perTeam: 2, total: 4 }
    ],
    Pickleball: [
        { name: 'Singles (1v1)', perTeam: 1, total: 2 },
        { name: 'Doubles (2v2)', perTeam: 2, total: 4 }
    ],
    Basketball: [
        { name: '3v3 Half-Court', perTeam: 3, total: 6 },
        { name: '5v5 Full-Court', perTeam: 5, total: 10 }
    ],
    Volleyball: [
        { name: '6v6 Full-Court', perTeam: 6, total: 12 }
    ],
    'Table Tennis': [
        { name: 'Singles (1v1)', perTeam: 1, total: 2 },
        { name: 'Doubles (2v2)', perTeam: 2, total: 4 }
    ]
};

export default function CreateMatchPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [createdMatch, setCreatedMatch] = useState(null);
    const [formError, setFormError] = useState('');

    // Form State
    const [sport, setSport] = useState('Football');
    const [format, setFormat] = useState('5-a-side');
    const [customTeamSize, setCustomTeamSize] = useState(5);
    const [totalPlayers, setTotalPlayers] = useState(10);

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('18:00');
    const [durationMinutes, setDurationMinutes] = useState(60);

    const [locationName, setLocationName] = useState('');
    const [city, setCity] = useState('Bhopal');
    const [lat, setLat] = useState(23.2599);
    const [lon, setLon] = useState(77.4126);
    const [isGpsCaptured, setIsGpsCaptured] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skillLevel, setSkillLevel] = useState('3');
    const [matchType, setMatchType] = useState('Casual');
    const [visibility, setVisibility] = useState('public');
    const [approvalRequired, setApprovalRequired] = useState(false);

    // Dynamic Format Handler
    const handleSportChange = (selectedSport) => {
        setSport(selectedSport);
        const defaultFormats = SPORT_FORMATS[selectedSport] || SPORT_FORMATS.Football;
        setFormat(defaultFormats[0].name);
        setTotalPlayers(defaultFormats[0].total);
        if (title === '' || title.includes('Match')) {
            setTitle(`${defaultFormats[0].name} ${selectedSport} Match`);
        }
    };

    const handleFormatChange = (selectedFormatObj) => {
        setFormat(selectedFormatObj.name);
        setTotalPlayers(selectedFormatObj.total);
    };

    // Location GPS Permission Handler (only triggers explicitly on button click)
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLat(pos.coords.latitude);
                setLon(pos.coords.longitude);
                setIsGpsCaptured(true);
                setIsLocating(false);
                if (!locationName) setLocationName('Current GPS Location');
            },
            (err) => {
                setIsLocating(false);
                alert('Could not fetch location. Please enter your venue manually.');
            }
        );
    };

    // Step Validation
    const validateStep = () => {
        setFormError('');
        if (currentStep === 1 && !sport) {
            setFormError('Please select a sport');
            return false;
        }
        if (currentStep === 3) {
            if (!date) { setFormError('Please select a match date'); return false; }
            if (!time) { setFormError('Please select a start time'); return false; }
        }
        if (currentStep === 4 && !locationName.trim()) {
            setFormError('Please enter a location name or use current GPS location');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            if (currentStep === 1 && (!title || title.trim() === '')) {
                setTitle(`${format} ${sport} Match`);
            }
            setCurrentStep(prev => Math.min(prev + 1, 6));
        }
    };

    const handleBack = () => {
        setFormError('');
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Final Create Match Submission
    const handleCreateMatch = async () => {
        setFormError('');
        setIsSubmitting(true);

        const payload = {
            sport,
            format,
            title: title.trim() || `${format} ${sport} Match`,
            date,
            time,
            durationMinutes: parseInt(durationMinutes) || 60,
            locationName: locationName.trim() || `${city} Sports Arena`,
            city,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            totalPlayers: parseInt(totalPlayers) || 10,
            playersPerTeam: Math.ceil((parseInt(totalPlayers) || 10) / 2),
            skillLevel: parseInt(skillLevel) || 3,
            description,
            matchType,
            visibility,
            approvalRequired
        };

        try {
            const res = await createMatch(payload);
            const newMatchData = res.data;
            setCreatedMatch(newMatchData);
            
            // Invalidate React Query cache so newly created match immediately appears in feeds
            queryClient.invalidateQueries({ queryKey: queryKeys.matches.all() });
            setCurrentStep(7); // Success Step
        } catch (err) {
            console.error('Failed to create match:', err);
            setFormError(err.response?.data?.error || 'Failed to create match. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const STEPS = ['Sport', 'Format', 'Date & Time', 'Location', 'Details', 'Review'];

    return (
        <div style={{ maxWidth: '840px', margin: '0 auto', padding: '1.5rem 1rem' }}>
            
            {/* Header & Step Indicator */}
            {currentStep <= 6 && (
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <div>
                            <button
                                onClick={() => navigate('/play')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted, #626762)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 'bold', marginBottom: '4px' }}
                            >
                                <ArrowLeft size={16} /> Back to Play
                            </button>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main, #171817)', margin: 0 }}>
                                Create a Match
                            </h1>
                        </div>
                        <span style={{ background: 'var(--bg-dark, #F6F7F5)', border: '1px solid var(--border-color, #E3E6E2)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-main, #171817)' }}>
                            Step {currentStep} of 6
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, gap: '6px' }}>
                        {STEPS.map((stepName, idx) => {
                            const stepNum = idx + 1;
                            const isDone = stepNum < currentStep;
                            const isCurrent = stepNum === currentStep;

                            return (
                                <div key={stepName} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{
                                        height: '4px',
                                        borderRadius: '2px',
                                        background: isDone || isCurrent ? 'var(--primary, #F5B91E)' : 'var(--border-color, #E3E6E2)',
                                        transition: 'all 0.3s ease'
                                    }} />
                                    <span style={{ fontSize: '0.72rem', fontWeight: isCurrent ? '800' : '600', color: isCurrent ? 'var(--text-main, #171817)' : 'var(--text-muted, #626762)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        0{stepNum} {stepName}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Form Error Banner */}
            {formError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px 16px', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.88rem', fontWeight: 'bold' }}>
                    {formError}
                </div>
            )}

            {/* STEP 1: SELECT SPORT */}
            {currentStep === 1 && (
                <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '0.5rem' }}>
                        Select Sport
                    </h2>
                    <p style={{ color: 'var(--text-muted, #626762)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                        Choose the sport you want to host a game for.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                        {SPORTS_LIST.map((s) => {
                            const isSelected = sport === s.id;
                            return (
                                <div
                                    key={s.id}
                                    onClick={() => handleSportChange(s.id)}
                                    style={{
                                        border: `2px solid ${isSelected ? 'var(--primary, #F5B91E)' : 'var(--border-color, #E3E6E2)'}`,
                                        background: isSelected ? 'rgba(245, 185, 30, 0.06)' : 'var(--bg-dark, #F6F7F5)',
                                        borderRadius: '16px',
                                        padding: '1.25rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '2.2rem' }}>{s.icon}</span>
                                        {isSelected && <CheckCircle2 size={20} color="var(--primary-dark, #E5A900)" />}
                                    </div>
                                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main, #171817)' }}>
                                        {s.name}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #626762)', lineHeight: 1.4 }}>
                                        {s.desc}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* STEP 2: MATCH FORMAT & TEAM SIZE */}
            {currentStep === 2 && (
                <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '0.5rem' }}>
                        Match Format ({sport})
                    </h2>
                    <p style={{ color: 'var(--text-muted, #626762)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                        Select the player capacity and team structure.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                        {(SPORT_FORMATS[sport] || SPORT_FORMATS.Football).map((f) => {
                            const isSelected = format === f.name;
                            return (
                                <div
                                    key={f.name}
                                    onClick={() => handleFormatChange(f)}
                                    style={{
                                        border: `2px solid ${isSelected ? 'var(--primary, #F5B91E)' : 'var(--border-color, #E3E6E2)'}`,
                                        background: isSelected ? 'rgba(245, 185, 30, 0.06)' : 'var(--bg-dark, #F6F7F5)',
                                        borderRadius: '16px',
                                        padding: '1.25rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main, #171817)' }}>{f.name}</div>
                                        {isSelected && <CheckCircle2 size={18} color="var(--primary-dark, #E5A900)" />}
                                    </div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted, #626762)' }}>
                                        {f.total} Players Total ({Math.ceil(f.total / 2)} per team)
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Team Size Summary Card */}
                    <div style={{ background: 'var(--bg-dark, #F6F7F5)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-around', textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #626762)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TEAM A</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0284c7', marginTop: '2px' }}>{Math.ceil(totalPlayers / 2)} Players</div>
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-muted, #626762)' }}>VS</div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #626762)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TEAM B</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#e11d48', marginTop: '2px' }}>{Math.floor(totalPlayers / 2)} Players</div>
                        </div>
                        <div style={{ borderLeft: '1px solid var(--border-color, #E3E6E2)', paddingLeft: '1.5rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #626762)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL REQUIRED</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main, #171817)', marginTop: '2px' }}>{totalPlayers} Players</div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: DATE & TIME */}
            {currentStep === 3 && (
                <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '0.5rem' }}>
                        Date & Time
                    </h2>
                    <p style={{ color: 'var(--text-muted, #626762)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                        When will this match take place?
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '6px' }}>
                                Match Date *
                            </label>
                            <input
                                type="date"
                                value={date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setDate(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color, #E3E6E2)', background: 'var(--bg-dark, #F6F7F5)', fontSize: '0.95rem', fontWeight: 'bold' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '6px' }}>
                                Start Time *
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color, #E3E6E2)', background: 'var(--bg-dark, #F6F7F5)', fontSize: '0.95rem', fontWeight: 'bold' }}
                            />
                        </div>
                    </div>

                    {/* Duration Presets */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '8px' }}>
                            Match Duration
                        </label>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {[30, 60, 90, 120].map((mins) => (
                                <button
                                    key={mins}
                                    type="button"
                                    onClick={() => setDurationMinutes(mins)}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '12px',
                                        border: `2px solid ${durationMinutes === mins ? 'var(--primary, #F5B91E)' : 'var(--border-color, #E3E6E2)'}`,
                                        background: durationMinutes === mins ? 'rgba(245, 185, 30, 0.1)' : 'var(--bg-dark, #F6F7F5)',
                                        color: 'var(--text-main, #171817)',
                                        fontWeight: '800',
                                        fontSize: '0.88rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {mins} min
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: LOCATION */}
            {currentStep === 4 && (
                <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '0.5rem' }}>
                        Match Location
                    </h2>
                    <p style={{ color: 'var(--text-muted, #626762)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                        Where will the athletes meet to play?
                    </p>

                    {/* GPS Button */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={handleGetCurrentLocation}
                            disabled={isLocating}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color, #E3E6E2)',
                                background: isGpsCaptured ? '#ecfdf5' : 'var(--bg-dark, #F6F7F5)',
                                color: isGpsCaptured ? '#047857' : 'var(--text-main, #171817)',
                                fontWeight: '800',
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Navigation size={18} color={isGpsCaptured ? '#047857' : 'var(--primary-dark, #E5A900)'} />
                            {isLocating ? 'Detecting Location...' : (isGpsCaptured ? '✓ GPS Location Captured' : 'Use Current Location')}
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '6px' }}>
                                Venue / Facility Name *
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Power Play Arena, Central Turf, City Sports Club"
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color, #E3E6E2)', background: 'var(--bg-dark, #F6F7F5)', fontSize: '0.95rem', fontWeight: 'bold' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '6px' }}>
                                City / Area
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Bhopal, Madhya Pradesh"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color, #E3E6E2)', background: 'var(--bg-dark, #F6F7F5)', fontSize: '0.95rem', fontWeight: 'bold' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 5: MATCH DETAILS */}
            {currentStep === 5 && (
                <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '0.5rem' }}>
                        Match Details & Preferences
                    </h2>
                    <p style={{ color: 'var(--text-muted, #626762)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                        Add title, description, skill expectations, and privacy settings.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '6px' }}>
                                Match Title
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Weekend Football Showdown"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color, #E3E6E2)', background: 'var(--bg-dark, #F6F7F5)', fontSize: '0.95rem', fontWeight: 'bold' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '6px' }}>
                                Description / Notes for Players
                            </label>
                            <textarea
                                rows={3}
                                placeholder="e.g. Casual game. Intermediate level preferred. Please bring your own boots and water bottle."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color, #E3E6E2)', background: 'var(--bg-dark, #F6F7F5)', fontSize: '0.9rem', resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '6px' }}>
                                    Skill Level
                                </label>
                                <select
                                    value={skillLevel}
                                    onChange={(e) => setSkillLevel(e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color, #E3E6E2)', background: 'var(--bg-dark, #F6F7F5)', fontSize: '0.9rem', fontWeight: 'bold' }}
                                >
                                    <option value="1">Level 1 — Beginner</option>
                                    <option value="2">Level 2 — Recreational</option>
                                    <option value="3">Level 3 — Intermediate</option>
                                    <option value="4">Level 4 — Advanced</option>
                                    <option value="5">Level 5 — Competitive Pro</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '6px' }}>
                                    Match Type
                                </label>
                                <select
                                    value={matchType}
                                    onChange={(e) => setMatchType(e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color, #E3E6E2)', background: 'var(--bg-dark, #F6F7F5)', fontSize: '0.9rem', fontWeight: 'bold' }}
                                >
                                    <option value="Casual">Casual</option>
                                    <option value="Competitive">Competitive</option>
                                    <option value="Training">Training Session</option>
                                    <option value="Tournament">Tournament Match</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', paddingTop: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 'bold' }}>
                                <input
                                    type="checkbox"
                                    checked={visibility === 'private'}
                                    onChange={(e) => setVisibility(e.target.checked ? 'private' : 'public')}
                                />
                                Private Match (Invite Link Only)
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 'bold' }}>
                                <input
                                    type="checkbox"
                                    checked={approvalRequired}
                                    onChange={(e) => setApprovalRequired(e.target.checked)}
                                />
                                Require Host Approval for Join Requests
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 6: REVIEW & CREATE */}
            {currentStep === 6 && (
                <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main, #171817)', marginBottom: '0.5rem' }}>
                        Review Your Match
                    </h2>
                    <p style={{ color: 'var(--text-muted, #626762)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                        Please double check the match summary before publishing.
                    </p>

                    <div style={{ background: 'var(--bg-dark, #F6F7F5)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color, #E3E6E2)', paddingBottom: '1rem' }}>
                            <div>
                                <span style={{ background: 'var(--primary, #F5B91E)', color: '#000', fontWeight: '900', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    {sport}
                                </span>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main, #171817)', margin: '8px 0 0 0' }}>
                                    {title}
                                </h3>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-main, #171817)' }}>{format}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #626762)' }}>{totalPlayers} Total Players</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main, #171817)' }}>
                                <Calendar size={16} color="var(--primary-dark, #E5A900)" />
                                <span><strong>Date:</strong> {date} at {time}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main, #171817)' }}>
                                <Clock size={16} color="var(--primary-dark, #E5A900)" />
                                <span><strong>Duration:</strong> {durationMinutes} mins</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main, #171817)' }}>
                                <MapPin size={16} color="var(--primary-dark, #E5A900)" />
                                <span><strong>Location:</strong> {locationName}, {city}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main, #171817)' }}>
                                <Activity size={16} color="var(--primary-dark, #E5A900)" />
                                <span><strong>Skill Level:</strong> Level {skillLevel} ({matchType})</span>
                            </div>
                        </div>

                        {description && (
                            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color, #E3E6E2)', fontSize: '0.85rem', color: 'var(--text-muted, #626762)' }}>
                                <strong>Notes:</strong> {description}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 7: SUCCESS STATE */}
            {currentStep === 7 && createdMatch && (
                <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color, #E3E6E2)', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '72px', height: '72px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                        <CheckCircle2 size={42} color="#16a34a" />
                    </div>

                    <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main, #171817)', marginBottom: '0.5rem' }}>
                        Match Created Successfully!
                    </h1>
                    <p style={{ color: 'var(--text-muted, #626762)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 2rem auto' }}>
                        Your <strong>{createdMatch.sport}</strong> match at <strong>{createdMatch.locationName}</strong> is now live. Athletes can discover and join your match!
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate(`/matches/${createdMatch._id}`)}
                            style={{
                                padding: '14px 28px',
                                borderRadius: '14px',
                                background: 'var(--primary, #F5B91E)',
                                color: '#000',
                                fontWeight: '900',
                                fontSize: '0.95rem',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(245, 185, 30, 0.4)'
                            }}
                        >
                            Enter Match Room
                        </button>

                        <button
                            onClick={() => navigate('/play')}
                            style={{
                                padding: '14px 24px',
                                borderRadius: '14px',
                                background: 'var(--bg-dark, #F6F7F5)',
                                color: 'var(--text-main, #171817)',
                                fontWeight: '800',
                                fontSize: '0.95rem',
                                border: '1px solid var(--border-color, #E3E6E2)',
                                cursor: 'pointer'
                            }}
                        >
                            View All Matches
                        </button>
                    </div>
                </div>
            )}

            {/* Navigation Bar (Steps 1 to 6) */}
            {currentStep <= 6 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={isSubmitting}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                background: 'var(--bg-dark, #F6F7F5)',
                                color: 'var(--text-main, #171817)',
                                fontWeight: '800',
                                fontSize: '0.9rem',
                                border: '1px solid var(--border-color, #E3E6E2)',
                                cursor: 'pointer'
                            }}
                        >
                            Back
                        </button>
                    ) : <div />}

                    {currentStep < 6 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            style={{
                                padding: '12px 28px',
                                borderRadius: '12px',
                                background: 'var(--primary, #F5B91E)',
                                color: '#000',
                                fontWeight: '900',
                                fontSize: '0.95rem',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 4px 14px rgba(245, 185, 30, 0.35)'
                            }}
                        >
                            Next Step <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleCreateMatch}
                            disabled={isSubmitting}
                            style={{
                                padding: '14px 32px',
                                borderRadius: '14px',
                                background: 'var(--primary, #F5B91E)',
                                color: '#000',
                                fontWeight: '900',
                                fontSize: '1rem',
                                border: 'none',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 6px 18px rgba(245, 185, 30, 0.4)'
                            }}
                        >
                            {isSubmitting ? 'Publishing Match...' : 'Publish & Create Match'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
