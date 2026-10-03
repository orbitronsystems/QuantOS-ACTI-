
import React, { useState, useEffect } from 'react';
import { License, LicenseHeartbeat, SecurityAudit, EABinding } from '../types';

const MOCK_LICENSE: License = {
  id: 'LIC-QOS-8821-X',
  type: 'QUANTUM_NODE',
  status: 'VALID',
  issuedTo: 'Institutional-Node-77',
  sha256Binding: 'f12c82e6...a92b0c11',
  expiry: '2026-12-31'
};

const MOCK_BINDING: EABinding = {
  entityId: 'NODE-77-EXEC',
  bindingType: 'SHA256',
  status: 'SECURE',
  lastHandshake: '14:20:42'
};

const INITIAL_AUDITS: SecurityAudit[] = [
  { id: 'aud-1', timestamp: '14:15:22', event: 'SHA-256 RE-BINDING SUCCESS', actor: 'SYSTEM_KERNEL', hash: 'e3b0c442...', severity: 'LOW' },
  { id: 'aud-2', timestamp: '14:18:05', event: 'EXTERNAL PROBE BLOCKED', actor: 'NODE_SHIELD', hash: '92a8b311...', severity: 'HIGH' },
  { id: 'aud-3', timestamp: '14:20:42', event: 'LICENSE_HEARTBEAT_ACK', actor: 'AUTH_SERVER', hash: 'f12c82e6...', severity: 'LOW' }
];

