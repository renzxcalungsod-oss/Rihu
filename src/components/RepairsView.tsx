import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Printer, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  X,
  History,
  FileText,
  User,
  Laptop
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RepairJob, RepairStatus, RepairJobService } from '../types';
import { StatusBadge } from './StatusBadge';

interface RepairsViewProps {
  onOpenNewModal: () => void;
  onViewWorkOrder: (id: number) => void;
  onViewReceipt: (id: number) => void;
  onSelectRepairForPayment?: (id: number) => void;
}

export const RepairsView: React.FC<RepairsViewProps> = ({
  onOpenNewModal,
  onViewWorkOrder,
  onViewReceipt,
  onSelectRepairForPayment
}) => {
  const { 
    repairJobs, 
    customers, 
    devices, 
    services, 
    updateRepairJob, 
    deleteRepairJob, 
    searchTerm,
    currentUser
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedTechnician, setSelectedTechnician] = useState<string>('ALL');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [viewingJob, setViewingJob] = useState<RepairJob | null>(null);
  const [editingJob, setEditingJob] = useState<RepairJob | null>(null);
  const [statusUpdateJob, setStatusUpdateJob] = useState<RepairJob | null>(null);
  const [newStatus, setNewStatus] = useState<RepairStatus>('In Progress');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Edit form state
  const [editFormData, setEditFormData] = useState<{
    assigned_technician: string;
    labor_cost: number;
    parts_cost: number;
    parts_and_materials_used: string;
    initial_diagnosis: string;
    recommended_solution: string;
    technician_notes: string;
    estimated_completion_date: string;
    actual_completion_date: string;
    warranty_period: string;
  }>({
    assigned_technician: '',
    labor_cost: 0,
    parts_cost: 0,
    parts_and_materials_used: '',
    initial_diagnosis: '',
    recommended_solution: '',
    technician_notes: '',
    estimated_completion_date: '',
    actual_completion_date: '',
    warranty_period: '90 Days Service Warranty'
  });

  const query = (localSearch || searchTerm).trim().toLowerCase();
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredJobs = useMemo(() => {
    return repairJobs.filter(job => {
      const matchesSearch = 
        job.job_code.toLowerCase().includes(query) ||
        job.customer_name.toLowerCase().includes(query) ||
        job.device_info.toLowerCase().includes(query) ||
        job.assigned_technician.toLowerCase().includes(query) ||
        job.reported_problem.toLowerCase().includes(query);

      const matchesStatus = selectedStatus === 'ALL' || job.repair_status === selectedStatus;
      const matchesTech = selectedTechnician === 'ALL' || job.assigned_technician === selectedTechnician;

      const isOverdue = 
        job.estimated_completion_date < todayStr && 
        job.repair_status !== 'Completed' && 
        job.repair_status !== 'Released' && 
        job.repair_status !== 'Cancelled';

      const matchesOverdue = showOverdueOnly ? isOverdue : true;

      return matchesSearch && matchesStatus && matchesTech && matchesOverdue;
    });
  }, [repairJobs, query, selectedStatus, selectedTechnician, showOverdueOnly, todayStr]);

  // Technicians list
  const technicians = useMemo(() => {
    const set = new Set(repairJobs.map(r => r.assigned_technician));
    return Array.from(set).filter(Boolean);
  }, [repairJobs]);

  // Overdue count
  const overdueCount = useMemo(() => {
    return repairJobs.filter(job => 
      job.estimated_completion_date < todayStr && 
      job.repair_status !== 'Completed' && 
      job.repair_status !== 'Released' && 
      job.repair_status !== 'Cancelled'
    ).length;
  }, [repairJobs, todayStr]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const handleOpenEdit = (job: RepairJob) => {
    setEditingJob(job);
    setEditFormData({
      assigned_technician: job.assigned_technician,
      labor_cost: job.labor_cost,
      parts_cost: job.parts_cost,
      parts_and_materials_used: job.parts_and_materials_used,
      initial_diagnosis: job.initial_diagnosis,
      recommended_solution: job.recommended_solution,
      technician_notes: job.technician_notes,
      estimated_completion_date: job.estimated_completion_date,
      actual_completion_date: job.actual_completion_date || '',
      warranty_period: job.warranty_period
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    updateRepairJob(editingJob.id, {
      ...editFormData,
      actual_completion_date: editFormData.actual_completion_date || null
    });
    setEditingJob(null);
  };

  const handleOpenStatusModal = (job: RepairJob) => {
    setStatusUpdateJob(job);
    setNewStatus(job.repair_status);
    setStatusRemarks('');
  };

  const handleConfirmStatusChange = () => {
    if (!statusUpdateJob) return;

    const actualDate = (newStatus === 'Completed' || newStatus === 'Released') 
      ? (statusUpdateJob.actual_completion_date || todayStr)
      : statusUpdateJob.actual_completion_date;

    updateRepairJob(statusUpdateJob.id, {
      repair_status: newStatus,
      actual_completion_date: actualDate
    }, statusRemarks);

    setStatusUpdateJob(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Overview */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              <span>Repair Job Management ({repairJobs.length} Tickets)</span>
            </h2>
            <p className="text-xs text-slate-500">Track diagnostics, technician bench assignments, labor & parts costs, and warranties</p>
          </div>

          <div className="flex items-center gap-2">
            {overdueCount > 0 && (
              <button
                onClick={() => setShowOverdueOnly(!showOverdueOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  showOverdueOnly 
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs' 
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{showOverdueOnly ? 'Show All Jobs' : `${overdueCount} Overdue Jobs`}</span>
              </button>
            )}

            <button
              onClick={onOpenNewModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Repair Intake</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Job Code, customer, device, technician..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Parts">Waiting for Parts</option>
              <option value="Completed">Completed</option>
              <option value="Released">Released</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Technician:</span>
            <select
              value={selectedTechnician}
              onChange={(e) => {
                setSelectedTechnician(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">All Technicians</option>
              {technicians.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Repair Tickets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3">Job ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Device & Problem</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Technician</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3 text-right">Labor</th>
                <th className="py-3 px-3 text-right">Parts</th>
                <th className="py-3 px-3 text-right">Total (₱)</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No repair jobs found matching the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => {
                  const isOverdue = 
                    job.estimated_completion_date < todayStr && 
                    job.repair_status !== 'Completed' && 
                    job.repair_status !== 'Released' && 
                    job.repair_status !== 'Cancelled';

                  return (
                    <tr 
                      key={job.id} 
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isOverdue ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                        {job.job_code}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">{job.customer_name}</span>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <p className="font-semibold text-slate-800 truncate">{job.device_info}</p>
                        <p className="text-[11px] text-slate-500 truncate">{job.reported_problem}</p>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenStatusModal(job)}
                          title="Click to update status"
                          className="hover:opacity-80 transition-opacity"
                        >
                          <StatusBadge status={job.repair_status} size="sm" />
                        </button>
                      </td>
                      <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                        {job.assigned_technician}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className={isOverdue ? 'font-bold text-rose-600' : 'text-slate-600'}>
                            {job.estimated_completion_date}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] px-1 py-0.2 rounded bg-rose-100 text-rose-700 font-bold">
                              OVERDUE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600">
                        ₱{job.labor_cost.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600">
                        ₱{job.parts_cost.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        ₱{job.total_repair_cost.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewingJob(job)}
                            title="View Full Job Details & History"
                            className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onViewWorkOrder(job.id)}
                            title="Print Work Order"
                            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onViewReceipt(job.id)}
                            title="Print Repair Receipt"
                            className="p-1 rounded text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(job)}
                            title="Edit Costs & Diagnosis"
                            className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(job.id)}
                            title="Delete Job"
                            className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Pagination */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold">{filteredJobs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredJobs.length)}</span> of{' '}
            <span className="font-semibold">{filteredJobs.length}</span> repair jobs
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

      {/* Status Transition Modal */}
      {statusUpdateJob && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900">Update Repair Status</h3>
                <p className="text-xs text-slate-500">{statusUpdateJob.job_code} • {statusUpdateJob.device_info}</p>
              </div>
              <button
                onClick={() => setStatusUpdateJob(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as RepairStatus)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Pending">Pending (Intake)</option>
                  <option value="In Progress">In Progress (Bench Work)</option>
                  <option value="Waiting for Parts">Waiting for Parts (Supplier Order)</option>
                  <option value="Completed">Completed (Passed Quality Assurance)</option>
                  <option value="Released">Released (Turned Over to Client)</option>
                  <option value="Cancelled">Cancelled (Customer Declined / Unrepairable)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Remarks / Benchmark Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Replaced MOSFET, power rails stable at 19V. Completed 2-hour burn-in stress test."
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="p-2.5 rounded bg-blue-50 text-blue-900 text-[11px] flex items-center gap-2">
                <History className="w-4 h-4 shrink-0 text-blue-600" />
                <span>This transition will be recorded in the `repair_status_history` audit log.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setStatusUpdateJob(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Repair Job Details Modal */}
      {viewingJob && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {viewingJob.job_code}
                </span>
                <StatusBadge status={viewingJob.repair_status} />
              </div>
              <button
                onClick={() => setViewingJob(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Customer</span>
                <p className="font-bold text-slate-900 mt-0.5">{viewingJob.customer_name}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Device</span>
                <p className="font-bold text-slate-900 mt-0.5">{viewingJob.device_info}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Assigned Technician</span>
                <p className="font-bold text-slate-900 mt-0.5">{viewingJob.assigned_technician}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Warranty Period</span>
                <p className="font-bold text-slate-900 mt-0.5">{viewingJob.warranty_period}</p>
              </div>
            </div>

            {/* Diagnosis & Problem */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-amber-800">Reported Problem</span>
                <p className="text-slate-800 mt-0.5">{viewingJob.reported_problem}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Initial Hardware Diagnosis</span>
                <p className="text-slate-800 mt-0.5">{viewingJob.initial_diagnosis}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Recommended Solution & Procedures</span>
                <p className="text-slate-800 mt-0.5">{viewingJob.recommended_solution}</p>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="mt-4 p-3 bg-slate-900 text-white rounded-xl text-xs">
              <div className="flex items-center justify-between font-medium mb-1">
                <span className="text-slate-400">Labor & Services:</span>
                <span>₱{viewingJob.labor_cost.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between font-medium mb-2">
                <span className="text-slate-400">Parts & Replacement Components:</span>
                <span>₱{viewingJob.parts_cost.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between font-bold text-sm text-emerald-400">
                <span>Total Calculated Repair Cost:</span>
                <span>₱{viewingJob.total_repair_cost.toLocaleString()}</span>
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <History className="w-4 h-4 text-blue-600" />
                <span>Audit Trail & Status History</span>
              </h4>
              <div className="space-y-2">
                {viewingJob.status_history?.map(hist => (
                  <div key={hist.id} className="p-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50/50 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{hist.old_status} → {hist.new_status}</span>
                        <span className="text-[10px] text-slate-400">by {hist.changed_by}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5 text-[11px]">{hist.remarks}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{hist.changed_at}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewWorkOrder(viewingJob.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Work Order</span>
                </button>
                <button
                  onClick={() => onViewReceipt(viewingJob.id)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Official Receipt</span>
                </button>
              </div>

              <button
                onClick={() => setViewingJob(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Repair Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Edit Repair Job ({editingJob.job_code})
              </h3>
              <button
                onClick={() => setEditingJob(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Technician</label>
                <input
                  type="text"
                  required
                  value={editFormData.assigned_technician}
                  onChange={(e) => setEditFormData({ ...editFormData, assigned_technician: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Labor Cost (₱)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={editFormData.labor_cost}
                    onChange={(e) => setEditFormData({ ...editFormData, labor_cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parts Cost (₱)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={editFormData.parts_cost}
                    onChange={(e) => setEditFormData({ ...editFormData, parts_cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between font-bold">
                <span className="text-slate-600">Calculated Total Cost:</span>
                <span className="text-emerald-600 text-sm">
                  ₱{(editFormData.labor_cost + editFormData.parts_cost).toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parts & Materials Itemized</label>
                <input
                  type="text"
                  value={editFormData.parts_and_materials_used}
                  onChange={(e) => setEditFormData({ ...editFormData, parts_and_materials_used: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Diagnosis</label>
                <textarea
                  rows={2}
                  value={editFormData.initial_diagnosis}
                  onChange={(e) => setEditFormData({ ...editFormData, initial_diagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recommended Solution</label>
                <textarea
                  rows={2}
                  value={editFormData.recommended_solution}
                  onChange={(e) => setEditFormData({ ...editFormData, recommended_solution: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Completion Date</label>
                  <input
                    type="date"
                    value={editFormData.estimated_completion_date}
                    onChange={(e) => setEditFormData({ ...editFormData, estimated_completion_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Actual Completion Date</label>
                  <input
                    type="date"
                    value={editFormData.actual_completion_date}
                    onChange={(e) => setEditFormData({ ...editFormData, actual_completion_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Changes
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
                <h3 className="font-bold text-slate-900">Delete Repair Job</h3>
                <p className="text-xs text-slate-500">Transaction & Billing Protection</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to delete this repair job ticket? Deletion is blocked if valid payments have already been collected for this job.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteRepairJob(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
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
