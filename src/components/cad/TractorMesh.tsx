import React, { useMemo } from 'react';
import * as THREE from 'three';
import { TruckSpec } from '../../types/trailer';
interface TractorMeshProps {
  truck?: TruckSpec;
  position?: [number, number, number];
}
export function TractorMesh({
  truck,
  position = [0, 0, 0]
}: TractorMeshProps) {
  // Default truck dimensions if no truck is provided
  const defaultTruck = {
    wheelbase_m: 4.0,
    cab_type: 'sleeper',
    axle_config: '6x4',
    front_tires: {
      width_mm: 385,
      aspect_ratio: 65,
      rim_size_inch: 22.5
    },
    rear_tires: {
      width_mm: 315,
      aspect_ratio: 80,
      rim_size_inch: 22.5
    },
    has_kingpin: true,
    has_counterweight: true
  };
  const activeTruck = truck || defaultTruck as TruckSpec;
  // Materials
  const materials = useMemo(() => {
    return {
      cab: new THREE.MeshStandardMaterial({
        color: '#4B5563',
        roughness: 0.7,
        metalness: 0.2
      }),
      chassis: new THREE.MeshStandardMaterial({
        color: '#374151',
        roughness: 0.6,
        metalness: 0.3
      }),
      wheels: new THREE.MeshStandardMaterial({
        color: '#111827',
        roughness: 0.8,
        metalness: 0.1
      }),
      windows: new THREE.MeshStandardMaterial({
        color: '#A5F3FC',
        roughness: 0.3,
        metalness: 0.5,
        transparent: true,
        opacity: 0.8
      }),
      kingpin: new THREE.MeshStandardMaterial({
        color: '#3B82F6',
        roughness: 0.5,
        metalness: 0.3,
        emissive: '#1D4ED8',
        emissiveIntensity: 0.2
      })
    };
  }, []);
  // Parse axle configuration
  const [totalWheels, drivenWheels] = (activeTruck.axle_config || '6x4').split('x').map(Number);
  const frontAxles = totalWheels <= 6 ? 1 : 2;
  const rearAxles = totalWheels / 2 - frontAxles;
  // Truck dimensions
  const wheelbase = activeTruck.wheelbase_m || 4.0;
  const cabLength = activeTruck.cab_type === 'sleeper' ? 2.5 : 1.8;
  const truckWidth = 2.55;
  const cabHeight = 3.2;
  const chassisHeight = 1.0;
  const wheelDiameter = 1.0;
  const wheelWidth = 0.3;
  return <group position={position}>
      {/* Chassis */}
      <mesh position={[wheelbase / 2, chassisHeight / 2, 0]} material={materials.chassis} receiveShadow castShadow>
        <boxGeometry args={[wheelbase + 1, chassisHeight, truckWidth]} />
      </mesh>
      {/* Cab */}
      <mesh position={[cabLength / 2 - 0.5, chassisHeight + cabHeight / 2, 0]} material={materials.cab} receiveShadow castShadow>
        <boxGeometry args={[cabLength, cabHeight, truckWidth]} />
      </mesh>
      {/* Windshield */}
      <mesh position={[cabLength - 0.7, chassisHeight + cabHeight / 2 + 0.2, 0]} material={materials.windows} receiveShadow>
        <boxGeometry args={[0.1, 1.2, truckWidth - 0.5]} />
      </mesh>
      {/* Front axle wheels */}
      <group position={[0, 0, 0]}>
        {/* Left wheel */}
        <mesh position={[0, wheelDiameter / 2, -truckWidth / 2 - wheelWidth / 2]} rotation={[0, 0, Math.PI / 2]} material={materials.wheels} receiveShadow castShadow>
          <cylinderGeometry args={[wheelDiameter / 2, wheelDiameter / 2, wheelWidth, 16]} />
        </mesh>
        {/* Right wheel */}
        <mesh position={[0, wheelDiameter / 2, truckWidth / 2 + wheelWidth / 2]} rotation={[0, 0, Math.PI / 2]} material={materials.wheels} receiveShadow castShadow>
          <cylinderGeometry args={[wheelDiameter / 2, wheelDiameter / 2, wheelWidth, 16]} />
        </mesh>
      </group>
      {/* Rear axles */}
      {Array.from({
      length: rearAxles
    }).map((_, i) => <group key={`rear-axle-${i}`} position={[wheelbase - i * 1.4, 0, 0]}>
          {/* Left wheels (dual) */}
          <mesh position={[0, wheelDiameter / 2, -truckWidth / 2 - wheelWidth / 2]} rotation={[0, 0, Math.PI / 2]} material={materials.wheels} receiveShadow castShadow>
            <cylinderGeometry args={[wheelDiameter / 2, wheelDiameter / 2, wheelWidth, 16]} />
          </mesh>
          <mesh position={[0, wheelDiameter / 2, -truckWidth / 2 - wheelWidth * 1.5]} rotation={[0, 0, Math.PI / 2]} material={materials.wheels} receiveShadow castShadow>
            <cylinderGeometry args={[wheelDiameter / 2, wheelDiameter / 2, wheelWidth, 16]} />
          </mesh>
          {/* Right wheels (dual) */}
          <mesh position={[0, wheelDiameter / 2, truckWidth / 2 + wheelWidth / 2]} rotation={[0, 0, Math.PI / 2]} material={materials.wheels} receiveShadow castShadow>
            <cylinderGeometry args={[wheelDiameter / 2, wheelDiameter / 2, wheelWidth, 16]} />
          </mesh>
          <mesh position={[0, wheelDiameter / 2, truckWidth / 2 + wheelWidth * 1.5]} rotation={[0, 0, Math.PI / 2]} material={materials.wheels} receiveShadow castShadow>
            <cylinderGeometry args={[wheelDiameter / 2, wheelDiameter / 2, wheelWidth, 16]} />
          </mesh>
        </group>)}
      {/* Kingpin */}
      {activeTruck.has_kingpin && <mesh position={[wheelbase - 1, chassisHeight - 0.2, 0]} material={materials.kingpin} receiveShadow castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
        </mesh>}
      {/* Counterweight */}
      {activeTruck.has_counterweight && <mesh position={[wheelbase + 0.5, chassisHeight + 0.3, 0]} material={materials.chassis} receiveShadow castShadow>
          <boxGeometry args={[1, 0.6, truckWidth - 0.5]} />
        </mesh>}
    </group>;
}