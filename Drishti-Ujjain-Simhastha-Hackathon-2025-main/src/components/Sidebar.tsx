import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { 
  Map, AlertCircle, Package, Settings, BarChart3, Radio, Users, Shield, Plane, Activity, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { useTheme, accentToClasses } from '../contexts/ThemeContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  data: any;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, data }) => {
  const { isSidebarCollapsed, toggleSidebar } = useAppContext();
  const { accent, glass } = useTheme();
  const accentClasses = accentToClasses(accent);

  const menuItems = [
    { id: 'live-map', label: 'Live Map', icon: Map, badge: null },
    { id: 'alerts', label: 'Active Alerts', icon: AlertCircle, badge: data.activeSOS },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'logistics', label: 'Logistics', icon: Package, badge: data.lowStockItems },
    { id: 'communications', label: 'Communications', icon: Radio, badge: null },
    { id: 'crowd-control', label: 'Crowd Control', icon: Users, badge: null },
    { id: 'security', label: 'Security', icon: Shield, badge: null },
    { id: 'drones', label: 'Drone Fleet', icon: Plane, badge: data.activeDrones },
    { id: 'system-health', label: 'System Health', icon: Activity, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  const variants = {
    open: { width: 256, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: 72, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <motion.div 
      animate={isSidebarCollapsed ? 'closed' : 'open'}
      variants={variants}
      className={`${glass ? 'bg-slate-900/60 backdrop-blur-xl' : 'bg-slate-900/95'} border-r border-slate-700 flex flex-col`}
    >
      <div className="p-4 flex-grow overflow-y-auto">
        {!isSidebarCollapsed && <h2 className="text-lg font-semibold text-white mb-4 px-2">Modules</h2>}
        
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              title={item.label}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeView === item.id
                  ? `bg-gradient-to-r ${accentClasses.grad} text-white shadow-lg shadow-black/40`
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </div>
              
              {!isSidebarCollapsed && item.badge !== null && item.badge > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                  activeView === item.id 
                    ? 'bg-white text-slate-900' 
                    : 'bg-red-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          {isSidebarCollapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
