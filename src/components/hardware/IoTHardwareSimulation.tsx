import React, { useState } from 'react';
import { 
  Cpu, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  Zap, 
  AlertTriangle, 
  Sliders, 
  Info, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  Activity, 
  Heart, 
  Wind, 
  Thermometer, 
  Radio,
  CheckCircle2,
  Database
} from 'lucide-react';
import { useCardiac } from '../../context/CardiacContext';
import { EcgSignalStatus } from '../../types/cardiac';

export const IoTHardwareSimulation: React.FC = () => {
  const { 
    selectedPatient, 
    iotDevice, 
    setIoTDevice, 
    updateHardwareControls, 
    triggerHardwareEmergencyButton,
    patients,
    setSelectedPatientId,
    selectedPatientId
  } = useCardiac();

  const [simHr, setSimHr] = useState<number>(selectedPatient.currentVitals.heartRate);
  const [simSpo2, setSimSpo2] = useState<number>(selectedPatient.currentVitals.spo2);
  const [simTemp, setSimTemp] = useState<number>(selectedPatient.currentVitals.temperature);
  const [simEcg, setSimEcg] = useState<EcgSignalStatus>(selectedPatient.currentVitals.ecgStatus);
  const [simOnline, setSimOnline] = useState<boolean>(iotDevice.online);

  // Sync state changes to context
  const handleHrChange = (val: number) => {
    setSimHr(val);
    updateHardwareControls({ heartRate: val });
  };

  const handleSpo2Change = (val: number) => {
    setSimSpo2(val);
    updateHardwareControls({ spo2: val });
  };

  const handleTempChange = (val: number) => {
    setSimTemp(val);
    updateHardwareControls({ temperature: val });
  };

  const handleEcgChange = (status: EcgSignalStatus) => {
    setSimEcg(status);
    updateHardwareControls({ ecgStatus: status });
  };

  const handleToggleOnline = () => {
    const nextState = !simOnline;
    setSimOnline(nextState);
    updateHardwareControls({ online: nextState });
  };

  // Re-sync sliders when patient changes
  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    const p = patients.find(item => item.id === id);
    if (p) {
      setSimHr(p.currentVitals.heartRate);
      setSimSpo2(p.currentVitals.spo2);
      setSimTemp(p.currentVitals.temperature);
      setSimEcg(p.currentVitals.ecgStatus);
    }
  };

  const isAlarmTriggered = iotDevice.leds.alert || simHr > 130 || simHr < 45 || simSpo2 < 90 || simTemp > 38.5;

  return (
    <div className="space-y-6">
      {/* Title & Patient Connection Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              ESP32 Bedside Hardware Virtual Twin
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-mono">
              IoT Hardware Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive software model simulating physical ESP32 MCU, MAX30102 PPG, AD8232 ECG, and DS18B20 sensors.
          </p>
        </div>

        {/* Node Assignment Switcher */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">Connected to Bed:</div>
          <select
            value={selectedPatientId}
            onChange={(e) => handleSelectPatient(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 py-1.5 px-3 rounded-lg focus:outline-none"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.room}) - {p.assignedDeviceId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Interactive Hardware Visual Twin (Left 7 cols) + Hardware Sliders (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: The ESP32 Hardware Unit Visual Model */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          {/* Top Board Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 font-mono font-bold text-xs">
                32
              </div>
              <div>
                <div className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
                  ESP32-WROOM-32D
                  <span className="text-[10px] text-teal-400 font-normal px-1.5 py-0.2 rounded bg-teal-950 border border-teal-800">
                    FreeRTOS v10.4
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  MAC: {iotDevice.macAddress} · IP: {simOnline ? iotDevice.ipAddress : '0.0.0.0'}
                </div>
              </div>
            </div>

            {/* Online/Offline Hardware Mode Pill */}
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded font-mono font-bold flex items-center gap-1.5 ${
                simOnline ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {simOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {simOnline ? 'Cloud MQTT Connected' : 'Offline Flash Buffer Active'}
              </span>
            </div>
          </div>

          {/* Central Circuit Layout Visual Representation */}
          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 0.96" SSD1306 OLED Display Simulator */}
            <div className="bg-black p-3.5 rounded-lg border-2 border-slate-700 shadow-inner flex flex-col justify-between font-mono">
              <div className="flex items-center justify-between text-[10px] text-teal-400 border-b border-teal-900/60 pb-1">
                <span>0.96" I2C OLED (SSD1306)</span>
                <span>{simOnline ? 'WIFI OK' : 'LOCAL'}</span>
              </div>

              <div className="py-2.5 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-amber-400">PULSE:</span>
                  <span className="text-xl font-bold text-white tabular-nums">{simHr} <span className="text-[10px] text-slate-400">BPM</span></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-red-400">SPO2:</span>
                  <span className="text-xl font-bold text-white tabular-nums">{simSpo2}%</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-emerald-400">TEMP:</span>
                  <span className="text-base font-bold text-white tabular-nums">{simTemp.toFixed(1)}°C</span>
                </div>
              </div>

              <div className="text-[10px] text-teal-300/80 pt-1 border-t border-teal-900/60 flex items-center justify-between">
                <span>ECG: {simEcg.toUpperCase()}</span>
                <span>{selectedPatient.id}</span>
              </div>
            </div>

            {/* Hardware Status Indicators & Buzzer */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  On-Board Diagnostic Indicators
                </div>

                <div className="space-y-2 text-xs">
                  {/* Power LED */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">PWR LED (GPIO 2)</span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                      SOLID 3.3V
                    </span>
                  </div>

                  {/* WiFi LED */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">LINK LED (GPIO 15)</span>
                    <span className={`flex items-center gap-1.5 font-mono text-[11px] ${
                      simOnline ? 'text-red-400' : 'text-slate-500'
                    }`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${simOnline ? 'bg-red-500 shadow-sm shadow-red-500/50' : 'bg-slate-700'}`} />
                      {simOnline ? 'BLINK / 802.11n' : 'OFFLINE'}
                    </span>
                  </div>

                  {/* ALARM LED */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">ALARM LED (GPIO 23)</span>
                    <span className={`flex items-center gap-1.5 font-mono text-[11px] ${
                      isAlarmTriggered ? 'text-red-400 font-bold' : 'text-slate-500'
                    }`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        isAlarmTriggered ? 'bg-red-500 animate-ping shadow-sm shadow-red-500/80' : 'bg-slate-700'
                      }`} />
                      {isAlarmTriggered ? 'ALERT ACTIVE' : 'NOMINAL'}
                    </span>
                  </div>

                  {/* Active Buzzer Status */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-300">Piezo Buzzer (GPIO 18)</span>
                    <span className={`flex items-center gap-1 font-mono text-[11px] ${
                      isAlarmTriggered ? 'text-red-400 font-bold' : 'text-slate-500'
                    }`}>
                      {isAlarmTriggered ? <Volume2 className="w-3.5 h-3.5 text-red-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                      {isAlarmTriggered ? 'BEEPING (880 Hz)' : 'SILENT'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Tactile SOS Button on Device */}
              <div className="mt-3 pt-2">
                <button
                  onClick={triggerHardwareEmergencyButton}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs rounded uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Tactile Bedside SOS Button
                </button>
              </div>
            </div>
          </div>

          {/* Connected Peripheral Sensor Modules Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* MAX30102 */}
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-teal-400 font-mono">MAX30102 (I2C 0x57)</div>
              <div className="font-semibold text-slate-200 mt-0.5">Dual-LED PPG</div>
              <div className="text-[10px] text-slate-400 mt-1">HR & SpO2 Photoplethysmography</div>
            </div>

            {/* AD8232 */}
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-teal-400 font-mono">AD8232 (ADC GPIO 36)</div>
              <div className="font-semibold text-slate-200 mt-0.5">Single-Lead ECG</div>
              <div className="text-[10px] text-slate-400 mt-1">Instrument Amp & Filter</div>
            </div>

            {/* DS18B20 */}
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-teal-400 font-mono">DS18B20 (1-Wire GPIO 4)</div>
              <div className="font-semibold text-slate-200 mt-0.5">Digital Temperature</div>
              <div className="text-[10px] text-slate-400 mt-1">±0.5°C Medical Precision</div>
            </div>
          </div>

          {/* Flash Memory Sync Queue Banner when Offline */}
          {!simOnline && (
            <div className="mt-4 p-3 rounded-lg bg-amber-950/80 border border-amber-800 text-xs text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>ESP32 SPIFFS Flash Active:</strong> Local telemetry packets buffering until Wi-Fi connection restored.
                </span>
              </div>
              <span className="font-mono font-bold bg-amber-900/60 px-2 py-0.5 rounded text-amber-300">
                {iotDevice.pendingSyncQueue} Packets Queued
              </span>
            </div>
          )}
        </div>

        {/* Right: Interactive Hardware Simulation Sliders & Controls */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Hardware Sensor Telemetry Controls</h2>
              <p className="text-xs text-slate-500">Live signal manipulation for examination & testing</p>
            </div>
            <Sliders className="w-4 h-4 text-teal-600" />
          </div>

          {/* Heart Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Simulated Heart Rate:
              </label>
              <span className={`font-mono font-bold text-sm tabular-nums ${
                simHr > 130 || simHr < 48 ? 'text-red-600' : simHr > 100 ? 'text-amber-600' : 'text-slate-900'
              }`}>
                {simHr} BPM
              </span>
            </div>
            <div className="py-2">
              <input
                type="range"
                min="40"
                max="180"
                value={simHr}
                onChange={(e) => handleHrChange(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>40 (Bradycardia)</span>
              <span>75 (Normal)</span>
              <span>180 (Severe Tachycardia)</span>
            </div>
          </div>

          {/* SpO2 Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-red-500" />
                Simulated Blood Oxygen (SpO2):
              </label>
              <span className={`font-mono font-bold text-sm tabular-nums ${
                simSpo2 < 90 ? 'text-red-600' : simSpo2 < 95 ? 'text-amber-600' : 'text-slate-900'
              }`}>
                {simSpo2}%
              </span>
            </div>
            <div className="py-2">
              <input
                type="range"
                min="75"
                max="100"
                value={simSpo2}
                onChange={(e) => handleSpo2Change(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>75% (Critical Hypoxia)</span>
              <span>90% (Warning)</span>
              <span>100% (Nominal)</span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                Simulated Body Temperature:
              </label>
              <span className={`font-mono font-bold text-sm tabular-nums ${
                simTemp > 38.5 ? 'text-red-600' : simTemp > 37.5 ? 'text-amber-600' : 'text-slate-800'
              }`}>
                {simTemp.toFixed(1)}°C
              </span>
            </div>
            <div className="py-2">
              <input
                type="range"
                step="0.1"
                min="35.0"
                max="41.0"
                value={simTemp}
                onChange={(e) => handleTempChange(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>35.0°C (Hypothermia)</span>
              <span>36.8°C (Normal)</span>
              <span>41.0°C (Hyperpyrexia)</span>
            </div>
          </div>

          {/* ECG Signal Condition */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-teal-600" />
              ECG Signal Morphology Condition:
            </label>
            <select
              value={simEcg}
              onChange={(e) => handleEcgChange(e.target.value as EcgSignalStatus)}
              className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="normal">Normal Sinus Rhythm (Synchronized P-QRS-T)</option>
              <option value="tachycardia">Sinus Tachycardia (&gt; 100 BPM)</option>
              <option value="bradycardia">Sinus Bradycardia (&lt; 60 BPM)</option>
              <option value="arrhythmia">Arrhythmia (Premature Ventricular Contractions)</option>
              <option value="leadoff">Electrode Lead-Off / Signal Noise</option>
            </select>
          </div>

          {/* Wi-Fi Online / Offline Toggle */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Wi-Fi Internet Connectivity</div>
              <div className="text-[11px] text-slate-500">
                {simOnline ? 'Connected to hospital MQTT broker' : 'Operating in offline local buffer mode'}
              </div>
            </div>

            <button
              onClick={handleToggleOnline}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                simOnline 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {simOnline ? 'Online (MQTT)' : 'Offline (Simulate Outage)'}
            </button>
          </div>

          {/* Quick Scenario Buttons for Examination Testing */}
          <div className="pt-2">
            <div className="text-[11px] font-semibold text-slate-500 mb-2">
              Quick Clinical Simulation Scenarios:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  handleHrChange(142);
                  handleSpo2Change(88);
                  handleTempChange(38.6);
                  handleEcgChange('arrhythmia');
                }}
                className="p-2 text-left bg-red-50 hover:bg-red-100 border border-red-200 rounded text-red-800 font-semibold transition-colors"
              >
                1. Acute Desat & Ventricular Arrhythmia
              </button>

              <button
                onClick={() => {
                  handleHrChange(46);
                  handleSpo2Change(98);
                  handleTempChange(36.4);
                  handleEcgChange('bradycardia');
                }}
                className="p-2 text-left bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded text-amber-800 font-semibold transition-colors"
              >
                2. Severe Bradycardia Episode
              </button>

              <button
                onClick={() => {
                  handleHrChange(76);
                  handleSpo2Change(98);
                  handleTempChange(36.7);
                  handleEcgChange('normal');
                }}
                className="p-2 text-left bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded text-emerald-800 font-semibold transition-colors"
              >
                3. Stable Recovery Baseline
              </button>

              <button
                onClick={() => {
                  handleEcgChange('leadoff');
                }}
                className="p-2 text-left bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-800 font-semibold transition-colors"
              >
                4. Disconnected Lead (Lead-Off)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
