import React, { useEffect, useState } from 'react';

const UnityGame = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    // Hide scrollbar when the component mounts
    document.body.style.overflow = 'hidden';

    // Clean up: Restore scrollbar when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333333',
        paddingTop: '30px',
        height: '100vh',
        position: 'relative',
      }}
    >
      <iframe
        src="https://duncanfbagley22.github.io/duncanPersonalPageUnity/"
        scrolling="no"
        style={{
          width: '800px',
          height: '510px',
          border: 'none',
          borderRadius: '8px',
          overflow: 'hidden',
          padding: 0,
          margin: 0,
          display: 'block',
          transform: 'translateY(-50px)', // Move iframe up slightly
        }}
        title="Unity Game"
      ></iframe>

      {/* Controls Button */}
      <button
        onClick={togglePopup}
        style={{
          marginTop: '0px', // Closer to the iframe
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#777777', // Lighter button color
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)', // Optional: Adding a small shadow for better visibility
        }}
      >
        Show Controls
      </button>

      {/* Popup */}
      {isPopupVisible && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -60%)',
            backgroundColor: '#222222',
            color: '#ffffff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center',
          }}
        >
          <h2>Controls</h2>
          <p><strong>W,A,S,D</strong> - Move Character</p>
          <p><strong>SPACEBAR</strong> - Interact With Other Characters, Signs, and Objects</p>
          <p><strong>ARROW KEYS</strong> - Navigate Popup Menus</p>
          <p><strong>ENTER</strong> - Make Selection Within Popup Menus</p>
          <button
            onClick={togglePopup}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#666666',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Overlay */}
      {isPopupVisible && (
        <div
          onClick={togglePopup}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        ></div>
      )}
    </div>
  );
};

export default UnityGame;
