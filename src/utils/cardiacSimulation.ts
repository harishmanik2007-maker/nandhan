import { Patient, EmergencyAlert, MLRiskInput, MLRiskResult, EcgSignalStatus } from '../types/cardiac';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PT-8021',
    name: 'Robert Vance',
    age: 64,
    gender: 'Male',
    bloodType: 'A+',
    room: 'ICU-3',
    bed: 'Bed 01',
    admissionDate: '2026-11-01',
    condition: 'Post-CABG (Triple Bypass) Recovery',
    primaryPhysician: 'Dr. Sarah Chen, MD',
    medicalHistory: ['Coronary Artery Disease', 'Hypertension Stage 2', 'Type 2 Diabetes', 'Dyslipidemia'],
    monitoringStatus: 'Active',
    assignedDeviceId: 'ESP32-NODE-01',
    currentVitals: {
      heartRate: 78,
      spo2: 97,
      temperature: 36.8,
      ecgStatus: 'normal',
      lastUpdated: 'Just now',
      status: 'normal',
    },
    vitalsHistory: [
      { timestamp: '04:00', heartRate: 72, spo2: 98, temperature: 36.6, ecgStatus: 'normal' },
      { timestamp: '05:00', heartRate: 74, spo2: 97, temperature: 36.7, ecgStatus: 'normal' },
      { timestamp: '06:00', heartRate: 76, spo2: 98, temperature: 36.7, ecgStatus: 'normal' },
      { timestamp: '07:00', heartRate: 80, spo2: 97, temperature: 36.8, ecgStatus: 'normal' },
      { timestamp: '08:00', heartRate: 79, spo2: 96, temperature: 36.9, ecgStatus: 'normal' },
      { timestamp: '09:00', heartRate: 78, spo2: 97, temperature: 36.8, ecgStatus: 'normal' },
      { timestamp: '10:00', heartRate: 78, spo2: 97, temperature: 36.8, ecgStatus: 'normal' },
    ],
  },
  {
    id: 'PT-8022',
    name: 'Elena Rostova',
    age: 58,
    gender: 'Female',
    bloodType: 'O-',
    room: 'CCU-2',
    bed: 'Bed 04',
    admissionDate: '2026-11-03',
    condition: 'Acute Unstable Angina & ST Elevation',
    primaryPhysician: 'Dr. Marcus Webb, MD',
    medicalHistory: ['Prior Myocardial Infarction (2024)', 'Chronic Kidney Disease Stage 3', 'Hypercholesterolemia'],
    monitoringStatus: 'Active',
    assignedDeviceId: 'ESP32-NODE-02',
    currentVitals: {
      heartRate: 114,
      spo2: 92,
      temperature: 37.9,
      ecgStatus: 'tachycardia',
      lastUpdated: '10 sec ago',
      status: 'warning',
    },
    vitalsHistory: [
      { timestamp: '04:00', heartRate: 88, spo2: 95, temperature: 37.1, ecgStatus: 'normal' },
      { timestamp: '05:00', heartRate: 92, spo2: 94, temperature: 37.2, ecgStatus: 'normal' },
      { timestamp: '06:00', heartRate: 98, spo2: 94, temperature: 37.4, ecgStatus: 'normal' },
      { timestamp: '07:00', heartRate: 104, spo2: 93, temperature: 37.6, ecgStatus: 'tachycardia' },
      { timestamp: '08:00', heartRate: 110, spo2: 92, temperature: 37.8, ecgStatus: 'tachycardia' },
      { timestamp: '09:00', heartRate: 112, spo2: 92, temperature: 37.9, ecgStatus: 'tachycardia' },
      { timestamp: '10:00', heartRate: 114, spo2: 92, temperature: 37.9, ecgStatus: 'tachycardia' },
    ],
  },
  {
    id: 'PT-8023',
    name: 'Arthur Pendelton',
    age: 72,
    gender: 'Male',
    bloodType: 'B+',
    room: 'CAR-1',
    bed: 'Bed 02',
    admissionDate: '2026-10-28',
    condition: 'Congestive Heart Failure NYHA Class III',
    primaryPhysician: 'Dr. Sarah Chen, MD',
    medicalHistory: ['Severe Dilated Cardiomyopathy', 'Atrial Fibrillation', 'Implanted ICD', 'Gout'],
    monitoringStatus: 'Active',
    assignedDeviceId: 'ESP32-NODE-03',
    currentVitals: {
      heartRate: 132,
      spo2: 88,
      temperature: 38.3,
      ecgStatus: 'arrhythmia',
      lastUpdated: '5 sec ago',
      status: 'critical',
    },
    vitalsHistory: [
      { timestamp: '04:00', heartRate: 94, spo2: 93, temperature: 37.3, ecgStatus: 'normal' },
      { timestamp: '05:00', heartRate: 98, spo2: 92, temperature: 37.5, ecgStatus: 'normal' },
      { timestamp: '06:00', heartRate: 106, spo2: 91, temperature: 37.7, ecgStatus: 'tachycardia' },
      { timestamp: '07:00', heartRate: 118, spo2: 90, temperature: 38.0, ecgStatus: 'arrhythmia' },
      { timestamp: '08:00', heartRate: 125, spo2: 89, temperature: 38.1, ecgStatus: 'arrhythmia' },
      { timestamp: '09:00', heartRate: 130, spo2: 88, temperature: 38.2, ecgStatus: 'arrhythmia' },
      { timestamp: '10:00', heartRate: 132, spo2: 88, temperature: 38.3, ecgStatus: 'arrhythmia' },
    ],
  },
  {
    id: 'PT-8024',
    name: 'Maria Santos',
    age: 49,
    gender: 'Female',
    bloodType: 'O+',
    room: 'OBS-4',
    bed: 'Bed 03',
    admissionDate: '2026-11-04',
    condition: 'Syncope Workup / Sinus Bradycardia',
    primaryPhysician: 'Dr. Julian Ross, MD',
    medicalHistory: ['Vasovagal Syncope', 'Hypothyroidism', 'Mild Asthma'],
    monitoringStatus: 'Active',
    assignedDeviceId: 'ESP32-NODE-04',
    currentVitals: {
      heartRate: 48,
      spo2: 99,
      temperature: 36.5,
      ecgStatus: 'bradycardia',
      lastUpdated: '15 sec ago',
      status: 'warning',
    },
    vitalsHistory: [
      { timestamp: '04:00', heartRate: 52, spo2: 99, temperature: 36.4, ecgStatus: 'normal' },
      { timestamp: '05:00', heartRate: 50, spo2: 99, temperature: 36.4, ecgStatus: 'normal' },
      { timestamp: '06:00', heartRate: 49, spo2: 98, temperature: 36.5, ecgStatus: 'bradycardia' },
      { timestamp: '07:00', heartRate: 48, spo2: 99, temperature: 36.5, ecgStatus: 'bradycardia' },
      { timestamp: '08:00', heartRate: 47, spo2: 99, temperature: 36.5, ecgStatus: 'bradycardia' },
      { timestamp: '09:00', heartRate: 48, spo2: 99, temperature: 36.5, ecgStatus: 'bradycardia' },
      { timestamp: '10:00', heartRate: 48, spo2: 99, temperature: 36.5, ecgStatus: 'bradycardia' },
    ],
  },
  {
    id: 'PT-8025',
    name: 'James H. Fletcher',
    age: 52,
    gender: 'Male',
    bloodType: 'AB-',
    room: 'GEN-2',
    bed: 'Bed 01',
    admissionDate: '2026-11-02',
    condition: 'Elective Cardioversion Pre-op Evaluation',
    primaryPhysician: 'Dr. Sarah Chen, MD',
    medicalHistory: ['Paroxysmal Atrial Flutter', 'Essential Hypertension', 'Sleep Apnea'],
    monitoringStatus: 'Active',
    assignedDeviceId: 'ESP32-NODE-05',
    currentVitals: {
      heartRate: 72,
      spo2: 98,
      temperature: 36.7,
      ecgStatus: 'normal',
      lastUpdated: '20 sec ago',
      status: 'normal',
    },
    vitalsHistory: [
      { timestamp: '04:00', heartRate: 70, spo2: 98, temperature: 36.6, ecgStatus: 'normal' },
      { timestamp: '05:00', heartRate: 71, spo2: 98, temperature: 36.6, ecgStatus: 'normal' },
      { timestamp: '06:00', heartRate: 73, spo2: 97, temperature: 36.7, ecgStatus: 'normal' },
      { timestamp: '07:00', heartRate: 72, spo2: 98, temperature: 36.7, ecgStatus: 'normal' },
      { timestamp: '08:00', heartRate: 74, spo2: 98, temperature: 36.7, ecgStatus: 'normal' },
      { timestamp: '09:00', heartRate: 72, spo2: 98, temperature: 36.7, ecgStatus: 'normal' },
      { timestamp: '10:00', heartRate: 72, spo2: 98, temperature: 36.7, ecgStatus: 'normal' },
    ],
  },
  {
    id: 'PT-8026',
    name: 'Catherine Bell',
    age: 61,
    gender: 'Female',
    bloodType: 'A-',
    room: 'CCU-1',
    bed: 'Bed 02',
    admissionDate: '2026-11-04',
    condition: 'Aortic Stenosis & Anginal Episodes',
    primaryPhysician: 'Dr. Marcus Webb, MD',
    medicalHistory: ['Calcific Aortic Valve Disease', 'Osteoporosis', 'Mild Carotid Stenosis'],
    monitoringStatus: 'Active',
    assignedDeviceId: 'ESP32-NODE-06',
    currentVitals: {
      heartRate: 84,
      spo2: 96,
      temperature: 36.9,
      ecgStatus: 'normal',
      lastUpdated: '30 sec ago',
      status: 'normal',
    },
    vitalsHistory: [
      { timestamp: '04:00', heartRate: 80, spo2: 96, temperature: 36.8, ecgStatus: 'normal' },
      { timestamp: '05:00', heartRate: 82, spo2: 96, temperature: 36.8, ecgStatus: 'normal' },
      { timestamp: '06:00', heartRate: 83, spo2: 97, temperature: 36.9, ecgStatus: 'normal' },
      { timestamp: '07:00', heartRate: 85, spo2: 96, temperature: 36.9, ecgStatus: 'normal' },
      { timestamp: '08:00', heartRate: 84, spo2: 96, temperature: 36.9, ecgStatus: 'normal' },
      { timestamp: '09:00', heartRate: 86, spo2: 95, temperature: 37.0, ecgStatus: 'normal' },
      { timestamp: '10:00', heartRate: 84, spo2: 96, temperature: 36.9, ecgStatus: 'normal' },
    ],
  },
];

