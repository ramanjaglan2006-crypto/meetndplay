import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, PlayCircle, MapPin, Users } from 'lucide-react';

const Topbar = ({ toggleMobileMenu }) => {
    const navigate = useNavigate();

    return (
        <header style={{
            height: '70px',
            background: 'var(--nav-bg, #ffffff)',
            borderBottom: '1px solid var(--border-color, #E3E6E2)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            width: '100%'
        }} className="web-topbar">
            
            {/* Left: Mobile Menu & Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                    onClick={toggleMobileMenu}
                    className="mobile-menu-btn"
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'none' }}
                >
                    <Menu size={24} />
                </button>
                
                <div style={{ position: 'relative', width: '260px' }} className="search-container">
                    <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        type="text" 
                        placeholder="Search players, matches, venues..." 
                        style={{
                            width: '100%',
                            padding: '9px 10px 9px 38px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color, #E3E6E2)',
                            background: 'var(--bg-dark, #F6F7F5)',
                            color: 'var(--text-main)',
                            outline: 'none',
                            fontSize: '0.88rem'
                        }}
                    />
                </div>
            </div>

            {/* Center: Primary Product Navigation (PLAY | BOOK | CONNECT) */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="product-top-nav">
                <NavLink
                    to="/play"
                    className={({ isActive }) => `product-nav-pill ${isActive ? 'active' : ''}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 18px',
                        borderRadius: '20px',
                        textDecoration: 'none',
                        fontSize: '0.88rem',
                        fontWeight: '800',
                        color: 'var(--text-muted, #626762)',
                        transition: 'all 0.2s'
                    }}
                >
                    <PlayCircle size={16} /> PLAY
                </NavLink>

                <NavLink
                    to="/book"
                    className={({ isActive }) => `product-nav-pill ${isActive ? 'active' : ''}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 18px',
                        borderRadius: '20px',
                        textDecoration: 'none',
                        fontSize: '0.88rem',
                        fontWeight: '800',
                        color: 'var(--text-muted, #626762)',
                        transition: 'all 0.2s'
                    }}
                >
                    <MapPin size={16} /> BOOK
                </NavLink>

                <NavLink
                    to="/connect"
                    className={({ isActive }) => `product-nav-pill ${isActive ? 'active' : ''}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 18px',
                        borderRadius: '20px',
                        textDecoration: 'none',
                        fontSize: '0.88rem',
                        fontWeight: '800',
                        color: 'var(--text-muted, #626762)',
                        transition: 'all 0.2s'
                    }}
                >
                    <Users size={16} /> CONNECT
                </NavLink>
            </nav>

            {/* Right: Notifications */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button style={{
                    width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--border-color, #E3E6E2)',
                    background: 'var(--bg-dark, #F6F7F5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-main)'
                }}>
                    <Bell size={18} />
                </button>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .product-nav-pill.active {
                    background: var(--primary, #F5B91E) !important;
                    color: #000000 !important;
                }
                .product-nav-pill:hover:not(.active) {
                    background: var(--bg-dark, #F6F7F5);
                    color: var(--text-main) !important;
                }
                @media (max-width: 768px) {
                    .mobile-menu-btn {
                        display: block !important;
                    }
                    .product-top-nav {
                        display: none !important;
                    }
                    .search-container {
                        width: 180px !important;
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
