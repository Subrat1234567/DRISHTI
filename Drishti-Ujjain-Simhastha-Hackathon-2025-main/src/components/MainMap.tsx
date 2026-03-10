import React, { useRef, useMemo } from 'react';
import Map, { Source, Layer, Marker, MapRef, LayerProps } from 'react-map-gl';
import { motion } from 'framer-motion';
import { MockData, Checkpoint, Sector, SOSAlert } from '../utils/mockData';
import { useAppContext } from '../contexts/AppContext';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Heart, Utensils, Droplets, Shield, Info, AlertTriangle, Plane
} from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface MainMapProps {
  data: MockData;
}

const getCheckpointIcon = (type: string) => {
  switch (type) {
    case 'medical': return Heart;
    case 'logistics': return Utensils;
    case 'water': return Droplets;
    case 'security': return Shield;
    case 'info': return Info;
    default: return Info;
  }
};

const MainMap: React.FC<MainMapProps> = ({ data }) => {
  const { setSelectedPOI } = useAppContext();
  const mapRef = useRef<MapRef>(null);

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes('YOUR_') || MAPBOX_TOKEN.startsWith('Y***')) {
    return (
      <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-center p-8">
        <AlertTriangle className="w-16 h-16 text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Mapbox Configuration Required</h2>
        <p className="text-slate-300 max-w-md">
          A valid Mapbox access token has not been provided. The map cannot be displayed.
        </p>
        <div className="mt-6 bg-slate-900 p-4 rounded-lg border border-slate-700 text-left text-sm w-full max-w-lg">
          <p className="font-semibold text-white mb-3">Next Steps:</p>
          <ol className="list-decimal list-inside text-slate-400 space-y-2">
            <li>
              Go to your <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-medium">Mapbox account</a> and copy your access token.
            </li>
            <li>
              In the file explorer on the left, open the <code className="bg-slate-700 text-yellow-300 px-1.5 py-1 rounded-md">.env</code> file.
            </li>
            <li>
              Replace the placeholder value with your actual token and save the file. The map will then load automatically.
            </li>
          </ol>
        </div>
      </div>
    );
  }

  const sectorsGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Polygon> = useMemo(() => ({
    type: 'FeatureCollection',
    features: data.sectors.map(sector => ({
      type: 'Feature',
      geometry: sector.geometry,
      properties: { id: sector.id, name: sector.name, density: sector.density },
    })),
  }), [data.sectors]);

  const heatmapData: GeoJSON.FeatureCollection<GeoJSON.Point> = useMemo(() => ({
    type: 'FeatureCollection',
    features: data.pilgrimPaths.features.map(f => ({
      ...f,
      properties: { mag: Math.random() }
    }))
  }), [data.pilgrimPaths]);

  const sectorFillLayer: LayerProps = {
    id: 'sectors-fill',
    type: 'fill',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'density'],
        0.2, '#34d399',
        0.4, '#fbbf24',
        0.6, '#f97316',
        0.8, '#ef4444'
      ],
      'fill-opacity': 0.35,
    },
  };

  const sectorLineLayer: LayerProps = {
    id: 'sectors-line',
    type: 'line',
    paint: {
      'line-color': '#ffffff',
      'line-width': 1,
      'line-opacity': 0.5,
    },
  };

  const heatmapLayer: LayerProps = {
    id: 'heatmap',
    type: 'heatmap',
    maxzoom: 15,
    paint: {
      'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 5, 1],
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 10, 1, 15, 3],
      'heatmap-color': [
        'interpolate', ['linear'], ['heatmap-density'],
        0, 'rgba(34, 211, 238, 0)',
        0.2, 'rgba(52, 211, 153, 0.5)',
        0.4, 'rgba(251, 191, 36, 0.5)',
        0.6, 'rgba(249, 115, 22, 0.5)',
        0.8, 'rgba(239, 68, 68, 0.6)'
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 20, 15, 80],
      'heatmap-opacity': 0.8,
    },
  };

  return (
    <div className="relative w-full h-full bg-slate-800">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: 75.7772,
          latitude: 23.1825,
          zoom: 14,
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: '100%', height: '100%' }}
        onClick={(e) => {
          const features = mapRef.current?.queryRenderedFeatures(e.point, { layers: ['sectors-fill'] });
          if (features && features.length > 0) {
            const sectorId = features[0].properties?.id;
            const sector = data.sectors.find(s => s.id === sectorId);
            if (sector) setSelectedPOI(sector);
          }
        }}
      >
        <Source id="sectors" type="geojson" data={sectorsGeoJSON}>
          <Layer {...sectorFillLayer} />
          <Layer {...sectorLineLayer} />
        </Source>
        
        <Source id="heatmap-data" type="geojson" data={heatmapData}>
          <Layer {...heatmapLayer} />
        </Source>

        {data.checkpoints.map((cp: Checkpoint) => {
          const Icon = getCheckpointIcon(cp.type);
          return (
            <Marker key={cp.id} longitude={cp.coordinates[0]} latitude={cp.coordinates[1]} anchor="bottom">
              <motion.div
                whileHover={{ scale: 1.2, y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedPOI(cp)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg ${
                  cp.status === 'operational' ? 'bg-green-500 border-green-300' :
                  cp.status === 'busy' ? 'bg-orange-500 border-orange-300' :
                  cp.status === 'low-stock' ? 'bg-red-500 border-red-300 shadow-red-500/50' :
                  'bg-blue-500 border-blue-300'
                }`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            </Marker>
          );
        })}

        {data.sosAlerts.map((alert: SOSAlert, index) => (
          <Marker key={`sos-${index}`} longitude={alert.coordinates[0]} latitude={alert.coordinates[1]} anchor="bottom">
            <motion.div
              className="cursor-pointer"
              onClick={() => setSelectedPOI({ ...alert, x: 0, y: 0 })}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center border-2 border-white animate-pulse shadow-lg shadow-red-500/50">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          </Marker>
        ))}

        {data.pilgrimPaths.features.slice(0, 50).map((feature, index) => (
          <Marker key={`pilgrim-${index}`} longitude={feature.geometry.coordinates[0]} latitude={feature.geometry.coordinates[1]}>
            <motion.div 
              className="w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-70"
              animate={{
                x: [0, Math.random() * 20 - 10, 0],
                y: [0, Math.random() * 20 - 10, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                repeatType: 'mirror'
              }}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MainMap;
