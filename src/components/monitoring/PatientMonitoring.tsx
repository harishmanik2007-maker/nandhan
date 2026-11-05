import React, { useState } from 'react';
import { 
  Heart, 
  Wind, 
  Thermometer, 
  Radio, 
  Cpu, 
  User, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { useCardiac } from '../../context/CardiacContext';

export const PatientMonitoring: React.FC = () => {
  const { 
    patients, 
    selectedPatientId, 
    selectedPatient, 
    setSelectedPatientId, 
    thresholds,
    setActiveTab,
    iotDevice
  } = useCardiac();

  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  // Convert temperature if needed
  const displayTemp = (celsius: number) => {
    if (tempUnit === 'F') {
      return ((celsius * 9) / 5 + 32).toFixed(1) + '°F';
    }
    return celsius.toFixed(1) + '°C';
  };

  const isCritical = selectedPatient.currentVitals.status === 'critical';
  const isWarning = selectedPatient.currentVitals.status === 'warning';

  return (
    <div className="space-y-6">
      {/* Patient Header & Quick Selector */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-lg font-mono">
            {selectedPatient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {selectedPatient.name}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                {selectedPatient.id}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                isCritical ? 'bg-red-100 text-red-700' :
                isWarning ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {isCritical ? 'Critical Attention' : isWarning ? 'Warning State' : 'Vitals Stable'}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
              <span>{selectedPatient.age} years old</span>
              <span>·</span>
              <span>{selectedPatient.gender}</span>
              <span>·</span>
              <span>Blood: {selectedPatient.bloodType}</span>
              <span>·</span>
              <span className="font-medium text-slate-700">{selectedPatient.room} ({selectedPatient.bed})</span>
              <span>·</span>
              <span>Admitted: {selectedPatient.admissionDate}</span>
            </div>
          </div>
        </div>

        {/* Patient Switcher & Action Links */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-red-200 text-slate-800 py-2.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 min-h-[44px] shadow-xs"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id} - {p.room})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setActiveTab('ecg')}
            className="px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs min-h-[44px]"
          >
            <Radio className="w-3.5 h-3.5 text-red-200" />
            Live ECG Strip
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className="px-3.5 py-2 text-xs font-bold text-red-700 bg-white hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5 min-h-[44px] shadow-xs"
            title="Adjust simulated sensor values for this patient"
          >
            <Zap className="w-3.5 h-3.5 text-red-600" />
            IoT Controls
          </button>
        </div>
      </div>

      {/* 4 Clean Vital-Sign Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              Heart Rate (BPM)
            </span>
            <span className="text-[11px] font-mono text-slate-400">MAX30102 / ECG</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold font-mono tabular-nums ${
              selectedPatient.currentVitals.heartRate > 120 || selectedPatient.currentVitals.heartRate < 50
                ? 'text-red-600'
                : selectedPatient.currentVitals.heartRate > 100
                ? 'text-amber-600'
                : 'text-slate-900'
            }`}>
              {selectedPatient.currentVitals.heartRate}
            </span>
            <span className="text-xs text-slate-500 font-medium">BPM</span>
          </div>

          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Target: 60 - 100</span>
            <span className="font-medium text-slate-700 capitalize">
              {selectedPatient.currentVitals.ecgStatus}
            </span>
          </div>
        </div>

        {/* SpO2 Blood Oxygen Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-red-500" />
              Blood Oxygen (SpO2)
            </span>
            <span className="text-[11px] font-mono text-slate-400">IR Photopleth</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold font-mono tabular-nums ${
              selectedPatient.currentVitals.spo2 < 90
                ? 'text-red-600'
                : selectedPatient.currentVitals.spo2 < 95
                ? 'text-amber-600'
                : 'text-slate-900'
            }`}>
              {selectedPatient.currentVitals.spo2}%
            </span>
            <span className="text-xs text-slate-500 font-medium">Sat</span>
          </div>

          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Threshold: &ge; 95%</span>
            <span className={`font-semibold ${
              selectedPatient.currentVitals.spo2 >= 95 ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {selectedPatient.currentVitals.spo2 >= 95 ? 'Normal Saturation' : 'Hypoxemia Risk'}
            </span>
          </div>
        </div>

        {/* Temperature Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-500" />
              Body Temperature
            </span>
            <button
              onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
              className="text-[11px] font-mono text-teal-600 hover:text-teal-700 font-semibold"
            >
              Switch to °{tempUnit === 'C' ? 'F' : 'C'}
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {displayTemp(selectedPatient.currentVitals.temperature)}
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>DS18B20 1-Wire Probe</span>
            <span className="font-medium text-emerald-600">Normothermic</span>
          </div>
        </div>

        {/* ECG Lead & Hardware Node Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-teal-600" />
              IoT Node Status
            </span>
            <span className="text-[11px] font-mono text-slate-400">{selectedPatient.assignedDeviceId}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold font-mono text-slate-900">
              AD8232 Lead II
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Impedance: 12 kΩ</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Lead Locked
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Profile & Diagnosis Notes */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-600" />
          Clinical Admission Profile & Cardiology History
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500 font-medium">Primary Clinical Diagnosis</div>
            <div className="text-slate-900 font-semibold mt-1 text-sm">{selectedPatient.condition}</div>
            <div className="text-slate-500 mt-2">Attending: {selectedPatient.primaryPhysician}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500 font-medium">Past Medical & Cardiac History</div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {selectedPatient.medicalHistory.map((item, idx) => (
                <span key={idx} className="bg-white px-2 py-0.5 rounded text-[11px] border border-slate-200 text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="text-slate-500 font-medium">Deep Learning MNN Prediction Status</div>
              <div className="text-slate-800 text-[11px] mt-1">
                Modified Neural Network continuous feature vector inference active.
              </div>
            </div>
            <button
              onClick={() => setActiveTab('risk')}
              className="mt-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium text-xs flex items-center justify-between transition-colors"
            >
              <span>Analyze Patient Risk Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Historical Telemetry Trend Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Heart Rate Telemetry Log (BPM)</h3>
              <p className="text-xs text-slate-500">Continuous rhythm recordings with safe threshold bounds (60-100 BPM)</p>
            </div>
            <div className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">
              Current: {selectedPatient.currentVitals.heartRate} BPM
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedPatient.vitalsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis domain={[40, 150]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }}
                />
                <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Tachycardia (100)', fill: '#f59e0b', fontSize: 10, position: 'insideTopLeft' }} />
                <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Bradycardia (60)', fill: '#f59e0b', fontSize: 10, position: 'insideBottomLeft' }} />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#0d9488" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: '#0d9488' }} 
                  activeDot={{ r: 5 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SpO2 Blood Oxygen Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Blood Oxygen Saturation (SpO2 %)</h3>
              <p className="text-xs text-slate-500">Dual-wavelength PPG infrared trend with desaturation threshold line (90%)</p>
            </div>
            <div className="text-xs font-mono font-bold text-red-700 bg-red-50 border border-red-100 px-2 py-1 rounded">
              Current: {selectedPatient.currentVitals.spo2}%
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedPatient.vitalsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }}
                />
                <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Hypoxia (< 90%)', fill: '#ef4444', fontSize: 10, position: 'insideTopLeft' }} />
                <Line 
                  type="monotone" 
                  dataKey="spo2" 
                  stroke="#0284c7" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: '#0284c7' }} 
                  activeDot={{ r: 5 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
