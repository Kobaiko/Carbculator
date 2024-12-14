import React from 'react';
import { WaterGradients } from './WaterGradients';
import { DropShape } from './DropShape';
import { WaveAnimations } from './WaveAnimations';
import { PercentageText } from './PercentageText';

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
        <WaterGradients />
        <DropShape />
        <WaveAnimations percentage={percentage} showContent={showContent} />
        <PercentageText percentage={percentage} />
      </svg>
    </div>
  );
}