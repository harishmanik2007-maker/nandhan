import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Radio, 
  Activity, 
  ShieldAlert, 
  Sliders, 
  Eye, 
  Zap,
  Info,
  Maximize2
} from 'lucide-react';
import { useCardiac } from '../../context/CardiacContext';
import { generateEcgWaveformPoint } from '../../utils/cardiacSimulation';

export const LiveECG: React.FC = () => {
  const { selectedPatient, iotDevice } = useCardiac();

  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [displayMode, setDisplayMode] = useState<'dark' | 'paper'>('dark');
  const [lead, setLead] = useState<'Lead I' | 'Lead II' | 'Lead III' | 'V1' | 'V5'>('Lead II');
  const [sweepSpeed, setSweepSpeed] = useState<number>(25); // mm/s
  const [gain, setGain] = useState<number>(10); // mm/mV
  const [elapsedSeconds, setElapsedSeconds] = useState(254);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sweepXRef = useRef<number>(0);
  const bufferRef = useRef<number[]>([]);
  const phaseRef = useRef<number>(0);

  // Elapsed duration counter
  useEffect(() => {
    if (!isRunning || isPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const hrs = Math.floor(mins / 60);
    return `${String(hrs).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // High-performance canvas ECG renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerY = height / 2;

    // Pre-fill buffer with initial baseline
    if (bufferRef.current.length === 0) {
      bufferRef.current = new Array(Math.ceil(width)).fill(centerY);
    }

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isRunning && !isPaused) {
        // Calculate speed based on sweep speed setting and current heart rate
        const hr = selectedPatient.currentVitals.heartRate;
        const beatsPerSec = hr / 60;
        const pointsToAdvance = Math.max(1, Math.round((width / 3.5) * (sweepSpeed / 25) * dt));

        for (let i = 0; i < pointsToAdvance; i++) {
          phaseRef.current = (phaseRef.current + (beatsPerSec / (width * 0.4))) % 1;
          const status = selectedPatient.currentVitals.ecgStatus;
          const voltage = generateEcgWaveformPoint(phaseRef.current, status);
          
          // Scale voltage with gain factor
          const amplitudePx = voltage * (gain * 4.2);
          const y = centerY - amplitudePx;

          sweepXRef.current = (sweepXRef.current + 1) % width;
          bufferRef.current[Math.floor(sweepXRef.current)] = y;
        }
      }

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Render Waveform Line
      ctx.lineWidth = displayMode === 'dark' ? 2 : 2.2;
      ctx.strokeStyle = displayMode === 'dark' ? '#2dd4bf' : '#b91c1c'; // teal or clinical deep red
      ctx.shadowColor = displayMode === 'dark' ? 'rgba(45, 212, 191, 0.4)' : 'transparent';
      ctx.shadowBlur = displayMode === 'dark' ? 4 : 0;
      ctx.beginPath();

      const sweepHead = Math.floor(sweepXRef.current);
      const eraseGap = 24; // gap ahead of sweep head

      // Draw segment 1: from sweepHead + eraseGap to end
      let started = false;
      for (let x = sweepHead + eraseGap; x < width; x++) {
        const y = bufferRef.current[x] ?? centerY;
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Draw segment 2: from 0 to sweepHead
      started = false;
      for (let x = 0; x < sweepHead; x++) {
        const y = bufferRef.current[x] ?? centerY;
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw Sweep Cursor Bar
      if (isRunning && !isPaused) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = displayMode === 'dark' ? 'rgba(45, 212, 191, 0.8)' : 'rgba(239, 68, 68, 0.8)';
        ctx.fillRect(sweepHead, 0, 2, height);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, isPaused, sweepSpeed, gain, displayMode, selectedPatient.currentVitals]);

  // Calibration reset
  const handleReset = () => {
    sweepXRef.current = 0;
    phaseRef.current = 0;
    const canvas = canvasRef.current;
    if (canvas) {
      const centerY = (canvas.clientHeight || 200) / 2;
      bufferRef.current = new Array(Math.ceil(canvas.clientWidth || 800)).fill(centerY);
    }
  };

  // Derived medical telemetry intervals
  const hr = selectedPatient.currentVitals.heartRate;
  const rrIntervalMs = Math.round(60000 / hr);
  // Bazett's formula for QTc: QTc = QT / sqrt(RR in seconds)
  const estimatedQt = Math.round(340 + (rrIntervalMs - 800) * 0.12);
  const qtcIntervalMs = Math.round(estimatedQt / Math.sqrt(rrIntervalMs / 1000));

  return (
    <div className="space-y-6">
      {/* Title Bar & Quick Telemetry Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Clinical ECG Waveform Monitor
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-mono">
              AD8232 Front-End
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time electrocardiogram synchronized with IoT telemetry hardware ({selectedPatient.name} · {selectedPatient.room})
          </p>
        </div>

        {/* Telemetry Numeric Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-right">
            <div className="text-[10px] font-semibold uppercase text-slate-500">Heart Rate</div>
            <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
              {hr} <span className="text-xs font-normal text-slate-500">BPM</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-right">
            <div className="text-[10px] font-semibold uppercase text-slate-500">R-R Interval</div>
            <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
              {rrIntervalMs} <span className="text-xs font-normal text-slate-500">ms</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-right">
            <div className="text-[10px] font-semibold uppercase text-slate-500">QTc Interval</div>
            <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
              {qtcIntervalMs} <span className="text-xs font-normal text-slate-500">ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Oscilloscope Display Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Oscilloscope Top Bar Controls */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Lead Selector & Signal Quality */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span>Lead:</span>
              <select
                value={lead}
                onChange={(e) => setLead(e.target.value as any)}
                className="bg-white border border-slate-200 rounded px-2 py-1 font-mono font-medium focus:outline-none"
              >
                <option value="Lead I">Lead I (RA-LA)</option>
                <option value="Lead II">Lead II (RA-LL) - Standard</option>
                <option value="Lead III">Lead III (LA-LL)</option>
                <option value="V1">Precordial V1</option>
                <option value="V5">Precordial V5</option>
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>SNR: <strong>98.4% (Clean)</strong></span>
            </div>

            <div className="flex items-center gap-1 text-slate-500 font-mono">
              <span>Duration:</span>
              <strong className="text-slate-800">{formatDuration(elapsedSeconds)}</strong>
            </div>
          </div>

          {/* Right: Sweep & View Mode Controls */}
          <div className="flex items-center gap-2">
            {/* Speed */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded">
              <span className="text-slate-500">Speed:</span>
              <button 
                onClick={() => setSweepSpeed(25)}
                className={`px-1.5 py-1 rounded font-mono font-semibold ${sweepSpeed === 25 ? 'bg-red-600 text-white' : 'text-slate-700'}`}
              >
                25mm/s
              </button>
              <button 
                onClick={() => setSweepSpeed(50)}
                className={`px-1.5 py-1 rounded font-mono font-semibold ${sweepSpeed === 50 ? 'bg-red-600 text-white' : 'text-slate-700'}`}
              >
                50mm/s
              </button>
            </div>

            {/* Gain */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded">
              <span className="text-slate-500">Gain:</span>
              <button 
                onClick={() => setGain(5)}
                className={`px-1.5 py-1 rounded font-mono font-semibold ${gain === 5 ? 'bg-red-600 text-white' : 'text-slate-700'}`}
              >
                5mm/mV
              </button>
              <button 
                onClick={() => setGain(10)}
                className={`px-1.5 py-1 rounded font-mono font-semibold ${gain === 10 ? 'bg-red-600 text-white' : 'text-slate-700'}`}
              >
                10mm/mV
              </button>
              <button 
                onClick={() => setGain(20)}
                className={`px-1.5 py-1 rounded font-mono font-semibold ${gain === 20 ? 'bg-red-600 text-white' : 'text-slate-700'}`}
              >
                20mm/mV
              </button>
            </div>

            {/* Dark Monitor vs Pink Paper Grid */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded">
              <button
                onClick={() => setDisplayMode('dark')}
                className={`px-2 py-1 rounded font-medium ${displayMode === 'dark' ? 'bg-slate-900 text-red-300' : 'text-slate-600'}`}
              >
                Monitor Grid
              </button>
              <button
                onClick={() => setDisplayMode('paper')}
                className={`px-2 py-1 rounded font-medium ${displayMode === 'paper' ? 'bg-red-600 text-white font-bold' : 'text-slate-600'}`}
              >
                ECG Paper
              </button>
            </div>
          </div>
        </div>

        {/* Oscilloscope Canvas Viewport (Responsive Height for Mobile) */}
        <div className={`relative h-64 sm:h-80 md:h-96 w-full ${displayMode === 'dark' ? 'ecg-grid-dark' : 'ecg-grid-light'}`}>
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-crosshair"
          />

          {/* On-screen Overlays */}
          <div className="absolute top-3 left-4 pointer-events-none select-none flex flex-col gap-0.5">
            <span className={`font-mono text-sm font-bold ${displayMode === 'dark' ? 'text-teal-400' : 'text-red-900'}`}>
              {selectedPatient.name} · {selectedPatient.id} · {lead}
            </span>
            <span className={`font-mono text-xs ${displayMode === 'dark' ? 'text-teal-300/70' : 'text-red-700/80'}`}>
              HR: {hr} BPM | SpO2: {selectedPatient.currentVitals.spo2}% | {selectedPatient.currentVitals.ecgStatus.toUpperCase()}
            </span>
          </div>

          <div className="absolute top-3 right-4 pointer-events-none select-none text-right">
            <span className={`font-mono text-xs px-2 py-1 rounded ${
              displayMode === 'dark' ? 'bg-slate-900/80 text-teal-300 border border-teal-700/50' : 'bg-white/90 text-red-900 border border-red-300'
            }`}>
              {sweepSpeed} mm/sec · {gain} mm/mV · 0.05-150 Hz
            </span>
          </div>

          {/* Freeze indicator badge when paused */}
          {isPaused && (
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs flex items-center justify-center pointer-events-none">
              <div className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wide shadow-lg uppercase flex items-center gap-2">
                <Pause className="w-4 h-4" /> Waveform Frozen (Clinical Inspection Mode)
              </div>
            </div>
          )}

          {/* Disclaimer Footer Bar inside Canvas */}
          <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[10px] pointer-events-none select-none">
            <span className={displayMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
              Standard Lead II ECG Morphology (P, QRS, T complexes calibrated to ISO/IEEE 11073-10406)
            </span>
            <span className={`font-semibold ${displayMode === 'dark' ? 'text-amber-400' : 'text-amber-800'}`}>
              SIMULATED DEMONSTRATION WAVEFORM
            </span>
          </div>
        </div>

        {/* Bottom Playback & Freeze Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isRunning 
                  ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isRunning ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isRunning ? 'Stop Monitor' : 'Start Monitor'}
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              disabled={!isRunning}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                isPaused
                  ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 disabled:opacity-50'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {isPaused ? 'Resume Sweep' : 'Pause / Freeze'}
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Buffer
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              Simulated AD8232 heart rhythm front-end
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
