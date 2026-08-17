import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function Auth() {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    
    // Use remembered email if it exists
    const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'));
    
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [sport, setSport] = useState('Football');
    const [skillLevel, setSkillLevel] = useState('3');
    
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            if (isLogin) {
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                
                await login(email, password, null, null);
                // AuthContext will handle state and redirect will happen automatically via ProtectedRoute
            } else {
                await signup({ 
                    name, email, password, age: parseInt(age), 
                    sports: [sport], skill_level: parseInt(skillLevel), 
                    lat: null, lon: null, // Location will be requested later
                });
            }
        } catch (err) {
            console.error('Auth error:', err);
            const message = err.response?.data?.error || err.message;
            if (message === 'Network Error' || !err.response) {
                setErrorMsg('Unable to connect to backend server. Please verify VITE_API_URL environment variable on Vercel.');
            } else {
                setErrorMsg(message || 'Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--bg-dark)' }}>
            
            {/* Left Side - Brand/Illustration */}
            <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, var(--primary-dark), #1e1b4b)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '4rem',
                position: 'relative',
                overflow: 'hidden'
            }} className="auth-left">
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                        <Sparkles size={40} color="var(--primary)" />
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800' }}>MeetNDPlay</h1>
                    </div>
                    <h2 style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '1.5rem' }}>
                        Find players.<br/>
                        Create matches.<br/>
                        Play more.
                    </h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '400px' }}>
                        Join the fastest growing sports matchmaking community. Discover local matches, track your stats, and build your team.
                    </p>
                </div>
                
                {/* Decorative background elements */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'var(--primary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(80px)' }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px', background: '#22d3ee', opacity: 0.1, borderRadius: '50%', filter: 'blur(80px)' }}></div>
            </div>

            {/* Right Side - Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '4rem',
                background: 'var(--bg-dark)',
                maxWidth: '600px',
                margin: '0 auto'
            }} className="auth-right">
                
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 'bold' }}>
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        {isLogin ? 'Sign in to continue to MeetNDPlay' : 'Join the community and start playing today'}
                    </p>
                </div>
                
                {errorMsg && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        {errorMsg}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {!isLogin && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={labelStyle}>Full Name</label>
                                <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} autoComplete="name" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={labelStyle}>Age</label>
                                <input type="number" placeholder="25" value={age} onChange={e => setAge(e.target.value)} required style={inputStyle} min="13" max="99" />
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Primary Sport</label>
                                <select value={sport} onChange={e => setSport(e.target.value)} style={inputStyle}>
                                    <option value="Football">Football</option>
                                    <option value="Basketball">Basketball</option>
                                    <option value="Tennis">Tennis</option>
                                    <option value="Badminton">Badminton</option>
                                </select>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Skill Level: {skillLevel}</label>
                                <input type="range" min="1" max="5" value={skillLevel} onChange={e => setSkillLevel(e.target.value)} style={{ accentColor: 'var(--primary)', width: '100%', cursor: 'pointer' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <span>Beginner</span>
                                    <span>Pro</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={labelStyle}>Email</label>
                        <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} autoComplete="email" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={labelStyle}>Password</label>
                            {isLogin && <a href="#" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</a>}
                        </div>
                        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} autoComplete={isLogin ? "current-password" : "new-password"} />
                    </div>
                    
                    {isLogin && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <input 
                                type="checkbox" 
                                id="rememberMe" 
                                checked={rememberMe} 
                                onChange={(e) => setRememberMe(e.target.checked)} 
                                style={{ accentColor: 'var(--primary)', width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="rememberMe" style={{ fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer', userSelect: 'none' }}>
                                Remember me
                            </label>
                        </div>
                    )}
                    
                    <button type="submit" disabled={loading} style={{ 
                        background: 'var(--text-main)', 
                        color: 'var(--bg-dark)', 
                        padding: '14px', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontWeight: '600', 
                        marginTop: '1rem', 
                        transition: 'all 0.2s',
                        fontSize: '1rem'
                    }}>
                        {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }} style={{ 
                            background: 'transparent', border: 'none', color: 'var(--text-main)', 
                            cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'underline' 
                        }}>
                            {isLogin ? "Create Account" : "Sign In"}
                        </button>
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @media (max-width: 768px) {
                    .auth-left { display: none !important; }
                    .auth-right { padding: 2rem !important; }
                }
            `}} />
        </div>
    );
}

const labelStyle = {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-main)'
};

const inputStyle = {
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid var(--glass-border)',
    background: 'var(--glass)',
    color: 'var(--text-main)',
    outline: 'none',
    fontSize: '1rem'
};
