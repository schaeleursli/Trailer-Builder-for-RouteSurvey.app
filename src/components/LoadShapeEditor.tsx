import React, { useEffect, useState, useRef, Fragment } from 'react';
import { PlusIcon, MinusIcon, RotateCcwIcon, SaveIcon } from 'lucide-react';
interface Point {
  x: number;
  y: number;
}
interface LoadShapeEditorProps {
  initialPoints?: Point[];
  onChange: (points: Point[], svg: string) => void;
}
export function LoadShapeEditor({
  initialPoints,
  onChange
}: LoadShapeEditorProps) {
  // SVG canvas dimensions
  const SVG_WIDTH = 100;
  const SVG_HEIGHT = 100;
  // State for the shape points
  const [points, setPoints] = useState<Point[]>(initialPoints || [{
    x: 20,
    y: 30
  }, {
    x: 80,
    y: 30
  }, {
    x: 80,
    y: 70
  }, {
    x: 20,
    y: 70
  }]);
  // State for the currently dragged point
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  // SVG container ref to get mouse coordinates relative to SVG
  const svgRef = useRef<SVGSVGElement>(null);
  // Convert points to SVG path
  const pointsToPath = (pts: Point[]): string => {
    if (pts.length < 3) return '';
    return `M ${pts[0].x},${pts[0].y} ${pts.slice(1).map(p => `L ${p.x},${p.y}`).join(' ')} Z`;
  };
  // Convert points to SVG string
  const pointsToSvg = (pts: Point[]): string => {
    const path = pointsToPath(pts);
    return `<svg viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <path d="${path}" fill="#6B7280" stroke="#1F2937" stroke-width="2" fill-opacity="0.7"/>
    </svg>`;
  };
  // Add a new point between two existing points
  const addPoint = (index: number) => {
    const newPoints = [...points];
    const nextIndex = (index + 1) % points.length;
    // Calculate midpoint between two existing points
    const midX = (points[index].x + points[nextIndex].x) / 2;
    const midY = (points[index].y + points[nextIndex].y) / 2;
    newPoints.splice(nextIndex, 0, {
      x: midX,
      y: midY
    });
    setPoints(newPoints);
    // Notify parent of change
    onChange(newPoints, pointsToSvg(newPoints));
  };
  // Remove a point
  const removePoint = (index: number) => {
    if (points.length <= 3) return; // Don't remove if we'd have fewer than 3 points
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
    // Notify parent of change
    onChange(newPoints, pointsToSvg(newPoints));
  };
  // Reset to default rectangle
  const resetShape = () => {
    const defaultPoints = [{
      x: 20,
      y: 30
    }, {
      x: 80,
      y: 30
    }, {
      x: 80,
      y: 70
    }, {
      x: 20,
      y: 70
    }];
    setPoints(defaultPoints);
    // Notify parent of change
    onChange(defaultPoints, pointsToSvg(defaultPoints));
  };
  // Handle mouse down on a point
  const handlePointMouseDown = (index: number) => {
    setDraggingIndex(index);
  };
  // Handle mouse move in SVG
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggingIndex === null || !svgRef.current) return;
    // Get SVG bounding rect
    const svgRect = svgRef.current.getBoundingClientRect();
    // Calculate coordinates in SVG space
    const x = Math.min(Math.max(0, (e.clientX - svgRect.left) / svgRect.width * SVG_WIDTH), SVG_WIDTH);
    const y = Math.min(Math.max(0, (e.clientY - svgRect.top) / svgRect.height * SVG_HEIGHT), SVG_HEIGHT);
    // Update the point
    const newPoints = [...points];
    newPoints[draggingIndex] = {
      x,
      y
    };
    setPoints(newPoints);
    // Notify parent of change
    onChange(newPoints, pointsToSvg(newPoints));
  };
  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setDraggingIndex(null);
  };
  // Add event listeners for mouse up outside the component
  useEffect(() => {
    if (draggingIndex !== null) {
      const handleGlobalMouseUp = () => {
        setDraggingIndex(null);
      };
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [draggingIndex]);
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t('Custom Shape Editor')}</h3>
        <div className="flex gap-2">
          <button onClick={resetShape} className="h-8 px-3 bg-surface-100 text-primary-600 rounded hover:bg-surface-100/60 text-sm flex items-center gap-1" title={t('Reset to rectangle')}>
            <RotateCcwIcon className="h-4 w-4" />
            {t('Reset')}
          </button>
        </div>
      </div>
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0F1117]">
        <div className="flex gap-2 p-2 bg-surface-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
          <button onClick={() => addPoint(points.length - 1)} className="h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex items-center gap-1">
            <PlusIcon className="h-4 w-4" />
            {t('Add Point')}
          </button>
        </div>
        <svg ref={svgRef} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full aspect-square bg-gray-50 dark:bg-gray-900" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
          {/* Grid */}
          <g className="text-gray-200 dark:text-gray-800">
            {Array.from({
            length: 10
          }).map((_, i) => <Fragment key={`grid-${i}`}>
                <line x1="0" y1={i * 10 + 10} x2={SVG_WIDTH} y2={i * 10 + 10} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1={i * 10 + 10} y1="0" x2={i * 10 + 10} y2={SVG_HEIGHT} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
              </Fragment>)}
          </g>
          {/* Shape outline */}
          <path d={pointsToPath(points)} fill="#6B7280" stroke="#1F2937" strokeWidth="2" fillOpacity="0.7" />
          {/* Center of gravity marker */}
          <circle cx={SVG_WIDTH / 2} cy={SVG_HEIGHT / 2} r="3" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
          <circle cx={SVG_WIDTH / 2} cy={SVG_HEIGHT / 2} r="6" fill="none" stroke="#991B1B" strokeWidth="1" strokeDasharray="2,2" />
          {/* Points */}
          {points.map((point, index) => <g key={`point-${index}`}>
              {/* Point handle */}
              <circle cx={point.x} cy={point.y} r="4" fill={draggingIndex === index ? '#3B82F6' : '#1F2937'} stroke="#FFFFFF" strokeWidth="2" cursor="move" onMouseDown={() => handlePointMouseDown(index)} />
              {/* Point label */}
              <text x={point.x} y={point.y - 8} fontSize="8" fill="#1F2937" textAnchor="middle">
                {index + 1}
              </text>
              {/* Remove button */}
              {points.length > 3 && <g transform={`translate(${point.x + 8}, ${point.y - 8})`} cursor="pointer" onClick={() => removePoint(index)}>
                  <circle r="6" fill="#EF4444" />
                  <line x1="-3" y1="0" x2="3" y2="0" stroke="white" strokeWidth="1.5" />
                </g>}
              {/* Add point button (midpoint of line) */}
              {index < points.length && <g transform={`translate(
                    ${(point.x + points[(index + 1) % points.length].x) / 2},
                    ${(point.y + points[(index + 1) % points.length].y) / 2}
                  )`} cursor="pointer" onClick={() => addPoint(index)}>
                  <circle r="6" fill="#10B981" />
                  <line x1="-3" y1="0" x2="3" y2="0" stroke="white" strokeWidth="1.5" />
                  <line x1="0" y1="-3" x2="0" y2="3" stroke="white" strokeWidth="1.5" />
                </g>}
            </g>)}
        </svg>
        <div className="p-3 bg-surface-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
          <div className="text-sm text-surface-400">
            {t('Points')}: {points.length} • {t('Drag points to reshape')}
          </div>
        </div>
      </div>
      <div className="text-sm text-surface-400">
        <p>{t('This shape will be scaled to match the cargo dimensions.')}</p>
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}