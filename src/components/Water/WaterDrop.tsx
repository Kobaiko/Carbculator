import React from 'react';
import { clsx } from 'clsx';

interface WaterDropProps {
  percentage: number;
}

export function WaterDrop({ percentage }: WaterDropProps) {
  const showContent = percentage > 0;

  return (
    <div className="relative w-32 h-40">
      <svg
        viewBox="0 0 120 150"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Definitions */}
        <defs>
          {/* First wave gradient */}
          <linearGradient id="waterGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" className="dark:stop-color-blue-500">
              <animate
                attributeName="offset"
                values="-1; 0; 1"
                dur="5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#3b82f6" className="dark:stop-color-blue-400">
              <animate
                attributeName="offset"
                values="0; 1; 2"
                dur="5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#60a5fa" className="dark:stop-color-blue-500">
              <animate
                attributeName="offset"
                values="1; 2; 3"
                dur="5s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          {/* Second wave gradient */}
          <linearGradient id="waterGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" className="dark:stop-color-blue-500" opacity="0.7">
              <animate
                attributeName="offset"
                values="1; 0; -1"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#3b82f6" className="dark:stop-color-blue-400" opacity="0.7">
              <animate
                attributeName="offset"
                values="2; 1; 0"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#60a5fa" className="dark:stop-color-blue-500" opacity="0.7">
              <animate
                attributeName="offset"
                values="3; 2; 1"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          {/* Wave mask */}
          <mask id="waveMask">
            <path
              d="M60,10 C60,10 0,80 0,110 C0,132 26.862915,150 60,150 C93.137085,150 120,132 120,110 C120,80 60,10 60,10 Z"
              fill="white"
            />
          </mask>

          {/* Ripple effect */}
          <filter id="ripple">
            <feTurbulence 
              type="fractalNoise"
              baseFrequency="0.02 0.15" 
              numOctaves="2" 
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.02 0.15;0.02 0.25;0.02 0.15"
                dur="4s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
        </defs>

        {/* Drop shape */}
        <path
          d="M60,10 C60,10 0,80 0,110 C0,132 26.862915,150 60,150 C93.137085,150 120,132 120,110 C120,80 60,10 60,10 Z"
          fill="#f0f9ff"
          stroke="#3b82f6"
          strokeWidth="2"
          className="dark:fill-blue-900/50 dark:stroke-blue-400"
        />

        {showContent && (
          <>
            {/* Water waves */}
            <g mask="url(#waveMask)">
              {/* Base water fill */}
              <rect
                x="0"
                y={150 - (percentage * 1.4)}
                width="120"
                height="150"
                fill="url(#waterGradient1)"
                opacity="0.3"
              >
                <animate
                  attributeName="y"
                  values={`${150 - (percentage * 1.4)};${151 - (percentage * 1.4)};${150 - (percentage * 1.4)}`}
                  dur="4s"
                  repeatCount="indefinite"
                />
              </rect>

              {/* First wave */}
              <path
                d={`M-20,${140 - percentage} C0,${135 - percentage} 40,${145 - percentage} 60,${140 - percentage} C80,${135 - percentage} 100,${145 - percentage} 140,${140 - percentage} L140,150 L-20,150 Z`}
                fill="url(#waterGradient1)"
                filter="url(#ripple)"
              >
                <animate
                  attributeName="d"
                  values={`
                    M-20,${140 - percentage} C0,${135 - percentage} 40,${145 - percentage} 60,${140 - percentage} C80,${135 - percentage} 100,${145 - percentage} 140,${140 - percentage} L140,150 L-20,150 Z;
                    M-20,${142 - percentage} C0,${137 - percentage} 40,${147 - percentage} 60,${142 - percentage} C80,${137 - percentage} 100,${147 - percentage} 140,${142 - percentage} L140,150 L-20,150 Z;
                    M-20,${140 - percentage} C0,${135 - percentage} 40,${145 - percentage} 60,${140 - percentage} C80,${135 - percentage} 100,${145 - percentage} 140,${140 - percentage} L140,150 L-20,150 Z
                  `}
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Second wave */}
              <path
                d={`M-20,${145 - percentage} C0,${140 - percentage} 40,${150 - percentage} 60,${145 - percentage} C80,${140 - percentage} 100,${150 - percentage} 140,${145 - percentage} L140,150 L-20,150 Z`}
                fill="url(#waterGradient2)"
                filter="url(#ripple)"
              >
                <animate
                  attributeName="d"
                  values={`
                    M-20,${145 - percentage} C0,${140 - percentage} 40,${150 - percentage} 60,${145 - percentage} C80,${140 - percentage} 100,${150 - percentage} 140,${145 - percentage} L140,150 L-20,150 Z;
                    M-20,${147 - percentage} C0,${142 - percentage} 40,${152 - percentage} 60,${147 - percentage} C80,${142 - percentage} 100,${152 - percentage} 140,${147 - percentage} L140,150 L-20,150 Z;
                    M-20,${145 - percentage} C0,${140 - percentage} 40,${150 - percentage} 60,${145 - percentage} C80,${140 - percentage} 100,${150 - percentage} 140,${145 - percentage} L140,150 L-20,150 Z
                  `}
                  dur="5s"
                  repeatCount="indefinite"
                />
              </path>
            </g>

            {/* Shine effect */}
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
          </>
        )}

        {/* Percentage text */}
        <text
          x="60"
          y="85"
          textAnchor="middle"
          className={clsx(
            'text-2xl font-bold',
            percentage === 0 
              ? 'fill-blue-600 dark:fill-blue-400'
              : percentage > 0 
                ? 'fill-white' 
                : 'fill-blue-700 dark:fill-blue-200'
          )}
          filter={percentage > 0 ? "url(#ripple)" : undefined}
        >
          {Math.round(percentage)}%
        </text>
      </svg>
    </div>
  );
}