import React, { useState, useEffect } from 'react';

interface MathMetric {
  label: string;
  formula: string;
  description: string;
  currentValue: string;
}

export const MathematicalFoundations: React.FC = () => {
  const [metrics, setMetrics] = useState<MathMetric[]>([
    {
      label: "Stochastic Dynamics",
      formula: "dX(t) = μ(X,t)dt + σ(X,t)dW(t)",
      description: "Models market state as a dynamical system with drift and volatility components.",
      currentValue: "σ = 0.042"
    },
    {
      label: "Consensus Equilibrium",
      formula: "C(t) = (Σ wᵢ Aᵢ(t)) / (Σ wⱼ), wᵢ ∈ [0, wₘₐₓ]",
      description: "Normalized collective intelligence. Weights are subject to role-based caps and performance decay.",
      currentValue: "Σw = 1.000"
    },
    {
      label: "Behavioral Entropy",
      formula: "H(t) = −∑ pᵢ(t) log pᵢ(t)",
      description: "Quantifies emotional dispersion and system instability in trader behavior.",
      currentValue: "H = 0.682"
    },
    {
      label: "Stability Constraint",
      formula: "dE/dt ≤ −γ · S(t)",
      description: "Enforces thermodynamic-style stability via conservation constraints and dissipation loops.",
      currentValue: "γ = 1.24"
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => {
        if (m.label === "Behavioral Entropy") {
          return { ...m, currentValue: `H = ${(0.6 + Math.random() * 0.1).toFixed(3)}` };
        }
        if (m.label === "Stochastic Dynamics") {
          return { ...m, currentValue: `σ = ${(0.04 + Math.random() * 0.01).toFixed(3)}` };
        }
        return m;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#262626] h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Physics Core Theory</h3>
          <p className="text-[10px] text-gray-600">Mathematical foundations of the ACTI ecosystem</p>
        </div>
        <div className="px-2 py-0.5 border border-blue-500/30 rounded text-[9px] text-blue-400 font-black uppercase tracking-widest">
          Verified
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="group cursor-help">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{m.label}</span>
              <span className="text-[10px] font-mono text-blue-500 font-bold">{m.currentValue}</span>
            </div>
            <div className="p-3 bg-black/40 rounded border border-[#222] group-hover:border-blue-500/30 transition-colors">
              <div className="text-xs font-mono text-gray-200 text-center mb-2 italic">
                {m.formula}
              </div>
              <p className="text-[9px] text-gray-600 leading-relaxed uppercase tracking-wide">
                {m.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-[#262626]">
        <div className="flex items-center gap-2 text-[9px] text-gray-600 font-bold uppercase italic">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          Formal verification: Quantum-Safe Serialization
        </div>
      </div>
    </div>
  );
};