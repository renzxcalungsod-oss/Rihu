import { 
  Customer, 
  Device, 
  DeviceType, 
  Payment, 
  PaymentMethod, 
  PaymentStatus, 
  RepairJob, 
  RepairStatus, 
  Service, 
  ShopSettings, 
  User 
} from '../types';

export const INITIAL_SETTINGS: ShopSettings = {
  shop_name: "TechPulse Computer & Laptop Repair Center",
  shop_address: "Unit 304, CyberHub Plaza, EDSA cor. Aurora Blvd, Cubao, Quezon City, Metro Manila",
  contact_number: "+63 (02) 8921-4567 / 0917-889-4321",
  email_address: "support@techpulserepairs.ph",
  currency: "₱",
  default_warranty: "90 Days Service Warranty",
  default_estimated_duration_days: 3,
  tin_number: "248-912-705-000",
  receipt_footer_note: "Thank you for trusting TechPulse! Free diagnostics on return within warranty period. Original receipt required for claims."
};

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    full_name: "Engr. Juan Paolo Dela Cruz",
    username: "admin",
    role: "Admin",
    status: "Active",
    email: "admin@techpulserepairs.ph",
    created_at: "2026-01-10 08:00:00"
  },
  {
    id: 2,
    full_name: "Mark Anthony Bautista",
    username: "tech_mark",
    role: "Staff",
    status: "Active",
    email: "mark.bautista@techpulserepairs.ph",
    created_at: "2026-01-12 09:15:00"
  },
  {
    id: 3,
    full_name: "Angelo Jose Soriano",
    username: "tech_angelo",
    role: "Staff",
    status: "Active",
    email: "angelo.soriano@techpulserepairs.ph",
    created_at: "2026-01-15 08:30:00"
  },
  {
    id: 4,
    full_name: "Rafael Dominic Garcia",
    username: "tech_rafael",
    role: "Staff",
    status: "Active",
    email: "rafael.garcia@techpulserepairs.ph",
    created_at: "2026-01-18 10:00:00"
  },
  {
    id: 5,
    full_name: "Kimberly Anne Flores",
    username: "staff_kim",
    role: "Staff",
    status: "Active",
    email: "kim.flores@techpulserepairs.ph",
    created_at: "2026-02-01 08:45:00"
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 1,
    service_code: "SRV-001",
    service_name: "Comprehensive Hardware & Software Diagnostic",
    description: "Full component stress test, thermal benchmarking, SMART disk integrity, RAM memory test, and motherboard voltage check.",
    standard_price: 500,
    estimated_duration_hours: 2,
    is_active: true
  },
  {
    id: 2,
    service_code: "SRV-002",
    service_name: "OS Reinstallation & System Optimization (Win 11/10/macOS)",
    description: "Clean OS install, official chipset & graphics drivers, essential productivity software, and system performance debloating.",
    standard_price: 850,
    estimated_duration_hours: 3,
    is_active: true
  },
  {
    id: 3,
    service_code: "SRV-003",
    service_name: "Deep Cleaning & Thermal Paste Repaste (High-End Arctic MX-6)",
    description: "Complete fan disassembly, heatsink dust blow-out, PCB ultrasonic wipe, and premium Arctic MX-6 thermal compound application.",
    standard_price: 950,
    estimated_duration_hours: 2,
    is_active: true
  },
  {
    id: 4,
    service_code: "SRV-004",
    service_name: "Laptop Screen / LCD Replacement Labor",
    description: "Safe bezel disassembly, eDP 30/40 pin ribbon cable routing, new LCD panel installation, and color calibration.",
    standard_price: 1200,
    estimated_duration_hours: 4,
    is_active: true
  },
  {
    id: 5,
    service_code: "SRV-005",
    service_name: "Laptop Keyboard / Upper Case Assembly Replacement",
    description: "Complete chassis disassembly, plastic rivet/screw keyboard replacement, and ribbon flex cable grounding.",
    standard_price: 1100,
    estimated_duration_hours: 3,
    is_active: true
  },
  {
    id: 6,
    service_code: "SRV-006",
    service_name: "SSD Upgrade & Full OS Drive Cloning",
    description: "M.2 NVMe / 2.5 SATA SSD installation, sector-by-sector disk clone preserving all customer files, apps, and Windows license.",
    standard_price: 750,
    estimated_duration_hours: 2,
    is_active: true
  },
  {
    id: 7,
    service_code: "SRV-007",
    service_name: "RAM Memory Upgrade & Dual Channel Setup",
    description: "DDR4 / DDR5 SODIMM / DIMM RAM module installation, XMP / EXPO bios enabling, and 2-pass MemTest86 stability check.",
    standard_price: 450,
    estimated_duration_hours: 1,
    is_active: true
  },
  {
    id: 8,
    service_code: "SRV-008",
    service_name: "Motherboard Component-Level Micro-Soldering (No Power / Short)",
    description: "Microscope schematic trace, MOSFET / capacitor / diode replacement, 19V / 3.3V / 5V rail short circuit remediation.",
    standard_price: 3200,
    estimated_duration_hours: 24,
    is_active: true
  },
  {
    id: 9,
    service_code: "SRV-009",
    service_name: "Liquid Damage Decontamination & Ultrasonic PCB Cleaning",
    description: "Immediate battery disconnection, ultrasonic isopropyl alcohol bath, corrosion scraping, solder reflow, and bake drying.",
    standard_price: 2400,
    estimated_duration_hours: 12,
    is_active: true
  },
  {
    id: 10,
    service_code: "SRV-010",
    service_name: "Malware, Ransomware & Spyware Neutralization",
    description: "Offline environment scan, registry disinfection, rootkit eradication, browser hijacker cleanup, and antivirus setup.",
    standard_price: 800,
    estimated_duration_hours: 3,
    is_active: true
  },
  {
    id: 11,
    service_code: "SRV-011",
    service_name: "Critical Data Recovery (Failing HDD / Corrupted Partition)",
    description: "Read-only RAW block recovery, bad-sector bypassing, partition table reconstruction, and transfer to customer storage drive.",
    standard_price: 2800,
    estimated_duration_hours: 16,
    is_active: true
  },
  {
    id: 12,
    service_code: "SRV-012",
    service_name: "Laptop Hinge & Chassis Epoxy Reconstruction",
    description: "Reinforced brass threaded insert anchoring, industrial epoxy welding, and hinge torque tension adjustment.",
    standard_price: 1500,
    estimated_duration_hours: 8,
    is_active: true
  },
  {
    id: 13,
    service_code: "SRV-013",
    service_name: "Laptop Battery Replacement Labor & Calibration",
    description: "Safe Li-ion pouch removal, genuine replacement battery placement, thermal pad integration, and full charge cycle calibration.",
    standard_price: 600,
    estimated_duration_hours: 2,
    is_active: true
  },
  {
    id: 14,
    service_code: "SRV-014",
    service_name: "Custom Gaming PC Assembly, Cable Management & BIOS Flash",
    description: "Component layout, AIO liquid cooler mounting, ARGB sync wiring, stealth cable lacing, and latest stable BIOS firmware flash.",
    standard_price: 1800,
    estimated_duration_hours: 5,
    is_active: true
  },
  {
    id: 15,
    service_code: "SRV-015",
    service_name: "GPU Deep Clean, Repaste & VRAM Thermal Pad Replacement",
    description: "Graphics card tear-down, copper coldplate lapping, 12.8 W/mK Gelid thermal pads installation, and Furmark stress test.",
    standard_price: 1600,
    estimated_duration_hours: 3,
    is_active: true
  },
  {
    id: 16,
    service_code: "SRV-016",
    service_name: "DC Power Jack / Type-C Charging Port Replacement",
    description: "Desoldering fractured charging connector, PCB trace jumper reinforcement, and high-amperage SMD port soldering.",
    standard_price: 1350,
    estimated_duration_hours: 4,
    is_active: true
  }
];

