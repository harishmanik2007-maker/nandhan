import React from 'react';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  HeartPulse, 
  ChevronRight, 
  ArrowUpRight,
  ShieldAlert,
  Thermometer,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';
import { useCardiac } from '../../context/CardiacContext';

export const OverviewDashboard: React.FC = () => {
  const { 
    patients, 
    alerts, 
    setSelectedPatientId, 
    setActiveTab, 
    acknowledgeAlert 
  } = useCardiac();

  // Metrics
  const totalPatients = patients.length;
  const activeMonitored = patients.filter(p => p.monitoringStatus === 'Active').length;
  const requiringAttention = patients.filter(p => p.currentVitals.status === 'warning' || p.currentVitals.status === 'critical').length;
  const activeAlerts = alerts.filter(a => !a.acknowledged);

  // Aggregate multi-patient heart rate telemetry data for the trend chart
  const hrTrendData = [
    { time: '04:00', pt8021: 72, pt8022: 88, pt8023: 94, pt8024: 52 },
    { time: '05:00', pt8021: 74, pt8022: 92, pt8023: 98, pt8024: 50 },
    { time: '06:00', pt8021: 76, pt8022: 98, pt8023: 106, pt8024: 49 },
    { time: '07:00', pt8021: 80, pt8022: 104, pt8023: 118, pt8024: 48 },
    { time: '08:00', pt8021: 79, pt8022: 110, pt8023: 125, pt8024: 47 },
    { time: '09:00', pt8021: 78, pt8022: 112, pt8023: 130, pt8024: 48 },
    { time: '10:00', pt8021: 78, pt8022: 114, pt8023: 132, pt8024: 48 },
  ];

  // Ward distribution data
  const wardActivityData = [
    { ward: 'ICU-3', active: 3, normal: 2, critical: 1 },
    { ward: 'CCU-2', active: 2, normal: 1, critical: 1 },
    { ward: 'CAR-1', active: 2, normal: 1, critical: 1 },
    { ward: 'OBS-4', active: 1, normal: 0, critical: 1 },
    { ward: 'GEN-2', active: 2, normal: 2, critical: 0 },
  ];

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setActiveTab('monitoring');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Hospital Cardiac Telemetry Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time IoT telemetry synchronization across Intensive Care, Coronary Care, and Step-Down Wards.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('hardware')}
            className="px-3.5 py-2 text-xs font-bold text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 min-h-[40px] shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-red-600" />
            Launch IoT Hardware Twin
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className="px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs min-h-[40px]"
          >
            <Activity className="w-3.5 h-3.5 text-red-200" />
            Run MNN Risk Model
          </button>
        </div>
      </div>

      {/* 4 Primary Clinical KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered */}
        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Total Registered Patients</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalPatients}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">6 Active telemetry beds</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Monitored Patients */}
        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Currently Monitored</div>
            <div className="text-2xl font-bold font-mono text-red-700 mt-1">{activeMonitored}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">100% telemetry online</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Patients Requiring Attention */}
        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Requiring Attention</div>
            <div className="text-2xl font-bold font-mono text-amber-600 mt-1">{requiringAttention}</div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">Vitals beyond nominal range</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
        </div>

        {/* Active Emergency Alerts */}
        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Active Emergency Alerts</div>
            <div className="text-2xl font-bold font-mono text-red-600 mt-1">{activeAlerts.length}</div>
            <div className="text-[11px] text-red-600 font-medium mt-0.5">
              {activeAlerts.filter(a => a.level === 'critical').length} Critical Unacknowledged
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Patient Monitoring Table (Left) + Recent Alerts (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Patient Monitoring Table (2 cols) */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-red-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-red-100/80 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Live Bedside Monitoring Roster</h2>
              <p className="text-xs text-slate-500">Continuous telemetry streamed from ESP32 bedside hubs</p>
            </div>
            <button
              onClick={() => setActiveTab('monitoring')}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Detailed Bedside View <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-red-50/40 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-red-100">
                  <th className="py-2.5 px-4">Patient</th>
                  <th className="py-2.5 px-3">Ward / Bed</th>
                  <th className="py-2.5 px-3 text-right">Heart Rate</th>
                  <th className="py-2.5 px-3 text-right">SpO2</th>
                  <th className="py-2.5 px-3 text-right">Temp</th>
                  <th className="py-2.5 px-3 text-center">Rhythm Status</th>
                  <th className="py-2.5 px-3">Updated</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100/60 text-xs">
                {patients.map((patient) => {
                  const isCritical = patient.currentVitals.status === 'critical';
                  const isWarning = patient.currentVitals.status === 'warning';

                  return (
                    <tr 
                      key={patient.id}
                      className="hover:bg-red-50/40 transition-colors cursor-pointer group"
                      onClick={() => handleSelectPatient(patient.id)}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{patient.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {patient.id} · {patient.age}y {patient.gender.charAt(0)}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-medium">{patient.room}</div>
                        <div className="text-[11px] text-slate-400">{patient.bed}</div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className={`font-mono font-bold text-sm tabular-nums ${
                          isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-slate-900'
                        }`}>
                          {patient.currentVitals.heartRate}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">BPM</span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className={`font-mono font-bold text-sm tabular-nums ${
                          patient.currentVitals.spo2 < 90 ? 'text-red-600' :
                          patient.currentVitals.spo2 < 94 ? 'text-amber-600' : 'text-slate-900'
                        }`}>
                          {patient.currentVitals.spo2}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className="font-mono text-slate-800 tabular-nums">
                          {patient.currentVitals.temperature.toFixed(1)}°C
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                          isCritical 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : isWarning 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {patient.currentVitals.ecgStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {patient.currentVitals.lastUpdated}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPatient(patient.id);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors"
                        >
                          Monitor
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Alerts Section (1 col) */}
        <div className="bg-white rounded-xl border border-red-100 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-red-100/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h2 className="text-sm font-bold text-slate-900">Recent Priority Alerts</h2>
            </div>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-xs font-bold text-red-600 hover:text-red-700"
            >
              View All
            </button>
          </div>

          <div className="p-3 divide-y divide-red-100/60 flex-1 overflow-y-auto max-h-[380px]">
            {alerts.slice(0, 4).map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg text-xs transition-colors mb-1 ${
                  !alert.acknowledged ? 'bg-red-50/50 border border-red-100' : 'bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    alert.level === 'critical' ? 'bg-red-600 text-white' :
                    alert.level === 'warning' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {alert.level}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {alert.timestamp.split(' ')[1]}
                  </span>
                </div>

                <div className="font-semibold text-slate-900 mt-1.5">{alert.title}</div>
                <div className="text-[11px] text-slate-600 mt-0.5">{alert.message}</div>

                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">{alert.patientName}</span>
                  {!alert.acknowledged ? (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded transition-colors shadow-xs"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-emerald-700 flex items-center gap-1 font-medium text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clinical Telemetry Charts: Heart Rate Trend + Ward Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heart Rate Multi-Patient Timeline (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-red-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Multi-Patient Heart Rate Trend Comparison</h3>
              <p className="text-xs text-slate-500">Continuous 6-hour timeline tracking acute telemetry variations (BPM)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Vance (PT-8021)
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Rostova (PT-8022)
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Pendelton (PT-8023)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hrTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="color8021" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="color8023" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis domain={[40, 150]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="pt8021" name="R. Vance (PT-8021)" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#color8021)" />
                <Area type="monotone" dataKey="pt8022" name="E. Rostova (PT-8022)" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} />
                <Area type="monotone" dataKey="pt8023" name="A. Pendelton (PT-8023)" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#color8023)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ward Activity & Telemetry Coverage (1 col) */}
        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Hospital Ward Telemetry Distribution</h3>
            <p className="text-xs text-slate-500">Distribution of nominal vs requiring-attention beds</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardActivityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="ward" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="normal" name="Nominal Vitals" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="critical" name="Critical / Warning" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
