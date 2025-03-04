// src/components/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../styles/Home.css'; // Import a CSS file for styles

const Home = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleButtonClick = () => {
    setShowInstructions(false);
    setShowPopup(true);
  };

  const handleContinue = () => {
    setShowPopup(false);
    navigate('/unity-game'); // Navigate to the Unity game URL
  };

  return (
    <div className="home-container">
      <div className="background"></div>
      {showInstructions && (
        <div className="instructions">
          <h1>Welcome to Duncan Bagley's Personal Website!</h1>
          <p>You can either use the header above to navigate, or press the button below for a more interactive navigation</p>
          <button onClick={handleButtonClick}>Go!</button>
        </div>
      )}
      {showPopup && (
        <div className="instructions">
          <h2>Instructions</h2>
          <h3>Click "Start" to bring up the navigation world</h3>
          <p>Use WASD to move and the SPACEBAR to interact with objects and people. Within menus, use the ARROW KEYS to navigate and ENTER to make selections</p>
          <button onClick={handleContinue}>Start</button>
        </div>
      )}
    </div>
  );
};

export default Home;
