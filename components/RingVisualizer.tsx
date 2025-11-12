import React, { useState } from 'react';

interface RingVisualizerProps {
  diameter: number; // in mm
}

const RingVisualizer: React.FC<RingVisualizerProps> = ({ diameter }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const viewBoxSize = 120;
  const center = viewBoxSize / 2;
  const strokeWidth = 3;
  const minDiameter = 11; // Corresponds to approx size 1
  const maxDiameter = 24; // Corresponds to approx size 33

  // Clamp the diameter to a visual range to prevent the SVG from looking weird at extremes
  const clampedDiameter = Math.max(minDiameter, Math.min(diameter, maxDiameter));

  // Scale the radius for visualization
  const radius = 30 + ( (clampedDiameter - minDiameter) / (maxDiameter - minDiameter) ) * 25;

  const isValidDiameter = diameter > 0;

  return (
    <div className="w-full h-32 flex items-center justify-center cursor-pointer">
      <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      
        {/* Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth={strokeWidth}
          className="transition-all duration-300 ease-in-out"
        />
        
        {isValidDiameter && (
          <g>
            {/* Diameter line group for hover events */}
            <g
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
            >
              {/* Invisible wider line for easier hover */}
              <line
                x1={center - radius} y1={center}
                x2={center + radius} y2={center}
                stroke="transparent"
                strokeWidth="12"
                className="cursor-pointer"
              />
              {/* Visible diameter line */}
              <line
                x1={center - radius}
                y1={center}
                x2={center + radius}
                y2={center}
                stroke="#6b7280"
                strokeWidth="1"
                strokeDasharray="2 2"
                className="transition-all duration-300 ease-in-out"
              />
              {/* Start and end ticks */}
              <line x1={center - radius} y1={center - 4} x2={center - radius} y2={center + 4} stroke="#6b7280" strokeWidth="1" className="transition-all duration-300 ease-in-out"/>
              <line x1={center + radius} y1={center - 4} x2={center + radius} y2={center + 4} stroke="#6b7280" strokeWidth="1" className="transition-all duration-300 ease-in-out"/>
            </g>

            {/* Tooltip */}
            <g
              transform={`translate(${center}, ${center - 12})`}
              className={`transition-all duration-200 ease-in-out ${isTooltipVisible ? 'opacity-100' : 'opacity-0 -translate-y-2'}`}
              style={{ pointerEvents: 'none' }}
            >
              <rect
                x="-32"
                y="-13"
                width="64"
                height="20"
                rx="5"
                fill="rgba(17, 24, 39, 0.85)"
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#e5e7eb"
                fontSize="11"
                fontWeight="600"
              >
                {diameter.toFixed(2)} mm
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default RingVisualizer;
