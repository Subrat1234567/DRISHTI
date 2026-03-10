import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { MockData, Checkpoint, Sector, SOSAlert } from '../utils/mockData';
import { 
  Users, AlertTriangle, Activity, MapPin, TrendingUp, Gauge, Package, Heart, X, BarChart, Server, Thermometer
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface RightPanelProps {
  data: MockData;
}

const GlobalStats: React.FC<{ data: MockData }> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <h3 className="text-white font-semibold mb-4 flex items-center"><Gauge className="w-5 h-5 mr-2 text-blue-400" />Live Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-bold text-blue-400">{(data.totalCrowd / 1000000).toFixed(2)}M</div>
          <div className="text-xs text-slate-400">Est. Pilgrims</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-400">{data.activeSOS}</div>
          <div className="text-xs text-slate-400">Active SOS</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">{data.avgResponseTime}s</div>
          <div className="text-xs text-slate-400">Avg. Response</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-400">{data.activeDrones}</div>
          <div className="text-xs text-slate-400">Drones Active</div>
        </div>
      </div>
    </div>
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <h3 className="text-white font-semibold mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-green-400" />Crowd Trend (Hourly)</h3>
      <div className="h-32"><ResponsiveContainer width="100%" height="100%"><AreaChart data={Array.from({length: 8}, (_, i) => ({time: `${i*2+6}:00`, crowd: data.totalCrowd * (0.8 + Math.random() * 0.4)}))}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} /><YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`}/><Tooltip /><Area type="monotone" dataKey="crowd" stroke="#3b82f6" fill="url(#g)" strokeWidth={2}/></AreaChart></ResponsiveContainer></div>
    </div>
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <h3 className="text-white font-semibold mb-4 flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-red-400" />Incoming SOS Alerts</h3>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {data.sosAlerts.slice(0, 5).map((alert, index) => (
          <div key={index} className="bg-slate-700/50 rounded-lg p-2 border border-slate-600 text-xs">
            <div className="flex justify-between items-center"><span className="text-white font-medium">Medical Emergency</span><span className="text-slate-400">{alert.timestamp}</span></div>
            <div className="text-slate-300">Pilgrim ID: {alert.pilgrimId}</div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const CheckpointDetails: React.FC<{ poi: Checkpoint }> = ({ poi }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
    <h3 className="text-lg font-bold text-white">{poi.name}</h3>
    <div className="flex items-center space-x-4 text-sm">
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${poi.status === 'operational' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{poi.status}</span>
      <span className="text-slate-400">Tier: <span className="font-bold text-white">{poi.tier}</span></span>
      <span className="text-slate-400">Personnel: <span className="font-bold text-white">{poi.personnel}</span></span>
    </div>
    <div>
      <h4 className="text-md font-semibold text-white mb-2">Live Inventory</h4>
      <div className="space-y-3">
        {Object.entries(poi.inventory).map(([item, { current, max }]) => (
          <div key={item}>
            <div className="flex justify-between text-xs mb-1"><span className="text-slate-300">{item}</span><span className="text-slate-400">{current} / {max}</span></div>
            <div className="w-full bg-slate-700 rounded-full h-2"><div className="h-2 rounded-full bg-blue-500" style={{ width: `${(current / max) * 100}%` }}></div></div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const SectorDetails: React.FC<{ poi: Sector }> = ({ poi }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
    <h3 className="text-lg font-bold text-white">{poi.name}</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-xs text-slate-400">Current Density</div>
        <div className="text-2xl font-bold text-orange-400">{(poi.density * 100).toFixed(1)}%</div>
      </div>
      <div>
        <div className="text-xs text-slate-400">Predicted (15m)</div>
        <div className="text-2xl font-bold text-red-400">{(poi.predictedDensity * 100).toFixed(1)}%</div>
      </div>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-3"><div className="h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" style={{ width: `${poi.density * 100}%` }}></div></div>
  </motion.div>
);

const RightPanel: React.FC<RightPanelProps> = ({ data }) => {
  const { selectedPOI, setSelectedPOI } = useAppContext();

  return (
    <motion.div 
      className="w-96 bg-slate-900/95 backdrop-blur-sm border-l border-slate-700 flex flex-col"
      initial={{ x: 384 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 flex-grow overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedPOI ? (
            <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Details</h2>
                <button onClick={() => setSelectedPOI(null)} className="p-1 rounded-full hover:bg-slate-700"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              {'inventory' in selectedPOI && <CheckpointDetails poi={selectedPOI as Checkpoint} />}
              {'geometry' in selectedPOI && <SectorDetails poi={selectedPOI as Sector} />}
              {'pilgrimId' in selectedPOI && <div>SOS Details...</div>}
            </motion.div>
          ) : (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-bold text-white mb-4">Live Overview</h2>
              <GlobalStats data={data} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RightPanel;
