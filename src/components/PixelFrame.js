import React from 'react';
import '../styles/PixelFrame.css';

const PixelFrame = ({ header, headerInContent = false, children }) => (
  <div className="pixel-frame">
    <span className="pixel-frame-side pixel-frame-side-left" aria-hidden="true" />
    <span className="pixel-frame-side pixel-frame-side-right" aria-hidden="true" />
    {!headerInContent && header}
    <div className="pixel-frame-inner">
      {headerInContent && header}
      {children}
    </div>
    <footer className="pixel-frame-footer" aria-hidden="true">
    </footer>
  </div>
);

export default PixelFrame;