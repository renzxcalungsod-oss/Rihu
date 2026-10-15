import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  FileText, 
  Filter, 
  Calendar, 
  DollarSign, 
  Users, 
  Laptop, 
  Wrench, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useApp } from '../context/AppContext';

type ReportType = 
  | 'customers'
  | 'devices'
  | 'all_repairs'
  | 'pending_repairs'
  | 'completed_repairs'
  | 'services_performed'
  | 'payments_received'
  | 'outstanding_balances'
  | 'monthly_revenue';

export const ReportsView: React.FC = () => {
  const { customers, devices, repairJobs, payments, services, settings } = useApp();

  const [activeReport, setActiveReport] = useState<ReportType>('all_repairs');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Report Types Metadata
  const reportTabs: { id: ReportType; label: string; icon: React.ReactNode }[] = [
    { id: 'all_repairs', label: 'All Repair Jobs', icon: <Wrench className="w-4 h-4" /> },
    { id: 'pending_repairs', label: 'Pending Repairs', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'completed_repairs', label: 'Completed Repairs', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'payments_received', label: 'Payments Received', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'outstanding_balances', label: 'Outstanding Balances', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'monthly_revenue', label: 'Monthly Revenue', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'customers', label: 'Customer Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'devices', label: 'Device Inventory', icon: <Laptop className="w-4 h-4" /> },
    { id: 'services_performed', label: 'Services Performed', icon: <FileText className="w-4 h-4" /> },
  ];

  // Filtered dataset generator based on activeReport and date range
  const reportData = useMemo(() => {
    switch (activeReport) {
      case 'customers':
        return customers.map(c => ({
          'Customer ID': c.customer_code,
          'Full Name': c.full_name,
          'Phone Number': c.phone_number,
          'Email Address': c.email,
          'Address': c.address,
          'Reg Date': c.registration_date,
          'Notes': c.notes
        }));

      case 'devices':
        return devices.map(d => ({
          'Device Code': d.device_code,
          'Owner': d.customer_name,
          'Type': d.device_type,
          'Brand': d.brand,
          'Model': d.model,
          'Serial Number': d.serial_number,
          'Operating System': d.operating_system,
          'Reported Problem': d.reported_problem
        }));

      case 'all_repairs':
      case 'pending_repairs':
      case 'completed_repairs': {
        let list = repairJobs;
        if (activeReport === 'pending_repairs') {
          list = list.filter(r => r.repair_status === 'Pending' || r.repair_status === 'In Progress' || r.repair_status === 'Waiting for Parts');
        } else if (activeReport === 'completed_repairs') {
          list = list.filter(r => r.repair_status === 'Completed' || r.repair_status === 'Released');
        }

        if (startDate) list = list.filter(r => r.date_received >= startDate);
        if (endDate) list = list.filter(r => r.date_received <= endDate);

        return list.map(r => ({
          'Job Code': r.job_code,
          'Customer': r.customer_name,
          'Device': r.device_info,
          'Status': r.repair_status,
          'Technician': r.assigned_technician,
          'Date Received': r.date_received,
          'Due Date': r.estimated_completion_date,
          'Labor (PHP)': r.labor_cost,
          'Parts (PHP)': r.parts_cost,
          'Total Cost (PHP)': r.total_repair_cost
        }));
      }

      case 'payments_received': {
        let list = payments.filter(p => p.amount_paid > 0);
        if (startDate) list = list.filter(p => p.payment_date >= startDate);
        if (endDate) list = list.filter(p => p.payment_date <= endDate);

        return list.map(p => ({
          'Payment Code': p.payment_code,
          'Job Code': p.job_code,
          'Customer': p.customer_name,
          'Date': p.payment_date,
          'Method': p.payment_method,
          'Reference': p.transaction_reference,
          'Amount Paid (PHP)': p.amount_paid,
          'Remaining Balance (PHP)': p.remaining_balance,
          'Status': p.payment_status
        }));
      }

      case 'outstanding_balances': {
        const withBalance = repairJobs
          .filter(r => r.repair_status !== 'Cancelled')
          .map(r => {
            const pays = payments.filter(p => p.repair_job_id === r.id);
            const paid = pays.reduce((sum, p) => sum + p.amount_paid, 0);
            const rem = Math.max(0, r.total_repair_cost - paid);
            return { r, paid, rem };
          })
          .filter(item => item.rem > 0);

        return withBalance.map(item => ({
          'Job Code': item.r.job_code,
          'Customer': item.r.customer_name,
          'Device': item.r.device_info,
          'Status': item.r.repair_status,
          'Total Repair Cost (PHP)': item.r.total_repair_cost,
          'Paid to Date (PHP)': item.paid,
          'Unpaid Balance (PHP)': item.rem
        }));
      }

      case 'monthly_revenue': {
        const monthAgg: { [month: string]: { count: number; total: number } } = {};
        payments.filter(p => p.amount_paid > 0).forEach(p => {
          const monthKey = p.payment_date.substring(0, 7); // YYYY-MM
          if (!monthAgg[monthKey]) {
            monthAgg[monthKey] = { count: 0, total: 0 };
          }
          monthAgg[monthKey].count += 1;
          monthAgg[monthKey].total += p.amount_paid;
        });

        return Object.entries(monthAgg)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([month, val]) => ({
            'Billing Month': month,
            'Transactions Count': val.count,
            'Actual Collected Revenue (PHP)': val.total
          }));
      }

      case 'services_performed': {
        const counts: { [name: string]: { count: number; revenue: number } } = {};
        repairJobs.forEach(job => {
          job.services_applied?.forEach(s => {
            if (!counts[s.service_name]) {
              counts[s.service_name] = { count: 0, revenue: 0 };
            }
            counts[s.service_name].count += 1;
            counts[s.service_name].revenue += s.cost_charged;
          });
        });

        return Object.entries(counts)
          .sort((a, b) => b[1].count - a[1].count)
          .map(([name, data]) => ({
            'Service Performed': name,
            'Times Conducted': data.count,
            'Generated Labor Volume (PHP)': data.revenue
          }));
      }

      default:
        return [];
    }
  }, [activeReport, customers, devices, repairJobs, payments, startDate, endDate]);

  // Export to CSV function
  const handleExportCSV = () => {
    if (reportData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = Object.keys(reportData[0]);
    const csvRows = [
      headers.join(','),
      ...reportData.map(row => 
        headers.map(header => {
          const val = (row as any)[header];
          const escaped = ('' + (val !== undefined ? val : '')).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',')
      )
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `techpulse_report_${activeReport}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF function via jsPDF
  const handleExportPDF = () => {
    if (reportData.length === 0) {
      alert("No data available to generate PDF.");
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape' });
    const title = reportTabs.find(t => t.id === activeReport)?.label || 'System Report';
    
    // Header
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(settings.shop_name, 14, 15);

    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(`Report: ${title} | Generated: ${new Date().toLocaleString()}`, 14, 22);
    doc.text(`Address: ${settings.shop_address}`, 14, 28);

    doc.setLineWidth(0.5);
    doc.setDrawColor(203, 213, 225);
    doc.line(14, 32, 280, 32);

    // Print table rows (simple text grid)
    const headers = Object.keys(reportData[0]);
    let startY = 40;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);

    const colWidth = Math.floor(260 / headers.length);
    headers.forEach((h, i) => {
      doc.text(h.substring(0, 15), 14 + i * colWidth, startY);
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    // Show first 25 rows in PDF sample
    reportData.slice(0, 24).forEach((row, rowIndex) => {
      startY += 6;
      if (startY > 190) return; // page boundary
      headers.forEach((h, colIndex) => {
        const val = String((row as any)[h] || '');
        doc.text(val.substring(0, 18), 14 + colIndex * colWidth, startY);
      });
    });

    if (reportData.length > 24) {
      startY += 8;
      doc.setFont('helvetica', 'italic');
      doc.text(`... and ${reportData.length - 24} additional records. Full dataset available via CSV export.`, 14, startY);
    }

    doc.save(`techpulse_report_${activeReport}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const headers = reportData.length > 0 ? Object.keys(reportData[0]) : [];

  return (
    <div className="space-y-5">
      {/* Top Banner & Export Actions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Business Reports & Analytical Exports</span>
            </h2>
            <p className="text-xs text-slate-500">Generate on-screen tables, official CSV spreadsheets, and downloadable PDF reports</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-600">Date Range:</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Report Categories Nav Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {reportTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeReport === tab.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Report Table Display */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            {reportTabs.find(t => t.id === activeReport)?.label} ({reportData.length} Records)
          </span>
          <span className="text-slate-500 text-[11px]">
            Sorted by chronological order
          </span>
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px] sticky top-0 z-10">
              <tr>
                {headers.map(h => (
                  <th key={h} className="py-2.5 px-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan={headers.length || 1} className="py-8 text-center text-slate-400">
                    No records found for this report configuration.
                  </td>
                </tr>
              ) : (
                reportData.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    {headers.map(h => {
                      const val = (row as any)[h];
                      const isMoney = h.includes('(PHP)');
                      return (
                        <td 
                          key={h} 
                          className={`py-2.5 px-3 whitespace-nowrap ${
                            isMoney ? 'font-semibold text-slate-900 text-right' : 'text-slate-700'
                          }`}
                        >
                          {isMoney ? `₱${Number(val).toLocaleString()}` : val}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
