import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Image as ImageIcon } from 'lucide-react';
import { createCommunity } from '../services/api';

const CreateCommunity = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Sport',
        sportInput: '', // local state before adding to array
        sports: [],
        locationName: '',
        privacy: 'public',
        rules: ''
    });

    const handleNext = () => setStep(s => Math.min(s + 1, 4));
    const handlePrev = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const dataToSubmit = { ...formData };
            if (formData.sportInput && !formData.sports.includes(formData.sportInput)) {
                dataToSubmit.sports = [...formData.sports, formData.sportInput];
            }
            
            const res = await createCommunity(dataToSubmit);
            navigate(`/community/${res.data.slug}`);
        } catch (error) {
            console.error(error);
            alert("Failed to create community");
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', paddingBottom: '100px' }}>
            <button 
                onClick={() => navigate('/communities')}
                style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '2rem' }}
            >
                <ArrowLeft size={20} /> Back to Communities
            </button>
            
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Create a Community</h1>
            
            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '3rem' }}>
                {[1, 2, 3, 4].map(s => (
                    <div 
                        key={s} 
                        style={{ 
                            height: '4px', 
                            flex: 1, 
                            background: s <= step ? 'var(--primary)' : 'var(--border-color)',
                            borderRadius: '4px',
                            transition: 'background 0.3s'
                        }} 
                    />
                ))}
            </div>
            
            <div className="glass-card" style={{ padding: '2.5rem' }}>
                {step === 1 && (
                    <div>
                        <h2 style={{ marginBottom: '1.5rem' }}>1. Basic Information</h2>
                        
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Community Name *</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Bhopal Badminton Club"
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'white' }}
                            />
                        </div>
                        
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
                            <textarea 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="What is this community about?"
                                rows={4}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'white', resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Category</label>
                                <select 
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'white' }}
                                >
                                    <option value="Sport">General Sport</option>
                                    <option value="College">College</option>
                                    <option value="City">City/Local</option>
                                    <option value="Professional">Professional</option>
                                    <option value="Casual">Casual/Weekend</option>
                                </select>
                            </div>
                            
                            <div className="form-group" style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Primary Sport</label>
                                <input 
                                    type="text" 
                                    value={formData.sportInput}
                                    onChange={(e) => setFormData({...formData, sportInput: e.target.value})}
                                    placeholder="e.g. Badminton"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'white' }}
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px' }}>City / Location</label>
                            <input 
                                type="text" 
                                value={formData.locationName}
                                onChange={(e) => setFormData({...formData, locationName: e.target.value})}
                                placeholder="e.g. Bhopal, Madhya Pradesh"
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'white' }}
                            />
                        </div>
                    </div>
                )}
                
                {step === 2 && (
                    <div>
                        <h2 style={{ marginBottom: '1.5rem' }}>2. Rules & Moderation</h2>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px' }}>Community Rules</label>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Set clear expectations for your members.</p>
                            <textarea 
                                value={formData.rules}
                                onChange={(e) => setFormData({...formData, rules: e.target.value})}
                                placeholder="1. Be respectful to all members&#10;2. No spam or self-promotion&#10;3. RSVP accurately for matches"
                                rows={8}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'white', resize: 'vertical' }}
                            />
                        </div>
                    </div>
                )}
                
                {step === 3 && (
                    <div>
                        <h2 style={{ marginBottom: '1.5rem' }}>3. Privacy</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: formData.privacy === 'public' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', borderColor: formData.privacy === 'public' ? 'var(--primary)' : 'var(--border-color)' }}>
                                <input type="radio" name="privacy" value="public" checked={formData.privacy === 'public'} onChange={() => setFormData({...formData, privacy: 'public'})} style={{ marginTop: '4px' }} />
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Public</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Anyone can discover the community, view posts, and join immediately.</div>
                                </div>
                            </label>
                            
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: formData.privacy === 'private' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', borderColor: formData.privacy === 'private' ? 'var(--primary)' : 'var(--border-color)' }}>
                                <input type="radio" name="privacy" value="private" checked={formData.privacy === 'private'} onChange={() => setFormData({...formData, privacy: 'private'})} style={{ marginTop: '4px' }} />
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Private</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Anyone can discover the community, but they must request to join. Only members can see posts.</div>
                                </div>
                            </label>
                            
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: formData.privacy === 'hidden' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', borderColor: formData.privacy === 'hidden' ? 'var(--primary)' : 'var(--border-color)' }}>
                                <input type="radio" name="privacy" value="hidden" checked={formData.privacy === 'hidden'} onChange={() => setFormData({...formData, privacy: 'hidden'})} style={{ marginTop: '4px' }} />
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Hidden</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>The community will not appear in search results. Members can only join via direct invitation link.</div>
                                </div>
                            </label>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <CheckCircle color="var(--success)" /> You're almost done!
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Review your community details before launching. You can change these settings later.
                        </p>
                        
                        <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{formData.name || 'Your Community Name'}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{formData.category} • {formData.locationName || 'No Location'}</p>
                            
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', fontSize: '0.9rem' }}>
                                    <div style={{ color: 'var(--text-muted)' }}>Privacy:</div>
                                    <div style={{ textTransform: 'capitalize' }}>{formData.privacy}</div>
                                    
                                    <div style={{ color: 'var(--text-muted)' }}>Primary Sport:</div>
                                    <div>{formData.sportInput || 'None'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    {step > 1 ? (
                        <button className="btn-secondary" onClick={handlePrev}>Back</button>
                    ) : <div></div>}
                    
                    {step < 4 ? (
                        <button className="btn-primary" onClick={handleNext} disabled={step === 1 && !formData.name.trim()}>
                            Next <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ display: 'flex', gap: '8px' }}>
                            {loading ? 'Creating...' : 'Launch Community'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const CheckCircle = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default CreateCommunity;
