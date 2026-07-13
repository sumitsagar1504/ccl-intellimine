'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './client';

// Import mock data as fallback
import { employees as mockEmployees, employeeSummary as mockSummary } from '@/lib/mock/employees';
import { equipment as mockEquipment, equipmentSummary as mockEquipmentSummary } from '@/lib/mock/equipment';
import { mines as mockMines } from '@/lib/mock/production';
import { notifications as mockNotifications } from '@/lib/mock/notifications';
import {
  kpiSummary as mockKPI,
  productionForecast as mockForecast,
  productionByMine as mockByMine,
  fuelConsumption as mockFuel,
  equipmentFailurePrediction as mockFailure,
  safetyTrend as mockSafety,
  inventoryLevels as mockInventory,
} from '@/lib/mock/analytics';

const POLL_INTERVAL = 30_000; // 30 seconds

type HookState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  fromAPI: boolean;
};

function useAPIData<T>(
  endpoint: string,
  fallback: T,
  transform?: (raw: any) => T,
): HookState<T> {
  const [state, setState] = useState<HookState<T>>({
    data: fallback,
    loading: true,
    error: null,
    fromAPI: false,
  });

  const fetch = useCallback(async () => {
    try {
      const raw = await fetchAPI<any>(endpoint);
      const data = transform ? transform(raw) : (raw as T);
      setState({ data, loading: false, error: null, fromAPI: true });
    } catch (err: any) {
      // Fall back to mock data silently — Render free tier may be sleeping
      setState({ data: fallback, loading: false, error: err.message, fromAPI: false });
    }
  }, [endpoint]);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetch]);

  return state;
}

// ── Employees ────────────────────────────────────────────────────────────────

export function useEmployees() {
  return useAPIData(
    '/api/employees/?limit=50',
    { employees: mockEmployees, total: mockEmployees.length },
    (raw) => ({ employees: raw.employees, total: raw.total }),
  );
}

export function useEmployeeSummary() {
  return useAPIData(
    '/api/employees/summary/stats',
    mockSummary,
    (raw) => raw,
  );
}

// ── Equipment ────────────────────────────────────────────────────────────────

export function useEquipment() {
  return useAPIData(
    '/api/equipment/',
    { equipment: mockEquipment, summary: mockEquipmentSummary, total: mockEquipment.length },
    (raw) => ({ equipment: raw.equipment, summary: raw.summary, total: raw.total }),
  );
}

// ── Mines / Production ───────────────────────────────────────────────────────

export function useMines() {
  return useAPIData(
    '/api/analytics/mines',
    {
      mines: mockMines,
      summary: {
        totalProductionToday: mockMines.reduce((s, m) => s + m.todayActual, 0),
        totalTargetToday: mockMines.reduce((s, m) => s + m.todayTarget, 0),
        overallEfficiency: 87.7,
      },
    },
    (raw) => raw,
  );
}

// ── Analytics ────────────────────────────────────────────────────────────────

export function useKPI() {
  return useAPIData('/api/analytics/kpi', mockKPI);
}

export function useProductionAnalytics() {
  return useAPIData(
    '/api/analytics/production',
    {
      productionForecast: mockForecast,
      productionByMine: mockByMine,
      weeklyTrend: { labels: [], data: [] },
    },
  );
}

export function useFuelAnalytics() {
  return useAPIData(
    '/api/analytics/fuel-consumption',
    { fuelConsumption: mockFuel, powerConsumption: null },
  );
}

export function useEquipmentHealthAnalytics() {
  return useAPIData(
    '/api/analytics/equipment-health',
    { equipmentFailurePrediction: mockFailure },
  );
}

export function useSafetyAnalytics() {
  return useAPIData('/api/analytics/safety', { safetyTrend: mockSafety });
}

export function useInventory() {
  return useAPIData('/api/analytics/inventory', mockInventory);
}

// ── Notifications ─────────────────────────────────────────────────────────────

export function useNotifications(unreadOnly = false) {
  const endpoint = `/api/notifications/${unreadOnly ? '?unread_only=true' : ''}`;
  return useAPIData(
    endpoint,
    { notifications: mockNotifications, total: mockNotifications.length, unreadCount: mockNotifications.filter((n: any) => !n.read).length },
    (raw) => raw,
  );
}
