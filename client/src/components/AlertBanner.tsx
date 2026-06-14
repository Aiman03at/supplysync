import { useInventoryStore } from '../store/inventoryStore';

const severityStyles: Record<string, string> = {
  critical: 'bg-red-600 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-400 text-gray-900',
  low: 'bg-blue-100 text-blue-800',
};

export default function AlertBanner() {
  const { alerts } = useInventoryStore();

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg text-sm ${
            severityStyles[alert.severity] ?? 'bg-gray-100 text-gray-800'
          }`}
        >
          <span className="font-bold uppercase tracking-wide shrink-0">{alert.severity}</span>
          <span>{alert.message}</span>
        </div>
      ))}
    </div>
  );
}
