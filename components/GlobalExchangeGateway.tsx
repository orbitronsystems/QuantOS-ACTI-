import React, { useState, useEffect } from 'react';
import { ExchangeStatus, ConnectionSource } from '../types';

const INITIAL_EXCHANGES: ExchangeStatus[] = [
  { id: 'binance', name: 'BINANCE GLOBAL', latency: 8, status: 'CONNECTED', volume24h: '$64.2B', type: ConnectionSource.BINANCE },
  { id: 'bybit', name: 'BYBIT PRO', latency: 12, status: 'CONNECTED', volume24h: '$12.8B', type: ConnectionSource.BYBIT },
  { id: 'coinbase', name: 'COINBASE INST', latency: 15, status: 'CONNECTED', volume24h: '$4.1B', type: ConnectionSource.MT5 },
];

const INITIAL_PROVIDERS: ExchangeStatus[] = [
  { id: 'refinitiv', name: 'REFINITIV REAL-TIME', latency: 4, status: 'CONNECTED', volume24h: 'N/A', type: ConnectionSource.LSEG },
  { id: 'ice', name: 'ICE DATA SERVICES', latency: 6, status: 'CONNECTED', volume24h: 'N/A', type: ConnectionSource.FIX },
  { id: 'bloomberg', name: 'BLOOMBERG B-PIPE', latency: 2, status: 'CONNECTED', volume24h: 'N/A', type: ConnectionSource.BLOOMBERG },
];

const AVAILABLE_SOURCES = [
  { name: 'Nasdaq TotalView', type: ConnectionSource.FIX, vendor: 'Nasdaq' },
  { id: 'kraken', name: 'KRAKEN PRO', type: ConnectionSource.KRAKEN, vendor: 'Exchange' },
  { id: 'bitstamp', name: 'BITSTAMP INST', type: ConnectionSource.BITSTAMP, vendor: 'Exchange' },
];

