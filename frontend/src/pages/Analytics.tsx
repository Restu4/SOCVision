import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { logsApi } from '../services/api';

const PIECOLORS = ['#ef4444', '#f59e0b', '#eab308', '#3b82f6'];

interface LogStats {
  eventsPerHour: { hour: string; count: number }[];
  alertsBySeverity: { severity: string; count: number }[];
  topEventTypes: { eventType: string; count: number }[];
  failedLoginTrend: { date: string; count: number }[];
  topSourceIPs: { ip: string; count: number }[];
  totalEvents: number;
}

export default function Analytics() {
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logsApi.getStats()
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to fetch stats', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-soc-400">Loading...</div>;
  if (!stats) return <div className="text-center py-8 text-soc-400">No data available</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-soc-400 text-sm mt-1">Security event analytics and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold text-soc-200 mb-4">Events Per Hour (Last 24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.eventsPerHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={(v) => v.slice(11, 16)} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} labelStyle={{ color: '#e5e7eb' }} />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-soc-200 mb-4">Alerts By Severity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.alertsBySeverity} dataKey="count" nameKey="severity" cx="50%" cy="50%" outerRadius={100} label={({ severity, count }) => `${severity} (${count})`}>
                {stats.alertsBySeverity.map((_, idx) => <Cell key={idx} fill={PIECOLORS[idx % PIECOLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold text-soc-200 mb-4">Top Event Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topEventTypes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis type="category" dataKey="eventType" tick={{ fill: '#9ca3af', fontSize: 10 }} width={120} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-soc-200 mb-4">Failed Login Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.failedLoginTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold text-soc-200 mb-4">Top Source IPs</h3>
          <div className="space-y-2">
            {stats.topSourceIPs.map((item, idx) => (
              <div key={item.ip} className="flex items-center justify-between py-1.5 border-b border-soc-700 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-soc-500 w-5">{idx + 1}.</span>
                  <span className="text-sm font-mono text-soc-200">{item.ip}</span>
                </div>
                <span className="text-xs text-soc-400">{item.count} events</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-soc-200 mb-4">Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-soc-700">
              <span className="text-soc-400">Total Events Analyzed</span>
              <span className="font-semibold">{stats.totalEvents.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-soc-700">
              <span className="text-soc-400">Unique Source IPs</span>
              <span className="font-semibold">{stats.topSourceIPs.length}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-soc-400">Alert Types</span>
              <span className="font-semibold">{stats.alertsBySeverity.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
