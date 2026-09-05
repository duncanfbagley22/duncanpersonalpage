import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavGrid from './NavGrid';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="site-header">
      <div className="header-banner">
        <div className="banner-row">
          {!isHome && (
            <div className="header-controls" aria-label="Page controls">
              <button
                type="button"
                className="header-control header-back"
                onClick={handleBack}
                aria-label="Go back"
                title="Go back"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                className={`header-control header-menu-toggle${menuOpen ? ' is-open' : ''}`}
                onClick={() => setMenuOpen((isOpen) => !isOpen)}
                aria-expanded={menuOpen}
                aria-controls="header-navigation"
                aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
                title={menuOpen ? 'Close navigation' : 'Open navigation'}
              >
                <span aria-hidden="true" className="menu-glyph">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
          )}
          <Link to="/" className="banner-name">Duncan Bagley</Link>
          {!isHome && <span className="header-balance" aria-hidden="true" />}
        </div>
        {!isHome && menuOpen && (
          <nav id="header-navigation" className="header-navigation" aria-label="Main navigation">
            <NavGrid size="compact" onNavigate={() => setMenuOpen(false)} />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
