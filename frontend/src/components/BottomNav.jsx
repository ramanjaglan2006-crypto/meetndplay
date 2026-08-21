import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlayCircle, MapPin, Users, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/play', icon: PlayCircle, label: 'Play' },
    { to: '/book', icon: MapPin, label: 'Book' },
    { to: '/connect', icon: Users, label: 'Connect' },
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
