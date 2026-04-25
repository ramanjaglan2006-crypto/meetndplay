import React, { useState } from 'react';
import { loginUser, signupUser } from '../services/api';
import { Sparkles } from 'lucide-react';

export default function Auth({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [sport, setSport] = useState('Football');
    const [skillLevel, setSkillLevel] = useState('3');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let lat = null; let lon = null;
            try {
                if (navigator.geolocation && !city) {
                    const pos = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                    });
                    lat = pos.coords.latitude;
                    lon = pos.coords.longitude;
                }
            } catch(e) {
                console.warn('GPS Denied or failed');
                if (!city) {
                    alert("Location access denied. Please enter your city manually to continue.");
                    setLoading(false);
                    return;
                }
            }

            // Simple geocoding mock based on city name for demo purposes if city is provided
            if (city && !lat) {
                lat = 22.7; // Mock latitude
                lon = 75.8; // Mock longitude
            }

            let res;
            if (isLogin) {
                res = await loginUser(email, password, lat, lon);
            } else {
                res = await signupUser({ 
                    name, email, password, age: parseInt(age), 
                    sports: [sport], skill_level: parseInt(skillLevel), 
                    lat: lat || 22.7, lon: lon || 75.8,
                    photos: ['https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400']
                });
            }
            
            localStorage.setItem('meet_token', res.data.token);
            localStorage.setItem('meet_user', JSON.stringify(res.data.user));
            onAuthSuccess(res.data.user.id);
        } catch (err) {
            alert(err.response?.data?.error || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-dark)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Sparkles size={48} color="var(--primary)" style={{ margin: '0 auto' }} />
                <h1 style={{ marginTop: '1rem' }}>Meet-U</h1>
                <p style={{ color: 'var(--text-muted)' }}>{isLogin ? 'Login to continue' : 'Create an account to play'}</p>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--glass)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                {!isLogin && (
                    <>
                        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
                        <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} required style={inputStyle} min="13" max="99" />
                        
                        <select value={sport} onChange={e => setSport(e.target.value)} style={inputStyle}>
                            <option value="Football">Football</option>
                            <option value="Basketball">Basketball</option>
                            <option value="Tennis">Tennis</option>
                            <option value="Badminton">Badminton</option>
                        </select>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Skill Level (1-5)</label>
                            <input type="range" min="1" max="5" value={skillLevel} onChange={e => setSkillLevel(e.target.value)} style={{ accentColor: 'var(--primary)' }} />
                            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-main)' }}>Level {skillLevel}</div>
                        </div>
                    </>
                )}
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
                
                <input type="text" placeholder="City (Optional if GPS enabled)" value={city} onChange={e => setCity(e.target.value)} style={inputStyle} />
                
                <button type="submit" disabled={loading} style={{ background: 'var(--primary)', color: 'black', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem', transition: 'all 0.2s' }}>
                    {loading ? 'Authenticating...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>
            </form>

            <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', marginTop: '2rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
        </div>
    );
}

const inputStyle = {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--glass-border)',
    background: 'var(--glass)',
    color: 'var(--text-main)',
    outline: 'none',
    fontSize: '1rem'
};
