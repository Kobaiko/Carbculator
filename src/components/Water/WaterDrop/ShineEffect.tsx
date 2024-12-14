import React from 'react';

export function ShineEffect() {
  return (
    <ellipse
      cx="40"
      cy="60"
      rx="10"
      ry="15"
      fill="white"
      opacity="0.15"
      transform="rotate(-30 40 60)"
    >
      <animate
        attributeName="opacity"
        values="0.15;0.25;0.15"
        dur="4s"
        repeatCount="indefinite"
      />
    </ellipse>
  );
}