export const INITIAL_ALERTS: EmergencyAlert[] = [
  {
    id: 'ALT-1092',
    patientId: 'PT-8023',
    patientName: 'Arthur Pendelton',
    room: 'CAR-1 / Bed 02',
    level: 'critical',
    title: 'Severe Cardiac Desaturation & Ventricular Ectopy',
    message: 'SpO2 dropped to 88% and HR surged to 132 BPM with irregular R-R intervals.',
    triggeredMetric: 'SpO2: 88% | HR: 132 BPM',
    threshold: 'SpO2 < 90% | HR > 120 BPM',
    timestamp: '2026-11-05 10:07:42',
    acknowledged: false,
  },
  {
    id: 'ALT-1091',
    patientId: 'PT-8022',
    patientName: 'Elena Rostova',
    room: 'CCU-2 / Bed 04',
    level: 'warning',
    title: 'Persistent Sinus Tachycardia',
    message: 'Heart rate sustained above 110 BPM for > 15 minutes during CCU rest phase.',
    triggeredMetric: 'HR: 114 BPM',
    threshold: 'HR > 105 BPM',
    timestamp: '2026-11-05 09:52:18',
    acknowledged: false,
  },
  {
    id: 'ALT-1090',
    patientId: 'PT-8024',
    patientName: 'Maria Santos',
    room: 'OBS-4 / Bed 03',
    level: 'warning',
    title: 'Symptomatic Sinus Bradycardia',
    message: 'Resting pulse reached nadir of 48 BPM; alert flagged for nurse check.',
    triggeredMetric: 'HR: 48 BPM',
    threshold: 'HR < 50 BPM',
    timestamp: '2026-11-05 08:34:02',
    acknowledged: true,
    acknowledgedBy: 'Nurse R. Miller, RN',
    acknowledgedAt: '2026-11-05 08:36:14',
    note: 'Patient rested comfortably, no dizziness noted. Continued observation ordered by Dr. Ross.',
  },
  {
    id: 'ALT-1089',
    patientId: 'PT-8021',
    patientName: 'Robert Vance',
    room: 'ICU-3 / Bed 01',
    level: 'info',
    title: 'IoT Sensor Calibration Routine Completed',
    message: 'MAX30102 PPG infrared auto-gain calibrated with 98.4% signal SNR ratio.',
    triggeredMetric: 'SNR: 98.4%',
    threshold: 'SNR >= 90%',
    timestamp: '2026-11-05 07:15:00',
    acknowledged: true,
    acknowledgedBy: 'System Auto-Log',
    acknowledgedAt: '2026-11-05 07:15:00',
    note: 'Automated 12-hour hardware baseline calibration.',
  },
];

