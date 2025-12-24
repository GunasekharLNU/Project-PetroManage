import { useState } from 'react';

export  function PlansForm({ onCancel ,setProductionPlans,productionPlans}) {
  const [form, setForm] = useState({
    asset: '',
    unit: 'barrels/day',
    plannedVolume: '',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = () => {
    const payload = {
      assetId: form.asset,
      plannedVolume: Number(form.plannedVolume),
      unit: form.unit,
      startDate: form.startDate,
      endDate: form.endDate
    };
    // setProductionPlans(...productionPlans,payload);

    console.log('Plan Payload:', payload);
  };

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Create Production Plan
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Asset */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asset
          </label>
          <select
            value={form.asset}
            onChange={(e) => setForm({ ...form, asset: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="">Select Asset</option>
            <option value="RIG-001">RIG-001 - North Sea Rig Alpha</option>
            <option value="RIG-002">RIG-002 - West Texas Rig Beta</option>
          </select>
        </div>

        {/* Planned Volume */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Planned Volume
          </label>
          <input
            type="number"
            placeholder="e.g., 5000"
            value={form.plannedVolume}
            onChange={(e) =>
              setForm({ ...form, plannedVolume: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) =>
              setForm({ ...form, endDate: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <select
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="barrels/day">Barrels per Day</option>
            <option value="barrels">Barrels</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-slate-800 text-white rounded-lg
                     hover:bg-slate-700 transition-colors"
        >
          Create Plan
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700
                     rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </>
  );
}