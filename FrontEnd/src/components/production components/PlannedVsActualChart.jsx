import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';


const data = [
  { date: '2024-01-10', planned: 5000, actual: 4000 },
  { date: '2024-01-11', planned: 5000, actual: 4350 },
  { date: '2024-01-12', planned: 5000, actual: 5500 },
  { date: '2024-01-13', planned: 5000, actual: 5150 },
  { date: '2024-01-14', planned: 5000, actual: 4080 },
  { date: '2024-01-14', planned: 5000, actual: 4080 },
  { date: '2024-01-14', planned: 5000, actual: 5080 }
];


export default function PlannedVsActualChart() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Planned vs Actual Production
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Planned Line */}
          <Line
            type="monotone"
            dataKey="planned"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            name="Planned"
          />

          {/* Actual Line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#16a34a"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Actual"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}