import React, { useEffect } from 'react';
import { 
  Activity, 
  Users, 
  HeartPulse, 
  BrainCircuit, 
  FolderHeart, 
  AlertTriangle, 
  Cpu, 
  FileText, 
  Settings,
  ShieldCheck,
  Radio,
  X,
  Heart
} from 'lucide-react';
import { useCardiac } from '../../context/CardiacContext';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeAlertCount, 
    iotDevice,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    medicalTheme
  } = useCardiac();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'monitoring', label: 'Patient Monitoring', icon: HeartPulse },
    { id: 'ecg', label: 'Live ECG', icon: Radio },
    { id: 'risk', label: 'Cardiac Risk Analysis', icon: BrainCircuit },
    { id: 'records', label: 'Patient Records', icon: FolderHeart },
    { 
      id: 'alerts', 
      label: 'Emergency Alerts', 
      icon: AlertTriangle, 
      badge: activeAlertCount > 0 ? activeAlertCount : undefined,
      badgeColor: 'bg-rose-500 text-white' 
    },
    { 
      id: 'hardware', 
      label: 'IoT Hardware Simulation', 
      icon: Cpu,
      statusDot: iotDevice.online ? 'bg-emerald-400' : 'bg-amber-400'
    },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsMobileMenuOpen]);

  const handleSelectNav = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Element */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#8b1414] text-red-100 flex flex-col shrink-0 border-r border-red-950/40 select-none transition-transform duration-300 ease-in-out shadow-lg ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-red-900/60 bg-[#750e0e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-red-600 shadow-md">
              <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
                CardioCare
                <span className="text-[10px] font-bold text-white uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-950/60 border border-white/20">
                  CLINICAL
                </span>
              </div>
              <div className="text-[11px] text-red-200 font-medium truncate max-w-[140px]">
                IoT & Deep Learning MNN
              </div>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 text-red-200 hover:text-white rounded-lg hover:bg-red-800 transition-colors"
            title="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-200/80 px-3 pb-2 pt-1">
            Clinical Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group min-h-[44px] ${
                  isActive
                    ? 'bg-white text-red-700 shadow-md shadow-red-950/20'
                    : 'text-red-100 hover:text-white hover:bg-red-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-red-600' : 'text-red-200 group-hover:text-white'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.statusDot && (
                    <span className={`w-2 h-2 rounded-full ${item.statusDot}`} title={iotDevice.online ? 'Online' : 'Offline'} />
                  )}
                  {item.badge !== undefined && (
                    <span className={`text-xs px-2 py-0.5 font-bold rounded-full ${
                      isActive ? 'bg-red-600 text-white' : item.badgeColor
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* IoT Hardware Telemetry Node Mini-Status */}
        <div className="p-3 m-3 rounded-lg bg-[#750e0e] border border-red-900 text-xs">
          <div className="flex items-center justify-between text-red-200 mb-1.5">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Cpu className="w-3.5 h-3.5 text-red-200" />
              ESP32 Node Bridge
            </span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
              iotDevice.online ? 'text-white bg-emerald-700' : 'text-white bg-amber-700'
            }`}>
              {iotDevice.online ? 'Online' : 'Buffered'}
            </span>
          </div>
          <div className="flex justify-between text-[11px] text-red-200">
            <span>Battery: <strong className="text-white">{iotDevice.batteryLevel}%</strong></span>
            <span>WiFi: <strong className="text-white">{iotDevice.wifiRssi} dBm</strong></span>
          </div>
          {iotDevice.pendingSyncQueue > 0 && (
            <div className="mt-1 text-[10px] text-amber-200 font-medium">
              Packets: {iotDevice.pendingSyncQueue} queued (Flash)
            </div>
          )}
        </div>

        {/* Clinical Platform Footer */}
        <div className="p-3 border-t border-red-900/60 flex items-center justify-between text-[11px] text-red-200 bg-[#750e0e]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-red-300" />
            <span>IEEE Healthcare IoT</span>
          </div>
          <span className="font-mono text-[10px] text-red-300">v2.4.1</span>
        </div>
      </aside>
    </>
  );
};
