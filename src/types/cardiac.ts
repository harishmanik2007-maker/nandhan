export type RiskCategory = 'lower' | 'moderate' | 'higher';

export type AlertLevel = 'critical' | 'warning' | 'info';

export type EcgSignalStatus = 'normal' | 'tachycardia' | 'bradycardia' | 'arrhythmia' | 'leadoff';

export interface VitalsReading {
  timestamp: string;
  heartRate: number; // BPM
  spo2: number; // percentage 0-100
  temperature: number; // Celsius
  ecgStatus: EcgSignalStatus;
}

export interface Patient {
  id: string; // e.g., 'PT-8021'
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  room: string;
  bed: string;
  admissionDate: string;
  condition: string;
  primaryPhysician: string;
  medicalHistory: string[];
  monitoringStatus: 'Active' | 'Paused' | 'Discharged';
  currentVitals: {
    heartRate: number;
    spo2: number;
    temperature: number;
    ecgStatus: EcgSignalStatus;
    lastUpdated: string;
    status: 'normal' | 'warning' | 'critical';
  };
  vitalsHistory: VitalsReading[];
  assignedDeviceId: string;
}

export interface EmergencyAlert {
  id: string;
  patientId: string;
  patientName: string;
  room: string;
  level: AlertLevel;
  title: string;
  message: string;
  triggeredMetric: string;
  value?: string;
  threshold: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  note?: string;
}

export interface MLRiskInput {
  age: number;
  gender: number; // 1 = Male, 0 = Female
  chestPainType: number; // 0 = Typical Angina, 1 = Atypical, 2 = Non-anginal, 3 = Asymptomatic
  restingBp: number; // mm Hg
  cholesterol: number; // mg/dL
  fastingBs: number; // 1 = > 120 mg/dL, 0 = <= 120
  restingEcg: number; // 0 = Normal, 1 = ST-T wave abnormality, 2 = LV hypertrophy
  maxHeartRate: number; // bpm
  exerciseAngina: number; // 1 = Yes, 0 = No
  oldpeak: number; // ST depression
  slope: number; // 0 = Upsloping, 1 = Flat, 2 = Downsloping
  majorVessels: number; // 0 - 3
  thalassemia: number; // 1 = Normal, 2 = Fixed defect, 3 = Reversible defect
}

export interface MLRiskResult {
  riskScore: number; // 0 - 100 percentage
  riskCategory: RiskCategory;
  confidence: number; // 0 - 100 percentage
  contributingFactors: {
    factor: string;
    impact: 'High' | 'Moderate' | 'Low';
    weight: number;
    description: string;
  }[];
  clinicalExplanation: string;
  recommendations: string[];
  evaluatedAt: string;
}

export interface IoTDeviceState {
  deviceId: string;
  model: string;
  macAddress: string;
  ipAddress: string;
  firmwareVersion: string;
  online: boolean;
  batteryLevel: number;
  wifiSsid: string;
  wifiRssi: number; // dBm
  pendingSyncQueue: number;
  buzzerActive: boolean;
  leds: {
    power: boolean;
    wifi: boolean;
    alert: boolean;
  };
  sensors: {
    max30102Status: 'Optimal' | 'Degraded' | 'Offline';
    ad8232Status: 'Lead Connected' | 'Noise Detected' | 'Lead Off';
    ds18b20Status: 'Connected' | 'Error';
  };
}

export type MedicalTheme = 'red' | 'crimson-dark' | 'sapphire' | 'emerald';

export interface ThresholdSettings {
  hrLow: number;
  hrHigh: number;
  spo2Critical: number;
  spo2Warning: number;
  tempLow: number;
  tempHigh: number;
  tempUnit: 'C' | 'F';
  soundEnabled: boolean;
  ecgSweepSpeed: number; // 25 mm/s or 50 mm/s
  theme?: MedicalTheme;
}
