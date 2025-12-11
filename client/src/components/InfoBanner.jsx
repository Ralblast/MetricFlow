export default function InfoBanner({ mode, selectedApi, onModeChange }) {
  if (mode === 'real-api' && selectedApi) {
    return (
      <div className="mb-6 flex items-center justify-between p-4 bg-[#12161f] rounded">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div>
            <div className="text-white text-sm font-medium">{selectedApi.name}</div>
            <div className="text-[#6b7280] text-xs font-mono">{selectedApi.url}</div>
          </div>
        </div>
        <button
          onClick={() => onModeChange('demo')}
          className="text-[#6b7280] hover:text-white text-sm transition"
        >
          Switch to demo
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-[#12161f] rounded border-l-2 border-[#3b82f6]">
      <div className="text-white text-sm mb-1">Demo mode</div>
      <div className="text-[#6b7280] text-xs">
        Simulated data for demonstration. Add an API endpoint below to monitor real services.
      </div>
    </div>
  );
}
