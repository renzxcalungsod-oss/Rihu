import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  Plus, 
  Edit, 
  Power, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  XCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Service } from '../types';

export const ServicesView: React.FC = () => {
  const { services, addService, updateService, toggleServiceActive, searchTerm } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState<Omit<Service, 'id' | 'service_code'>>({
    service_name: '',
    description: '',
    standard_price: 500,
    estimated_duration_hours: 2,
    is_active: true
  });

  const query = (localSearch || searchTerm).trim().toLowerCase();

  const filteredServices = useMemo(() => {
    return services.filter(s => 
      s.service_name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.service_code.toLowerCase().includes(query)
    );
  }, [services, query]);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      service_name: '',
      description: '',
      standard_price: 750,
      estimated_duration_hours: 2,
      is_active: true
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setFormData({
      service_name: srv.service_name,
      description: srv.description,
      standard_price: srv.standard_price,
      estimated_duration_hours: srv.estimated_duration_hours,
      is_active: srv.is_active
    });
    setIsAddEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service_name.trim()) {
      alert("Service name is required.");
      return;
    }

    if (editingService) {
      updateService(editingService.id, formData);
    } else {
      addService(formData);
    }
    setIsAddEditModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>Service Catalog ({services.length} Defined Services)</span>
          </h2>
          <p className="text-xs text-slate-500">Standardized labor rates, diagnosis durations, and active status toggles</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter services..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className={`bg-white rounded-xl border p-4 shadow-2xs transition-all flex flex-col justify-between ${
              srv.is_active ? 'border-slate-200 hover:border-blue-300' : 'border-slate-200 bg-slate-50/70 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {srv.service_code}
                </span>

                <button
                  onClick={() => toggleServiceActive(srv.id)}
                  title={srv.is_active ? "Deactivate Service" : "Activate Service"}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors ${
                    srv.is_active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                  }`}
                >
                  <Power className="w-2.5 h-2.5" />
                  <span>{srv.is_active ? 'Active' : 'Inactive'}</span>
                </button>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">{srv.service_name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{srv.description}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Rate</span>
                  <span className="font-bold text-slate-900 text-sm">₱{srv.standard_price.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Duration</span>
                  <span className="text-slate-600 font-medium flex items-center gap-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {srv.estimated_duration_hours}h
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleOpenEdit(srv)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit Service"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingService ? `Edit Service (${editingService.service_code})` : 'Create New Repair Service'}
              </h3>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liquid Metal Repasting & Delid"
                  value={formData.service_name}
                  onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Procedures, tools, and benchmarks included..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard Rate (₱) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="50"
                    value={formData.standard_price}
                    onChange={(e) => setFormData({ ...formData, standard_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Hours) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.5"
                    value={formData.estimated_duration_hours}
                    onChange={(e) => setFormData({ ...formData, estimated_duration_hours: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="isActiveToggle" className="font-semibold text-slate-700">
                  Service is active and available for repair jobs
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
