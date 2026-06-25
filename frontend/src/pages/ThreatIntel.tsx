import { useState, useEffect } from 'react';
import { Plus, Trash2, Shield } from 'lucide-react';
import { threatIntelApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { ThreatIntel } from '../types';

export default function ThreatIntel() {
  const [data, setData] = useState<ThreatIntel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ipAddress: '', threatType: '', confidenceScore: 50 });
  const { user } = useAuth();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await threatIntelApi.getAll();
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch threat intel', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await threatIntelApi.create(form);
      setShowForm(false);
      setForm({ ipAddress: '', threatType: '', confidenceScore: 50 });
      fetchData();
    } catch (err) {
      console.error('Failed to create', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this threat intelligence entry?')) return;
    await threatIntelApi.remove(id);
    fetchData();
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-red-400';
    if (score >= 75) return 'text-orange-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-blue-400';
  };

  if (loading) return <div className="text-center py-8 text-soc-400">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Threat Intelligence</h1>
          <p className="text-soc-400 text-sm mt-1">Known malicious IPs and threat indicators</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-soc-700">
              <th className="text-left py-3 px-3 text-soc-400 font-medium">IP Address</th>
              <th className="text-left py-3 px-3 text-soc-400 font-medium">Threat Type</th>
              <th className="text-left py-3 px-3 text-soc-400 font-medium">Confidence Score</th>
              {user?.role === 'ADMIN' && <th className="text-right py-3 px-3 text-soc-400 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={user?.role === 'ADMIN' ? 4 : 3} className="text-center py-8 text-soc-400">No threat data</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-soc-700/50 hover:bg-soc-700/30">
                  <td className="py-3 px-3">
                    <span className="font-mono text-soc-200">{item.ipAddress}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-red-400" />
                      <span>{item.threatType}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-soc-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.confidenceScore >= 90 ? 'bg-red-500' : item.confidenceScore >= 75 ? 'bg-orange-500' : item.confidenceScore >= 60 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                          style={{ width: `${item.confidenceScore}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${getConfidenceColor(item.confidenceScore)}`}>
                        {item.confidenceScore}%
                      </span>
                    </div>
                  </td>
                  {user?.role === 'ADMIN' && (
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-soc-400 hover:text-red-400 hover:bg-soc-700 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-soc-800 border border-soc-700 rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Add Threat Intelligence</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs text-soc-400 mb-1">IP Address</label>
                <input type="text" value={form.ipAddress} onChange={e => setForm(f => ({ ...f, ipAddress: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs text-soc-400 mb-1">Threat Type</label>
                <select value={form.threatType} onChange={e => setForm(f => ({ ...f, threatType: e.target.value }))} className="select-field" required>
                  <option value="">Select type</option>
                  <option value="Botnet">Botnet</option>
                  <option value="Malware C2">Malware C2</option>
                  <option value="Phishing">Phishing</option>
                  <option value="Port Scanner">Port Scanner</option>
                  <option value="Brute Force">Brute Force</option>
                  <option value="DDoS">DDoS</option>
                  <option value="Data Exfil">Data Exfil</option>
                  <option value="Malware">Malware</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-soc-400 mb-1">Confidence Score (0-100)</label>
                <input type="range" min="0" max="100" value={form.confidenceScore} onChange={e => setForm(f => ({ ...f, confidenceScore: +e.target.value }))} className="w-full" />
                <span className="text-xs text-soc-400">{form.confidenceScore}%</span>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary flex-1 text-sm">Add Entry</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
