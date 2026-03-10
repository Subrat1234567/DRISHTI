import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, ShieldAlert, Droplets, Radio, Timer } from 'lucide-react';
import { MockData } from '../utils/mockData';
import { useTheme, accentToClasses } from '../contexts/ThemeContext';

interface KPIRibbonProps { data: MockData; }

const KPIRibbon: React.FC<KPIRibbonProps> = ({ data }) => {
  const { accent } = useTheme();
  const accentClasses = accentToClasses(accent);

  const items = useMemo(() => {
    const crushRisk = Math.round(
      100 * (data.chokePoints.reduce((a, b) => a + b.riskScore, 0) / Math.max(1, data.chokePoints.length))
    );
    const supplyPct = Math.round(
      100 * (
        data.logistics.reduce((a, b) => a + b.current, 0) /
        Math.max(1, data.logistics.reduce((a, b) => a + b.max, 0))
      )
    );
    const engaged = data.drones.filter(d => d.status !== 'idle').length;
    const droneCoverage = Math.round(100 * engaged / Math.max(1, data.drones.length));
    const risingSectors = data.crowdPredictions.filter(c => c.trend === 'rising' && c.plus15 > 0.7).length;
    const medLatency = data.avgResponseTime; // seconds simulated
    const threatLabel = data.alertLevel.toUpperCase();
    return [
      { id: 'threat', icon: ShieldAlert, label: 'Threat Level', value: threatLabel, accent: true },
      { id: 'crush', icon: Activity, label: 'Crush Risk Index', value: crushRisk + '%', warn: crushRisk > 65 },
      { id: 'supply', icon: Droplets, label: 'Supply Sufficiency', value: supplyPct + '%', warn: supplyPct < 55 },
      { id: 'drone', icon: TrendingUp, label: 'Drone Coverage', value: droneCoverage + '%', warn: droneCoverage < 45 },
      { id: 'rising', icon: Radio, label: 'Rising Sectors (15m)', value: risingSectors, warn: risingSectors > 2 },
      { id: 'sla', icon: Timer, label: 'Median Response SLA', value: medLatency + 's', warn: medLatency > 150 },
    ];
  }, [data]);

  const marqueeItems = [...items, ...items]; // duplicate for seamless scroll

  return (
    <div className={`relative overflow-hidden border-b border-slate-800/70 select-none ${accent === 'amber' ? 'text-slate-900' : ''}`}>      
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_70%)]" />
      <motion.div
        className="flex whitespace-nowrap py-2"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {marqueeItems.map((it, i) => (
          <div
            key={it.id + i}
            className={`flex items-center mx-6 group`}
          >
            <div className={`w-6 h-6 mr-2 rounded-md flex items-center justify-center bg-gradient-to-br ${accentClasses.grad} text-white shadow shadow-black/40`}>          
              <it.icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="text-[10px] tracking-wide uppercase text-slate-400">{it.label}</span>
              <span className={`text-sm font-semibold ${it.warn ? 'text-amber-400' : it.accent ? accentClasses.text : 'text-slate-100'}`}>{it.value}</span>
            </div>
          </div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950/90 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950/90 to-transparent" />
    </div>
  );
};

export default KPIRibbon;
