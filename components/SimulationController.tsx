import React, { useState } from 'react';
import { SimulationScenario, MarketRegime, MarketDataPoint } from '../types';

interface Props {
  isActive: boolean;
  onToggle: (active: boolean) => void;
  onSelectScenario: (scenario: SimulationScenario) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

const MOCK_SCENARIOS: SimulationScenario[] = [
  {
    id: 'flash-crash',
    name: 'Q3 Liquid Gap (Flash Crash)',
    description: 'Systemic liquidity drain across tier-1 venues. Rapid mean-reversion opportunity.',
    data: Array.from({ length: 60 }, (_, i) => ({
      timestamp: `H:${i}`,
      price: i < 30 ? 65000 - i * 50 : 63500 - (i - 30) * 800 + (i > 40 ? (i - 40) * 600 : 0),
      volume: 1000 + Math.random() * 8000,
      entropy: i > 30 ? 0.9 : 0.2,
      riskEnergy: i > 30 ? 0.8 : 0.1,
      liquidityDensity: i > 30 ? 10 : 80,
      gammaExposure: i > 30 ? -4.5 : 1.2,
      regime: i > 30 ? MarketRegime.VOLATILE : MarketRegime.BULLISH,
      actualOutcome: i > 50 ? 64000 : 0
    }))
  },
  {
    id: 'bull-run',
    name: 'Institutional Accumulation',
    description: 'Slow-burn buy-side pressure with hidden iceberg orders. Sentiment divergence.',
    data: Array.from({ length: 60 }, (_, i) => ({
      timestamp: `H:${i}`,
      price: 60000 + i * 150 + (Math.random() - 0.5) * 200,
      volume: 2000 + Math.random() * 3000,
      entropy: 0.15,
      riskEnergy: 0.05,
      liquidityDensity: 90,
      gammaExposure: 2.1,
      regime: MarketRegime.BULLISH,
      actualOutcome: 70000
    }))
  }
];

export const SimulationController: React.FC<Props> = ({ isActive, onToggle, onSelectScenario, playbackSpeed, setPlaybackSpeed }) => {
  const [selectedId, setSelectedId] = useState<string>('');

  return (
    <div className={`p-6 bg-[#0d0d0d] border rounded-xl transition-all duration-300 ${isActive ? 'border-amber-500/40 bg-amber-500/5' : 'border-[#1a1a1a]'}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-amber-500 animate-pulse' : 'bg-gray-800'}`}></div>
          <div>
            <h3 className={`text-[12px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-amber-500' : 'text-white'}`}>
              Simulation & Replay
            </h3>
            <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mt-1">
              {isActive ? 'Backtesting Adaptive Logic' : 'Historical Node Validation'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onToggle(!isActive)}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
            isActive 
              ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-900/40' 
              : 'bg-[#1a1a1a] border-[#262626] text-gray-500 hover:text-white'
          }`}
        >
          {isActive ? 'Terminate Sim' : 'Initiate Replay'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[9px] text-gray-600 uppercase font-black block mb-2 tracking-widest">Select Scenario</label>
          <div className="grid grid-cols-1 gap-2">
            {MOCK_SCENARIOS.map(s => (
              <button 
                key={s.id}
                disabled={isActive}
                onClick={() => { setSelectedId(s.id); onSelectScenario(s); }}
                className={`text-left p-3 rounded border transition-all ${
                  selectedId === s.id 
                    ? 'bg-amber-600/10 border-amber-500/40' 
                    : 'bg-black/40 border-[#1a1a1a] hover:border-[#333]'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[11px] font-black uppercase ${selectedId === s.id ? 'text-amber-400' : 'text-gray-300'}`}>{s.name}</span>
                  <span className="text-[8px] text-gray-600 font-mono">T-60 STEP</span>
                </div>
                <p className="text-[9px] text-gray-500 leading-tight">{s.description}</p>
              </button>
            ))}
          </div>
        </div>

        {isActive && (
          <div className="pt-4 border-t border-amber-500/20 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] text-amber-500/60 uppercase font-black tracking-widest">Replay Velocity</span>
              <span className="text-[10px] font-mono text-amber-500 font-bold">{playbackSpeed}x</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
              className="w-full h-1 bg-amber-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        )}
      </div>

      {!isActive && selectedId && (
        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg flex items-start gap-3">
          <svg className="w-4 h-4 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-[9px] text-gray-500 leading-relaxed uppercase tracking-widest font-bold">
            <span className="text-blue-400">Backtest Note:</span> Replay mode disconnects from real-time venues and uses local snapshots for zero-latency node auditing.
          </p>
        </div>
      )}
    </div>
  );
};