import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  Eye, 
  DollarSign, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Receipt,
  FileCheck2,
  Calendar,
  Wallet
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Payment, PaymentMethod, PaymentStatus } from '../types';
import { StatusBadge } from './StatusBadge';

interface PaymentsViewProps {
  onViewReceipt: (repairJobId: number) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ onViewReceipt }) => {
  const { payments, repairJobs, recordPayment, searchTerm } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New Payment Modal state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);

  const [selectedJobId, setSelectedJobId] = useState<number>(() => {
    // Pick first job with outstanding balance
    const jobWithBal = repairJobs.find(r => {
      const jobPays = payments.filter(p => p.repair_job_id === r.id);
      const paid = jobPays.reduce((sum, p) => sum + p.amount_paid, 0);
      return r.total_repair_cost - paid > 0;
    });
    return jobWithBal?.id || repairJobs[0]?.id || 1;
  });

  const [amountPaidInput, setAmountPaidInput] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('GCash');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  const query = (localSearch || searchTerm).trim().toLowerCase();

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesSearch = 
        p.payment_code.toLowerCase().includes(query) ||
        p.job_code.toLowerCase().includes(query) ||
        p.customer_name.toLowerCase().includes(query) ||
        p.transaction_reference.toLowerCase().includes(query) ||
        p.notes.toLowerCase().includes(query);

      const matchesMethod = selectedMethod === 'ALL' || p.payment_method === selectedMethod;
      const matchesStatus = selectedStatus === 'ALL' || p.payment_status === selectedStatus;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [payments, query, selectedMethod, selectedStatus]);

  // Overall financial summary
  const totalReceived = payments.reduce((sum, p) => sum + p.amount_paid, 0);
  const activeRepairsCost = repairJobs.reduce((sum, r) => sum + (r.repair_status !== 'Cancelled' ? r.total_repair_cost : 0), 0);
  const totalOutstanding = Math.max(0, activeRepairsCost - totalReceived);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(start, start + itemsPerPage);
  }, [filteredPayments, currentPage]);

  // Selected job remaining balance calculation
  const targetJob = repairJobs.find(r => r.id === selectedJobId);
  const targetJobPayments = payments.filter(p => p.repair_job_id === selectedJobId);
  const targetJobPaidSoFar = targetJobPayments.reduce((sum, p) => sum + p.amount_paid, 0);
  const targetJobRemaining = Math.max(0, (targetJob?.total_repair_cost || 0) - targetJobPaidSoFar);

  const handleOpenRecordModal = (jobId?: number) => {
    if (jobId) {
      setSelectedJobId(jobId);
    }
    setTransactionRef(`REF-${paymentMethod.toUpperCase().substring(0, 3)}-${Date.now().toString().slice(-6)}`);
    setPaymentNotes('Official payment receipt recorded.');
    setIsRecordModalOpen(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetJob) return;

    const res = recordPayment({
      repair_job_id: targetJob.id,
      amount_paid: Number(amountPaidInput),
      payment_method: paymentMethod,
      transaction_reference: transactionRef,
      notes: paymentNotes
    });

    if (res.success) {
      setIsRecordModalOpen(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Revenue Collected</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">₱{totalReceived.toLocaleString()}</p>
          <span className="text-xs text-slate-500 mt-1 block">Across {payments.filter(p => p.amount_paid > 0).length} confirmed payment entries</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Outstanding Balances</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">₱{totalOutstanding.toLocaleString()}</p>
          <span className="text-xs text-slate-500 mt-1 block">Auto-calculated: Total Job Costs - Payments</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Quick Actions</span>
            <p className="text-xs text-slate-600 mt-0.5">Collect payment via GCash, Maya, Cash or Bank</p>
          </div>
          <button
            onClick={() => handleOpenRecordModal()}
            className="w-full mt-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Payment</span>
          </button>
        </div>
      </div>

      {/* Header & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Payments & Transactions Ledger ({payments.length} Records)</span>
            </h2>
            <p className="text-xs text-slate-500">Itemized billing entries, transaction reference numbers, and remaining balances</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Payment Code, Job Code, Customer, Ref..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Method:</span>
            <select
              value={selectedMethod}
              onChange={(e) => {
                setSelectedMethod(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="GCash">GCash</option>
              <option value="Maya">Maya</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Other">Other</option>
            </select>
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
              <option value="Paid">Paid (Full)</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3">Receipt Code</th>
                <th className="py-3 px-3">Job ID</th>
                <th className="py-3 px-3">Customer Client</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Transaction Reference</th>
                <th className="py-3 px-3 text-right">Amount Paid</th>
                <th className="py-3 px-3 text-right">Remaining Balance</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No payment records match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700 whitespace-nowrap">
                      {pay.payment_code}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                      {pay.job_code}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {pay.customer_name}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {pay.payment_date}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {pay.payment_method}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                      {pay.transaction_reference}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ₱{pay.amount_paid.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-rose-600">
                      ₱{pay.remaining_balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={pay.payment_status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setViewingPayment(pay)}
                          title="View Payment Details"
                          className="p-1 rounded text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onViewReceipt(pay.repair_job_id)}
                          title="Print Official Receipt"
                          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold">{filteredPayments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredPayments.length)}</span> of{' '}
            <span className="font-semibold">{filteredPayments.length}</span> payments
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

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Record Customer Payment</h3>
                  <p className="text-xs text-slate-500">Official receipt calculation in Philippine Peso (₱)</p>
                </div>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Repair Job Ticket *</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => {
                    const newId = Number(e.target.value);
                    setSelectedJobId(newId);
                    const job = repairJobs.find(r => r.id === newId);
                    const existing = payments.filter(p => p.repair_job_id === newId);
                    const paid = existing.reduce((sum, p) => sum + p.amount_paid, 0);
                    const rem = Math.max(0, (job?.total_repair_cost || 0) - paid);
                    setAmountPaidInput(rem > 0 ? rem : 0);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                >
                  {repairJobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.job_code} - {job.customer_name} ({job.device_info}) [Cost: ₱{job.total_repair_cost.toLocaleString()}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Job Summary Box */}
              {targetJob && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Repair Cost:</span>
                    <span className="font-bold text-slate-900">₱{targetJob.total_repair_cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Already Settled:</span>
                    <span className="font-semibold text-emerald-600">₱{targetJobPaidSoFar.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-bold">
                    <span className="text-slate-700">Current Outstanding Balance:</span>
                    <span className="text-rose-600">₱{targetJobRemaining.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Cash">Cash (Counter)</option>
                    <option value="GCash">GCash (e-Wallet)</option>
                    <option value="Maya">Maya (e-Wallet)</option>
                    <option value="Bank Transfer">Bank Transfer (BDO/BPI/UnionBank)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount to Pay (₱) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={targetJobRemaining > 0 ? targetJobRemaining : undefined}
                    value={amountPaidInput}
                    onChange={(e) => setAmountPaidInput(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Reference / Receipt No.</label>
                <input
                  type="text"
                  placeholder="e.g. GCash Reference No. 901238471"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Cashier Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Full settlement upon device turnover"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Remaining Balance Preview */}
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="text-emerald-900 font-semibold">Balance After Payment:</span>
                <span className="text-emerald-700 font-bold text-sm">
                  ₱{Math.max(0, targetJobRemaining - amountPaidInput).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={amountPaidInput <= 0}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50"
                >
                  Confirm & Process Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Payment Details Modal */}
      {viewingPayment && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {viewingPayment.payment_code}
                </span>
                <h3 className="font-bold text-slate-900 mt-1">Payment Transaction Details</h3>
              </div>
              <button
                onClick={() => setViewingPayment(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 my-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Repair Job Code:</span>
                <span className="font-mono font-bold text-blue-600">{viewingPayment.job_code}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Customer Client:</span>
                <span className="font-bold text-slate-800">{viewingPayment.customer_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Date:</span>
                <span className="text-slate-700">{viewingPayment.payment_date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-semibold text-slate-800">{viewingPayment.payment_method}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Transaction Reference:</span>
                <span className="font-mono text-slate-700">{viewingPayment.transaction_reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-emerald-600 text-sm">₱{viewingPayment.amount_paid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Remaining Balance:</span>
                <span className="font-bold text-rose-600 text-sm">₱{viewingPayment.remaining_balance.toLocaleString()}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Notes:</span>
                <p className="text-slate-700 mt-0.5">{viewingPayment.notes}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  onViewReceipt(viewingPayment.repair_job_id);
                  setViewingPayment(null);
                }}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={() => setViewingPayment(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
