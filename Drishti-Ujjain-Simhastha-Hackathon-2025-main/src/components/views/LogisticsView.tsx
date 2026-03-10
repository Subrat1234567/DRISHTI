import React from 'react';
import { motion } from 'framer-motion';
import { MockData } from '../../utils/mockData';
import { Truck, Package, Timer, AlertTriangle } from 'lucide-react';

interface Props { data: MockData; }

const LogisticsView: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-6">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex items-center space-x-3">
        <Truck className="w-8 h-8 text-blue-400"/>
        <div>
          <h2 className="text-white font-bold text-xl">Automated Predictive Replenishment</h2>
          <p className="text-slate-400 text-sm">Live inventory posture and depletion risk across checkpoint network.</p>
        </div>
      </motion.div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {data.logistics.map(item => {
          const pct = (item.current / item.max) * 100;
          return (
            <motion.div key={item.name} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center space-x-2"><Package className="w-4 h-4 text-cyan-400"/><span>{item.name}</span></h3>
                {pct < 30 && <AlertTriangle className="w-5 h-5 text-red-400"/>}
              </div>
              <div className="text-slate-400 text-xs">{item.current.toLocaleString()} / {item.max.toLocaleString()} {item.unit}</div>
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-3 rounded-full ${pct<30?'bg-red-500':pct<60?'bg-yellow-400':'bg-green-500'}`} style={{width:`${pct}%`}} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400"><span>Depletion ETA</span><span className="flex items-center space-x-1"><Timer className="w-4 h-4"/><span>{item.etaDepletionMinutes}m</span></span></div>
              <button className="w-full mt-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">Generate Replenishment Order</button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LogisticsView;
