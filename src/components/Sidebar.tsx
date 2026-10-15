import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Laptop, 
  Wrench, 
  Sparkles, 
  CreditCard, 
  BarChart3, 
  UserCog, 
  Settings as SettingsIcon, 
  LogOut, 
  BookOpen, 
  FileCode2,
  HardDriveDownload,
  AlertCircle
} from 'lucide-react';
import { useApp, ActivePage } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { activePage, setActivePage, currentUser, logout, repairJobs, customers } = useApp();

  const pendingCount = repairJobs.filter(r => r.repair_status === 'Pending').length;
  const inProgressCount = repairJobs.filter(r => r.repair_status === 'In Progress').length;

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-5 h-5" />, badge: customers.length },
    { id: 'devices', label: 'Computers / Devices', icon: <Laptop className="w-5 h-5" /> },
    { 
      id: 'repairs', 
      label: 'Repair Jobs', 
      icon: <Wrench className="w-5 h-5" />, 
      badge: pendingCount + inProgressCount,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    },
    { id: 'services', label: 'Services', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'users', label: 'User Management', icon: <UserCog className="w-5 h-5" />, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" />, adminOnly: true },
    { 
      id: 'academic', 
      label: 'SIA1 Proposal & Architecture', 
      icon: <BookOpen className="w-5 h-5" />, 
      badge: 'Academic',
      badgeColor: 'bg-indigo-600 text-white text-[10px]' 
    },
    { 
      id: 'code', 
      label: 'Python & MySQL Code', 
      icon: <FileCode2 className="w-5 h-5" />, 
      badge: 'Files',
      badgeColor: 'bg-emerald-600 text-white text-[10px]'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 font-bold text-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight tracking-tight text-white flex items-center gap-1.5">
                TechPulse
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  SIA1
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Repair Shop System</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Main Management
          </div>

          {navItems.map((item) => {
            if (item.adminOnly && currentUser?.role !== 'Admin') {
              return null;
            }

            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.badgeColor || (isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Current User Profile Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs uppercase shrink-0">
                {currentUser?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser?.full_name || 'Guest User'}
                </p>
                <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium ${
                  currentUser?.role === 'Admin' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {currentUser?.role || 'Staff'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
