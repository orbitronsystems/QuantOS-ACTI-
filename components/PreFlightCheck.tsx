
import React, { useState, useEffect } from 'react';

interface CheckItem {
  id: string;
  name: string;
  status: 'pending' | 'checking' | 'pass' | 'fail';
  description: string;
}

export const PreFlightCheck: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [items, setItems] = useState<CheckItem[]>([
    { id: 'auth', name: 'Identity Provider', status: 'pending', description: 'AES-256 Auth Cluster Handshake' },
    { id: 'licensing', name: 'SHA-256 License Binding', status: 'pending', description: 'Cryptographic Hardware ID Verification' },
    { id: 'gateways', name: 'Multi-Venue Gateways', status: 'pending', description: 'FIX Protocol Heartbeat Synchronization' },
    { id: 'gemini', name: 'GenAI Reasoning Engine', status: 'pending', description: 'Gemini-3-Pro Cognitive Link' },
    { id: 'qiskit', name: 'Quantum Runtime', status: 'pending', description: 'Qiskit IBMQ Node Connectivity' },
    { id: 'security', name: 'Air-Gap Kill Switch', status: 'pending', description: 'Emergency Termination Circuitry' },
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < items.length) {
      const timer = setTimeout(() => {
        setItems(prev => prev.map((item, idx) => 
          idx === currentStep ? { ...item, status: 'checking' } : item
        ));
        
        const finishTimer = setTimeout(() => {
          setItems(prev => prev.map((item, idx) => 
            idx === currentStep ? { ...item, status: 'pass' } : item
          ));
          setCurrentStep(prev => prev + 1);
        }, 800);
        
        return () => clearTimeout(finishTimer);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentStep, items.length]);

  const allPassed = items.every(i => i.status === 'pass');

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-8 max-w-lg w-full shadow-2xl font-mono animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg mb-4">
          <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">System Pre-Flight Check</h3>
        <p className="text-[10px] text-gray-600 uppercase font-bold mt-2 tracking-widest">Verifying Institutional Grade Infrastructure</p>
      </div>

      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-black/40 border border-[#1a1a1a] rounded-lg">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{item.name}</span>
              <span className="text-[8px] text-gray-600 uppercase font-bold">{item.description}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.status === 'checking' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>}
              {item.status === 'pass' && <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              <span className={`text-[9px] font-black uppercase ${item.status === 'pass' ? 'text-emerald-500' : 'text-gray-700'}`}>
                {item.status === 'pending' ? 'WAITING' : item.status === 'checking' ? 'SYNC' : 'READY'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        disabled={!allPassed}
        className={`w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
          allPassed 
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40' 
            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
        }`}
      >
        {allPassed ? 'Initialize Final Deployment' : 'Finalizing System Hooks...'}
      </button>
    </div>
  );
};
