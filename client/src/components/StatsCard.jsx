export default function StatsCard({ title, value, unit }) {
  return (
    <div className="bg-[#12161f] p-5 rounded">
      <div className="text-[#6b7280] text-xs mb-3">{title}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-white text-2xl font-mono font-medium">
          {typeof value === 'number' && value > 0 ? value.toFixed(1) : value || '0'}
        </span>
        {unit && <span className="text-[#6b7280] text-sm">{unit}</span>}
      </div>
    </div>
  );
}
