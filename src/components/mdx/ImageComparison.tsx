'use client';

import { useState } from 'react';

interface ImageComparisonProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function ImageComparison({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = ''
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, x)));
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-lg cursor-ew-resize ${className}`}
      onMouseMove={handleMouseMove}
      style={{ height: '400px' }}
    >
      {/* After image (background) */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={after} alt={afterLabel} className="w-full h-full object-cover" />
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-sm">
          {afterLabel}
        </div>
      </div>

      {/* Before image (clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={beforeLabel} className="w-full h-full object-cover" />
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-white text-sm">
          {beforeLabel}
        </div>
      </div>

      {/* Slider handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
