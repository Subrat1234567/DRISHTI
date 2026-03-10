import React from 'react';
import { motion } from 'framer-motion';
import { MockData } from '../../utils/mockData';
import { Server, Activity, AlertTriangle } from 'lucide-react';

interface Props { data: MockData; }

const stateColors: Record<string,string> = { healthy: 'text-green-400', degraded: 'text-yellow-400', down: 'text-red-400' };

const SystemHealthView: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Server className="w-8 h-8 text-green-400"/>
        <div>
          <h2 className="text-white font-bold text-xl">System Health & Telemetry</h2>
          <p className="text-slate-400 text-sm">Core microservices operational overview.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {data.services.map(s => (
          <motion.div key={s.name} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between"><h3 className="text-white font-semibold flex items-center space-x-2"><Activity className="w-4 h-4 text-cyan-400"/><span>{s.name}</span></h3><span className={`text-xs font-bold ${stateColors[s.status]}`}>{s.status.toUpperCase()}</span></div>
            <div className="flex items-center justify-between text-xs text-slate-400"><span>Latency</span><span className="text-white font-medium">{s.latencyMs} ms</span></div>
            <div className="flex items-center justify-between text-xs text-slate-400"><span>Error Rate</span><span className={`font-medium ${s.errorRate>1?'text-red-400':s.errorRate>0.5?'text-yellow-400':'text-green-400'}`}>{s.errorRate.toFixed(2)}%</span></div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden"><div className={`h-2 ${s.latencyMs>300?'bg-red-500':s.latencyMs>150?'bg-yellow-400':'bg-green-500'}`} style={{width:`${Math.min(100, (s.latencyMs/400)*100)}%`}} /></div>
            {s.status!=='healthy' && <div className="flex items-center text-xs text-yellow-400 space-x-1"><AlertTriangle className="w-4 h-4"/><span>Auto-scaling engaged</span></div>}
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs py-1.5 rounded-md font-semibold">View Logs</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SystemHealthView;
