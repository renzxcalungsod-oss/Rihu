import React from 'react';
import { RepairStatus, PaymentStatus } from '../types';

interface StatusBadgeProps {
  status: RepairStatus | PaymentStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      // Repair Statuses
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10';
      case 'Waiting for Parts':
        return 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10';
      case 'Released':
        return 'bg-teal-50 text-teal-700 border-teal-200 ring-teal-500/10';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10';

      // Payment Statuses
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10';
      case 'Partially Paid':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10';
      case 'Unpaid':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10';
      case 'Refunded':
        return 'bg-slate-100 text-slate-700 border-slate-300 ring-slate-500/10';

      // General User Status
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10';
      case 'Inactive':
        return 'bg-slate-100 text-slate-600 border-slate-300 ring-slate-500/10';

      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10';
    }
  };

  const dotColor = () => {
    switch (status) {
      case 'Pending': return 'bg-amber-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Waiting for Parts': return 'bg-purple-500';
      case 'Completed': return 'bg-emerald-500';
      case 'Released': return 'bg-teal-500';
      case 'Cancelled': return 'bg-rose-500';
      case 'Paid': return 'bg-emerald-500';
      case 'Partially Paid': return 'bg-amber-500';
      case 'Unpaid': return 'bg-rose-500';
      case 'Active': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  const sizeClasses = size === 'sm' 
    ? 'text-[11px] px-2 py-0.5 gap-1' 
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ring-1 ring-inset ${getBadgeStyle()} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor()}`} />
      <span>{status}</span>
    </span>
  );
};
