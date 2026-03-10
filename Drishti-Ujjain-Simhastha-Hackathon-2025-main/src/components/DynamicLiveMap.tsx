import React, { Suspense } from 'react';
import LeafletLiveMap from './LeafletLiveMap';
import { MockData } from '../utils/mockData';

// Lazy load Mapbox map only if env token is set
const MapboxMap = React.lazy(()=> import('./MainMap'));

interface Props { data: MockData; }

const DynamicLiveMap: React.FC<Props> = ({ data }) => {
  const hasMapbox = !!(import.meta as any).env?.VITE_MAPBOX_TOKEN;
  if (!hasMapbox) return <LeafletLiveMap data={data} />;
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Loading Map...</div>}>
      <MapboxMap data={data} />
    </Suspense>
  );
};

export default DynamicLiveMap;
