import React, { Fragment } from 'react';
import { TruckSpec } from '../types/trailer';
interface TruckSvgPreviewProps {
  truck: TruckSpec;
}
export function TruckSvgPreview({
  truck
}: TruckSvgPreviewProps) {
  // SVG viewbox dimensions
  const viewBoxWidth = 400;
  const viewBoxHeight = 200;
  // Truck dimensions in SVG space
  const truckWidth = 180;
  const truckHeight = 70;
  const truckX = 100;
  const truckY = viewBoxHeight / 2 - truckHeight / 2;
  // Cab dimensions
  const cabWidth = truck.cab_type === 'sleeper' ? 80 : 60;
  const cabHeight = 50;
  const cabX = truckX;
  const cabY = truckY - cabHeight + truckHeight;
  // Parse axle configuration
  const [totalWheels, drivenWheels] = truck.axle_config.split('x').map(Number);
  const frontAxles = totalWheels <= 6 ? 1 : 2;
  const rearAxles = totalWheels / 2 - frontAxles;
  // Wheel dimensions
  const wheelWidth = 12;
  const wheelHeight = 24;
  const wheelSpacing = 40;
  // Calculate axle positions
  const axlePositions = [];
  // Front axles
  for (let i = 0; i < frontAxles; i++) {
    axlePositions.push({
      x: cabX + 50 + i * wheelSpacing,
      isFront: true,
      isDriven: false
    });
  }
  // Rear axles
  for (let i = 0; i < rearAxles; i++) {
    axlePositions.push({
      x: cabX + cabWidth + 20 + i * wheelSpacing,
      isFront: false,
      isDriven: i < drivenWheels / 2
    });
  }
  // Counterweight and kingpin
  const hasCounterweight = truck.has_counterweight;
  const hasKingpin = truck.has_kingpin;
  return <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-full">
      {/* Chassis */}
      <rect x={truckX} y={truckY} width={truckWidth} height={truckHeight / 2} fill="#4B5563" stroke="#1F2937" strokeWidth="2" />
      {/* Cab */}
      <rect x={cabX} y={cabY} width={cabWidth} height={cabHeight} rx="5" fill="#6B7280" stroke="#1F2937" strokeWidth="2" />
      {/* Windshield */}
      <rect x={cabX + 10} y={cabY + 10} width={cabWidth - 20} height={20} rx="2" fill="#A5F3FC" stroke="#1F2937" strokeWidth="1" />
      {/* Wheels */}
      {axlePositions.map((axle, i) => <Fragment key={`axle-${i}`}>
          {/* Axle line */}
          <line x1={axle.x} y1={truckY + truckHeight / 2} x2={axle.x} y2={truckY + truckHeight / 2 + (axle.isFront ? 10 : 15)} stroke={axle.isDriven ? '#EF4444' : '#1F2937'} strokeWidth="3" />
          {/* Top wheel */}
          <rect x={axle.x - wheelWidth / 2} y={truckY + truckHeight / 2 + (axle.isFront ? 10 : 15)} width={wheelWidth} height={wheelHeight} rx="2" fill="#1F2937" stroke="#000000" strokeWidth="1" />
          {/* Tire label - top */}
          <text x={axle.x} y={truckY + truckHeight / 2 + (axle.isFront ? 10 : 15) + wheelHeight + 15} fontSize="8" textAnchor="middle" fill="#4B5563">
            {axle.isFront ? truck.front_tires.label : truck.rear_tires.label}
          </text>
          {/* Bottom wheel (for double wheels on rear axles) */}
          {!axle.isFront && <rect x={axle.x - wheelWidth / 2 - 3} y={truckY + truckHeight / 2 + 15} width={wheelWidth} height={wheelHeight} rx="2" fill="#1F2937" stroke="#000000" strokeWidth="1" />}
        </Fragment>)}
      {/* Counterweight */}
      {hasCounterweight && <rect x={truckX + truckWidth - 30} y={truckY - 15} width={30} height={15} fill="#9CA3AF" stroke="#1F2937" strokeWidth="1" />}
      {/* Kingpin */}
      {hasKingpin && <circle cx={truckX + truckWidth - 40} cy={truckY + truckHeight / 4} r={8} fill="#9CA3AF" stroke="#1F2937" strokeWidth="2" />}
      {/* Axle configuration label */}
      <text x={cabX + cabWidth / 2} y={cabY - 10} fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1F2937">
        {truck.axle_config}
      </text>
      {/* Legend */}
      <g transform="translate(280, 30)">
        <rect width="100" height="60" fill="white" fillOpacity="0.7" rx="4" />
        {/* Driven axle legend */}
        <line x1="10" y1="15" x2="30" y2="15" stroke="#EF4444" strokeWidth="3" />
        <text x="35" y="18" fontSize="8" fill="#1F2937">
          Driven axle
        </text>
        {/* Non-driven axle legend */}
        <line x1="10" y1="30" x2="30" y2="30" stroke="#1F2937" strokeWidth="3" />
        <text x="35" y="33" fontSize="8" fill="#1F2937">
          Non-driven axle
        </text>
        {/* Counterweight legend */}
        {hasCounterweight && <>
            <rect x="10" y="40" width="15" height="7" fill="#9CA3AF" stroke="#1F2937" strokeWidth="1" />
            <text x="35" y="47" fontSize="8" fill="#1F2937">
              Counterweight
            </text>
          </>}
        {/* Kingpin legend */}
        {hasKingpin && <>
            <circle cx="17" cy={hasCounterweight ? 62 : 47} r="4" fill="#9CA3AF" stroke="#1F2937" strokeWidth="1" />
            <text x="35" y={hasCounterweight ? 65 : 50} fontSize="8" fill="#1F2937">
              Kingpin
            </text>
          </>}
      </g>
    </svg>;
}