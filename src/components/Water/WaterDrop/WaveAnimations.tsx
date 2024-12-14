import React from 'react';
import { WaveBase } from './WaveBase';
import { WaveLayer } from './WaveLayer';
import { OverflowEffect } from './OverflowEffect';

interface WaveAnimationsProps {
  percentage: number;
  showContent: boolean;
}

export function WaveAnimations({ percentage, showContent }: WaveAnimationsProps) {
  if (!showContent) return null;

  // Calculate wave height, ensuring the drop fills completely at 100%
  const waveHeight = percentage >= 100 
    ? 10  // Completely filled
    : Math.max(10, 150 - (percentage * 1.4));
    
  const isOverflowing = percentage > 100;
  
  return (
    <g mask="url(#waveMask)">
      <WaveBase waveHeight={waveHeight} isOverflowing={isOverflowing} />
      
      {/* Create three wave layers with different animations */}
      {[0, 1, 2].map((index) => (
        <WaveLayer
          key={index}
          index={index}
          waveHeight={waveHeight}
          isOverflowing={isOverflowing}
        />
      ))}

      {isOverflowing && <OverflowEffect />}
    </g>
  );
}