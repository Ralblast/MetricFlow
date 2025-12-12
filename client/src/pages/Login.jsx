import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = isRegister
        ? { email, password, orgName }
        : { email, password };
      
      const response = isRegister
        ? await authAPI.register(data)
        : await authAPI.login(data);

      login(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Real-time API Monitoring",
      description: "Track latency, uptime, and performance of up to 5 endpoints with 30-second intervals"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Performance Analytics",
      description: "Visualize CPU, memory, and latency trends with interactive charts and historical data"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: "Intelligent Alerts",
      description: "Automatic anomaly detection with instant notifications when metrics exceed thresholds"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Multi-Organization Support",
      description: "Manage separate monitoring dashboards for different teams or projects in one account"
    }
  ];

  return (
    <div className="min-h-screen flex">
      
      <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-12 py-16 flex-col justify-between">
        <div>
         
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-2xl font-semibold text-white">MetricFlow</span>
          </div>

         
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              Monitor your APIs<br />with confidence
            </h2>
            <p className="text-gray-400 text-base">
              Real-time metrics pipeline for modern teams
            </p>
          </div>

        
          <div className="space-y-5">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-orange-500">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm mb-0.5">{feature.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-700">
          <div>
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-gray-400 text-xs">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">&lt;30s</div>
            <div className="text-gray-400 text-xs">Check Interval</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">7 Days</div>
            <div className="text-gray-400 text-xs">Data Retention</div>
          </div>
        </div>
      </div>

     
      <div className="w-full lg:w-[60%] flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">MetricFlow</h1>
            <p className="text-sm text-gray-500">Real-time Metrics Pipeline</p>
          </div>

        
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-medium text-gray-900 mb-6">
              {isRegister ? 'Create your account' : 'Sign in'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Organization name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Acme Inc"
                    required={isRegister}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isRegister ? 'Create account' : 'Sign in')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="text-sm text-gray-600 hover:text-orange-500 transition"
              >
                {isRegister 
                  ? 'Already have an account? Sign in' 
                  : 'Don\'t have an account? Create one'}
              </button>
            </div>
          </div>

         
          <p className="text-center text-gray-500 text-xs mt-6">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
