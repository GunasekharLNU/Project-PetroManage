import { Trash2 } from "lucide-react";
export const PlansTable = ({ productionPlans, setProductionPlans }) => {
  
  
  const handleDelete = (id) => {
  
    const updatedPlans = productionPlans.filter(plan => plan.id !== id);

    setProductionPlans(updatedPlans);
  };

  return (
    <table className="w-full">
      <thead className="bg-gray-200 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned Volume</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {productionPlans.map((plan) => (
          <tr key={plan.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.id}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <p className="text-sm font-medium text-gray-900">{plan.assetName}</p>
                <p className="text-xs text-gray-500">{plan.assetId}</p>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {plan.plannedVolume.toLocaleString()} {plan.unit}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {plan.startDate} to {plan.endDate}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                plan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {plan.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
              {/* <button 
                className="text-indigo-600 hover:text-indigo-900 transition-colors"
              >
                Edit
              </button> */}
              {/* New Delete Button */}
              <button 
                onClick={() => handleDelete(plan.id)}
                className="text-red-600 hover:text-red-900 transition-colors cursor-pointer"
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