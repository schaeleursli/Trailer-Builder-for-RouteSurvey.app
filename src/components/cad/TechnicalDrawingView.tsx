import React, { useEffect, useState } from 'react';
import { TrailerSpec, TruckSpec } from '../../types/trailer';
import { SVGExporter } from './SVGExporter';
interface TechnicalDrawingViewProps {
  trailer: TrailerSpec;
  truck?: TruckSpec;
  showTractor: boolean;
  showAxles: boolean;
  showDeck: boolean;
  showConnection: boolean;
  onSVGsReady?: (svgs: {
    top: string;
    side: string;
    front: string;
  }) => void;
}
export function TechnicalDrawingView({
  trailer,
  truck,
  showTractor,
  showAxles,
  showDeck,
  showConnection,
  onSVGsReady
}: TechnicalDrawingViewProps) {
  const [svgs, setSvgs] = useState<{
    top?: string;
    side?: string;
    front?: string;
  }>({});
  // When all SVGs are ready, call the callback
  useEffect(() => {
    if (svgs.top && svgs.side && svgs.front && onSVGsReady) {
      onSVGsReady({
        top: svgs.top,
        side: svgs.side,
        front: svgs.front
      });
    }
  }, [svgs, onSVGsReady]);
  const handleSVGReady = (view: 'top' | 'side' | 'front', svgString: string) => {
    setSvgs(prev => ({
      ...prev,
      [view]: svgString
    }));
  };
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 aspect-video">
        <h3 className="text-sm font-medium mb-2 text-center">Top View</h3>
        <div className="h-full">
          <SVGExporter trailer={trailer} truck={truck} view="top" width={400} height={300} showAxles={showAxles} showDeck={showDeck} showConnection={showConnection} showTractor={showTractor} onSVGReady={svg => handleSVGReady('top', svg)} />
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 aspect-video">
        <h3 className="text-sm font-medium mb-2 text-center">Side View</h3>
        <div className="h-full">
          <SVGExporter trailer={trailer} truck={truck} view="side" width={400} height={300} showAxles={showAxles} showDeck={showDeck} showConnection={showConnection} showTractor={showTractor} onSVGReady={svg => handleSVGReady('side', svg)} />
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 aspect-video md:col-span-2">
        <h3 className="text-sm font-medium mb-2 text-center">Front View</h3>
        <div className="h-full">
          <SVGExporter trailer={trailer} truck={truck} view="front" width={400} height={300} showAxles={showAxles} showDeck={showDeck} showConnection={showConnection} showTractor={showTractor} onSVGReady={svg => handleSVGReady('front', svg)} />
        </div>
      </div>
    </div>;
}