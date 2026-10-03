import React, { useState, useEffect, memo } from 'react';
import { Agent, AgentStatus, ConnectionSource, TrainingMetrics, ROLE_CAPS, AgentRole } from '../types';

const AgentMetrics = memo(({ entropy, drift, usage, isActive }: { entropy: number, drift: number, usage: number, isActive: boolean }) => {
  const [displayMetrics, setDisplayMetrics] = useState({ entropy, drift, usage });
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setDisplayMetrics(prev => ({
        entropy: Math.max(0.01, Math.min(1.0, prev.entropy + (Math.random() - 0.5) * 0.04)),
        drift: Math.max(0, Math.min(1.0, prev.drift + (Math.random() - 0.5) * 0.02)),
        usage: Math.min(100, Math.max(0, prev.usage + (Math.random() - 0.5) * 4))
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, [isActive]);

  const getMetricColor = (val: number, threshold: number) => val > threshold ? 'text-red-400' : 'text-emerald-400';

  return (
    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#1a1a1a] pt-4">
      <div className="space-y-0.5">
        <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block">Entropy</span>
        <span className={`text-[11px] font-mono font-bold ${getMetricColor(displayMetrics.entropy, 0.7)}`}>
          {displayMetrics.entropy.toFixed(3)}
        </span>
      </div>
      <div className="space-y-0.5 border-x border-[#1a1a1a] px-2 text-center">
        <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block">Drift</span>
        <span className={`text-[11px] font-mono font-bold ${getMetricColor(displayMetrics.drift, 0.1)}`}>
          {displayMetrics.drift.toFixed(2)}
        </span>
      </div>
      <div className="space-y-0.5 text-right">
        <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block">Usage</span>
        <span className={`text-[11px] font-mono font-bold ${getMetricColor(displayMetrics.usage, 85)}`}>
          {Math.round(displayMetrics.usage)}%
        </span>
      </div>
    </div>
  );
});

const TrainingLiveMetrics = memo(({ initialMetrics, isActive }: { initialMetrics?: TrainingMetrics, isActive: boolean }) => {
  const [metrics, setMetrics] = useState<TrainingMetrics>(initialMetrics || {
    sharpeGradient: 0.1245,
    drawdownPenalty: 0.0412,
    learningRate: 0.0001,
    epoch: 120,
    convergence: 0.824
  });

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        sharpeGradient: Math.max(0.01, prev.sharpeGradient + (Math.random() - 0.5) * 0.02),
        drawdownPenalty: Math.max(0, prev.drawdownPenalty + (Math.random() - 0.5) * 0.01),
        epoch: prev.epoch + 1,
        convergence: Math.min(0.999, prev.convergence + Math.random() * 0.002)
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="mt-4 p-4 bg-blue-600/5 border border-blue-500/20 rounded-lg space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Neural Optimization Active</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-blue-500/60 uppercase">E_{metrics.epoch}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
        <div className="space-y-1">
          <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block">Sharpe Gradient</span>
          <span className="text-[12px] font-mono font-bold text-emerald-400">+{metrics.sharpeGradient.toFixed(5)}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block">Drawdown Penalty</span>
          <span className="text-[12px] font-mono font-bold text-red-500">-{metrics.drawdownPenalty.toFixed(5)}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block">Learning Rate</span>
          <span className="text-[11px] font-mono font-bold text-blue-300">{metrics.learningRate.toExponential(2)}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block">Convergence</span>
          <span className="text-[11px] font-mono font-bold text-gray-300">{(metrics.convergence * 100).toFixed(2)}%</span>
        </div>
      </div>

      <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-blue-500/10">
        <div 
          className="h-full bg-blue-600 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.6)]" 
          style={{ width: `${metrics.convergence * 100}%` }}
        ></div>
      </div>
    </div>
  );
});

const TradeConfirmation = ({ agent, side, onConfirm, onCancel }: { agent: Agent, side: 'BUY' | 'SELL', onConfirm: () => void, onCancel: () => void }) => (
  <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center animate-in fade-in zoom-in-95 duration-200">
    <div className={`mb-4 w-12 h-12 rounded-full flex items-center justify-center border ${side === 'BUY' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {side === 'BUY' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />}
      </svg>
    </div>
    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-2">Confirm {side} Order</h4>
    <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-6">Pipeline: {agent.connectionSource || 'Standard FIX'}</p>
    <div className="flex gap-3 w-full">
      <button onClick={onCancel} className="flex-1 py-2 bg-[#1a1a1a] border border-[#222] text-gray-500 text-[9px] font-black uppercase rounded hover:text-white hover:border-gray-600 transition-all tracking-widest">Cancel</button>
      <button onClick={onConfirm} className={`flex-1 py-2 text-white text-[9px] font-black uppercase rounded shadow-lg transition-all tracking-widest ${side === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40' : 'bg-red-600 hover:bg-red-500 shadow-red-900/40'}`}>Execute {side}</button>
    </div>
  </div>
);

const AgentCard = memo(({ 
  agent, 
  onTrain,
  onViewLogs,
  onConnectionChange,
  onExecuteTrade
}: { 
  agent: Agent, 
  onTrain: (id: string) => void,
  onViewLogs: (agent: Agent) => void,
  onConnectionChange: (id: string, source: ConnectionSource) => void,
  onExecuteTrade: (id: string, side: 'BUY' | 'SELL') => void
}) => {
  const [confirmTrade, setConfirmTrade] = useState<'BUY' | 'SELL' | null>(null);
  const isTraining = agent.status === AgentStatus.TRAINING;
  const isExecuting = agent.status === AgentStatus.EXECUTING;
  const canTrade = agent.type === 'Market' || agent.type === 'Signal';
  const roleCap = ROLE_CAPS[agent.type as AgentRole] || 1.0;

  const getStatusStyle = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.EXECUTING: return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5';
      case AgentStatus.TRAINING: return 'text-blue-500 border-blue-500/30 bg-blue-500/5';
      case AgentStatus.ERROR: return 'text-red-500 border-red-500/30 bg-red-500/5';
      default: return 'text-gray-500 border-gray-500/20 bg-gray-500/5';
    }
  };

  const handleConfirmAction = () => {
    if (confirmTrade) {
      onExecuteTrade(agent.id, confirmTrade);
      setConfirmTrade(null);
    }
  };

  return (
    <div className={`p-4 bg-[#0d0d0d] rounded-xl border transition-all duration-300 group relative ${
      isTraining ? 'border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-[#1a1a1a] hover:border-[#333]'
    }`}>
      {confirmTrade && (
        <TradeConfirmation 
          agent={agent} 
          side={confirmTrade} 
          onConfirm={handleConfirmAction} 
          onCancel={() => setConfirmTrade(null)} 
        />
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{String(agent.type)} NODE</span>
            <div className={`w-1.5 h-1.5 rounded-full ${isExecuting ? 'bg-emerald-500 animate-pulse' : 'bg-gray-800'}`}></div>
          </div>
          <h4 className="text-sm font-mono font-bold text-white uppercase group-hover:text-blue-400 transition-colors">
            {String(agent.name)}
          </h4>
        </div>
        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${getStatusStyle(agent.status)}`}>
          {String(agent.status)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[8px] text-gray-700 font-black uppercase block mb-1 tracking-widest">Gateway Link</label>
          <select 
            value={agent.connectionSource || ConnectionSource.MT5}
            onChange={(e) => onConnectionChange(agent.id, e.target.value as ConnectionSource)}
            className="w-full bg-[#111] border border-[#1a1a1a] text-[10px] text-gray-400 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
          >
            {Object.values(ConnectionSource).map(source => (
              <option key={String(source)} value={String(source)}>{String(source)}</option>
            ))}
          </select>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[8px] text-gray-700 font-black uppercase tracking-widest">Weight</label>
            <span className="text-[9px] font-mono text-blue-400 font-bold">{(agent.normalizedWeight * 100).toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-black rounded-full overflow-hidden border border-[#222]">
            <div className="h-full bg-blue-500/50" style={{ width: `${agent.normalizedWeight * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 px-1">
         <div className="flex flex-col">
            <span className="text-[7px] text-gray-600 uppercase font-black tracking-widest">Health (Decay)</span>
            <span className={`text-[10px] font-mono font-bold ${agent.metrics.decayFactor > 0.8 ? 'text-emerald-500' : 'text-yellow-500'}`}>
               {(agent.metrics.decayFactor * 100).toFixed(1)}%
            </span>
         </div>
         <div className="flex flex-col text-right">
            <span className="text-[7px] text-gray-600 uppercase font-black tracking-widest">Role Cap</span>
            <span className="text-[10px] font-mono font-bold text-gray-400">
               {(roleCap * 100).toFixed(0)}%
            </span>
         </div>
      </div>

      {isTraining ? (
        <TrainingLiveMetrics initialMetrics={agent.training} isActive={isTraining} />
      ) : (
        <AgentMetrics 
          entropy={agent.metrics.entropy} 
          drift={agent.metrics.drift} 
          usage={agent.metrics.usage}
          isActive={isExecuting}
        />
      )}
      
      <div className="flex items-center gap-4 mt-4 border-t border-[#1a1a1a] pt-4">
        <button 
          onClick={() => onViewLogs(agent)}
          className="text-[9px] text-gray-600 hover:text-blue-400 flex items-center gap-1.5 font-black uppercase transition-all tracking-widest"
        >
          <svg className="w-3.6 h-3.6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Audit Logs
        </button>

        {isExecuting && canTrade && (
          <div className="flex gap-2 ml-auto animate-in slide-in-from-right-2 duration-300">
            <button 
              onClick={() => setConfirmTrade('BUY')}
              className="px-3 py-1 bg-emerald-600/10 border border-emerald-500/30 text-emerald-500 text-[8px] font-black uppercase rounded hover:bg-emerald-600 hover:text-white transition-all tracking-widest"
            >
              Buy
            </button>
            <button 
              onClick={() => setConfirmTrade('SELL')}
              className="px-3 py-1 bg-red-600/10 border border-red-500/30 text-red-500 text-[8px] font-black uppercase rounded hover:bg-red-600 hover:text-white transition-all tracking-widest"
            >
              Sell
            </button>
          </div>
        )}

        {(agent.status === AgentStatus.IDLE || agent.status === AgentStatus.ERROR) && (
          <button 
            onClick={() => onTrain(agent.id)}
            className="text-[9px] text-blue-500 hover:text-blue-400 font-black uppercase transition-all tracking-widest flex items-center gap-1.5 ml-auto"
          >
            <svg className="w-3.6 h-3.6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Optimize
          </button>
        )}
      </div>
    </div>
  );
});

interface Props {
  agents: Agent[];
  onTrainAgent: (id: string) => void;
  onViewLogs: (agent: Agent) => void;
  onAddAgent: () => void;
  onAgentConnectionChange: (id: string, source: ConnectionSource) => void;
  onExecuteTrade: (id: string, side: 'BUY' | 'SELL') => void;
}

export const AgentStatusPanel: React.FC<Props> = ({ 
  agents, 
  onTrainAgent, 
  onViewLogs,
  onAddAgent,
  onAgentConnectionChange,
  onExecuteTrade
}) => {
  return (
    <div className="bg-[#050505] p-6 rounded-2xl border border-[#1a1a1a] h-full flex flex-col shadow-2xl overflow-hidden font-mono">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h3 className="text-[12px] font-black text-white uppercase tracking-[0.25em]">Autonomous Fleet</h3>
          <p className="text-[9px] text-gray-600 uppercase font-bold mt-1 tracking-widest">Decentralized Intelligence Nodes</p>
        </div>
        <button 
          onClick={onAddAgent}
          className="w-10 h-10 flex items-center justify-center bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-lg"
          title="Initialize New Neural Node"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {agents.map((agent) => (
          <AgentCard 
            key={String(agent.id)} 
            agent={agent} 
            onTrain={onTrainAgent} 
            onViewLogs={onViewLogs}
            onConnectionChange={onAgentConnectionChange}
            onExecuteTrade={onExecuteTrade}
          />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-[#1a1a1a] flex justify-between items-center text-[9px] text-gray-700 font-black uppercase tracking-widest shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          Mesh Synchronized
        </div>
        <span className="font-mono text-blue-500/70">Nodes: {String(agents.length)}</span>
      </div>
    </div>
  );
};