
import React, { useState } from 'react';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

export const AuthSystem: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate authentication lag
    setTimeout(() => {
      const mockUser: User = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        username: username || 'QuantTrader',
        email: `${username || 'trader'}@quantos.ai`,
        tier: 'INSTITUTIONAL',
        sessionToken: 'jwt-mock-token-' + Date.now()
      };
      onLogin(mockUser);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex items-center justify-center p-4">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-8 shadow-2xl relative overflow-hidden font-mono">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] mb-4">Q</div>
          <h2 className="text-xl font-black text-white uppercase tracking-[0.3em]">QuantOS Hub</h2>
          <p className="text-[10px] text-gray-600 uppercase font-bold mt-2 tracking-widest">Adaptive Collective Intelligence</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[9px] text-gray-600 uppercase font-black block mb-2 tracking-widest">Identity Identifier</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="USERNAME"
                className="w-full bg-black border border-[#222] rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="text-[9px] text-gray-600 uppercase font-black block mb-2 tracking-widest">Security Credential</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-[#222] rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${
              loading 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40'
            }`}
          >
            {loading ? 'Initializing Secure Handshake...' : isLogin ? 'Synchronize Identity' : 'Generate New Cluster'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#1a1a1a] flex flex-col items-center gap-4">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] text-gray-500 hover:text-blue-400 font-bold uppercase tracking-widest transition-all"
          >
            {isLogin ? "Need a new node cluster? Create Account" : "Already registered? Login to Node"}
          </button>
          
          <div className="flex items-center gap-2 opacity-30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Encrypted via AES-256 Quantum Shield</span>
          </div>
        </div>
      </div>
    </div>
  );
};
