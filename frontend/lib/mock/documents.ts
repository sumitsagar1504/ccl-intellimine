export interface Document {
  id: string;
  title: string;
  category: 'Safety Manual' | 'Inspection Report' | 'SOP' | 'Circular' | 'Tender' | 'Purchase Order' | 'Technical Report';
  mineId?: string;
  mineName?: string;
  author: string;
  date: string;
  pages: number;
  size: string;
  tags: string[];
  summary: string;
  content: string; // Used as RAG context
}

export const documents: Document[] = [
  {
    id: 'DOC-001',
    title: 'Coal Mines Regulations 2017 — Safety Standards',
    category: 'Safety Manual',
    author: 'DGMS (Directorate General of Mines Safety)',
    date: '2017-01-01',
    pages: 284,
    size: '8.4 MB',
    tags: ['safety', 'regulations', 'DGMS', 'methane', 'ventilation'],
    summary: 'Comprehensive safety regulations for coal mines in India under Mines Act 1952.',
    content: `Coal Mines Regulations 2017 — Key Provisions:
    
Section 5.3 — Methane Safety:
The maximum permissible concentration of methane (CH4) in any part of a coal mine atmosphere shall not exceed 1.25% by volume. In return airways, the methane concentration shall not exceed 0.75%. Any area where methane concentration exceeds 1.5% must be immediately evacuated and ventilated.

Section 8.1 — Ventilation:
All working places in coal mines shall be ventilated with fresh air. The minimum quantity of air reaching the last ventilation door on any split shall not be less than 2.8 cubic metres per second per one thousand workers employed underground.

Section 12.4 — Explosives:
Only permitted explosives shall be used in coal mines. Detonators shall be of the instantaneous electric type or safety fuse type as approved by the Chief Inspector of Mines.

Section 15.2 — PPE Requirements:
All persons entering underground coal mines shall wear: (a) Safety helmet with chin strap, (b) Self-rescuer (CO filter type), (c) Cap lamp with battery, (d) Safety boots, (e) Reflective vest.

Section 18.6 — Dust Suppression:
Stone dust barriers shall be maintained at intervals not exceeding 300 metres in every road used for travelling or transport. The incombustible content of the mixture of coal dust and stone dust shall be not less than 80%.

Section 22.1 — Emergency Procedures:
Every mine shall have a rescue station equipped with breathing apparatus for at least 5 persons. Emergency evacuation drills shall be conducted at least once every 6 months.`
  },
  {
    id: 'DOC-002',
    title: 'Rajrappa Mine — Monthly Safety Inspection Report (June 2025)',
    category: 'Inspection Report',
    mineId: 'RJP',
    mineName: 'Rajrappa',
    author: 'Priya Sharma (Safety Officer)',
    date: '2025-07-01',
    pages: 42,
    size: '2.1 MB',
    tags: ['safety', 'inspection', 'Rajrappa', 'June 2025', 'monthly'],
    summary: 'Monthly safety inspection covering all sections of Rajrappa OC mine.',
    content: `Rajrappa Mine Safety Inspection Report — June 2025

Executive Summary:
Overall safety compliance: 87.3% (Target: 90%)
Inspections conducted: 148 (covering all 6 sectors)
Violations found: 23 (Reduced from 31 in May)

Critical Findings:
1. Dumper 203: Overheating warnings ignored for 3 consecutive shifts — Escalated to Maintenance
2. Sector-4 dust levels: 842 mg/m³ (Permissible limit: 750 mg/m³) — Immediate dust suppression ordered
3. 6 workers found without proper PPE near blasting zone — Challan issued

Recommendations:
- Increase dust monitoring frequency in Sector-4 from weekly to daily
- Replace Dumper 203 bearing immediately (AI system flagged 83% failure probability)
- Conduct emergency refresher training for 14 workers whose certifications expire in 30 days

Incident Report:
Date: June 14 — Minor injury (sprained ankle) near conveyor belt. Worker: Shiv Kumar, EMP-0847. First aid administered. 2 days medical leave granted.

Compliance by Department:
- Operations: 85% ✓
- Mechanical: 82% ✗ (Below target)
- Electrical: 91% ✓
- Transport: 88% ✓`
  },
  {
    id: 'DOC-003',
    title: 'SOP — HEMM Maintenance Procedure',
    category: 'SOP',
    author: 'Mechanical Engineering Division, CCL HQ',
    date: '2024-06-01',
    pages: 96,
    size: '4.2 MB',
    tags: ['SOP', 'HEMM', 'maintenance', 'excavator', 'dumper', 'procedure'],
    summary: 'Standard Operating Procedure for Heavy Earth Moving Machinery maintenance.',
    content: `SOP-MECH-001: HEMM Maintenance Procedure

1. PRE-MAINTENANCE SAFETY:
1.1 Ensure machine is switched off and engine key removed
1.2 Place "Under Maintenance" board visibly on machine
1.3 Chock all wheels/tracks before starting work
1.4 Wear required PPE: gloves, safety glasses, overalls, steel-toe boots
1.5 Obtain Work Permit from Safety Officer before any maintenance

2. ENGINE OIL CHANGE (Every 250 hours):
2.1 Allow engine to cool for minimum 30 minutes
2.2 Remove drain plug — Torque 45 N⋅m on reassembly
2.3 Use only approved oil: SAE 15W-40 API CI-4 or equivalent
2.4 Change oil filter simultaneously
2.5 Fill to maximum mark on dipstick

3. BEARING INSPECTION (Monthly):
3.1 Check bearing temperature with infrared thermometer
3.2 Normal operating range: 40-80°C. Above 90°C — stop operation immediately
3.3 Listen for unusual noise (grinding = replace immediately)
3.4 Vibration analysis: >5 mm/s RMS requires immediate investigation
3.5 Grease nipples: 3 pumps of lithium-based grease per bearing

4. HYDRAULIC SYSTEM (Every 500 hours):
4.1 Check hydraulic fluid level — top up if below minimum line
4.2 Inspect all hoses for cracks, leaks, or chafing
4.3 Replace hydraulic filter element
4.4 System pressure test: 250 bar (min), 280 bar (rated)

5. POST-MAINTENANCE:
5.1 Record all work in Machine Log Book (Form MECH-7)
5.2 Road test for 15 minutes before returning to operation
5.3 Submit completed maintenance checklist to Section Engineer`
  },
  {
    id: 'DOC-004',
    title: 'CCL Circular No. 2025/HR/042 — Annual Performance Appraisal',
    category: 'Circular',
    author: 'Director (Personnel), CCL HQ, Ranchi',
    date: '2025-06-15',
    pages: 8,
    size: '0.4 MB',
    tags: ['HR', 'appraisal', 'performance', '2025', 'circular'],
    summary: 'Annual performance appraisal schedule and guidelines for 2025.',
    content: `CCL Circular No. 2025/HR/042

Subject: Annual Performance Appraisal — 2025

1. All executives in E1 to E9 grade shall submit their self-appraisal by July 31, 2025.
2. Reporting Officers shall complete appraisals by August 15, 2025.
3. Reviewing Officers shall finalize by August 31, 2025.
4. Grading scale: Outstanding (O), Very Good (VG), Good (G), Fair (F), Poor (P)
5. Bell curve: O: 15%, VG: 30%, G: 40%, F: 10%, P: 5%
6. Increment linked to performance: O = 5%, VG = 4%, G = 3%, F = 1%, P = 0%`
  },
  {
    id: 'DOC-005',
    title: 'Piparwar Mine — Environmental Impact Assessment (2024-25)',
    category: 'Technical Report',
    mineId: 'PPW',
    mineName: 'Piparwar',
    author: 'Environmental Division, CCL',
    date: '2025-04-30',
    pages: 156,
    size: '12.8 MB',
    tags: ['environment', 'EIA', 'Piparwar', 'dust', 'water', '2024-25'],
    summary: 'Annual environmental impact assessment for Piparwar OC mine.',
    content: `Environmental Impact Assessment — Piparwar Mine 2024-25

Air Quality:
- Ambient PM10 average: 112 μg/m³ (NAAQS limit: 100 μg/m³) — Exceeded by 12%
- PM2.5 average: 38 μg/m³ (NAAQS limit: 60 μg/m³) — Within limit
- Dust emission reduction measures implemented: Water sprinklers (8 units), Green belt expansion

Water:
- Surface water quality within permissible limits
- Mine water discharged: 2.4 ML/day (treated through settling ponds)

Noise:
- Blasting vibration: 8.2 mm/s PPV (Permissible: 12.5 mm/s) — Within limit
- Daytime noise: 64 dB (Permissible: 75 dB) — Within limit

Recommendations:
- Install 4 additional water sprinkler units in Sector-2
- Increase green belt coverage from 12% to 18% by 2026`
  },
  {
    id: 'DOC-006',
    title: 'Kuju Mine — Quarterly Inspection Report (Q2 2025)',
    category: 'Inspection Report',
    mineId: 'KJU',
    mineName: 'Kuju',
    author: 'Regional Safety Inspectorate',
    date: '2025-06-30',
    pages: 38,
    size: '1.8 MB',
    tags: ['inspection', 'Kuju', 'Q2', '2025', 'underground', 'ventilation'],
    summary: 'Q2 2025 safety inspection for Kuju underground coal mine.',
    content: `Kuju UG Mine — Q2 2025 Inspection Report

Ventilation:
- Main fan duty: 180 m³/s (Required: 150 m³/s) — Adequate
- Methane readings: Level 3 workings — 0.4% (Safe)
- CO readings: < 10 ppm everywhere — Safe

Production Performance:
- Q2 actual: 418,000 MT
- Q2 target: 520,000 MT
- Shortfall: 19.6% — Attributed to equipment downtime (Drill Rig DR-2 idle 200+ hours)

Action Items:
- DR-2 drill rig requires immediate maintenance or replacement decision
- 3 supports in Level-4 southeast showing signs of convergence — monitor closely`
  },
];

// Document content for RAG simulation
export const ragContext = documents.map(d => ({
  id: d.id,
  title: d.title,
  content: d.content,
}));
