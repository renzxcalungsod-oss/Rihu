import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Laptop, 
  Wrench,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import { StatusBadge } from './StatusBadge';

export const CustomersView: React.FC = () => {
  const { customers, devices, repairJobs, addCustomer, updateCustomer, deleteCustomer, searchTerm } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    address: '',
    registration_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const query = (localSearch || searchTerm).trim().toLowerCase();

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.full_name.toLowerCase().includes(query) ||
      c.customer_code.toLowerCase().includes(query) ||
      c.phone_number.includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.address.toLowerCase().includes(query)
    );
  }, [customers, query]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      full_name: '',
      phone_number: '09',
      email: '',
      address: '',
      registration_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      full_name: customer.full_name,
      phone_number: customer.phone_number,
      email: customer.email,
      address: customer.address,
      registration_date: customer.registration_date,
      notes: customer.notes
    });
    setIsAddEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.phone_number.trim()) {
      alert("Full Name and Phone Number are required.");
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    setIsAddEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    deleteCustomer(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Customer Directory ({customers.length} Registered)</span>
          </h2>
          <p className="text-xs text-slate-500">Manage customer contact details, device ownership, and service history</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter customers..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Reg. Date</th>
                <th className="py-3 px-4 text-center">Devices</th>
                <th className="py-3 px-4 text-center">Repairs</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((cust) => {
                  const custDevices = devices.filter(d => d.customer_id === cust.id);
                  const custRepairs = repairJobs.filter(r => r.customer_id === cust.id);

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        {cust.customer_code}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{cust.full_name}</p>
                        {cust.notes && (
                          <p className="text-[11px] text-slate-400 italic truncate max-w-xs">{cust.notes}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="flex items-center gap-1 text-slate-700 font-medium">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{cust.phone_number}</span>
                        </p>
                        <p className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{cust.email}</span>
                        </p>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{cust.address}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {cust.registration_date}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {custDevices.length}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {custRepairs.length}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewingCustomer(cust)}
                            title="View Customer Profile"
                            className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(cust)}
                            title="Edit Customer"
                            className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(cust.id)}
                            title="Delete Customer"
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
            Showing <span className="font-semibold">{filteredCustomers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredCustomers.length)}</span> of{' '}
            <span className="font-semibold">{filteredCustomers.length}</span> customers
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

      {/* Customer View Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {viewingCustomer.customer_code}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{viewingCustomer.full_name}</h3>
              </div>
              <button
                onClick={() => setViewingCustomer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Contact Number</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{viewingCustomer.phone_number}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Email Address</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{viewingCustomer.email}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg col-span-2">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Physical Address</span>
                <p className="font-medium text-slate-800 mt-0.5">{viewingCustomer.address}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg col-span-2">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Registration Notes</span>
                <p className="font-medium text-slate-700 mt-0.5">{viewingCustomer.notes || 'None recorded'}</p>
              </div>
            </div>

            {/* Linked Devices */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-indigo-600" />
                <span>Registered Devices ({devices.filter(d => d.customer_id === viewingCustomer.id).length})</span>
              </h4>
              <div className="space-y-2">
                {devices.filter(d => d.customer_id === viewingCustomer.id).map(dev => (
                  <div key={dev.id} className="p-3 border border-slate-200 rounded-lg text-xs bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{dev.brand} {dev.model}</span>
                      <span className="ml-2 text-slate-500 font-mono text-[11px]">(S/N: {dev.serial_number})</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Issue: {dev.reported_problem}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold text-[10px]">
                      {dev.device_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked Repair Jobs */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>Repair History ({repairJobs.filter(r => r.customer_id === viewingCustomer.id).length})</span>
              </h4>
              <div className="space-y-2">
                {repairJobs.filter(r => r.customer_id === viewingCustomer.id).map(rep => (
                  <div key={rep.id} className="p-3 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600">{rep.job_code}</span>
                        <StatusBadge status={rep.repair_status} size="sm" />
                      </div>
                      <p className="text-slate-600 mt-1">{rep.reported_problem}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">₱{rep.total_repair_cost.toLocaleString()}</span>
                      <p className="text-[10px] text-slate-500">{rep.date_received}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingCustomer(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCustomer ? `Edit Customer (${editingCustomer.customer_code})` : 'Register New Customer'}
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
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juan Dela Cruz"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="0917-123-4567"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="juan.delacruz@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. #142 Aurora Blvd, Cubao, Quezon City"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration Date</label>
                  <input
                    type="date"
                    value={formData.registration_date}
                    onChange={(e) => setFormData({ ...formData, registration_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Category / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Regular Walk-in, VIP"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  {editingCustomer ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal with Relational Guard Notice */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Confirm Customer Deletion</h3>
                <p className="text-xs text-slate-500">Foreign key dependency check will be enforced</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to delete this customer record? Per relational database integrity constraints, deletion will be blocked if active devices or repair tickets exist for this customer.
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
