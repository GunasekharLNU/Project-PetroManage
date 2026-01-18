import { useState } from 'react';

export function RecordForm({ onCancel, RecordPlans, setRecordPlans }) {
  // 1. Asset reference list
  const assetList = [
    { id: 'RIG-001', name: 'North Sea Rig Alpha' },
    { id: 'RIG-002', name: 'West Texas Rig Beta' },
    { id: 'RIG-008', name: 'Gulf Platform Echo' },
  ];

  const [form, setForm] = useState({
    asset: '',
    unit: 'barrels',
    actualVolume: '',
    date: ''
  });

  const handleSubmit = () => {
    // 2. Find the asset name
    const selectedAsset = assetList.find(a => a.id === form.asset);
    
    // 3. Calculation Logic
    const actual = Number(form.actualVolume);
    const planned = 5000; // Constant as per your requirement
    
    // Calculate variance percentage
    const diff = actual - planned;
    const variancePercent = ((diff / planned) * 100).toFixed(1);
    const varianceString = `${diff >= 0 ? '+' : ''}${variancePercent}%`;

    const payload = {
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      assetId: form.asset,
      assetName: selectedAsset ? selectedAsset.name : 'Unknown Asset',
      actualVolume: actual,
      plannedVolume: planned, // Extra field 1
      variance: varianceString, // Extra field 2 (e.g., "+3.0%" or "-2.4%")
      unit: form.unit,
      date: form.date
    };

    // 4. Update the parent state
    setRecordPlans([payload, ...RecordPlans]);
    
    console.log('Record Payload:', payload);
    onCancel(); // Close form
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-6 border-b border-gray-100 pb-4">
          Add Production Record
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Asset
            </label>
            <select
              value={form.asset}
              onChange={(e) => setForm({ ...form, asset: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg text-gray-900
                         focus:border-black focus:ring-0 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Asset</option>
              {assetList.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.id} - {asset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actual Volume */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Actual Volume
            </label>
            <input
              type="number"
              placeholder="e.g., 4980"
              value={form.actualVolume}
              onChange={(e) => setForm({ ...form, actualVolume: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg
                         focus:bg-white focus:border-black focus:ring-0 transition-all"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg
                         focus:bg-white focus:border-black focus:ring-0 transition-all"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Unit
            </label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg
                         focus:border-black focus:ring-0 transition-all appearance-none cursor-pointer"
            >
              <option value="barrels">Barrels</option>
              <option value="mcf">MCF (Natural Gas)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            className="flex-1 md:flex-none px-8 py-3 bg-black text-white font-bold rounded-lg
                 hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-gray-200"
          >
            Add Record
          </button>
          <button
            onClick={onCancel}
            className="flex-1 md:flex-none px-8 py-3 bg-white text-black font-bold rounded-lg
                 border-2 border-black hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}