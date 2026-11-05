import React from 'react';
import { CardiacProvider, useCardiac } from './context/CardiacContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { PatientMonitoring } from './components/monitoring/PatientMonitoring';
import { LiveECG } from './components/ecg/LiveECG';
import { CardiacRiskAnalysis } from './components/risk/CardiacRiskAnalysis';
import { PatientRecords } from './components/records/PatientRecords';
import { EmergencyAlerts } from './components/alerts/EmergencyAlerts';
import { IoTHardwareSimulation } from './components/hardware/IoTHardwareSimulation';
import { PatientReports } from './components/reports/PatientReports';
import { SystemSettings } from './components/settings/SystemSettings';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, alerts, setActiveTab, medicalTheme } = useCardiac();

  // Find most recent critical unacknowledged alert for hospital banner
  const activeCriticalAlert = alerts.find(a => !a.acknowledged && a.level === 'critical');

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'monitoring':
        return <PatientMonitoring />;
      case 'ecg':
        return <LiveECG />;
      case 'risk':
        return <CardiacRiskAnalysis />;
      case 'records':
        return <PatientRecords />;
      case 'alerts':
        return <EmergencyAlerts />;
      case 'hardware':
        return <IoTHardwareSimulation />;
      case 'reports':
        return <PatientReports />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <OverviewDashboard />;
    }
  };

  // Dynamic theme background wrapper class (Red and White clinical theme)
  const themeBgClass = 
    medicalTheme === 'red' ? 'bg-[#fff7f7]' :
    medicalTheme === 'crimson-dark' ? 'bg-[#fdf2f2]' :
    medicalTheme === 'emerald' ? 'bg-[#f0fbf5]' : 'bg-[#fff5f5]';

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${themeBgClass} text-slate-800`}>
      {/* Sidebar (Desktop static & Mobile slide-over drawer) */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Header */}
        <Header />

        {/* Global Critical Alarm Banner if unacknowledged critical alert */}
        {activeCriticalAlert && activeTab !== 'alerts' && (
          <div className="no-print bg-rose-600 text-white px-4 md:px-6 py-2 flex items-center justify-between text-xs font-medium shadow-sm shrink-0">
            <div className="flex items-center gap-2 truncate pr-2">
              <AlertTriangle className="w-4 h-4 text-white shrink-0" />
              <span className="truncate">
                <strong>CRITICAL ALARM:</strong> {activeCriticalAlert.title} ({activeCriticalAlert.patientName} · {activeCriticalAlert.room})
              </span>
            </div>
            <button
              onClick={() => setActiveTab('alerts')}
              className="px-2.5 py-1 bg-white text-rose-700 font-bold rounded hover:bg-rose-50 transition-colors flex items-center gap-1 shrink-0 text-[11px]"
            >
              Respond <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Viewport Content with padding for mobile bottom bar */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveModule()}
          </div>
        </main>

        {/* Fixed Mobile Bottom Navigation Bar (Visible on mobile only) */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CardiacProvider>
      <MainContent />
    </CardiacProvider>
  );
}
