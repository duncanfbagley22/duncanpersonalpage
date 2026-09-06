// src/components/PillFrame.js
// ORAS-inspired menu pill chrome.
// Background art only — icon and label are layered separately by NavGrid.

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
        {/* Cool metallic body */}
        <linearGradient
          id={gradId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="42%" stopColor="#f8faf9" />
          <stop offset="62%" stopColor="#e7ebeb" />
          <stop offset="100%" stopColor={tint} />
        </linearGradient>

      </defs>

      {/* =====================================================
          OUTER PIXEL SILHOUETTE
          ===================================================== */}

      <path
        d="
          M 5 0
          H 215
          V 5
          H 220
          V 43
          H 215
          V 48
          H 5
          V 43
          H 0
          V 5
          H 5
          Z
        "
        fill="#101215"
      />

      {/* Extra black depth along bottom/right */}
      <path
        d="
          M 5 43
          H 215
          V 48
          H 5
          Z
        "
        fill="#090b0d"
      />

      <path
        d="
          M 215 5
          H 220
          V 43
          H 215
          Z
        "
        fill="#090b0d"
      />

      {/* =====================================================
          INNER METALLIC BODY
          ===================================================== */}

      <rect
        x="5"
        y="5"
        width="210"
        height="38"
        fill={`url(#${gradId})`}
      />



    </svg>
  );
};

export default PillFrame;