// Helper to deterministically seed realistic 200+ Philippine customers
const FIRST_NAMES = [
  "Juan", "Maria", "Jose", "Angelica", "Gabriel", "Christine", "Rafael", "Bea", 
  "Joshua", "Daniel", "Kathryn", "Paolo", "Alyssa", "Carlo", "Patricia", "Mark", 
  "Jasmine", "Christian", "Camille", "Angelo", "Stephanie", "Jerome", "Rochelle", 
  "Dennis", "Maricel", "Francis", "Diane", "Kevin", "Rhea", "Michael", "Erika", 
  "Anthony", "Grace", "Eduardo", "Princess", "Vicente", "Rowena", "Richard", "Sheryl", 
  "Jonathan", "Aileen", "Ronald", "Bernadette", "Lester", "Clarisse", "Arvin", "Lorna"
];

const LAST_NAMES = [
  "Dela Cruz", "Santos", "Reyes", "Alcantara", "Mendoza", "Garcia", "Bautista", 
  "Gonzales", "Ramos", "Aquino", "Torres", "Villanueva", "Castro", "Flores", 
  "Soriano", "Rivera", "Morales", "Pascual", "Navarro", "Mercado", "Tan", 
  "Lim", "Sy", "Ong", "Chua", "Perez", "Santiago", "Valdez", "Castillo", 
  "Delos Santos", "Salazar", "Manalo", "Domingo", "Estrada", "Vergara", "Aguilar"
];

