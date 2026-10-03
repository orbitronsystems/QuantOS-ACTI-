
import React, { useState } from 'react';
import { ConsumerIntegration, IntegrationType } from '../types';

export const IntegrationManager: React.FC = () => {
  const [integrations, setIntegrations] = useState<ConsumerIntegration[]>([
    { id: 'int-1', name: 'Legacy MT4 Bridge', type: IntegrationType.WEBHOOK, status: 'ACTIVE', endpointUrl: 'https://bridge.quantos.ai/hook/772' },
    { id: 'int-2', name: 'Custom Python Alpha', type: IntegrationType.REST_API, status: 'ACTIVE', apiKey: 'qs_pk_test_48291048' },
    { id: 'int-qiskit', name: 'Qiskit Quantum Core', type: IntegrationType.QUANTUM_CIRCUIT, status: 'ACTIVE', endpointUrl: 'qiskit://node-cluster-omega-1' }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<IntegrationType>(IntegrationType.REST_API);

  const addIntegration = () => {
    if (!newName) return;
    const newInt: ConsumerIntegration = {
      id: 'int-' + Date.now(),
      name: newName,
      type: newType,
      status: 'PENDING',
      apiKey: newType === IntegrationType.REST_API ? 'qs_pk_live_' + Math.random().toString(36).substr(2, 12) : undefined,
      endpointUrl: newType === IntegrationType.WEBHOOK ? 'https://hook.quantos.ai/inbound/' + Math.random().toString(36).substr(2, 8) : 
                   newType === IntegrationType.QUANTUM_CIRCUIT ? 'qiskit://ibmq-' + Math.random().toString(36).substr(2, 6) : undefined,
    };
    setIntegrations([...integrations, newInt]);
    setNewName('');
    setIsAdding(false);
  };

  return (
    <div className="bg-[#0d0d0d] p-6 rounded-xl border border-[#1a1a1a] flex flex-col h-full font-mono shadow-2xl">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h3 className="text-[12px] font-black text-white uppercase tracking-[0.25em]">Consumer Integrations</h3>
          <p className="text-[9px] text-gray-600 uppercase font-bold mt-1 tracking-widest">Connect external proprietary platforms</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-500 text-[9px] font-black uppercase rounded hover:bg-blue-600 hover:text-white transition-all tracking-widest"
        >
          New Connector
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {integrations.map((int) => (
          <div key={int.id} className="p-4 bg-black/40 border border-[#1a1a1a] rounded-xl group hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-[11px] font-black text-white uppercase tracking-wider mb-1">
                  {int.name}
                  {int.type === IntegrationType.QUANTUM_CIRCUIT && (
                    <span className="ml-2 text-[8px] bg-purple-600/10 text-purple-400 px-1.5 py-0.5 rounded font-black border border-purple-500/20">QISKIT_READY</span>
                  )}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] bg-[#111] px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase tracking-widest">{int.type}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${int.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-yellow-500'} animate-pulse`}></div>
                </div>
              </div>
              <button className="text-[8px] text-red-500/40 hover:text-red-500 uppercase font-black tracking-widest">Revoke</button>
            </div>

            <div className="space-y-2">
              {int.apiKey && (
                <div>
                  <label className="text-[8px] text-gray-700 uppercase font-black block mb-1">API ACCESS KEY</label>
                  <div className="flex gap-2">
                    <input type="password" value={int.apiKey} readOnly className="flex-1 bg-[#050505] border border-[#222] rounded px-3 py-1.5 text-[10px] text-emerald-400 font-mono" />
                    <button className="px-2 py-1 bg-[#1a1a1a] border border-[#262626] text-[8px] text-gray-500 rounded uppercase font-bold">Copy</button>
                  </div>
                </div>
              )}
              {int.endpointUrl && (
                <div>
                  <label className="text-[8px] text-gray-700 uppercase font-black block mb-1">{int.type === IntegrationType.QUANTUM_CIRCUIT ? 'CIRCUIT ENDPOINT' : 'WEBHOOK ENDPOINT'}</label>
                  <div className="flex gap-2">
                    <input type="text" value={int.endpointUrl} readOnly className={`flex-1 bg-[#050505] border border-[#222] rounded px-3 py-1.5 text-[10px] font-mono ${int.type === IntegrationType.QUANTUM_CIRCUIT ? 'text-purple-400' : 'text-blue-400'}`} />
                    <button className="px-2 py-1 bg-[#1a1a1a] border border-[#262626] text-[8px] text-gray-500 rounded uppercase font-bold">Copy</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isAdding && (
          <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-xl animate-in slide-in-from-top-2">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">New Integration Schema</h4>
            <div className="space-y-4">
              <div>
                <label className="text-[8px] text-gray-600 uppercase font-black block mb-1">PLATFORM NAME</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. QISKIT_ALGO_BETA"
                  className="w-full bg-black border border-[#262626] rounded px-3 py-2 text-[10px] text-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[8px] text-gray-600 uppercase font-black block mb-1">TRANSPORT PROTOCOL</label>
                <select 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as IntegrationType)}
                  className="w-full bg-black border border-[#262626] rounded px-3 py-2 text-[10px] text-gray-300 focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value={IntegrationType.REST_API}>REST API (Pull)</option>
                  <option value={IntegrationType.WEBHOOK}>WEBHOOK (Push)</option>
                  <option value={IntegrationType.QUANTUM_CIRCUIT}>QISKIT QUANTUM RUNTIME</option>
                  <option value={IntegrationType.WEBSOCKET}>WEBSOCKET (Stream)</option>
                  <option value={IntegrationType.GRPC}>GRPC (High Speed)</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-1.5 bg-[#1a1a1a] text-gray-500 text-[9px] font-black uppercase rounded">Abort</button>
                <button onClick={addIntegration} className="flex-1 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded shadow-lg shadow-blue-900/40">Initialize</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-[#1a1a1a]">
        <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg">
          <span className="text-[8px] text-purple-500 font-black uppercase tracking-widest block mb-1">Qiskit Auto-Link</span>
          <p className="text-[9px] text-gray-600 uppercase font-bold leading-relaxed">
            Qiskit developers can automatically synchronize quantum kernels. Licensing is handled via SHA-256 cryptographic handshakes with IBMQ backends.
          </p>
        </div>
      </div>
    </div>
  );
};
