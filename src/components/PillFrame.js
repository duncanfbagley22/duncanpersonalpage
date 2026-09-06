// src/components/PillFrame.js
// ORAS-inspired menu pill chrome.
// Background art only — icon and label are layered separately by NavGrid.

import React from 'react';

const PillFrame = ({ tint = '#9aa7ab', id }) => {
  const gradId = `pill-grad-${id}`;
  const hoverGradId = `pill-hover-grad-${id}`;

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
          <stop offset="70%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={tint} />
        </linearGradient>

        <linearGradient
          id={hoverGradId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="10%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={tint} />
        </linearGradient>

      </defs>

      {/* =====================================================
          OUTER PIXEL SILHOUETTE
          ===================================================== */}

      <path
        d="
          M 10 0
          H 210
          V 5
          H 215
          V 10
          H 220
          V 38
          H 215
          V 43
          H 210
          V 48
          H 10
          V 43
          H 5
          V 38
          H 0
          V 10
          H 5
          V 5
          H 10
          Z
        "
        fill="#101215"
      />

      {/* Extra black depth along bottom/right */}
      <path
        className="pill-body-default"
        d="
          M 10 43
          H 210
          V 48
          H 10
          Z
        "
        fill="#090b0d"
      />

      <path
        d="
          M 215 10
          H 220
          V 38
          H 215
          Z
        "
        fill="#090b0d"
      />

      {/* =====================================================
          INNER METALLIC BODY
          ===================================================== */}

      <path
        d="
          M 10 5
          H 210
          V 10
          H 215
          V 38
          H 210
          V 43
          H 10
          V 38
          H 5
          V 10
          H 10
          Z
        "
        fill={`url(#${gradId})`}
      />

      <path
        className="pill-body-hover"
        d="
          M 10 5
          H 210
          V 10
          H 215
          V 38
          H 210
          V 43
          H 10
          V 38
          H 5
          V 10
          H 10
          Z
        "
        fill={`url(#${hoverGradId})`}
      />



    </svg>
  );
};

export default PillFrame;
