import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  User, 
  ShieldAlert, 
  ExternalLink, 
  Filter, 
  Info,
  Check,
  Building2,
  FileText
} from 'lucide-react';
import { useCardiac } from '../../context/CardiacContext';
import { AlertLevel, EmergencyAlert } from '../../types/cardiac';

export const EmergencyAlerts: React.FC = () => {
  const { 
    alerts, 
    acknowledgeAlert, 
    setSelectedPatientId, 
    setActiveTab, 
    activeAlertCount, 
    criticalAlertCount 
  } = useCardiac();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unacknowledged' | 'critical' | 'warning' | 'info'>('all');
  const [acknowledgingAlert, setAcknowledgingAlert] = useState<EmergencyAlert | null>(null);
  const [ackNote, setAckNote] = useState('');

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    if (selectedFilter === 'unacknowledged') return !alert.acknowledged;
    if (selectedFilter === 'critical') return alert.level === 'critical';
    if (selectedFilter === 'warning') return alert.level === 'warning';
    if (selectedFilter === 'info') return alert.level === 'info';
    return true;
  });

  const handleOpenAcknowledge = (alert: EmergencyAlert) => {
    setAcknowledgingAlert(alert);
    setAckNote('');
  };

  const handleConfirmAcknowledge = () => {
    if (acknowledgingAlert) {
      acknowledgeAlert(acknowledgingAlert.id, ackNote.trim() || undefined);
      setAcknowledgingAlert(null);
      setAckNote('');
    }
  };

  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('monitoring');
  };

  return (
    <div className="space-y-6">
      {/* Title & Quick Stats */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Emergency & Clinical Alert Console
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 font-mono">
              Live Dispatch
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time critical arrhythmia, desaturation, and IoT hardware failure alerts requiring bedside clinical acknowledgement.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-3">
          <div className="bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg text-right">
            <div className="text-[10px] font-semibold uppercase text-red-600">Critical Active</div>
            <div className="text-xl font-bold font-mono text-red-700 tabular-nums">
              {criticalAlertCount}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-right">
            <div className="text-[10px] font-semibold uppercase text-amber-600">Pending Action</div>
            <div className="text-xl font-bold font-mono text-amber-700 tabular-nums">
              {activeAlertCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Alerts List (Left 8 cols) + Hospital Emergency Directory (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Alerts Management List */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filter Alerts:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {[
                { id: 'all', label: `All (${alerts.length})` },
                { id: 'unacknowledged', label: `Pending (${activeAlertCount})` },
                { id: 'critical', label: 'Critical' },
                { id: 'warning', label: 'Warning' },
                { id: 'info', label: 'Info' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id as any)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    selectedFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alerts Feed */}
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredAlerts.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No alerts matching the selected filter criteria.
              </div>
            ) : (
              filteredAlerts.map(alert => {
                const isCritical = alert.level === 'critical';
                const isWarning = alert.level === 'warning';

                return (
                  <div
                    key={alert.id}
                    className={`p-4 transition-colors ${
                      !alert.acknowledged
                        ? isCritical
                          ? 'bg-red-50/40'
                          : 'bg-amber-50/30'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <span className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                          isCritical ? 'bg-red-600 animate-pulse' :
                          isWarning ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isCritical ? 'bg-red-100 text-red-800' :
                              isWarning ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {alert.level}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-1">{alert.message}</p>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-mono">
                            <span>Triggered: <strong className="text-slate-800">{alert.triggeredMetric}</strong></span>
                            <span>·</span>
                            <span>Limit: <strong className="text-slate-800">{alert.threshold}</strong></span>
                            <span>·</span>
                            <span className="text-slate-400">{alert.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Bedside Location & Actions */}
                      <div className="sm:text-right shrink-0 mt-2 sm:mt-0">
                        <div className="text-xs font-semibold text-slate-900">
                          {alert.patientName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {alert.patientId} · {alert.room}
                        </div>

                        <div className="flex items-center gap-2 mt-2 sm:justify-end">
                          <button
                            onClick={() => handleViewPatient(alert.patientId)}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Bedside View
                          </button>

                          {!alert.acknowledged ? (
                            <button
                              onClick={() => handleOpenAcknowledge(alert)}
                              className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors min-h-[38px] shadow-xs"
                            >
                              Acknowledge
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Acknowledged
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acknowledged note if present */}
                    {alert.acknowledged && (
                      <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                        <div>
                          <strong>{alert.acknowledgedBy}</strong>: {alert.note || 'Acknowledged and noted in clinical chart.'}
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">{alert.acknowledgedAt}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Emergency Contacts & Protocol Panel */}
        <div className="lg:col-span-4 space-y-5">
          {/* Hospital Rapid Response Directory */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <Phone className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">Hospital Emergency Extensions</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-red-50/80 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-900">Code Blue Cardiac Arrest Team</span>
                  <span className="font-mono font-bold text-red-700 text-sm">Ext: 3333</span>
                </div>
                <div className="text-[11px] text-red-800 mt-0.5">
                  Cardiac arrest, pulseless ventricular tachycardia/fibrillation.
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Rapid Response Team (RRT)</span>
                  <span className="font-mono font-bold text-teal-700 text-sm">Ext: 5500</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Acute deterioration: acute hypoxia, respiratory rate &gt; 28, HR &gt; 130.
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">CCU On-Call Cardiologist</span>
                  <span className="font-mono font-bold text-teal-700 text-sm">Ext: 4120</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Dr. Sarah Chen, MD (Lead Interventional Cardiologist).
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">ICU Ward 4 Charge Nurse</span>
                  <span className="font-mono font-bold text-teal-700 text-sm">Ext: 2199</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Central nursing station telemetry coordinator desk.
                </div>
              </div>
            </div>
          </div>

          {/* Academic Simulation Notice */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-600" />
              Emergency Safety Protocol
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              This prototype platform simulates hospital alarm management. The emergency phone numbers and extensions displayed above are fictional and for demonstration purposes. It does not contact external 911 or real emergency services.
            </p>
          </div>
        </div>
      </div>

      {/* Acknowledge Modal Dialog */}
      {acknowledgingAlert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">
                Acknowledge Clinical Alarm
              </h3>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1">
              <div className="font-bold text-slate-800">{acknowledgingAlert.title}</div>
              <div className="text-slate-600">{acknowledgingAlert.patientName} ({acknowledgingAlert.room})</div>
              <div className="font-mono text-slate-500">{acknowledgingAlert.triggeredMetric}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clinical Action Note (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g., Bedside oxygen cannula adjusted to 4 L/min, patient stable, attending physician notified..."
                value={ackNote}
                onChange={(e) => setAckNote(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAcknowledgingAlert(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAcknowledge}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors min-h-[40px] shadow-xs"
              >
                Confirm Acknowledgement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
