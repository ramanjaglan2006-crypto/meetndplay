import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile, useUpdateProfile } from '../hooks/queries/useUsers';
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from 'lucide-react';

const ProfileEdit = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: profile, isLoading } = useProfile(user?.id || user?._id);
    const updateProfile = useUpdateProfile();

    const [formData, setFormData] = useState({
        bio: '',
        age: '',
        gender: '',
        locationName: '',
        sports: [],
        achievements: [],
        interests: [],
        photos: []
    });

    const [newSport, setNewSport] = useState({ sport: '', skillLevel: 'Intermediate', positions: '', experienceYears: '' });
    const [newPhotoUrl, setNewPhotoUrl] = useState('');

    useEffect(() => {
        if (profile) {
            setFormData({
                bio: profile.bio || '',
                age: profile.age || '',
                gender: profile.gender || '',
                locationName: profile.locationName || '',
                sports: profile.sports || [],
                achievements: profile.achievements || [],
                interests: profile.interests || [],
                photos: profile.photos || []
            });
        }
    }, [profile]);

    const handleSave = () => {
        updateProfile.mutate(formData, {
            onSuccess: () => navigate('/profile')
        });
    };

    const addSport = () => {
        if (!newSport.sport) return;
        const positionsArr = newSport.positions.split(',').map(s => s.trim()).filter(s => s);
        setFormData({
            ...formData,
            sports: [...formData.sports, { ...newSport, positions: positionsArr }]
        });
        setNewSport({ sport: '', skillLevel: 'Intermediate', positions: '', experienceYears: '' });
    };

    const removeSport = (index) => {
        const updated = [...formData.sports];
        updated.splice(index, 1);
        setFormData({ ...formData, sports: updated });
    };

    const addPhoto = () => {
        if (!newPhotoUrl) return;
        setFormData({
            ...formData,
            photos: [...formData.photos, { url: newPhotoUrl, type: 'casual', order: formData.photos.length }]
        });
        setNewPhotoUrl('');
    };

    const removePhoto = (index) => {
        const updated = [...formData.photos];
        updated.splice(index, 1);
        setFormData({ ...formData, photos: updated });
    };

    const addInterest = (e) => {
        if (e.key === 'Enter' && e.target.value) {
            setFormData({ ...formData, interests: [...formData.interests, e.target.value] });
            e.target.value = '';
        }
    };

    const removeInterest = (index) => {
        const updated = [...formData.interests];
        updated.splice(index, 1);
        setFormData({ ...formData, interests: updated });
    };

    if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={20} /> Back
                </button>
                <h1 style={{ fontSize: '1.5rem' }}>Edit Profile</h1>
                <button onClick={handleSave} disabled={updateProfile.isPending} style={{ background: 'var(--primary)', border: 'none', color: 'black', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    {updateProfile.isPending ? 'Saving...' : <><Save size={18} /> Save</>}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Basic Info */}
                <section className="glass-card">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Basic Info</h2>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label>Bio</label>
                        <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="input-field" rows="3" maxLength="500" placeholder="Tell us about your sports journey..." />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Age</label>
                            <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="input-field" />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Gender</label>
                            <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="input-field">
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label>City / Location Name</label>
                        <input type="text" value={formData.locationName} onChange={(e) => setFormData({...formData, locationName: e.target.value})} className="input-field" placeholder="e.g., Bhopal, Madhya Pradesh" />
                    </div>
                </section>

                {/* Photos (Mock upload via URL) */}
                <section className="glass-card">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Photos</h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {formData.photos.map((photo, i) => (
                            <div key={i} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden' }}>
                                <img src={photo.url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button onClick={() => removePhoto(i)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" value={newPhotoUrl} onChange={(e) => setNewPhotoUrl(e.target.value)} placeholder="Image URL (mock upload)" className="input-field" style={{ flex: 1 }} />
                        <button onClick={addPhoto} className="btn-secondary" style={{ padding: '0 16px' }}><Plus size={18} /></button>
                    </div>
                </section>

                {/* Sports */}
                <section className="glass-card">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>My Sports</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                        {formData.sports.map((s, i) => (
                            <div key={i} style={{ padding: '1rem', background: 'var(--background-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{s.sport} <span style={{ fontWeight: 'normal', fontSize: '0.9rem', color: 'var(--text-muted)' }}>· {s.skillLevel}</span></div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>Positions: {s.positions?.join(', ') || 'N/A'}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Experience: {s.experienceYears} years</div>
                                </div>
                                <button onClick={() => removeSport(i)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><X size={18} /></button>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Add Sport</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sport Name</label>
                                    <input type="text" value={newSport.sport} onChange={(e) => setNewSport({...newSport, sport: e.target.value})} className="input-field" placeholder="e.g., Football" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Skill Level</label>
                                    <select value={newSport.skillLevel} onChange={(e) => setNewSport({...newSport, skillLevel: e.target.value})} className="input-field">
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                        <option>Competitive</option>
                                        <option>Professional</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Positions (comma separated)</label>
                                    <input type="text" value={newSport.positions} onChange={(e) => setNewSport({...newSport, positions: e.target.value})} className="input-field" placeholder="e.g., Striker, Winger" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Years Experience</label>
                                    <input type="number" value={newSport.experienceYears} onChange={(e) => setNewSport({...newSport, experienceYears: e.target.value})} className="input-field" placeholder="e.g., 5" />
                                </div>
                            </div>
                            <button onClick={addSport} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>Add Sport to Profile</button>
                        </div>
                    </div>
                </section>

                {/* Interests */}
                <section className="glass-card">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Interests</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                        {formData.interests.map((interest, i) => (
                            <div key={i} className="badge badge-skill" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {interest}
                                <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeInterest(i)} />
                            </div>
                        ))}
                    </div>
                    <input type="text" onKeyDown={addInterest} className="input-field" placeholder="Type an interest and press Enter" />
                </section>

            </div>
        </div>
    );
};

export default ProfileEdit;
