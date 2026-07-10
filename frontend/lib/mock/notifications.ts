export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low';
export type NotificationCategory = 'equipment' | 'safety' | 'production' | 'hr' | 'system';

export interface Notification {
  id: string;
  priority: NotificationPriority;
  category: NotificationCategory;
  title: string;
  message: string;
  aiGenerated: boolean;
  recommendation?: string;
  timestamp: string;
  mineId?: string;
  mineName?: string;
  equipmentId?: string;
  read: boolean;
  actionRequired: boolean;
}

const now = new Date();
const ts = (minutesAgo: number) => new Date(now.getTime() - minutesAgo * 60 * 1000).toISOString();

export const notifications: Notification[] = [
  {
    id: 'NOTIF-001',
    priority: 'critical',
    category: 'equipment',
    title: '🔴 Imminent Equipment Failure — Dumper 203',
    message: 'AI model predicts 83% probability of catastrophic bearing failure within 48 hours. Current bearing temperature: 98°C (critical threshold: 90°C). Vibration at 8.7 mm/s (limit: 5 mm/s).',
    aiGenerated: true,
    recommendation: 'Immediately remove Dumper 203 from service. Schedule emergency bearing replacement (Part No: SKF-29415). Estimated downtime: 12 hours. Cost: ₹2.4 lakhs. Alternative: Redeploy Dumper 208 from Piparwar.',
    timestamp: ts(12),
    mineId: 'RJP',
    mineName: 'Rajrappa',
    equipmentId: 'DMP-203',
    read: false,
    actionRequired: true,
  },
  {
    id: 'NOTIF-002',
    priority: 'critical',
    category: 'equipment',
    title: '🔴 Conveyor C-7 Complete Failure — Argada Mine',
    message: 'Conveyor C-7 at Argada mine has suffered complete breakdown. Belt splice failure and motor burnout detected. Mine production halted on this section.',
    aiGenerated: true,
    recommendation: 'Production loss estimated at ₹42 lakhs/day. Recommend: (1) Emergency procurement of belt splice kit, (2) Expedite motor replacement — ETA 5 days with priority order, (3) Consider declaring force majeure for contractual obligations.',
    timestamp: ts(45),
    mineId: 'ARG',
    mineName: 'Argada',
    equipmentId: 'CNV-101',
    read: false,
    actionRequired: true,
  },
  {
    id: 'NOTIF-003',
    priority: 'high',
    category: 'safety',
    title: '⚠️ Dust Levels Exceeding DGMS Limits — Rajrappa Sector-4',
    message: 'Ambient dust levels in Rajrappa Sector-4 recorded at 842 mg/m³. DGMS permissible limit is 750 mg/m³. Continued exposure risks respiratory disease.',
    aiGenerated: true,
    recommendation: 'Activate additional water sprinkler units in Sector-4. Issue N95 masks to all 87 workers in affected zone. Schedule respiratory health check for workers with >30 days exposure.',
    timestamp: ts(78),
    mineId: 'RJP',
    mineName: 'Rajrappa',
    read: false,
    actionRequired: true,
  },
  {
    id: 'NOTIF-004',
    priority: 'high',
    category: 'production',
    title: '⚠️ Kuju Mine — 19.6% Production Shortfall Q2',
    message: 'Kuju mine achieved only 418,000 MT against Q2 target of 520,000 MT. Primary cause: Drill Rig DR-2 idle for 200+ hours due to deferred maintenance.',
    aiGenerated: true,
    recommendation: 'Authorize ₹38 lakhs emergency maintenance for DR-2. If deferred further, Q3 shortfall may exceed 25%. Alternative: Hire contract drill rig for 60 days at ₹1.2 lakhs/day.',
    timestamp: ts(120),
    mineId: 'KJU',
    mineName: 'Kuju',
    read: true,
    actionRequired: true,
  },
  {
    id: 'NOTIF-005',
    priority: 'high',
    category: 'safety',
    title: '⚠️ 14 Employee Safety Certifications Expiring in 30 Days',
    message: 'AI analysis of employee database detected 14 employees with safety certifications expiring within 30 days. Includes 3 Electrical Engineers and 4 Overmen.',
    aiGenerated: true,
    recommendation: 'Schedule batch safety training on July 20-21, 2025. Estimated cost: ₹1.8 lakhs. Non-renewal will create statutory compliance risk under Mines Act.',
    timestamp: ts(180),
    read: false,
    actionRequired: true,
  },
  {
    id: 'NOTIF-006',
    priority: 'medium',
    category: 'equipment',
    title: '🟡 Hydraulic Oil Stock Critical',
    message: 'Hydraulic oil inventory at central store is at 2,100 litres. Minimum safety stock: 1,500 litres. Current consumption rate: 262 litres/day. Days remaining: 8.',
    aiGenerated: true,
    recommendation: 'Place urgent purchase order for 5,000 litres (Recommended supplier: IOCL, rate: ₹187/litre). Expected delivery: 5-7 days. Total cost: ₹9.35 lakhs.',
    timestamp: ts(240),
    read: false,
    actionRequired: false,
  },
  {
    id: 'NOTIF-007',
    priority: 'medium',
    category: 'hr',
    title: '🟡 Annual Performance Appraisal Deadline — 21 Days',
    message: 'Self-appraisal submission deadline is July 31, 2025. As of today, only 38% of executives (E1-E9) have submitted. 217 submissions pending.',
    aiGenerated: false,
    recommendation: 'Send automated reminder to all 217 pending employees. Escalate to Mine Managers if not submitted by July 25.',
    timestamp: ts(360),
    read: true,
    actionRequired: false,
  },
  {
    id: 'NOTIF-008',
    priority: 'medium',
    category: 'production',
    title: '🟡 Piparwar Mine Exceeding Production Target by 2.1%',
    message: 'Piparwar OC mine has achieved 100.5% of monthly production target. AI suggests opportunity to strategically bank production for upcoming low-demand period.',
    aiGenerated: true,
    timestamp: ts(480),
    read: true,
    actionRequired: false,
  },
  {
    id: 'NOTIF-009',
    priority: 'low',
    category: 'system',
    title: '🟢 System Update — IntelliMine Copilot v2.4.1',
    message: 'New AI model update deployed. Failure prediction accuracy improved from 84% to 91%. New feature: Natural language report generation in Hindi.',
    aiGenerated: false,
    timestamp: ts(720),
    read: true,
    actionRequired: false,
  },
  {
    id: 'NOTIF-010',
    priority: 'low',
    category: 'hr',
    title: '🟢 New Employee Onboarding — 8 Recruits Joining July 15',
    message: '8 new technical staff joining CCL on July 15, 2025. Induction programme scheduled at CMPDIL, Ranchi.',
    aiGenerated: false,
    timestamp: ts(1440),
    read: true,
    actionRequired: false,
  },
];

export const notificationSummary = {
  total: notifications.length,
  critical: notifications.filter(n => n.priority === 'critical').length,
  high: notifications.filter(n => n.priority === 'high').length,
  unread: notifications.filter(n => !n.read).length,
  actionRequired: notifications.filter(n => n.actionRequired).length,
};
