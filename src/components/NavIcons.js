// src/components/NavIcons.js
// Small chunky "16/32-bit" pixel-style icons for the header nav cards.
// Built from blocky <rect> shapes (not a full pixel-grid raster) so they read
// as pixel-art at icon size without needing per-pixel authoring. Each icon
// uses currentColor so it inherits the pill's text color (and transitions
// with it on hover), plus a lower-opacity pass of the same color for shading.

import React from 'react';

const base = {
  viewBox: '0 0 16 16',
  shapeRendering: 'crispEdges',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true,
  focusable: false,
};

export const HomeIcon = () => (
  <svg {...base}>
    <g fill="currentColor">
      <rect x="5" y="7" width="6" height="7" />
      <rect x="7" y="1" width="2" height="2" />
      <rect x="6" y="3" width="4" height="2" />
      <rect x="4" y="5" width="8" height="2" />
    </g>
    <g fill="currentColor" opacity="0.45">
      <rect x="9" y="9" width="2" height="5" />
      <rect x="11" y="2" width="1" height="3" />
    </g>
  </svg>
);

export const BlogIcon = () => (
  <svg {...base}>
    <g fill="currentColor">
      <rect x="3" y="1" width="1" height="13" />
      <rect x="4" y="2" width="8" height="12" />
    </g>
    <g fill="currentColor" opacity="0.45">
      <rect x="6" y="4" width="4" height="1" />
      <rect x="6" y="7" width="4" height="1" />
      <rect x="6" y="10" width="3" height="1" />
    </g>
  </svg>
);

export const ProfessionalIcon = () => (
  <svg {...base}>
    <g fill="currentColor">
      <rect x="3" y="6" width="10" height="7" />
      <rect x="6" y="4" width="4" height="2" />
    </g>
    <g fill="currentColor" opacity="0.45">
      <rect x="3" y="9" width="10" height="1" />
      <rect x="7" y="8" width="2" height="2" />
    </g>
  </svg>
);

export const ProjectsIcon = () => (
  <svg {...base}>
    <g fill="currentColor">
      <rect x="2" y="4" width="2" height="2" />
      <rect x="1" y="6" width="2" height="2" />
      <rect x="2" y="8" width="2" height="2" />
      <rect x="12" y="4" width="2" height="2" />
      <rect x="13" y="6" width="2" height="2" />
      <rect x="12" y="8" width="2" height="2" />
    </g>
    <g fill="currentColor" opacity="0.45">
      <rect x="9" y="4" width="1" height="2" />
      <rect x="8" y="6" width="1" height="2" />
      <rect x="7" y="8" width="1" height="2" />
    </g>
  </svg>
);

export const FavoritesIcon = () => (
  <svg {...base}>
    <g fill="currentColor">
      <rect x="7" y="1" width="2" height="2" />
      <rect x="6" y="3" width="4" height="2" />
      <rect x="4" y="5" width="8" height="2" />
      <rect x="2" y="7" width="4" height="2" />
      <rect x="10" y="7" width="4" height="2" />
      <rect x="4" y="9" width="3" height="2" />
      <rect x="9" y="9" width="3" height="2" />
      <rect x="3" y="11" width="3" height="2" />
      <rect x="10" y="11" width="3" height="2" />
    </g>
    <g fill="currentColor" opacity="0.45">
      <rect x="6" y="6" width="4" height="2" />
    </g>
  </svg>
);

export const MessageIcon = () => (
  <svg {...base}>
    <g fill="currentColor">
      <rect x="2" y="4" width="12" height="8" />
    </g>
    <g fill="currentColor" opacity="0.45">
      <rect x="3" y="5" width="2" height="1" />
      <rect x="5" y="6" width="2" height="1" />
      <rect x="7" y="7" width="2" height="1" />
      <rect x="9" y="6" width="2" height="1" />
      <rect x="11" y="5" width="2" height="1" />
    </g>
  </svg>
);
