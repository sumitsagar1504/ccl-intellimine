export type EquipmentType = 'Excavator' | 'Dumper' | 'Dragline' | 'Conveyor' | 'Dozer' | 'Drill' | 'Crusher' | 'Pump';
export type EquipmentStatus = 'operational' | 'maintenance' | 'breakdown' | 'idle';

export interface MaintenanceRecord {
  date: string;
  type: 'Scheduled' | 'Breakdown' | 'Inspection';
  description: string;
  cost: number;
  technician: string;
  hours: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  model: string;
  manufacturer: string;
  mineId: string;
  mineName: string;
  status: EquipmentStatus;
  healthScore: number; // 0-100
  age: number; // years
  totalHours: number;
  hoursThisMonth: number;
  fuelConsumptionToday: number; // litres
  lastMaintenance: string;
  nextMaintenance: string;
  temperature: number; // °C
  vibration: number; // mm/s
  failureProbability: number; // 0-100
  remainingLife: number; // months
  downtimeHours: number; // this month
  breakdownCount: number; // this year
  maintenanceHistory: MaintenanceRecord[];
  healthTrend: { date: string; health: number; temp: number; vibration: number }[];
}

const generateHealthTrend = (baseHealth: number, days = 30) =>
  Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const decay = baseHealth > 60 ? 0 : -0.5;
    return {
      date: date.toISOString().split('T')[0],
      health: Math.max(10, Math.round(baseHealth + decay * i + (Math.random() - 0.5) * 5)),
      temp: Math.round(65 + Math.random() * 30 - (baseHealth / 10)),
      vibration: Math.round((100 - baseHealth) / 10 + Math.random() * 2),
    };
  });

