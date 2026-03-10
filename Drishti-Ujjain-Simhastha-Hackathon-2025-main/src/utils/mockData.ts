import { faker } from '@faker-js/faker';
// Minimal GeoJSON type declarations (in case @types/geojson not installed)
// Avoids TS errors in this isolated mock context.
// If full typings needed: npm i -D @types/geojson
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace GeoJSON {
  interface Geometry { type: string; }
  interface Point extends Geometry { type: 'Point'; coordinates: [number, number]; }
  interface Polygon extends Geometry { type: 'Polygon'; coordinates: number[][][]; }
  interface Feature<G extends Geometry = Geometry, P = any> { type: 'Feature'; geometry: G; properties: P; }
  interface FeatureCollection<G extends Geometry = Geometry> { type: 'FeatureCollection'; features: Feature<G>[]; }
}

export interface Checkpoint {
  id: string;
  name: string;
  type: 'medical' | 'logistics' | 'water' | 'security' | 'info';
  tier: 1 | 2 | 3;
  status: 'operational' | 'busy' | 'low-stock' | 'maintenance';
  coordinates: [number, number];
  personnel: number;
  inventory: {
    'Water Bottles': { current: number; max: number };
    'First-Aid Kits': { current: number; max: number };
    'Food Packets': { current: number; max: number };
    'Blankets': { current: number; max: number };
  };
}

