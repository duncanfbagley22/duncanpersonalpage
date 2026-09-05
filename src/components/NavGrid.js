// src/components/NavGrid.js
// Shared nav-card grid: used as the large hero grid on the Home page.
// Each pill layers three independent pieces, per design: the PillFrame
// "sprite" (chrome background), an icon badge, and a text label.

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PillFrame from './PillFrame';
import {
  HomeIcon,
  BlogIcon,
  ProfessionalIcon,
  ProjectsIcon,
  FavoritesIcon,
  MessageIcon,
} from './NavIcons';

export const NAV_ITEMS = [
  { to: '/', label: 'Home', Icon: HomeIcon, isHome: true, tint: '#7bc47f' },
  { to: '/blog', label: 'Blog', Icon: BlogIcon, tint: '#e2735c' },
  { to: '/professional', label: 'Professional', Icon: ProfessionalIcon, tint: '#eab04a' },
  { to: '/projects', label: 'Projects', Icon: ProjectsIcon, tint: '#9b7fd1' },
  { to: '/favorites', label: 'Favorites', Icon: FavoritesIcon, tint: '#e06a94' },
  { to: '/message', label: 'Message', Icon: MessageIcon, tint: '#5a9bd4' },
];

const PillContent = ({ to, label, Icon, tint }) => (
  <>
    <PillFrame tint={tint} id={to.replace(/\W/g, '') || 'home'} />
    <span className="nav-pill-icon-badge" style={{ background: tint }}>
      <span className="nav-pill-icon">
        <Icon />
      </span>
    </span>
    <span className="nav-pill-label">{label}</span>
  </>
);

const NavGrid = ({ size = 'compact', onNavigate, onHomeSelect, focusable = true }) => {
  const location = useLocation();

  return (
    <ul className={`nav-grid nav-grid-${size}`}>
      {NAV_ITEMS.map((item) => {
        const { to, isHome } = item;
        const active = location.pathname === to;
        const className = `nav-pill${active ? ' is-active' : ''}`;

        if (isHome && onHomeSelect) {
          return (
            <li key={to}>
              <button
                type="button"
                className={className}
                onClick={() => {
                  onHomeSelect();
                  if (onNavigate) onNavigate();
                }}
                tabIndex={focusable ? 0 : -1}
              >
                <PillContent {...item} />
              </button>
            </li>
          );
        }

        return (
          <li key={to}>
            <Link to={to} className={className} onClick={onNavigate} tabIndex={focusable ? 0 : -1}>
              <PillContent {...item} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavGrid;
