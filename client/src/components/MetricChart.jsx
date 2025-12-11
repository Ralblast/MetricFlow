import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MetricChart({ data, metricType }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getLineColor = (type) => {
    switch (type) {
      case 'CPU': return '#3b82f6';
      case 'Memory': return '#10b981';
      case 'Latency': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const chartData = data
    .filter(item => item.type === metricType)
    .map(item => ({
      timestamp: item.timestamp,
      value: item.value,
    }))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="bg-[#12161f] p-5 rounded">
      <div className="text-white text-sm mb-4 font-medium">{metricType}</div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            stroke="#6b7280"
            style={{ fontSize: '11px' }}
            tickLine={false}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '11px' }}
            domain={[0, metricType === 'Latency' ? 'auto' : 100]}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f1419',
              border: '1px solid #1f2937',
              borderRadius: '4px',
            }}
            labelStyle={{ color: '#9ca3af', fontSize: '11px' }}
            itemStyle={{ color: '#fff', fontSize: '12px' }}
            labelFormatter={(value) => new Date(value).toLocaleString()}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={getLineColor(metricType)}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
