import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'pixelarticons/react';
import '../styles/Header.css';

const Header = () => {
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
        </div>
      </div>
    </header>
  );
};

export default Header;
