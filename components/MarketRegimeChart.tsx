import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MarketDataPoint } from '../types';

interface Props {
  data: MarketDataPoint[];
}

export const MarketRegimeChart: React.FC<Props> = ({ data }) => {
  const [activeLayer, setActiveLayer] = useState<'Standard' | 'GEX' | 'Liquidity'>('Standard');

  return (
    <div className="h-[400px] min-h-[400px] w-full bg-[#0d0d0d] p-6 rounded-xl border border-[#1a1a1a] relative group flex flex-col overflow-hidden font-mono shadow-xl">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Stochastic Visualization</h3>
          <p className="text-[9px] text-gray-600 uppercase font-bold mt-1 tracking-widest">Institutional Cross-Asset Flux</p>
        </div>
        <div className="flex gap-2">
          {['Standard', 'GEX', 'Liquidity'].map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer as any)}
              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded transition-all border ${
                activeLayer === layer 
                  ? 'bg-blue-600/10 border-blue-500/40 text-blue-400' 
                  : 'bg-[#1a1a1a] border-[#262626] text-gray-600 hover:text-gray-400'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute top-24 right-10 z-10 space-y-2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
          <div className="w-2.5 h-1 rounded-full bg-blue-500"></div> Price (Spot)
        </div>
        {activeLayer === 'Standard' && (
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
            <div className="w-2.5 h-1 rounded-full bg-red-500"></div> Risk Energy
          </div>
        )}
        {activeLayer === 'GEX' && (
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500">
            <div className="w-2.5 h-1 rounded-full bg-emerald-500"></div> Gamma Exp
          </div>
        )}
        {activeLayer === 'Liquidity' && (
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-purple-500">
            <div className="w-2.5 h-1 rounded-full bg-purple-500"></div> Depth Density
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 min-w-0 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGEX" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLiq" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              stroke="#444" 
              fontSize={9} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666' }}
            />
            <YAxis yAxisId="left" stroke="#444" fontSize={9} axisLine={false} tickLine={false} domain={['auto', 'auto']} tick={{ fill: '#666' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#444" fontSize={9} axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #262626', borderRadius: '4px', fontSize: '10px' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#666', marginBottom: '4px' }}
            />
            <Area yAxisId="left" type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" animationDuration={500} />
            
            {activeLayer === 'Standard' && (
              <Area yAxisId="right" type="monotone" dataKey="riskEnergy" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorRisk)" />
            )}
            {activeLayer === 'GEX' && (
              <Area yAxisId="right" type="monotone" dataKey="gammaExposure" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorGEX)" />
            )}
            {activeLayer === 'Liquidity' && (
              <Area yAxisId="right" type="stepAfter" dataKey="liquidityDensity" stroke="#a855f7" strokeWidth={1.5} fillOpacity={1} fill="url(#colorLiq)" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-between items-center px-2 shrink-0 border-t border-[#1a1a1a] pt-4">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Implied Vol (IV)</span>
            <span className="text-[12px] font-mono font-bold text-blue-400 mt-0.5">14.2%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Net Gamma</span>
            <span className="text-[12px] font-mono font-bold text-emerald-400 mt-0.5">+$2.4B</span>
          </div>
        </div>
        <div className="text-right">
           <span className="text-[9px] text-gray-700 italic font-black uppercase tracking-[0.2em]">Dealer Support: 52,400</span>
        </div>
      </div>
    </div>
  );
};