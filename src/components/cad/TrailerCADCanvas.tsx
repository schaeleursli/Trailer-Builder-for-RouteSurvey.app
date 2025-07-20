import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import { TrailerMesh } from './TrailerMesh';
import { RigGroup } from './RigGroup';
import { DimensionOverlay } from './DimensionOverlay';
import { TrailerSpec, TruckSpec } from '../../types/trailer';
import { useTruckStore } from '../../hooks/useTruckStore';
interface TrailerCADCanvasProps {
  trailer: TrailerSpec;
  viewMode: 'plan' | 'isometric';
  cameraMode: 'orthographic' | 'perspective';
  cameraView: 'top' | 'side' | 'front' | 'isometric';
  showGrid: boolean;
  showDimensions: boolean;
  showAxles: boolean;
  showDeck: boolean;
  showConnection: boolean;
  showTractor: boolean;
}
// Scene setup component
function SceneSetup({
  cameraView,
  activeCameraRef
}: {
  cameraView: 'top' | 'side' | 'front' | 'isometric';
  activeCameraRef: React.RefObject<THREE.Camera>;
}) {
  const {
    camera,
    set
  } = useThree();
  useEffect(() => {
    if (activeCameraRef.current) {
      set({
        camera: activeCameraRef.current
      });
    }
  }, [cameraView, activeCameraRef, set]);
  return null;
}
// Lighting setup
function Lighting() {
  return <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-10, 10, -5]} intensity={0.4} />
    </>;
}
// Camera controller that handles transitions
function CameraController({
  cameraView,
  cameraMode,
  enableOrbitControls
}: {
  cameraView: 'top' | 'side' | 'front' | 'isometric';
  cameraMode: 'orthographic' | 'perspective';
  enableOrbitControls: boolean;
}) {
  const controlsRef = useRef(null);
  const {
    camera,
    size
  } = useThree();
  useEffect(() => {
    if (controlsRef.current) {
      if (cameraView !== 'isometric') {
        // Orthographic views - restrict rotation
        controlsRef.current.enableRotate = false;
      } else {
        // Isometric view - allow rotation
        controlsRef.current.enableRotate = enableOrbitControls;
        controlsRef.current.minPolarAngle = Math.PI / 8;
        controlsRef.current.maxPolarAngle = Math.PI / 2.5;
      }
    }
  }, [cameraView, enableOrbitControls]);
  // Calculate trailer dimensions to fit in view
  useEffect(() => {
    // Reset camera position when changing modes
    if (cameraMode === 'orthographic') {
      // Set orthographic camera to fit a 30m x 15m area
      const aspect = size.width / size.height;
      const frustumSize = 20;
      camera.left = frustumSize * aspect / -2;
      camera.right = frustumSize * aspect / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      camera.updateProjectionMatrix();
    }
  }, [camera, cameraMode, size]);
  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} rotateSpeed={0.7} minDistance={5} maxDistance={50} />;
}
export function TrailerCADCanvas({
  trailer,
  viewMode = 'isometric',
  cameraMode = 'orthographic',
  cameraView = 'top',
  showGrid = true,
  showDimensions = true,
  showAxles = true,
  showDeck = true,
  showConnection = true,
  showTractor = true
}: TrailerCADCanvasProps) {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });
  const {
    trucks
  } = useTruckStore();
  // Find a suitable truck for the trailer
  const defaultTruck = trucks.length > 0 ? trucks[0] : null;
  // Camera refs
  const topCameraRef = useRef(null);
  const sideCameraRef = useRef(null);
  const frontCameraRef = useRef(null);
  const isoCameraRef = useRef(null);
  // Get active camera ref based on view
  const getActiveCameraRef = () => {
    switch (cameraView) {
      case 'top':
        return topCameraRef;
      case 'side':
        return sideCameraRef;
      case 'front':
        return frontCameraRef;
      case 'isometric':
        return isoCameraRef;
      default:
        return topCameraRef;
    }
  };
  // Get dimensions of container
  useEffect(() => {
    if (canvasRef.current) {
      const updateDimensions = () => {
        setDimensions({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight
        });
      };
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, []);
  return <div ref={canvasRef} className="relative w-full h-full min-h-[400px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
      <Canvas shadows>
        <Suspense fallback={null}>
          <SceneSetup cameraView={cameraView} activeCameraRef={getActiveCameraRef()} />
          <Lighting />
          {/* Camera setup */}
          <OrthographicCamera ref={topCameraRef} makeDefault={cameraView === 'top'} position={[0, 20, 0]} zoom={40} up={[0, 0, 1]} lookAt={[0, 0, 0]} />
          <OrthographicCamera ref={sideCameraRef} makeDefault={cameraView === 'side'} position={[20, 0, 0]} zoom={40} up={[0, 1, 0]} lookAt={[0, 0, 0]} />
          <OrthographicCamera ref={frontCameraRef} makeDefault={cameraView === 'front'} position={[0, 0, 20]} zoom={40} up={[0, 1, 0]} lookAt={[0, 0, 0]} />
          <PerspectiveCamera ref={isoCameraRef} makeDefault={cameraView === 'isometric'} position={[15, 15, 15]} fov={50} />
          <CameraController cameraView={cameraView} cameraMode={cameraMode} enableOrbitControls={cameraView === 'isometric'} />
          {/* Grid */}
          {showGrid && <Grid args={[50, 50]} position={[0, -0.01, 0]} cellSize={1} cellThickness={0.5} cellColor={viewMode === 'plan' ? '#A9B4C6' : '#475466'} sectionSize={5} sectionThickness={1} sectionColor={viewMode === 'plan' ? '#E1E5EC' : '#2E323C'} fadeDistance={50} infiniteGrid />}
          {/* Trailer or Full Rig visualization */}
          {showTractor ? <RigGroup trailer={trailer} truck={defaultTruck} showAxles={showAxles} showDeck={showDeck} showConnection={showConnection} showTractor={showTractor} /> : <TrailerMesh trailer={trailer} showAxles={showAxles} showDeck={showDeck} showConnection={showConnection} />}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      {/* Dimension overlay */}
      {showDimensions && dimensions.width > 0 && <DimensionOverlay trailer={trailer} truck={defaultTruck} width={dimensions.width} height={dimensions.height} viewMode={viewMode} cameraView={cameraView} showTractor={showTractor} />}
    </div>;
}