/**
 * Deep Learning Modified Neural Network (MNN) Risk Simulation
 * Implements calibrated logistic multi-feature activation weights
 * inspired by Cleveland & Framingham Heart Disease clinical parameters.
 */
export function calculateModifiedNeuralNetworkRisk(input: MLRiskInput): MLRiskResult {
  // Weighted normalized activation:
  // Age factor
  const ageScore = (input.age - 30) / 50 * 1.8;
  
  // Sex factor (Male higher baseline risk in clinical models)
  const genderScore = input.gender === 1 ? 0.9 : 0.4;
  
  // Chest pain type: 0: Typical Angina (highest), 1: Atypical, 2: Non-anginal, 3: Asymptomatic
  const cpWeights = [2.6, 1.8, 1.0, 0.5];
  const cpScore = cpWeights[input.chestPainType] ?? 1.0;
  
  // Resting Blood Pressure (>140 is hypertensive)
  const bpScore = input.restingBp > 160 ? 2.4 : input.restingBp > 140 ? 1.6 : input.restingBp > 120 ? 0.8 : 0.2;
  
  // Cholesterol (>240 is high risk)
  const cholScore = input.cholesterol > 280 ? 2.2 : input.cholesterol > 240 ? 1.5 : input.cholesterol > 200 ? 0.7 : 0.1;
  
  // Fasting Blood Sugar
  const fbsScore = input.fastingBs === 1 ? 1.2 : 0.1;
  
  // Resting ECG: 0: Normal, 1: ST-T wave abnormality, 2: LV hypertrophy
  const ecgWeights = [0.1, 1.9, 2.5];
  const ecgScore = ecgWeights[input.restingEcg] ?? 0.5;
  
  // Maximum heart rate (lower max HR in stress test correlates with higher disease likelihood)
  const hrScore = input.maxHeartRate < 110 ? 2.1 : input.maxHeartRate < 140 ? 1.3 : 0.3;
  
  // Exercise Induced Angina
  const exangScore = input.exerciseAngina === 1 ? 2.4 : 0.2;
  
  // ST Depression (Oldpeak) - strong clinical predictor
  const oldpeakScore = input.oldpeak > 2.5 ? 2.8 : input.oldpeak > 1.5 ? 1.9 : input.oldpeak > 0.5 ? 1.0 : 0.1;
  
  // Slope of peak exercise: 0: Upsloping, 1: Flat, 2: Downsloping (highest risk)
  const slopeWeights = [0.4, 1.6, 2.7];
  const slopeScore = slopeWeights[input.slope] ?? 0.8;
  
  // Number of major vessels (0 to 3)
  const vesselScore = input.majorVessels * 1.1;
  
  // Thalassemia: 1: Normal, 2: Fixed defect, 3: Reversible defect
  const thalWeights = [0.2, 1.8, 2.6];
  const thalScore = thalWeights[input.thalassemia - 1] ?? 0.5;

  // Aggregate sum through neural network simulated dense layer
  const rawLogit = 
    (ageScore * 0.12) +
    (genderScore * 0.08) +
    (cpScore * 0.18) +
    (bpScore * 0.11) +
    (cholScore * 0.10) +
    (fbsScore * 0.05) +
    (ecgScore * 0.11) +
    (hrScore * 0.07) +
    (exangScore * 0.14) +
    (oldpeakScore * 0.18) +
    (slopeScore * 0.12) +
    (vesselScore * 0.15) +
    (thalScore * 0.16) - 1.15; // bias term

  // Sigmoid transfer function
  const sigmoid = 1 / (1 + Math.exp(-rawLogit * 2.2));
  const rawRiskPercent = Math.min(Math.max(Math.round(sigmoid * 100), 4), 98);

  let riskCategory: 'lower' | 'moderate' | 'higher' = 'lower';
  if (rawRiskPercent >= 65) {
    riskCategory = 'higher';
  } else if (rawRiskPercent >= 32) {
    riskCategory = 'moderate';
  } else {
    riskCategory = 'lower';
  }

  // Model confidence calculation (based on non-ambiguity distance from decision boundary 50%)
  const distanceFromThreshold = Math.abs(rawRiskPercent - 50);
  const confidence = Math.min(Math.round(76 + (distanceFromThreshold * 0.44)), 97);

  // Contributing factors assessment
  const contributingFactors: MLRiskResult['contributingFactors'] = [];

  if (input.oldpeak >= 1.5) {
    contributingFactors.push({
      factor: 'ST Segment Depression (Oldpeak)',
      impact: 'High',
      weight: 28,
      description: `Oldpeak value of ${input.oldpeak} mm indicates significant exercise-induced myocardial ischemia.`,
    });
  }
  if (input.chestPainType === 0) {
    contributingFactors.push({
      factor: 'Chest Pain Type: Typical Angina',
      impact: 'High',
      weight: 24,
      description: 'Classic substernal chest discomfort exacerbated by exertion and relieved by rest/nitroglycerin.',
    });
  }
  if (input.majorVessels >= 2) {
    contributingFactors.push({
      factor: 'Fluoroscopy Major Vessels',
      impact: 'High',
      weight: 22,
      description: `${input.majorVessels} major coronary vessels demonstrated significant lumen narrowing under fluoroscopy.`,
    });
  }
  if (input.restingBp >= 145) {
    contributingFactors.push({
      factor: 'Elevated Resting Blood Pressure',
      impact: input.restingBp >= 160 ? 'High' : 'Moderate',
      weight: 18,
      description: `Resting blood pressure of ${input.restingBp} mm Hg increases myocardial afterload and endothelial stress.`,
    });
  }
  if (input.cholesterol >= 240) {
    contributingFactors.push({
      factor: 'Serum Hypercholesterolemia',
      impact: input.cholesterol >= 280 ? 'High' : 'Moderate',
      weight: 16,
      description: `Total serum cholesterol of ${input.cholesterol} mg/dL accelerates atheromatous plaque formation.`,
    });
  }
  if (input.exerciseAngina === 1) {
    contributingFactors.push({
      factor: 'Exercise Induced Angina',
      impact: 'Moderate',
      weight: 15,
      description: 'Positive ischemic chest pain reported during cardiac treadmill or ergometer stress testing.',
    });
  }
  if (input.age >= 60) {
    contributingFactors.push({
      factor: 'Advanced Age Biomarker',
      impact: 'Moderate',
      weight: 12,
      description: `Patient age (${input.age} years) increases baseline cardiovascular calcification and arterial stiffness.`,
    });
  }
  if (input.fastingBs === 1) {
    contributingFactors.push({
      factor: 'Impaired Fasting Glucose',
      impact: 'Low',
      weight: 9,
      description: 'Fasting blood glucose > 120 mg/dL suggests diabetic microvascular/macrovascular cardiac risk.',
    });
  }

  // Ensure at least 3 factors for complete clinical feedback
  if (contributingFactors.length < 3) {
    contributingFactors.push({
      factor: 'Resting Electrocardiogram Pattern',
      impact: input.restingEcg > 0 ? 'Moderate' : 'Low',
      weight: 11,
      description: input.restingEcg === 0 ? 'Normal resting baseline rhythm with preserved ventricular repolarization.' : 'Repolarization abnormalities or ventricular voltage elevations detected.',
    });
  }

  // Clinical explanation & recommendations
  let clinicalExplanation = '';
  const recommendations: string[] = [];

  if (riskCategory === 'higher') {
    clinicalExplanation = `The Deep Learning Modified Neural Network architecture computed an elevated coronary risk probability of ${rawRiskPercent}%. The primary drivers are the concordance of ischemic ST-segment depression (${input.oldpeak} mm), typical anginal symptomatic presentation, and fluoroscopic multi-vessel compromise. The model identifies elevated probability of obstructive coronary artery disease requiring urgent clinical corroboration.`;
    recommendations.push('Immediate referral to Interventional Cardiology for diagnostic coronary angiography.');
    recommendations.push('Initiate continuous bed-side Lead II / V5 telemetry and troponin-I serial biomarkers.');
    recommendations.push('Review antiplatelet (Aspirin/P2Y12 inhibitor) and high-intensity statin therapy.');
    recommendations.push('Enforce strict activity restriction pending formal cardiologist evaluation.');
  } else if (riskCategory === 'moderate') {
    clinicalExplanation = `The Deep Learning Modified Neural Network computed a moderate cardiovascular risk score of ${rawRiskPercent}%. Contributing markers include intermediate blood pressure (${input.restingBp} mm Hg), lipid profile elevation, and patient age demographics. While no acute catastrophic ischemia is indicated, proactive secondary prevention and outpatient stress imaging are advised.`;
    recommendations.push('Schedule Transthoracic Echocardiogram (TTE) to assess left ventricular ejection fraction.');
    recommendations.push('Perform 24-hour ambulatory Holter ECG monitoring to rule out paroxysmal dysrhythmias.');
    recommendations.push('Optimize antihypertensive and lipid-lowering pharmacological regimen.');
    recommendations.push('Lifestyle and cardiac rehabilitation dietary counseling.');
  } else {
    clinicalExplanation = `The Deep Learning Modified Neural Network computed a low cardiovascular risk probability of ${rawRiskPercent}%. The clinical biomarker inputs demonstrate preserved maximal heart rate capacity, absence of exercise-induced ischemia, and normal resting repolarization. Current findings are consistent with low 10-year major adverse cardiac event (MACE) probability.`;
    recommendations.push('Maintain routine annual preventative cardiovascular wellness checkups.');
    recommendations.push('Continue balanced Mediterranean heart-healthy nutrition and aerobic exercise.');
    recommendations.push('Repeat routine fasting lipid and glucose panels at standard 12-month interval.');
  }

  return {
    riskScore: rawRiskPercent,
    riskCategory,
    confidence,
    contributingFactors: contributingFactors.sort((a, b) => b.weight - a.weight),
    clinicalExplanation,
    recommendations,
    evaluatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

/**
 * Realistic ECG Waveform Generator
 * Produces mathematical P-Q-R-S-T voltage waveform points with cardiac baseline.
 */
export function generateEcgWaveformPoint(
  phase: number, // 0 to 1 representing one cardiac cycle
  status: EcgSignalStatus = 'normal'
): number {
  if (status === 'leadoff') {
    // Flatline with small high-frequency electrode noise
    return 0 + (Math.random() - 0.5) * 0.04;
  }

  // Base is 0 mV
  let mv = 0;

  if (status === 'arrhythmia') {
    // Introduce random premature ventricular contraction or baseline irregularity
    if (phase > 0.45 && phase < 0.65) {
      // Wide inverted abnormal QRS complex
      const p = (phase - 0.55) / 0.1;
      return -0.8 * Math.exp(-Math.pow(p * 3.5, 2)) + (Math.random() - 0.5) * 0.05;
    }
  }

  // Normal Sinus Rhythm P-Q-R-S-T representation:
  // 1. P Wave (Atrial Depolarization): occurs around phase 0.15 - 0.25
  if (phase >= 0.12 && phase <= 0.22) {
    const pCenter = 0.17;
    const pWidth = 0.04;
    const p = (phase - pCenter) / pWidth;
    mv += 0.15 * Math.exp(-Math.pow(p * 2, 2));
  }

  // 2. PR Segment: baseline (0 mV)

  // 3. Q Wave (Septal Depolarization): sharp dip before R around phase 0.38
  if (phase >= 0.37 && phase < 0.40) {
    mv -= 0.12 * Math.sin(((phase - 0.37) / 0.03) * Math.PI);
  }

  // 4. R Wave (Ventricular Depolarization Spike): sharp tall peak around phase 0.40 - 0.44
  if (phase >= 0.40 && phase <= 0.44) {
    const rCenter = 0.42;
    const rWidth = 0.02;
    const r = (phase - rCenter) / rWidth;
    mv += 1.05 * Math.exp(-Math.pow(r * 2.5, 2));
  }

  // 5. S Wave (Late Ventricular Depolarization Dip): dip below baseline around phase 0.44 - 0.47
  if (phase > 0.44 && phase <= 0.48) {
    mv -= 0.25 * Math.sin(((phase - 0.44) / 0.04) * Math.PI);
  }

  // 6. ST Segment & T Wave (Ventricular Repolarization): occurs around phase 0.60 - 0.75
  if (phase >= 0.58 && phase <= 0.74) {
    const tCenter = 0.66;
    const tWidth = 0.06;
    const t = (phase - tCenter) / tWidth;
    mv += 0.28 * Math.exp(-Math.pow(t * 1.8, 2));
  }

  // Tiny physiological micro-noise
  mv += (Math.random() - 0.5) * 0.015;

  return mv;
}
