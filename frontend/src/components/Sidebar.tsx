import { NavLink, useLocation } from 'react-router-dom';
import {
  Shield, LayoutDashboard, ScrollText, Bell, Siren,
  Radar, BarChart3, Users, Settings, ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/logs', icon: ScrollText, label: 'Log Explorer' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/incidents', icon: Siren, label: 'Incidents' },
  { to: '/threat-intel', icon: Radar, label: 'Threat Intel' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/users', icon: Users, label: 'Users', adminOnly: true },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-64 bg-soc-800/90 backdrop-blur-sm border-r border-soc-700/60 flex flex-col shrink-0">
      <div className="relative p-5 border-b border-soc-700/60">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-emerald-500/20 rounded-xl blur-sm" />
            <div className="relative p-2 bg-soc-900 rounded-xl border border-emerald-500/30">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">SOCVision</h1>
            <p className="text-[10px] text-soc-500 font-medium uppercase tracking-wider">Security Operations Center</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-soc-500 uppercase tracking-widest px-3 pb-2 pt-1">Main Menu</p>
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'ADMIN') return null;
          const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-soc-400 hover:text-soc-200 hover:bg-soc-700/50 border border-transparent'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}
              <item.icon className={`w-4.5 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-400/50" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="relative p-4 border-t border-soc-700/60">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-soc-800">A</div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-soc-800">S</div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-soc-300 truncate">{user?.email}</p>
            <p className="text-[10px] text-soc-500 uppercase tracking-wider">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
