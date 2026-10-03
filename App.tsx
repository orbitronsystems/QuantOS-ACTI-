import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Agent, AgentStatus, MarketDataPoint, MarketRegime, BehaviorMetric, ConnectionSource, EmotionalAssessment, ForecastingModel, ROLE_CAPS, AgentRole, SimulationScenario, User } from './types';
import { Icons } from './constants';
import { MarketRegimeChart } from './components/MarketRegimeChart';
import { AgentStatusPanel } from './components/AgentStatusPanel';
import { BehavioralCorrection } from './components/BehavioralCorrection';
import { LogModal } from './components/LogModal';
import { CreateAgentModal } from './components/CreateAgentModal';
import { MathematicalFoundations } from './components/MathematicalFoundations';
import { ForecastingPanel } from './components/ForecastingPanel';
import { TerminalTicker } from './components/TerminalTicker';
import { GlobalExchangeGateway } from './components/GlobalExchangeGateway';
import { SimulationController } from './components/SimulationController';
import { AuthSystem } from './components/AuthSystem';
import { IntegrationManager } from './components/IntegrationManager';
import { ModelAccountability } from './components/ModelAccountability';
import { SecurityDashboard } from './components/SecurityDashboard';
import { PreFlightCheck } from './components/PreFlightCheck';
import { geminiService } from './services/geminiService';

const INITIAL_AGENTS: Agent[] = [
  { id: 'm1', name: 'Binance-Node-Alpha', type: 'Market', status: AgentStatus.EXECUTING, rawPriority: 0.8, normalizedWeight: 0.33, lastUpdate: 'now', logs: [], connectionSource: ConnectionSource.BINANCE, metrics: { entropy: 0.45, drift: 0.02, usage: 88, consensusDelta: 0.01, decayFactor: 1.0, backtestPnl: 0 } },
  { id: 's1', name: 'Bloomberg-B-Pipe', type: 'Knowledge', status: AgentStatus.EXECUTING, rawPriority: 0.5, normalizedWeight: 0.33, lastUpdate: 'now', logs: [], connectionSource: ConnectionSource.BLOOMBERG, metrics: { entropy: 0.62, drift: 0.08, usage: 45, consensusDelta: 0.12, decayFactor: 0.95, backtestPnl: 0 } },
  { id: 'b1', name: 'Behavior-Correct-V1', type: 'Behavior', status: AgentStatus.IDLE, rawPriority: 0.9, normalizedWeight: 0.34, lastUpdate: 'now', logs: [], connectionSource: ConnectionSource.BYBIT, metrics: { entropy: 0.21, drift: 0.05, usage: 92, consensusDelta: 0.04, decayFactor: 1.0, backtestPnl: 0 } },
];

const INITIAL_FORECASTS: ForecastingModel[] = [
  { id: 'f-options', type: 'Options', buyingRatio: 0.42, patternMatch: 0.65, timeToRecognition: 14.2, orderFlowImbalance: -0.12, gammaExposure: 0.4, prediction: 'CALL', confidence: 0.7 },
  { id: 'f-futures', type: 'Futures', buyingRatio: 0.58, patternMatch: 0.78, timeToRecognition: 8.5, orderFlowImbalance: 0.45, gammaExposure: 0.1, prediction: 'LONG', confidence: 0.85 },
  { id: 'f-spot', type: 'Spot', buyingRatio: 0.72, patternMatch: 0.92, timeToRecognition: 3.1, orderFlowImbalance: 0.82, gammaExposure: -0.05, prediction: 'ACCUMULATE', confidence: 0.95 },
];

const MOCK_BEHAVIOR: BehaviorMetric[] = [
  { category: 'Loss Aversion Alpha', value: 21, correctionRequired: false, recommendation: 'Steady' },
  { category: 'Liquidity Grab Bias', value: 74, correctionRequired: true, recommendation: 'Recalibrate' },
  { category: 'HFT Signal Decay', value: 89, correctionRequired: true, recommendation: 'Re-sync' },
];

