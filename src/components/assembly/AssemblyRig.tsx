import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { TrailerSpec, TruckSpec } from '../../types/trailer';
import { LoadSpec, normalizeLoadSpec } from '../../types/load';
import { computeTrailerOffset } from '../../utils/computeTrailerOffset';
interface AssemblyRigProps {
  trailer: TrailerSpec;
  truck: TruckSpec;
  load?: LoadSpec;
  connectionAdjustments: {
    offset: number;
    height: number;
    rotation: number;
  };
}
export function AssemblyRig({
  trailer,
  truck,
  load,
  connectionAdjustments
}: AssemblyRigProps) {
  const groupRef = useRef(null);
  // Calculate trailer position based on connection type
  const trailerOffset = computeTrailerOffset(trailer, truck) + connectionAdjustments.offset;
  // Simple truck representation
  const renderTruck = () => <group position={[0, 0, 0]}>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[truck.wheelbase_m, 2, 2.5]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>
      <mesh position={[truck.wheelbase_m / 2 - 1, 0.5, 0]} castShadow>
        <boxGeometry args={[truck.wheelbase_m, 1, 2.5]} />
        <meshStandardMaterial color="#1E40AF" />
      </mesh>
    </group>;
  // Simple trailer representation
  const renderTrailer = () => {
    const trailerPosition = [trailerOffset, trailer.deck_height_m + connectionAdjustments.height, 0];
    return <group position={trailerPosition} rotation={[0, connectionAdjustments.rotation * Math.PI / 180, 0]}>
        <mesh position={[trailer.length_closed_m / 2, 0.1, 0]} receiveShadow>
          <boxGeometry args={[trailer.length_closed_m, 0.2, trailer.width_m]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        {/* Render load if provided */}
        {load && renderLoad(load)}
        {/* Axles */}
        {Array.from({
        length: trailer.axles
      }).map((_, i) => <mesh key={`axle-${i}`} position={[trailer.length_closed_m - 1 - i * (trailer.axle_spacing_m || 1.5), -0.5, 0]}>
            <boxGeometry args={[0.2, 0.2, trailer.width_m + 0.5]} />
            <meshStandardMaterial color="#475569" />
          </mesh>)}
      </group>;
  };
  // Render load with custom shape support
  const renderLoad = (loadSpec: LoadSpec) => {
    const normalizedLoad = normalizeLoadSpec(loadSpec);
    // Position for the load
    const loadPosition = [normalizedLoad.cg.chainage, normalizedLoad.dims.height / 2 + 0.2, normalizedLoad.cg.offset];
    // If we have a custom shape SVG
    if (normalizedLoad.shapeSvg) {
      // Scale factor to convert from SVG viewBox (0-100) to real dimensions
      const svgScale = {
        x: normalizedLoad.dims.length / 100,
        z: normalizedLoad.dims.width / 100
      };
      // Offset to center the SVG shape on the CG
      const offsetX = -normalizedLoad.dims.length / 2;
      const offsetZ = -normalizedLoad.dims.width / 2;
      return <group position={[loadPosition[0] + offsetX, loadPosition[1], loadPosition[2] + offsetZ]}>
          <Html transform scale={[svgScale.x, normalizedLoad.dims.height, svgScale.z]} rotation={[-Math.PI / 2, 0, 0]} position={[normalizedLoad.dims.length / 2, 0, normalizedLoad.dims.width / 2]}>
            <div style={{
            width: '100px',
            height: '100px',
            transform: 'rotateX(180deg)' // Flip to match 3D orientation
          }} dangerouslySetInnerHTML={{
            __html: normalizedLoad.shapeSvg
          }} />
          </Html>
        </group>;
    }
    // Default box shape if no custom shape
    return <mesh position={loadPosition} castShadow>
        <boxGeometry args={[normalizedLoad.dims.length, normalizedLoad.dims.height, normalizedLoad.dims.width]} />
        <meshStandardMaterial color="#F59E0B" transparent opacity={0.8} />
      </mesh>;
  };
  return <group ref={groupRef}>
      {renderTruck()}
      {renderTrailer()}
    </group>;
}