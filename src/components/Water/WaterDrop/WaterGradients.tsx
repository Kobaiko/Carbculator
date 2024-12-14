import React from 'react';

export function WaterGradients() {
  return (
    <defs>
      {[1, 2, 3].map((i) => (
        <linearGradient
          key={i}
          id={`waterGradient${i}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop
            offset="0%"
            stopColor="#60a5fa"
            className="dark:stop-color-blue-400"
          >
            <animate
              attributeName="offset"
              values="-0.5;0;0.5"
              dur={`${4 - i}s`}
              repeatCount="indefinite"
            />
          </stop>
          <stop
            offset="50%"
            stopColor="#3b82f6"
            className="dark:stop-color-blue-500"
          >
            <animate
              attributeName="offset"
              values="0;0.5;1"
              dur={`${4 - i}s`}
              repeatCount="indefinite"
            />
          </stop>
          <stop
            offset="100%"
            stopColor="#60a5fa"
            className="dark:stop-color-blue-400"
          >
            <animate
              attributeName="offset"
              values="0.5;1;1.5"
              dur={`${4 - i}s`}
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      ))}

      <mask id="waveMask">
        <path
          d="M60,10 C60,10 0,80 0,110 C0,132 26.862915,150 60,150 C93.137085,150 120,132 120,110 C120,80 60,10 60,10 Z"
          fill="white"
        />
      </mask>
    </defs>
  );
}