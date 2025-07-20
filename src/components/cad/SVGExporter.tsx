import React, { useEffect, useRef, createElement } from 'react';
import { TrailerSpec, TruckSpec } from '../../types/trailer';
interface SVGExporterProps {
  trailer: TrailerSpec;
  truck?: TruckSpec;
  view: 'top' | 'side' | 'front';
  width: number;
  height: number;
  showAxles?: boolean;
  showDeck?: boolean;
  showConnection?: boolean;
  showTractor?: boolean;
  onSVGReady?: (svgString: string) => void;
}
export function SVGExporter({
  trailer,
  truck,
  view,
  width,
  height,
  showAxles = true,
  showDeck = true,
  showConnection = true,
  showTractor = true,
  onSVGReady
}: SVGExporterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    try {
      // Create SVG element directly without relying on Three.js
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', width.toString());
      svg.setAttribute('height', height.toString());
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      // Background
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      background.setAttribute('width', '100%');
      background.setAttribute('height', '100%');
      background.setAttribute('fill', 'white');
      svg.appendChild(background);
      // Calculate dimensions
      const padding = 40;
      const availableWidth = width - padding * 2;
      const availableHeight = height - padding * 2;
      // Scale factor to fit the drawing
      const scale = Math.min(availableWidth / trailer.length_closed_m, availableHeight / trailer.width_m);
      // Center position
      const centerX = width / 2;
      const centerY = height / 2;
      // Draw trailer outline based on view
      const outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      if (view === 'top') {
        const trailerWidth = trailer.width_m * scale;
        const trailerLength = trailer.length_closed_m * scale;
        outline.setAttribute('x', (centerX - trailerLength / 2).toString());
        outline.setAttribute('y', (centerY - trailerWidth / 2).toString());
        outline.setAttribute('width', trailerLength.toString());
        outline.setAttribute('height', trailerWidth.toString());
      } else if (view === 'side') {
        const trailerHeight = trailer.deck_height_m * scale;
        const trailerLength = trailer.length_closed_m * scale;
        outline.setAttribute('x', (centerX - trailerLength / 2).toString());
        outline.setAttribute('y', (centerY - trailerHeight / 2).toString());
        outline.setAttribute('width', trailerLength.toString());
        outline.setAttribute('height', trailerHeight.toString());
      } else if (view === 'front') {
        const trailerWidth = trailer.width_m * scale;
        const trailerHeight = trailer.deck_height_m * scale;
        outline.setAttribute('x', (centerX - trailerWidth / 2).toString());
        outline.setAttribute('y', (centerY - trailerHeight / 2).toString());
        outline.setAttribute('width', trailerWidth.toString());
        outline.setAttribute('height', trailerHeight.toString());
      }
      outline.setAttribute('stroke', 'black');
      outline.setAttribute('stroke-width', '2');
      outline.setAttribute('fill', '#4B5563');
      outline.setAttribute('fill-opacity', '0.7');
      svg.appendChild(outline);
      // Add dimensions text
      const dimensions = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      dimensions.setAttribute('x', (width / 2).toString());
      dimensions.setAttribute('y', (height - 20).toString());
      dimensions.setAttribute('text-anchor', 'middle');
      dimensions.setAttribute('font-family', 'Arial');
      dimensions.setAttribute('font-size', '12');
      dimensions.textContent = `${trailer.length_closed_m}m × ${trailer.width_m}m`;
      svg.appendChild(dimensions);
      // Clear container and append new SVG
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(svg);
      // Call callback with SVG string
      if (onSVGReady) {
        onSVGReady(svg.outerHTML);
      }
    } catch (error) {
      console.error('Error generating SVG:', error);
      // Create a fallback message element
      const fallback = document.createElement('div');
      fallback.className = 'text-red-500 p-4 text-center';
      fallback.textContent = 'Error generating SVG preview';
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(fallback);
    }
  }, [trailer, truck, view, width, height, showAxles, showDeck, showConnection, showTractor, onSVGReady]);
  return <div ref={containerRef} className="w-full h-full bg-white" />;
}