import { useEffect, useState } from 'react';
import { Plus, Calendar, TrendingUp, BarChart } from 'lucide-react';
import { AvP } from '../components/production components/AvP';
import { PlansForm } from '../components/production components/PlansForm';
import { PlansTable } from '../components/production components/PlansTable';
import { RecordForm } from '../components/production components/RecordForm';
import { RecordTable } from '../components/production components/RecordTable';
import PlannedVsActualChart from '../components/production components/PlannedVsActualChart';

const initialPlans = [
  { id: 'PLAN-001', assetId: 'RIG-001', assetName: 'North Sea Rig Alpha', plannedVolume: 5000, unit: 'barrels/day', startDate: '2024-01-01', endDate: '2024-03-31', status: 'Active' },
  { id: 'PLAN-002', assetId: 'RIG-002', assetName: 'West Texas Rig Beta', plannedVolume: 4200, unit: 'barrels/day', startDate: '2024-01-01', endDate: '2024-03-31', status: 'Active' },
  { id: 'PLAN-003', assetId: 'RIG-008', assetName: 'Gulf Platform Echo', plannedVolume: 6500, unit: 'barrels/day', startDate: '2024-01-15', endDate: '2024-04-15', status: 'Active' },
  { id: 'PLAN-004', assetId: 'STG-012', assetName: 'Storage Facility B', plannedVolume: 150000, unit: 'barrels', startDate: '2024-01-01', endDate: '2024-06-30', status: 'Planned' }
];

const initialRecords = [
  { id: 'REC-1245', assetId: 'RIG-001', assetName: 'North Sea Rig Alpha', actualVolume: 5150, plannedVolume: 5000, unit: 'barrels', date: '2024-01-14', variance: '+3%' },
  { id: 'REC-1246', assetId: 'RIG-002', assetName: 'West Texas Rig Beta', actualVolume: 4050, plannedVolume: 5200, unit: 'barrels', date: '2024-01-14', variance: '-3.6%' },
  { id: 'REC-1247', assetId: 'RIG-008', assetName: 'Gulf Platform Echo', actualVolume: 6420, plannedVolume: 6500, unit: 'barrels', date: '2024-01-14', variance: '-1.2%' },
  { id: 'REC-1248', assetId: 'RIG-001', assetName: 'North Sea Rig Alpha', actualVolume: 4980, plannedVolume: 4900, unit: 'barrels', date: '2024-01-13', variance: '-0.4%' },
  { id: 'REC-1249', assetId: 'RIG-002', assetName: 'West Texas Rig Beta', actualVolume: 4300, plannedVolume: 4200, unit: 'barrels', date: '2024-01-13', variance: '+2.4%' }
];

export function Production() {
  const [activeTab, setActiveTab] = useState('plans');
  const [showAddForm, setShowAddForm] = useState(false);
  const [dailyBarrels, setDailyBarrels] = useState(0);
  const [planAchievement, setplanAchievement] = useState(0);
  const [avtivePlans, setActivePlans] = useState(0);
  const [productionPlans, setProductionPlans] = useState(initialPlans);
  const [RecordPlans, setRecordPlans] = useState(initialRecords);

  useEffect(() => {
    calculateTotals();
  })
  const calculateTotals = () => {

    //Barrel Production
    const total = RecordPlans.reduce((accumulator, record) => {
      return accumulator + (record.actualVolume || 0);
    }, 0);

    //Plan Acivement
    const totalActual = RecordPlans.reduce((sum, rec) => sum + rec.actualVolume, 0);
    const totalPlanned = RecordPlans.reduce((sum, rec) => sum + rec.plannedVolume, 0);
    console.log(totalPlanned);
    console.log(totalActual);


    const planAchievement = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;

    // 2. Count Active Plans
    const activePlansCount = productionPlans.filter(plan => plan.status === 'Active').length;

    setDailyBarrels(total);
    setplanAchievement(planAchievement);
    setActivePlans(activePlansCount);
  };


  return (
    <div className="space-y-6 py-4">
      <div className="bg-gradient-to-tr from-slate-950 via-emerald-600 to-teal-900 rounded-xl p-8 text-white flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex">
            <TrendingUp size={40} />
            &nbsp; Production Management
          </h2>
          <p className="text-emerald-100 mt-1 pl-14">
            Plan and track production operations
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors h-fit"
        >
          <Plus size={20} />
          {activeTab === 'plans' ? 'New Plan' : 'Add Record'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gray-600 rounded-lg">
              <BarChart className="text-white" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {(dailyBarrels || 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Daily Production (barrels)</p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gray-600 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {planAchievement.toLocaleString(undefined, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1
                })}%
              </p>
              <p className="text-sm text-gray-400">Plan Achievement</p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gray-600 rounded-lg">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {avtivePlans.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Active Production Plans</p>
            </div>
          </div>
        </div>
      </div>

      {/* <AvP/> */}

      {showAddForm && (
        <div className="bg-slate-100 rounded-lg shadow-sm border border-gray-400 p-6">
          {activeTab === 'plans' ? (
            <PlansForm
              productionPlans={productionPlans}
              onCancel={() => setShowAddForm(false)}
              setProductionPlans={setProductionPlans}
            />
          ) : (
            <RecordForm
              onCancel={() => setShowAddForm(false)}
            />
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'plans'
                ? 'border-b-2 border-slate-800 text-slate-800'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Production Plans
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'records'
                ? 'border-b-2 border-slate-800 text-slate-800'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Production Records
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'plans' ? (
            <PlansTable productionPlans={productionPlans} setProductionPlans={setProductionPlans} />
          ) : (
            <RecordTable RecordPlans={RecordPlans} setRecordPlans={setRecordPlans} />
          )}
        </div>
      </div>

      <PlannedVsActualChart />
    </div>
  );
}