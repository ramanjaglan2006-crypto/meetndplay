import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusCircle, Users, User, Trophy } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/discover', icon: Search, label: 'Match' },
    { to: '/tournaments', icon: Trophy, label: 'Events' },
    { to: '/community', icon: Users, label: 'Social' },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="nav-bottom">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <item.icon size={22} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
