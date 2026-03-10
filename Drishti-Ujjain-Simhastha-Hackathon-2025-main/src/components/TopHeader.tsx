import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Users, AlertTriangle, Activity, Clock, Sparkles, Palette } from 'lucide-react';
import { useTheme, accentToClasses } from '../contexts/ThemeContext';

interface TopHeaderProps {
  data: any;
}

const accents: Array<ReturnType<typeof String>> = ['blue','cyan','emerald','amber','violet','rose'];

const TopHeader: React.FC<TopHeaderProps> = ({ data }) => {
  const { accent, setAccent, glass, toggleGlass } = useTheme();
  const accentClasses = accentToClasses(accent as any);
  const [showPalette, setShowPalette] = useState(false);
  const currentTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <motion.header 
      className={`h-16 ${glass ? 'bg-slate-900/60 backdrop-blur-xl' : 'bg-slate-900/95'} border-b border-slate-700 flex items-center justify-between px-4 md:px-6 relative`}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Section - Logo and Title */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${accentClasses.grad} rounded-lg flex items-center justify-center shadow-lg shadow-black/40 ring-1 ring-white/10`}>
            <Eye className="w-6 h-6 text-white drop-shadow" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Project DRISHTI</h1>
            <p className="text-xs text-slate-400">Command Center • Simhastha 2028</p>
          </div>
        </div>
      </div>

      {/* Center Section - Key Metrics */}
  <div className="hidden lg:flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-400" />
          <div className="text-center">
            <div className="text-lg font-bold text-white">{data.totalCrowd.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Active Pilgrims</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <AlertTriangle className={`w-5 h-5 ${
            data.alertLevel === 'critical' ? 'text-red-400' : 
            data.alertLevel === 'high' ? 'text-orange-400' : 
            data.alertLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
          }`} />
          <div className="text-center">
            <div className="text-lg font-bold text-white capitalize">{data.alertLevel}</div>
            <div className="text-xs text-slate-400">Threat Level</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-green-400" />
          <div className="text-center">
            <div className="text-lg font-bold text-white">{data.systemStatus}</div>
            <div className="text-xs text-slate-400">System Status</div>
          </div>
        </div>
      </div>

      {/* Right Section - Time / LIVE / Theme */}
  <div className="flex items-center space-x-4 md:space-x-6">
        <div className="text-right">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-mono text-white">{currentTime}</span>
          </div>
          <div className="text-xs text-slate-400">IST • Ujjain</div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400 font-medium">LIVE</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowPalette(v => !v)}
            className={`p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 transition-colors flex items-center space-x-1 text-slate-300`}
            title="Theme & Effects"
          >
            <Palette className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {showPalette && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-60 bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/60 p-3 shadow-xl z-50"
              >
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Accent</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {accents.map(a => {
                    const ac = accentToClasses(a as any);
                    return (
                      <button
                        key={a}
                        onClick={() => setAccent(a as any)}
                        className={`w-8 h-8 rounded-md bg-gradient-to-br ${ac.grad} relative ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white/30 transition-transform ${accent === a ? 'scale-110 shadow-lg' : 'hover:scale-105'}`}
                        aria-label={`Set ${a} accent`}
                      >
                        {accent === a && <Sparkles className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow" />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Glass Mode</span>
                  <button
                    onClick={toggleGlass}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${glass ? 'bg-gradient-to-r '+accentClasses.grad+' text-white shadow shadow-black/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    {glass ? 'On' : 'Off'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Mobile Metrics Strip */}
      <div className="lg:hidden absolute left-0 right-0 top-16 bg-slate-900/95 border-b border-slate-800 flex space-x-4 overflow-x-auto scrollbar-thin px-4 py-2">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-400" />
          <div className="text-xs"><span className="font-bold text-white">{(data.totalCrowd/1_000_000).toFixed(2)}M</span><div className="text-[10px] text-slate-400">Pilgrims</div></div>
        </div>
        <div className="flex items-center space-x-2">
          <AlertTriangle className={`w-4 h-4 ${
            data.alertLevel === 'critical' ? 'text-red-400' : 
            data.alertLevel === 'high' ? 'text-orange-400' : 
            data.alertLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
          }`} />
          <div className="text-xs"><span className="font-bold text-white capitalize">{data.alertLevel}</span><div className="text-[10px] text-slate-400">Threat</div></div>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-green-400" />
          <div className="text-xs"><span className="font-bold text-white">{data.systemStatus}</span><div className="text-[10px] text-slate-400">System</div></div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopHeader;
