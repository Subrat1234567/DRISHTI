import React from 'react';
import { motion } from 'framer-motion';
import { MockData } from '../../utils/mockData';
import { Radio, Send, PlusCircle } from 'lucide-react';

interface Props { data: MockData; }

const CommunicationsView: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Radio className="w-8 h-8 text-indigo-400"/>
        <div>
          <h2 className="text-white font-bold text-xl">Vishwas Communication Console</h2>
          <p className="text-slate-400 text-sm">Craft, approve & dispatch multi-channel announcements.</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="lg:col-span-2 bg-slate-900/60 border border-slate-700 rounded-xl p-4 space-y-4">
          <h3 className="text-white font-semibold">Compose Announcement</h3>
          <div className="space-y-3">
            <textarea className="w-full h-28 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Enter announcement text (multi-lingual templates coming...)" />
            <div className="flex space-x-3">
              <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white flex-1"><option>Public Address</option><option>App Push</option><option>SMS Broadcast</option></select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 rounded-lg flex items-center space-x-2 text-sm"><Send className="w-4 h-4"/><span>Queue</span></button>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 space-y-3">
          <h3 className="text-white font-semibold flex items-center space-x-2"><PlusCircle className="w-4 h-4 text-green-400"/><span>Templates</span></h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
            {['Heat Safety Advisory','Crowd Diversion','Lost Child Protocol','Rumor Control','Hydration Reminder'].map(t => (
              <button key={t} className="w-full text-left p-2 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">{t}</button>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-4">Recent Dispatches</h3>
        <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
          {data.announcements.map(a => (
            <div key={a.id} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-xs space-y-1">
              <div className="flex justify-between text-slate-400"><span>{a.time}</span><span className="uppercase px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{a.channel}</span></div>
              <div className="text-white text-sm">{a.message}</div>
              <div className="text-[10px] text-green-400">AI Suggested & Human Approved</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunicationsView;
