import { useState, useEffect } from 'react';
import {
  Activity, AlertTriangle, Shield, Siren,
  Server, Gauge, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, RefreshCw,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { dashboardApi } from '../services/api';
import type { DashboardStats } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area,
} from 'recharts';

const PIECOLORS = ['#ef4444', '#f59e0b', '#eab308', '#3b82f6'];
const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f59e0b',
  MEDIUM: '#eab308',
  LOW: '#3b82f6',
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-soc-800/95 backdrop-blur-sm border border-soc-700 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-soc-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-medium text-soc-100" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin" />
          </div>
          <p className="text-sm text-soc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="w-16 h-16 text-soc-600 mx-auto mb-4" />
          <p className="text-soc-400">Failed to load dashboard data</p>
          <button onClick={fetchStats} className="btn-primary mt-4 text-sm">Retry</button>
        </div>
      </div>
    );
  }

  const maxAssetCount = Math.max(...stats.topAssets.map(a => a.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-sm text-soc-400 mt-1">Security Operations Center Overview</p>
        </div>
        <div className="flex items-center gap-2">
          {(['24h', '7d', '30d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                timeframe === t
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-soc-400 hover:text-soc-200 border border-transparent hover:border-soc-700'
              }`}
            >
              {t}
            </button>
          ))}
          <button onClick={fetchStats} className="p-1.5 text-soc-400 hover:text-soc-200 hover:bg-soc-700 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={<Activity className="w-5 h-5" />}
          color="blue"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Total Alerts"
          value={stats.totalAlerts}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="yellow"
          trend={{ value: 8, positive: false }}
        />
        <StatCard
          title="Critical Alerts"
          value={stats.criticalAlerts}
          icon={<Shield className="w-5 h-5" />}
          color="red"
          subtitle="Requires immediate action"
        />
        <StatCard
          title="Active Incidents"
          value={stats.activeIncidents}
          icon={<Siren className="w-5 h-5" />}
          color="purple"
          subtitle="Under investigation"
        />
        <StatCard
          title="Security Score"
          value={stats.securityScore}
          icon={<Gauge className="w-5 h-5" />}
          color={stats.securityScore > 70 ? 'emerald' : 'red'}
          subtitle="0-100 Scale"
          trend={{ value: stats.securityScore > 80 ? 5 : -3, positive: stats.securityScore > 80 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative bg-soc-800/80 backdrop-blur-sm border border-soc-700/60 rounded-2xl p-6 group hover:border-soc-600/80 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-soc-500/20 to-transparent" />
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-soc-200 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Top Attacked Assets
            </h3>
            <button className="text-soc-500 hover:text-soc-300 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {stats.topAssets.map((asset, i) => (
              <div key={asset.asset} className="flex items-center justify-between py-2 group/asset">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-medium text-soc-500 w-5 text-right">{String(i + 1).padStart(2, '0')}</span>
                  <Server className="w-4 h-4 text-soc-400 shrink-0" />
                  <span className="text-sm font-medium text-soc-200">{asset.asset}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-28 h-1.5 bg-soc-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : i === 2 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(asset.count / maxAssetCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-soc-400 w-8 text-right tabular-nums">{asset.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative bg-soc-800/80 backdrop-blur-sm border border-soc-700/60 rounded-2xl p-6 group hover:border-soc-600/80 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-soc-500/20 to-transparent" />
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-soc-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Alerts by Severity
            </h3>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={220}>
              <PieChart>
                <Pie
                  data={stats.alertsBySeverity}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%" cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {stats.alertsBySeverity.map((entry, idx) => (
                    <Cell key={idx} fill={SEVERITY_COLORS[entry.severity] || PIECOLORS[idx % PIECOLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {stats.alertsBySeverity.map((entry) => (
                <div key={entry.severity} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[entry.severity] }} />
                    <span className="text-xs text-soc-300 capitalize">{entry.severity.toLowerCase()}</span>
                  </div>
                  <span className="text-sm font-semibold text-soc-100 tabular-nums">{entry.count}</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-soc-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-soc-500">Total</span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {stats.alertsBySeverity.reduce((a, b) => a + b.count, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative bg-soc-800/80 backdrop-blur-sm border border-soc-700/60 rounded-2xl p-6 group hover:border-soc-600/80 transition-all duration-300 lg:col-span-1">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-soc-500/20 to-transparent" />
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-soc-200 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-emerald-400" />
              Top Event Types
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.topEventTypes} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: '#1f2937' }} tickLine={false} />
              <YAxis
                type="category"
                dataKey="eventType"
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={130}
                tickFormatter={(v) => v.replace(/_/g, ' ')}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16,185,129,0.05)' }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={20}>
                {stats.topEventTypes.map((_, idx) => (
                  <Cell key={idx} fill={idx === 0 ? '#10b981' : idx === 1 ? '#34d399' : idx === 2 ? '#6ee7b7' : '#a7f3d0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="relative bg-soc-800/80 backdrop-blur-sm border border-soc-700/60 rounded-2xl p-6 group hover:border-soc-600/80 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-soc-500/20 to-transparent" />
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-soc-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Recent Events
            </h3>
            <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              View all
            </button>
          </div>
          <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
            {stats.recentLogs.map((log, idx) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-soc-700/40 transition-colors group/event"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    log.severity === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]' :
                    log.severity === 'HIGH' ? 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)]' :
                    log.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <span className="text-xs font-medium text-soc-300 whitespace-nowrap">{log.eventType.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-soc-500">
                  <span className="font-mono hidden sm:inline">{log.sourceIp}</span>
                  <span className="tabular-nums">{new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