export interface Sector {
  id: string;
  name: string;
  type: 'ghat' | 'bridge' | 'entry' | 'hub' | 'residential';
  density: number;
  predictedDensity: number;
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export interface SOSAlert {
  pilgrimId: string;
  timestamp: string;
  sector: string;
  type: 'medical' | 'lost-person' | 'emergency';
  coordinates: [number, number];
}

export interface MockData {
  totalCrowd: number;
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
  systemStatus: string;
  activeSOS: number;
  activeDrones: number;
  avgResponseTime: number;
  lowStockItems: number;
  sectors: Sector[];
  checkpoints: Checkpoint[];
  sosAlerts: SOSAlert[];
  pilgrimPaths: GeoJSON.FeatureCollection<GeoJSON.Point>;
  drones: Drone[];
  logistics: LogisticsItem[];
  services: ServiceHealth[];
  announcements: Announcement[];
  chokePoints: ChokePoint[];
  crowdPredictions: CrowdPrediction[];
}

export interface Drone {
  id: string;
  status: 'idle' | 'en-route' | 'scanning' | 'returning';
  battery: number; // percentage
  sector: string; // sector id
  task: string;
  eta: number; // minutes remaining for current task
}

export interface LogisticsItem {
  name: string;
  current: number;
  max: number;
  unit: string;
  etaDepletionMinutes: number; // estimated time to depletion
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs: number;
  errorRate: number; // percentage
}

export interface Announcement {
  id: string;
  time: string;
  channel: 'public-address' | 'sms' | 'app-push';
  message: string;
  approvedByAI: boolean;
  approvedByHuman: boolean;
}

export interface ChokePoint {
  id: string;
  sectorId: string;
  riskScore: number; // 0-1
  coordinates: [number, number];
  etaMinutes: number; // minutes until predicted issue
}

export interface CrowdPrediction {
  sectorId: string;
  now: number; // density now (0-1)
  plus15: number;
  plus30: number;
  trend: 'rising' | 'falling' | 'stable';
}

// Simhastha Mela Area, Ujjain - Coordinates
const centerLat = 23.1825;
const centerLon = 75.7772;
const radius = 0.02; // Approx 2.2 km radius

const generateRandomPointInCircle = (lat: number, lon: number, rad: number): [number, number] => {
  const r = rad * Math.sqrt(Math.random());
  const theta = Math.random() * 2 * Math.PI;
  const newLon = lon + r * Math.cos(theta);
  const newLat = lat + r * Math.sin(theta);
  return [newLon, newLat];
};

export const generateMockData = (): MockData => {
  const currentHour = new Date().getHours();
  const isPeakHour = (currentHour >= 8 && currentHour <= 12) || (currentHour >= 16 && currentHour <= 20);
  const baseCrowd = isPeakHour ? 8000000 : 5000000;
  const totalCrowd = Math.max(3000000, baseCrowd + faker.number.int({ min: -500000, max: 1000000 }));
  const alertLevel = faker.helpers.weightedArrayElement([
    { weight: isPeakHour ? 2 : 5, value: 'low' as const },
    { weight: isPeakHour ? 4 : 3, value: 'medium' as const },
    { weight: isPeakHour ? 3 : 1.5, value: 'high' as const },
    { weight: isPeakHour ? 1 : 0.5, value: 'critical' as const },
  ]);

  const sectors: Sector[] = [
  { id: 'S1', name: 'Ram Ghat Sector', type: 'ghat' as const, geometry: { type: 'Polygon' as const, coordinates: [[[75.765,23.185],[75.77,23.186],[75.772,23.183],[75.767,23.182],[75.765,23.185]]] } },
  { id: 'S2', name: 'Mangalnath Zone', type: 'ghat' as const, geometry: { type: 'Polygon' as const, coordinates: [[[75.78,23.19],[75.785,23.192],[75.786,23.188],[75.781,23.187],[75.78,23.19]]] } },
  { id: 'S3', name: 'Central Hub', type: 'hub' as const, geometry: { type: 'Polygon' as const, coordinates: [[[75.775,23.18],[75.78,23.182],[75.782,23.178],[75.777,23.176],[75.775,23.18]]] } },
  { id: 'S4', name: 'Entry Plaza West', type: 'entry' as const, geometry: { type: 'Polygon' as const, coordinates: [[[75.76,23.178],[75.765,23.18],[75.767,23.176],[75.762,23.174],[75.76,23.178]]] } },
  ].map((s) => {
    const density = Math.min(0.95, Math.max(0.1, (isPeakHour ? 0.6 : 0.3) + faker.number.float({ min: -0.2, max: 0.3, precision: 0.01 })));
    return { ...s, density, predictedDensity: Math.min(0.98, density + faker.number.float({ min: -0.05, max: 0.15, precision: 0.01 })) };
  });

  const checkpoints: Checkpoint[] = Array.from({ length: 20 }, (_, i) => {
    const type = faker.helpers.arrayElement(['medical' as const, 'logistics' as const, 'water' as const, 'security' as const, 'info' as const]);
    const tier = faker.helpers.arrayElement([1, 2, 3]) as 1 | 2 | 3;
    const water = { current: faker.number.int({ min: 10, max: 200 }), max: 200 };
    const kits = { current: faker.number.int({ min: 5, max: 50 }), max: 50 };
    return {
      id: `CP-${String(i + 1).padStart(3, '0')}`,
      name: `${faker.helpers.arrayElement(['Post', 'Station', 'Point', 'Unit'])} ${String(i + 1).padStart(3, '0')}`,
      type,
      tier,
      status: (water.current < 40 || kits.current < 10) ? 'low-stock' : faker.helpers.arrayElement(['operational', 'busy']),
      coordinates: generateRandomPointInCircle(centerLat, centerLon, radius),
      personnel: faker.number.int({ min: 2 * tier, max: 8 * tier }),
      inventory: {
        'Water Bottles': water,
        'First-Aid Kits': kits,
        'Food Packets': { current: faker.number.int({ min: 20, max: 500 }), max: 500 },
        'Blankets': { current: faker.number.int({ min: 10, max: 100 }), max: 100 },
      },
    };
  });

  const sosCount = faker.number.int({ min: 2, max: 15 });
  const sosAlerts: SOSAlert[] = Array.from({ length: sosCount }, () => ({
    pilgrimId: `PIL-${faker.string.alphanumeric(8).toUpperCase()}`,
    timestamp: faker.date.recent({ days: 0.1 }).toLocaleTimeString('en-IN', { hour12: false }),
    sector: `${faker.number.int({ min: 1, max: 5 })}`,
    type: faker.helpers.arrayElement(['medical', 'lost-person']),
    coordinates: generateRandomPointInCircle(centerLat, centerLon, radius),
  }));
  
  const pilgrimPaths: GeoJSON.FeatureCollection<GeoJSON.Point> = {
    type: 'FeatureCollection',
    features: Array.from({ length: 500 }, () => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: generateRandomPointInCircle(centerLat, centerLon, radius),
      },
    })),
  };

  // Drones
  const droneStatuses: Drone['status'][] = ['idle', 'en-route', 'scanning', 'returning'];
  const drones: Drone[] = Array.from({ length: faker.number.int({ min: 8, max: 20 }) }, (_, i) => {
    const status = faker.helpers.arrayElement(droneStatuses);
    const battery = faker.number.int({ min: 15, max: 100 });
    return {
      id: `DR-${String(i + 1).padStart(2, '0')}`,
      status,
      battery,
      sector: faker.helpers.arrayElement(sectors).id,
      task: status === 'scanning' ? 'Crowd Imaging' : status === 'en-route' ? 'Dispatch to SOS' : status === 'returning' ? 'Return to Base' : 'Standby',
      eta: status === 'idle' ? 0 : faker.number.int({ min: 1, max: 18 }),
    };
  });

  // Logistics Items
  const logistics: LogisticsItem[] = [
    { name: 'Water (Liters)', current: faker.number.int({ min: 5000, max: 25000 }), max: 30000, unit: 'L', etaDepletionMinutes: faker.number.int({ min: 30, max: 240 }) },
    { name: 'First-Aid Kits', current: faker.number.int({ min: 200, max: 900 }), max: 1000, unit: 'kits', etaDepletionMinutes: faker.number.int({ min: 60, max: 360 }) },
    { name: 'Food Packets', current: faker.number.int({ min: 5000, max: 40000 }), max: 50000, unit: 'packs', etaDepletionMinutes: faker.number.int({ min: 45, max: 300 }) },
    { name: 'Blankets', current: faker.number.int({ min: 200, max: 2500 }), max: 3000, unit: 'units', etaDepletionMinutes: faker.number.int({ min: 120, max: 720 }) },
  ];

  // Service Health
  const services: ServiceHealth[] = [
    { name: 'API Gateway', status: 'healthy', latencyMs: faker.number.int({ min: 45, max: 110 }), errorRate: faker.number.float({ min: 0, max: 0.5, precision: 0.01 }) },
    { name: 'Auth Service', status: faker.helpers.arrayElement(['healthy', 'degraded']), latencyMs: faker.number.int({ min: 55, max: 160 }), errorRate: faker.number.float({ min: 0, max: 0.8, precision: 0.01 }) },
    { name: 'Crowd ML Engine', status: faker.helpers.arrayElement(['healthy', 'degraded']), latencyMs: faker.number.int({ min: 120, max: 400 }), errorRate: faker.number.float({ min: 0, max: 1.2, precision: 0.01 }) },
    { name: 'Notification Bus', status: 'healthy', latencyMs: faker.number.int({ min: 30, max: 95 }), errorRate: faker.number.float({ min: 0, max: 0.3, precision: 0.01 }) },
    { name: 'Geo DB', status: faker.helpers.arrayElement(['healthy', 'degraded']), latencyMs: faker.number.int({ min: 8, max: 25 }), errorRate: faker.number.float({ min: 0, max: 0.2, precision: 0.01 }) },
  ];

  // Announcements log (recent subset)
  const announcements: Announcement[] = Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
    id: faker.string.uuid(),
    time: faker.date.recent({ days: 0.2 }).toLocaleTimeString('en-IN', { hour12: false }),
    channel: faker.helpers.arrayElement(['public-address', 'app-push', 'sms']),
    message: faker.helpers.arrayElement([
      'Advisory: Please keep left while moving towards Ram Ghat.',
      'Heat Alert: Stay hydrated, water points every 150m.',
      'Announcement: Lost child assistance desk active at Central Hub.',
      'Traffic: Sector S4 entry regulated for 10 mins to ease congestion.'
    ]),
    approvedByAI: true,
    approvedByHuman: faker.datatype.boolean(),
  }));

  // Choke Points predictions
  const chokePoints: ChokePoint[] = Array.from({ length: faker.number.int({ min: 2, max: 6 }) }, (_, i) => ({
    id: `CPK-${i + 1}`,
    sectorId: faker.helpers.arrayElement(sectors).id,
    riskScore: faker.number.float({ min: 0.4, max: 0.95, precision: 0.01 }),
    coordinates: generateRandomPointInCircle(centerLat, centerLon, radius),
    etaMinutes: faker.number.int({ min: 5, max: 30 })
  }));

  // Crowd predictions per sector
  const crowdPredictions: CrowdPrediction[] = sectors.map(s => {
    const now = s.density;
    const plus15 = Math.min(0.99, Math.max(0.05, now + faker.number.float({ min: -0.1, max: 0.25, precision: 0.01 })));
    const plus30 = Math.min(0.99, Math.max(0.05, plus15 + faker.number.float({ min: -0.1, max: 0.25, precision: 0.01 })));
    const delta = plus15 - now;
    const trend: CrowdPrediction['trend'] = delta > 0.05 ? 'rising' : delta < -0.05 ? 'falling' : 'stable';
    return { sectorId: s.id, now, plus15, plus30, trend };
  });

  return {
    totalCrowd,
    alertLevel,
    systemStatus: 'Operational',
    activeSOS: sosCount,
    activeDrones: faker.number.int({ min: 8, max: 25 }),
    avgResponseTime: faker.number.int({ min: 45, max: 180 }),
    lowStockItems: checkpoints.filter(cp => cp.status === 'low-stock').length,
    sectors,
    checkpoints,
    sosAlerts,
    pilgrimPaths,
    drones,
    logistics,
    services,
    announcements,
    chokePoints,
    crowdPredictions,
  };
};
