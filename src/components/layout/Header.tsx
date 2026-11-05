import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Clock, 
  Wifi, 
  WifiOff, 
  UserCheck, 
  ChevronDown, 
  AlertTriangle, 
  Check, 
  X,
  Menu,
  Palette,
  Heart
} from 'lucide-react';
import { useCardiac } from '../../context/CardiacContext';

export const Header: React.FC = () => {
  const { 
    patients, 
    selectedPatient,
    setSelectedPatientId, 
    alerts, 
    acknowledgeAlert, 
    activeAlertCount, 
    currentTimeString, 
    doctorProfile,
    iotDevice,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    medicalTheme,
    setMedicalTheme
  } = useCardiac();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMenuOpen, setAlertMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (alertRef.current && !alertRef.current.contains(e.target as Node)) {
        setAlertMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setPaletteMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPatients = searchTerm.trim() === '' 
    ? [] 
    : patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.room.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const recentAlerts = alerts.slice(0, 5);

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 md:px-6 flex items-center justify-between shrink-0 select-none z-20 sticky top-0 shadow-xs">
      {/* Left: Mobile Drawer Trigger + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-lg">
        {/* Hamburger Trigger for Mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand logo for small screens when sidebar is hidden */}
        <div className="md:hidden flex items-center gap-1.5 mr-1 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight hidden xs:inline">
            CardioCare
          </span>
        </div>

        {/* Search Patients Input */}
        <div className="relative flex-1" ref={searchRef}>
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient, ID, or bed..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {searchOpen && searchTerm.trim() !== '' && (
            <div className="absolute top-12 left-0 w-full sm:w-96 bg-white rounded-lg shadow-xl border border-red-100 overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 text-xs font-semibold text-slate-500">
                Matched Patients ({filteredPatients.length})
              </div>
              {filteredPatients.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No matching patients found.
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setActiveTab('monitoring');
                        setSearchOpen(false);
                        setSearchTerm('');
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-red-50/50 flex items-center justify-between transition-colors min-h-[44px]"
                    >
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-900">{patient.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span className="font-mono">{patient.id}</span>
                          <span>·</span>
                          <span>{patient.room}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold font-mono ${
                          patient.currentVitals.status === 'critical' ? 'text-red-600' :
                          patient.currentVitals.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {patient.currentVitals.heartRate} BPM
                        </div>
                        <div className="text-[10px] text-slate-400">SpO2: {patient.currentVitals.spo2}%</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4 ml-2">
        {/* Live Hospital Time (Hidden on small mobile) */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-600 bg-red-50/40 px-3 py-1.5 rounded-md border border-red-100">
          <Clock className="w-3.5 h-3.5 text-red-600" />
          <span className="tabular-nums">{currentTimeString}</span>
        </div>

        {/* System IoT Bridge Status */}
        <div className="flex items-center">
          {iotDevice.online ? (
            <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200" title="IoT Network Bridge Online">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">IoT Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200" title="Offline - Local ESP32 flash buffer active">
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Offline (Buffered)</span>
            </div>
          )}
        </div>

        {/* Medical Color Palette Selector Dropdown */}
        <div className="relative" ref={paletteRef}>
          <button
            onClick={() => setPaletteMenuOpen(!paletteMenuOpen)}
            className="p-2 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            title="Switch Hospital Theme & Palette"
          >
            <Palette className="w-4 h-4 text-red-600" />
          </button>

          {paletteMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-red-100 p-2 z-50 text-xs">
              <div className="p-2 border-b border-slate-100 font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                Hospital Color Palette
              </div>
              <div className="py-1 space-y-1">
                {[
                  { id: 'red', label: 'Cardiac Red & White (Active)', color: 'bg-red-600' },
                  { id: 'crimson-dark', label: 'Emergency Crimson & Snow', color: 'bg-rose-700' },
                  { id: 'sapphire', label: 'Royal Hospital Blue', color: 'bg-blue-600' },
                  { id: 'emerald', label: 'Jade Surgical (Mint & Green)', color: 'bg-emerald-600' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setMedicalTheme(th.id as any);
                      setPaletteMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-left transition-colors ${
                      medicalTheme === th.id ? 'bg-red-50 text-red-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${th.color}`} />
                      <span className="truncate">{th.label}</span>
                    </div>
                    {medicalTheme === th.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell with Badge */}
        <div className="relative" ref={alertRef}>
          <button
            onClick={() => setAlertMenuOpen(!alertMenuOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            title="Emergency Alerts"
            aria-label="Emergency Alerts"
          >
            <Bell className="w-5 h-5" />
            {activeAlertCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {activeAlertCount}
              </span>
            )}
          </button>

          {/* Alert Popover */}
          {alertMenuOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-slate-900">Clinical Alerts Feed</span>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('alerts');
                    setAlertMenuOpen(false);
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold"
                >
                  View All ({alerts.length})
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {recentAlerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active emergency alerts.
                  </div>
                ) : (
                  recentAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      className={`p-3 text-xs transition-colors ${
                        !alert.acknowledged ? 'bg-rose-50/50' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            alert.level === 'critical' ? 'bg-red-600' :
                            alert.level === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                          {alert.title}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{alert.timestamp.split(' ')[1]}</span>
                      </div>
                      <div className="text-slate-600 mt-1">{alert.message}</div>
                      <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-[11px] font-mono font-medium text-slate-500">
                          {alert.patientName} ({alert.room})
                        </span>
                        {!alert.acknowledged ? (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded transition-colors shadow-xs"
                          >
                            Acknowledge
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" /> Acknowledged
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-slate-200 text-left hover:opacity-90 min-h-[44px]"
          >
            <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center border border-red-700 shadow-xs shrink-0">
              SC
            </div>
            <div className="hidden lg:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {doctorProfile.name}
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                {doctorProfile.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 top-12 w-60 bg-white rounded-lg shadow-xl border border-red-100 p-2 z-50">
              <div className="p-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{doctorProfile.name}</div>
                <div className="text-[11px] text-slate-500">{doctorProfile.department}</div>
                <div className="text-[10px] text-red-600 font-mono mt-1 font-bold">Staff ID: MD-77402</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded"
                >
                  Clinical Profile Settings
                </button>
                <button
                  onClick={() => {
                    setActiveTab('monitoring');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded"
                >
                  Current Patient: {selectedPatient.name}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
