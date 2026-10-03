import React, { useState, useEffect, useMemo } from 'react';
import { Agent, AgentStatus, AgentPreset, ConnectionSource, AgentRole } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (agent: Partial<Agent>) => void;
}

interface ValidationError {
  type: 'Security' | 'Performance' | 'Syntax';
  message: string;
  severity: 'Critical' | 'Warning';
}

const AGENT_TYPES: AgentRole[] = ['Market', 'Signal', 'Behavior', 'Risk', 'Security', 'Knowledge'];

const DEFAULT_PRESETS: AgentPreset[] = [
  { id: 'p1', name: 'Alpha Regime Hunter', type: 'Market', weight: 0.9, source: ConnectionSource.MT5 },
  { id: 'p2', name: 'Bias Eraser', type: 'Behavior', weight: 0.7, source: ConnectionSource.TRADINGVIEW },
  { id: 'p3', name: 'Risk Dissipator', type: 'Risk', weight: 1.0, source: ConnectionSource.RITHMIC },
];

const DEFAULT_ALGORITHM = `/**
 * Stochastic Logic Engine v1.0
 * Define your custom ACTI behavior here.
 */
function evaluate(marketState) {
  const entropy = marketState.entropy;
  const drift = marketState.drift;
  
  // Custom signal logic
  if (entropy < 0.3 && drift < 0.05) {
    return "ACCUMULATE_HIGH_CONVICTION";
  }
  
  return "NEUTRAL_STANDBY";
}`;