const METRO_CITIES = [
  "Cubao, Quezon City", "Diliman, Quezon City", "Fairview, Quezon City", 
  "BGC, Taguig City", "Poblacion, Makati City", "San Antonio, Pasig City", 
  "Kapitolyo, Pasig City", "Sampaloc, Manila", "Malate, Manila", 
  "Greenhills, San Juan City", "Highway Hills, Mandaluyong City", 
  "BF Homes, Parañaque City", "Alabang, Muntinlupa City", 
  "Concepcion, Marikina City", "Barangka, Marikina City", 
  "Lahug, Cebu City", "IT Park, Cebu City", "Bajada, Davao City", 
  "Matina, Davao City", "Grace Park, Caloocan City"
];

const DEVICE_TEMPLATES = [
  { brand: "Acer", models: ["Nitro 5 AN515-58", "Predator Helios 300", "Aspire 5 A515", "Swift 3 SF314", "Veriton X Desktop"], os: "Windows 11 Home", type: "Laptop" as DeviceType },
  { brand: "ASUS", models: ["ROG Zephyrus G14", "TUF Gaming A15", "ZenBook 14 OLED", "VivoBook 15X", "ROG Strix GT15 Desktop"], os: "Windows 11 Pro", type: "Laptop" as DeviceType },
  { brand: "Lenovo", models: ["Legion 5 Pro 16", "ThinkPad X1 Carbon Gen 10", "IdeaPad Gaming 3", "Yoga Slim 7i Pro", "IdeaCentre AIO 3"], os: "Windows 11 Pro", type: "Laptop" as DeviceType },
  { brand: "Dell", models: ["XPS 15 9520", "G15 5520 Gaming", "Inspiron 15 3520", "Latitude 5430", "OptiPlex 7090 Micro"], os: "Windows 11 Pro", type: "Laptop" as DeviceType },
  { brand: "HP", models: ["Victus 16-d1000", "Pavilion Gaming 15", "Envy x360 13", "EliteBook 840 G8", "ProDesk 400 G7 SFF"], os: "Windows 11 Home", type: "Laptop" as DeviceType },
  { brand: "Apple", models: ["MacBook Air M2 13.6\"", "MacBook Pro 14\" M2 Pro", "MacBook Pro 16\" M1 Max", "iMac 24\" M1", "Mac Studio M2"], os: "macOS Sonoma 14.4", type: "MacBook / iMac" as DeviceType },
  { brand: "MSI", models: ["Katana 15 B13V", "Thin GF63 12VE", "Stealth 16 Studio", "Modern 14 C12M", "MAG Infinite S3"], os: "Windows 11 Home", type: "Laptop" as DeviceType },
  { brand: "Custom Built", models: ["Ryzen 7 7800X3D + RTX 4080 Rig", "Core i5-13600K + RTX 4070 Gaming PC", "Ryzen 5 5600G Office Desktop", "Core i7-12700 + GTX 1660 Super Workstation"], os: "Windows 11 Pro", type: "Gaming PC" as DeviceType }
];

const PROBLEM_PRESETS = [
  "No display on internal screen. External monitor works via HDMI. Fan spins at full speed.",
  "Spilled milk tea on keyboard while working. Device immediately powered off and smells burnt.",
  "Frequent Blue Screen of Death (BSOD) with error code WHEA_UNCORRECTABLE_ERROR during heavy load.",
  "Extremely slow performance. Booting up takes 15 minutes. 100% disk usage in task manager.",
  "Left hinge snapped when opening lid. Top cover plastics broke and ribbon cable is pinched.",
  "Battery not charging. Stuck at 0% when plugged in. Power LED blinks amber 3 times.",
  "Heavy malware and adware infection. Popups constantly appear and Chrome keeps redirecting to suspicious sites.",
  "Laptop gets burning hot to the touch. Shuts down abruptly after 20 minutes of gaming.",
  "USB Type-C charging port is loose. Only charges when cable is bent at a specific upward angle.",
  "Accidentally dropped laptop inside backpack. Glass display is cracked with multiple colored vertical lines.",
  "SSD not detected in BIOS. Screen shows 'No bootable device found. Press any key to reboot.'",
  "Keycaps sticky and multiple keys (W, A, S, D, Spacebar) do not register when typed."
];

