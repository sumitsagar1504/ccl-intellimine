// Analytics mock data — time series for charts

const genSeries = (base: number, len: number, variance = 0.1) =>
  Array.from({ length: len }, () => Math.round(base * (1 + (Math.random() - 0.5) * 2 * variance)));

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weeks = Array.from({ length: 52 }, (_, i) => `W${i + 1}`);

export const productionForecast = {
  labels: months,
  actual: [5.2, 4.8, 5.9, 5.4, 5.7, 5.1, 5.8, null, null, null, null, null],
  forecast: [null, null, null, null, null, null, 5.8, 6.1, 6.3, 5.9, 6.4, 6.2],
  target: [6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0],
};

export const fuelConsumption = {
  labels: months.slice(0, 7),
  data: [124000, 131000, 128000, 135000, 142000, 149000, 156000], // litres
  prediction: [null, null, null, null, null, null, 156000, 163000, 158000, 165000],
  insight: 'Fuel consumption increased 12% over last 6 months. Primary driver: Dumper 203 and 205 idling 3.2 hours/shift on average. Estimated monthly overrun: ₹18.4 lakhs.',
};

export const equipmentFailurePrediction = {
  labels: ['Dumper 203', 'Conveyor C-7', 'Drill DR-2', 'Crusher CR-3', 'Dragline DGL-1', 'Dumper 205'],
  failureProbability: [83, 96, 35, 31, 22, 28],
  estimatedDaysToFailure: [2, 0, 45, 60, 90, 55],
  colors: ['#ef4444', '#7f1d1d', '#f59e0b', '#d97706', '#10b981', '#059669'],
};

export const powerConsumption = {
  labels: months.slice(0, 7),
  data: [8.4, 9.1, 8.7, 9.3, 9.8, 10.2, 10.6], // MW-hours (thousands)
  target: Array(7).fill(9.5),
  insight: 'Power consumption exceeded target by 11.6% in June. Underground ventilation fans account for 38% of total consumption. LED lighting upgrade project can reduce by 8%.',
};

export const productionByMine = {
  labels: ['Rajrappa', 'Argada', 'Piparwar', 'Kuju', 'Dhori', 'Kedla'],
  actual: [412500, 225000, 520000, 140000, 118000, 285000],
  target: [480000, 280000, 510000, 190000, 120000, 360000],
};

export const safetyTrend = {
  labels: months.slice(0, 7),
  incidents: [8, 5, 7, 4, 6, 3, 5],
  nearMisses: [14, 11, 12, 9, 10, 7, 8],
  violationsPPE: [31, 28, 25, 22, 18, 14, 12],
};

export const inventoryLevels = {
  items: [
    { name: 'Diesel', current: 48000, minimum: 30000, unit: 'litres', daysLeft: 12, status: 'warning' },
    { name: 'Explosive (ANFO)', current: 8200, minimum: 5000, unit: 'kg', daysLeft: 18, status: 'ok' },
    { name: 'Hydraulic Oil', current: 2100, minimum: 1500, unit: 'litres', daysLeft: 8, status: 'critical' },
    { name: 'Conveyor Belting', current: 450, minimum: 200, unit: 'metres', daysLeft: 22, status: 'ok' },
    { name: 'Safety Helmets', current: 320, minimum: 500, unit: 'units', daysLeft: 0, status: 'critical' },
    { name: 'Filter Masks (N95)', current: 1200, minimum: 800, unit: 'units', daysLeft: 6, status: 'warning' },
  ],
};

export const weeklyProductionTrend = {
  labels: weeks.slice(0, 28),
  data: genSeries(72000, 28, 0.08),
};

export const kpiSummary = {
  totalProductionMTD: 1700500, // MT
  targetMTD: 1940000,
  efficiency: 87.7,
  avgEquipmentHealth: 67.4,
  safetyScore: 87.3,
  fuelEfficiency: 92.1,
  activeEquipment: 8,
  totalEquipment: 10,
};
