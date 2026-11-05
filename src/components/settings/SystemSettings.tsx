import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Sliders, 
  Bell, 
  Cpu, 
  User, 
  Volume2, 
  VolumeX, 
  Check, 
  RotateCcw,
  BookOpen,
  Radio
} from 'lucide-react';
import { useCardiac } from '../../context/CardiacContext';

export const SystemSettings: React.FC = () => {
  const { 
    thresholds, 
    setThresholds, 
    doctorProfile, 
    setDoctorProfile, 
    soundEnabled, 
    setSoundEnabled,
    medicalTheme,
    setMedicalTheme
  } = useCardiac();

  const [savedNotification, setSavedNotification] = useState(false);

  const [formThresholds, setFormThresholds] = useState({ ...thresholds, theme: medicalTheme });
  const [docName, setDocName] = useState(doctorProfile.name);
  const [docRole, setDocRole] = useState(doctorProfile.role);
  const [docDept, setDocDept] = useState(doctorProfile.department);
  const [ecgRate, setEcgRate] = useState<number>(250);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setThresholds(formThresholds);
    if (formThresholds.theme) {
      setMedicalTheme(formThresholds.theme);
    }
    setDoctorProfile({
      name: docName,
      role: docRole,
      department: docDept,
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const handleResetDefaults = () => {
    const defaults = {
      hrLow: 50,
      hrHigh: 110,
      spo2Critical: 90,
      spo2Warning: 94,
      tempLow: 35.5,
      tempHigh: 38.0,
      tempUnit: 'C' as const,
      soundEnabled: true,
      ecgSweepSpeed: 25,
      theme: 'red' as const,
    };
    setFormThresholds(defaults);
    setThresholds(defaults);
    setMedicalTheme('red');
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Clinical Platform & Telemetry Settings
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              System Configuration
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure ICU telemetry alarm thresholds, sound alarm chimes, staff authentication profiles, and IoT sensor parameters.
          </p>
        </div>

        {savedNotification && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" /> Settings Saved Successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Clinical Alert Thresholds */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Bedside Physiological Alarm Thresholds
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Heart Rate Bradycardia Low (BPM)
              </label>
              <input
                type="number"
                min="35"
                max="65"
                value={formThresholds.hrLow}
                onChange={(e) => setFormThresholds({ ...formThresholds, hrLow: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Triggers Warning if &lt; {formThresholds.hrLow} BPM</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Heart Rate Tachycardia High (BPM)
              </label>
              <input
                type="number"
                min="90"
                max="160"
                value={formThresholds.hrHigh}
                onChange={(e) => setFormThresholds({ ...formThresholds, hrHigh: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Triggers Warning if &gt; {formThresholds.hrHigh} BPM</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Critical SpO2 Desaturation (%)
              </label>
              <input
                type="number"
                min="80"
                max="95"
                value={formThresholds.spo2Critical}
                onChange={(e) => setFormThresholds({ ...formThresholds, spo2Critical: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
              />
              <span className="text-[10px] text-red-500 font-medium">Triggers CRITICAL Code Blue Alarm</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Warning SpO2 Level (%)
              </label>
              <input
                type="number"
                min="88"
                max="96"
                value={formThresholds.spo2Warning}
                onChange={(e) => setFormThresholds({ ...formThresholds, spo2Warning: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Triggers Warning if &lt; {formThresholds.spo2Warning}%</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Body Temperature High Alert (°C)
              </label>
              <input
                type="number"
                step="0.1"
                min="37.5"
                max="40.0"
                value={formThresholds.tempHigh}
                onChange={(e) => setFormThresholds({ ...formThresholds, tempHigh: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Triggers Fever alert if &gt; {formThresholds.tempHigh}°C</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Auditory Chime Alarms
              </label>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-full py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 border transition-colors ${
                  soundEnabled
                    ? 'bg-teal-50 border-teal-300 text-teal-800'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-600" /> : <VolumeX className="w-4 h-4" />}
                {soundEnabled ? 'Alarm Sound: Enabled' : 'Alarm Sound: Muted'}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: IoT Hardware & Sensor Bus Configuration */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">
              ESP32 Peripheral Firmware & Sampling Calibration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                AD8232 ECG Sampling Frequency
              </label>
              <select
                value={ecgRate}
                onChange={(e) => setEcgRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value={100}>100 Hz (Standard Battery Save)</option>
                <option value={250}>250 Hz (Clinical Standard Lead II)</option>
                <option value={500}>500 Hz (High-Definition QRS Zoom)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                MAX30102 PPG LED Pulse Width
              </label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none">
                <option>411 µs (18-bit ADC resolution)</option>
                <option>215 µs (17-bit ADC resolution)</option>
                <option>118 µs (16-bit ADC resolution)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                DS18B20 1-Wire Thermometer Precision
              </label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none">
                <option>12-bit (0.0625°C resolution - 750ms)</option>
                <option>11-bit (0.125°C resolution - 375ms)</option>
                <option>10-bit (0.25°C resolution - 187ms)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Attending Medical Staff Identity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Logged-in Clinical Staff Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Physician Name</label>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinical Title / Role</label>
              <input
                type="text"
                value={docRole}
                onChange={(e) => setDocRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Ward Department</label>
              <input
                type="text"
                value={docDept}
                onChange={(e) => setDocDept(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Medical Color Palette Selection */}
        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Hospital Visual Theme & Medical Color Scheme
              </h2>
              <p className="text-xs text-slate-500">
                Select clinical high-contrast color scheme for ICU and outpatient monitors
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {[
              { id: 'red', name: 'Cardiac Red & White', desc: 'Emergency Red & Pure White', sample: 'bg-red-600' },
              { id: 'crimson-dark', name: 'Emergency Crimson', desc: 'Deep Ruby & Snow White', sample: 'bg-rose-700' },
              { id: 'sapphire', name: 'Royal Hospital Blue', desc: 'Clinical Blue & Deep Navy', sample: 'bg-blue-600' },
              { id: 'emerald', name: 'Jade Surgical', desc: 'Medical Mint & Forest Green', sample: 'bg-emerald-600' },
            ].map((th) => (
              <button
                type="button"
                key={th.id}
                onClick={() => setFormThresholds({ ...formThresholds, theme: th.id as any })}
                className={`p-3 rounded-lg border text-left transition-all min-h-[44px] ${
                  (formThresholds.theme || 'red') === th.id
                    ? 'border-red-500 bg-red-50/50 ring-2 ring-red-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-3.5 h-3.5 rounded-full ${th.sample}`} />
                  <span className="font-bold text-slate-900">{th.name}</span>
                </div>
                <div className="text-[11px] text-slate-500">{th.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 5: University Research Citation & Project Metadata */}
        <div className="bg-slate-950 p-5 rounded-xl text-white space-y-2 text-xs">
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <BookOpen className="w-4 h-4" />
            Academic Research Project Specification
          </div>
          <p className="text-slate-300 leading-relaxed">
            <strong>Project Title:</strong> "An Efficient IoT-Based Patient Monitoring and Heart Disease Prediction System Using Deep Learning Modified Neural Network."
          </p>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex flex-wrap gap-4">
            <span>Architecture: ESP32 + MAX30102 + AD8232 + DS18B20</span>
            <span>ML Model: Modified Neural Network (MNN)</span>
            <span>Dataset: UCI Cleveland Cardiac Benchmark</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restore Clinical Defaults
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs min-h-[40px]"
          >
            Save All Configurations
          </button>
        </div>
      </form>
    </div>
  );
};
