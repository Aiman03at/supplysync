import { useInventoryStore } from '../store/inventoryStore';

export default function InventoryTable() {
  const { items, loading } = useInventoryStore();

  if (loading) {
    return <div className="text-center py-12 text-gray-400 text-sm">Loading inventory...</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Product', 'SKU', 'Warehouse', 'Quantity', 'Reorder Point', 'Status'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => {
            const isLow = item.quantity < item.reorder_point;
            return (
              <tr
                key={item.id}
                className={`transition-colors duration-700 ${
                  item.isUpdated ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.product_name}</td>
                <td className="px-4 py-3 text-sm text-gray-500 font-mono">{item.sku}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{item.warehouse_name}</td>
                <td
                  className={`px-4 py-3 text-sm font-semibold ${
                    isLow ? 'text-red-600' : 'text-gray-900'
                  }`}
                >
                  {item.quantity}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{item.reorder_point}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      isLow
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {isLow ? 'Low Stock' : 'OK'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {items.length === 0 && (
        <p className="text-center py-10 text-gray-400 text-sm">No inventory records found.</p>
      )}
    </div>
  );
}
