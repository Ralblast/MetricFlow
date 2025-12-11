import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { metricsAPI, alertsAPI } from '../services/api';
import StatsCard from '../components/StatsCard';
import MetricChart from '../components/MetricChart';
import AlertLog from '../components/AlertLog';
import OrgSelector from '../components/OrgSelector';
import InfoBanner from '../components/InfoBanner';
import Footer from '../components/Footer';
import ApiMonitor from '../components/ApiMonitor';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [metrics, setMetrics] = useState([]);
  const [latestMetrics, setLatestMetrics] = useState({ cpu: 0, memory: 0, latency: 0 });
  const [alerts, setAlerts] = useState([]);
  const [alertStats, setAlertStats] = useState({ total: 0, critical: 0, warning: 0 });
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('demo');
  const [selectedApi, setSelectedApi] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false);


  const fetchData = async () => {
    try {
      const [metricsRes, latestRes, alertsRes, alertStatsRes] = await Promise.all([
        metricsAPI.getMetrics(1),
        metricsAPI.getLatest(),
        alertsAPI.getAlerts(20),
        alertsAPI.getStats(24),
      ]);

      setMetrics(metricsRes.data.metrics);
      setLatestMetrics(latestRes.data);
      setAlerts(alertsRes.data.alerts);
      setAlertStats(alertStatsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Detect first-time user (separate useEffect)
  useEffect(() => {
    if (metrics.length > 0 && !loading) {
      const oldestMetric = metrics[metrics.length - 1];
      const metricAge = Date.now() - new Date(oldestMetric.timestamp).getTime();
      // If metrics are less than 5 minutes old, likely first login
      if (metricAge < 5 * 60 * 1000) {
        setIsFirstTime(true);
        // Auto-hide after 12 seconds
        setTimeout(() => setIsFirstTime(false), 12000);
      }
    }
  }, [metrics.length, loading]);


  const handleSelectApi = (api) => {
    setSelectedApi(api);
    setMode(api ? 'real-api' : 'demo');
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === 'demo') setSelectedApi(null);
  };

 const getFilteredMetrics = () => {

  // Demo mode or nothing selected: show everything
  if (mode === 'demo' || !selectedApi) {
    return metrics;
  }

  // Real API mode: only metrics for this endpoint
  const realApiMetrics = metrics.filter((m) => {
    if (!m.metadata) return false;
    
    const sourceMatch = m.metadata.source === 'user-api';
    const urlMatch = m.metadata.url === selectedApi.url;
    
    return sourceMatch && urlMatch;
  });

  return realApiMetrics;
 };

  const getFilteredLatestMetrics = () => {
    if (mode === 'demo' || !selectedApi) return latestMetrics;
    
    const filteredMetrics = metrics.filter(m => 
      m.metadata?.source === 'user-api' && 
      m.metadata?.url === selectedApi.url
    );

    const latestLatency = filteredMetrics
      .filter(m => m.type === 'Latency')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    return {
      cpu: 0,
      memory: 0,
      latency: latestLatency?.value || 0
    };
  };

  const filteredMetrics = getFilteredMetrics();
  const displayLatestMetrics = getFilteredLatestMetrics();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e17]">
        <div className="w-8 h-8 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <nav className="border-b border-[#1f2937] bg-[#0f1419]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-white font-semibold">MetricFlow</span>
            <OrgSelector />
            {mode === 'real-api' && selectedApi && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-white text-sm">{selectedApi.name}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#6b7280] text-sm">{user?.email}</span>
            <button
              onClick={logout}
              className="text-[#6b7280] hover:text-white text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
      <InfoBanner 
        mode={mode} 
        selectedApi={selectedApi}
        onModeChange={handleModeChange}
      />

        {/* Welcome Banner for first-time users */}
        {isFirstTime && mode === 'demo' && (
          <div className="mb-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Welcome to MetricFlow! 🎉</h3>
                <p className="text-white/90 text-sm mb-3">
                  Your dashboard is showing demo system metrics. Ready to monitor your own APIs?
                </p>
                <button
                  onClick={() => {
                    setMode('real-api');
                    setIsFirstTime(false);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-orange-600 font-medium rounded-lg text-sm hover:bg-orange-50 transition"
                >
                  Add Your First API Endpoint
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => setIsFirstTime(false)}
                className="flex-shrink-0 text-white/70 hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {mode === 'demo' ? (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatsCard title="CPU" value={displayLatestMetrics.cpu} unit="%" />
              <StatsCard title="Memory" value={displayLatestMetrics.memory} unit="%" />
              <StatsCard title="Latency" value={displayLatestMetrics.latency} unit="ms" />
              <StatsCard title="Alerts" value={alertStats.total} unit={`${alertStats.critical} critical`} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <MetricChart data={filteredMetrics} metricType="CPU" />
              <MetricChart data={filteredMetrics} metricType="Memory" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <MetricChart data={filteredMetrics} metricType="Latency" />
              <AlertLog alerts={alerts} />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatsCard title="Latency" value={displayLatestMetrics.latency} unit="ms" />
              <StatsCard title="Status" value={selectedApi?.isActive ? 'Active' : 'Paused'} />
              <StatsCard title="Method" value={selectedApi?.method} />
              <StatsCard title="Data points" value={filteredMetrics.length} />
            </div>

            <div className="mb-6">
              <MetricChart data={filteredMetrics} metricType="Latency" />
            </div>
          </>
        )}

        <ApiMonitor 
          onSelectApi={handleSelectApi}
          selectedApi={selectedApi}
        />

        <Footer mode={mode} />
      </main>
    </div>
  );
}
