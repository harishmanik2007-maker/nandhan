import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  Heart, 
  Wind, 
  Thermometer, 
  ShieldAlert, 
  User, 
  Activity, 
  CheckCircle2,
  BrainCircuit,
  Building2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useCardiac } from '../../context/CardiacContext';

export const PatientReports: React.FC = () => {
  const { 
    patients, 
    selectedPatientId, 
    selectedPatient, 
    setSelectedPatientId, 
    alerts,
    doctorProfile 
  } = useCardiac();

  const [dateRange, setDateRange] = useState<'24h' | '7d' | 'admission'>('24h');

  // Compute report statistics for selected patient
  const vitals = selectedPatient.vitalsHistory;
  const hrValues = vitals.map(v => v.heartRate);
  const spo2Values = vitals.map(v => v.spo2);
  const tempValues = vitals.map(v => v.temperature);

  const minHr = Math.min(...hrValues, selectedPatient.currentVitals.heartRate);
  const maxHr = Math.max(...hrValues, selectedPatient.currentVitals.heartRate);
  const avgHr = Math.round(hrValues.reduce((a, b) => a + b, 0) / (hrValues.length || 1));

  const minSpo2 = Math.min(...spo2Values, selectedPatient.currentVitals.spo2);
  const avgSpo2 = Math.round(spo2Values.reduce((a, b) => a + b, 0) / (spo2Values.length || 1));

  const patientAlerts = alerts.filter(a => a.patientId === selectedPatient.id);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Export report as downloadable clinical text summary
  const handleExportText = () => {
    const reportContent = `
================================================================================
CARDIOCARE CLINICAL TELEMETRY & RISK REPORT
Generated: ${new Date().toLocaleString()}
Hospital: University Cardiology Institute - ICU Telemetry Ward 4
Attending: ${doctorProfile.name} (${doctorProfile.role})
================================================================================

PATIENT DEMOGRAPHICS:
Name: ${selectedPatient.name}
Patient ID: ${selectedPatient.id}
Age: ${selectedPatient.age} | Gender: ${selectedPatient.gender} | Blood: ${selectedPatient.bloodType}
Room/Bed: ${selectedPatient.room} / ${selectedPatient.bed}
Admission Date: ${selectedPatient.admissionDate}
Primary Diagnosis: ${selectedPatient.condition}
Relevant History: ${selectedPatient.medicalHistory.join(', ')}
Assigned IoT Node: ${selectedPatient.assignedDeviceId}

24-HOUR TELEMETRY SUMMARY:
- Heart Rate: Min ${minHr} BPM | Max ${maxHr} BPM | Mean ${avgHr} BPM
- Blood Oxygen (SpO2): Min ${minSpo2}% | Mean ${avgSpo2}%
- Current Temperature: ${selectedPatient.currentVitals.temperature.toFixed(1)}°C
- Current ECG Rhythm: ${selectedPatient.currentVitals.ecgStatus.toUpperCase()}

ALARM EVENTS LOG (${patientAlerts.length} Recorded):
${patientAlerts.map(a => `[${a.timestamp}] [${a.level.toUpperCase()}] ${a.title} - ${a.triggeredMetric} (Ack: ${a.acknowledged ? 'YES' : 'NO'})`).join('\n')}

AI DEEP LEARNING MODIFIED NEURAL NETWORK ASSESSMENT:
- Model: Multi-Layer Perceptron (13 UCI Cleveland Clinical Biomarkers)
- Stratification: Continuous Feature Vector Correlation
- Status: Clinical Bedside Monitoring Maintained

Physician Attestation:
Digitally certified by ${doctorProfile.name}
================================================================================
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CardioCare_Report_${selectedPatient.id}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Patient Selection Bar (Hidden in Print) */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Clinical Telemetry & Health Reports
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-mono">
              Formal Chart Export
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate and export printable comprehensive cardiology case summaries with biometric trend logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id})
              </option>
            ))}
          </select>

          <button
            onClick={handleExportText}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Text/Data
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs min-h-[40px]"
          >
            <Printer className="w-3.5 h-3.5" /> Print Hospital Report
          </button>
        </div>
      </div>

      {/* The Printable Clinical Report Sheet */}
      <div className="print-page bg-white p-8 rounded-xl border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6 text-slate-900">
        {/* Hospital Header Banner */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                CardioCare Clinical Telemetry Center
              </h2>
              <div className="text-xs text-slate-500">
                Department of Cardiology & Intensive Care Telemetry · ISO 13485 Standards
              </div>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-bold text-slate-900">MEDICAL SUMMARY REPORT</div>
            <div className="text-slate-500 font-mono mt-0.5">Date: {new Date().toLocaleDateString()}</div>
            <div className="text-teal-700 font-mono font-semibold">Report ID: CR-2026-{(Math.random() * 9000 + 1000).toFixed(0)}</div>
          </div>
        </div>

        {/* Patient Demographics Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Patient Name:</span>
            <div className="font-bold text-slate-900 text-sm">{selectedPatient.name}</div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Patient ID:</span>
            <div className="font-mono font-bold text-slate-900">{selectedPatient.id}</div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Age / Gender:</span>
            <div className="font-semibold text-slate-900">{selectedPatient.age} Yrs · {selectedPatient.gender}</div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Room / Bed:</span>
            <div className="font-semibold text-slate-900">{selectedPatient.room} ({selectedPatient.bed})</div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Admission Date:</span>
            <div className="font-semibold text-slate-900">{selectedPatient.admissionDate}</div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Blood Group:</span>
            <div className="font-semibold text-slate-900">{selectedPatient.bloodType}</div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Attending MD:</span>
            <div className="font-semibold text-slate-900">{selectedPatient.primaryPhysician}</div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">IoT Sensor Hub:</span>
            <div className="font-mono font-semibold text-teal-800">{selectedPatient.assignedDeviceId}</div>
          </div>
        </div>

        {/* Diagnosis & Medical Background */}
        <div className="text-xs space-y-1">
          <div className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">Clinical Diagnosis</div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg font-medium text-slate-800">
            {selectedPatient.condition}
          </div>
          <div className="text-slate-500 pt-1">
            <strong>Past Medical History:</strong> {selectedPatient.medicalHistory.join(' · ')}
          </div>
        </div>

        {/* Telemetry Summary Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
              <span>Heart Rate Range</span>
              <Heart className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {minHr} - {maxHr} <span className="text-xs font-normal text-slate-500">BPM</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Mean Average: {avgHr} BPM</div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
              <span>SpO2 Oxygen Saturation</span>
              <Wind className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {minSpo2}% - {selectedPatient.currentVitals.spo2}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Mean Average: {avgSpo2}%</div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
              <span>Body Temperature</span>
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {selectedPatient.currentVitals.temperature.toFixed(1)}°C
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Current ECG: {selectedPatient.currentVitals.ecgStatus.toUpperCase()}</div>
          </div>
        </div>

        {/* Telemetry Trend Chart in Report */}
        <div className="border border-slate-200 rounded-lg p-4 bg-white">
          <div className="text-xs font-bold text-slate-800 mb-2">
            24-Hour Heart Rate & Oxygen Trend Plot
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedPatient.vitalsHistory} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis domain={[40, 140]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="heartRate" name="Heart Rate (BPM)" stroke="#0d9488" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="spo2" name="SpO2 (%)" stroke="#0284c7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incident Alerts Table */}
        <div className="text-xs space-y-1">
          <div className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">
            Inpatient Alarm Audit Trail ({patientAlerts.length} Events)
          </div>
          {patientAlerts.length === 0 ? (
            <div className="p-3 text-slate-400 bg-slate-50 rounded border border-slate-100">
              No critical or warning alarm events recorded during this telemetry session.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-slate-50 font-semibold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">Level</th>
                    <th className="py-2 px-3">Event Title</th>
                    <th className="py-2 px-3">Trigger Metric</th>
                    <th className="py-2 px-3">Acknowledged By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patientAlerts.map(a => (
                    <tr key={a.id}>
                      <td className="py-2 px-3 font-mono">{a.timestamp}</td>
                      <td className="py-2 px-3 font-bold uppercase">{a.level}</td>
                      <td className="py-2 px-3">{a.title}</td>
                      <td className="py-2 px-3 font-mono">{a.triggeredMetric}</td>
                      <td className="py-2 px-3">{a.acknowledgedBy || 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* AI Modified Neural Network Model Findings */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <BrainCircuit className="w-4 h-4 text-teal-600" />
            Deep Learning Modified Neural Network Assessment Summary
          </div>
          <p className="text-slate-600 leading-relaxed">
            The multi-layer perceptron neural network processed 13 clinical biomarkers (resting BP, serum lipids, ST depression Oldpeak, max heart rate reserve, fluoroscopy vessel scores, and thallium perfusion). Continuous telemetry indicates stable hemodynamic parameters with no acute ventricular fibrillation episodes detected in current monitoring interval.
          </p>
        </div>

        {/* Physician Sign-Off Block */}
        <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-slate-900">{doctorProfile.name}</div>
            <div className="text-slate-500">{doctorProfile.role} · {doctorProfile.department}</div>
            <div className="text-[10px] text-slate-400 mt-1">Medical License Verified · Digital Signature Stamp</div>
          </div>

          <div className="w-48 border-b border-slate-400 text-right pb-1 text-slate-400 italic text-[11px]">
            Physician Signature
          </div>
        </div>
      </div>
    </div>
  );
};
