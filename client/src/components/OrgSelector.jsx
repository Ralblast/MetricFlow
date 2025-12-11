import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function OrgSelector() {
  const { user } = useContext(AuthContext);

  return (
    <div className="px-3 py-2 bg-[#1e293b] border border-[#334155] rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-[#64748b] text-xs uppercase tracking-wider">Organization</span>
        <span className="text-white font-medium text-sm">{user?.orgName || 'N/A'}</span>
      </div>
    </div>
  );
}
