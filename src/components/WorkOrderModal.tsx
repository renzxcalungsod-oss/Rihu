import React from 'react';
import { X, Printer, Wrench, Shield, CheckSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RepairJob } from '../types';

interface WorkOrderModalProps {
  repairJobId: number | null;
  onClose: () => void;
}

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({ repairJobId, onClose }) => {
  const { repairJobs, customers, devices, settings } = useApp();

  if (!repairJobId) return null;

  const job = repairJobs.find(r => r.id === repairJobId);
  if (!job) return null;

  const customer = customers.find(c => c.id === job.customer_id);
  const device = devices.find(d => d.id === job.device_id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Modal Controls (Hidden during print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Work Order Printable Document
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Work Order</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-4 sm:p-6 bg-white text-slate-900 font-sans print:p-0">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">{settings.shop_name}</h1>
              <p className="text-xs text-slate-600 mt-0.5">{settings.shop_address}</p>
              <p className="text-xs text-slate-600">Hotline: {settings.contact_number} | Email: {settings.email_address}</p>
              <p className="text-[11px] text-slate-500 font-mono">TIN: {settings.tin_number}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded bg-slate-900 text-white font-mono font-bold text-sm">
                WORK ORDER
              </span>
              <p className="font-mono text-sm font-black text-blue-700 mt-1">{job.job_code}</p>
              <p className="text-[11px] text-slate-500">Date Received: {job.date_received}</p>
              <p className="text-[11px] text-slate-500">Est. Due: {job.estimated_completion_date}</p>
            </div>
          </div>

          {/* Customer & Device Information */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Client Information</span>
              <p className="font-bold text-slate-900 text-sm">{job.customer_name}</p>
              <p className="text-slate-600">{customer?.phone_number}</p>
              <p className="text-slate-600">{customer?.email}</p>
              <p className="text-slate-600 truncate">{customer?.address}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Device Specifications</span>
              <p className="font-bold text-slate-900 text-sm">{job.device_info}</p>
              <p className="text-slate-600 font-mono text-[11px]">S/N: {device?.serial_number}</p>
              <p className="text-slate-600">OS: {device?.operating_system}</p>
              <p className="text-slate-600">Accessories: {device?.accessories_received}</p>
            </div>
          </div>

          {/* Reported Complaint & Diagnosis */}
          <div className="py-4 border-b border-slate-200 space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Customer Complaint / Reported Symptom:</span>
              <p className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-800 font-medium mt-1">
                {job.reported_problem}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Initial Bench Diagnosis & Scope of Work:</span>
              <p className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-800 mt-1">
                {job.initial_diagnosis}
              </p>
            </div>
          </div>

          {/* Assigned Technician & Bench Checklist */}
          <div className="py-4 border-b border-slate-200 text-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Assigned Lead Technician:</span>
              <span className="font-bold text-blue-700">{job.assigned_technician}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5 text-blue-600" /> Motherboard Voltage Rails Check</div>
              <div className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5 text-blue-600" /> Thermal Paste Repaste & Fan Dusting</div>
              <div className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5 text-blue-600" /> RAM MemTest86 Stability Test</div>
              <div className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5 text-blue-600" /> SMART Disk Health & Sector Scan</div>
            </div>
          </div>

          {/* Terms & Signatures */}
          <div className="pt-4 text-[10px] text-slate-500 space-y-4">
            <p className="leading-tight">
              <strong>Shop Terms:</strong> Diagnostics fee applies if repair estimate is declined. All units unclaimed after 60 days from completion notice will be disposed to cover storage and labor costs.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="border-t border-slate-400 text-center pt-1 font-semibold text-slate-700">
                Customer Signature & Date Received
              </div>
              <div className="border-t border-slate-400 text-center pt-1 font-semibold text-slate-700">
                Technician / Receiving Staff
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
