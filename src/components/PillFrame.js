// src/components/PillFrame.js
// The pill's chrome "sprite" — background art only. Icon and label are
// separate elements layered on top by NavGrid. Darker/thicker outline and
// brighter corner brackets vs. the first pass, smooth (not banded) gradient.

import React from 'react';

const PillFrame = ({ tint = '#9aa7ab', id }) => {
  const gradId = `pill-grad-${id}`;

  return (
    <svg
      className="pill-frame-svg"
      viewBox="0 0 220 48"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="52%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={tint} />
        </linearGradient>
      </defs>

      {/* Outer dark outline — darker and slightly thicker than before */}
      <rect x="0" y="0" width="220" height="48" fill="#101012" />
      <g fill="var(--color-quaternary)">
        <rect x="0" y="0" width="5" height="5" />
        <rect x="0" y="43" width="5" height="5" />
        <rect x="215" y="0" width="5" height="5" />
        <rect x="215" y="43" width="5" height="5" />
      </g>

      {/* Inner gradient body, inset from the outline */}
      <rect x="5" y="5" width="210" height="38" fill={`url(#${gradId})`} />

      {/* Corner brackets — brighter and larger for more contrast against the
          dark outline */}
      <g fill="#eef3f4">
        <rect x="5" y="5" width="14" height="4" />
        <rect x="5" y="5" width="4" height="14" />
        <rect x="5" y="39" width="14" height="4" />
        <rect x="5" y="29" width="4" height="14" />
        <rect x="201" y="5" width="14" height="4" />
        <rect x="211" y="5" width="4" height="14" />
        <rect x="201" y="39" width="14" height="4" />
        <rect x="211" y="29" width="4" height="14" />
      </g>

      {/* Glossy diagonal highlight */}
      <polygon points="18,5 58,5 38,43 4,43" fill="#ffffff" opacity="0.4" />

      {/* Dither speckle over the tinted half */}
      <g fill={tint} opacity="0.55">
        {Array.from({ length: 9 }).flatMap((_, row) =>
          Array.from({ length: 16 }).map((_, col) => {
            if ((row + col) % 3 !== 0) return null;
            const x = 130 + col * 5;
            if (x > 206) return null;
            const y = 7 + row * 4;
            return <rect key={`${row}-${col}`} x={x} y={y} width="2" height="2" />;
          })
        )}
      </g>
    </svg>
  );
};

export default PillFrame;
