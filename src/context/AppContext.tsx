import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Customer, 
  Device, 
  Payment, 
  RepairJob, 
  RepairStatus, 
  Service, 
  ShopSettings, 
  User 
} from '../types';
import { generateSeedData } from '../data/seedData';

export type ActivePage = 
  | 'dashboard' 
  | 'customers' 
  | 'devices' 
  | 'repairs' 
  | 'services' 
  | 'payments' 
  | 'reports' 
  | 'users' 
  | 'settings' 
  | 'academic'
  | 'code';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  login: (username: string, role?: 'Admin' | 'Staff') => boolean;
  logout: () => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  
  // Data entities
  customers: Customer[];
  devices: Device[];
  repairJobs: RepairJob[];
  services: Service[];
  payments: Payment[];
  users: User[];
  settings: ShopSettings;

  // CRUD Operations
  addCustomer: (data: Omit<Customer, 'id' | 'customer_code'>) => Customer;
  updateCustomer: (id: number, data: Partial<Customer>) => boolean;
  deleteCustomer: (id: number) => { success: boolean; error?: string };

  addDevice: (data: Omit<Device, 'id' | 'device_code'>) => Device;
  updateDevice: (id: number, data: Partial<Device>) => boolean;
  deleteDevice: (id: number) => { success: boolean; error?: string };

  addRepairJob: (data: Omit<RepairJob, 'id' | 'job_code' | 'status_history'>) => RepairJob;
  updateRepairJob: (id: number, data: Partial<RepairJob>, statusRemarks?: string) => boolean;
  deleteRepairJob: (id: number) => { success: boolean; error?: string };

  addService: (data: Omit<Service, 'id' | 'service_code'>) => Service;
  updateService: (id: number, data: Partial<Service>) => boolean;
  toggleServiceActive: (id: number) => void;

  recordPayment: (paymentData: {
    repair_job_id: number;
    amount_paid: number;
    payment_method: Payment['payment_method'];
    transaction_reference?: string;
    notes?: string;
  }) => { success: boolean; error?: string; payment?: Payment };

  addUser: (data: Omit<User, 'id' | 'created_at'>) => User;
  updateUser: (id: number, data: Partial<User>) => boolean;
  toggleUserStatus: (id: number) => { success: boolean; error?: string };
  deleteUser: (id: number) => { success: boolean; error?: string };

  updateSettings: (newSettings: Partial<ShopSettings>) => void;
  resetDatabase: () => void;

  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // Global search & filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'techpulse_repair_shop_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Database collections
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [repairJobs, setRepairJobs] = useState<RepairJob[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(() => {
    const seed = generateSeedData();
    return seed.settings;
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load from local storage or generate seed
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customers && parsed.customers.length >= 200) {
          setCustomers(parsed.customers);
          setDevices(parsed.devices);
          setRepairJobs(parsed.repairJobs);
          setServices(parsed.services);
          setPayments(parsed.payments);
          setUsers(parsed.users);
          setSettings(parsed.settings);
          // Default logged in as admin for convenient demonstration
          if (parsed.users && parsed.users.length > 0) {
            setCurrentUser(parsed.users[0]);
          }
          return;
        }
      }
    } catch (e) {
      console.warn("Storage load fallback:", e);
    }

    // Default Seed Initialization
    const initial = generateSeedData();
    setCustomers(initial.customers);
    setDevices(initial.devices);
    setRepairJobs(initial.repairJobs);
    setServices(initial.services);
    setPayments(initial.payments);
    setUsers(initial.users);
    setSettings(initial.settings);
    setCurrentUser(initial.users[0]);
  }, []);

  // Save changes to localStorage
  const persist = (
    c = customers, 
    d = devices, 
    r = repairJobs, 
    s = services, 
    p = payments, 
    u = users, 
    st = settings
  ) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        customers: c,
        devices: d,
        repairJobs: r,
        services: s,
        payments: p,
        users: u,
        settings: st
      }));
    } catch (e) {
      console.error("Storage persist error:", e);
    }
  };

  const login = (username: string): boolean => {
    const found = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (found) {
      if (found.status === 'Inactive') {
        showToast("Account is inactive. Contact the system administrator.", "error");
        return false;
      }
      setCurrentUser(found);
      showToast(`Welcome back, ${found.full_name}! (${found.role})`, "success");
      return true;
    }
    showToast("Invalid credentials. Please check your username.", "error");
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast("You have been securely logged out.", "info");
  };

  const resetDatabase = () => {
    const seed = generateSeedData();
    setCustomers(seed.customers);
    setDevices(seed.devices);
    setRepairJobs(seed.repairJobs);
    setServices(seed.services);
    setPayments(seed.payments);
    setUsers(seed.users);
    setSettings(seed.settings);
    setCurrentUser(seed.users[0]);
    persist(seed.customers, seed.devices, seed.repairJobs, seed.services, seed.payments, seed.users, seed.settings);
    showToast("Database successfully re-seeded with 200+ realistic records!", "success");
  };

  // Customer CRUD
  const addCustomer = (data: Omit<Customer, 'id' | 'customer_code'>): Customer => {
    const nextId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const newCust: Customer = {
      ...data,
      id: nextId,
      customer_code: `CUST-${String(nextId).padStart(4, '0')}`
    };
    const updated = [newCust, ...customers];
    setCustomers(updated);
    persist(updated);
    showToast(`Customer ${newCust.full_name} registered successfully!`, "success");
    return newCust;
  };

  const updateCustomer = (id: number, data: Partial<Customer>): boolean => {
    const updated = customers.map(c => c.id === id ? { ...c, ...data } : c);
    setCustomers(updated);
    persist(updated);
    showToast("Customer details updated successfully.", "success");
    return true;
  };

  const deleteCustomer = (id: number): { success: boolean; error?: string } => {
    // Check dependent repair records
    const hasRepairs = repairJobs.some(r => r.customer_id === id);
    if (hasRepairs) {
      showToast("Cannot delete customer with active or past repair job records.", "error");
      return { success: false, error: "Cannot delete customer with dependent repair records." };
    }
    const hasDevices = devices.some(d => d.customer_id === id);
    if (hasDevices) {
      showToast("Cannot delete customer with registered devices. Delete devices first.", "error");
      return { success: false, error: "Cannot delete customer with registered devices." };
    }
    const updated = customers.filter(c => c.id !== id);
    setCustomers(updated);
    persist(updated);
    showToast("Customer deleted successfully.", "success");
    return { success: true };
  };

  // Device CRUD
  const addDevice = (data: Omit<Device, 'id' | 'device_code'>): Device => {
    const nextId = devices.length > 0 ? Math.max(...devices.map(d => d.id)) + 1 : 1;
    const cust = customers.find(c => c.id === data.customer_id);
    const newDev: Device = {
      ...data,
      id: nextId,
      device_code: `DEV-${String(nextId).padStart(4, '0')}`,
      customer_name: cust ? cust.full_name : 'Unknown Customer'
    };
    const updated = [newDev, ...devices];
    setDevices(updated);
    persist(undefined, updated);
    showToast(`Device ${newDev.brand} ${newDev.model} registered successfully!`, "success");
    return newDev;
  };

  const updateDevice = (id: number, data: Partial<Device>): boolean => {
    const updated = devices.map(d => d.id === id ? { ...d, ...data } : d);
    setDevices(updated);
    persist(undefined, updated);
    showToast("Device information updated.", "success");
    return true;
  };

  const deleteDevice = (id: number): { success: boolean; error?: string } => {
    const hasRepairs = repairJobs.some(r => r.device_id === id);
    if (hasRepairs) {
      showToast("Cannot delete device associated with repair job records.", "error");
      return { success: false, error: "Cannot delete device associated with repair job records." };
    }
    const updated = devices.filter(d => d.id !== id);
    setDevices(updated);
    persist(undefined, updated);
    showToast("Device deleted successfully.", "success");
    return { success: true };
  };

  // Repair Job CRUD
  const addRepairJob = (data: Omit<RepairJob, 'id' | 'job_code' | 'status_history'>): RepairJob => {
    const nextId = repairJobs.length > 0 ? Math.max(...repairJobs.map(r => r.id)) + 1 : 1;
    const jobCode = `JOB-${String(nextId).padStart(4, '0')}`;
    const newJob: RepairJob = {
      ...data,
      id: nextId,
      job_code: jobCode,
      total_repair_cost: data.labor_cost + data.parts_cost,
      status_history: [
        {
          id: Date.now(),
          repair_job_id: nextId,
          old_status: 'Pending',
          new_status: data.repair_status,
          changed_by: currentUser?.full_name || 'System Admin',
          remarks: "Repair job intake created.",
          changed_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      ]
    };

    const updatedJobs = [newJob, ...repairJobs];
    setRepairJobs(updatedJobs);

    // Create initial unpaid payment record
    const nextPayId = payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1;
    const initialPayment: Payment = {
      id: nextPayId,
      payment_code: `PAY-${String(nextPayId).padStart(4, '0')}`,
      repair_job_id: newJob.id,
      job_code: newJob.job_code,
      customer_id: newJob.customer_id,
      customer_name: newJob.customer_name,
      payment_date: newJob.date_received,
      amount_paid: 0,
      payment_method: 'Cash',
      remaining_balance: newJob.total_repair_cost,
      payment_status: 'Unpaid',
      transaction_reference: 'N/A - PENDING',
      notes: 'Initial billing created on intake.'
    };
    const updatedPayments = [initialPayment, ...payments];
    setPayments(updatedPayments);

    persist(undefined, undefined, updatedJobs, undefined, updatedPayments);
    showToast(`Repair Job ${newJob.job_code} logged successfully!`, "success");
    return newJob;
  };

  const updateRepairJob = (id: number, data: Partial<RepairJob>, statusRemarks?: string): boolean => {
    const existing = repairJobs.find(r => r.id === id);
    if (!existing) return false;

    let updatedHistory = existing.status_history || [];
    if (data.repair_status && data.repair_status !== existing.repair_status) {
      updatedHistory = [
        ...updatedHistory,
        {
          id: Date.now(),
          repair_job_id: id,
          old_status: existing.repair_status,
          new_status: data.repair_status,
          changed_by: currentUser?.full_name || 'System Staff',
          remarks: statusRemarks || `Status updated from ${existing.repair_status} to ${data.repair_status}`,
          changed_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      ];
    }

    const newLabor = data.labor_cost !== undefined ? data.labor_cost : existing.labor_cost;
    const newParts = data.parts_cost !== undefined ? data.parts_cost : existing.parts_cost;
    const newTotal = newLabor + newParts;

    const updatedJobs = repairJobs.map(r => {
      if (r.id === id) {
        return {
          ...r,
          ...data,
          total_repair_cost: newTotal,
          status_history: updatedHistory
        };
      }
      return r;
    });

    setRepairJobs(updatedJobs);
    persist(undefined, undefined, updatedJobs);
    showToast(`Repair Job ${existing.job_code} updated!`, "success");
    return true;
  };

  const deleteRepairJob = (id: number): { success: boolean; error?: string } => {
    const hasPaidPayments = payments.some(p => p.repair_job_id === id && p.amount_paid > 0);
    if (hasPaidPayments) {
      showToast("Cannot delete repair job with recorded payments.", "error");
      return { success: false, error: "Cannot delete repair job with recorded payments." };
    }
    const updatedJobs = repairJobs.filter(r => r.id !== id);
    const updatedPayments = payments.filter(p => p.repair_job_id !== id);
    setRepairJobs(updatedJobs);
    setPayments(updatedPayments);
    persist(undefined, undefined, updatedJobs, undefined, updatedPayments);
    showToast("Repair job deleted.", "success");
    return { success: true };
  };

  // Services CRUD
  const addService = (data: Omit<Service, 'id' | 'service_code'>): Service => {
    const nextId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    const newSrv: Service = {
      ...data,
      id: nextId,
      service_code: `SRV-${String(nextId).padStart(3, '0')}`
    };
    const updated = [...services, newSrv];
    setServices(updated);
    persist(undefined, undefined, undefined, updated);
    showToast(`Service "${newSrv.service_name}" added to catalog!`, "success");
    return newSrv;
  };

  const updateService = (id: number, data: Partial<Service>): boolean => {
    const updated = services.map(s => s.id === id ? { ...s, ...data } : s);
    setServices(updated);
    persist(undefined, undefined, undefined, updated);
    showToast("Service catalog updated.", "success");
    return true;
  };

  const toggleServiceActive = (id: number) => {
    const target = services.find(s => s.id === id);
    if (!target) return;
    const updated = services.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s);
    setServices(updated);
    persist(undefined, undefined, undefined, updated);
    showToast(`Service "${target.service_name}" ${target.is_active ? 'deactivated' : 'activated'}.`, "info");
  };

  // Payments Management
  const recordPayment = (params: {
    repair_job_id: number;
    amount_paid: number;
    payment_method: Payment['payment_method'];
    transaction_reference?: string;
    notes?: string;
  }): { success: boolean; error?: string; payment?: Payment } => {
    const job = repairJobs.find(r => r.id === params.repair_job_id);
    if (!job) {
      showToast("Repair job not found.", "error");
      return { success: false, error: "Repair job not found" };
    }

    // Calculate existing valid payments for this job
    const existingPaymentsForJob = payments.filter(p => p.repair_job_id === job.id && p.payment_status !== 'Refunded');
    const totalAlreadyPaid = existingPaymentsForJob.reduce((sum, p) => sum + p.amount_paid, 0);
    const currentRemaining = Math.max(0, job.total_repair_cost - totalAlreadyPaid);

    if (params.amount_paid <= 0) {
      showToast("Payment amount must be greater than 0.", "error");
      return { success: false, error: "Amount must be greater than 0" };
    }

    if (params.amount_paid > currentRemaining) {
      showToast(`Amount exceeds outstanding balance (₱${currentRemaining.toLocaleString()}).`, "error");
      return { success: false, error: "Amount exceeds outstanding balance" };
    }

    const newRemaining = currentRemaining - params.amount_paid;
    const payStatus: Payment['payment_status'] = newRemaining <= 0 ? 'Paid' : 'Partially Paid';

    const nextId = payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1;
    const newPayment: Payment = {
      id: nextId,
      payment_code: `PAY-${String(nextId).padStart(4, '0')}`,
      repair_job_id: job.id,
      job_code: job.job_code,
      customer_id: job.customer_id,
      customer_name: job.customer_name,
      payment_date: new Date().toISOString().split('T')[0],
      amount_paid: params.amount_paid,
      payment_method: params.payment_method,
      remaining_balance: newRemaining,
      payment_status: payStatus,
      transaction_reference: params.transaction_reference || `REF-${params.payment_method.toUpperCase().substring(0, 3)}-${Date.now().toString().slice(-6)}`,
      notes: params.notes || `Payment received via ${params.payment_method}`
    };

    const updatedPayments = [newPayment, ...payments];
    setPayments(updatedPayments);

    // If fully paid and status was Completed, can be marked Released if user chooses
    persist(undefined, undefined, undefined, undefined, updatedPayments);
    showToast(`Payment of ₱${params.amount_paid.toLocaleString()} recorded! Remaining: ₱${newRemaining.toLocaleString()}`, "success");

    return { success: true, payment: newPayment };
  };

  // User Management
  const addUser = (data: Omit<User, 'id' | 'created_at'>): User => {
    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
      ...data,
      id: nextId,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    const updated = [...users, newUser];
    setUsers(updated);
    persist(undefined, undefined, undefined, undefined, undefined, updated);
    showToast(`Staff user ${newUser.full_name} created successfully!`, "success");
    return newUser;
  };

  const updateUser = (id: number, data: Partial<User>): boolean => {
    const updated = users.map(u => u.id === id ? { ...u, ...data } : u);
    setUsers(updated);
    persist(undefined, undefined, undefined, undefined, undefined, updated);
    showToast("User account details updated.", "success");
    return true;
  };

  const toggleUserStatus = (id: number): { success: boolean; error?: string } => {
    const target = users.find(u => u.id === id);
    if (!target) return { success: false, error: "User not found" };

    // Prevent deactivating the last active Admin
    if (target.role === 'Admin' && target.status === 'Active') {
      const activeAdmins = users.filter(u => u.role === 'Admin' && u.status === 'Active');
      if (activeAdmins.length <= 1) {
        showToast("Security Violation: Cannot deactivate the last active Administrator account.", "error");
        return { success: false, error: "Cannot deactivate the last active administrator." };
      }
    }

    const updated = users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } as User : u);
    setUsers(updated);
    persist(undefined, undefined, undefined, undefined, undefined, updated);
    showToast(`User ${target.username} is now ${target.status === 'Active' ? 'Inactive' : 'Active'}.`, "info");
    return { success: true };
  };

  const deleteUser = (id: number): { success: boolean; error?: string } => {
    const target = users.find(u => u.id === id);
    if (!target) return { success: false, error: "User not found" };

    if (target.role === 'Admin') {
      const activeAdmins = users.filter(u => u.role === 'Admin' && u.id !== id);
      if (activeAdmins.length < 1) {
        showToast("Security Violation: Cannot delete the last Administrator account.", "error");
        return { success: false, error: "Cannot delete the last administrator." };
      }
    }

    if (currentUser?.id === id) {
      showToast("Cannot delete your currently logged-in account.", "error");
      return { success: false, error: "Cannot delete current logged-in user" };
    }

    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    persist(undefined, undefined, undefined, undefined, undefined, updated);
    showToast(`User account ${target.username} deleted.`, "success");
    return { success: true };
  };

  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    persist(undefined, undefined, undefined, undefined, undefined, undefined, updated);
    showToast("Shop settings saved successfully.", "success");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        activePage,
        setActivePage,
        customers,
        devices,
        repairJobs,
        services,
        payments,
        users,
        settings,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addDevice,
        updateDevice,
        deleteDevice,
        addRepairJob,
        updateRepairJob,
        deleteRepairJob,
        addService,
        updateService,
        toggleServiceActive,
        recordPayment,
        addUser,
        updateUser,
        toggleUserStatus,
        deleteUser,
        updateSettings,
        resetDatabase,
        toasts,
        showToast,
        dismissToast,
        searchTerm,
        setSearchTerm
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
