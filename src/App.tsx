/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CustomersView } from './components/CustomersView';
import { DevicesView } from './components/DevicesView';
import { RepairsView } from './components/RepairsView';
import { ServicesView } from './components/ServicesView';
import { PaymentsView } from './components/PaymentsView';
import { ReportsView } from './components/ReportsView';
import { UsersView } from './components/UsersView';
import { SettingsView } from './components/SettingsView';
import { AcademicDocsView } from './components/AcademicDocsView';
import { CodeExplorerView } from './components/CodeExplorerView';
import { LoginPage } from './components/LoginPage';
import { NewRepairModal } from './components/NewRepairModal';
import { WorkOrderModal } from './components/WorkOrderModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const { currentUser, activePage, setActivePage } = useApp();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNewRepairModalOpen, setIsNewRepairModalOpen] = useState(false);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<number | null>(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState<number | null>(null);

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardView
            onViewRepair={(id) => {
              setActivePage('repairs');
            }}
            onViewWorkOrder={(id) => setSelectedWorkOrderId(id)}
            onViewReceipt={(id) => setSelectedReceiptId(id)}
          />
        );

      case 'customers':
        return <CustomersView />;

      case 'devices':
        return <DevicesView />;

      case 'repairs':
        return (
          <RepairsView
            onOpenNewModal={() => setIsNewRepairModalOpen(true)}
            onViewWorkOrder={(id) => setSelectedWorkOrderId(id)}
            onViewReceipt={(id) => setSelectedReceiptId(id)}
            onSelectRepairForPayment={(id) => setActivePage('payments')}
          />
        );

      case 'services':
        return <ServicesView />;

      case 'payments':
        return (
          <PaymentsView
            onViewReceipt={(jobId) => setSelectedReceiptId(jobId)}
          />
        );

      case 'reports':
        return <ReportsView />;

      case 'users':
        return <UsersView />;

      case 'settings':
        return <SettingsView />;

      case 'academic':
        return <AcademicDocsView />;

      case 'code':
        return <CodeExplorerView />;

      default:
        return (
          <DashboardView
            onViewRepair={(id) => setActivePage('repairs')}
            onViewWorkOrder={(id) => setSelectedWorkOrderId(id)}
            onViewReceipt={(id) => setSelectedReceiptId(id)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Dark Navy Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenNewRepairModal={() => setIsNewRepairModalOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <NewRepairModal
        isOpen={isNewRepairModalOpen}
        onClose={() => setIsNewRepairModalOpen(false)}
      />

      <WorkOrderModal
        repairJobId={selectedWorkOrderId}
        onClose={() => setSelectedWorkOrderId(null)}
      />

      <ReceiptModal
        repairJobId={selectedReceiptId}
        onClose={() => setSelectedReceiptId(null)}
      />

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
