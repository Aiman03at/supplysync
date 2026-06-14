import { create } from 'zustand';
import api from '../services/api';

export interface InventoryItem {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  warehouse_id: string;
  warehouse_name: string;
  location: string;
  quantity: number;
  reorder_point: number;
  updated_at: string;
  isUpdated?: boolean;
}

export interface Alert {
  id: string;
  type: string;
  severity: string;
  message: string;
  product_name: string;
  created_at: string;
}

interface InventoryState {
  items: InventoryItem[];
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  fetchInventory: () => Promise<void>;
  updateItem: (data: { productId: string; warehouseId: string; quantity: number }) => void;
  addAlert: (alert: Alert) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  alerts: [],
  loading: false,
  error: null,

  fetchInventory: async () => {
    set({ loading: true, error: null });
    try {
      const [inventoryRes, alertsRes] = await Promise.all([
        api.get<InventoryItem[]>('/inventory'),
        api.get<Alert[]>('/inventory/alerts/active'),
      ]);
      set({ items: inventoryRes.data, alerts: alertsRes.data, loading: false });
    } catch {
      set({ error: 'Failed to fetch inventory', loading: false });
    }
  },

  updateItem: ({ productId, warehouseId, quantity }) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product_id === productId && item.warehouse_id === warehouseId
          ? { ...item, quantity, isUpdated: true }
          : item
      ),
    }));
    // Clear the highlight flash after the CSS transition completes
    setTimeout(() => {
      set((state) => ({
        items: state.items.map((item) =>
          item.product_id === productId && item.warehouse_id === warehouseId
            ? { ...item, isUpdated: false }
            : item
        ),
      }));
    }, 2000);
  },

  addAlert: (alert) => {
    set((state) => ({ alerts: [alert, ...state.alerts] }));
  },
}));
