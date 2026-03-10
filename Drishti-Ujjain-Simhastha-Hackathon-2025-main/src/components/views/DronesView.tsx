import React from 'react';
import { motion } from 'framer-motion';
import { MockData } from '../../utils/mockData';
import { Plane, Battery, Timer } from 'lucide-react';

interface Props { data: MockData; }

const statusColors: Record<string,string> = {
  idle: 'bg-slate-700 text-slate-200',
  'en-route': 'bg-blue-600 text-white',
  scanning: 'bg-green-600 text-white',
  returning: 'bg-orange-500 text-white'
};

const DronesView: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Plane className="w-8 h-8 text-purple-400"/>
        <div>
          <h2 className="text-white font-bold text-xl">Suraksha Drone Fleet</h2>
          <p className="text-slate-400 text-sm">Autonomous search & rapid response units.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {data.drones.map(d => (
          <motion.div key={d.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center space-x-2"><Plane className="w-4 h-4 text-purple-300"/><span>{d.id}</span></h3>
              <span className={`px-2 py-1 text-[10px] rounded-full font-semibold uppercase tracking-wide ${statusColors[d.status]}`}>{d.status}</span>
            </div>
            <div className="text-slate-400 text-xs">Sector: <span className="text-white font-medium">{d.sector}</span></div>
            <div className="flex items-center space-x-2 text-xs text-slate-400"><Battery className="w-4 h-4"/><span>Battery</span><div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"><div className={`h-2 ${d.battery<25?'bg-red-500':d.battery<50?'bg-yellow-400':'bg-green-500'}`} style={{width:`${d.battery}%`}} /></div><span className="font-semibold text-white">{d.battery}%</span></div>
            <div className="flex items-center justify-between text-xs text-slate-400"><span>Task</span><span className="text-white font-medium">{d.task}</span></div>
            {d.eta>0 && <div className="flex items-center justify-between text-xs text-slate-400"><span>ETA</span><span className="flex items-center space-x-1"><Timer className="w-4 h-4"/><span>{d.eta}m</span></span></div>}
            <div className="flex space-x-2 pt-1">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded-md font-semibold">Live Feed</button>
              <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs py-1.5 rounded-md font-semibold">Task</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DronesView;
