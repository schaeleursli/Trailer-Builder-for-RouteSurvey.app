import React from 'react';
import { LoadSpec, normalizeLoadSpec } from '../types/load';
interface LoadSvgPreviewProps {
  load: LoadSpec;
}
export function LoadSvgPreview({
  load
}: LoadSvgPreviewProps) {
  // Normalize the load to ensure we have the new format fields
  const normalizedLoad = normalizeLoadSpec(load);
  // If we have a custom shape SVG, render it
  if (normalizedLoad.shapeSvg) {
    return <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{
      __html: normalizedLoad.shapeSvg
    }} />;
  }
  // SVG viewbox dimensions
  const viewBoxWidth = 400;
  const viewBoxHeight = 200;
  // Load dimensions in SVG space
  const loadWidth = normalizedLoad.dims.width * 30;
  const loadLength = normalizedLoad.dims.length * 20;
  const loadX = (viewBoxWidth - loadLength) / 2;
  const loadY = (viewBoxHeight - loadWidth) / 2;
  // Center of gravity position
  const cgX = loadX + normalizedLoad.cg.chainage / normalizedLoad.dims.length * loadLength;
  const cgY = loadY + loadWidth / 2 + normalizedLoad.cg.offset * 30;
  // Get fill color based on load category
  const getFillColor = (category: string) => {
    switch (category) {
      case 'container':
        return '#3B82F6';
      // blue
      case 'machinery':
        return '#F59E0B';
      // amber
      case 'blade':
        return '#10B981';
      // green
      case 'tank':
        return '#8B5CF6';
      // purple
      case 'cable_spool':
        return '#EC4899';
      // pink
      default:
        return '#6B7280';
      // gray
    }
  };
  // Render different shapes based on category
  const renderShape = () => {
    switch (normalizedLoad.category) {
      case 'tank':
        return <rect x={loadX} y={loadY} width={loadLength} height={loadWidth} fill={getFillColor(normalizedLoad.category)} stroke="#1F2937" strokeWidth="2" fillOpacity="0.7" rx={loadWidth / 2} ry={loadWidth / 2} />;
      case 'cable_spool':
        return <g>
            <circle cx={loadX + loadLength / 2} cy={loadY + loadWidth / 2} r={Math.min(loadLength, loadWidth) / 2} fill={getFillColor(normalizedLoad.category)} stroke="#1F2937" strokeWidth="2" fillOpacity="0.7" />
            <circle cx={loadX + loadLength / 2} cy={loadY + loadWidth / 2} r={Math.min(loadLength, loadWidth) / 6} fill="none" stroke="#1F2937" strokeWidth="1" />
            <line x1={loadX + loadLength / 2 - Math.min(loadLength, loadWidth) / 2} y1={loadY + loadWidth / 2} x2={loadX + loadLength / 2 + Math.min(loadLength, loadWidth) / 2} y2={loadY + loadWidth / 2} stroke="#1F2937" strokeWidth="1" />
          </g>;
      case 'blade':
        return <path d={`M ${loadX},${loadY + loadWidth / 2} 
                Q ${loadX + loadLength / 4},${loadY + loadWidth / 4} ${loadX + loadLength / 2},${loadY + loadWidth / 3} 
                T ${loadX + loadLength},${loadY + loadWidth / 2}
                Q ${loadX + loadLength / 4 * 3},${loadY + loadWidth / 4 * 3} ${loadX + loadLength / 2},${loadY + loadWidth / 3 * 2}
                T ${loadX},${loadY + loadWidth / 2}`} fill={getFillColor(normalizedLoad.category)} stroke="#1F2937" strokeWidth="2" fillOpacity="0.7" />;
      default:
        return <rect x={loadX} y={loadY} width={loadLength} height={loadWidth} fill={getFillColor(normalizedLoad.category)} stroke="#1F2937" strokeWidth="2" fillOpacity="0.7" />;
    }
  };
  return <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-full">
      {/* Load shape */}
      {renderShape()}
      {/* Center of gravity */}
      <circle cx={cgX} cy={cgY} r={6} fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
      <circle cx={cgX} cy={cgY} r={12} fill="none" stroke="#991B1B" strokeWidth="1" strokeDasharray="3,3" />
      {/* Labels */}
      <text x={loadX + loadLength / 2} y={loadY - 10} fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1F2937">
        {normalizedLoad.category} - {normalizedLoad.weight}t
      </text>
      {/* Dimensions */}
      <text x={loadX + loadLength / 2} y={loadY + loadWidth + 20} fontSize="10" textAnchor="middle" fill="#4B5563">
        L: {normalizedLoad.dims.length}m × W: {normalizedLoad.dims.width}m × H:{' '}
        {normalizedLoad.dims.height}m
      </text>
      {/* CG info */}
      <text x={cgX} y={cgY - 15} fontSize="8" textAnchor="middle" fill="#991B1B">
        CG
      </text>
    </svg>;
}