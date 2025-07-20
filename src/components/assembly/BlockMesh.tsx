import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
interface BlockMeshProps {
  position: [number, number, number];
  size?: number;
  color?: string;
  highlight?: boolean;
}
export function BlockMesh({
  position,
  size = 0.25,
  color = '#3B82F6',
  highlight = false
}: BlockMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  // Add a subtle animation for highlighted blocks
  useFrame(state => {
    if (highlight && meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });
  return <mesh position={position} ref={meshRef}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} emissive={highlight ? color : undefined} emissiveIntensity={highlight ? 0.5 : 0} />
    </mesh>;
}