import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { logsApi } from '../services/api';
import type { Log, PaginatedResponse } from '../types';

const EVENT_TYPES = [
  'LOGIN_SUCCESS', 'LOGIN_FAILED', 'PASSWORD_RESET', 'ROLE_CHANGE',
  'ACCESS_DENIED', 'VPN_CONNECT', 'VPN_DISCONNECT', 'FILE_DOWNLOAD', 'EMAIL_SENT', 'CONFIG_CHANGE',
];

export default function LogExplorer() {
  const [data, setData] = useState<PaginatedResponse<Log> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    severity: '',
    eventType: '',
    username: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 25 };
      if (search) params.search = search;
      if (filters.severity) params.severity = filters.severity;
      if (filters.eventType) params.eventType = filters.eventType;
      if (filters.username) params.username = filters.username;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const res = await logsApi.getAll(params);
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, filters]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const getSeverityBadge = (severity: string) => {
    const cls = severity === 'CRITICAL' ? 'badge-critical' :
      severity === 'HIGH' ? 'badge-high' :
      severity === 'MEDIUM' ? 'badge-medium' : 'badge-low';
    return <span className={cls}>{severity}</span>;
  };

  const getStatusBadge = (status: string) => {
    const cls = status === 'MALICIOUS' ? 'badge-critical' :
      status === 'SUSPICIOUS' ? 'badge-high' : 'badge-low';
    return <span className={cls}>{status}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Log Explorer</h1>
          <p className="text-soc-400 text-sm mt-1">View and search all security events</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soc-400" />
          <input
            type="text"
            placeholder="Search IP, username, or event..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 text-sm ${showFilters ? 'bg-emerald-600/20 text-emerald-400' : ''}`}
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="card grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-soc-400 mb-1">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => { setFilters(f => ({ ...f, severity: e.target.value })); setPage(1); }}
              className="select-field text-sm"
            >
              <option value="">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-soc-400 mb-1">Event Type</label>
            <select
              value={filters.eventType}
              onChange={(e) => { setFilters(f => ({ ...f, eventType: e.target.value })); setPage(1); }}
              className="select-field text-sm"
            >
              <option value="">All Types</option>
              {EVENT_TYPES.map(et => <option key={et} value={et}>{et}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-soc-400 mb-1">Username</label>
            <input
              type="text"
              value={filters.username}
              onChange={(e) => { setFilters(f => ({ ...f, username: e.target.value })); setPage(1); }}
              className="input-field text-sm"
              placeholder="Filter by username"
            />
          </div>
          <div>
            <label className="block text-xs text-soc-400 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => { setFilters(f => ({ ...f, startDate: e.target.value })); setPage(1); }}
              className="input-field text-sm"
            />
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-soc-700">
              <th className="text-left py-3 px-2 text-soc-400 font-medium">Timestamp</th>
              <th className="text-left py-3 px-2 text-soc-400 font-medium">Source IP</th>
              <th className="text-left py-3 px-2 text-soc-400 font-medium">Destination</th>
              <th className="text-left py-3 px-2 text-soc-400 font-medium">Username</th>
              <th className="text-left py-3 px-2 text-soc-400 font-medium">Event Type</th>
              <th className="text-left py-3 px-2 text-soc-400 font-medium">Severity</th>
              <th className="text-left py-3 px-2 text-soc-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-soc-400">Loading...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-soc-400">No logs found</td></tr>
            ) : (
              data?.data.map((log) => (
                <tr key={log.id} className="border-b border-soc-700/50 hover:bg-soc-700/30">
                  <td className="py-3 px-2 text-soc-300 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-mono text-xs text-soc-200">{log.sourceIp}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-mono text-xs text-soc-200">{log.destinationIp}</span>
                  </td>
                  <td className="py-3 px-2 text-soc-300">{log.username}</td>
                  <td className="py-3 px-2">
                    <span className="text-xs text-soc-200">{log.eventType.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="py-3 px-2">{getSeverityBadge(log.severity)}</td>
                  <td className="py-3 px-2">{getStatusBadge(log.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-soc-400">
            Showing {((page - 1) * data.limit) + 1} - {Math.min(page * data.limit, data.total)} of {data.total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
