import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  subtitle?: string;
  trend?: { value: number; positive: boolean };
}

const colorConfig: Record<string, { glow: string; from: string; via: string; icon: string; bar: string }> = {
  emerald: {
    glow: 'shadow-emerald-600/10',
    from: 'from-emerald-600/10',
    via: 'via-emerald-600/5',
    icon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    bar: 'bg-emerald-500',
  },
  red: {
    glow: 'shadow-red-600/10',
    from: 'from-red-600/10',
    via: 'via-red-600/5',
    icon: 'bg-red-500/10 text-red-400 border-red-500/20',
    bar: 'bg-red-500',
  },
  yellow: {
    glow: 'shadow-yellow-600/10',
    from: 'from-yellow-600/10',
    via: 'via-yellow-600/5',
    icon: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    bar: 'bg-yellow-500',
  },
  blue: {
    glow: 'shadow-blue-600/10',
    from: 'from-blue-600/10',
    via: 'via-blue-600/5',
    icon: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    bar: 'bg-blue-500',
  },
  purple: {
    glow: 'shadow-purple-600/10',
    from: 'from-purple-600/10',
    via: 'via-purple-600/5',
    icon: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    bar: 'bg-purple-500',
  },
};

export default function StatCard({ title, value, icon, color = 'emerald', subtitle, trend }: StatCardProps) {
  const c = colorConfig[color] || colorConfig.emerald;

  return (
    <div className={`relative group bg-soc-800/80 backdrop-blur-sm border border-soc-700/60 rounded-2xl p-5 transition-all duration-300 hover:border-soc-600/80 hover:bg-soc-800/90 shadow-lg ${c.glow}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${c.from} ${c.via} to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative flex items-start gap-4">
        <div className={`p-3 rounded-xl border ${c.icon} shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-soc-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-white mt-1 tabular-nums">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {subtitle && <p className="text-xs text-soc-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-soc-500">vs last week</span>
            </div>
          )}
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${c.bar} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-40`} />
    </div>
  );
}
