import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell, Search, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-soc-800/80 backdrop-blur-md border-b border-soc-700/60 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soc-500" />
          <input
            type="text"
            placeholder="Search events, IPs, alerts..."
            className="w-full bg-soc-900/80 border border-soc-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-soc-200 placeholder-soc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all duration-200"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] text-soc-600">
            <kbd className="px-1.5 py-0.5 rounded bg-soc-700 border border-soc-600 font-mono">Ctrl</kbd>
            <span className="text-soc-600">+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-soc-700 border border-soc-600 font-mono">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm mr-3">
          <span className="text-soc-500 text-xs">Role:</span>
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
            user?.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
            user?.role === 'ANALYST' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          }`}>
            {user?.role}
          </span>
        </div>

        <button className="relative p-2 text-soc-400 hover:text-soc-200 hover:bg-soc-700/50 rounded-xl transition-all duration-200">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
        </button>

        <button className="p-2 text-soc-400 hover:text-soc-200 hover:bg-soc-700/50 rounded-xl transition-all duration-200 hidden sm:block">
          <Moon className="w-4.5 h-4.5" />
        </button>

        <div className="w-px h-6 bg-soc-700/60 mx-1" />

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 px-3 py-1.5 text-soc-300 hover:text-soc-100 hover:bg-soc-700/50 rounded-xl transition-all duration-200 group"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-emerald-600/20">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-medium text-soc-200 truncate max-w-[120px]">{user?.email}</p>
            <p className="text-[10px] text-soc-500">{user?.role}</p>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="p-2 text-soc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
          title="Logout"
        >
          <LogOut className="w-4.5 h-4.5 group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
    </header>
  );
}
