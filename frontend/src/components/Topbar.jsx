import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

const Topbar = ({ toggleMobileMenu }) => {
  return (
    <header style={{
      height: '70px',
      background: 'var(--nav-bg)',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%'
    }} className="web-topbar">
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={toggleMobileMenu}
          className="mobile-menu-btn"
          style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'none' }}
        >
          <Menu size={24} />
        </button>
        
        <div style={{ position: 'relative', width: '300px' }} className="search-container">
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search players, matches, events..." 
            style={{
              width: '100%',
              padding: '10px 10px 10px 40px',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(128,128,128,0.05)',
              color: 'var(--text-main)',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{
          width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--glass-border)',
          background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-main)'
        }}>
          <Bell size={18} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .search-container {
            width: 200px !important;
          }
          .web-topbar {
            padding: 0 1rem !important;
          }
        }
      `}} />
    </header>
  );
};

export default Topbar;
