import React from 'react';
import { TrailerMesh } from './TrailerMesh';
import { TractorMesh } from './TractorMesh';
import { TrailerSpec, TruckSpec } from '../../types/trailer';
import { LoadSpec } from '../../types/load';
import { computeTrailerOffset } from '../../utils/computeTrailerOffset';
interface RigGroupProps {
  trailer: TrailerSpec;
  truck?: TruckSpec;
  load?: LoadSpec;
  showAxles: boolean;
  showDeck: boolean;
  showConnection: boolean;
  showTractor: boolean;
}
export function RigGroup({
  trailer,
  truck,
  load,
  showAxles = true,
  showDeck = true,
  showConnection = true,
  showTractor = true
}: RigGroupProps) {
  // Calculate the position of the trailer based on the connection type
  const getTrailerPosition = () => {
    if (!showTractor || !truck) return [0, 0, 0];
    const offset = computeTrailerOffset(trailer, truck);
    return [offset, 0, 0];
  };
  const trailerPosition = getTrailerPosition();
  return <group>
      {/* Tractor/Truck */}
      {showTractor && truck && <TractorMesh truck={truck} position={[0, 0, 0]} />}
      {/* Trailer with position offset based on connection type */}
      <group position={trailerPosition}>
        <TrailerMesh trailer={trailer} showAxles={showAxles} showDeck={showDeck} showConnection={showConnection} />
        {/* Load if provided */}
        {load && showDeck && <mesh position={[load.cargo_length / 2 + (load.cargo_cg_chainage - load.cargo_length / 2), trailer.deck_height_m + load.cargo_height / 2, load.cargo_cg_offset]} castShadow>
            <boxGeometry args={[load.cargo_length, load.cargo_height, load.cargo_width]} />
            <meshStandardMaterial color="#F59E0B" transparent={true} opacity={0.8} />
          </mesh>}
      </group>
    </group>;
}