const TECHNICIANS = [
  "Mark Anthony Bautista",
  "Angelo Jose Soriano",
  "Rafael Dominic Garcia",
  "Kimberly Anne Flores"
];

const STATUS_DISTRIBUTION: RepairStatus[] = [
  'In Progress', 'Completed', 'Completed', 'Released', 'Released', 
  'Pending', 'Waiting for Parts', 'Completed', 'Released', 'Cancelled'
];

const PAYMENT_METHODS: PaymentMethod[] = ['GCash', 'Cash', 'Maya', 'Bank Transfer', 'Cash', 'GCash'];

export function generateSeedData() {
  const customers: Customer[] = [];
  const devices: Device[] = [];
  const repairJobs: RepairJob[] = [];
  const payments: Payment[] = [];

  const totalCount = 205; // Generates over 200 records for each mandatory entity

  for (let i = 1; i <= totalCount; i++) {
    const fName = FIRST_NAMES[(i * 7) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i * 11) % LAST_NAMES.length];
    const fullName = `${fName} ${lName}`;
    const custCode = `CUST-${String(i).padStart(4, '0')}`;
    const phonePrefix = (i % 2 === 0) ? "0917" : (i % 3 === 0) ? "0928" : "0998";
    const phoneNum = `${phonePrefix}-${String(100 + (i * 37) % 900)}-${String(1000 + (i * 43) % 9000)}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase().replace(/\s+/g, '')}${i}@gmail.com`;
    const address = `#${(i * 12) % 450 + 12} ${METRO_CITIES[i % METRO_CITIES.length]}`;
    
    // Dates spread across the last 6 months
    const dayOffset = (totalCount - i) * 1;
    const regDateObj = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000);
    const regDateStr = regDateObj.toISOString().split('T')[0];

    customers.push({
      id: i,
      customer_code: custCode,
      full_name: fullName,
      phone_number: phoneNum,
      email: email,
      address: address,
      registration_date: regDateStr,
      notes: i % 5 === 0 ? "VIP Corporate Client" : i % 3 === 0 ? "Repeat Customer - Referral" : "Walk-in client"
    });

    // Generate Device for Customer
    const devTemplate = DEVICE_TEMPLATES[i % DEVICE_TEMPLATES.length];
    const devModel = devTemplate.models[i % devTemplate.models.length];
    const devCode = `DEV-${String(i).padStart(4, '0')}`;
    const serial = `${devTemplate.brand.substring(0, 3).toUpperCase()}${2024000 + (i * 19)}`;
    const problem = PROBLEM_PRESETS[i % PROBLEM_PRESETS.length];

    devices.push({
      id: i,
      device_code: devCode,
      customer_id: i,
      customer_name: fullName,
      device_type: devTemplate.type,
      brand: devTemplate.brand,
      model: devModel,
      serial_number: serial,
      operating_system: devTemplate.os,
      reported_problem: problem,
      accessories_received: i % 3 === 0 ? "Original AC Power Adapter + Laptop Sleeve" : "AC Charger & Power Cable only",
      physical_condition: i % 4 === 0 ? "Minor scratches on outer lid, rubber feet intact" : "Good aesthetic condition, normal wear and tear",
      date_registered: regDateStr,
      notes: "Serial number verified against bottom chassis label."
    });

    // Generate Repair Job for this Device & Customer
    const jobCode = `JOB-${String(i).padStart(4, '0')}`;
    const status = STATUS_DISTRIBUTION[i % STATUS_DISTRIBUTION.length];
    const tech = TECHNICIANS[i % TECHNICIANS.length];
    
    // Pick 1-2 services
    const s1 = INITIAL_SERVICES[(i * 3) % INITIAL_SERVICES.length];
    const s2 = INITIAL_SERVICES[(i * 5) % INITIAL_SERVICES.length];
    const selectedServices = (i % 2 === 0 && s1.id !== s2.id) 
      ? [
          { service_id: s1.id, service_name: s1.service_name, cost_charged: s1.standard_price },
          { service_id: s2.id, service_name: s2.service_name, cost_charged: s2.standard_price }
        ]
      : [
          { service_id: s1.id, service_name: s1.service_name, cost_charged: s1.standard_price }
        ];

    const laborCost = selectedServices.reduce((sum, s) => sum + s.cost_charged, 0);
    const partsCost = (status === 'Cancelled') ? 0 : ((i * 350) % 3500);
    const totalRepairCost = laborCost + partsCost;

    const estCompletionObj = new Date(regDateObj.getTime() + 3 * 24 * 60 * 60 * 1000);
    const estCompletionStr = estCompletionObj.toISOString().split('T')[0];
    
    const actualCompStr = (status === 'Completed' || status === 'Released') 
      ? new Date(regDateObj.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : null;

    repairJobs.push({
      id: i,
      job_code: jobCode,
      customer_id: i,
      customer_name: fullName,
      device_id: i,
      device_info: `${devTemplate.brand} ${devModel}`,
      date_received: regDateStr,
      reported_problem: problem,
      initial_diagnosis: `Confirmed issue on hardware test: ${problem.substring(0, 60)}...`,
      recommended_solution: `Perform ${selectedServices.map(s => s.service_name).join(' and ')}.`,
      assigned_technician: tech,
      services_applied: selectedServices,
      parts_and_materials_used: partsCost > 0 ? `Replacement components & thermal compound (₱${partsCost.toLocaleString()})` : "Standard shop consumables only",
      labor_cost: laborCost,
      parts_cost: partsCost,
      total_repair_cost: totalRepairCost,
      estimated_completion_date: estCompletionStr,
      actual_completion_date: actualCompStr,
      repair_status: status,
      technician_notes: `Unit inspected by ${tech}. Tested OK under baseline diagnostics.`,
      warranty_period: "90 Days Service Warranty",
      status_history: [
        {
          id: i * 10 + 1,
          repair_job_id: i,
          old_status: 'Pending',
          new_status: 'In Progress',
          changed_by: tech,
          remarks: "Job accepted, disassembled unit for diagnostic check.",
          changed_at: `${regDateStr} 10:30:00`
        },
        ...(status === 'Completed' || status === 'Released' ? [{
          id: i * 10 + 2,
          repair_job_id: i,
          old_status: 'In Progress' as RepairStatus,
          new_status: 'Completed' as RepairStatus,
          changed_by: tech,
          remarks: "All benchmarks passed with 0 errors. Ready for pickup.",
          changed_at: `${actualCompStr} 16:45:00`
        }] : [])
      ]
    });

    // Generate Payment
    const payCode = `PAY-${String(i).padStart(4, '0')}`;
    let amountPaid = 0;
    let payStatus: PaymentStatus = 'Unpaid';
    
    if (status === 'Released') {
      amountPaid = totalRepairCost;
      payStatus = 'Paid';
    } else if (status === 'Completed') {
      // 70% paid in full, 30% partially paid
      if (i % 3 === 0) {
        amountPaid = Math.round(totalRepairCost * 0.5);
        payStatus = 'Partially Paid';
      } else {
        amountPaid = totalRepairCost;
        payStatus = 'Paid';
      }
    } else if (status === 'In Progress' || status === 'Waiting for Parts') {
      // 50% deposit paid or unpaid
      if (i % 2 === 0) {
        amountPaid = Math.min(1000, totalRepairCost);
        payStatus = 'Partially Paid';
      } else {
        amountPaid = 0;
        payStatus = 'Unpaid';
      }
    } else if (status === 'Cancelled') {
      amountPaid = 0;
      payStatus = 'Unpaid';
    } else {
      amountPaid = 0;
      payStatus = 'Unpaid';
    }

    const remainingBal = Math.max(0, totalRepairCost - amountPaid);
    const payMethod = PAYMENT_METHODS[i % PAYMENT_METHODS.length];
    const payDateStr = (amountPaid > 0) 
      ? (actualCompStr || regDateStr) 
      : regDateStr;

    payments.push({
      id: i,
      payment_code: payCode,
      repair_job_id: i,
      job_code: jobCode,
      customer_id: i,
      customer_name: fullName,
      payment_date: payDateStr,
      amount_paid: amountPaid,
      payment_method: payMethod,
      remaining_balance: remainingBal,
      payment_status: payStatus,
      transaction_reference: amountPaid > 0 ? `REF-${payMethod.toUpperCase().substring(0, 3)}-${20260000 + i}` : "N/A - PENDING",
      notes: payStatus === 'Paid' ? "Settled in full upon device turnover." : payStatus === 'Partially Paid' ? "Downpayment for parts/labor." : "Awaiting customer collection."
    });
  }

  return {
    settings: INITIAL_SETTINGS,
    users: INITIAL_USERS,
    services: INITIAL_SERVICES,
    customers,
    devices,
    repairJobs,
    payments
  };
}
