import React from 'react';
import { 
  Menu, 
  Search, 
  PlusCircle, 
  RotateCcw, 
  Database, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onToggleMobile: () => void;
  onOpenNewRepairModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobile, onOpenNewRepairModal }) => {
  const { 
    currentUser, 
    activePage, 
    resetDatabase, 
    searchTerm, 
    setSearchTerm,
    repairJobs,
    customers,
    devices
  } = useApp();

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Repair Operations Dashboard';
      case 'customers': return 'Customer Information Directory';
      case 'devices': return 'Computer & Device Inventory';
      case 'repairs': return 'Repair Job Tickets & Status Management';
      case 'services': return 'Repair Services Catalog & Pricing';
      case 'payments': return 'Billing, Transactions & Balances';
      case 'reports': return 'Business Reports & Analytics';
      case 'users': return 'User Access & Permissions Management';
      case 'settings': return 'Shop Configuration & Warranty Settings';
      case 'academic': return 'SIA1 Academic Project Proposal & Architecture';
      case 'code': return 'Python Backend & MySQL Architecture Explorer';
      default: return 'Computer Repair Shop Management';
    }
  };

  const handleResetData = () => {
    if (window.confirm("Reset all database records back to the 200+ verified sample records? Any unsaved edits will be refreshed to default.")) {
      resetDatabase();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left section: Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base lg:text-lg font-bold text-slate-800 leading-tight">
            {getPageTitle()}
          </h2>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              MySQL: <span className="font-semibold">computer_repair_shop</span>
            </span>
            <span>•</span>
            <span className="text-slate-600">
              {repairJobs.length} Repairs • {customers.length} Customers • {devices.length} Devices
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Search, Actions, Profile */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Re-seed 200 Records Button */}
        <button
          onClick={handleResetData}
          title="Reset database to 200+ verified sample records"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Reset 200+ Data</span>
        </button>

        {/* New Repair Job Button */}
        <button
          onClick={onOpenNewRepairModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Repair Job</span>
        </button>

        {/* User Badge */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-800 leading-none">
              {currentUser?.full_name || 'Guest User'}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">
              Role: {currentUser?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
