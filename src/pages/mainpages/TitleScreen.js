import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavGrid from '../../components/NavGrid';
import StateOutline from '../../components/StateOutline';
import '../../styles/Home.css';

const TitleScreen = () => {
  const navigate = useNavigate();

  const handleHomeSelect = () => navigate('/overworld');

  return (
    <div className="home-container">
      <div className="background"></div>
      <div className="home-hero">
        <div className="home-hero-banner-row">
          <StateOutline state="UT" label="Utah" />
          <div className="home-hero-banner">
            <span className="home-hero-name">Duncan Bagley</span>
            <span className="home-hero-divider" aria-hidden="true"></span>
            <span className="home-hero-tagline">Portfolio & Playground</span>
          </div>
          <StateOutline state="NC" label="North Carolina" />
        </div>
        <NavGrid size="large" onHomeSelect={handleHomeSelect} />
      </div>
    </div>
  );
};

export default TitleScreen;
