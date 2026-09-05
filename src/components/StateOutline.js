// src/components/StateOutline.js
// Small flanking state-silhouette icons for the Home banner. Path data is
// public-domain-style US state boundary data, cropped to a tight bounding
// box per state (padding baked into the viewBox) so each renders large and
// centered rather than floating in a big empty square. Filled with the same
// light-to-steel-blue gradient as the banner plate so it reads as part of
// the same set, not a separate visual system.

import React from 'react';

const STATES = {
  UT: {
    viewBox: '162.8 182.5 106.4 132',
    d: 'M228.4,305.9 l24.6,3.6 1.9,-13.7 7,-50.5 2.3,-22 -32.2,-3.5 2.2,-13.1 1.8,-10.6 -34.7,-6.1 -12.5,-2.5 -10.6,52.9 -5.4,30 -3.3,15.4 -1.7,9.2z',
  },
  NC: {
    viewBox: '684.9 293.4 164.7 77.6',
    d: 'M786.7,357.7 l-12.7,-7.7 -3.1,-0.8 -16.6,2.1 -1.6,-3 -2.8,-2.2 -16.7,0.5 -7.4,0.9 -9.2,4.5 -6.8,2.7 -6.5,1.2 -13.4,1.4 0.1,-4.1 1.7,-1.3 2.7,-0.7 0.7,-3.8 3.9,-2.5 3.9,-1.5 4.5,-3.7 4.4,-2.3 0.7,-3.2 4.1,-3.8 0.7,1 2.5,0.2 2.4,-3.6 1.7,-0.4 2.6,0.3 1.8,-4 2.5,-2.4 0.5,-1.8 0.1,-3.5 4.4,0.1 38.5,-5.6 57.5,-12.3 2,4.8 3.6,6.5 2.4,2.4 0.6,2.3 -2.4,0.2 0.8,0.6 -0.3,4.2 -2.6,1.3 -0.6,2.1 -1.3,2.9 -3.7,1.6 -2.4,-0.3 -1.5,-0.2 -1.6,-1.3 0.3,1.3 v1 h1.9 l0.8,1.3 -1.9,6.3 h4.2 l0.6,1.6 2.3,-2.3 1.3,-0.5 -1.9,3.6 -3.1,4.8 h-1.3 l-1.1,-0.5 -2.7,0.6 -5.2,2.4 -6.5,5.3 -3.4,4.7 -1.9,6.5 -0.5,2.4 -4.7,0.5 -5.1,1.5z m49.3,-26.2 2.6,-2.5 3.2,-2.6 1.5,-0.6 0.2,-2 -0.6,-6.1 -1.5,-2.3 -0.6,-1.9 0.7,-0.2 2.7,5.5 0.4,4.4 -0.2,3.4 -3.4,1.5 -2.8,2.4 -1.1,1.2z',
  },
};

const StateOutline = ({ state, label }) => {
  const shape = STATES[state];
  if (!shape) return null;
  const gradId = `state-grad-${state}`;

  return (
    <svg
      className={`state-outline-svg state-outline-${state.toLowerCase()}`}
      viewBox={shape.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label || state}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#eef1fb" />
          <stop offset="55%" stopColor="#c2cbe8" />
          <stop offset="100%" stopColor="#8393bd" />
        </linearGradient>
        <pattern id={`${gradId}-texture`} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 0H6M0 3H6" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
          <rect x="1" y="1" width="2" height="2" fill="#232a3d" fillOpacity="0.2" />
        </pattern>
      </defs>
      <path
        d={shape.d}
        fill={`url(#${gradId})`}
        stroke="#232a3d"
        strokeWidth="3"
        strokeLinejoin="miter"
      />
      <path
        d={shape.d}
        fill={`url(#${gradId}-texture)`}
        stroke="none"
        pointerEvents="none"
      />
      <path
        d={shape.d}
        fill="none"
        stroke="#232a3d"
        strokeWidth="3"
        strokeLinejoin="miter"
      />
    </svg>
  );
};

export default StateOutline;
