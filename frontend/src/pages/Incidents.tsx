import { useState, useEffect } from 'react';
import { incidentsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { Incident } from '../types';
import { Clock, CheckCircle, Play } from 'lucide-react';

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => { fetchIncidents(); }, []);

  const fetchIncidents = async () => {
    try {
      const res = await incidentsApi.getAll();
      setIncidents(res.data);
    } catch (err) {
      console.error('Failed to fetch incidents', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, status: string) => {
    await incidentsApi.update(id, { status });
    fetchIncidents();
  };

  const getSeverityBadge = (s: string) => {
    const cls = s === 'CRITICAL' ? 'badge-critical' : s === 'HIGH' ? 'badge-high' : s === 'MEDIUM' ? 'badge-medium' : 'badge-low';
    return <span className={cls}>{s}</span>;
  };

  const getStatusBadge = (s: string) => {
    const cls = s === 'OPEN' ? 'badge-open' : s === 'INVESTIGATING' ? 'badge-investigating' : 'badge-resolved';
    return <span className={cls}>{s}</span>;
  };

  if (loading) return <div className="text-center py-8 text-soc-400">Loading...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Incidents</h1>
        <p className="text-soc-400 text-sm mt-1">Security incidents timeline and management</p>
      </div>

      <div className="space-y-3">
        {incidents.length === 0 ? (
          <div className="text-center py-8 text-soc-400">No incidents found</div>
        ) : (
          incidents.map((incident) => (
            <div key={incident.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getSeverityBadge(incident.severity)}
                    {getStatusBadge(incident.status)}
                  </div>
                  <h3 className="font-medium text-soc-100">{incident.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-soc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Opened: {new Date(incident.openedAt).toLocaleString()}
                    </span>
                    {incident.closedAt && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Closed: {new Date(incident.closedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {(user?.role === 'ADMIN' || user?.role === 'ANALYST') && incident.status === 'OPEN' && (
                    <button
                      onClick={() => handleUpdate(incident.id, 'INVESTIGATING')}
                      className="btn-primary text-sm flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" /> Investigate
                    </button>
                  )}
                  {incident.status === 'INVESTIGATING' && (
                    <button
                      onClick={() => handleUpdate(incident.id, 'RESOLVED')}
                      className="btn-primary text-sm flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" /> Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
