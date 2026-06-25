import { useState, useEffect } from 'react';
import { rulesApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { DetectionRule } from '../types';
import { Pencil, Shield } from 'lucide-react';

export default function Settings() {
  const [rules, setRules] = useState<DetectionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => { fetchRules(); }, []);

  const fetchRules = async () => {
    try {
      const res = await rulesApi.getAll();
      setRules(res.data);
    } catch (err) {
      console.error('Failed to fetch rules', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (rule: DetectionRule) => {
    try {
      await rulesApi.update(rule.id, { enabled: !rule.enabled });
      fetchRules();
    } catch (err) {
      console.error('Failed to update rule', err);
    }
  };

  const getSeverityBadge = (s: string) => {
    const cls = s === 'CRITICAL' ? 'badge-critical' : s === 'HIGH' ? 'badge-high' : s === 'MEDIUM' ? 'badge-medium' : 'badge-low';
    return <span className={cls}>{s}</span>;
  };

  if (loading) return <div className="text-center py-8 text-soc-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-soc-400 text-sm mt-1">Detection rules and system configuration</p>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-soc-200 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Detection Rules
        </h3>
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between py-3 border-b border-soc-700 last:border-0">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-soc-200">{rule.name}</h4>
                  {getSeverityBadge(rule.severity)}
                </div>
                <p className="text-xs text-soc-400 mt-1">{rule.condition}</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => toggleRule(rule)}
                    disabled={user?.role !== 'ADMIN'}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-soc-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                </label>
                {user?.role === 'ADMIN' && (
                  <button className="p-1.5 text-soc-400 hover:text-soc-100 hover:bg-soc-700 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-soc-200 mb-4">System Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-soc-700">
            <span className="text-soc-400">Version</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-soc-700">
            <span className="text-soc-400">Detection Rules Active</span>
            <span>{rules.filter(r => r.enabled).length} / {rules.length}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-soc-400">Database</span>
            <span>PostgreSQL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