const QuantumTerminal: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const defaultLogs = [
      "> Initializing Qiskit environment...",
      "> Connecting to ibm_perth [43 qubits]...",
      "> Handshake verified. Entropy pool established.",
      "> Job [qs_8812_xt] queued at IBM Quantum Runtime."
    ];
    setLogs(defaultLogs);

    const interval = setInterval(() => {
      const msgs = [
        "> Transpiling market circuit for execution...",
        "> Executing VQE optimization loop...",
        "> Measuring state vector entropy...",
        "> Adjusting entanglement weights...",
        "> Results synchronized with local ACTI nodes."
      ];
      setLogs(prev => [...prev.slice(-15), msgs[Math.floor(Math.random() * msgs.length)]]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="bg-[#0d0d0d] p-6 rounded-xl border border-[#1a1a1a] shadow-xl font-mono flex flex-col h-full">
      <h3 className="text-[12px] font-black text-white uppercase tracking-widest mb-6">Quantum Runtime API</h3>
      <div className="space-y-4 flex flex-col flex-1">
        <div className="p-3 bg-black/40 border border-[#222] rounded-lg">
          <span className="text-[8px] text-purple-400 font-black uppercase block mb-2 tracking-widest">Active Qiskit Node</span>
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>Cluster Alpha-1</span>
            <span className="text-emerald-500">SYNCHRONIZED</span>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 bg-black border border-[#1a1a1a] rounded font-mono text-[9px] text-gray-600 p-4 overflow-y-auto custom-scrollbar">
          {logs.map((log, i) => <div key={i} className={log.startsWith('>') ? '' : 'text-blue-500'}>{log}</div>)}
        </div>
        <button 
          onClick={() => setLogs(prev => [...prev, "> Re-seeding entropy pool...", "> Node synchronized."])}
          className="w-full py-2 bg-purple-600/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase rounded hover:bg-purple-600 hover:text-white transition-all">
          Force Resync Node
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDeploied, setIsDeploied] = useState(false);
  const [activeView, setActiveView] = useState('Terminal');
  const [marketData, setMarketData] = useState<MarketDataPoint[]>([]);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [aiMarketInsight, setAiMarketInsight] = useState<string>('Syncing with Gemini reasoning engine...');
  const [selectedAgentForLogs, setSelectedAgentForLogs] = useState<Agent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  const lastFetchTimeRef = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 120000; 

  const [isSimMode, setIsSimMode] = useState(false);
  const [simScenario, setSimScenario] = useState<SimulationScenario | null>(null);
  const [simStep, setSimStep] = useState(0);
  const [simSpeed, setSimSpeed] = useState(1);
  
  const emotionalState = useMemo<EmotionalAssessment>(() => ({
    score: 92,
    status: 'Calm',
    lastEvaluated: 'now',
    guidance: 'Institutional stability confirmed. Delta neutrality optimized across all venues.'
  }), []);

  const [globalStats, setGlobalStats] = useState({ 
    entropy: 4280, 
    savings: 24.5,
    latency: 4 
  });

  const lastRegime = marketData.length > 0 ? marketData[marketData.length - 1].regime : null;

  useEffect(() => {
    if (!isDeploied || killSwitchActive || !lastRegime) return;
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    if (timeSinceLastFetch < MIN_FETCH_INTERVAL) return;

    const updateInsight = async () => {
      lastFetchTimeRef.current = Date.now();
      const lastPrice = marketData[marketData.length - 1]?.price || 64000;
      const insight = await geminiService.getMarketInsight(lastRegime, lastPrice);
      setAiMarketInsight(insight);
    };
    updateInsight();
  }, [lastRegime, isDeploied, killSwitchActive]);

  useEffect(() => {
    if (killSwitchActive || !currentUser || !isDeploied) return;
    const interval = setInterval(() => {
      setAgents(prevAgents => {
        const withDecay = prevAgents.map(a => {
          const driftPenalty = Math.max(0, (a.metrics.drift - 0.2) * 0.5);
          const targetDecay = Math.max(0.1, 1.0 - driftPenalty);
          const decayFactor = a.metrics.decayFactor * 0.95 + targetDecay * 0.05;
          return { ...a, metrics: { ...a.metrics, decayFactor } };
        });
        const scores = withDecay.map(a => {
          const cap = ROLE_CAPS[a.type as AgentRole] || 1.0;
          const weightedPriority = a.rawPriority * a.metrics.decayFactor;
          return { id: a.id, score: Math.min(weightedPriority, cap) };
        });
        const totalScore = scores.reduce((sum, s) => sum + s.score, 0) || 1;
        return withDecay.map(a => {
          const agentScore = scores.find(s => s.id === a.id)?.score || 0;
          return { ...a, normalizedWeight: agentScore / totalScore };
        });
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [killSwitchActive, currentUser, isDeploied]);

  useEffect(() => {
    if (killSwitchActive || !currentUser || !isDeploied) return;
    if (isSimMode && simScenario) {
      setMarketData(simScenario.data.slice(0, 40));
      setSimStep(39);
    } else {
      const initialPoints: MarketDataPoint[] = [];
      let price = 64000;
      for (let i = 0; i < 40; i++) {
        price += (Math.random() - 0.5) * 400;
        initialPoints.push({
          timestamp: `${i}:00`, price, volume: Math.random() * 5000,
          entropy: Math.random(), riskEnergy: Math.random() * 0.4,
          liquidityDensity: Math.random() * 100, gammaExposure: (Math.random() - 0.5) * 4,
          regime: MarketRegime.BULLISH
        });
      }
      setMarketData(initialPoints);
    }

    const intervalId = window.setInterval(() => {
      if (isSimMode && simScenario) {
        setSimStep(prev => {
          const next = prev + 1;
          if (next >= simScenario.data.length) return prev;
          setMarketData(prevData => [...prevData.slice(1), simScenario.data[next]]);
          setAgents(prevAgents => prevAgents.map(a => {
            const reaction = a.normalizedWeight * (Math.random() > 0.5 ? 1 : -1);
            const delta = (simScenario.data[next].price - simScenario.data[prev].price) * reaction;
            return { ...a, metrics: { ...a.metrics, backtestPnl: (a.metrics.backtestPnl || 0) + delta } };
          }));
          return next;
        });
      } else if (!isSimMode) {
        setMarketData(prev => {
          const last = prev[prev.length - 1];
          const nextPrice = last.price + (Math.random() - 0.5) * 300;
          return [...prev.slice(1), {
            ...last,
            timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            price: nextPrice,
            regime: nextPrice > last.price ? MarketRegime.BULLISH : MarketRegime.BEARISH
          }];
        });
        setGlobalStats(prev => ({
          ...prev,
          entropy: prev.entropy + Math.floor(Math.random() * 5),
          latency: Math.max(1, Math.min(20, prev.latency + (Math.random() > 0.5 ? 1 : -1)))
        }));
      }
    }, 2000 / (isSimMode ? simSpeed : 1));
    return () => clearInterval(intervalId);
  }, [killSwitchActive, isSimMode, simScenario, simSpeed, currentUser, isDeploied]);

  const handleTrainAgent = useCallback((id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { 
      ...a, status: AgentStatus.TRAINING,
      training: { sharpeGradient: 0.1, drawdownPenalty: 0.05, learningRate: 0.001, epoch: 1, convergence: 0.1 } 
    } : a));
    setTimeout(() => {
      setAgents(prev => prev.map(a => a.id === id ? { ...a, status: AgentStatus.EXECUTING } : a));
    }, 5000);
  }, []);

  const handleExecuteTrade = useCallback((id: string, side: 'BUY' | 'SELL') => {
    setAgents(prev => prev.map(a => a.id === id ? {
      ...a, logs: [{ timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: `${isSimMode ? 'SIM_' : 'LIVE_'}${side}_ORDER executed.` }, ...a.logs]
    } : a));
  }, [isSimMode]);

  const handleCreateAgent = useCallback((newAgentData: Partial<Agent>) => {
    const newAgent: Agent = {
      id: `a-${Date.now()}`,
      name: newAgentData.name || 'UNNAMED_NODE',
      type: newAgentData.type as AgentRole || 'Market',
      status: AgentStatus.IDLE,
      rawPriority: newAgentData.rawPriority || 0.5,
      normalizedWeight: 0,
      lastUpdate: 'now',
      logs: [],
      connectionSource: newAgentData.connectionSource || ConnectionSource.BINANCE,
      metrics: { entropy: 1.0, drift: 0.0, usage: 0, consensusDelta: 0, decayFactor: 1.0, backtestPnl: 0 }
    };
    setAgents(prev => [...prev, newAgent]);
  }, []);

  const handleAgentConnectionChange = useCallback((id: string, source: ConnectionSource) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, connectionSource: source } : a));
  }, []);

  if (!currentUser) return <AuthSystem onLogin={setCurrentUser} />;

  return (
    <div className={`flex h-screen text-gray-400 overflow-hidden font-mono transition-colors duration-500 ${isSimMode ? 'bg-[#0a0805]' : 'bg-[#050505]'}`}>
      {!isDeploied ? (
        <div className="fixed inset-0 bg-[#050505] flex items-center justify-center p-4 z-[300]">
          <PreFlightCheck onComplete={() => setIsDeploied(true)} />
        </div>
      ) : (
        <>
          <aside className={`w-[72px] border-r flex flex-col items-center py-6 gap-6 shrink-0 z-50 shadow-2xl transition-colors ${isSimMode ? 'bg-[#0d0a07] border-amber-900/30' : 'bg-[#0d0d0d] border-[#1a1a1a]'}`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-white shadow-lg mb-4 ${isSimMode ? 'bg-amber-600' : 'bg-blue-600'}`}>Q</div>
            {[
              { id: 'Terminal', icon: Icons.Terminal, label: 'Dashboard' },
              { id: 'Investor', icon: Icons.Investor, label: 'Consensus Matrix' },
              { id: 'Institutional', icon: Icons.Institutional, label: 'Fleet Management' },
              { id: 'Accountability', icon: Icons.Accountability, label: 'Audit Trail' },
              { id: 'Security', icon: Icons.Security, label: 'Security Hub' },
              { id: 'Developer', icon: Icons.Developer, label: 'Lab' },
              { id: 'Connect', icon: Icons.Globe, label: 'Connectivity' }
            ].map(nav => (
              <button 
                key={nav.id} 
                onClick={() => setActiveView(nav.id)} 
                title={nav.label}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${activeView === nav.id ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'}`}
              >
                {nav.icon ? React.createElement(nav.icon) : null}
              </button>
            ))}
            <div className="mt-auto flex flex-col items-center gap-6">
              <button onClick={() => { setCurrentUser(null); setIsDeploied(false); }} className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-700 hover:text-red-500 transition-colors" title="Disconnect Node">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
              <button onClick={() => setKillSwitchActive(!killSwitchActive)} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all border ${killSwitchActive ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-red-950/20 border-red-900/30 text-red-600 hover:bg-red-900/40'}`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z"/></svg>
              </button>
            </div>
          </aside>

          <div className="flex-1 flex flex-col relative overflow-hidden">
            <TerminalTicker />
            <header className={`h-12 border-b flex items-center justify-between px-6 shrink-0 z-10 ${isSimMode ? 'bg-[#0d0a07] border-amber-900/30' : 'bg-[#0d0d0d] border-[#1a1a1a]'}`}>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 border-r pr-6 border-[#222]">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${isSimMode ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${isSimMode ? 'text-amber-500' : 'text-white'}`}>QuantOS / {isSimMode ? 'REPLAY' : 'LIVE'}</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-[11px] font-mono text-emerald-500">{isSimMode ? `${Math.round((simStep / (simScenario?.data.length || 1)) * 100)}% Complete` : `${globalStats.latency}ms Latency`}</span>
                    <span className="text-[10px] text-gray-600 uppercase font-black">Cluster Health: 99.8%</span>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-white font-black uppercase tracking-widest">{currentUser.username}</span>
                  <span className="text-[8px] text-blue-500 font-bold uppercase tracking-widest">{currentUser.tier} CLUSTER</span>
                </div>
                <div className={`px-4 py-1 rounded border transition-all ${isSimMode ? 'bg-amber-600/5 border-amber-500/20 text-amber-400' : 'bg-[#111] border-[#222] text-emerald-500'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest">{isSimMode ? 'Sim Yield' : 'Optimization'}: {isSimMode ? `+$${(agents.reduce((s,a)=>s+(a.metrics.backtestPnl||0),0)/1000).toFixed(2)}K` : `$${globalStats.savings}B`}</span>
                </div>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
               <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
                      {String(activeView)} <span className="text-gray-700">/</span> {isSimMode ? 'AUDIT' : 'CORE'}
                    </h1>
                    <div className="flex gap-2">
                       <button className="px-3 py-1 bg-[#111] border border-[#222] text-[9px] text-gray-500 font-black uppercase rounded hover:text-white transition-all">Export Data</button>
                       <button className="px-3 py-1 bg-blue-600/10 border border-blue-500/30 text-[9px] text-blue-500 font-black uppercase rounded hover:bg-blue-600 hover:text-white transition-all">Node Health</button>
                    </div>
                  </div>
                  
                  {activeView === 'Connect' ? (
                    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <IntegrationManager />
                    </div>
                  ) : activeView === 'Accountability' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
                      <ModelAccountability agents={agents} />
                    </div>
                  ) : activeView === 'Security' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
                      <SecurityDashboard onEmergencyKill={() => setKillSwitchActive(!killSwitchActive)} isKillSwitchActive={killSwitchActive} />
                    </div>
                  ) : activeView === 'Developer' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
                       <MathematicalFoundations />
                       <QuantumTerminal />
                    </div>
                  ) : activeView === 'Investor' ? (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                           <MarketRegimeChart data={marketData} />
                        </div>
                        <div className="lg:col-span-1">
                           <ForecastingPanel forecasts={INITIAL_FORECASTS} />
                        </div>
                      </div>
                      <div className="p-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl font-mono shadow-xl relative overflow-hidden">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-4">Collective Consensus Stream</h4>
                        <div className="space-y-2">
                          {agents.map(a => (
                            <div key={a.id} className="flex items-center justify-between p-2 border-b border-[#1a1a1a]">
                              <span className="text-[10px] text-gray-500 font-bold uppercase">{a.name}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono text-emerald-500">CONFORMITY: 94.2%</span>
                                <span className="text-[10px] font-mono text-blue-400">WEIGHT: {(a.normalizedWeight * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : activeView === 'Institutional' ? (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <GlobalExchangeGateway />
                        <SecurityDashboard onEmergencyKill={() => setKillSwitchActive(!killSwitchActive)} isKillSwitchActive={killSwitchActive} />
                      </div>
                      <div className="p-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl font-mono shadow-xl">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-4">Network Latency Matrix</h4>
                        <div className="h-40 bg-black/40 rounded flex items-center justify-center italic text-gray-600">
                           Institutional node topology rendering...
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-500 space-y-6">
                      <MarketRegimeChart data={marketData} />
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <BehavioralCorrection metrics={MOCK_BEHAVIOR} emotionalState={emotionalState} />
                        <SimulationController isActive={isSimMode} onToggle={(v) => setIsSimMode(v)} onSelectScenario={setSimScenario} playbackSpeed={simSpeed} setPlaybackSpeed={setSimSpeed} />
                      </div>
                      <div className="p-6 bg-[#0d0d0d] border border-blue-500/20 rounded-xl font-mono shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                        <div className="flex items-center gap-3 mb-4">
                          <Icons.Brain />
                          <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Institutional AI Intelligence (Gemini-3-Pro)</h4>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[8px] text-blue-500 font-bold uppercase tracking-widest">Real-time Reasoning Loop</span>
                           {aiMarketInsight === 'Syncing with Gemini reasoning engine...' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>}
                        </div>
                        <p className="text-[12px] text-gray-400 leading-relaxed italic border-l border-[#222] pl-4">
                          {aiMarketInsight}
                        </p>
                      </div>
                      <div className="p-4 bg-black/40 border border-[#1a1a1a] rounded-xl font-mono text-[11px] h-32 overflow-y-auto custom-scrollbar">
                        <div className="text-gray-500">[{new Date().toLocaleTimeString()}] System node cluster synchronized. Waiting for next stochastic tick...</div>
                        <div className="text-blue-500/60 mt-1">[{new Date().toLocaleTimeString()}] Authorized session: {currentUser.sessionToken}</div>
                      </div>
                    </div>
                  )}
               </div>

               <div className={`w-[400px] border-l overflow-y-auto custom-scrollbar p-6 space-y-8 shrink-0 transition-colors ${isSimMode ? 'bg-[#0d0a07] border-amber-900/30' : 'bg-[#050505] border-[#1a1a1a]'}`}>
                  {activeView !== 'Institutional' && activeView !== 'Connect' && <GlobalExchangeGateway />}
                  {activeView !== 'Investor' && <ForecastingPanel forecasts={INITIAL_FORECASTS} />}
                  <AgentStatusPanel agents={agents} onTrainAgent={handleTrainAgent} onViewLogs={setSelectedAgentForLogs} onAddAgent={() => setIsCreateModalOpen(true)} onAgentConnectionChange={handleAgentConnectionChange} onExecuteTrade={handleExecuteTrade} />
               </div>
            </div>
          </div>
        </>
      )}

      <LogModal agent={selectedAgentForLogs} onClose={() => setSelectedAgentForLogs(null)} />
      <CreateAgentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateAgent} />
    </div>
  );
};

export default App;
