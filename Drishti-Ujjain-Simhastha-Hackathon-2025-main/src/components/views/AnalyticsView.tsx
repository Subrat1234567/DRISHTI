import React from 'react';
import { motion } from 'framer-motion';
import { MockData } from '../../utils/mockData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, Gauge, Clock } from 'lucide-react';

interface Props { data: MockData; }

const AnalyticsView: React.FC<Props> = ({ data }) => {
  const densitySeries = data.crowdPredictions.map(p => ({ sector: p.sectorId, now: p.now, p15: p.plus15, p30: p.plus30 }));
  const trendColors: Record<string, string> = { rising: 'text-red-400', falling: 'text-green-400', stable: 'text-yellow-400' };
  const hourlyCrowd = Array.from({ length: 12 }, (_, i) => ({
    t: `${(i+6).toString().padStart(2,'0')}:00`,
    crowd: Math.round(data.totalCrowd * (0.6 + Math.sin(i/3) * 0.15 + Math.random()*0.1))
  }));
  const responseSeries = Array.from({ length: 12 }, (_, i) => ({
    t: `${(i+6).toString().padStart(2,'0')}:00`,
    rt: Math.round(data.avgResponseTime * (0.8 + Math.random()*0.6))
  }));

  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-8">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="grid md:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-slate-300 text-xs">Total Estimated Crowd</span><Activity className="w-4 h-4 text-blue-400"/></div>
          <div className="text-2xl font-bold text-white">{(data.totalCrowd/1_000_000).toFixed(2)}M</div>
          <div className="text-xs text-slate-500">Live aggregated</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2"><span className="text-slate-300 text-xs">Avg Response</span><Clock className="w-4 h-4 text-cyan-400"/></div>
            <div className="text-2xl font-bold text-cyan-300">{data.avgResponseTime}s</div>
            <div className="text-xs text-slate-500">SOS median</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2"><span className="text-slate-300 text-xs">Active Drones</span><Gauge className="w-4 h-4 text-purple-400"/></div>
            <div className="text-2xl font-bold text-purple-300">{data.drones.length}</div>
            <div className="text-xs text-slate-500">Fleet engaged</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2"><span className="text-slate-300 text-xs">High Risk Nodes</span><AlertTriangle className="w-4 h-4 text-red-400"/></div>
            <div className="text-2xl font-bold text-red-300">{data.chokePoints.filter(c=>c.riskScore>0.7).length}</div>
            <div className="text-xs text-slate-500">Risk &gt; 0.7</div>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center space-x-2"><TrendingUp className="w-5 h-5 text-green-400"/><span>Crowd Flow Timeline</span></h3>
          <div className="h-56"><ResponsiveContainer width="100%" height="100%"><LineChart data={hourlyCrowd}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="t" stroke="#64748b" tick={{fontSize:11}}/><YAxis stroke="#64748b" tickFormatter={v=>`${(v/1_000_000).toFixed(1)}M`} tick={{fontSize:11}}/><Tooltip/><Line type="monotone" dataKey="crowd" stroke="#3b82f6" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>
        </div>
        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center space-x-2"><Clock className="w-5 h-5 text-yellow-400"/><span>Response Time Distribution</span></h3>
          <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={responseSeries}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="t" stroke="#64748b" tick={{fontSize:11}}/><YAxis stroke="#64748b" tick={{fontSize:11}}/><Tooltip/><Bar dataKey="rt" fill="#fbbf24" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-4">Sector Density Prediction</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase">
              <tr className="text-left">
                <th className="py-2 pr-4">Sector</th>
                <th className="py-2 pr-4">Now</th>
                <th className="py-2 pr-4">+15m</th>
                <th className="py-2 pr-4">+30m</th>
                <th className="py-2 pr-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {densitySeries.map(row => (
                <tr key={row.sector} className="border-t border-slate-700/60">
                  <td className="py-2 pr-4 text-white font-medium">{row.sector}</td>
                  <td className="py-2 pr-4"><span className="text-cyan-300 font-semibold">{(row.now*100).toFixed(1)}%</span></td>
                  <td className="py-2 pr-4">{(row.p15*100).toFixed(1)}%</td>
                  <td className="py-2 pr-4">{(row.p30*100).toFixed(1)}%</td>
                  <td className={`py-2 pr-4 font-semibold ${trendColors[data.crowdPredictions.find(p=>p.sectorId===row.sector)?.trend||'stable']}`}>{data.crowdPredictions.find(p=>p.sectorId===row.sector)?.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsView;
