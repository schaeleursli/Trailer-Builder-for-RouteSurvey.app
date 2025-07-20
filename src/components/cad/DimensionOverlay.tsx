import React, { useEffect, useState, useRef } from 'react';
import { TrailerSpec, TruckSpec } from '../../types/trailer';
interface DimensionOverlayProps {
  trailer: TrailerSpec;
  truck?: TruckSpec;
  width: number;
  height: number;
  viewMode: 'plan' | 'isometric';
  cameraView: 'top' | 'side' | 'front' | 'isometric';
  showTractor: boolean;
}
// Temporary canvas-based implementation to avoid react-konva
export function DimensionOverlay({
  trailer,
  truck,
  width,
  height,
  viewMode,
  cameraView,
  showTractor
}: DimensionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !trailer) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    // Scale factor for converting meters to pixels
    const scale = Math.min(width, height) / 30;
    // Center offset
    const centerX = width / 2;
    const centerY = height / 2;
    // Draw dimension lines
    ctx.strokeStyle = '#3B82F6';
    ctx.fillStyle = '#1F2937';
    ctx.lineWidth = 2;
    ctx.font = '14px Inter';
    // Calculate total length including truck if shown
    const trailerLength = trailer.length_closed_m;
    const truckLength = showTractor && truck ? truck.wheelbase_m + 1 : 0;
    let totalLength = trailerLength;
    let connectionLength = 0;
    if (showTractor) {
      if (trailer.connection === 'gooseneck') {
        connectionLength = trailer.swing_radius_m || 2.0;
        totalLength = truckLength + trailerLength - connectionLength;
      } else if (trailer.connection === 'towbar') {
        connectionLength = trailer.towbar_length_m || 4.0;
        totalLength = truckLength + connectionLength + trailerLength;
      } else if (trailer.connection === 'jeep_dolly') {
        connectionLength = trailer.jeep_length_m || 4.0;
        totalLength = truckLength + connectionLength + trailerLength;
      }
    }
    const trailerWidth = trailer.width_m;
    const trailerHeight = (trailer.deck_height_m || 1.0) + 0.5; // Add a bit for the deck thickness
    const truckHeight = showTractor ? 3.5 : 0; // Approximate truck height
    const totalHeight = Math.max(trailerHeight, truckHeight);
    // Different dimensions based on camera view
    if (cameraView === 'top' || cameraView === 'isometric') {
      // Top view - length and width
      const startX = centerX - totalLength * scale / 2;
      const endX = centerX + totalLength * scale / 2;
      const y = centerY - trailerWidth * scale / 2 - 40;
      // Overall length
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
      const lengthLabel = `${totalLength.toFixed(1)} m`;
      const textWidth = ctx.measureText(lengthLabel).width;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect((startX + endX) / 2 - textWidth / 2 - 4, y - 20, textWidth + 8, 24);
      ctx.fillStyle = '#1F2937';
      ctx.fillText(lengthLabel, (startX + endX) / 2 - textWidth / 2, y - 4);
      // Width
      const widthStartY = centerY - trailerWidth * scale / 2;
      const widthEndY = centerY + trailerWidth * scale / 2;
      const widthX = centerX + totalLength * scale / 2 + 40;
      ctx.beginPath();
      ctx.moveTo(widthX, widthStartY);
      ctx.lineTo(widthX, widthEndY);
      ctx.stroke();
      const widthLabel = `${trailerWidth.toFixed(1)} m`;
      const widthTextWidth = ctx.measureText(widthLabel).width;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(widthX - widthTextWidth / 2 - 4, (widthStartY + widthEndY) / 2 - 12, widthTextWidth + 8, 24);
      ctx.fillStyle = '#1F2937';
      ctx.fillText(widthLabel, widthX - widthTextWidth / 2, (widthStartY + widthEndY) / 2 + 4);
      // Axle spacing if applicable
      if (trailer.axle_spacing_m && trailer.axles > 1) {
        const axleSpacingLabel = `${trailer.axle_spacing_m.toFixed(2)} m`;
        const axleTextWidth = ctx.measureText(axleSpacingLabel).width;
        const axleY = centerY + trailerWidth * scale / 2 + 40;
        const axleStartX = endX - trailer.axles * trailer.axle_spacing_m * scale;
        const axleEndX = endX - trailer.axle_spacing_m * scale;
        ctx.beginPath();
        ctx.moveTo(axleStartX, axleY);
        ctx.lineTo(axleEndX, axleY);
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect((axleStartX + axleEndX) / 2 - axleTextWidth / 2 - 4, axleY - 20, axleTextWidth + 8, 24);
        ctx.fillStyle = '#1F2937';
        ctx.fillText(axleSpacingLabel, (axleStartX + axleEndX) / 2 - axleTextWidth / 2, axleY - 4);
      }
    }
    if (cameraView === 'side') {
      // Side view - length and height
      const startX = centerX - totalLength * scale / 2;
      const endX = centerX + totalLength * scale / 2;
      const y = centerY + totalHeight * scale / 2 + 40;
      // Overall length
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
      const lengthLabel = `${totalLength.toFixed(1)} m`;
      const textWidth = ctx.measureText(lengthLabel).width;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect((startX + endX) / 2 - textWidth / 2 - 4, y + 4, textWidth + 8, 24);
      ctx.fillStyle = '#1F2937';
      ctx.fillText(lengthLabel, (startX + endX) / 2 - textWidth / 2, y + 20);
      // Height
      const heightStartY = centerY - totalHeight * scale / 2;
      const heightEndY = centerY + totalHeight * scale / 2;
      const heightX = centerX - totalLength * scale / 2 - 40;
      ctx.beginPath();
      ctx.moveTo(heightX, heightStartY);
      ctx.lineTo(heightX, heightEndY);
      ctx.stroke();
      const heightLabel = `${totalHeight.toFixed(1)} m`;
      const heightTextWidth = ctx.measureText(heightLabel).width;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(heightX - heightTextWidth / 2 - 4, (heightStartY + heightEndY) / 2 - 12, heightTextWidth + 8, 24);
      ctx.fillStyle = '#1F2937';
      ctx.fillText(heightLabel, heightX - heightTextWidth / 2, (heightStartY + heightEndY) / 2 + 4);
      // Deck height
      const deckHeightLabel = `${trailer.deck_height_m.toFixed(2)} m`;
      const deckTextWidth = ctx.measureText(deckHeightLabel).width;
      const deckX = centerX + totalLength * scale / 4;
      const groundY = centerY + totalHeight * scale / 2;
      const deckY = groundY - trailer.deck_height_m * scale;
      ctx.beginPath();
      ctx.moveTo(deckX, groundY);
      ctx.lineTo(deckX, deckY);
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(deckX + 4, (groundY + deckY) / 2 - 12, deckTextWidth + 8, 24);
      ctx.fillStyle = '#1F2937';
      ctx.fillText(deckHeightLabel, deckX + 8, (groundY + deckY) / 2 + 4);
      // Kingpin height if applicable
      if (trailer.connection === 'gooseneck' && trailer.kingpin_height_m) {
        const kingpinHeightLabel = `${trailer.kingpin_height_m.toFixed(2)} m`;
        const kingpinTextWidth = ctx.measureText(kingpinHeightLabel).width;
        const kingpinX = centerX - totalLength * scale / 3;
        const kingpinY = deckY - trailer.kingpin_height_m * scale;
        ctx.beginPath();
        ctx.moveTo(kingpinX, deckY);
        ctx.lineTo(kingpinX, kingpinY);
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(kingpinX - kingpinTextWidth - 12, (deckY + kingpinY) / 2 - 12, kingpinTextWidth + 8, 24);
        ctx.fillStyle = '#1F2937';
        ctx.fillText(kingpinHeightLabel, kingpinX - kingpinTextWidth - 8, (deckY + kingpinY) / 2 + 4);
      }
    }
    if (cameraView === 'front') {
      // Front view - width and height
      const widthStartX = centerX - trailerWidth * scale / 2;
      const widthEndX = centerX + trailerWidth * scale / 2;
      const widthY = centerY + totalHeight * scale / 2 + 40;
      // Width
      ctx.beginPath();
      ctx.moveTo(widthStartX, widthY);
      ctx.lineTo(widthEndX, widthY);
      ctx.stroke();
      const widthLabel = `${trailerWidth.toFixed(1)} m`;
      const widthTextWidth = ctx.measureText(widthLabel).width;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect((widthStartX + widthEndX) / 2 - widthTextWidth / 2 - 4, widthY + 4, widthTextWidth + 8, 24);
      ctx.fillStyle = '#1F2937';
      ctx.fillText(widthLabel, (widthStartX + widthEndX) / 2 - widthTextWidth / 2, widthY + 20);
      // Height
      const heightStartY = centerY - totalHeight * scale / 2;
      const heightEndY = centerY + totalHeight * scale / 2;
      const heightX = centerX - trailerWidth * scale / 2 - 40;
      ctx.beginPath();
      ctx.moveTo(heightX, heightStartY);
      ctx.lineTo(heightX, heightEndY);
      ctx.stroke();
      const heightLabel = `${totalHeight.toFixed(1)} m`;
      const heightTextWidth = ctx.measureText(heightLabel).width;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(heightX - heightTextWidth / 2 - 4, (heightStartY + heightEndY) / 2 - 12, heightTextWidth + 8, 24);
      ctx.fillStyle = '#1F2937';
      ctx.fillText(heightLabel, heightX - heightTextWidth / 2, (heightStartY + heightEndY) / 2 + 4);
      // Deck height
      const deckHeightLabel = `${trailer.deck_height_m.toFixed(2)} m`;
      const deckTextWidth = ctx.measureText(deckHeightLabel).width;
      const deckX = centerX + trailerWidth * scale / 2 + 40;
      const groundY = centerY + totalHeight * scale / 2;
      const deckY = groundY - trailer.deck_height_m * scale;
      ctx.beginPath();
      ctx.moveTo(deckX, groundY);
      ctx.lineTo(deckX, deckY);
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(deckX + 4, (groundY + deckY) / 2 - 12, deckTextWidth + 8, 24);
      ctx.fillStyle = '#1F2937';
      ctx.fillText(deckHeightLabel, deckX + 8, (groundY + deckY) / 2 + 4);
    }
  }, [trailer, truck, width, height, viewMode, cameraView, showTractor]);
  return <canvas ref={canvasRef} width={width} height={height} className="absolute inset-0 pointer-events-none" />;
}