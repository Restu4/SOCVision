import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Shield } from 'lucide-react';
import { usersApi } from '../services/api';
import type { User } from '../types';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ fullname: '', email: '', password: '', role: 'ANALYST' as string });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await usersApi.getAll();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await usersApi.update(editing.id, form);
      } else {
        await usersApi.create(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ fullname: '', email: '', password: '', role: 'ANALYST' });
      fetchUsers();
    } catch (err) {
      console.error('Failed to save user', err);
    }
  };

  const handleEdit = (user: User) => {
    setEditing(user);
    setForm({ fullname: user.fullname, email: user.email, password: '', role: user.role });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    await usersApi.remove(id);
    fetchUsers();
  };

  const getRoleBadge = (role: string) => {
    const cls = role === 'ADMIN' ? 'badge-critical' : role === 'ANALYST' ? 'badge-high' : 'badge-medium';
    return <span className={cls}>{role}</span>;
  };

  if (loading) return <div className="text-center py-8 text-soc-400">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-soc-400 text-sm mt-1">Manage system users and roles</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ fullname: '', email: '', password: '', role: 'ANALYST' }); setShowForm(true); }} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-soc-700">
              <th className="text-left py-3 px-3 text-soc-400 font-medium">Name</th>
              <th className="text-left py-3 px-3 text-soc-400 font-medium">Email</th>
              <th className="text-left py-3 px-3 text-soc-400 font-medium">Role</th>
              <th className="text-left py-3 px-3 text-soc-400 font-medium">Created</th>
              <th className="text-right py-3 px-3 text-soc-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-soc-700/50 hover:bg-soc-700/30">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-soc-400" />
                    <span>{u.fullname}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-soc-300">{u.email}</td>
                <td className="py-3 px-3">{getRoleBadge(u.role)}</td>
                <td className="py-3 px-3 text-soc-400 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                <td className="py-3 px-3 text-right">
                  <button onClick={() => handleEdit(u)} className="p-1.5 text-soc-400 hover:text-soc-100 hover:bg-soc-700 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="p-1.5 text-soc-400 hover:text-red-400 hover:bg-soc-700 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-soc-800 border border-soc-700 rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-soc-400 mb-1">Full Name</label>
                <input type="text" value={form.fullname} onChange={e => setForm(f => ({ ...f, fullname: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs text-soc-400 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs text-soc-400 mb-1">Password {editing && '(leave blank to keep)'}</label>
                <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="input-field" required={!editing} />
              </div>
              <div>
                <label className="block text-xs text-soc-400 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="select-field">
                  <option value="ADMIN">Admin</option>
                  <option value="ANALYST">Analyst</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary flex-1 text-sm">{editing ? 'Update' : 'Create'} User</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
