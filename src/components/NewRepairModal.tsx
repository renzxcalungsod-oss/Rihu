import React, { useState } from 'react';
import { X, Wrench, Plus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RepairJobService, RepairStatus } from '../types';

interface NewRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewRepairModal: React.FC<NewRepairModalProps> = ({ isOpen, onClose }) => {
  const { customers, devices, services, addRepairJob, users } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(customers[0]?.id || 1);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number>(() => {
    const custDevs = devices.filter(d => d.customer_id === (customers[0]?.id || 1));
    return custDevs[0]?.id || devices[0]?.id || 1;
  });

  const [reportedProblem, setReportedProblem] = useState('');
  const [initialDiagnosis, setInitialDiagnosis] = useState('');
  const [recommendedSolution, setRecommendedSolution] = useState('');
  const [assignedTechnician, setAssignedTechnician] = useState(users.find(u => u.role === 'Staff')?.full_name || 'Mark Anthony Bautista');
  const [partsCost, setPartsCost] = useState(0);
  const [partsUsed, setPartsUsed] = useState('');
  const [selectedServices, setSelectedServices] = useState<RepairJobService[]>([]);
  const [repairStatus, setRepairStatus] = useState<RepairStatus>('Pending');
  
  const defaultDueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState(defaultDueDate);

  if (!isOpen) return null;

  // Filter devices belonging to selected customer
  const customerDevices = devices.filter(d => d.customer_id === selectedCustomerId);

  // Calculate labor cost dynamically from chosen services
  const laborCost = selectedServices.reduce((sum, s) => sum + s.cost_charged, 0);
  const totalCost = laborCost + partsCost;

  const handleToggleService = (serviceId: number) => {
    const targetService = services.find(s => s.id === serviceId);
    if (!targetService) return;

    const exists = selectedServices.some(s => s.service_id === serviceId);
    if (exists) {
      setSelectedServices(selectedServices.filter(s => s.service_id !== serviceId));
    } else {
      setSelectedServices([
        ...selectedServices,
        {
          service_id: targetService.id,
          service_name: targetService.service_name,
          cost_charged: targetService.standard_price
        }
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === selectedCustomerId);
    const dev = devices.find(d => d.id === selectedDeviceId);

    if (!cust || !dev) {
      alert("Please select a valid customer and device.");
      return;
    }

    addRepairJob({
      customer_id: cust.id,
      customer_name: cust.full_name,
      device_id: dev.id,
      device_info: `${dev.brand} ${dev.model} (${dev.serial_number})`,
      date_received: new Date().toISOString().split('T')[0],
      reported_problem: reportedProblem || dev.reported_problem || 'General repair & maintenance',
      initial_diagnosis: initialDiagnosis || 'Awaiting initial bench hardware test',
      recommended_solution: recommendedSolution || 'Standard diagnostic and component servicing',
      assigned_technician: assignedTechnician,
      services_applied: selectedServices,
      parts_and_materials_used: partsUsed || 'None / Consumables only',
      labor_cost: laborCost,
      parts_cost: partsCost,
      total_repair_cost: totalCost,
      estimated_completion_date: estimatedCompletionDate,
      actual_completion_date: null,
      repair_status: repairStatus,
      technician_notes: 'Initial job intake logged via management system.',
      warranty_period: '90 Days Service Warranty'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">New Repair Job Intake</h3>
              <p className="text-xs text-slate-500">Admit computer device, select services, and assign technician</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          {/* Customer & Device Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Client *</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  const newCustId = Number(e.target.value);
                  setSelectedCustomerId(newCustId);
                  const newDevs = devices.filter(d => d.customer_id === newCustId);
                  if (newDevs.length > 0) {
                    setSelectedDeviceId(newDevs[0].id);
                  }
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.customer_code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Device to Repair *</label>
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              >
                {customerDevices.length > 0 ? (
                  customerDevices.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.brand} {d.model} - S/N: {d.serial_number}
                    </option>
                  ))
                ) : (
                  devices.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.brand} {d.model} ({d.customer_name})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Problem & Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reported Problem *</label>
              <textarea
                required
                rows={2}
                placeholder="Symptoms reported by customer..."
                value={reportedProblem}
                onChange={(e) => setReportedProblem(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Technician Diagnosis</label>
              <textarea
                rows={2}
                placeholder="Preliminary bench findings..."
                value={initialDiagnosis}
                onChange={(e) => setInitialDiagnosis(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Services Selection from Service Catalog */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Select Services to Apply (Auto-Calculates Labor)</span>
              <span className="text-blue-600 font-bold">Labor Subtotal: ₱{laborCost.toLocaleString()}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50/50">
              {services.filter(s => s.is_active).map(srv => {
                const isSelected = selectedServices.some(s => s.service_id === srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => handleToggleService(srv.id)}
                    className={`p-2 rounded-md border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-medium'
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{srv.service_name}</span>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0 ml-2">₱{srv.standard_price.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parts Cost & Technician */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Technician *</label>
              <select
                value={assignedTechnician}
                onChange={(e) => setAssignedTechnician(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              >
                {users.map(u => (
                  <option key={u.id} value={u.full_name}>
                    {u.full_name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Parts & Materials Cost (₱)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={partsCost}
                onChange={(e) => setPartsCost(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Completion Date</label>
              <input
                type="date"
                required
                value={estimatedCompletionDate}
                onChange={(e) => setEstimatedCompletionDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Parts description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Parts & Consumables Description</label>
            <input
              type="text"
              placeholder="e.g. 1TB Kingston NVMe PCIe Gen4 SSD + Gelid Thermal Pads"
              value={partsUsed}
              onChange={(e) => setPartsUsed(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          {/* Total Cost Preview */}
          <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400">Total Calculated Job Cost:</span>
              <p className="text-xs text-slate-300">Labor: ₱{laborCost.toLocaleString()} + Parts: ₱{partsCost.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-emerald-400">₱{totalCost.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
            >
              Create Repair Job Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
