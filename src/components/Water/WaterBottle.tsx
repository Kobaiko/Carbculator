import React from 'react';
import { clsx } from 'clsx';

interface WaterGlassProps {
  percentage: number;
}

export function WaterBottle({ percentage }: WaterGlassProps) {
  const showContent = percentage > 0;
  const isOverflowing = percentage > 100;
  const displayPercentage = Math.round(percentage);

  return (
    <div className="relative w-40 h-48">
      <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-lg">
        <defs>
          {/* Wave gradients */}
          {[1, 2, 3].map((i) => (
            <linearGradient
              key={i}
              id={`waterGradient${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#60a5fa" className="dark:stop-color-blue-500">
                <animate
                  attributeName="offset"
                  values="-0.5;0;0.5"
                  dur={`${4 + i}s`}
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#3b82f6" className="dark:stop-color-blue-400">
                <animate
                  attributeName="offset"
                  values="0;0.5;1"
                  dur={`${4 + i}s`}
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#60a5fa" className="dark:stop-color-blue-500">
                <animate
                  attributeName="offset"
                  values="0.5;1;1.5"
                  dur={`${4 + i}s`}
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          ))}

          {/* Wave filter */}
          <filter id="waveFilter">
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
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
          </filter>

          {/* Glass mask */}
          <mask id="glassMask">
            <path
              d="M40,20 
                 L120,20
                 L110,180
                 Q110,190 100,190
                 L60,190
                 Q50,190 50,180
                 Z"
              fill="white"
            />
          </mask>
        </defs>

        {/* Glass shape */}
        <path
          d="M40,20 
             L120,20
             L110,180
             Q110,190 100,190
             L60,190
             Q50,190 50,180
             Z"
          fill="#f0f9ff"
          stroke="#3b82f6"
          strokeWidth="2"
          className="dark:fill-blue-900/30 dark:stroke-blue-400"
        />

        {showContent && (
          <g>
            {/* Water fill */}
            <g mask="url(#glassMask)">
              <rect
                x="0"
                y={190 - Math.min(170, percentage * 1.7)}
                width="160"
                height="200"
                fill="url(#waterGradient1)"
                opacity="0.3"
              />

              {/* Wave layers */}
              {[1, 2, 3].map((i) => (
                <g key={i} filter="url(#waveFilter)">
                  <path
                    d={`
                      M0,${190 - Math.min(170, percentage * 1.7)} 
                      C40,${188 - Math.min(170, percentage * 1.7)} 
                        80,${192 - Math.min(170, percentage * 1.7)} 
                        160,${190 - Math.min(170, percentage * 1.7)}
                      V200 H0
                    `}
                    fill={`url(#waterGradient${i})`}
                    opacity={0.3}
                  >
                    <animate
                      attributeName="d"
                      values={`
                        M0,${190 - Math.min(170, percentage * 1.7)} 
                        C40,${188 - Math.min(170, percentage * 1.7)} 
                          80,${192 - Math.min(170, percentage * 1.7)} 
                          160,${190 - Math.min(170, percentage * 1.7)}
                        V200 H0;
                        M0,${190 - Math.min(170, percentage * 1.7)} 
                        C40,${192 - Math.min(170, percentage * 1.7)} 
                          80,${188 - Math.min(170, percentage * 1.7)} 
                          160,${190 - Math.min(170, percentage * 1.7)}
                        V200 H0;
                        M0,${190 - Math.min(170, percentage * 1.7)} 
                        C40,${188 - Math.min(170, percentage * 1.7)} 
                          80,${192 - Math.min(170, percentage * 1.7)} 
                          160,${190 - Math.min(170, percentage * 1.7)}
                        V200 H0
                      `}
                      dur={`${3 + i}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              ))}
            </g>

            {/* Overflow effect */}
            {isOverflowing && (
              <>
                {/* Overflow waves */}
                <path
                  d="M30,20 Q80,15 130,20"
                  fill="none"
                  stroke="url(#waterGradient1)"
                  strokeWidth="3"
                  filter="url(#waveFilter)"
                >
                  <animate
                    attributeName="d"
                    values="M30,20 Q80,15 130,20;M30,20 Q80,25 130,20;M30,20 Q80,15 130,20"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Animated drops */}
                {[1, 2, 3].map((i) => (
                  <g key={i}>
                    <circle
                      cx={45 + i * 35}
                      cy={20}
                      r="2"
                      fill="#60a5fa"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="cy"
                        values={`20;${50 + i * 10}`}
                        dur={`${0.5 + i * 0.2}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.6;0"
                        dur={`${0.5 + i * 0.2}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ))}
              </>
            )}
          </g>
        )}

        {/* Percentage text */}
        <text
          x="80"
          y="100"
          textAnchor="middle"
          className={clsx(
            'text-2xl font-bold',
            percentage === 0 
              ? 'fill-blue-600 dark:fill-blue-400'
              : percentage > 60
                ? 'fill-white'
                : 'fill-blue-600 dark:fill-blue-400'
          )}
        >
          {displayPercentage}%
        </text>
      </svg>
    </div>
  );
}