export const SecurityDashboard: React.FC<{ onEmergencyKill: () => void, isKillSwitchActive: boolean }> = ({ onEmergencyKill, isKillSwitchActive }) => {
  const [heartbeat, setHeartbeat] = useState<LicenseHeartbeat>({
    timestamp: '14:20:42',
    latency: 12,
    integrityScore: 99.8,
    nodeStatus: 'STABLE'
  });
  const [audits, setAudits] = useState<SecurityAudit[]>(INITIAL_AUDITS);

  useEffect(() => {
    if (isKillSwitchActive) return;
    const interval = setInterval(() => {
      setHeartbeat(prev => ({
        ...prev,
        timestamp: new Date().toLocaleTimeString(),
        latency: Math.max(8, Math.min(40, prev.latency + (Math.random() - 0.5) * 4)),
        integrityScore: Math.max(98, Math.min(100, prev.integrityScore + (Math.random() - 0.5) * 0.1))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [isKillSwitchActive]);

  return (
    <div className="flex flex-col h-full space-y-6 font-mono animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Component 1: License Entity */}
        <div className="bg-[#0d0d0d] rounded-xl border border-[#1a1a1a] p-5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
             <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.47 4.34-2.85 7.91-7 9.3V12H5V6.3l7-3.11v8.8z"/></svg>
          </div>
          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">License Entity</h4>
          <div className="space-y-3">
             <div>
                <span className="text-[8px] text-gray-600 uppercase font-black block mb-1">ID / TYPE</span>
                <span className="text-[11px] text-white font-bold">{MOCK_LICENSE.id}</span>
                <span className="ml-2 text-[8px] bg-blue-600/10 text-blue-400 px-1.5 py-0.5 rounded font-black border border-blue-500/20">{MOCK_LICENSE.type}</span>
             </div>
             <div>
                <span className="text-[8px] text-gray-600 uppercase font-black block mb-1">SHA-256 Cryptographic Binding</span>
                <span className="text-[10px] text-emerald-500 font-mono break-all leading-none">{MOCK_LICENSE.sha256Binding}</span>
             </div>
             <div className="flex justify-between items-end">
                <div>
                   <span className="text-[8px] text-gray-600 uppercase font-black block mb-1">Status</span>
                   <span className="text-[10px] text-emerald-400 font-black uppercase">VALID_NODE_AUTHORIZED</span>
                </div>
                <span className="text-[8px] text-gray-500 font-bold uppercase">EXP: {MOCK_LICENSE.expiry}</span>
             </div>
          </div>
        </div>

        {/* Component 2: Heartbeat Monitoring */}
        <div className="bg-[#0d0d0d] rounded-xl border border-[#1a1a1a] p-5 shadow-2xl">
          <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">License Heartbeat</h4>
          <div className="flex items-center gap-6 mb-6">
             <div className="relative">
                <svg className="w-16 h-16 transform -rotate-90">
                   <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[#111]" />
                   <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={175.9} strokeDashoffset={175.9 * (1 - heartbeat.integrityScore / 100)} className="text-emerald-500 transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-[11px] font-black text-white">{heartbeat.integrityScore.toFixed(1)}%</span>
                </div>
             </div>
             <div>
                <span className="text-[8px] text-gray-600 uppercase font-black block mb-1">Link Latency</span>
                <span className="text-xl font-black text-white">{heartbeat.latency.toFixed(0)}<span className="text-xs ml-1 text-gray-600">ms</span></span>
             </div>
          </div>
          <div className="p-2.5 bg-black/40 border border-[#222] rounded flex justify-between items-center">
             <span className="text-[9px] text-gray-500 font-black uppercase">Last Handshake</span>
             <span className="text-[10px] text-emerald-500 font-mono">{heartbeat.timestamp}</span>
          </div>
        </div>

        {/* Component 3: EA Binding Pillar */}
        <div className="bg-[#0d0d0d] rounded-xl border border-[#1a1a1a] p-5 shadow-2xl">
          <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-4">EA Binding Module</h4>
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isKillSwitchActive ? 'bg-red-500' : 'bg-purple-500'} shadow-[0_0_10px_rgba(168,85,247,0.4)]`}></div>
                <div>
                   <span className="text-[10px] text-white font-black uppercase tracking-wider">{MOCK_BINDING.entityId}</span>
                   <span className="text-[8px] text-gray-600 uppercase font-black block">Active Secure Tunnel</span>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/50 p-2 rounded border border-[#222]">
                   <span className="text-[7px] text-gray-700 uppercase font-black block mb-1">Cipher</span>
                   <span className="text-[10px] text-gray-400 font-mono">SHA-256</span>
                </div>
                <div className="bg-black/50 p-2 rounded border border-[#222]">
                   <span className="text-[7px] text-gray-700 uppercase font-black block mb-1">Integrity</span>
                   <span className="text-[10px] text-emerald-500 font-mono">OK</span>
                </div>
             </div>
             <button className="w-full py-2 bg-purple-600/10 border border-purple-500/20 text-purple-500 text-[9px] font-black uppercase rounded hover:bg-purple-600 hover:text-white transition-all">Rotate Cryptographic Key</button>
          </div>
        </div>

        {/* Component 4: Emergency Management */}
        <div className={`rounded-xl border p-5 shadow-2xl flex flex-col justify-between transition-all ${isKillSwitchActive ? 'bg-red-600/10 border-red-500/50' : 'bg-[#0d0d0d] border-[#1a1a1a]'}`}>
          <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">Emergency Ops</h4>
          <div className="space-y-2 mb-4">
             <div className="flex justify-between items-center text-[9px] font-black uppercase">
                <span className="text-gray-600">Protocol State</span>
                <span className={isKillSwitchActive ? 'text-red-500' : 'text-emerald-500'}>{isKillSwitchActive ? 'HALTED' : 'STANDBY'}</span>
             </div>
             <div className="flex justify-between items-center text-[9px] font-black uppercase">
                <span className="text-gray-600">Air-Gap Shield</span>
                <span className="text-gray-400">ENGAGED</span>
             </div>
          </div>
          <button 
            onClick={onEmergencyKill}
            className={`w-full py-3 rounded text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${isKillSwitchActive ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
          >
            {isKillSwitchActive ? 'Resume Operations' : 'Emergency Kill-Switch'}
          </button>
        </div>
      </div>

      {/* Security Audit Trail Component */}
      <div className="bg-[#0d0d0d] rounded-xl border border-[#1a1a1a] flex flex-col overflow-hidden shadow-2xl flex-1">
          <div className="p-4 border-b border-[#222] bg-[#111] flex justify-between items-center">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Security Audit Trail (EABinding)</h3>
            <span className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Last 100 Transactions Verified</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-[#050505] border-b border-[#1a1a1a]">
                      <th className="p-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">Timestamp</th>
                      <th className="p-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">Event Identification</th>
                      <th className="p-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">Actor / Entity</th>
                      <th className="p-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">SHA-256 Checksum</th>
                      <th className="p-4 text-[9px] font-black text-gray-600 uppercase tracking-widest text-right">Severity</th>
                   </tr>
                </thead>
                <tbody className="font-mono text-[10px]">
                   {audits.map((audit) => (
                      <tr key={audit.id} className="border-b border-[#1a1a1a] hover:bg-white/[0.02] transition-colors">
                         <td className="p-4 text-gray-500">{audit.timestamp}</td>
                         <td className="p-4 text-gray-200 font-bold uppercase tracking-tight">{audit.event}</td>
                         <td className="p-4 text-gray-400">{audit.actor}</td>
                         <td className="p-4 text-blue-500/60 truncate max-w-[150px]">{audit.hash}</td>
                         <td className="p-4 text-right">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                               audit.severity === 'CRITICAL' || audit.severity === 'HIGH' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>{audit.severity}</span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
      </div>
    </div>
  );
};
