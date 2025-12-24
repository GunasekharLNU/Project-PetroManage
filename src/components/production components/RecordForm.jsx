import { useState } from 'react';

export  function RecordForm({ onCancel }) {
  const [form, setForm] = useState({
    asset: '',
    unit: 'barrels',
    actualVolume: '',
    date: ''
  });

  const handleSubmit = () => {
    const payload = {
      assetId: form.asset,
      actualVolume: Number(form.actualVolume),
      unit: form.unit,
      date: form.date
    };

    console.log('Record Payload:', payload);
    // axios.post('/api/records', payload)
  };

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Add Production Record
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

        {/* Actual Volume */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Actual Volume
          </label>
          <input
            type="number"
            placeholder="e.g., 4980"
            value={form.actualVolume}
            onChange={(e) =>
              setForm({ ...form, actualVolume: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
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
            <option value="barrels">Barrels</option>
            <option value="mcf">MCF (Natural Gas)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-slate-800 text-white rounded-lg
                     hover:bg-slate-700 transition-colors"
        >
          Add Record
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