import { create } from 'zustand';

interface Alert {
  id: string;
  type: string;
  severity: string;
  product_name: string;
  message: string;
}

interface AlertStore {
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (alertId: string) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
    })),
  removeAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
    })),
}));
