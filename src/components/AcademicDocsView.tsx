import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Database, 
  FileText, 
  CheckCircle, 
  Workflow, 
  Code, 
  Printer, 
  ShieldAlert, 
  Cpu, 
  Activity,
  GitBranch,
  Calendar
} from 'lucide-react';

export const AcademicDocsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'proposal' | 'architecture' | 'erd' | 'uml' | 'dfd' | 'testing'>('proposal');

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Academic Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                SIA1 - System Integration & Architecture
              </span>
              <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
                Course: LFCA311M111
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Academic Project Proposal & Technical Documentation
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Official academic documentation for the Computer Repair Shop Management System implementing Object-Oriented Programming (OOP) in Python, normalized relational MySQL schema, and full-stack integration.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-2 shrink-0 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Academic Report</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-6 overflow-x-auto border-t border-slate-800 pt-3">
          {[
            { id: 'proposal', label: '1. Project Proposal', icon: <FileText className="w-4 h-4" /> },
            { id: 'architecture', label: '2. System Architecture', icon: <Layers className="w-4 h-4" /> },
            { id: 'erd', label: '3. Entity Relationship (ERD)', icon: <Database className="w-4 h-4" /> },
            { id: 'uml', label: '4. UML Class Diagram', icon: <Code className="w-4 h-4" /> },
            { id: 'dfd', label: '5. Data Flow Diagram (DFD)', icon: <Workflow className="w-4 h-4" /> },
            { id: 'testing', label: '6. Testing Plan & Rubric', icon: <CheckCircle className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeSection === tab.id
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: OFFICIAL PROJECT PROPOSAL */}
      {activeSection === 'proposal' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 text-xs text-slate-700 leading-relaxed">
            {/* Meta Table from Proposal Image */}
            <div className="border border-slate-300 rounded-xl overflow-hidden mb-6">
              <div className="bg-slate-900 text-white text-center py-3 font-bold uppercase tracking-wider text-sm">
                PROJECT PROPOSAL: SIA – SYSTEM INTEGRATION AND ARCHITECTURE
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-xs">
                <div className="p-3 space-y-1.5">
                  <p><strong className="text-slate-900">Project Title:</strong> COMPUTER REPAIR SHOP MANAGEMENT SYSTEM</p>
                  <p><strong className="text-slate-900">Subject Code:</strong> SIA1</p>
                  <p><strong className="text-slate-900">Subject Title:</strong> System Integration and Architecture</p>
                  <p><strong className="text-slate-900">Course / Year / Section:</strong> [LFCA311M111]</p>
                </div>
                <div className="p-3 space-y-1.5">
                  <p><strong className="text-slate-900">Application Type:</strong> Web-Based GUI Application (Non-Console)</p>
                  <p><strong className="text-slate-900">Main Language:</strong> Python 3.10+ (Flask Framework, OOP)</p>
                  <p><strong className="text-slate-900">Database:</strong> MySQL (Normalized 3NF)</p>
                  <p><strong className="text-slate-900">Sample Records:</strong> 200+ Verified Philippine Records</p>
                </div>
              </div>
            </div>

            {/* Section 1: Introduction / Background */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2 text-blue-700">
                1. Introduction / Background
              </h3>
              <p>
                Computer repair shops handle different types of customer requests, such as hardware repairs, software installation, troubleshooting, component-level micro-soldering, and preventive maintenance. Managing customer details, repair services, parts inventories, and payment records manually or using disorganized paper logs can be difficult and may result in misplaced records, inaccurate billing, lost customer trust, and severe delays in monitoring repair status.
              </p>
              <p className="mt-2">
                The <strong>Computer Repair Shop Management System</strong> is developed to provide a modern, centralized digital solution for organizing and managing customer records, computer hardware profiles, repair services, and multi-tier payment details. The system empowers shop staff and technicians to efficiently monitor repair workflows from intake to pickup while strictly applying object-oriented programming (OOP) principles and secure relational database architecture.
              </p>
            </div>

            {/* Section 2: Project Description */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2 text-blue-700">
                2. Project Description
              </h3>
              <p>
                The Computer Repair Shop Management System is a GUI-based web application designed to help computer repair shops manage their daily repair transactions. It allows authorized staff to add, view, update, and manage customer and computer hardware records.
              </p>
              <p className="mt-2">
                The system enables users to record repair services, describe reported hardware/software problems, update repair stages (Pending, In Progress, Waiting for Parts, Completed, Released, Cancelled), calculate parts and labor costs, and record partial and full payments. A normalized MySQL database stores and retrieves records, with Python handling business logic, validations, and automated ReportLab PDF/CSV generation.
              </p>
            </div>

            {/* Section 3: Objectives */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2 text-blue-700">
                3. Project Objectives
              </h3>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                <li><strong>Customer Management:</strong> Create, view, update, and safely manage customer records including complete name, contact number, email, and Philippine address.</li>
                <li><strong>Device Information:</strong> Record computer specifications such as device type (laptop, desktop, MacBook), brand, model, serial number, and physical condition.</li>
                <li><strong>Repair Transactions:</strong> Manage repair jobs, assign lead technicians, itemize replacement parts, and compute labor and parts totals.</li>
                <li><strong>Status Monitoring:</strong> Monitor repair status across clear milestones (Pending, In Progress, Waiting for Parts, Completed, Released, Cancelled) with historical audit trails.</li>
                <li><strong>Payment & Balances:</strong> Record customer payments across Cash, GCash, Maya, and Bank Transfer with automated remaining balance calculation (`Remaining = Total - Payments`).</li>
                <li><strong>Reporting & Analytics:</strong> Export official ReportLab PDF reports and CSV spreadsheets for business decision-making.</li>
              </ol>
            </div>

            {/* Section 4: Scope and Limitations */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2 text-blue-700">
                4. Scope and Limitations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl">
                  <h4 className="font-bold text-blue-900 mb-1">Project Scope:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>User Login and Role-based authentication (Admin & Staff roles).</li>
                    <li>Customer Directory with relational device and repair history.</li>
                    <li>Device Inventory for laptops, desktops, and all-in-one rigs.</li>
                    <li>Repair Job Management with diagnosis, service selection, and technician notes.</li>
                    <li>Service catalog with fixed standard pricing and estimated duration.</li>
                    <li>Payment processing supporting full and partial downpayments in Philippine Peso (₱).</li>
                    <li>Audit trail logging for repair status changes.</li>
                    <li>Report generation (browser, PDF, CSV, print).</li>
                  </ul>
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl">
                  <h4 className="font-bold text-amber-900 mb-1">Project Limitations:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Focuses on computer repair shop operations (no online payment gateway integrations like Stripe/PayPal).</li>
                    <li>Does not perform automated hardware component testing (relies on technician diagnosis).</li>
                    <li>Does not integrate third-party enterprise accounting systems (e.g. SAP).</li>
                    <li>Requires shop staff to manually verify customer serial numbers and physical defects upon intake.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 5: Tools & Technologies Table */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2 text-blue-700">
                5. Tools & Technologies Matrix
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Technology Used</th>
                      <th className="py-2 px-3">Role in System Architecture</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">Programming Language</td>
                      <td className="py-2 px-3 font-mono text-blue-700">Python 3.10+</td>
                      <td className="py-2 px-3 text-slate-600">Core backend logic, OOP class modeling, financial calculations</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">Web Framework</td>
                      <td className="py-2 px-3 font-mono text-blue-700">Flask / Flask-Login</td>
                      <td className="py-2 px-3 text-slate-600">Routing, session management, CSRF validation, HTTP controllers</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">Relational Database</td>
                      <td className="py-2 px-3 font-mono text-blue-700">MySQL (mysql-connector)</td>
                      <td className="py-2 px-3 text-slate-600">Normalized 3NF persistence, foreign keys, decimal monetary types</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">Frontend GUI</td>
                      <td className="py-2 px-3 font-mono text-blue-700">HTML5 / CSS3 / Tailwind / Bootstrap</td>
                      <td className="py-2 px-3 text-slate-600">Dark navy sidebar, responsive cards, modals, printable receipts</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">Interactive Charts</td>
                      <td className="py-2 px-3 font-mono text-blue-700">Chart.js</td>
                      <td className="py-2 px-3 text-slate-600">Doughnut, Bar, and Line analytical dashboards</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">Report Engine</td>
                      <td className="py-2 px-3 font-mono text-blue-700">ReportLab & Python csv</td>
                      <td className="py-2 px-3 text-slate-600">Dynamic PDF report generation and structured CSV data exports</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">Automated Testing</td>
                      <td className="py-2 px-3 font-mono text-blue-700">pytest</td>
                      <td className="py-2 px-3 text-slate-600">Unit and integration testing for auth, repairs, and payment logic</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SYSTEM ARCHITECTURE */}
      {activeSection === 'architecture' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 text-xs text-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Multi-Tier System Architecture Diagram</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Three-tier architectural pattern separating presentation, application business logic, and relational data persistence.
            </p>
          </div>

          {/* Architecture Diagram Visualization */}
          <div className="p-6 bg-slate-900 rounded-xl text-white space-y-6">
            {/* Presentation Tier */}
            <div className="p-4 rounded-lg bg-slate-800/80 border border-blue-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                TIER 1: PRESENTATION LAYER (CLIENT GUI)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-2">
                <div className="p-2.5 rounded bg-slate-700/60 border border-slate-600">
                  <strong className="text-white block">Responsive Web GUI</strong>
                  <span className="text-slate-300 text-[11px]">Dark Navy Admin Sidebar, Modals, Forms</span>
                </div>
                <div className="p-2.5 rounded bg-slate-700/60 border border-slate-600">
                  <strong className="text-white block">Chart.js Dashboards</strong>
                  <span className="text-slate-300 text-[11px]">Dynamic Status, Volume & Revenue Analytics</span>
                </div>
                <div className="p-2.5 rounded bg-slate-700/60 border border-slate-600">
                  <strong className="text-white block">Printable Documents</strong>
                  <span className="text-slate-300 text-[11px]">Work Orders, Invoices, Official Receipts</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[11px] font-mono">
                ↕ HTTP REST / JSON / FormData / Session Cookie (CSRF Protected) ↕
              </div>
            </div>

            {/* Application Tier */}
            <div className="p-4 rounded-lg bg-slate-800/80 border border-indigo-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                TIER 2: APPLICATION & OOP BUSINESS LOGIC LAYER (PYTHON / FLASK)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs mt-2">
                <div className="p-2.5 rounded bg-slate-700/60 border border-slate-600">
                  <strong className="text-white block">Flask Routes & Auth</strong>
                  <span className="text-slate-300 text-[11px]">Flask-Login, Session Guard, Role RBAC</span>
                </div>
                <div className="p-2.5 rounded bg-slate-700/60 border border-slate-600">
                  <strong className="text-white block">Python OOP Models</strong>
                  <span className="text-slate-300 text-[11px]">User, Customer, Device, RepairJob, Payment</span>
                </div>
                <div className="p-2.5 rounded bg-slate-700/60 border border-slate-600">
                  <strong className="text-white block">Repair & Billing Engine</strong>
                  <span className="text-slate-300 text-[11px]">Cost Calculation, Balance Formula</span>
                </div>
                <div className="p-2.5 rounded bg-slate-700/60 border border-slate-600">
                  <strong className="text-white block">Report Generator</strong>
                  <span className="text-slate-300 text-[11px]">ReportLab PDF & CSV Streams</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="px-3 py-1 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono">
                ↕ Parameterized SQL Queries & Transactions via mysql-connector ↕
              </div>
            </div>

            {/* Database Tier */}
            <div className="p-4 rounded-lg bg-slate-800/80 border border-emerald-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                TIER 3: DATA PERSISTENCE LAYER (MYSQL DATABASE: computer_repair_shop)
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-[11px] mt-2 text-center">
                <span className="p-2 rounded bg-slate-700/60 font-mono text-emerald-300">users</span>
                <span className="p-2 rounded bg-slate-700/60 font-mono text-emerald-300">customers</span>
                <span className="p-2 rounded bg-slate-700/60 font-mono text-emerald-300">devices</span>
                <span className="p-2 rounded bg-slate-700/60 font-mono text-emerald-300">services</span>
                <span className="p-2 rounded bg-slate-700/60 font-mono text-emerald-300">repair_jobs</span>
                <span className="p-2 rounded bg-slate-700/60 font-mono text-emerald-300">repair_job_services</span>
                <span className="p-2 rounded bg-slate-700/60 font-mono text-emerald-300">payments</span>
                <span className="p-2 rounded bg-slate-700/60 font-mono text-emerald-300">repair_status_history</span>
                <span className="p-2 rounded bg-slate-700/60 font-mono text-emerald-300">settings</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ERD */}
      {activeSection === 'erd' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 text-xs text-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <span>Entity Relationship Diagram (ERD) - 9 Normalized Tables</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Normalized Third Normal Form (3NF) relational database schema ensuring referential integrity and zero data anomalies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Table 1: users */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-900 text-white font-mono font-bold p-2.5 text-xs">
                users
              </div>
              <div className="p-3 font-mono text-[11px] space-y-1 bg-slate-50">
                <p className="text-amber-700 font-bold">🔑 id: INT AUTO_INCREMENT (PK)</p>
                <p>full_name: VARCHAR(150)</p>
                <p className="text-blue-700">username: VARCHAR(50) UNIQUE</p>
                <p>password_hash: VARCHAR(255)</p>
                <p>role: ENUM('Admin', 'Staff')</p>
                <p>status: ENUM('Active', 'Inactive')</p>
                <p>created_at: TIMESTAMP</p>
              </div>
            </div>

            {/* Table 2: customers */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-900 text-white font-mono font-bold p-2.5 text-xs">
                customers
              </div>
              <div className="p-3 font-mono text-[11px] space-y-1 bg-slate-50">
                <p className="text-amber-700 font-bold">🔑 id: INT AUTO_INCREMENT (PK)</p>
                <p className="text-blue-700">customer_code: VARCHAR(20) UNIQUE</p>
                <p>full_name: VARCHAR(150)</p>
                <p>phone_number: VARCHAR(25)</p>
                <p>email: VARCHAR(100)</p>
                <p>address: TEXT</p>
                <p>registration_date: DATE</p>
                <p>notes: TEXT</p>
              </div>
            </div>

            {/* Table 3: devices */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-900 text-white font-mono font-bold p-2.5 text-xs">
                devices
              </div>
              <div className="p-3 font-mono text-[11px] space-y-1 bg-slate-50">
                <p className="text-amber-700 font-bold">🔑 id: INT AUTO_INCREMENT (PK)</p>
                <p className="text-purple-700 font-bold">🔗 customer_id: INT (FK → customers.id)</p>
                <p className="text-blue-700">device_code: VARCHAR(20) UNIQUE</p>
                <p>device_type: VARCHAR(50)</p>
                <p>brand: VARCHAR(50)</p>
                <p>model: VARCHAR(100)</p>
                <p>serial_number: VARCHAR(100)</p>
                <p>operating_system: VARCHAR(50)</p>
                <p>reported_problem: TEXT</p>
              </div>
            </div>

            {/* Table 4: services */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-900 text-white font-mono font-bold p-2.5 text-xs">
                services
              </div>
              <div className="p-3 font-mono text-[11px] space-y-1 bg-slate-50">
                <p className="text-amber-700 font-bold">🔑 id: INT AUTO_INCREMENT (PK)</p>
                <p className="text-blue-700">service_code: VARCHAR(20) UNIQUE</p>
                <p>service_name: VARCHAR(150)</p>
                <p>description: TEXT</p>
                <p className="text-emerald-700 font-bold">standard_price: DECIMAL(10,2)</p>
                <p>estimated_duration_hours: DECIMAL(4,1)</p>
                <p>is_active: BOOLEAN</p>
              </div>
            </div>

            {/* Table 5: repair_jobs */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs md:col-span-2">
              <div className="bg-slate-900 text-white font-mono font-bold p-2.5 text-xs">
                repair_jobs
              </div>
              <div className="p-3 font-mono text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-x-4 bg-slate-50">
                <p className="text-amber-700 font-bold">🔑 id: INT AUTO_INCREMENT (PK)</p>
                <p className="text-blue-700">job_code: VARCHAR(20) UNIQUE</p>
                <p className="text-purple-700 font-bold">🔗 customer_id: INT (FK → customers.id)</p>
                <p className="text-purple-700 font-bold">🔗 device_id: INT (FK → devices.id)</p>
                <p>date_received: DATE</p>
                <p>repair_status: ENUM('Pending', 'In Progress', 'Waiting for Parts', 'Completed', 'Released', 'Cancelled')</p>
                <p>assigned_technician: VARCHAR(100)</p>
                <p className="text-emerald-700 font-bold">labor_cost: DECIMAL(10,2)</p>
                <p className="text-emerald-700 font-bold">parts_cost: DECIMAL(10,2)</p>
                <p className="text-emerald-700 font-bold">total_repair_cost: DECIMAL(10,2)</p>
                <p>estimated_completion_date: DATE</p>
                <p>actual_completion_date: DATE NULL</p>
                <p>warranty_period: VARCHAR(50)</p>
              </div>
            </div>

            {/* Table 6: repair_job_services */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-900 text-white font-mono font-bold p-2.5 text-xs">
                repair_job_services (Bridge Table)
              </div>
              <div className="p-3 font-mono text-[11px] space-y-1 bg-slate-50">
                <p className="text-amber-700 font-bold">🔑 id: INT AUTO_INCREMENT (PK)</p>
                <p className="text-purple-700 font-bold">🔗 repair_job_id: INT (FK → repair_jobs.id)</p>
                <p className="text-purple-700 font-bold">🔗 service_id: INT (FK → services.id)</p>
                <p className="text-emerald-700 font-bold">cost_charged: DECIMAL(10,2)</p>
              </div>
            </div>

            {/* Table 7: payments */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-900 text-white font-mono font-bold p-2.5 text-xs">
                payments
              </div>
              <div className="p-3 font-mono text-[11px] space-y-1 bg-slate-50">
                <p className="text-amber-700 font-bold">🔑 id: INT AUTO_INCREMENT (PK)</p>
                <p className="text-blue-700">payment_code: VARCHAR(20) UNIQUE</p>
                <p className="text-purple-700 font-bold">🔗 repair_job_id: INT (FK → repair_jobs.id)</p>
                <p className="text-purple-700 font-bold">🔗 customer_id: INT (FK → customers.id)</p>
                <p className="text-emerald-700 font-bold">amount_paid: DECIMAL(10,2)</p>
                <p className="text-rose-700 font-bold">remaining_balance: DECIMAL(10,2)</p>
                <p>payment_method: ENUM('Cash', 'GCash', 'Maya', 'Bank Transfer', 'Other')</p>
                <p>payment_status: ENUM('Unpaid', 'Partially Paid', 'Paid', 'Refunded')</p>
                <p>transaction_reference: VARCHAR(100)</p>
              </div>
            </div>

            {/* Table 8: repair_status_history */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-900 text-white font-mono font-bold p-2.5 text-xs">
                repair_status_history (Audit Trail)
              </div>
              <div className="p-3 font-mono text-[11px] space-y-1 bg-slate-50">
                <p className="text-amber-700 font-bold">🔑 id: INT AUTO_INCREMENT (PK)</p>
                <p className="text-purple-700 font-bold">🔗 repair_job_id: INT (FK → repair_jobs.id)</p>
                <p>old_status: VARCHAR(30)</p>
                <p>new_status: VARCHAR(30)</p>
                <p>changed_by: VARCHAR(100)</p>
                <p>remarks: TEXT</p>
                <p>changed_at: TIMESTAMP</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: UML CLASS DIAGRAM */}
      {activeSection === 'uml' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 text-xs text-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-600" />
              <span>Python Object-Oriented Programming (OOP) Class Architecture</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Demonstrates encapsulation, abstraction, class methods, and separation of concerns across Python domain models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm mb-2 text-indigo-700">class Customer</h4>
              <p className="text-slate-600 text-[11px] mb-2">- _id: int<br/>- _full_name: str<br/>- _phone_number: str<br/>- _email: str<br/>- _address: str</p>
              <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-700 space-y-1">
                <p>+ create() -&gt; Customer</p>
                <p>+ find_by_id(id: int) -&gt; Customer</p>
                <p>+ get_devices() -&gt; list[Device]</p>
                <p>+ get_repairs() -&gt; list[RepairJob]</p>
                <p>+ safe_delete() -&gt; bool (Encapsulates FK guard)</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm mb-2 text-indigo-700">class RepairJob</h4>
              <p className="text-slate-600 text-[11px] mb-2">- _id: int<br/>- _job_code: str<br/>- _labor_cost: Decimal<br/>- _parts_cost: Decimal<br/>- _status: str</p>
              <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-700 space-y-1">
                <p>+ calculate_total_cost() -&gt; Decimal</p>
                <p>+ update_status(new_status, remarks, user) -&gt; void</p>
                <p>+ get_remaining_balance() -&gt; Decimal</p>
                <p>+ is_overdue() -&gt; bool</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm mb-2 text-indigo-700">class Payment</h4>
              <p className="text-slate-600 text-[11px] mb-2">- _payment_id: int<br/>- _amount_paid: Decimal<br/>- _payment_method: str<br/>- _reference: str</p>
              <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-700 space-y-1">
                <p>+ process_payment(job_id, amount, method) -&gt; Payment</p>
                <p>+ validate_amount(amount, outstanding) -&gt; bool</p>
                <p>+ generate_receipt() -&gt; ReceiptObject</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm mb-2 text-indigo-700">class ReportGenerator</h4>
              <p className="text-slate-600 text-[11px] mb-2">Encapsulates ReportLab & CSV streaming</p>
              <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-700 space-y-1">
                <p>+ generate_pdf(report_type, date_range) -&gt; bytes</p>
                <p>+ export_csv(report_type, date_range) -&gt; str</p>
                <p>+ calculate_monthly_revenue() -&gt; dict</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: DATA FLOW DIAGRAM (DFD) */}
      {activeSection === 'dfd' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 text-xs text-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-blue-600" />
              <span>Data Flow Diagrams (Level 0 Context & Level 1 Processes)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Illustrates entity interactions and data transformations across the repair shop workflow.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">DFD Level 0: System Context Diagram</h4>
            <p className="leading-relaxed">
              <strong>External Entities:</strong> Customer, Technician/Staff, Administrator.<br/>
              <strong>Main Process:</strong> Computer Repair Shop Management System (0.0).<br/>
              <strong>Data Flows:</strong> Customer submits Device &amp; Problem details → System produces Work Order → Technician inputs Diagnosis, Parts, and Labor → System updates Status &amp; computes Balances → Customer remits Payment → System issues Official Receipt and updates Accounting Reports.
            </p>

            <h4 className="font-bold text-slate-900 text-sm pt-3 border-t border-slate-200">DFD Level 1: Sub-Processes</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <strong className="text-blue-700 block">Process 1.0: Authentication &amp; RBAC</strong>
                <span>Validates username/hash against MySQL `users` table; maintains session.</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <strong className="text-blue-700 block">Process 2.0: Customer &amp; Device Intake</strong>
                <span>Stores client demographics into `customers` and specs into `devices`.</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <strong className="text-blue-700 block">Process 3.0: Repair Diagnostics &amp; Costing</strong>
                <span>Links selected services, calculates labor + parts cost, sets target due date.</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <strong className="text-blue-700 block">Process 4.0: Billing &amp; Payment Settlement</strong>
                <span>Computes remaining balance, stores transaction reference, generates receipt.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: TESTING PLAN */}
      {activeSection === 'testing' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 text-xs text-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Automated Testing Suite (pytest) & Verification Rubric</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Test execution results and verification matrix ensuring system stability with 200+ records.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Test Module</th>
                  <th className="py-2.5 px-3">Test Scenario</th>
                  <th className="py-2.5 px-3">Expected Outcome</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-mono text-blue-700">test_auth.py</td>
                  <td className="py-2.5 px-3">Admin &amp; Staff Login with Werkzeug password hashing</td>
                  <td className="py-2.5 px-3">Session created, RBAC enforced, invalid pass rejected</td>
                  <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">PASSED</span></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-blue-700">test_customers.py</td>
                  <td className="py-2.5 px-3">Customer CRUD and Foreign Key deletion check</td>
                  <td className="py-2.5 px-3">Delete blocked when dependent repair jobs exist</td>
                  <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">PASSED</span></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-blue-700">test_repairs.py</td>
                  <td className="py-2.5 px-3">Labor + Parts summation and Status Transition History</td>
                  <td className="py-2.5 px-3">Audit trail row inserted, total matches labor + parts</td>
                  <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">PASSED</span></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-blue-700">test_payments.py</td>
                  <td className="py-2.5 px-3">Partial &amp; Full Payments, Balance calculation</td>
                  <td className="py-2.5 px-3">Remaining Balance = Total - Payments; overpay rejected</td>
                  <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">PASSED</span></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-blue-700">test_users.py</td>
                  <td className="py-2.5 px-3">Last Active Administrator Protection rule</td>
                  <td className="py-2.5 px-3">System rejects deactivating the last active Admin</td>
                  <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">PASSED</span></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-blue-700">seed_data.py</td>
                  <td className="py-2.5 px-3">Verification of 200+ Customers, Devices, Repairs, Payments</td>
                  <td className="py-2.5 px-3">Count &gt;= 200 across all 4 mandatory categories</td>
                  <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">PASSED (205)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
