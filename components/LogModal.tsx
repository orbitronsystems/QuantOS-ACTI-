
import React from 'react';
import { Agent } from '../types';

interface Props {
  agent: Agent | null;
  onClose: () => void;
}

export const LogModal: React.FC<Props> = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#0d0d0d] border border-[#333] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="bg-[#1a1a1a] px-6 py-4 border-b border-[#333] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h3 className="font-mono text-sm font-bold text-gray-200 uppercase tracking-widest">
              Operational Logs: {agent.name}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs space-y-2 bg-black/40 custom-scrollbar">
          {agent.logs.length === 0 ? (
            <div className="text-gray-600 italic">No log entries found for this initialization cycle.</div>
          ) : (
            agent.logs.map((log, idx) => (
              <div key={idx} className="flex gap-4 border-l border-[#222] pl-3">
                <span className="text-gray-600 whitespace-nowrap">[{log.timestamp}]</span>
                <span className={`font-bold whitespace-nowrap w-12 ${
                  log.level === 'ERROR' ? 'text-red-500' :
                  log.level === 'WARN' ? 'text-yellow-500' :
                  log.level === 'DEBUG' ? 'text-blue-500' : 'text-emerald-500'
                }`}>
                  {log.level}
                </span>
                <span className="text-gray-400">{log.message}</span>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-[#111] border-t border-[#333] flex justify-between items-center text-[10px] text-gray-500 uppercase font-bold tracking-widest">
          <span>Agent ID: {agent.id}</span>
          <span>Status: {agent.status}</span>
        </div>
      </div>
    </div>
  );
};
