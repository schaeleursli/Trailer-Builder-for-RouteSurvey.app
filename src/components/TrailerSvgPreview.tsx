import React from 'react';
import { TrailerSpec } from '../types/trailer';
interface TrailerSvgPreviewProps {
  trailer: TrailerSpec;
}
export function TrailerSvgPreview({
  trailer
}: TrailerSvgPreviewProps) {
  // SVG viewbox dimensions
  const viewBoxWidth = 400;
  const viewBoxHeight = 200;
  // Trailer dimensions in SVG space
  const trailerWidth = 300;
  const trailerHeight = 40;
  const trailerX = (viewBoxWidth - trailerWidth) / 2 + 50; // Center, but shifted right to make room for connections
  const trailerY = viewBoxHeight / 2 - trailerHeight / 2;
  // Calculate axle positions
  const axleSpacing = trailer.axle_spacing_m || 1.5;
  const axleWidth = 8;
  const axleHeight = 60;
  const axlePositions = [];
  // Create axle positions based on number of axles and spacing
  for (let i = 0; i < trailer.axles; i++) {
    const position = trailerX + trailerWidth - 40 - i * (axleSpacing * 20);
    axlePositions.push(position);
  }
  // Jeep dolly axle positions
  const jeepAxlePositions = [];
  if (trailer.connection === 'jeep_dolly' && trailer.jeep_axles) {
    const jeepLength = trailer.jeep_length_m || 4;
    const jeepWidth = jeepLength * 20;
    for (let i = 0; i < trailer.jeep_axles; i++) {
      const position = trailerX - jeepWidth + 20 + i * (axleSpacing * 20);
      jeepAxlePositions.push(position);
    }
  }
  // Tire size label
  const tireLabel = trailer.tires ? trailer.tires.label : 'Standard';
  return <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-full">
      {/* Trailer body */}
      <rect x={trailerX} y={trailerY} width={trailerWidth} height={trailerHeight} fill="#4B5563" stroke="#1F2937" strokeWidth="2" />
      {/* Axles and wheels */}
      {axlePositions.map((x, i) => <g key={`axle-${i}`}>
          <rect x={x - axleWidth / 2} y={trailerY + trailerHeight / 2 - axleHeight / 2} width={axleWidth} height={axleHeight} fill="#374151" stroke="#1F2937" strokeWidth="1" />
          {/* Tire label */}
          <text x={x} y={trailerY + trailerHeight / 2 + axleHeight / 2 + 15} fontSize="8" textAnchor="middle" fill="#4B5563">
            {tireLabel}
          </text>
        </g>)}
      {/* Connection type specific elements */}
      {trailer.connection === 'gooseneck' && <polygon points={`${trailerX},${trailerY + trailerHeight / 2} ${trailerX - 50},${trailerY - 20} ${trailerX - 80},${trailerY - 20} ${trailerX - 80},${trailerY + trailerHeight + 20} ${trailerX - 50},${trailerY + trailerHeight + 20}`} fill="#6B7280" stroke="#1F2937" strokeWidth="2" />}
      {trailer.connection === 'towbar' && <rect x={trailerX - 80} y={trailerY + trailerHeight / 2 - 5} width={80} height={10} fill="#6B7280" stroke="#1F2937" strokeWidth="2" />}
      {trailer.connection === 'jeep_dolly' && trailer.jeep_axles && trailer.jeep_length_m && <>
            {/* Jeep body */}
            <rect x={trailerX - trailer.jeep_length_m * 20} y={trailerY} width={trailer.jeep_length_m * 20} height={trailerHeight} fill="#6B7280" stroke="#1F2937" strokeWidth="2" />
            {/* Jeep axles */}
            {jeepAxlePositions.map((x, i) => <g key={`jeep-axle-${i}`}>
                <rect x={x - axleWidth / 2} y={trailerY + trailerHeight / 2 - axleHeight / 2} width={axleWidth} height={axleHeight} fill="#374151" stroke="#1F2937" strokeWidth="1" />
                {/* Tire label for jeep */}
                <text x={x} y={trailerY + trailerHeight / 2 + axleHeight / 2 + 15} fontSize="8" textAnchor="middle" fill="#4B5563">
                  {tireLabel}
                </text>
              </g>)}
            {/* Connection between jeep and trailer */}
            <rect x={trailerX - 20} y={trailerY + trailerHeight / 2 - 5} width={20} height={10} fill="#6B7280" stroke="#1F2937" strokeWidth="2" />
          </>}
      {/* Trailer info label */}
      <text x={trailerX + trailerWidth / 2} y={trailerY - 10} fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1F2937">
        {trailer.axles}-axle {trailer.type}
      </text>
    </svg>;
}