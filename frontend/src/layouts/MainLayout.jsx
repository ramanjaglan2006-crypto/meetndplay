import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BottomNav from '../components/BottomNav';

const MainLayout = ({ children, theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar - hidden on mobile via CSS */}
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        
        <main style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '2rem', 
          maxWidth: '1440px', 
          margin: '0 auto', 
          width: '100%',
          paddingBottom: '80px' // Space for mobile bottom nav
        }} className="main-content">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav - hidden on desktop via CSS */}
      <BottomNav />
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .main-content {
            padding: 1rem !important;
          }
        }
      `}} />
    </div>
  );
};

export default MainLayout;
