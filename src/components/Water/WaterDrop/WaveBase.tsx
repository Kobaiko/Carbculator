import React from 'react';

interface WaveBaseProps {
  waveHeight: number;
  isOverflowing: boolean;
}

export function WaveBase({ waveHeight, isOverflowing }: WaveBaseProps) {
  return (
    <rect
      x="0"
      y={waveHeight}
      width="120"
      height="150"
      fill="url(#waterGradient1)"
      opacity="0.4"
    >
      <animate
        attributeName="y"
        values={`${waveHeight};${waveHeight + (isOverflowing ? 0 : 2)};${waveHeight}`}
        dur="3s"
        repeatCount="indefinite"
      />
    </rect>
  );
}