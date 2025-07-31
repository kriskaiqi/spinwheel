import React, { useState, useRef } from 'react';
import { WHEEL_COLORS } from '../constants/palette';

interface WheelCanvasProps {
  entries: string[];
  size?: number;
  onSpinComplete: (winner: string) => void;
}

const WheelCanvas: React.FC<WheelCanvasProps> = ({ 
  entries, 
  size = 300, 
  onSpinComplete 
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGGElement>(null);
  const spinAudioRef = useRef<HTMLAudioElement>(null);
  const winAudioRef = useRef<HTMLAudioElement>(null);

  const segmentAngle = 360 / entries.length;
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  // Use predefined palette with cycling for segments
  const colors = entries.map((_, index) => WHEEL_COLORS[index % WHEEL_COLORS.length]);

  // Create SVG path for each segment
  const createSegmentPath = (index: number) => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + (radius - 20) * Math.cos(startAngle);
    const y1 = centerY + (radius - 20) * Math.sin(startAngle);
    const x2 = centerX + (radius - 20) * Math.cos(endAngle);
    const y2 = centerY + (radius - 20) * Math.sin(endAngle);

    const largeArcFlag = segmentAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius - 20} ${radius - 20} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Calculate text position for each segment
  const getTextPosition = (index: number) => {
    const angle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
    const textRadius = (radius - 20) * 0.7;
    const x = centerX + textRadius * Math.cos(angle);
    const y = centerY + textRadius * Math.sin(angle);
    return { x, y, angle: (index * segmentAngle + segmentAngle / 2) };
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Play spin sound
    if (spinAudioRef.current) {
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current.play();
    }
    
    // Generate random rotation (multiple full turns + random final position)
    const minSpins = 5;
    const maxSpins = 10;
    const spins = Math.random() * (maxSpins - minSpins) + minSpins;
    const finalAngle = Math.random() * 360;
    const totalRotation = spins * 360 + finalAngle;
    
    setRotation(prev => prev + totalRotation);

    // Calculate winner after animation completes
    setTimeout(() => {
      const normalizedAngle = (360 - (finalAngle % 360)) % 360;
      const winnerIndex = Math.floor(normalizedAngle / segmentAngle) % entries.length;
      const winner = entries[winnerIndex];

      // Play win sound
      if (winAudioRef.current) {
        winAudioRef.current.currentTime = 0;
        winAudioRef.current.play();
      }
      
      setIsSpinning(false);
      onSpinComplete(winner);
    }, 4000); // Match the CSS transition duration
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <audio ref={spinAudioRef} src="/sounds/spin.mp3" preload="auto" />
      <audio ref={winAudioRef} src="/sounds/win.mp3" preload="auto" />
      <div className="relative">
        <svg width={size} height={size} className="drop-shadow-lg">
          <g
            ref={wheelRef}
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${centerX}px ${centerY}px`,
              transition: isSpinning ? 'transform 4s cubic-bezier(.17,.67,.83,.67)' : 'none'
            }}
          >
            {entries.map((entry, index) => {
              const textPos = getTextPosition(index);
              return (
                <g key={index}>
                  <path
                    d={createSegmentPath(index)}
                    fill={colors[index]}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    fill="#fff"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textPos.angle}, ${textPos.x}, ${textPos.y})`}
                    style={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                      pointerEvents: 'none'
                    }}
                  >
                    {entry}
                  </text>
                </g>
              );
            })}
          </g>
          
          {/* Center circle and spin button */}
          <circle
            cx={centerX}
            cy={centerY}
            r="30"
            fill="#fff"
            stroke="#333"
            strokeWidth="3"
          />
        </svg>
        
        {/* Spin button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-16 h-16 rounded-full font-bold text-sm
            ${isSpinning 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
            }
            transition-colors duration-200 shadow-lg
            border-2 border-white
          `}
        >
          {isSpinning ? 'Spinning...' : 'SPIN'}
        </button>

        {/* Pointer/Arrow */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"
          style={{ marginTop: '10px' }}
        >
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
        </div>
      </div>
    </div>
  );
};

export default WheelCanvas;
