import React from 'react';

interface WaveLayerProps {
  index: number;
  waveHeight: number;
  isOverflowing: boolean;
}

export function WaveLayer({ index, waveHeight, isOverflowing }: WaveLayerProps) {
  const amplitude = isOverflowing ? 2 : 5;
  const yOffset = index * 3;
  const duration = 3 + index;
  
  return (
    <path
      d={`
        M-20,${waveHeight + yOffset} 
        Q10,${waveHeight - amplitude + yOffset} 40,${waveHeight + yOffset}
        T100,${waveHeight + yOffset}
        T160,${waveHeight + yOffset}
        V150 H-20 Z
      `}
      fill={`url(#waterGradient${index + 1})`}
      opacity={0.8 - (index * 0.2)}
    >
      <animate
        attributeName="d"
        values={`
          M-20,${waveHeight + yOffset} 
          Q10,${waveHeight - amplitude + yOffset} 40,${waveHeight + yOffset}
          T100,${waveHeight + yOffset}
          T160,${waveHeight + yOffset}
          V150 H-20 Z;
          
          M-20,${waveHeight + yOffset} 
          Q10,${waveHeight + amplitude + yOffset} 40,${waveHeight + yOffset}
          T100,${waveHeight + yOffset}
          T160,${waveHeight + yOffset}
          V150 H-20 Z;
          
          M-20,${waveHeight + yOffset} 
          Q10,${waveHeight - amplitude + yOffset} 40,${waveHeight + yOffset}
          T100,${waveHeight + yOffset}
          T160,${waveHeight + yOffset}
          V150 H-20 Z
        `}
        dur={`${duration}s`}
        repeatCount="indefinite"
      />
    </path>
  );
}