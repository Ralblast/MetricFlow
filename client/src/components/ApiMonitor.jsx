import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ApiMonitor({ onSelectApi, selectedApi }) {
  const [endpoints, setEndpoints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', url: '', method: 'GET' });
  const MAX_APIS = 5;

  const fetchEndpoints = async () => {
    try {
      const response = await api.get('/endpoints');
      setEndpoints(response.data.endpoints || []);
    } catch (error) {
      console.error('Error fetching endpoints:', error);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (endpoints.length >= MAX_APIS) {
      alert(`Maximum ${MAX_APIS} endpoints allowed`);
      return;
    }

    try {
      await api.post('/endpoints', formData);
      setFormData({ name: '', url: '', method: 'GET' });
      setShowForm(false);
      fetchEndpoints();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add endpoint');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this endpoint?')) return;
    try {
      await api.delete(`/endpoints/${id}`);
      if (selectedApi?._id === id) {
        onSelectApi(null);
      }
      fetchEndpoints();
    } catch (error) {
      alert('Failed to delete endpoint');
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/endpoints/${id}/toggle`);
      fetchEndpoints();
    } catch (error) {
      alert('Failed to toggle endpoint');
    }
  };

  return (
    <div className="bg-[#12161f] rounded mt-8">
      <div className="p-5 flex items-center justify-between border-b border-[#1f2937]">
        <div>
          <div className="text-white text-sm font-medium mb-1">API Endpoints</div>
          <div className="text-[#6b7280] text-xs">
            {endpoints.length} of {MAX_APIS} configured
          </div>
        </div>
        {endpoints.length < MAX_APIS && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-[#3b82f6] hover:text-white text-sm transition"
          >
            {showForm ? 'Cancel' : 'Add endpoint'}
          </button>
        )}
      </div>

      <div className="p-5">
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4 p-4 bg-[#0f1419] rounded space-y-3">
            <input
              type="text"
              placeholder="API name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#12161f] border border-[#1f2937] rounded text-white text-sm focus:outline-none focus:border-[#3b82f6]"
              required
            />
            <input
              type="url"
              placeholder="https://api.example.com/health"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 bg-[#12161f] border border-[#1f2937] rounded text-white text-sm font-mono focus:outline-none focus:border-[#3b82f6]"
              required
            />
            <select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="w-full px-3 py-2 bg-[#12161f] border border-[#1f2937] rounded text-white text-sm focus:outline-none focus:border-[#3b82f6]"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm rounded transition"
            >
              Add endpoint
            </button>
          </form>
        )}

        {endpoints.length === 0 ? (
          <div className="py-10 text-center text-[#6b7280] text-sm">
            No endpoints configured
          </div>
        ) : (
          <div className="space-y-2">
            {endpoints.map((endpoint) => {
              const isSelected = selectedApi?._id === endpoint._id;
              return (
                <div
                  key={endpoint._id}
                  onClick={() => onSelectApi(isSelected ? null : endpoint)}
                  className={`p-3 rounded cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#1f2937] border border-[#3b82f6]'
                      : 'bg-[#0f1419] border border-transparent hover:border-[#1f2937]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            endpoint.isActive ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        />
                        <span className="text-white text-sm font-medium">
                          {endpoint.name}
                        </span>
                        {isSelected && (
                          <span className="text-[#3b82f6] text-xs">viewing</span>
                        )}
                      </div>
                      <div className="text-[#6b7280] text-xs font-mono mb-1">
                        {endpoint.url}
                      </div>
                      <div className="text-[#6b7280] text-xs">{endpoint.method}</div>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(endpoint._id);
                        }}
                        className="text-[#6b7280] hover:text-white text-xs transition"
                      >
                        {endpoint.isActive ? 'Pause' : 'Resume'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(endpoint._id);
                        }}
                        className="text-red-500 hover:text-red-400 text-xs transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
