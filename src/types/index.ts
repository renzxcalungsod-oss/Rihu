export type UserRole = 'Admin' | 'Staff';

export interface User {
  id: number;
  full_name: string;
  username: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  email: string;
  created_at: string;
}

export interface Customer {
  id: number;
  customer_code: string; // e.g. CUST-001
  full_name: string;
  phone_number: string;
  email: string;
  address: string;
  registration_date: string;
  notes: string;
}

export type DeviceType = 'Laptop' | 'Desktop' | 'All-in-One' | 'MacBook / iMac' | 'Gaming PC' | 'Mini PC';

export interface Device {
  id: number;
  device_code: string; // e.g. DEV-001
  customer_id: number;
  customer_name?: string;
  device_type: DeviceType;
  brand: string;
  model: string;
  serial_number: string;
  operating_system: string;
  reported_problem: string;
  accessories_received: string;
  physical_condition: string;
  date_registered: string;
  notes: string;
}

export interface Service {
  id: number;
  service_code: string; // e.g. SRV-001
  service_name: string;
  description: string;
  standard_price: number;
  estimated_duration_hours: number;
  is_active: boolean;
}

export type RepairStatus = 
  | 'Pending'
  | 'In Progress'
  | 'Waiting for Parts'
  | 'Completed'
  | 'Released'
  | 'Cancelled';

export interface RepairJobService {
  service_id: number;
  service_name: string;
  cost_charged: number;
}

export interface RepairStatusHistory {
  id: number;
  repair_job_id: number;
  old_status: RepairStatus;
  new_status: RepairStatus;
  changed_by: string;
  remarks: string;
  changed_at: string;
}

export interface RepairJob {
  id: number;
  job_code: string; // e.g. JOB-001
  customer_id: number;
  customer_name: string;
  device_id: number;
  device_info: string; // Brand & Model
  date_received: string;
  reported_problem: string;
  initial_diagnosis: string;
  recommended_solution: string;
  assigned_technician: string;
  services_applied: RepairJobService[];
  parts_and_materials_used: string;
  labor_cost: number;
  parts_cost: number;
  total_repair_cost: number;
  estimated_completion_date: string;
  actual_completion_date: string | null;
  repair_status: RepairStatus;
  technician_notes: string;
  warranty_period: string; // e.g. "90 Days"
  status_history?: RepairStatusHistory[];
}

export type PaymentMethod = 'Cash' | 'GCash' | 'Maya' | 'Bank Transfer' | 'Other';
export type PaymentStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Refunded';

export interface Payment {
  id: number;
  payment_code: string; // e.g. PAY-001
  repair_job_id: number;
  job_code: string;
  customer_id: number;
  customer_name: string;
  payment_date: string;
  amount_paid: number;
  payment_method: PaymentMethod;
  remaining_balance: number;
  payment_status: PaymentStatus;
  transaction_reference: string;
  notes: string;
}

export interface ShopSettings {
  shop_name: string;
  shop_address: string;
  contact_number: string;
  email_address: string;
  currency: string;
  default_warranty: string;
  default_estimated_duration_days: number;
  tin_number: string;
  receipt_footer_note: string;
}
