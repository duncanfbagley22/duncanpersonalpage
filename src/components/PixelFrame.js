import React from 'react';
import '../styles/PixelFrame.css';

const PixelFrame = ({ children }) => (
  <div className="pixel-frame">
    <span className="pixel-frame-side pixel-frame-side-left" aria-hidden="true" />
    <span className="pixel-frame-side pixel-frame-side-right" aria-hidden="true" />
    <div className="pixel-frame-inner">
      {children}
    </div>
    <footer className="pixel-frame-footer" aria-hidden="true">
      <span className="footer-mark footer-mark-blue" />
      <span className="footer-mark footer-mark-pink" />
      <span className="footer-label">PLAYER 01 // DUNCAN BAGLEY</span>
      <span className="footer-mark footer-mark-green" />
      <span className="footer-mark footer-mark-purple" />
    </footer>
  </div>
);

export default PixelFrame;