import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Info, 
  Sparkles, 
  RotateCcw,
  Sliders,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Layers,
  Heart
} from 'lucide-react';
import { useCardiac } from '../../context/CardiacContext';
import { MLRiskInput, MLRiskResult } from '../../types/cardiac';
import { calculateModifiedNeuralNetworkRisk } from '../../utils/cardiacSimulation';

export const CardiacRiskAnalysis: React.FC = () => {
  const { selectedPatient } = useCardiac();

  // Form input state
  const [formData, setFormData] = useState<MLRiskInput>({
    age: selectedPatient.age,
    gender: selectedPatient.gender === 'Male' ? 1 : 0,
    chestPainType: 0, // Typical Angina
    restingBp: 142,
    cholesterol: 254,
    fastingBs: 1,
    restingEcg: 1, // ST-T wave abnormality
    maxHeartRate: 128,
    exerciseAngina: 1,
    oldpeak: 2.1,
    slope: 1, // Flat
    majorVessels: 2,
    thalassemia: 3, // Reversible defect
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MLRiskResult | null>(() => {
    // Initial evaluation for the active patient
    return calculateModifiedNeuralNetworkRisk({
      age: selectedPatient.age,
      gender: selectedPatient.gender === 'Male' ? 1 : 0,
      chestPainType: 0,
      restingBp: 142,
      cholesterol: 254,
      fastingBs: 1,
      restingEcg: 1,
      maxHeartRate: 128,
      exerciseAngina: 1,
      oldpeak: 2.1,
      slope: 1,
      majorVessels: 2,
      thalassemia: 3,
    });
  });

  // Handle input change
  const handleChange = (field: keyof MLRiskInput, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Run the Modified Neural Network analysis
  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const res = calculateModifiedNeuralNetworkRisk(formData);
      setResult(res);
      setAnalyzing(false);
    }, 450);
  };

  // Preset loaders for fast examination testing
  const loadPreset = (preset: 'high' | 'moderate' | 'low' | 'current') => {
    if (preset === 'current') {
      const isMale = selectedPatient.gender === 'Male' ? 1 : 0;
      setFormData({
        age: selectedPatient.age,
        gender: isMale,
        chestPainType: selectedPatient.condition.includes('Angina') ? 0 : 2,
        restingBp: 138,
        cholesterol: 235,
        fastingBs: selectedPatient.medicalHistory.some(m => m.includes('Diabetes')) ? 1 : 0,
        restingEcg: selectedPatient.currentVitals.ecgStatus === 'normal' ? 0 : 1,
        maxHeartRate: selectedPatient.currentVitals.heartRate + 25,
        exerciseAngina: 0,
        oldpeak: 1.2,
        slope: 1,
        majorVessels: 1,
        thalassemia: 2,
      });
    } else if (preset === 'high') {
      setFormData({
        age: 67,
        gender: 1,
        chestPainType: 0, // Typical Angina
        restingBp: 168,
        cholesterol: 295,
        fastingBs: 1,
        restingEcg: 1,
        maxHeartRate: 108,
        exerciseAngina: 1,
        oldpeak: 3.2,
        slope: 2, // Downsloping
        majorVessels: 3,
        thalassemia: 3,
      });
    } else if (preset === 'moderate') {
      setFormData({
        age: 56,
        gender: 1,
        chestPainType: 1, // Atypical
        restingBp: 140,
        cholesterol: 238,
        fastingBs: 0,
        restingEcg: 0,
        maxHeartRate: 142,
        exerciseAngina: 0,
        oldpeak: 1.4,
        slope: 1,
        majorVessels: 1,
        thalassemia: 2,
      });
    } else {
      setFormData({
        age: 36,
        gender: 0,
        chestPainType: 3, // Asymptomatic
        restingBp: 118,
        cholesterol: 178,
        fastingBs: 0,
        restingEcg: 0,
        maxHeartRate: 176,
        exerciseAngina: 0,
        oldpeak: 0.2,
        slope: 0, // Upsloping
        majorVessels: 0,
        thalassemia: 1,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Research Architecture Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Cardiac Risk Prediction System (Deep Learning MNN)
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-mono">
              Modified Neural Network
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            13-Biomarker multi-layer perceptron with modified non-linear activation for early coronary disease stratification.
          </p>
        </div>

        {/* 1-Click Profile Preset Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 mr-1">Load Presets:</span>
          <button
            onClick={() => loadPreset('current')}
            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            {selectedPatient.name.split(' ')[0]} (Bedside)
          </button>
          <button
            onClick={() => loadPreset('high')}
            className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
          >
            High Risk Case
          </button>
          <button
            onClick={() => loadPreset('moderate')}
            className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
          >
            Moderate Case
          </button>
          <button
            onClick={() => loadPreset('low')}
            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
          >
            Low Risk Case
          </button>
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left 7 cols) + AI Inference Results (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Clinical Biomarkers */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Clinical Feature Vector Parameters</h2>
              <p className="text-xs text-slate-500">Inputs mapped to modified neural network input layer</p>
            </div>
            <span className="text-[11px] font-mono text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded">
              13 Input Dimensions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Age */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Age (Years)</label>
              <input
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Biological Sex</label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value={1}>Male (1)</option>
                <option value={0}>Female (0)</option>
              </select>
            </div>

            {/* Chest Pain Type */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Chest Pain Presentation</label>
              <select
                value={formData.chestPainType}
                onChange={(e) => handleChange('chestPainType', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value={0}>Type 0: Typical Angina (Exertional Substernal Pressure)</option>
                <option value={1}>Type 1: Atypical Angina (Non-exertional / Positional)</option>
                <option value={2}>Type 2: Non-Anginal Chest Pain (Sharp / Pleuritic)</option>
                <option value={3}>Type 3: Asymptomatic</option>
              </select>
            </div>

            {/* Resting BP */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resting Blood Pressure (mm Hg)</label>
              <input
                type="number"
                min="80"
                max="220"
                value={formData.restingBp}
                onChange={(e) => handleChange('restingBp', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* Cholesterol */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Serum Cholesterol (mg/dL)</label>
              <input
                type="number"
                min="100"
                max="500"
                value={formData.cholesterol}
                onChange={(e) => handleChange('cholesterol', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* Fasting Blood Sugar */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fasting Blood Glucose</label>
              <select
                value={formData.fastingBs}
                onChange={(e) => handleChange('fastingBs', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value={0}>&le; 120 mg/dL (Normal / Controlled)</option>
                <option value={1}>&gt; 120 mg/dL (Elevated / Diabetic)</option>
              </select>
            </div>

            {/* Resting ECG */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resting Electrocardiogram</label>
              <select
                value={formData.restingEcg}
                onChange={(e) => handleChange('restingEcg', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value={0}>Normal Sinus Repolarization</option>
                <option value={1}>ST-T Wave Abnormality (T-inversion/depression)</option>
                <option value={2}>Left Ventricular Hypertrophy (Estes criteria)</option>
              </select>
            </div>

            {/* Max Heart Rate */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Heart Rate Achieved (thalach)</label>
              <input
                type="number"
                min="60"
                max="220"
                value={formData.maxHeartRate}
                onChange={(e) => handleChange('maxHeartRate', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* Exercise Angina */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Exercise Induced Angina</label>
              <select
                value={formData.exerciseAngina}
                onChange={(e) => handleChange('exerciseAngina', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value={0}>No (Negative)</option>
                <option value={1}>Yes (Positive Exertional Pain)</option>
              </select>
            </div>

            {/* ST Depression Oldpeak */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ST Depression Oldpeak (mm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="6"
                value={formData.oldpeak}
                onChange={(e) => handleChange('oldpeak', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* Slope */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Peak ST Segment Slope</label>
              <select
                value={formData.slope}
                onChange={(e) => handleChange('slope', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value={0}>Upsloping (Low risk)</option>
                <option value={1}>Flat (Intermediate risk)</option>
                <option value={2}>Downsloping (High risk)</option>
              </select>
            </div>

            {/* Major Vessels */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fluoroscopy Major Vessels (0 - 3)</label>
              <select
                value={formData.majorVessels}
                onChange={(e) => handleChange('majorVessels', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value={0}>0 Vessels colored</option>
                <option value={1}>1 Major vessel colored</option>
                <option value={2}>2 Major vessels colored</option>
                <option value={3}>3 Major vessels colored</option>
              </select>
            </div>

            {/* Thalassemia */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Thallium Scintigraphy Defect</label>
              <select
                value={formData.thalassemia}
                onChange={(e) => handleChange('thalassemia', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value={1}>1: Normal Myocardial Perfusion</option>
                <option value={2}>2: Fixed Defect (Previous Infarct Scar)</option>
                <option value={3}>3: Reversible Defect (Inducible Ischemia)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 text-sm min-h-[44px]"
            >
              <BrainCircuit className="w-4 h-4 text-red-200" />
              {analyzing ? 'Computing Modified Neural Network Inference...' : 'Analyze Cardiac Risk'}
            </button>
          </div>
        </div>

        {/* Right Panel: AI Prediction Results & Model Explanation */}
        <div className="lg:col-span-5 space-y-5">
          {result && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
              {/* Risk Category Header Banner */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold uppercase tracking-wider">Estimated Risk Output</span>
                  <span className="font-mono">Evaluated: {result.evaluatedAt}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-2xl font-black capitalize tracking-tight ${
                      result.riskCategory === 'higher' ? 'text-red-600' :
                      result.riskCategory === 'moderate' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {result.riskCategory} Estimated Risk
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Coronary Artery Disease Probability
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black font-mono tabular-nums text-slate-900">
                      {result.riskScore}%
                    </div>
                    <div className="text-[11px] text-teal-700 font-semibold">
                      Model Conf: {result.confidence}%
                    </div>
                  </div>
                </div>

                {/* Visual Risk Gauge Meter */}
                <div className="mt-4">
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="w-[30%] bg-emerald-400" title="Lower Risk (<30%)" />
                    <div className="w-[35%] bg-amber-400" title="Moderate Risk (30-65%)" />
                    <div className="w-[35%] bg-red-500" title="Higher Risk (>65%)" />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>0% (Low)</span>
                    <span>30%</span>
                    <span>65%</span>
                    <span>100% (High)</span>
                  </div>
                </div>
              </div>

              {/* Primary Contributing Input Factors */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                  Key Contributing Biomarkers
                </h3>
                <div className="space-y-2 text-xs">
                  {result.contributingFactors.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{item.factor}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          item.impact === 'High' ? 'bg-red-100 text-red-700' :
                          item.impact === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.impact} Weight
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Decision Reasoning */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  Neural Network Interpretation
                </h3>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                  {result.clinicalExplanation}
                </p>
              </div>

              {/* Clinical Action Recommendations */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                  Suggested Clinical Interventions
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Medical Demonstration Disclaimer */}
              <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Academic Research Prototype Disclaimer:</strong> The current platform uses demonstration modified neural network inference for university engineering presentation. It does not replace certified physician diagnosis or formal clinical pathways.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
