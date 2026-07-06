'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MetricsChart({ normalMetrics, failureMetrics }: { normalMetrics: any, failureMetrics?: any }) {
  if (!normalMetrics) return null;

  const data = [
    {
      name: 'Latency (ms)',
      Normal: normalMetrics.latency,
      Failure: failureMetrics ? failureMetrics.latency : 0,
    },
    {
      name: 'Throughput (req/s)',
      Normal: normalMetrics.throughput,
      Failure: failureMetrics ? failureMetrics.throughput : 0,
    },
    {
      name: 'Errors (%)',
      Normal: normalMetrics.errorRate,
      Failure: failureMetrics ? failureMetrics.errorRate : 0,
    },
    {
      name: 'Avail (%)',
      Normal: normalMetrics.availability,
      Failure: failureMetrics ? failureMetrics.availability : 0,
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[400px]">
      <h3 className="text-lg font-bold text-white mb-4">Simulation Results</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="Normal" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          {failureMetrics && <Bar dataKey="Failure" fill="#ef4444" radius={[4, 4, 0, 0]} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
