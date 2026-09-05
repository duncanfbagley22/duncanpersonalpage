// src/components/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavGrid from '../../components/NavGrid';
import '../../styles/Home.css';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleHomeSelect = () => setShowPopup(true);

  const handleStart = () => {
    setShowPopup(false);
    navigate('/unity-game');
  };

  return (
    <div className="home-container">
      <div className="background"></div>
      <div className="home-hero">
        <div className="home-hero-banner">
          <span className="home-hero-name">Duncan Bagley</span>
        </div>
        <NavGrid size="large" onHomeSelect={handleHomeSelect} />
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Instructions</h2>
            <h3>Click "Start" to bring up the navigation world</h3>
            <p>
              Use WASD to move and the SPACEBAR to interact with objects and people. Within
              menus, use the ARROW KEYS to navigate and ENTER to make selections
            </p>
            <button onClick={handleStart}>Start</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
