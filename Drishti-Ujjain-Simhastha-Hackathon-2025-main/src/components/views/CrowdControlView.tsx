import React from 'react';
import { motion } from 'framer-motion';
import { MockData } from '../../utils/mockData';
import { Users, AlertTriangle, MoveRight, Timer } from 'lucide-react';

interface Props { data: MockData; }

const CrowdControlView: React.FC<Props> = ({ data }) => {
  const riskSorted = [...data.chokePoints].sort((a,b)=>b.riskScore - a.riskScore);
  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Users className="w-8 h-8 text-orange-400"/>
        <div>
          <h2 className="text-white font-bold text-xl">Samanjasya Adaptive Flow</h2>
          <p className="text-slate-400 text-sm">Predictive crowd shaping & choke point mitigation.</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4">High Risk Choke Points</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 text-xs">
            {riskSorted.map(c => (
              <div key={c.id} className="p-3 bg-slate-800/60 border border-slate-700 rounded-lg space-y-1">
                <div className="flex justify-between text-slate-300"><span>{c.id} / {c.sectorId}</span><span className="text-slate-500">ETA {c.etaMinutes}m</span></div>
                <div className="flex items-center space-x-2 text-[10px]"><AlertTriangle className="w-3 h-3 text-red-400"/><span className="text-red-400 font-semibold">Risk {(c.riskScore*100).toFixed(1)}%</span></div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600" style={{width:`${Math.min(100, c.riskScore*100)}%`}}/></div>
                <div className="flex items-center justify-between pt-1"><button className="text-[10px] px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">Deploy Soft Nudges</button><button className="text-[10px] px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold">Simulate</button></div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4">Active Flow Interventions</h3>
          <div className="space-y-3 text-xs">
            {[1,2,3].map(i => (
              <div key={i} className="p-3 bg-slate-800/60 border border-slate-700 rounded-lg flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-white font-semibold flex items-center space-x-2"><MoveRight className="w-4 h-4 text-cyan-400"/><span>Pathway Diversion #{i}</span></div>
                  <div className="text-slate-400">Sector S{(i*2)} → S{(i*2)+1}</div>
                  <div className="flex items-center space-x-2 text-[10px] text-green-400"><Timer className="w-3 h-3"/><span>19m remaining</span></div>
                </div>
                <button className="text-[10px] px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold">Terminate</button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CrowdControlView;
