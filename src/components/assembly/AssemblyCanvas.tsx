import React, { useEffect, useState, useRef, Suspense, createElement, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, PerspectiveCamera, Html } from '@react-three/drei';
import { TrailerSpec, TruckSpec } from '../../types/trailer';
import { LoadSpec } from '../../types/load';
import { AssemblyRig } from './AssemblyRig';
import { ConnectionVisualizer } from './ConnectionVisualizer';
interface AssemblyCanvasProps {
  trailer: TrailerSpec | null;
  truck: TruckSpec | null;
  load?: LoadSpec | null;
  connectionAdjustments: {
    offset: number;
    height: number;
    rotation: number;
  };
  showConnectionDetails: boolean;
}
export function AssemblyCanvas({
  trailer,
  truck,
  load,
  connectionAdjustments,
  showConnectionDetails
}: AssemblyCanvasProps) {
  const controlsRef = useRef(null);
  const [canvasError, setCanvasError] = useState<Error | null>(null);
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);
  const [cameraPosition] = useState([15, 10, 15]);
  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsWebGLAvailable(false);
        throw new Error('WebGL not supported');
      }
    } catch (e) {
      setIsWebGLAvailable(false);
      setCanvasError(new Error('WebGL initialization failed'));
    }
  }, []);
  // Handle WebGL context errors
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      if (event.message.includes('WebGL') || event.message.includes('Canvas')) {
        setCanvasError(new Error('Failed to initialize 3D viewer'));
      }
    }
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  if (!isWebGLAvailable) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg">
        <div className="text-center p-6">
          <div className="text-lg font-medium mb-2">
            {t('3D Viewer Not Available')}
          </div>
          <p className="text-sm text-surface-400">
            {t('Your browser does not support WebGL, which is required for 3D visualization.')}
          </p>
        </div>
      </div>;
  }
  if (canvasError) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg">
        <div className="text-center p-6">
          <div className="text-lg font-medium mb-2 text-danger-500">
            {t('3D Viewer Error')}
          </div>
          <p className="text-sm text-surface-400">{canvasError.message}</p>
        </div>
      </div>;
  }
  return <div className="w-full h-full min-h-[400px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
      {!trailer || !truck ? <div className="h-full flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-lg font-medium mb-2">
              {!truck && !trailer ? t('Select a truck and trailer to begin') : !truck ? t('Select a truck to complete the assembly') : t('Select a trailer to complete the assembly')}
            </div>
            <p className="text-sm text-surface-400">
              {t('Use the controls on the right to select vehicles')}
            </p>
          </div>
        </div> : <ErrorBoundary fallback={<div className="h-full flex items-center justify-center">
              <div className="text-center p-6">
                <div className="text-lg font-medium mb-2 text-danger-500">
                  {t('3D Viewer Error')}
                </div>
                <p className="text-sm text-surface-400">
                  {t('An error occurred while rendering the 3D view')}
                </p>
              </div>
            </div>}>
          <Canvas shadows onError={error => setCanvasError(error)} gl={{
        alpha: false,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance'
      }}>
            <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
            <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} minDistance={5} maxDistance={50} />
            <Suspense fallback={<Html center>
                  <div className="text-center">
                    <div className="text-lg font-medium mb-2">
                      {t('Loading 3D scene...')}
                    </div>
                  </div>
                </Html>}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow shadow-mapSize={[2048, 2048]} />
              <directionalLight position={[-10, 10, -5]} intensity={0.4} />
              <Grid args={[50, 50]} position={[0, -0.01, 0]} cellSize={1} cellThickness={0.5} cellColor="#A9B4C6" sectionSize={5} sectionThickness={1} sectionColor="#E1E5EC" fadeDistance={50} infiniteGrid />
              <AssemblyRig trailer={trailer} truck={truck} load={load} connectionAdjustments={connectionAdjustments} />
              {showConnectionDetails && <ConnectionVisualizer trailer={trailer} truck={truck} connectionAdjustments={connectionAdjustments} />}
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </ErrorBoundary>}
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}
// Error boundary component
class ErrorBoundary extends Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
}, {
  hasError: boolean;
}> {
  constructor(props: {
    children: React.ReactNode;
    fallback: React.ReactNode;
  }) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}