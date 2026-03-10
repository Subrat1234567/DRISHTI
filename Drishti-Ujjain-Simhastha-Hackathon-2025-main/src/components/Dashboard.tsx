import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faker } from '@faker-js/faker';
import Sidebar from './Sidebar';
// Retain original Mapbox component (MainMap) if token provided; default to Leaflet
import DynamicLiveMap from './DynamicLiveMap';
import RightPanel from './RightPanel';
import AIAlertModal from './AIAlertModal';
import TopHeader from './TopHeader';
import KPIRibbon from './KPIRibbon';
import { generateMockData, MockData } from '../utils/mockData';
import { useAppContext } from '../contexts/AppContext';
// Lazy-loaded heavy views for performance
const AnalyticsView = React.lazy(() => import('./views/AnalyticsView'));
const LogisticsView = React.lazy(() => import('./views/LogisticsView'));
const DronesView = React.lazy(() => import('./views/DronesView'));
const SystemHealthView = React.lazy(() => import('./views/SystemHealthView'));
const AlertsView = React.lazy(() => import('./views/AlertsView'));
const CommunicationsView = React.lazy(() => import('./views/CommunicationsView'));
const CrowdControlView = React.lazy(() => import('./views/CrowdControlView'));
import { useIsMobile } from '../hooks/useResponsive';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('live-map');
  const [mockData, setMockData] = useState<MockData>(generateMockData());
  const [showAIAlert, setShowAIAlert] = useState(false);
  const [aiAlert, setAiAlert] = useState<any>(null);
  const { addToast } = useAppContext();
  const isMobile = useIsMobile();
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMockData = generateMockData();
      setMockData(newMockData);
      
      if (Math.random() < 0.1) {
        const alertTypes = [
          {
            type: 'samanjasya',
            title: 'Samanjasya: Predictive Alert',
            message: `Crowd density in ${faker.helpers.arrayElement(newMockData.sectors).name} is predicted to reach critical levels in 15 minutes. Suggestion: Divert pilgrims towards an alternate pathway.`,
            severity: 'warning'
          },
          {
            type: 'vishwas',
            title: 'Vishwas: Communication Suggestion',
            message: `Social media sentiment analysis indicates a rumor spreading in ${faker.helpers.arrayElement(newMockData.sectors).name}. Suggestion: Play rumor-control announcement RC-08.`,
            severity: 'urgent'
          },
          {
            type: 'suraksha',
            title: 'Suraksha: Drone Response',
            message: `Missing person reported in ${faker.helpers.arrayElement(newMockData.sectors).name}. Deploying drone unit DR-05 for immediate search operation.`,
            severity: 'critical'
          }
        ];
        
        const randomAlert = faker.helpers.arrayElement(alertTypes);
        setAiAlert(randomAlert);
        setShowAIAlert(true);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleApproveAI = () => {
    addToast(`AI suggestion "${aiAlert.title}" has been approved and executed.`, 'success');
    setShowAIAlert(false);
  };

  const handleRejectAI = () => {
    addToast(`AI suggestion "${aiAlert.title}" was rejected.`, 'info');
    setShowAIAlert(false);
  };

  return (
    <div className="h-screen bg-slate-950 overflow-hidden flex flex-col">
      <TopHeader data={mockData} />
      <div className="hidden md:block"><KPIRibbon data={mockData} /></div>
      
      <div className={`flex flex-1 h-[calc(100vh-4rem)] ${isMobile ? 'flex-col' : ''}`}>
        <div className={`${isMobile ? 'w-full order-2' : ''}`}>
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          data={mockData}
        />
        </div>

        <motion.main
          className={`flex-1 flex ${isMobile ? 'order-1' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-1 relative overflow-hidden">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Loading module...</div>}>
              {activeView === 'live-map' && <DynamicLiveMap data={mockData} />}
              {activeView === 'analytics' && <AnalyticsView data={mockData} />}
              {activeView === 'logistics' && <LogisticsView data={mockData} />}
              {activeView === 'drones' && <DronesView data={mockData} />}
              {activeView === 'system-health' && <SystemHealthView data={mockData} />}
              {activeView === 'alerts' && <AlertsView data={mockData} />}
              {activeView === 'communications' && <CommunicationsView data={mockData} />}
              {activeView === 'crowd-control' && <CrowdControlView data={mockData} />}
            </Suspense>
          </div>

          {!isMobile && activeView === 'live-map' && <RightPanel data={mockData} />}
        </motion.main>
      </div>

      {isMobile && activeView === 'live-map' && (
        <button
          onClick={() => setShowMobilePanel(s => !s)}
          className="fixed bottom-5 right-5 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-600/40 text-white font-semibold text-sm"
        >
          {showMobilePanel ? 'Hide Details' : 'Show Details'}
        </button>
      )}

      {isMobile && showMobilePanel && activeView === 'live-map' && (
        <div className="fixed inset-x-0 bottom-0 h-[55%] bg-slate-950/95 backdrop-blur-xl border-t border-slate-700 rounded-t-2xl z-50 shadow-2xl overflow-hidden">
          <div className="w-14 h-1.5 bg-slate-600 rounded-full mx-auto mt-3" />
          <div className="h-full overflow-y-auto p-4">
            <RightPanel data={mockData} />
          </div>
        </div>
      )}

      <AnimatePresence>
        {showAIAlert && aiAlert && (
          <AIAlertModal
            alert={aiAlert}
            onClose={() => setShowAIAlert(false)}
            onApprove={handleApproveAI}
            onReject={handleRejectAI}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
