export default function AlertLog({ alerts }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-[#12161f] p-5 rounded">
      <div className="text-white text-sm mb-4 font-medium">Alerts</div>
      
      {alerts.length === 0 ? (
        <div className="py-12 text-center text-[#6b7280] text-sm">
          No alerts
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className="p-3 bg-[#0f1419] rounded border-l-2 border-red-500"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-white text-xs font-medium">{alert.type} anomaly</span>
                <span className="text-[#6b7280] text-xs">{formatTimestamp(alert.timestamp)}</span>
              </div>
              <div className="text-[#9ca3af] text-xs font-mono">
                {alert.value.toFixed(1)} / {alert.threshold.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
