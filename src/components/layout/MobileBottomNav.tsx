import React from 'react';
import { 
  Activity, 
  HeartPulse, 
  Radio, 
  BrainCircuit, 
  Cpu, 
  Menu,
  AlertTriangle
} from 'lucide-react';
import { useCardiac } from '../../context/CardiacContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeAlertCount, 
    setIsMobileMenuOpen, 
    isMobileMenuOpen 
  } = useCardiac();

  const primaryTabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'monitoring', label: 'Bedside', icon: HeartPulse },
    { id: 'ecg', label: 'Live ECG', icon: Radio },
    { id: 'risk', label: 'MNN Risk', icon: BrainCircuit },
    { id: 'hardware', label: 'IoT Hub', icon: Cpu },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-red-100 shadow-lg px-2 py-1 select-none"
    >
      <div className="grid grid-cols-6 items-center h-14">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center h-full w-full py-1 min-h-[44px] transition-colors relative ${
                isActive ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-red-600 stroke-[2.2]' : 'text-slate-500'}`} />
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[54px]">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-600" />
              )}
            </button>
          );
        })}

        {/* More / Menu Button with Alert Badge */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center h-full w-full py-1 min-h-[44px] transition-colors relative ${
            isMobileMenuOpen || activeTab === 'alerts' || activeTab === 'records' || activeTab === 'reports' || activeTab === 'settings'
              ? 'text-red-600 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Menu className="w-5 h-5" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {activeAlertCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">
            More
          </span>
        </button>
      </div>
    </nav>
  );
};