// Static Analysis Heuristics
const SAFETY_RULES = [
  { pattern: /eval\s*\(/, message: "Use of 'eval()' is strictly prohibited for security reasons.", type: 'Security', severity: 'Critical' },
  { pattern: /new\s+Function\s*\(/, message: "Dynamic function constructors are blocked by the sandbox.", type: 'Security', severity: 'Critical' },
  { pattern: /fetch\s*\(|XMLHttpRequest|WebSocket/, message: "External network calls are prohibited. Agents must remain air-gapped.", type: 'Security', severity: 'Critical' },
  { pattern: /window\.|document\.|globalThis\.|process\./, message: "Attempted escape of execution context. Access to global objects is restricted.", type: 'Security', severity: 'Critical' },
  { pattern: /localStorage|sessionStorage|indexedDB|cookie/, message: "Storage API access is restricted. Use provided parameter states instead.", type: 'Security', severity: 'Critical' },
  { pattern: /while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)/, message: "Potential infinite loop detected. This will cause node hang-up.", type: 'Performance', severity: 'Critical' },
  { pattern: /setTimeout|setInterval/, message: "Timed execution is handled by the QuantOS clock, not local timers.", type: 'Performance', severity: 'Critical' },
  { pattern: /\.forEach\s*\(\s*async/, message: "Asynchronous iterations may lead to non-deterministic execution order.", type: 'Performance', severity: 'Warning' },
  { pattern: /console\.(log|debug|info|warn|error)/, message: "Standard console logging is redirected to Agent Logs. Avoid excessive use.", type: 'Performance', severity: 'Warning' },
];

export const CreateAgentModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<AgentRole>('Market');
  const [priority, setPriority] = useState('0.5');
  const [source, setSource] = useState<ConnectionSource>(ConnectionSource.MT5);
  const [presets, setPresets] = useState<AgentPreset[]>([]);
  
  // Custom logic states
  const [useCustomAlgo, setUseCustomAlgo] = useState(false);
  const [algorithm, setAlgorithm] = useState(DEFAULT_ALGORITHM);
  const [parameters, setParameters] = useState('{\n  "threshold": 0.85,\n  "decay": 0.002\n}');
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('quantos_presets');
    if (saved) {
      setPresets(JSON.parse(saved));
    } else {
      setPresets(DEFAULT_PRESETS);
    }
  }, [isOpen]);

  const validateCode = (code: string): ValidationError[] => {
    const findings: ValidationError[] = [];

    // 1. Basic JS syntax check
    try {
      new Function('marketState', code);
    } catch (err: any) {
      findings.push({ type: 'Syntax', message: `Parse Error: ${err.message}`, severity: 'Critical' });
      // If syntax is broken, skip further regex checks as code structure might be invalid
      return findings;
    }

    // 2. Security & Performance Heuristics
    SAFETY_RULES.forEach(rule => {
      if (rule.pattern.test(code)) {
        findings.push({ type: rule.type as any, message: rule.message, severity: rule.severity as any });
      }
    });

    return findings;
  };

  useEffect(() => {
    if (useCustomAlgo) {
      const currentErrors = validateCode(algorithm);
      setErrors(currentErrors);
    } else {
      setErrors([]);
    }
  }, [algorithm, useCustomAlgo]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: AgentPreset) => {
    setName(preset.name);
    setType(preset.type);
    setPriority(preset.weight.toString());
    setSource(preset.source);
  };

  const handleSavePreset = () => {
    if (!name) return;
    const newPreset: AgentPreset = {
      id: `preset-${Date.now()}`,
      name,
      type,
      weight: parseFloat(priority),
      source
    };
    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem('quantos_presets', JSON.stringify(updated));
  };

  const hasCriticalErrors = useMemo(() => errors.some(e => e.severity === 'Critical'), [errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || hasCriticalErrors) return;

    onCreate({
      name: name.trim(),
      type,
      status: AgentStatus.IDLE,
      rawPriority: parseFloat(priority),
      lastUpdate: 'now',
      connectionSource: source,
      algorithm: useCustomAlgo ? algorithm : undefined,
      parameters: parameters,
      logs: [{
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        message: `Agent ${name} initialized ${useCustomAlgo ? 'with custom algorithm' : ''} via ${source}.`
      }],
      metrics: {
        entropy: 1.0,
        drift: 0.0,
        usage: 0,
        consensusDelta: 0,
        decayFactor: 1.0
      }
    });
    
    setName('');
    setType('Market');
    setPriority('0.5');
    setUseCustomAlgo(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#0d0d0d] border border-[#262626] rounded-lg shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden font-mono flex flex-col max-h-[90vh]">
        <div className="bg-[#1a1a1a] px-6 py-4 border-b border-[#262626] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Initialize Neural Node Cluster</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl leading-none">&times;</button>
        </div>

        <div className="overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-[#222] bg-[#0f0f0f]">
            <label className="text-[9px] text-gray-600 uppercase font-black block mb-2 tracking-widest">Strategy Presets</label>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2 py-1 bg-[#1a1a1a] border border-[#262626] hover:border-blue-500/50 text-[9px] text-gray-400 rounded transition-all uppercase font-bold"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1.5 tracking-widest">Node Identifier</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. ALPHA_BETA_NODE"
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1.5 tracking-widest">Modality</label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value as AgentRole)}
                      className="w-full bg-[#0a0a0a] border border-[#262626] rounded px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none font-mono"
                    >
                      {AGENT_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1.5 tracking-widest">Interface</label>
                    <select 
                      value={source}
                      onChange={(e) => setSource(e.target.value as ConnectionSource)}
                      className="w-full bg-[#0a0a0a] border border-[#262626] rounded px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none font-mono"
                    >
                      {Object.values(ConnectionSource).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Base Influence Priority</label>
                    <span className="text-[10px] text-blue-400 font-mono">{priority}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full h-1 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1.5 tracking-widest">Initialization Parameters (JSON)</label>
                  <textarea 
                    value={parameters}
                    onChange={(e) => setParameters(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded px-3 py-2 text-[11px] text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono h-[140px] resize-none overflow-y-auto"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-[#262626] pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="custom-algo"
                    checked={useCustomAlgo}
                    onChange={(e) => setUseCustomAlgo(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-[#0a0a0a]"
                  />
                  <label htmlFor="custom-algo" className="text-[10px] text-blue-400 uppercase font-black tracking-widest cursor-pointer">
                    Inject Custom Stochastic Logic
                  </label>
                </div>
                {useCustomAlgo && errors.length === 0 && (
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/30 font-bold uppercase flex items-center gap-1.5">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Logic Integrity Check: Pass
                  </span>
                )}
              </div>

              {useCustomAlgo && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-[#050505] rounded border border-[#262626] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#111] border-b border-[#262626]">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/30"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/30"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/30"></div>
                      </div>
                      <span className="text-[8px] text-gray-600 uppercase font-bold">ACTI_ENGINE_SANDBOX.JS</span>
                    </div>
                    <textarea 
                      value={algorithm}
                      onChange={(e) => setAlgorithm(e.target.value)}
                      className="w-full bg-transparent p-4 text-[11px] text-blue-300 focus:outline-none font-mono h-[240px] resize-none overflow-y-auto"
                      spellCheck={false}
                    />
                  </div>
                  
                  <div className="bg-[#0a0a0a] rounded border border-[#262626] p-4 flex flex-col h-[264px]">
                    <h4 className="text-[9px] text-gray-500 uppercase font-black mb-3 tracking-[0.2em] border-b border-[#222] pb-2">Analysis Result</h4>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                      {errors.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 mb-3">
                             <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                          </div>
                          <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Clean Slate</span>
                          <p className="text-[9px] text-gray-600 leading-relaxed uppercase tracking-widest">No violations found in current stochastic branch.</p>
                        </div>
                      ) : (
                        errors.map((err, i) => (
                          <div key={i} className={`p-3 rounded border flex gap-3 ${
                            err.severity === 'Critical' ? 'bg-red-500/5 border-red-500/20' : 'bg-yellow-500/5 border-yellow-500/20'
                          }`}>
                            <div className="mt-0.5 shrink-0">
                               {err.severity === 'Critical' ? (
                                 <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                               ) : (
                                 <svg className="w-3 h-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                               )}
                            </div>
                            <div className="flex flex-col">
                               <span className={`text-[8px] font-black uppercase tracking-widest mb-0.5 ${err.severity === 'Critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                                 {err.type} • {err.severity}
                               </span>
                               <span className="text-[10px] text-gray-400 font-mono leading-tight">{err.message}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-[#262626]">
              <button 
                type="button"
                onClick={handleSavePreset}
                className="w-full py-2 bg-[#1a1a1a] text-blue-500 text-[10px] font-bold uppercase rounded border border-blue-500/20 hover:bg-blue-500/5 transition-all"
              >
                Snapshot Neural Configuration
              </button>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-[#1a1a1a] text-gray-500 text-[10px] font-bold uppercase rounded border border-[#262626] hover:text-gray-300 transition-colors"
                >
                  Abort Initialization
                </button>
                <button 
                  type="submit"
                  disabled={hasCriticalErrors || !name.trim()}
                  className={`flex-1 px-4 py-2 text-white text-[10px] font-bold uppercase rounded transition-all shadow-lg border border-blue-400/20 ${
                    hasCriticalErrors || !name.trim()
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-none shadow-none' 
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/50'
                  }`}
                >
                  {hasCriticalErrors ? 'Deployment Blocked' : 'Deploy Node Cluster'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};