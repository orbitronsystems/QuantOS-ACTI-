
import React, { memo } from 'react';
import { ForecastingModel } from '../types';
import { Icons } from '../constants';

const ForecastCard = memo(({ model }: { model: ForecastingModel }) => {
  const isHighSignal = model.buyingRatio > 0.65;
  const ofiColor = model.orderFlowImbalance > 0 ? 'text-emerald-400' : 'text-red-400';

  return (
    <div className={`p-4 bg-[#0d0d0d] border rounded transition-all group hover:bg-[#111] ${
      isHighSignal ? 'border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-[#262626]'
    }`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isHighSignal ? 'bg-blue-500 animate-pulse' : 'bg-gray-700'}`}></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{model.type} Matrix</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono font-bold ${ofiColor}`}>
            OFI: {(model.orderFlowImbalance * 100).toFixed(1)}%
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
            model.prediction === 'CALL' || model.prediction === 'LONG' || model.prediction === 'ACCUMULATE'
              ? 'bg-emerald-500/10 text-emerald-500' 
              : 'bg-red-500/10 text-red-500'
          }`}>
            {model.prediction}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Buying Ratio */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] text-gray-500 uppercase font-bold">Consensus Ratio</span>
            <span className={`text-[10px] font-mono font-bold ${isHighSignal ? 'text-blue-400' : 'text-gray-500'}`}>
              {(model.buyingRatio * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-black/50 h-1 rounded-full overflow-hidden border border-[#222]">
            <div 
              className={`h-full transition-all duration-1000 ${isHighSignal ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-gray-700'}`} 
              style={{ width: `${model.buyingRatio * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Multi-Factor Pattern Recognition */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-black/40 rounded border border-[#222]">
            <span className="text-[7px] text-gray-600 uppercase font-black block mb-0.5 tracking-tighter">GEX Sync</span>
            <span className="text-[10px] font-mono text-emerald-400">{(model.gammaExposure * 100).toFixed(1)}%</span>
          </div>
          <div className="p-2 bg-black/40 rounded border border-[#222]">
            <span className="text-[7px] text-gray-600 uppercase font-black block mb-0.5 tracking-tighter">Pattern λ</span>
            <span className="text-[10px] font-mono text-gray-300">{(model.patternMatch * 100).toFixed(2)}%</span>
          </div>
          <div className="p-2 bg-black/40 rounded border border-[#222]">
            <span className="text-[7px] text-gray-600 uppercase font-black block mb-0.5 tracking-tighter">T-Delta</span>
            <span className="text-[10px] font-mono text-blue-400">{model.timeToRecognition.toFixed(1)}s</span>
          </div>
        </div>

        {/* Institutional Confidence */}
        <div className="pt-2 border-t border-[#222] flex justify-between items-center">
          <span className="text-[8px] text-gray-600 uppercase font-bold">Sharpe-Optimized Confidence</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-0.5 rounded-full ${i < model.confidence * 5 ? 'bg-blue-500/80' : 'bg-gray-800'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

interface Props {
  forecasts: ForecastingModel[];
}

export const ForecastingPanel: React.FC<Props> = ({ forecasts }) => {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#262626] h-full flex flex-col shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Timing Recognition Cluster</h3>
          <p className="text-[10px] text-gray-600">Cross-derivatives liquidity arbitrage & OFI</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
          <Icons.ChartLine />
        </div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {forecasts.map(f => (
          <ForecastCard key={f.id} model={f} />
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg flex items-start gap-3">
        <div className="mt-1 text-blue-400"><Icons.News /></div>
        <p className="text-[9px] text-gray-500 leading-relaxed uppercase tracking-widest font-bold">
          <span className="text-blue-400">Arb Core:</span> Gamma squeeze probability rising in 0DTE options cluster. Spot accumulation accelerating at local dealer-flip-zone.
        </p>
      </div>
    </div>
  );
};
