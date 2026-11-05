import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Patient, 
  EmergencyAlert, 
  IoTDeviceState, 
  ThresholdSettings, 
  EcgSignalStatus 
} from '../types/cardiac';
import { INITIAL_PATIENTS, INITIAL_ALERTS } from '../utils/cardiacSimulation';

interface CardiacContextType {
  patients: Patient[];
  selectedPatientId: string;
  selectedPatient: Patient;
  setSelectedPatientId: (id: string) => void;
  alerts: EmergencyAlert[];
  acknowledgeAlert: (alertId: string, note?: string) => void;
  triggerEmergencyAlert: (patientId: string, title: string, message: string, level?: 'critical' | 'warning' | 'info') => void;
  activeAlertCount: number;
  criticalAlertCount: number;
  iotDevice: IoTDeviceState;
  setIoTDevice: React.Dispatch<React.SetStateAction<IoTDeviceState>>;
  updateHardwareControls: (params: {
    heartRate?: number;
    spo2?: number;
    temperature?: number;
    ecgStatus?: EcgSignalStatus;
    online?: boolean;
  }) => void;
  triggerHardwareEmergencyButton: () => void;
  updatePatient: (updated: Patient) => void;
  addPatient: (newPatient: Omit<Patient, 'id' | 'vitalsHistory' | 'currentVitals' | 'assignedDeviceId'> & { initialHr?: number; initialSpo2?: number; initialTemp?: number }) => void;
  thresholds: ThresholdSettings;
  setThresholds: React.Dispatch<React.SetStateAction<ThresholdSettings>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentTimeString: string;
  doctorProfile: {
    name: string;
    role: string;
    department: string;
  };
  setDoctorProfile: React.Dispatch<React.SetStateAction<{ name: string; role: string; department: string }>>;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  medicalTheme: 'red' | 'crimson-dark' | 'sapphire' | 'emerald';
  setMedicalTheme: (theme: 'red' | 'crimson-dark' | 'sapphire' | 'emerald') => void;
}

const DEFAULT_THRESHOLDS: ThresholdSettings = {
  hrLow: 50,
  hrHigh: 110,
  spo2Critical: 90,
  spo2Warning: 94,
  tempLow: 35.5,
  tempHigh: 38.0,
  tempUnit: 'C',
  soundEnabled: true,
  ecgSweepSpeed: 25,
};

const DEFAULT_IOT_DEVICE: IoTDeviceState = {
  deviceId: 'ESP32-NODE-01',
  model: 'ESP32-WROOM-32D (Dual-Core Tensilica LX6)',
  macAddress: '24:0A:C4:9B:71:A8',
  ipAddress: '192.168.1.142',
  firmwareVersion: 'v2.4.1-clinical',
  online: true,
  batteryLevel: 94,
  wifiSsid: 'Hospital_IoT_Telemetry_Secured',
  wifiRssi: -58,
  pendingSyncQueue: 0,
  buzzerActive: false,
  leds: {
    power: true,
    wifi: true,
    alert: false,
  },
  sensors: {
    max30102Status: 'Optimal',
    ad8232Status: 'Lead Connected',
    ds18b20Status: 'Connected',
  },
};

const CardiacContext = createContext<CardiacContextType | undefined>(undefined);

