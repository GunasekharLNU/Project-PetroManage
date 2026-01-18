import { Trash2 } from "lucide-react";
export const RecordTable = ({ RecordPlans, setRecordPlans }) => {
  const handleDelete = (id) => {
    
    const updatedRecords = RecordPlans.filter(record => record.id !== id);
    
    setRecordPlans(updatedRecords);
  };

  return (
    <table className="w-full">
      <thead className="bg-gray-200 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          {/* Action Header */}
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {RecordPlans.map((record) => (
          <tr key={record.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <p className="text-sm font-medium text-gray-900">{record.assetName}</p>
                <p className="text-xs text-gray-500">{record.assetId}</p>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {record.actualVolume.toLocaleString()} {record.unit}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {record.plannedVolume.toLocaleString()} {record.unit}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 rounded text-xs font-medium ${record.variance.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {record.variance}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.date}</td>
            {/* Action Button Cell */}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => handleDelete(record.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete Record"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};