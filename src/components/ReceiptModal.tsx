import React from 'react';
import { X, Printer, CheckCircle2, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReceiptModalProps {
  repairJobId: number | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ repairJobId, onClose }) => {
  const { repairJobs, customers, devices, payments, settings } = useApp();

  if (!repairJobId) return null;

  const job = repairJobs.find(r => r.id === repairJobId);
  if (!job) return null;

  const customer = customers.find(c => c.id === job.customer_id);
  const device = devices.find(d => d.id === job.device_id);
  const jobPayments = payments.filter(p => p.repair_job_id === job.id);
  const totalPaid = jobPayments.reduce((sum, p) => sum + p.amount_paid, 0);
  const remainingBalance = Math.max(0, job.total_repair_cost - totalPaid);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Official Repair Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-4 sm:p-6 bg-white text-slate-900 font-sans print:p-0">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3">
            <h1 className="text-lg font-black tracking-tight text-slate-950 uppercase">{settings.shop_name}</h1>
            <p className="text-xs text-slate-600 mt-0.5">{settings.shop_address}</p>
            <p className="text-[11px] text-slate-500">Contact: {settings.contact_number} | TIN: {settings.tin_number}</p>
            <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold">
              OFFICIAL BILLING & REPAIR RECEIPT
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 py-3 border-b border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Billed To:</span>
              <p className="font-bold text-slate-900">{customer?.full_name}</p>
              <p className="text-slate-600 text-[11px]">{customer?.phone_number}</p>
              <p className="text-slate-600 text-[11px] truncate">{customer?.address}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Job Reference:</span>
              <p className="font-mono font-bold text-blue-700">{job.job_code}</p>
              <p className="text-slate-600 text-[11px]">Device: {job.device_info}</p>
              <p className="text-slate-600 text-[11px] font-mono">S/N: {device?.serial_number}</p>
            </div>
          </div>

          {/* Itemized Services & Parts */}
          <div className="py-3 border-b border-slate-200 text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] border-b border-slate-200">
                  <th className="pb-1">Description of Work / Parts</th>
                  <th className="pb-1 text-right">Amount (PHP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {job.services_applied?.map((s, idx) => (
                  <tr key={idx} className="py-1">
                    <td className="py-1.5 text-slate-800">
                      <span className="font-medium">{s.service_name}</span>
                      <span className="text-[10px] text-slate-400 block">Service Labor</span>
                    </td>
                    <td className="py-1.5 text-right font-semibold text-slate-800">
                      ₱{s.cost_charged.toLocaleString()}
                    </td>
                  </tr>
                ))}

                {job.parts_cost > 0 && (
                  <tr>
                    <td className="py-1.5 text-slate-800">
                      <span className="font-medium">Replacement Parts & Materials</span>
                      <span className="text-[10px] text-slate-400 block">{job.parts_and_materials_used}</span>
                    </td>
                    <td className="py-1.5 text-right font-semibold text-slate-800">
                      ₱{job.parts_cost.toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals & Calculations */}
          <div className="py-3 border-b border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Labor Subtotal:</span>
              <span>₱{job.labor_cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Parts & Materials Subtotal:</span>
              <span>₱{job.parts_cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
              <span>Total Repair Cost:</span>
              <span>₱{job.total_repair_cost.toLocaleString()}</span>
            </div>

            {/* Payments breakdown */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Payment Transactions Applied:</span>
              {jobPayments.filter(p => p.amount_paid > 0).map(p => (
                <div key={p.id} className="flex justify-between text-[11px] text-emerald-700 font-medium mt-0.5">
                  <span>{p.payment_date} ({p.payment_method} - {p.transaction_reference}):</span>
                  <span>-₱{p.amount_paid.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-200">
              <span className="text-slate-800">Remaining Balance Due:</span>
              <span className={remainingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                ₱{remainingBalance.toLocaleString()} {remainingBalance === 0 && '(PAID IN FULL)'}
              </span>
            </div>
          </div>

          {/* Warranty & Footer */}
          <div className="pt-3 text-[10px] text-slate-500 space-y-2">
            <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <p>
                <strong>Warranty:</strong> {job.warranty_period}. Covers repair service and installed replacement parts. Physical damage, unauthorized tampering, or liquid spills void warranty.
              </p>
            </div>
            <p className="text-center italic">{settings.receipt_footer_note}</p>

            <div className="flex justify-between items-end pt-4">
              <div className="text-center">
                <p className="font-semibold text-slate-800 text-[11px]">{job.assigned_technician}</p>
                <p className="border-t border-slate-400 text-slate-600 px-4 mt-1">Technician</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800 text-[11px]">{settings.shop_name} Cashier</p>
                <p className="border-t border-slate-400 text-slate-600 px-4 mt-1">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
