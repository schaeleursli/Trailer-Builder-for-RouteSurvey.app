import React, { useEffect, useRef } from 'react';
import { TruckSpec } from '../../types/trailer';
interface TruckTopViewProps {
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
export function TruckTopView({
  config,
  zoom,
  layers
}: TruckTopViewProps) {
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
    // Get truck dimensions
    const truckLength = config.overall_length_m || config.wheelbase_m + 2.7;
    const truckWidth = config.overall_width_m || 2.55;
    const trackWidth = config.track_width_m || 2.55;
    const cabLength = config.cab_type === 'sleeper' ? 2.5 : 1.8;
    const cabWidth = truckWidth;
    // Center the truck
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    // Origin is at the center of the canvas
    const originX = padding;
    const originY = canvasHeight / 2;
    // Set transform
    ctx.save();
    ctx.translate(originX, originY);
    ctx.scale(scale, scale);
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
    // Draw chassis outline if enabled
    if (layers.chassis) {
      ctx.beginPath();
      ctx.rect(0, -truckWidth / 2, truckLength, truckWidth);
      ctx.fillStyle = 'rgba(75, 85, 99, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#4B5563';
      ctx.lineWidth = 0.02;
      ctx.stroke();
    }
    // Draw cab if enabled
    if (layers.cab) {
      ctx.beginPath();
      ctx.rect(0, -cabWidth / 2, cabLength, cabWidth);
      ctx.fillStyle = 'rgba(107, 114, 128, 0.3)';
      ctx.fill();
      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 0.02;
      ctx.stroke();
      // Windshield representation
      ctx.beginPath();
      ctx.rect(cabLength - 0.3, -0.6, 0.2, 1.2);
      ctx.fillStyle = 'rgba(165, 243, 252, 0.5)';
      ctx.fill();
    }
    // Draw axles and wheels if enabled
    if (layers.tires) {
      axlePositions.forEach((pos, index) => {
        // Draw axle line
        ctx.beginPath();
        ctx.moveTo(pos, -trackWidth / 2);
        ctx.lineTo(pos, trackWidth / 2);
        ctx.strokeStyle = index === 0 ? '#4B5563' : '#EF4444'; // Front axle different color
        ctx.lineWidth = 0.04;
        ctx.stroke();
        // Draw wheels
        const wheelWidth = 0.3;
        const wheelRadius = 0.15;
        // Left wheel
        ctx.beginPath();
        ctx.ellipse(pos, -trackWidth / 2, wheelRadius, wheelWidth / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1F2937';
        ctx.fill();
        // Right wheel
        ctx.beginPath();
        ctx.ellipse(pos, trackWidth / 2, wheelRadius, wheelWidth / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1F2937';
        ctx.fill();
        // Draw dual wheels for rear axles
        if (index > 0) {
          // Left dual wheel
          ctx.beginPath();
          ctx.ellipse(pos, -trackWidth / 2 - wheelWidth, wheelRadius, wheelWidth / 2, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#1F2937';
          ctx.fill();
          // Right dual wheel
          ctx.beginPath();
          ctx.ellipse(pos, trackWidth / 2 + wheelWidth, wheelRadius, wheelWidth / 2, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#1F2937';
          ctx.fill();
        }
        // Draw axle weight label if enabled
        if (layers.axleLabels && config.axle_weights && config.axle_weights[index]) {
          ctx.save();
          ctx.scale(1 / scale, 1 / scale); // Reset scale for text
          ctx.font = '12px Arial';
          ctx.fillStyle = '#1F2937';
          ctx.textAlign = 'center';
          ctx.fillText(`${config.axle_weights[index]}t`, pos * scale, 0);
          ctx.restore();
        }
      });
    }
    // Draw kingpin if enabled and truck has kingpin
    if (layers.kingpin && config.has_kingpin) {
      const kingpinX = axlePositions[axlePositions.length - 1] - (config.kingpin_offset_m || 0.5);
      ctx.beginPath();
      ctx.arc(kingpinX, 0, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 0.02;
      ctx.stroke();
    }
    // Draw counterweight if enabled and truck has counterweight
    if (layers.counterweight && config.has_counterweight) {
      const counterweightX = truckLength - (config.counterweight_position_m || 0.5);
      const counterweightWidth = 0.4;
      const counterweightDepth = truckWidth * 0.8;
      ctx.beginPath();
      ctx.rect(counterweightX - counterweightWidth, -counterweightDepth / 2, counterweightWidth, counterweightDepth);
      ctx.fillStyle = 'rgba(107, 114, 128, 0.5)';
      ctx.fill();
      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 0.02;
      ctx.stroke();
    }
    // Draw dimensions if enabled
    if (layers.dimensions) {
      // Draw track width dimension
      ctx.beginPath();
      ctx.moveTo(-0.3, -trackWidth / 2);
      ctx.lineTo(-0.3, trackWidth / 2);
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 0.02;
      ctx.stroke();
      // Arrows
      drawArrow(ctx, -0.3, -trackWidth / 2, 0, 0.1);
      drawArrow(ctx, -0.3, trackWidth / 2, 0, -0.1);
      // Label
      ctx.save();
      ctx.scale(1 / scale, 1 / scale); // Reset scale for text
      ctx.font = '12px Arial';
      ctx.fillStyle = '#3B82F6';
      ctx.textAlign = 'center';
      ctx.fillText(`${trackWidth.toFixed(2)}m`, -0.3 * scale, 0);
      ctx.restore();
      // Draw overall width dimension
      ctx.beginPath();
      ctx.moveTo(truckLength / 2, -truckWidth / 2 - 0.3);
      ctx.lineTo(truckLength / 2, truckWidth / 2 + 0.3);
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 0.02;
      ctx.stroke();
      // Arrows
      drawArrow(ctx, truckLength / 2, -truckWidth / 2 - 0.3, 0, 0.1);
      drawArrow(ctx, truckLength / 2, truckWidth / 2 + 0.3, 0, -0.1);
      // Label
      ctx.save();
      ctx.scale(1 / scale, 1 / scale); // Reset scale for text
      ctx.font = '12px Arial';
      ctx.fillStyle = '#3B82F6';
      ctx.textAlign = 'center';
      ctx.fillText(`${truckWidth.toFixed(2)}m`, truckLength / 2 * scale, 0);
      ctx.restore();
      // Draw overall length dimension
      ctx.beginPath();
      ctx.moveTo(0, truckWidth / 2 + 0.3);
      ctx.lineTo(truckLength, truckWidth / 2 + 0.3);
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 0.02;
      ctx.stroke();
      // Arrows
      drawArrow(ctx, 0, truckWidth / 2 + 0.3, 0.1, 0);
      drawArrow(ctx, truckLength, truckWidth / 2 + 0.3, -0.1, 0);
      // Label
      ctx.save();
      ctx.scale(1 / scale, 1 / scale); // Reset scale for text
      ctx.font = '12px Arial';
      ctx.fillStyle = '#3B82F6';
      ctx.textAlign = 'center';
      ctx.fillText(`${truckLength.toFixed(2)}m`, truckLength / 2 * scale, (truckWidth / 2 + 0.5) * scale);
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