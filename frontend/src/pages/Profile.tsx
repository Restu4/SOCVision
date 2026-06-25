import { useState } from 'react';
import { Shield, Mail, Calendar, Medal } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-red-400 bg-red-900/30 border-red-800';
      case 'ANALYST': return 'text-orange-400 bg-orange-900/30 border-orange-800';
      case 'VIEWER': return 'text-blue-400 bg-blue-900/30 border-blue-800';
      default: return 'text-soc-400 bg-soc-700 border-soc-600';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-soc-400 text-sm mt-1">Your account information</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-emerald-600/20 rounded-full border border-emerald-600/30">
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.email}</h2>
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs mt-1 border ${getRoleColor(user?.role || '')}`}>
              <Medal className="w-3 h-3" />
              {user?.role}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 py-3 border-b border-soc-700">
            <Mail className="w-5 h-5 text-soc-400" />
            <div>
              <p className="text-xs text-soc-400">Email</p>
              <p className="text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3 border-b border-soc-700">
            <Medal className="w-5 h-5 text-soc-400" />
            <div>
              <p className="text-xs text-soc-400">Role</p>
              <p className="text-sm">{user?.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Calendar className="w-5 h-5 text-soc-400" />
            <div>
              <p className="text-xs text-soc-400">User ID</p>
              <p className="text-sm">#{user?.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
