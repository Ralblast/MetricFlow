export default function Footer({ mode }) {
  return (
    <footer className="mt-12 pt-6 border-t border-[#1f2937] text-center">
      <p className="text-[#6b7280] text-xs">
        {mode === 'real-api' 
          ? 'Monitoring active • Updates every 30s'
          : 'Demo mode • Simulated data'}
      </p>
    </footer>
  );
}
