import React from 'react';
import { Html } from '@react-three/drei';
import { TrailerSpec, TruckSpec } from '../../types/trailer';
import { computeTrailerOffset } from '../../utils/computeTrailerOffset';
interface ConnectionVisualizerProps {
  trailer: TrailerSpec;
  truck: TruckSpec;
  connectionAdjustments: {
    offset: number;
    height: number;
    rotation: number;
  };
}
export function ConnectionVisualizer({
  trailer,
  truck,
  connectionAdjustments
}: ConnectionVisualizerProps) {
  // Calculate position for the visualizer based on connection type
  const getPosition = () => {
    const offset = computeTrailerOffset(trailer, truck);
    // Position the visualizer at the connection point
    return [offset / 2, 2, 0];
  };
  const position = getPosition();
  // Get connection-specific details
  const getConnectionDetails = () => {
    if (trailer.connection === 'gooseneck') {
      return {
        type: 'Gooseneck',
        details: [`Kingpin height: ${trailer.kingpin_height_m || 'N/A'} m`, `Swing radius: ${trailer.swing_radius_m || 'N/A'} m`]
      };
    } else if (trailer.connection === 'towbar') {
      return {
        type: 'Towbar',
        details: [`Towbar length: ${trailer.towbar_length_m || 'N/A'} m`, `Eye height: ${trailer.eye_height_m || 'N/A'} m`]
      };
    } else if (trailer.connection === 'jeep_dolly') {
      return {
        type: 'Jeep/Dolly',
        details: [`Jeep axles: ${trailer.jeep_axles || 'N/A'}`, `Jeep length: ${trailer.jeep_length_m || 'N/A'} m`]
      };
    }
    return {
      type: 'Unknown',
      details: []
    };
  };
  const connectionDetails = getConnectionDetails();
  return <group position={position}>
      {/* 3D connection indicator */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={trailer.connection === 'gooseneck' ? '#3B82F6' : trailer.connection === 'towbar' ? '#10B981' : '#F59E0B'} emissive={trailer.connection === 'gooseneck' ? '#3B82F6' : trailer.connection === 'towbar' ? '#10B981' : '#F59E0B'} emissiveIntensity={0.5} transparent opacity={0.7} />
      </mesh>
      {/* HTML overlay with connection details */}
      <Html position={[0, 1, 0]} wrapperClass="pointer-events-none" center distanceFactor={10}>
        <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700 text-center w-48">
          <div className="text-sm font-medium">
            {connectionDetails.type} Connection
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {connectionDetails.details.map((detail, i) => <div key={i}>{detail}</div>)}
          </div>
        </div>
      </Html>
    </group>;
}