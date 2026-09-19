import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CircleInfo } from 'pixelarticons/react';
import '../styles/Header.css';

const Header = ({ showInfo = false, infoOpen = false, onToggleInfo }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
                <ArrowLeft className="header-back-icon" aria-hidden="true" focusable="false" />
              </button>
            </div>
          )}
          {!isHome && <Link to="/" className="banner-name">Duncan Bagley</Link>}
          {showInfo && (
            <div className="header-controls header-controls-right" aria-label="Info">
              <button
                type="button"
                className={`header-control header-info${infoOpen ? ' is-open' : ''}`}
                onClick={onToggleInfo}
                aria-label="Show controls"
                title="Show controls"
              >
                <CircleInfo className="header-back-icon" aria-hidden="true" focusable="false" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
