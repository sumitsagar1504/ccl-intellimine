// Mock Production Data — CCL Mines
export interface DailyProduction {
  date: string;
  actual: number;
  target: number;
}

export interface MineProduction {
  id: string;
  name: string;
  area: string;
  type: 'UG' | 'OC'; // Underground / Open Cast
  totalCapacity: number; // MT/year
  todayActual: number; // MT today
  todayTarget: number;
  monthActual: number;
  monthTarget: number;
  ytdActual: number;
  ytdTarget: number;
  efficiency: number; // %
  activeShifts: number;
  workers: number;
  status: 'operational' | 'partial' | 'shutdown';
  daily: DailyProduction[];
}

const generateDaily = (base: number, variance: number, days = 30): DailyProduction[] => {
  const data: DailyProduction[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const target = base;
    const actual = Math.round(base * (0.8 + Math.random() * 0.35) * (1 - variance * Math.random()));
    data.push({ date: date.toISOString().split('T')[0], actual, target });
  }
  return data;
};

export const mines: MineProduction[] = [
  {
    id: 'RJP',
    name: 'Rajrappa',
    area: 'Ramgarh',
    type: 'OC',
    totalCapacity: 12.5,
    todayActual: 18420,
    todayTarget: 20000,
    monthActual: 412500,
    monthTarget: 480000,
    ytdActual: 4850000,
    ytdTarget: 5200000,
    efficiency: 92.1,
    activeShifts: 3,
    workers: 1240,
    status: 'operational',
    daily: generateDaily(18000, 0.1),
  },
  {
    id: 'ARG',
    name: 'Argada',
    area: 'Bokaro',
    type: 'UG',
    totalCapacity: 6.8,
    todayActual: 9200,
    todayTarget: 10500,
    monthActual: 225000,
    monthTarget: 280000,
    ytdActual: 2450000,
    ytdTarget: 2800000,
    efficiency: 80.4,
    activeShifts: 2,
    workers: 820,
    status: 'partial',
    daily: generateDaily(9500, 0.15),
  },
  {
    id: 'PPW',
    name: 'Piparwar',
    area: 'Chatra',
    type: 'OC',
    totalCapacity: 15.0,
    todayActual: 22100,
    todayTarget: 22000,
    monthActual: 520000,
    monthTarget: 510000,
    ytdActual: 6100000,
    ytdTarget: 5900000,
    efficiency: 100.5,
    activeShifts: 3,
    workers: 1580,
    status: 'operational',
    daily: generateDaily(21000, 0.05),
  },
  {
    id: 'KJU',
    name: 'Kuju',
    area: 'Ramgarh',
    type: 'UG',
    totalCapacity: 4.2,
    todayActual: 5800,
    todayTarget: 7000,
    monthActual: 140000,
    monthTarget: 190000,
    ytdActual: 1520000,
    ytdTarget: 1900000,
    efficiency: 73.7,
    activeShifts: 2,
    workers: 560,
    status: 'partial',
    daily: generateDaily(6000, 0.2),
  },
  {
    id: 'DHR',
    name: 'Dhori',
    area: 'Bokaro',
    type: 'UG',
    totalCapacity: 3.8,
    todayActual: 5100,
    todayTarget: 5000,
    monthActual: 118000,
    monthTarget: 120000,
    ytdActual: 1380000,
    ytdTarget: 1400000,
    efficiency: 98.6,
    activeShifts: 3,
    workers: 490,
    status: 'operational',
    daily: generateDaily(5000, 0.08),
  },
  {
    id: 'KDL',
    name: 'Kedla',
    area: 'Ramgarh',
    type: 'OC',
    totalCapacity: 8.2,
    todayActual: 11500,
    todayTarget: 13000,
    monthActual: 285000,
    monthTarget: 360000,
    ytdActual: 3200000,
    ytdTarget: 3600000,
    efficiency: 88.8,
    activeShifts: 3,
    workers: 920,
    status: 'operational',
    daily: generateDaily(12000, 0.12),
  },
  {
    id: 'MKL',
    name: 'Makoli',
    area: 'Hazaribagh',
    type: 'OC',
    totalCapacity: 5.5,
    todayActual: 0,
    todayTarget: 7500,
    monthActual: 0,
    monthTarget: 220000,
    ytdActual: 980000,
    ytdTarget: 2200000,
    efficiency: 0,
    activeShifts: 0,
    workers: 0,
    status: 'shutdown',
    daily: generateDaily(7000, 0.3),
  },
];

export const totalProductionToday = mines.reduce((s, m) => s + m.todayActual, 0);
export const totalTargetToday = mines.reduce((s, m) => s + m.todayTarget, 0);
export const overallEfficiency = Math.round((totalProductionToday / totalTargetToday) * 1000) / 10;

export const monthlyTrend = generateDaily(75000, 0.08, 30);
