import type { TrackerData } from './types';

const STORAGE_KEY = 'monthly-payment-tracker-data';

const defaultData: TrackerData = {
  bills: [],
  records: [],
  settings: {
    enabled: true,
    leadDays: 3,
  },
};

export function loadData(): TrackerData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultData;
  try {
    const parsed = JSON.parse(raw) as Partial<TrackerData>;
    return {
      bills: parsed.bills ?? [],
      records: parsed.records ?? [],
      loan: parsed.loan,
      settings: parsed.settings ?? defaultData.settings,
    };
  } catch {
    return defaultData;
  }
}

export function saveData(data: TrackerData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
