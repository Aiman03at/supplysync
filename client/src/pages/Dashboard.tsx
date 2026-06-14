import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventoryStore, Alert } from '../store/inventoryStore';
import socket from '../services/socket';
import InventoryTable from '../components/InventoryTable';
import AlertBanner from '../components/AlertBanner';

export default function Dashboard() {
  const { fetchInventory, updateItem, addAlert } = useInventoryStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
    socket.connect();

    socket.on('inventory:changed', (data: { productId: string; warehouseId: string; quantity: number }) => {
      updateItem(data);
    });

    socket.on('alert:triggered', (alert: Alert) => {
      addAlert(alert);
    });

    return () => {
      socket.off('inventory:changed');
      socket.off('alert:triggered');
      socket.disconnect();
    };
  }, [fetchInventory, updateItem, addAlert]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">SupplySync</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AlertBanner />

        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Inventory</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Live stock levels — rows flash blue when updated via WebSocket
          </p>
        </div>

        <InventoryTable />
      </main>
    </div>
  );
}
