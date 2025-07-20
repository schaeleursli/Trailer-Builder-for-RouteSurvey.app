import React, { useMemo } from 'react';
import * as THREE from 'three';
import { TrailerSpec } from '../../types/trailer';
interface TrailerMeshProps {
  trailer: TrailerSpec;
  showAxles?: boolean;
  showDeck?: boolean;
  showConnection?: boolean;
  position?: [number, number, number];
}
export function TrailerMesh({
  trailer,
  showAxles = true,
  showDeck = true,
  showConnection = true,
  position = [0, 0, 0]
}: TrailerMeshProps) {
  // Materials
  const materials = useMemo(() => {
    return {
      deck: new THREE.MeshStandardMaterial({
        color: '#64748B',
        roughness: 0.7,
        metalness: 0.2
      }),
      axles: new THREE.MeshStandardMaterial({
        color: '#475569',
        roughness: 0.6,
        metalness: 0.3
      }),
      connection: new THREE.MeshStandardMaterial({
        color: '#3B82F6',
        roughness: 0.5,
        metalness: 0.3
      })
    };
  }, []);
  // Trailer dimensions
  const trailerLength = trailer.length_closed_m;
  const trailerWidth = trailer.width_m;
  const deckHeight = trailer.deck_height_m;
  const deckThickness = 0.2;
  return <group position={position}>
      {/* Deck */}
      {showDeck && <mesh position={[trailerLength / 2, deckHeight - deckThickness / 2, 0]} material={materials.deck} receiveShadow castShadow>
          <boxGeometry args={[trailerLength, deckThickness, trailerWidth]} />
        </mesh>}

      {/* Axles */}
      {showAxles && Array.from({
      length: trailer.axles
    }).map((_, i) => <mesh key={`axle-${i}`} position={[trailerLength - 1 - i * (trailer.axle_spacing_m || 1.5), 0, 0]} material={materials.axles} receiveShadow castShadow>
            <boxGeometry args={[0.2, 0.4, trailerWidth + 0.4]} />
          </mesh>)}

      {/* Connection */}
      {showConnection && trailer.connection === 'gooseneck' && <mesh position={[0, deckHeight / 2, 0]} material={materials.connection} receiveShadow castShadow>
          <boxGeometry args={[1, deckHeight, trailerWidth * 0.7]} />
        </mesh>}

      {showConnection && trailer.connection === 'towbar' && <mesh position={[-(trailer.towbar_length_m || 4) / 2, deckHeight / 3, 0]} material={materials.connection} receiveShadow castShadow>
          <boxGeometry args={[trailer.towbar_length_m || 4, 0.2, 0.2]} />
        </mesh>}

      {showConnection && trailer.connection === 'jeep_dolly' && trailer.jeep_axles && <group position={[-(trailer.jeep_length_m || 4) / 2, 0, 0]}>
            <mesh position={[0, deckHeight / 2, 0]} material={materials.connection} receiveShadow castShadow>
              <boxGeometry args={[trailer.jeep_length_m || 4, deckHeight, trailerWidth * 0.6]} />
            </mesh>
            {/* Jeep axles */}
            {Array.from({
        length: trailer.jeep_axles
      }).map((_, i) => <mesh key={`jeep-axle-${i}`} position={[-(trailer.jeep_length_m || 4) / 2 + 0.5 + i * 1.2, 0, 0]} material={materials.axles} receiveShadow castShadow>
                <boxGeometry args={[0.2, 0.4, trailerWidth + 0.4]} />
              </mesh>)}
          </group>}
    </group>;
}