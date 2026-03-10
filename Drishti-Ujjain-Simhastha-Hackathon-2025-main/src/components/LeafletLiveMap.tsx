import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polygon, Tooltip, Pane, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MockData, Checkpoint, Sector, ChokePoint } from '../utils/mockData';
import { AlertTriangle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface Props { data: MockData; }

// Fix default marker icons (Leaflet's default asset path issue in bundlers)
// We are not using default markers but this prevents console warnings if added later.
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const center: [number, number] = [23.1825, 75.7772];

const HeatLayer: React.FC<{ points: [number, number, number][] }> = ({ points }) => {
  const map = useMap();
  const layerRef = useRef<any>(null); // leaflet.heat has no TS types bundled
  useEffect(() => {
    if (!layerRef.current) {
      // @ts-ignore
      layerRef.current = (L as any).heatLayer(points, { radius: 28, blur: 18, maxZoom: 17, minOpacity: 0.25, gradient: { 0.3: '#34d399', 0.5: '#fbbf24', 0.7: '#f97316', 0.85: '#ef4444' } }).addTo(map);
    } else {
      layerRef.current.setLatLngs(points);
    }
  }, [points, map]);
  return null;
};

const AnimatedPilgrims: React.FC<{ features: GeoJSON.Feature<GeoJSON.Point>[] }>= ({ features }) => {
  useMap();
  const [positions, setPositions] = useState<[number, number][]>(() => features.slice(0,150).map(f=>[f.geometry.coordinates[1], f.geometry.coordinates[0]]));
  useEffect(()=>{
    const id = setInterval(()=>{
      setPositions(prev => prev.map(([lat, lon]) => [lat + (Math.random()-0.5)*0.00015, lon + (Math.random()-0.5)*0.00015]));
    }, 3000);
    return ()=>clearInterval(id);
  },[]);
  return (
    <Pane name="pilgrims" style={{ zIndex: 410 }}>
      {positions.map((p,i)=>(
        <CircleMarker key={i} center={p} radius={2} pathOptions={{ color: '#67e8f9', opacity:0.8, fillOpacity:0.8 }} />
      ))}
    </Pane>
  );
};

const LeafletLiveMap: React.FC<Props> = ({ data }) => {
  const { setSelectedPOI } = useAppContext();
  const heatPoints = useMemo(() => data.pilgrimPaths.features.slice(0,400).map(f => [f.geometry.coordinates[1], f.geometry.coordinates[0], Math.random()*0.8+0.2] as [number, number, number]), [data.pilgrimPaths]);
  const [showPilgrims, setShowPilgrims] = useState(true);
  const [showHeat, setShowHeat] = useState(true);
  const [showChoke, setShowChoke] = useState(true);
  const [showCheckpoints, setShowCheckpoints] = useState(true);

  return (
    <div className="w-full h-full relative bg-slate-900">
      <MapContainer center={center} zoom={14} className="w-full h-full" preferCanvas>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showHeat && <HeatLayer points={heatPoints} />}
        {showPilgrims && <AnimatedPilgrims features={data.pilgrimPaths.features} />}

        {/* Sector Polygons */}
        <Pane name="sectors" style={{ zIndex: 400 }}>
          {data.sectors.map((s: Sector) => (
            <Polygon
              key={s.id}
              positions={s.geometry.coordinates[0].map(([lon, lat]) => [lat, lon])}
              pathOptions={{ color: 'white', weight:1, opacity:0.4, fillColor: s.density > 0.7 ? '#ef4444' : s.density>0.5 ? '#f97316' : s.density>0.35 ? '#fbbf24' : '#34d399', fillOpacity:0.25 }}
              eventHandlers={{ click: () => setSelectedPOI(s) }}
            >
              <Tooltip sticky className="!bg-slate-800 !text-white !border-none !rounded-md !px-2 !py-1 text-xs">
                <div className="font-semibold">{s.name}</div>
                <div>Density: {(s.density*100).toFixed(1)}%</div>
              </Tooltip>
            </Polygon>
          ))}
        </Pane>

        {/* Checkpoints */}
        <Pane name="checkpoints" style={{ zIndex: 420 }}>
          {showCheckpoints && data.checkpoints.map((cp: Checkpoint) => (
            <CircleMarker
              key={cp.id}
              center={[cp.coordinates[1], cp.coordinates[0]]}
              radius={cp.tier === 3 ? 8 : cp.tier === 2 ? 6 : 5}
              pathOptions={{
                color: cp.status==='low-stock' ? '#f87171' : cp.status==='busy' ? '#fb923c' : '#10b981',
                fillColor: cp.type === 'medical' ? '#ec4899' : cp.type==='water' ? '#0ea5e9' : cp.type==='security' ? '#6366f1' : cp.type==='logistics' ? '#f59e0b' : '#94a3b8',
                fillOpacity:0.9,
                weight:2
              }}
              eventHandlers={{ click: ()=> setSelectedPOI(cp) }}
            >
              <Tooltip direction="top" offset={[0,-2]} className="!bg-slate-800 !text-white !border-none !rounded-md !px-2 !py-1 text-xs">
                <div className="font-semibold">{cp.name}</div>
                <div className="text-[10px]">Status: {cp.status}</div>
              </Tooltip>
            </CircleMarker>
          ))}
        </Pane>

        {/* Choke Points */}
        {showChoke && (
          <Pane name="chokepoints" style={{ zIndex: 430 }}>
            {data.chokePoints.map((c: ChokePoint) => (
              <CircleMarker key={c.id} center={[c.coordinates[1], c.coordinates[0]]} radius={10} pathOptions={{ color:'#f43f5e', weight:2, fillColor:'#be123c', fillOpacity:0.5 }} eventHandlers={{ click:()=> setSelectedPOI(c as any) }} >
                <Tooltip className="!bg-red-700 !text-white !border-none !rounded-md !px-2 !py-1 text-xs">
                  <div className="font-semibold">Risk {(c.riskScore*100).toFixed(1)}%</div>
                  <div>ETA {c.etaMinutes}m</div>
                </Tooltip>
              </CircleMarker>
            ))}
          </Pane>
        )}
      </MapContainer>

      {/* Floating Controls */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="absolute top-4 left-4 space-y-3 z-[500]">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-3 w-56 shadow-lg space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Layers</h4>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Pilgrims</span><input type="checkbox" checked={showPilgrims} onChange={()=>setShowPilgrims(v=>!v)} className="accent-blue-500" />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Heatmap</span><input type="checkbox" checked={showHeat} onChange={()=>setShowHeat(v=>!v)} className="accent-blue-500" />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Checkpoints</span><input type="checkbox" checked={showCheckpoints} onChange={()=>setShowCheckpoints(v=>!v)} className="accent-blue-500" />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Choke Points</span><input type="checkbox" checked={showChoke} onChange={()=>setShowChoke(v=>!v)} className="accent-blue-500" />
          </div>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-3 w-56 shadow-lg text-xs text-slate-300 space-y-2">
          <div className="flex items-center space-x-2 text-red-400"><AlertTriangle className="w-4 h-4"/><span className="font-semibold">Live Simulation</span></div>
          <p className="text-[11px] leading-relaxed text-slate-400">All data layers are simulated for demonstration. Crowd flows & risks auto-refresh every few seconds.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LeafletLiveMap;
