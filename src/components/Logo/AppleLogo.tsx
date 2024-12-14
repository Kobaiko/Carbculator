import React from 'react';

export function AppleLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Heart shape */}
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#4ade80"
        stroke="#166534"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Eyes */}
      <circle cx="9" cy="9" r="1" fill="#166534">
        <animate
          attributeName="r"
          values="1;0.8;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="15" cy="9" r="1" fill="#166534">
        <animate
          attributeName="r"
          values="1;0.8;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Smiling mouth */}
      <path
        d="M9.5 11.5C10.5 12.5 13.5 12.5 14.5 11.5"
        stroke="#166534"
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        <animate
          attributeName="d"
          values="M9.5 11.5C10.5 12.5 13.5 12.5 14.5 11.5;M9.5 12C10.5 13 13.5 13 14.5 12;M9.5 11.5C10.5 12.5 13.5 12.5 14.5 11.5"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* Rosy cheeks */}
      <circle cx="7.5" cy="10.5" r="0.8" fill="#22c55e" opacity="0.5" />
      <circle cx="16.5" cy="10.5" r="0.8" fill="#22c55e" opacity="0.5" />
    </svg>
  );
}