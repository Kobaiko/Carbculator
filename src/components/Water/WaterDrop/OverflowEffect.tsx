import React from 'react';

export function OverflowEffect() {
  return (
    <g>
      {/* Top overflow wave */}
      <path
        d="M-20,8 Q30,5 60,8 T140,8 V10 H-20 Z"
        fill="url(#waterGradient1)"
        opacity="0.6"
      >
        <animate
          attributeName="d"
          values={`
            M-20,8 Q30,5 60,8 T140,8 V10 H-20 Z;
            M-20,8 Q30,11 60,8 T140,8 V10 H-20 Z;
            M-20,8 Q30,5 60,8 T140,8 V10 H-20 Z
          `}
          dur="2s"
          repeatCount="indefinite"
        />
      </path>

      {/* Secondary overflow wave */}
      <path
        d="M-20,10 Q30,7 60,10 T140,10 V12 H-20 Z"
        fill="url(#waterGradient2)"
        opacity="0.4"
      >
        <animate
          attributeName="d"
          values={`
            M-20,10 Q30,7 60,10 T140,10 V12 H-20 Z;
            M-20,10 Q30,13 60,10 T140,10 V12 H-20 Z;
            M-20,10 Q30,7 60,10 T140,10 V12 H-20 Z
          `}
          dur="2.5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Ripple effect at the top */}
      <circle cx="60" cy="12" r="2" fill="url(#waterGradient1)" opacity="0.4">
        <animate
          attributeName="r"
          values="2;4;2"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.4;0.2;0.4"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}