import React from 'react';
import { motion } from 'framer-motion';
import { MockData } from '../../utils/mockData';
import { AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';

interface Props { data: MockData; }

const AlertsView: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-8 h-8 text-red-400"/>
        <div>
          <h2 className="text-white font-bold text-xl">Active & Historical Alerts</h2>
          <p className="text-slate-400 text-sm">Unified feed from SOS, Vishwas & Samanjasya engines.</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4">Live SOS Stream</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {data.sosAlerts.map((a,i)=>(
              <div key={i} className="p-3 bg-slate-800/60 border border-slate-700 rounded-lg text-xs space-y-1">
                <div className="flex justify-between text-slate-300"><span>Pilgrim {a.pilgrimId}</span><span className="text-slate-500">{a.timestamp}</span></div>
                <div className="flex items-center justify-between"><span className="text-white font-semibold">{a.type==='medical'?'Medical':'Lost Person'}</span><button className="text-[10px] px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">Center Map</button></div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4">Announcements & AI Actions</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {data.announcements.map(a => (
              <div key={a.id} className="p-3 bg-slate-800/60 border border-slate-700 rounded-lg text-xs space-y-1">
                <div className="flex justify-between"><span className="text-slate-400">{a.time}</span><span className="uppercase text-[10px] tracking-wide px-2 py-0.5 rounded-full bg-slate-700 text-slate-200">{a.channel}</span></div>
                <div className="text-white text-sm">{a.message}</div>
                <div className="flex items-center space-x-2 text-[10px]">
                  {a.approvedByAI && <span className="flex items-center space-x-1 text-green-400"><CheckCircle2 className="w-3 h-3"/><span>AI</span></span>}
                  {a.approvedByHuman && <span className="flex items-center space-x-1 text-blue-400"><Shield className="w-3 h-3"/><span>HUMAN</span></span>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlertsView;
