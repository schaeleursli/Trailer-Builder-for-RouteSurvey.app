import React, { useEffect, useRef } from 'react';
import { TruckSpec } from '../../types/trailer';
interface TruckSideViewProps {
  config: TruckSpec;
  zoom: number;
  layers: {
    tires: boolean;
    chassis: boolean;
    cab: boolean;
    kingpin: boolean;
    counterweight: boolean;
    dimensions: boolean;
    axleLabels: boolean;
  };
}
export function TruckSideView({
  config,
  zoom,
  layers
}: TruckSideViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Set up scale and origin
    const padding = 50;
    const scale = 40 * zoom; // pixels per meter
    // Center the truck
    const truckLength = config.overall_length_m || config.wheelbase_m + 2.7;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    // Origin is at the bottom left of the canvas
    const originX = padding;
    const originY = canvasHeight - padding;
    // Set transform to make y-axis point upward
    ctx.save();
    ctx.translate(originX, originY);
    ctx.scale(scale, -scale); // Flip y-axis and apply zoom
    // Draw ground line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(truckLength + 1, 0);
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 0.02;
    ctx.stroke();
    // Calculate positions
    const wheelDiameter = 1.0; // 1 meter diameter wheels
    const chassisHeight = config.chassis_height_m || 1.0;
    const cabHeight = config.cab_height_m || 3.2;
    const cabLength = config.cab_type === 'sleeper' ? 2.5 : 1.8;
    // Parse axle configuration
    const numAxles = config.num_axles || (config.axle_config ? parseInt(config.axle_config.split('x')[0]) / 2 : 3);
    const axlePositions: number[] = [];
    // Calculate axle positions based on wheelbase and spacings
    if (config.axle_spacings && config.axle_spacings.length > 0) {
      axlePositions.push(1.5); // Front axle position from front bumper
      let currentPos = 1.5;
      for (let i = 0; i < config.axle_spacings.length; i++) {
        currentPos += config.axle_spacings[i];
        axlePositions.push(currentPos);
      }
    } else {
      // Fallback if no axle spacings defined
      const wheelbase = config.wheelbase_m;
      const axleSpacing = numAxles > 2 ? wheelbase / (numAxles - 1) : wheelbase;
      for (let i = 0; i < numAxles; i++) {
        axlePositions.push(1.5 + i * axleSpacing);
      }
    }
    // Draw chassis if enabled
    if (layers.chassis) {
      ctx.beginPath();
      ctx.rect(0.2, wheelDiameter / 2, truckLength - 0.4, chassisHeight - wheelDiameter / 2);
      ctx.fillStyle = '#4B5563';
      ctx.fill();
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 0.02;
      ctx.stroke();
    }
    // Draw cab if enabled
    if (layers.cab) {
      ctx.beginPath();
      if (config.cab_type === 'sleeper') {
        // Sleeper cab with more complex shape
        ctx.moveTo(0.2, chassisHeight);
        ctx.lineTo(0.2, chassisHeight + cabHeight);
        ctx.lineTo(cabLength - 0.5, chassisHeight + cabHeight);
        ctx.lineTo(cabLength, chassisHeight + cabHeight - 0.5);
        ctx.lineTo(cabLength, chassisHeight);
      } else {
        // Day cab with simpler shape
        ctx.rect(0.2, chassisHeight, cabLength, cabHeight);
      }
      ctx.fillStyle = '#6B7280';
      ctx.fill();
      ctx.strokeStyle = '#4B5563';
      ctx.lineWidth = 0.02;
      ctx.stroke();
      // Draw windshield
      ctx.beginPath();
      ctx.rect(cabLength - 0.8, chassisHeight + 1.2, 0.6, 1.0);
      ctx.fillStyle = '#A5F3FC';
      ctx.fill();
      ctx.strokeStyle = '#4B5563';
      ctx.lineWidth = 0.01;
      ctx.stroke();
    }
    // Draw wheels and axles if enabled
    if (layers.tires) {
      axlePositions.forEach((pos, index) => {
        // Draw axle
        ctx.beginPath();
        ctx.moveTo(pos, wheelDiameter / 2);
        ctx.lineTo(pos, wheelDiameter / 2 + 0.3);
        ctx.strokeStyle = index === 0 ? '#4B5563' : '#EF4444'; // Front axle different color than driven axles
        ctx.lineWidth = 0.06;
        ctx.stroke();
        // Draw wheel
        ctx.beginPath();
        ctx.ellipse(pos, wheelDiameter / 2, wheelDiameter / 2, wheelDiameter / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1F2937';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 0.02;
        ctx.stroke();
        // Draw axle weight label if enabled
        if (layers.axleLabels && config.axle_weights && config.axle_weights[index]) {
          ctx.save();
          ctx.scale(1 / scale, -1 / scale); // Reset scale for text
          ctx.font = '12px Arial';
          ctx.fillStyle = '#1F2937';
          ctx.textAlign = 'center';
          const labelY = -(wheelDiameter / 2 + 0.5) * scale;
          ctx.fillText(`${config.axle_weights[index]}t`, pos * scale, labelY);
          ctx.restore();
        }
      });
    }
    // Draw kingpin if enabled and truck has kingpin
    if (layers.kingpin && config.has_kingpin) {
      const kingpinX = axlePositions[axlePositions.length - 1] - (config.kingpin_offset_m || 0.5);
      const kingpinY = config.kingpin_height_m || 1.2;
      ctx.beginPath();
      ctx.arc(kingpinX, kingpinY, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 0.02;
      ctx.stroke();
      // Connection line
      ctx.beginPath();
      ctx.moveTo(kingpinX, chassisHeight);
      ctx.lineTo(kingpinX, kingpinY);
      ctx.strokeStyle = '#4B5563';
      ctx.lineWidth = 0.03;
      ctx.stroke();
    }
    // Draw counterweight if enabled and truck has counterweight
    if (layers.counterweight && config.has_counterweight) {
      const counterweightX = truckLength - (config.counterweight_position_m || 0.5);
      const counterweightWidth = 0.4;
      const counterweightHeight = 0.3;
      ctx.beginPath();
      ctx.rect(counterweightX - counterweightWidth, chassisHeight, counterweightWidth, counterweightHeight);
      ctx.fillStyle = '#6B7280';
      ctx.fill();
      ctx.strokeStyle = '#4B5563';
      ctx.lineWidth = 0.02;
      ctx.stroke();
    }
    // Draw dimensions if enabled
    if (layers.dimensions) {
      // Draw wheelbase dimension
      if (axlePositions.length >= 2) {
        const firstAxle = axlePositions[0];
        const lastAxle = axlePositions[axlePositions.length - 1];
        // Dimension line
        ctx.beginPath();
        ctx.moveTo(firstAxle, -0.3);
        ctx.lineTo(lastAxle, -0.3);
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 0.02;
        ctx.stroke();
        // Arrows
        drawArrow(ctx, firstAxle, -0.3, 0.1, 0);
        drawArrow(ctx, lastAxle, -0.3, -0.1, 0);
        // Label
        ctx.save();
        ctx.scale(1 / scale, -1 / scale); // Reset scale for text
        ctx.font = '12px Arial';
        ctx.fillStyle = '#3B82F6';
        ctx.textAlign = 'center';
        ctx.fillText(`${config.wheelbase_m.toFixed(2)}m`, (firstAxle + lastAxle) / 2 * scale, 0.4 * scale);
        ctx.restore();
      }
      // Draw overall length dimension
      ctx.beginPath();
      ctx.moveTo(0, -0.6);
      ctx.lineTo(truckLength, -0.6);
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 0.02;
      ctx.stroke();
      // Arrows
      drawArrow(ctx, 0, -0.6, 0.1, 0);
      drawArrow(ctx, truckLength, -0.6, -0.1, 0);
      // Label
      ctx.save();
      ctx.scale(1 / scale, -1 / scale); // Reset scale for text
      ctx.font = '12px Arial';
      ctx.fillStyle = '#3B82F6';
      ctx.textAlign = 'center';
      ctx.fillText(`${truckLength.toFixed(2)}m`, truckLength / 2 * scale, 0.7 * scale);
      ctx.restore();
      // Draw height dimension
      const totalHeight = chassisHeight + cabHeight;
      ctx.beginPath();
      ctx.moveTo(-0.3, 0);
      ctx.lineTo(-0.3, totalHeight);
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 0.02;
      ctx.stroke();
      // Arrows
      drawArrow(ctx, -0.3, 0, 0, 0.1);
      drawArrow(ctx, -0.3, totalHeight, 0, -0.1);
      // Label
      ctx.save();
      ctx.scale(1 / scale, -1 / scale); // Reset scale for text
      ctx.font = '12px Arial';
      ctx.fillStyle = '#3B82F6';
      ctx.textAlign = 'center';
      ctx.fillText(`${totalHeight.toFixed(2)}m`, -0.3 * scale, -(totalHeight / 2) * scale);
      ctx.restore();
    }
    // Restore context
    ctx.restore();
  }, [config, zoom, layers]);
  // Helper function to draw arrows
  function drawArrow(ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number) {
    const headSize = 0.05;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(x + dx - headSize * Math.sign(dx) - headSize * Math.sign(dy) / 2, y + dy - headSize * Math.sign(dy) - headSize * Math.sign(dx) / 2);
    ctx.lineTo(x + dx - headSize * Math.sign(dx) + headSize * Math.sign(dy) / 2, y + dy - headSize * Math.sign(dy) + headSize * Math.sign(dx) / 2);
    ctx.closePath();
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
  }
  return <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />;
}