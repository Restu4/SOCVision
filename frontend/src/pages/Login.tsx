import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Activity, Server, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-soc-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMTE4MjciIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzR2LTRoNHY0aC00em0wIDB2LTRoLTR2NGg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Shield className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">SOCVision</h1>
                <p className="text-emerald-400/80 text-sm font-medium">Security Operations Center</p>
              </div>
            </div>
            <p className="text-soc-300 leading-relaxed">
              Enterprise-grade security monitoring platform for real-time threat detection,
              incident response, and security analytics.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                { icon: Activity, label: 'Real-time Monitoring', value: '145K Events' },
                { icon: AlertTriangle, label: 'Threat Detection', value: '1.2K Alerts' },
                { icon: Server, label: 'Asset Coverage', value: '7 Assets' },
                { icon: Lock, label: 'Security Score', value: '92/100' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-soc-800/50 border border-soc-700/50">
                  <item.icon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-soc-400 truncate">{item.label}</p>
                    <p className="text-sm font-semibold text-soc-100">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-6 right-6 flex items-center gap-2 text-xs text-soc-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Online
        </div>

        <div className="w-full max-w-sm">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SOCVision</h1>
                <p className="text-emerald-400/80 text-xs font-medium">Security Operations Center</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-emerald-600/20 rounded-2xl blur" />
            <div className="relative bg-soc-800/90 backdrop-blur-xl rounded-2xl border border-soc-700/80 p-8 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Welcome back</h2>
                <p className="text-sm text-soc-400 mt-1">Sign in to access the dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-soc-300 mb-1.5">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-soc-900/80 border border-soc-600/60 rounded-xl px-4 py-2.5 pl-10 text-soc-100 placeholder-soc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-soc-300 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-soc-900/80 border border-soc-600/60 rounded-xl px-4 py-2.5 pl-10 pr-10 text-soc-100 placeholder-soc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-soc-500 hover:text-soc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-soc-400 cursor-pointer">
                    <input type="checkbox" className="rounded border-soc-600 bg-soc-700 text-emerald-500 focus:ring-emerald-500/50" />
                    Remember me
                  </label>
                  <button type="button" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-soc-700/60">
                <p className="text-xs font-medium text-soc-500 mb-2 text-center">Demo Credentials</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: 'Admin', email: 'admin@socvision.com', pass: 'admin123' },
                    { role: 'Analyst', email: 'analyst1@socvision.com', pass: 'analyst123' },
                    { role: 'Viewer', email: 'viewer@socvision.com', pass: 'viewer123' },
                  ].map((demo) => (
                    <button
                      key={demo.role}
                      type="button"
                      onClick={() => { setEmail(demo.email); setPassword(demo.pass); }}
                      className="text-left p-2 rounded-lg bg-soc-900/50 border border-soc-700/50 hover:border-emerald-500/30 hover:bg-soc-900/80 transition-all duration-200 group"
                    >
                      <p className="text-xs font-medium text-soc-300 group-hover:text-emerald-400 transition-colors">{demo.role}</p>
                      <p className="text-[10px] text-soc-500 truncate mt-0.5">{demo.email}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-soc-600 mt-6">
            &copy; {new Date().getFullYear()} SOCVision. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
