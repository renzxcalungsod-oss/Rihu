import React, { useState, useMemo } from 'react';
import { 
  Laptop, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Filter,
  User as UserIcon,
  HardDrive,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Device, DeviceType } from '../types';

export const DevicesView: React.FC = () => {
  const { devices, customers, repairJobs, addDevice, updateDevice, deleteDevice, searchTerm } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [viewingDevice, setViewingDevice] = useState<Device | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<Device, 'id' | 'device_code'>>({
    customer_id: customers[0]?.id || 1,
    device_type: 'Laptop',
    brand: 'ASUS',
    model: '',
    serial_number: '',
    operating_system: 'Windows 11 Home',
    reported_problem: '',
    accessories_received: 'AC Power Adapter & Cord',
    physical_condition: 'Good condition, minor scratches',
    date_registered: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const query = (localSearch || searchTerm).trim().toLowerCase();

  const filteredDevices = useMemo(() => {
    return devices.filter(d => {
      const matchesSearch = 
        d.brand.toLowerCase().includes(query) ||
        d.model.toLowerCase().includes(query) ||
        d.serial_number.toLowerCase().includes(query) ||
        d.device_code.toLowerCase().includes(query) ||
        (d.customer_name && d.customer_name.toLowerCase().includes(query)) ||
        d.reported_problem.toLowerCase().includes(query);

      const matchesBrand = selectedBrand === 'ALL' || d.brand === selectedBrand;
      const matchesType = selectedType === 'ALL' || d.device_type === selectedType;

      return matchesSearch && matchesBrand && matchesType;
    });
  }, [devices, query, selectedBrand, selectedType]);

  // Unique brands
  const brands = useMemo(() => {
    const set = new Set(devices.map(d => d.brand));
    return Array.from(set).sort();
  }, [devices]);

  // Pagination
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage) || 1;
  const paginatedDevices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDevices.slice(start, start + itemsPerPage);
  }, [filteredDevices, currentPage]);

  const handleOpenAdd = () => {
    setEditingDevice(null);
    setFormData({
      customer_id: customers[0]?.id || 1,
      device_type: 'Laptop',
      brand: 'ASUS',
      model: '',
      serial_number: `SN-${Date.now().toString().slice(-8)}`,
      operating_system: 'Windows 11 Home',
      reported_problem: '',
      accessories_received: 'AC Power Adapter & Cord',
      physical_condition: 'Good aesthetic condition',
      date_registered: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (dev: Device) => {
    setEditingDevice(dev);
    setFormData({
      customer_id: dev.customer_id,
      device_type: dev.device_type,
      brand: dev.brand,
      model: dev.model,
      serial_number: dev.serial_number,
      operating_system: dev.operating_system,
      reported_problem: dev.reported_problem,
      accessories_received: dev.accessories_received,
      physical_condition: dev.physical_condition,
      date_registered: dev.date_registered,
      notes: dev.notes
    });
    setIsAddEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.model.trim() || !formData.serial_number.trim()) {
      alert("Model and Serial Number are required.");
      return;
    }

    if (editingDevice) {
      updateDevice(editingDevice.id, formData);
    } else {
      addDevice(formData);
    }
    setIsAddEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    deleteDevice(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Laptop className="w-5 h-5 text-indigo-600" />
              <span>Computer & Device Inventory ({devices.length} Units)</span>
            </h2>
            <p className="text-xs text-slate-500">Track computers, laptops, all-in-ones, serial numbers, and linked customers</p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Device</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by brand, model, S/N, customer..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">All Types</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="All-in-One">All-in-One</option>
              <option value="MacBook / iMac">MacBook / iMac</option>
              <option value="Gaming PC">Gaming PC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Device Code</th>
                <th className="py-3 px-4">Brand & Model</th>
                <th className="py-3 px-4">Device Type</th>
                <th className="py-3 px-4">Serial Number</th>
                <th className="py-3 px-4">Customer Owner</th>
                <th className="py-3 px-4">Operating System</th>
                <th className="py-3 px-4">Reported Problem</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedDevices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No devices found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedDevices.map((dev) => {
                  return (
                    <tr key={dev.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 whitespace-nowrap">
                        {dev.device_code}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{dev.brand}</span>
                        <span className="text-slate-700 ml-1 font-medium">{dev.model}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {dev.device_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {dev.serial_number}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {dev.customer_name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {dev.operating_system}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {dev.reported_problem}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewingDevice(dev)}
                            title="View Device Specifications"
                            className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(dev)}
                            title="Edit Device Info"
                            className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(dev.id)}
                            title="Delete Device"
                            className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold">{filteredDevices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredDevices.length)}</span> of{' '}
            <span className="font-semibold">{filteredDevices.length}</span> devices
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Device Modal */}
      {viewingDevice && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {viewingDevice.device_code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {viewingDevice.brand} {viewingDevice.model}
                </h3>
              </div>
              <button
                onClick={() => setViewingDevice(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 my-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Registered Owner</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{viewingDevice.customer_name}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Serial Number</span>
                  <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">{viewingDevice.serial_number}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Device Category</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{viewingDevice.device_type}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Operating System</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{viewingDevice.operating_system}</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-amber-800">Reported Problem / Symptoms</span>
                <p className="text-slate-800 font-medium mt-0.5">{viewingDevice.reported_problem}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Accessories Surrendered</span>
                <p className="text-slate-700 mt-0.5">{viewingDevice.accessories_received || 'Unit only'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Physical Condition / Cosmetic Notes</span>
                <p className="text-slate-700 mt-0.5">{viewingDevice.physical_condition}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setViewingDevice(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Device Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingDevice ? `Edit Device (${editingDevice.device_code})` : 'Register Computer / Device'}
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
                <label className="block font-semibold text-slate-700 mb-1">Customer Owner *</label>
                <select
                  required
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.customer_code}) - {c.phone_number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ASUS, Dell, Lenovo"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model Name / Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ROG Zephyrus G14"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Device Type</label>
                  <select
                    value={formData.device_type}
                    onChange={(e) => setFormData({ ...formData, device_type: e.target.value as DeviceType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop</option>
                    <option value="All-in-One">All-in-One</option>
                    <option value="MacBook / iMac">MacBook / iMac</option>
                    <option value="Gaming PC">Gaming PC</option>
                    <option value="Mini PC">Mini PC</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Serial Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SN-89248201"
                    value={formData.serial_number}
                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operating System</label>
                <input
                  type="text"
                  placeholder="e.g. Windows 11 Pro 64-bit"
                  value={formData.operating_system}
                  onChange={(e) => setFormData({ ...formData, operating_system: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reported Problem / Issue *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detailed problem described by customer upon intake..."
                  value={formData.reported_problem}
                  onChange={(e) => setFormData({ ...formData, reported_problem: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Accessories Received</label>
                  <input
                    type="text"
                    placeholder="Charger, cable, bag, dongles"
                    value={formData.accessories_received}
                    onChange={(e) => setFormData({ ...formData, accessories_received: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Physical Condition</label>
                  <input
                    type="text"
                    placeholder="Scratches, dents, cracks"
                    value={formData.physical_condition}
                    onChange={(e) => setFormData({ ...formData, physical_condition: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  {editingDevice ? 'Update Device' : 'Register Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Delete Device Record</h3>
                <p className="text-xs text-slate-500">Foreign key dependency check</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to remove this computer device? Deletion will be rejected if repair jobs reference this device.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