export const CardiacProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('PT-8021');
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(INITIAL_ALERTS);
  const [iotDevice, setIoTDevice] = useState<IoTDeviceState>(DEFAULT_IOT_DEVICE);
  const [thresholds, setThresholds] = useState<ThresholdSettings>(DEFAULT_THRESHOLDS);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [medicalTheme, setMedicalTheme] = useState<'red' | 'crimson-dark' | 'sapphire' | 'emerald'>('red');
  const [doctorProfile, setDoctorProfile] = useState({
    name: 'Dr. Sarah Chen, MD',
    role: 'Attending Cardiologist',
    department: 'Cardiology & CCU Ward 4',
  });

  // Live hospital clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentTimeString = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' ' + currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }, [currentTime]);

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Alert counters
  const activeAlertCount = useMemo(() => {
    return alerts.filter(a => !a.acknowledged).length;
  }, [alerts]);

  const criticalAlertCount = useMemo(() => {
    return alerts.filter(a => !a.acknowledged && a.level === 'critical').length;
  }, [alerts]);

  // Play audio chime for alerts (clean synthetic Web Audio beep)
  const playAlertChime = useCallback((level: 'critical' | 'warning' | 'info') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = level === 'critical' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(level === 'critical' ? 880 : 587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // AudioContext might be blocked until user gesture, safely ignore
    }
  }, [soundEnabled]);

  // Acknowledge alert function
  const acknowledgeAlert = useCallback((alertId: string, note?: string) => {
    setAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        return {
          ...alert,
          acknowledged: true,
          acknowledgedBy: doctorProfile.name,
          acknowledgedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          note: note || alert.note || 'Acknowledged by bedside clinical staff.',
        };
      }
      return alert;
    }));
  }, [doctorProfile.name]);

  // Trigger emergency alert
  const triggerEmergencyAlert = useCallback((
    patientId: string, 
    title: string, 
    message: string, 
    level: 'critical' | 'warning' | 'info' = 'critical'
  ) => {
    const targetPatient = patients.find(p => p.id === patientId) || selectedPatient;
    const newAlert: EmergencyAlert = {
      id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      room: `${targetPatient.room} / ${targetPatient.bed}`,
      level,
      title,
      message,
      triggeredMetric: `HR: ${targetPatient.currentVitals.heartRate} BPM | SpO2: ${targetPatient.currentVitals.spo2}%`,
      threshold: 'Critical threshold crossed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      acknowledged: false,
    };

    setAlerts(prev => [newAlert, ...prev]);
    playAlertChime(level);

    // Update IoT LEDs and buzzer
    setIoTDevice(prev => ({
      ...prev,
      buzzerActive: level === 'critical',
      leds: {
        ...prev.leds,
        alert: true,
      },
    }));
  }, [patients, selectedPatient, playAlertChime]);

  // Update IoT hardware sliders & propagate to active patient & alerts
  const updateHardwareControls = useCallback((params: {
    heartRate?: number;
    spo2?: number;
    temperature?: number;
    ecgStatus?: EcgSignalStatus;
    online?: boolean;
  }) => {
    setIoTDevice(prev => {
      const isOnline = params.online !== undefined ? params.online : prev.online;
      const willBeOffline = !isOnline;

      let newPendingQueue = prev.pendingSyncQueue;
      if (willBeOffline) {
        newPendingQueue += 1;
      } else if (prev.pendingSyncQueue > 0) {
        // Just came online, clear queue
        newPendingQueue = 0;
      }

      const hr = params.heartRate ?? selectedPatient.currentVitals.heartRate;
      const spo2 = params.spo2 ?? selectedPatient.currentVitals.spo2;
      const temp = params.temperature ?? selectedPatient.currentVitals.temperature;
      const ecg = params.ecgStatus ?? selectedPatient.currentVitals.ecgStatus;

      // Determine alert state
      const isCritical = hr > 130 || hr < 45 || spo2 < 90 || temp > 39.0 || ecg === 'arrhythmia';
      const isWarning = !isCritical && (hr > 105 || hr < 52 || spo2 < 95 || temp > 37.8 || ecg === 'tachycardia' || ecg === 'bradycardia');

      return {
        ...prev,
        online: isOnline,
        pendingSyncQueue: newPendingQueue,
        buzzerActive: isCritical,
        leds: {
          power: true,
          wifi: isOnline,
          alert: isCritical || isWarning,
        },
        sensors: {
          ...prev.sensors,
          ad8232Status: ecg === 'leadoff' ? 'Lead Off' : ecg === 'arrhythmia' ? 'Noise Detected' : 'Lead Connected',
          max30102Status: spo2 < 85 ? 'Degraded' : 'Optimal',
        },
      };
    });

    // Update the selected patient's current vitals and history
    setPatients(prevPatients => {
      return prevPatients.map(p => {
        if (p.id === selectedPatientId) {
          const hr = params.heartRate ?? p.currentVitals.heartRate;
          const spo2 = params.spo2 ?? p.currentVitals.spo2;
          const temp = params.temperature ?? p.currentVitals.temperature;
          const ecg = params.ecgStatus ?? p.currentVitals.ecgStatus;

          const isCritical = hr > 130 || hr < 45 || spo2 < 90 || temp > 39.0 || ecg === 'arrhythmia';
          const isWarning = !isCritical && (hr > 105 || hr < 52 || spo2 < 95 || temp > 37.8 || ecg === 'tachycardia' || ecg === 'bradycardia');
          const status = isCritical ? 'critical' : isWarning ? 'warning' : 'normal';

          const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const newHistory = [...p.vitalsHistory];
          // Keep up to 10 points
          if (newHistory.length >= 10) {
            newHistory.shift();
          }
          newHistory.push({
            timestamp: timeLabel,
            heartRate: hr,
            spo2: spo2,
            temperature: temp,
            ecgStatus: ecg,
          });

          return {
            ...p,
            currentVitals: {
              heartRate: hr,
              spo2: spo2,
              temperature: temp,
              ecgStatus: ecg,
              lastUpdated: 'Just now',
              status,
            },
            vitalsHistory: newHistory,
          };
        }
        return p;
      });
    });

    // Check if new alert should be created automatically
    const hr = params.heartRate ?? selectedPatient.currentVitals.heartRate;
    const spo2 = params.spo2 ?? selectedPatient.currentVitals.spo2;
    const temp = params.temperature ?? selectedPatient.currentVitals.temperature;

    if (spo2 < 90) {
      triggerEmergencyAlert(
        selectedPatientId,
        'Severe Hypoxemia Alert (SpO2 < 90%)',
        `Bedside pulse oximetry recorded critical drop to ${spo2}%. Verify oxygen delivery cannula.`,
        'critical'
      );
    } else if (hr > 135) {
      triggerEmergencyAlert(
        selectedPatientId,
        'Severe Tachyarrhythmia Alert (HR > 135 BPM)',
        `Heart rate accelerated to ${hr} BPM. Check cardiac monitor rhythm strip immediately.`,
        'critical'
      );
    } else if (hr < 45) {
      triggerEmergencyAlert(
        selectedPatientId,
        'Critical Sinus Bradycardia Alert (HR < 45 BPM)',
        `Severe pulse drop to ${hr} BPM detected by AD8232 sensor.`,
        'critical'
      );
    }
  }, [selectedPatient, selectedPatientId, triggerEmergencyAlert]);

  // Physical hardware emergency button
  const triggerHardwareEmergencyButton = useCallback(() => {
    triggerEmergencyAlert(
      selectedPatientId,
      'EMERGENCY SOS: Bedside IoT Hardware Button Pressed',
      `Patient or nurse activated the physical emergency call button on bedside ESP32 controller unit (${iotDevice.deviceId}). Immediate nursing response required!`,
      'critical'
    );
  }, [selectedPatientId, iotDevice.deviceId, triggerEmergencyAlert]);

  // Update patient record
  const updatePatient = useCallback((updated: Patient) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
  }, []);

  // Add demo patient
  const addPatient = useCallback((data: Omit<Patient, 'id' | 'vitalsHistory' | 'currentVitals' | 'assignedDeviceId'> & { initialHr?: number; initialSpo2?: number; initialTemp?: number }) => {
    const nextNum = 8021 + patients.length;
    const newId = `PT-${nextNum}`;
    const deviceId = `ESP32-NODE-0${patients.length + 1}`;
    const hr = data.initialHr || 75;
    const spo2 = data.initialSpo2 || 98;
    const temp = data.initialTemp || 36.7;

    const newPatient: Patient = {
      ...data,
      id: newId,
      assignedDeviceId: deviceId,
      currentVitals: {
        heartRate: hr,
        spo2: spo2,
        temperature: temp,
        ecgStatus: 'normal',
        lastUpdated: 'Just now',
        status: 'normal',
      },
      vitalsHistory: [
        { timestamp: '06:00', heartRate: hr - 2, spo2, temperature: temp, ecgStatus: 'normal' },
        { timestamp: '08:00', heartRate: hr, spo2, temperature: temp, ecgStatus: 'normal' },
        { timestamp: '10:00', heartRate: hr, spo2, temperature: temp, ecgStatus: 'normal' },
      ],
    };

    setPatients(prev => [newPatient, ...prev]);
    setSelectedPatientId(newId);
  }, [patients.length]);

  return (
    <CardiacContext.Provider
      value={{
        patients,
        selectedPatientId,
        selectedPatient,
        setSelectedPatientId,
        alerts,
        acknowledgeAlert,
        triggerEmergencyAlert,
        activeAlertCount,
        criticalAlertCount,
        iotDevice,
        setIoTDevice,
        updateHardwareControls,
        triggerHardwareEmergencyButton,
        updatePatient,
        addPatient,
        thresholds,
        setThresholds,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        currentTimeString,
        doctorProfile,
        setDoctorProfile,
        soundEnabled,
        setSoundEnabled,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        medicalTheme,
        setMedicalTheme,
      }}
    >
      {children}
    </CardiacContext.Provider>
  );
};

export const useCardiac = () => {
  const context = useContext(CardiacContext);
  if (!context) {
    throw new Error('useCardiac must be used within a CardiacProvider');
  }
  return context;
};
