import React from 'react';
import { TrailerModule } from '../types/trailer';
interface ModuleSvgPreviewProps {
  module: TrailerModule;
  viewType?: 'side' | 'top' | 'both';
}
export function ModuleSvgPreview({
  module,
  viewType = 'both'
}: ModuleSvgPreviewProps) {
  // SVG viewbox dimensions
  const viewBoxWidth = 400;
  const viewBoxHeight = viewType === 'both' ? 300 : 150;
  // Module colors based on type
  const getModuleColor = (type: string) => {
    switch (type) {
      case 'gooseneck':
        return '#3B82F6';
      // blue
      case 'deck':
        return '#10B981';
      // green
      case 'axle_bogie':
        return '#F59E0B';
      // amber
      case 'dolly':
        return '#8B5CF6';
      // purple
      case 'extension':
        return '#EC4899';
      // pink
      case 'ramp':
        return '#EF4444';
      // red
      default:
        return '#6B7280';
      // gray
    }
  };
  const moduleColor = getModuleColor(module.type);
  // Calculate dimensions in SVG space
  const moduleLength = 300 * (module.length / 15); // Scale to fit, assuming max length ~15m
  const moduleWidth = 120 * (module.width / 3); // Scale to fit, assuming max width ~3m
  const moduleHeight = 80 * (module.height / 1.5); // Scale to fit, assuming max height ~1.5m
  // Position in SVG
  const sideX = (viewBoxWidth - moduleLength) / 2;
  const sideY = 75 - moduleHeight / 2;
  const topX = (viewBoxWidth - moduleLength) / 2;
  const topY = (viewType === 'both' ? 225 : 75) - moduleWidth / 2;
  return <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-full">
      {/* Side View (always shown for 'side' or 'both') */}
      {(viewType === 'side' || viewType === 'both') && <g>
          {/* Module label for side view */}
          <text x={viewBoxWidth / 2} y={20} fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1F2937">
            {viewType === 'both' ? t('Side View') : t(module.type.charAt(0).toUpperCase() + module.type.slice(1).replace('_', ' '))}
          </text>
          {/* Module body */}
          <rect x={sideX} y={sideY} width={moduleLength} height={moduleHeight} fill={moduleColor} fillOpacity="0.2" stroke={moduleColor} strokeWidth="2" />
          {/* Type-specific elements */}
          {module.type === 'axle_bogie' && module.axleCount && <>
              {Array.from({
          length: module.axleCount
        }).map((_, i) => {
          const axleSpacing = module.axleSpacings?.[0] || 1.4;
          const axleX = sideX + 30 + i * (axleSpacing * 20);
          return <g key={`axle-${i}`}>
                    <line x1={axleX} y1={sideY + moduleHeight} x2={axleX} y2={sideY + moduleHeight + 20} stroke="#1F2937" strokeWidth="2" />
                    <circle cx={axleX} cy={sideY + moduleHeight + 30} r="10" fill="#1F2937" />
                  </g>;
        })}
            </>}
          {module.type === 'gooseneck' && module.kingpinHeight && <circle cx={sideX + moduleLength / 2} cy={sideY + moduleHeight - module.kingpinHeight * 50} r="8" fill="#3B82F6" stroke="#1F2937" strokeWidth="1" />}
          {module.type === 'ramp' && module.rampAngle && <line x1={sideX + moduleLength} y1={sideY + moduleHeight} x2={sideX + moduleLength + 50} y2={sideY + moduleHeight + 50 * Math.tan(module.rampAngle * Math.PI / 180)} stroke="#EF4444" strokeWidth="3" />}
          {/* Dimension labels */}
          <line x1={sideX} y1={sideY + moduleHeight + 50} x2={sideX + moduleLength} y2={sideY + moduleHeight + 50} stroke="#3B82F6" strokeWidth="1" />
          <text x={sideX + moduleLength / 2} y={sideY + moduleHeight + 65} fontSize="12" textAnchor="middle" fill="#3B82F6">
            {module.length} m
          </text>
          <line x1={sideX - 20} y1={sideY} x2={sideX - 20} y2={sideY + moduleHeight} stroke="#3B82F6" strokeWidth="1" />
          <text x={sideX - 35} y={sideY + moduleHeight / 2} fontSize="12" textAnchor="middle" fill="#3B82F6" transform={`rotate(-90, ${sideX - 35}, ${sideY + moduleHeight / 2})`}>
            {module.height} m
          </text>
        </g>}
      {/* Top View (always shown for 'top' or 'both') */}
      {(viewType === 'top' || viewType === 'both') && <g>
          {/* Module label for top view */}
          {viewType === 'both' && <text x={viewBoxWidth / 2} y={170} fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1F2937">
              {t('Top View')}
            </text>}
          {/* Module body */}
          <rect x={topX} y={topY} width={moduleLength} height={moduleWidth} fill={moduleColor} fillOpacity="0.2" stroke={moduleColor} strokeWidth="2" />
          {/* Type-specific elements */}
          {module.type === 'axle_bogie' && module.axleCount && <>
              {Array.from({
          length: module.axleCount
        }).map((_, i) => {
          const axleSpacing = module.axleSpacings?.[0] || 1.4;
          const axleX = topX + 30 + i * (axleSpacing * 20);
          return <line key={`axle-top-${i}`} x1={axleX} y1={topY - 10} x2={axleX} y2={topY + moduleWidth + 10} stroke="#1F2937" strokeWidth="1" strokeDasharray="4" />;
        })}
            </>}
          {module.type === 'gooseneck' && <circle cx={topX + moduleLength / 2} cy={topY + moduleWidth / 2} r="5" fill="#3B82F6" stroke="#1F2937" strokeWidth="1" />}
          {/* Dimension labels */}
          <line x1={topX} y1={topY + moduleWidth + 20} x2={topX + moduleLength} y2={topY + moduleWidth + 20} stroke="#3B82F6" strokeWidth="1" />
          <text x={topX + moduleLength / 2} y={topY + moduleWidth + 35} fontSize="12" textAnchor="middle" fill="#3B82F6">
            {module.length} m
          </text>
          <line x1={topX - 20} y1={topY} x2={topX - 20} y2={topY + moduleWidth} stroke="#3B82F6" strokeWidth="1" />
          <text x={topX - 35} y={topY + moduleWidth / 2} fontSize="12" textAnchor="middle" fill="#3B82F6" transform={`rotate(-90, ${topX - 35}, ${topY + moduleWidth / 2})`}>
            {module.width} m
          </text>
        </g>}
    </svg>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}