export const equipment: Equipment[] = [
  {
    id: 'EX-001',
    name: 'Excavator Alpha-1',
    type: 'Excavator',
    model: 'Liebherr R 9400',
    manufacturer: 'Liebherr',
    mineId: 'RJP',
    mineName: 'Rajrappa',
    status: 'operational',
    healthScore: 87,
    age: 4,
    totalHours: 14200,
    hoursThisMonth: 420,
    fuelConsumptionToday: 1240,
    lastMaintenance: '2025-06-15',
    nextMaintenance: '2025-07-15',
    temperature: 72,
    vibration: 3.2,
    failureProbability: 12,
    remainingLife: 36,
    downtimeHours: 8,
    breakdownCount: 1,
    maintenanceHistory: [
      { date: '2025-06-15', type: 'Scheduled', description: 'Oil change, filter replacement', cost: 48000, technician: 'Rajesh Kumar', hours: 6 },
      { date: '2025-04-20', type: 'Inspection', description: 'Quarterly safety inspection', cost: 12000, technician: 'Anil Sharma', hours: 3 },
    ],
    healthTrend: generateHealthTrend(87),
  },
  {
    id: 'EX-002',
    name: 'Excavator Beta-2',
    type: 'Excavator',
    model: 'Komatsu PC4000',
    manufacturer: 'Komatsu',
    mineId: 'PPW',
    mineName: 'Piparwar',
    status: 'operational',
    healthScore: 94,
    age: 2,
    totalHours: 7800,
    hoursThisMonth: 460,
    fuelConsumptionToday: 1380,
    lastMaintenance: '2025-07-01',
    nextMaintenance: '2025-08-01',
    temperature: 68,
    vibration: 2.1,
    failureProbability: 5,
    remainingLife: 56,
    downtimeHours: 2,
    breakdownCount: 0,
    maintenanceHistory: [
      { date: '2025-07-01', type: 'Scheduled', description: 'Full service', cost: 65000, technician: 'Vijay Singh', hours: 8 },
    ],
    healthTrend: generateHealthTrend(94),
  },
  {
    id: 'DMP-203',
    name: 'Dumper 203',
    type: 'Dumper',
    model: 'CAT 793F',
    manufacturer: 'Caterpillar',
    mineId: 'RJP',
    mineName: 'Rajrappa',
    status: 'maintenance',
    healthScore: 34,
    age: 9,
    totalHours: 38400,
    hoursThisMonth: 180,
    fuelConsumptionToday: 0,
    lastMaintenance: '2025-07-08',
    nextMaintenance: '2025-07-10',
    temperature: 98,
    vibration: 8.7,
    failureProbability: 83,
    remainingLife: 4,
    downtimeHours: 48,
    breakdownCount: 4,
    maintenanceHistory: [
      { date: '2025-07-08', type: 'Breakdown', description: 'Bearing failure — engine overheating', cost: 280000, technician: 'Suresh Pandey', hours: 24 },
      { date: '2025-05-12', type: 'Breakdown', description: 'Hydraulic pump failure', cost: 195000, technician: 'Suresh Pandey', hours: 18 },
      { date: '2025-03-05', type: 'Scheduled', description: 'Major overhaul', cost: 420000, technician: 'Rajesh Kumar', hours: 36 },
    ],
    healthTrend: generateHealthTrend(34),
  },
  {
    id: 'DMP-205',
    name: 'Dumper 205',
    type: 'Dumper',
    model: 'CAT 793F',
    manufacturer: 'Caterpillar',
    mineId: 'RJP',
    mineName: 'Rajrappa',
    status: 'operational',
    healthScore: 71,
    age: 7,
    totalHours: 28600,
    hoursThisMonth: 380,
    fuelConsumptionToday: 1650,
    lastMaintenance: '2025-06-28',
    nextMaintenance: '2025-07-28',
    temperature: 81,
    vibration: 5.4,
    failureProbability: 28,
    remainingLife: 18,
    downtimeHours: 12,
    breakdownCount: 2,
    maintenanceHistory: [
      { date: '2025-06-28', type: 'Scheduled', description: 'Tire rotation, brake inspection', cost: 72000, technician: 'Anil Sharma', hours: 8 },
    ],
    healthTrend: generateHealthTrend(71),
  },
  {
    id: 'DMP-208',
    name: 'Dumper 208',
    type: 'Dumper',
    model: 'Belaz 75306',
    manufacturer: 'Belaz',
    mineId: 'PPW',
    mineName: 'Piparwar',
    status: 'operational',
    healthScore: 88,
    age: 3,
    totalHours: 12400,
    hoursThisMonth: 440,
    fuelConsumptionToday: 1580,
    lastMaintenance: '2025-06-20',
    nextMaintenance: '2025-07-20',
    temperature: 74,
    vibration: 3.1,
    failureProbability: 9,
    remainingLife: 45,
    downtimeHours: 4,
    breakdownCount: 0,
    maintenanceHistory: [],
    healthTrend: generateHealthTrend(88),
  },
  {
    id: 'DGL-001',
    name: 'Dragline DGL-1',
    type: 'Dragline',
    model: 'Marion 8750',
    manufacturer: 'Marion',
    mineId: 'PPW',
    mineName: 'Piparwar',
    status: 'operational',
    healthScore: 79,
    age: 12,
    totalHours: 52000,
    hoursThisMonth: 510,
    fuelConsumptionToday: 2100,
    lastMaintenance: '2025-06-01',
    nextMaintenance: '2025-08-01',
    temperature: 76,
    vibration: 4.8,
    failureProbability: 22,
    remainingLife: 24,
    downtimeHours: 18,
    breakdownCount: 3,
    maintenanceHistory: [
      { date: '2025-06-01', type: 'Scheduled', description: 'Annual structural inspection', cost: 580000, technician: 'Vijay Singh', hours: 48 },
    ],
    healthTrend: generateHealthTrend(79),
  },
  {
    id: 'CNV-101',
    name: 'Conveyor C-7',
    type: 'Conveyor',
    model: 'Continental Beltmaster',
    manufacturer: 'Continental',
    mineId: 'ARG',
    mineName: 'Argada',
    status: 'breakdown',
    healthScore: 22,
    age: 11,
    totalHours: 89200,
    hoursThisMonth: 0,
    fuelConsumptionToday: 0,
    lastMaintenance: '2025-06-30',
    nextMaintenance: '2025-07-09',
    temperature: 102,
    vibration: 11.2,
    failureProbability: 96,
    remainingLife: 2,
    downtimeHours: 72,
    breakdownCount: 6,
    maintenanceHistory: [
      { date: '2025-06-30', type: 'Breakdown', description: 'Belt splice failure, motor burnout', cost: 340000, technician: 'Mohan Das', hours: 36 },
      { date: '2025-05-08', type: 'Breakdown', description: 'Idler failure', cost: 85000, technician: 'Mohan Das', hours: 12 },
    ],
    healthTrend: generateHealthTrend(22),
  },
  {
    id: 'DZR-004',
    name: 'Dozer D-4',
    type: 'Dozer',
    model: 'Komatsu D375A',
    manufacturer: 'Komatsu',
    mineId: 'KDL',
    mineName: 'Kedla',
    status: 'operational',
    healthScore: 91,
    age: 3,
    totalHours: 9800,
    hoursThisMonth: 390,
    fuelConsumptionToday: 980,
    lastMaintenance: '2025-07-02',
    nextMaintenance: '2025-08-02',
    temperature: 69,
    vibration: 2.8,
    failureProbability: 7,
    remainingLife: 52,
    downtimeHours: 0,
    breakdownCount: 0,
    maintenanceHistory: [],
    healthTrend: generateHealthTrend(91),
  },
  {
    id: 'DRL-002',
    name: 'Drill Rig DR-2',
    type: 'Drill',
    model: 'Atlas Copco PV271',
    manufacturer: 'Atlas Copco',
    mineId: 'KJU',
    mineName: 'Kuju',
    status: 'idle',
    healthScore: 65,
    age: 6,
    totalHours: 18900,
    hoursThisMonth: 120,
    fuelConsumptionToday: 0,
    lastMaintenance: '2025-06-10',
    nextMaintenance: '2025-07-10',
    temperature: 55,
    vibration: 1.2,
    failureProbability: 35,
    remainingLife: 15,
    downtimeHours: 200,
    breakdownCount: 2,
    maintenanceHistory: [
      { date: '2025-06-10', type: 'Inspection', description: 'Bit replacement, rod inspection', cost: 38000, technician: 'Ramesh Yadav', hours: 4 },
    ],
    healthTrend: generateHealthTrend(65),
  },
  {
    id: 'CRS-003',
    name: 'Crusher CR-3',
    type: 'Crusher',
    model: 'Metso HP500',
    manufacturer: 'Metso',
    mineId: 'ARG',
    mineName: 'Argada',
    status: 'operational',
    healthScore: 76,
    age: 8,
    totalHours: 32100,
    hoursThisMonth: 430,
    fuelConsumptionToday: 450,
    lastMaintenance: '2025-06-25',
    nextMaintenance: '2025-07-25',
    temperature: 80,
    vibration: 5.9,
    failureProbability: 31,
    remainingLife: 20,
    downtimeHours: 16,
    breakdownCount: 2,
    maintenanceHistory: [
      { date: '2025-06-25', type: 'Scheduled', description: 'Liner replacement', cost: 125000, technician: 'Anil Sharma', hours: 12 },
    ],
    healthTrend: generateHealthTrend(76),
  },
];

export const equipmentSummary = {
  total: equipment.length,
  operational: equipment.filter(e => e.status === 'operational').length,
  maintenance: equipment.filter(e => e.status === 'maintenance').length,
  breakdown: equipment.filter(e => e.status === 'breakdown').length,
  idle: equipment.filter(e => e.status === 'idle').length,
  avgHealth: Math.round(equipment.reduce((s, e) => s + e.healthScore, 0) / equipment.length),
  criticalCount: equipment.filter(e => e.failureProbability >= 70).length,
};
