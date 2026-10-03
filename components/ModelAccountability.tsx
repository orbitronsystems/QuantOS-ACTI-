
import React, { useState, useMemo } from 'react';
import { DecisionAudit, MarketRegime, Agent } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const MOCK_DECISIONS: DecisionAudit[] = [
  {
    id: 'd-1',
    timestamp: '14:20:42',
    action: 'LONG ORDER_EXECUTED',
    regime: MarketRegime.BULLISH,
    consensusScore: 0.88,
    attributions: [
      { agentId: 'm1', agentName: 'Binance-Node-Alpha', weight: 0.42, contribution: 'Price breakout confirmed at $64.2k' },
      { agentId: 's1', agentName: 'Bloomberg-B-Pipe', weight: 0.28, contribution: 'Institutional accumulation bias detected' },
      { agentId: 'b1', agentName: 'Behavior-Correct-V1', weight: 0.30, contribution: 'Trader sentiment alignment: Neutral' }
    ]
  },
  {
    id: 'd-2',
    timestamp: '15:05:12',
    action: 'RISK_HEDGE_ACTIVATED',
    regime: MarketRegime.VOLATILE,
    consensusScore: 0.94,
    attributions: [
      { agentId: 'm1', agentName: 'Binance-Node-Alpha', weight: 0.20, contribution: 'Liquidity drain detected' },
      { agentId: 's1', agentName: 'Bloomberg-B-Pipe', weight: 0.35, contribution: 'Cross-venue desync threshold exceeded' },
      { agentId: 'b1', agentName: 'Behavior-Correct-V1', weight: 0.45, contribution: 'Panic signature identified in retail flow' }
    ]
  },
  {
    id: 'd-3',
    timestamp: '16:00:00',
    action: 'NEUTRAL_FLATTEN',
    regime: MarketRegime.STAGNANT,
    consensusScore: 0.72,
    attributions: [
      { agentId: 'm1', agentName: 'Binance-Node-Alpha', weight: 0.33, contribution: 'Volume decay threshold met' },
      { agentId: 's1', agentName: 'Bloomberg-B-Pipe', weight: 0.33, contribution: 'No alpha signal in current window' },
      { agentId: 'b1', agentName: 'Behavior-Correct-V1', weight: 0.34, contribution: 'Equilibrium reached' }
    ]
  }
];

const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444'];

export const ModelAccountability: React.FC<{ agents: Agent[] }> = ({ agents }) => {
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>(MOCK_DECISIONS[0].id);

  const selectedDecision = useMemo(() => 
    MOCK_DECISIONS.find(d => d.id === selectedDecisionId) || MOCK_DECISIONS[0],
    [selectedDecisionId]
  );

  const chartData = useMemo(() => 
    selectedDecision.attributions.map(a => ({
      name: a.agentName,
      value: a.weight * 100
    })),
    [selectedDecision]
  );

  return (
    <div className="flex flex-col h-full space-y-6 font-mono">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Decision History List */}
        <div className="lg:col-span-1 bg-[#0d0d0d] rounded-xl border border-[#1a1a1a] flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[#222] bg-[#111]">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Decision Audit Log</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {MOCK_DECISIONS.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDecisionId(d.id)}
                className={`w-full text-left p-4 border-b border-[#1a1a1a] transition-all hover:bg-white/5 ${
                  selectedDecisionId === d.id ? 'bg-blue-600/10 border-l-2 border-l-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-gray-500 font-bold">{d.timestamp}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${
                    d.regime === MarketRegime.BULLISH ? 'text-emerald-500 bg-emerald-500/10' :
                    d.regime === MarketRegime.VOLATILE ? 'text-red-500 bg-red-500/10' : 'text-blue-500 bg-blue-500/10'
                  }`}>
                    {d.regime}
                  </span>
                </div>
                <h4 className={`text-[11px] font-black uppercase tracking-wider ${
                  selectedDecisionId === d.id ? 'text-blue-400' : 'text-gray-300'
                }`}>
                  {d.action}
                </h4>
              </button>
            ))}
          </div>
        </div>

        {/* Accountability Details */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-[#0d0d0d] rounded-xl border border-[#1a1a1a] p-6 flex flex-col flex-1 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Consensus Score</span>
                <span className="text-xl font-black text-blue-500">{(selectedDecision.consensusScore * 100).toFixed(0)}%</span>
              </div>
            </div>

            <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] mb-8">Node Attribution Breakdown</h3>

            <div className="flex flex-col xl:flex-row items-center gap-10 flex-1">
              <div className="w-full xl:w-1/2 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={800}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', color: '#666', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full xl:w-1/2 space-y-4">
                {selectedDecision.attributions.map((attr, idx) => (
                  <div key={attr.agentId} className="p-3 bg-black/40 border border-[#1a1a1a] rounded-lg group hover:border-blue-500/30 transition-all">
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{attr.agentName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-white">{(attr.weight * 100).toFixed(1)}%</span>
                    </div>
                    <p className="text-[9px] text-gray-600 uppercase italic leading-tight">
                      "{attr.contribution}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
             <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Formal Proof of Responsibility</span>
             </div>
             <p className="text-[9px] text-gray-500 uppercase font-bold leading-relaxed tracking-widest">
               Each decision is signed with the weight matrix of the consensus cluster at time of execution. Attribution is cryptographically linked to the specific agent logic hash.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