const ConnectionCard: React.FC<{ item: ExchangeStatus; onOpenConfig: (id: string) => void }> = ({ item, onOpenConfig }) => (
  <div className="group flex items-center justify-between p-3 bg-[#0d0d0d] border border-[#1a1a1a] hover:border-blue-500/40 rounded transition-all duration-200">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${
        item.status === 'CONNECTED' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
        item.status === 'CONNECTING' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'
      }`}></div>
      <div>
        <span className="text-[10px] font-black text-gray-200 block leading-none tracking-wider">{item.name}</span>
        <span className="text-[8px] text-gray-600 uppercase font-black tracking-tighter mt-1 block">
          {item.status === 'CONNECTED' ? (item.volume24h !== 'N/A' ? `${item.volume24h} VOL` : 'ACTIVE STREAM') : 'HANDSHAKING...'}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-[9px] font-mono text-gray-500">{item.status === 'CONNECTED' ? `${item.latency}ms` : '--'}</span>
      <button 
        onClick={() => onOpenConfig(item.id)}
        className="p-1.5 rounded bg-[#1a1a1a] border border-[#262626] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600/10"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth={2}/></svg>
      </button>
    </div>
  </div>
);

export const GlobalExchangeGateway: React.FC = () => {
  const [gateways, setGateways] = useState<ExchangeStatus[]>(INITIAL_EXCHANGES);
  const [providers, setProviders] = useState<ExchangeStatus[]>(INITIAL_PROVIDERS);
  const [showAddSource, setShowAddSource] = useState(false);
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);
  const [showDocs, setShowDocs] = useState(false);
  const [showKeyManager, setShowKeyManager] = useState(false);
  const [showFixAudit, setShowFixAudit] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const shift = (list: ExchangeStatus[]) => list.map(item => ({
        ...item,
        latency: Math.max(1, item.latency + (Math.random() > 0.5 ? 1 : -1))
      }));
      setGateways(prev => shift(prev));
      setProviders(prev => shift(prev));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAddSource = (source: typeof AVAILABLE_SOURCES[0]) => {
    const isProvider = source.vendor !== 'Exchange';
    const newEntry: ExchangeStatus = {
      id: `gw-${Date.now()}`,
      name: source.name.toUpperCase(),
      latency: Math.floor(Math.random() * 10) + 2,
      status: 'CONNECTING',
      volume24h: isProvider ? 'N/A' : '$0.0B',
      type: source.type
    };

    if (isProvider) {
      setProviders(prev => [...prev, newEntry]);
    } else {
      setGateways(prev => [...prev, newEntry]);
    }

    setTimeout(() => {
      const updater = (list: ExchangeStatus[]) => list.map(g => g.id === newEntry.id ? { ...g, status: 'CONNECTED' as const } : g);
      if (isProvider) setProviders(updater); else setGateways(updater);
    }, 1500);
    
    setShowAddSource(false);
  };

  return (
    <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-5 flex flex-col h-full shadow-2xl relative overflow-hidden font-mono min-h-[500px]">
      {showDocs && (
        <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-lg p-6 flex flex-col animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6 border-b border-[#222] pb-4">
            <div>
              <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Resilience Protocol v4.2</h4>
              <p className="text-[8px] text-gray-600 uppercase font-black mt-1">Failover & Desync Management</p>
            </div>
            <button onClick={() => setShowDocs(false)} className="text-gray-500 hover:text-white text-xl hover:rotate-90 transition-transform">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2 text-[10px] text-gray-400 uppercase tracking-tight">
            <section>
              <h5 className="text-[9px] font-black text-emerald-500 uppercase mb-2 tracking-wider flex items-center gap-2">
                <div className="w-1 h-3 bg-emerald-500"></div> Failover Logic
              </h5>
              <p className="leading-relaxed">
                Heartbeat monitoring across cross-region nodes. Failure detection initiates hot-swapping to secondary endpoints within <span className="text-white">5ms</span>. Primary circuit re-establishment requires <span className="text-white">10 consecutive successful handshakes</span>.
              </p>
            </section>
            <section>
              <h5 className="text-[9px] font-black text-blue-400 uppercase mb-2 tracking-wider flex items-center gap-2">
                <div className="w-1 h-3 bg-blue-400"></div> Venue Routing (SOR)
              </h5>
              <p className="leading-relaxed">
                Smart Order Routing automatically prioritizes <span className="text-white">Primary Venues</span> (Binance/Bybit Direct) unless latency exceeds 20ms or order flow imbalance triggers <span className="text-white">Secondary Routing</span> to Institutional FIX gateways.
              </p>
            </section>
          </div>
          <button onClick={() => setShowDocs(false)} className="w-full mt-6 py-2.5 bg-[#1a1a1a] border border-[#262626] text-gray-400 text-[10px] font-black uppercase rounded hover:text-white transition-all tracking-widest">
            Acknowledge Protocols
          </button>
        </div>
      )}

      {showKeyManager && (
        <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-lg p-6 flex flex-col animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6 border-b border-[#222] pb-4">
            <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Secure Key Manager</h4>
            <button onClick={() => setShowKeyManager(false)} className="text-gray-500 hover:text-white text-xl hover:rotate-90 transition-transform">&times;</button>
          </div>
          <div className="flex-1 space-y-4">
            <div className="p-3 bg-black/40 border border-[#222] rounded">
              <span className="text-[8px] text-gray-600 uppercase font-black block mb-2">Primary API Key</span>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-emerald-500 font-mono">QS_PRO_********772</span>
                <span className="text-[8px] text-emerald-500 font-black uppercase">ACTIVE</span>
              </div>
            </div>
            <div className="p-3 bg-black/40 border border-[#222] rounded">
              <span className="text-[8px] text-gray-600 uppercase font-black block mb-2">Encryption Entropy</span>
              <div className="w-full bg-black h-1 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[94%]" />
              </div>
            </div>
          </div>
          <button onClick={() => setShowKeyManager(false)} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase rounded transition-all">Close</button>
        </div>
      )}

      {showFixAudit && (
        <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-lg p-6 flex flex-col animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6 border-b border-[#222] pb-4">
            <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">FIX Audit Trail</h4>
            <button onClick={() => setShowFixAudit(false)} className="text-gray-500 hover:text-white text-xl hover:rotate-90 transition-transform">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-[9px] text-gray-500 space-y-2 custom-scrollbar pr-2">
            <div>[14:42:01] 8=FIX.4.4|35=A|49=QUANTOS|56=BINANCE</div>
            <div>[14:42:01] 8=FIX.4.4|35=5|49=BINANCE|56=QUANTOS</div>
            <div className="text-emerald-500">[14:42:02] Logged in: Handshake established.</div>
            <div>[14:45:12] 8=FIX.4.4|35=0|49=QUANTOS|56=BINANCE|112=HB</div>
            <div>[14:45:12] 8=FIX.4.4|35=0|49=BINANCE|56=QUANTOS|112=HB</div>
          </div>
          <button onClick={() => setShowFixAudit(false)} className="w-full mt-4 py-2.5 bg-[#1a1a1a] border border-[#262626] text-gray-400 text-[10px] font-black uppercase rounded transition-all tracking-widest">Exit Trail</button>
        </div>
      )}

      {activeConfigId && (
        <div className="absolute inset-0 z-30 bg-black/95 backdrop-blur-md p-6 flex flex-col animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-6 border-b border-[#222] pb-4">
            <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Protocol Configuration</h4>
            <button onClick={() => setActiveConfigId(null)} className="text-gray-500 hover:text-white text-xl hover:rotate-90 transition-transform">&times;</button>
          </div>
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-[8px] text-gray-600 uppercase font-black block mb-2">FIX SenderCompID / API Key</label>
              <input type="password" value="QUANTOS_NODE_772" readOnly className="w-full bg-[#111] border border-[#222] rounded px-3 py-2 text-[10px] text-emerald-400 font-mono" />
            </div>
            <div>
              <label className="text-[8px] text-gray-600 uppercase font-black block mb-2">Transport Layer</label>
              <select className="w-full bg-[#111] border border-[#222] rounded px-3 py-2 text-[10px] text-gray-400 focus:outline-none focus:border-blue-500">
                <option>FIX 4.4 / SBE</option>
                <option>WebSocket / ProtoBuf</option>
                <option>REST / JSON-RPC</option>
              </select>
            </div>
          </div>
          <button onClick={() => setActiveConfigId(null)} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase rounded shadow-lg shadow-blue-900/40 transition-all">Apply Security Headers</button>
        </div>
      )}

      {showAddSource && (
        <div className="absolute inset-x-0 top-16 z-50 bg-[#0d0d0d] border border-[#262626] m-4 p-4 rounded shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <h4 className="text-[9px] text-gray-500 uppercase font-black mb-4 tracking-widest border-b border-[#1a1a1a] pb-2">Select Pipeline Source</h4>
          <div className="space-y-2">
            {AVAILABLE_SOURCES.map((s, i) => (
              <button 
                key={i}
                onClick={() => handleAddSource(s)}
                className="w-full flex justify-between items-center p-2.5 bg-black border border-[#222] hover:border-blue-500/50 rounded transition-all"
              >
                <div className="text-left">
                  <span className="text-[10px] font-black text-gray-300 block">{s.name}</span>
                  <span className="text-[8px] text-gray-600 uppercase">{s.vendor} Protocol</span>
                </div>
                <span className="text-[9px] text-blue-500 font-black">LINK</span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowAddSource(false)} className="w-full mt-4 py-1.5 text-[9px] text-gray-600 font-black uppercase border border-[#222] hover:bg-gray-900">Cancel</button>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h3 className="text-[12px] font-black text-white uppercase tracking-[0.25em]">Institutional Hub</h3>
          <p className="text-[9px] text-gray-600 uppercase font-bold mt-1 tracking-widest">Multi-Venue Connectivity Layer</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowDocs(!showDocs)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all shadow-lg ${showDocs ? 'bg-blue-600 text-white border-blue-400' : 'bg-[#1a1a1a] border-[#262626] text-gray-600 hover:text-blue-400 hover:border-blue-500/30'}`}
            title="Protocol Documentation"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </button>
          <button 
            onClick={() => setShowAddSource(!showAddSource)}
            className="w-9 h-9 flex items-center justify-center bg-blue-600/10 border border-blue-500/30 text-blue-500 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-lg"
            title="Add New Connection Source"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-1 custom-scrollbar">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Exchange Gateways</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#222] to-transparent" />
          </div>
          <div className="space-y-2.5">
            {gateways.map(g => <ConnectionCard key={g.id} item={g} onOpenConfig={setActiveConfigId} />)}
          </div>
        </section>
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Data Providers</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#222] to-transparent" />
          </div>
          <div className="space-y-2.5">
            {providers.map(p => <ConnectionCard key={p.id} item={p} onOpenConfig={setActiveConfigId} />)}
          </div>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-[#1a1a1a] flex flex-col gap-3 shrink-0">
        <div className="flex justify-between items-center px-1">
          <span className="text-[9px] text-gray-700 font-black uppercase tracking-widest">Cluster Topology</span>
          <span className="text-[9px] text-emerald-500 font-black uppercase animate-pulse">Mesh Synchronized</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setShowFixAudit(true)}
            className="py-2 bg-[#0d0d0d] border border-[#1a1a1a] text-gray-600 text-[9px] font-black uppercase rounded hover:border-blue-500/50 hover:text-blue-400 transition-all tracking-widest active:scale-95">
            Fix Audit
          </button>
          <button 
            onClick={() => setShowKeyManager(true)}
            className="py-2 bg-[#0d0d0d] border border-[#1a1a1a] text-gray-600 text-[9px] font-black uppercase rounded hover:border-blue-500/50 hover:text-blue-400 transition-all tracking-widest active:scale-95">
            Key Manager
          </button>
        </div>
      </div>
    </div>
  );
};