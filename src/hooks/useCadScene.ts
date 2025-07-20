import { useCallback, useState } from 'react';
import { TrailerSpec, TruckSpec } from '../types/trailer';
interface ExportOptions {
  viewMode: 'plan' | 'isometric';
  cameraView: 'top' | 'side' | 'front' | 'isometric';
  showAxles: boolean;
  showDeck: boolean;
  showConnection: boolean;
  showDimensions: boolean;
  showTractor: boolean;
}
export function useCadScene() {
  const [isExporting, setIsExporting] = useState(false);
  const [svgCache, setSvgCache] = useState<Record<string, string>>({});
  // Function to export the CAD scene
  const exportCAD = useCallback(async (trailer: TrailerSpec, format: 'svg' | 'glb' | 'dxf' | 'all', options: ExportOptions) => {
    setIsExporting(true);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a file download
      const viewLabel = options.cameraView === 'isometric' ? 'iso' : options.cameraView;
      let fileName = `${trailer.manufacturer}_${trailer.model}_${viewLabel}`.replace(/\s+/g, '_').toLowerCase();
      if (format === 'svg') {
        // Get cached SVG if available
        const cacheKey = `${trailer.id}_${viewLabel}_${options.showTractor ? 'with_truck' : 'no_truck'}`;
        const svgContent = svgCache[cacheKey];
        if (svgContent) {
          // Create a Blob with the SVG content
          const blob = new Blob([svgContent], {
            type: 'image/svg+xml'
          });
          downloadBlob(blob, `${fileName}.svg`);
        } else {
          // If not cached, we'd normally generate it
          // For now, create a simple SVG placeholder
          const svgPlaceholder = generatePlaceholderSVG(trailer, options.cameraView);
          const blob = new Blob([svgPlaceholder], {
            type: 'image/svg+xml'
          });
          downloadBlob(blob, `${fileName}.svg`);
        }
        return true;
      }
      if (format === 'all') {
        fileName = `${trailer.manufacturer}_${trailer.model}_3view`.replace(/\s+/g, '_').toLowerCase();
        // Generate a combined 3-view technical drawing
        const combinedSVG = generateCombinedTechnicalDrawing(trailer, options.showTractor);
        const blob = new Blob([combinedSVG], {
          type: 'image/svg+xml'
        });
        downloadBlob(blob, `${fileName}.svg`);
        return true;
      }
      // For other formats, continue with existing implementation
      const dataStr = JSON.stringify({
        trailer,
        options,
        format
      }, null, 2);
      const dataBlob = new Blob([dataStr], {
        type: 'application/json'
      });
      downloadBlob(dataBlob, `${fileName}.${format === 'all' ? 'dxf' : format}`);
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [svgCache]);
  // Helper function to download a blob without file-saver
  const downloadBlob = (blob: Blob, fileName: string) => {
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    // Append to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Release the blob URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };
  // Function to cache an SVG
  const cacheSVG = useCallback((key: string, svgContent: string) => {
    setSvgCache(prev => ({
      ...prev,
      [key]: svgContent
    }));
  }, []);
  // Helper function to convert world coordinates to screen coordinates
  const worldToScreen = useCallback((worldPos, camera, width, height) => {
    // This would be implemented with proper 3D to 2D projection
    // For now, we'll return a simplified version
    return {
      x: width / 2 + worldPos.x * 10,
      y: height / 2 - worldPos.y * 10
    };
  }, []);
  // Generate a placeholder SVG for testing
  const generatePlaceholderSVG = (trailer: TrailerSpec, view: string) => {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <rect width="100%" height="100%" fill="white" />
        <text x="400" y="300" font-family="Arial" font-size="24" text-anchor="middle">
          ${trailer.manufacturer} ${trailer.model} - ${view.toUpperCase()} View
        </text>
        <text x="400" y="340" font-family="Arial" font-size="18" text-anchor="middle">
          ${trailer.type} trailer with ${trailer.axles} axles
        </text>
        <rect x="200" y="380" width="${trailer.length_closed_m * 30}" height="${trailer.width_m * 30}" 
              stroke="black" stroke-width="2" fill="none" />
      </svg>
    `;
  };
  // Generate a combined technical drawing with all three views
  const generateCombinedTechnicalDrawing = (trailer: TrailerSpec, showTractor: boolean) => {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
        <rect width="100%" height="100%" fill="white" />
        <!-- Title Block -->
        <rect x="50" y="50" width="1100" height="80" fill="#f0f0f0" stroke="#333" stroke-width="1" />
        <text x="600" y="90" font-family="Arial" font-size="24" text-anchor="middle" font-weight="bold">
          ${trailer.manufacturer} ${trailer.model} - Technical Drawing
        </text>
        <text x="600" y="120" font-family="Arial" font-size="16" text-anchor="middle">
          ${trailer.type} trailer with ${trailer.axles} axles - ${trailer.connection} connection
        </text>
        <!-- Top View -->
        <rect x="50" y="150" width="1100" height="240" fill="none" stroke="#333" stroke-width="1" />
        <text x="100" y="180" font-family="Arial" font-size="18" font-weight="bold">Top View</text>
        <rect x="250" y="200" width="${trailer.length_closed_m * 25}" height="${trailer.width_m * 25}" 
              stroke="black" stroke-width="2" fill="none" />
        <text x="250" y="270" font-family="Arial" font-size="14" text-anchor="start">
          Length: ${trailer.length_closed_m}m
        </text>
        <text x="550" y="350" font-family="Arial" font-size="14" text-anchor="middle">
          Width: ${trailer.width_m}m
        </text>
        <!-- Side View -->
        <rect x="50" y="410" width="1100" height="240" fill="none" stroke="#333" stroke-width="1" />
        <text x="100" y="440" font-family="Arial" font-size="18" font-weight="bold">Side View</text>
        <rect x="250" y="480" width="${trailer.length_closed_m * 25}" height="${trailer.deck_height_m * 50}" 
              stroke="black" stroke-width="2" fill="none" />
        <text x="250" y="550" font-family="Arial" font-size="14" text-anchor="start">
          Length: ${trailer.length_closed_m}m
        </text>
        <text x="550" y="630" font-family="Arial" font-size="14" text-anchor="middle">
          Deck Height: ${trailer.deck_height_m}m
        </text>
        <!-- Front View -->
        <rect x="50" y="670" width="1100" height="180" fill="none" stroke="#333" stroke-width="1" />
        <text x="100" y="700" font-family="Arial" font-size="18" font-weight="bold">Front View</text>
        <rect x="500" y="720" width="${trailer.width_m * 25}" height="${trailer.deck_height_m * 50}" 
              stroke="black" stroke-width="2" fill="none" />
        <text x="600" y="800" font-family="Arial" font-size="14" text-anchor="middle">
          Width: ${trailer.width_m}m
        </text>
        <text x="700" y="770" font-family="Arial" font-size="14" text-anchor="start">
          Deck Height: ${trailer.deck_height_m}m
        </text>
      </svg>
    `;
  };
  return {
    isExporting,
    exportCAD,
    cacheSVG,
    worldToScreen
  };
}