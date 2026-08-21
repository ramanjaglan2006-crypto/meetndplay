import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, PlayCircle, MapPin, Users, Compass, Trophy, Hexagon, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Play', path: '/play', icon: <PlayCircle size={20} /> },
    { name: 'Book', path: '/book', icon: <MapPin size={20} /> },
    { name: 'Connect', path: '/connect', icon: <Users size={20} /> },
    { name: 'Events', path: '/tournaments', icon: <Trophy size={20} /> },
    { name: 'Communities', path: '/communities', icon: <Hexagon size={20} /> }
  ];

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      background: 'var(--nav-bg, #ffffff)',
      borderRight: '1px solid var(--border-color, #E3E6E2)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      padding: '1.25rem',
      flexShrink: 0
    }} className="web-sidebar">
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ width: '38px', height: '38px', background: 'var(--primary, #F5B91E)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trophy size={22} color="#000" />
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '900', margin: 0, color: 'var(--text-main, #171817)' }}>MeetNDPlay</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        {navItems.map(item => (
          <NavLink 
            key={item.name}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
              borderRadius: '10px', color: 'var(--text-muted, #626762)', textDecoration: 'none',
              fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s ease'
            }}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color, #E3E6E2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
          <img 
            src={user?.photos?.[0]?.url || user?.photos?.[0] || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
            alt="Profile" 
            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.88rem', color: 'var(--text-main, #171817)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Player'}
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted, #626762)' }}>View Profile</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px', background: 'transparent', border: 'none', color: 'var(--danger, #E65A5A)', cursor: 'pointer', fontWeight: '600', borderRadius: '8px' }}
          className="logout-btn"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .sidebar-link:hover {
          background: var(--bg-dark, #F6F7F5);
          color: var(--text-main, #171817) !important;
        }
        .sidebar-link.active {
          background: var(--primary-soft, #FFF3C7);
          color: #000000 !important;
          font-weight: 800;
        }
        .logout-btn:hover {
          background: var(--danger-soft, #FDECEC) !important;
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
