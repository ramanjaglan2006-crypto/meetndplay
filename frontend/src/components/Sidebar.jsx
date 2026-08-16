import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Compass, Calendar, Trophy, Users, MessageSquare, Settings, LogOut, Hexagon } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Discover', path: '/discover', icon: <Compass size={20} /> },
    { name: 'Events', path: '/tournaments', icon: <Trophy size={20} /> },
    { name: 'Communities', path: '/communities', icon: <Hexagon size={20} /> }
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      background: 'var(--nav-bg)',
      borderRight: '1px solid var(--glass-border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      padding: '1.5rem',
      flexShrink: 0
    }} className="web-sidebar">
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trophy size={24} color="black" />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>MeetNDPlay</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {navItems.map(item => (
          <NavLink 
            key={item.name}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
              borderRadius: '8px', color: 'var(--text-muted)', textDecoration: 'none',
              fontWeight: '500', transition: 'all 0.2s ease'
            }}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
          <img 
            src={user.photos?.[0] || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=random`} 
            alt="Profile" 
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user.name || 'Player'}
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>View Profile</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '500', borderRadius: '8px' }}
          className="logout-btn"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .sidebar-link:hover {
          background: rgba(128,128,128,0.05);
          color: var(--text-main) !important;
        }
        .sidebar-link.active {
          background: rgba(251, 191, 36, 0.1);
          color: var(--primary-dark) !important;
        }
        [data-theme="dark"] .sidebar-link.active {
          background: rgba(192, 132, 252, 0.1);
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1) !important;
        }
        @media (max-width: 768px) {
          .web-sidebar {
            display: none !important;
          }
        }
      `}} />
    </aside>
  );
};

export default Sidebar;
