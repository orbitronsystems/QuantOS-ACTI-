
import React, { useState, useEffect } from 'react';

const ASSETS = [
  { symbol: 'BTC/USD', price: '64,124.20', change: '+2.41%', up: true },
  { symbol: 'ETH/USD', price: '3,452.12', change: '-0.12%', up: false },
  { symbol: 'SOL/USD', price: '142.04', change: '+8.45%', up: true },
  { symbol: 'EUR/USD', price: '1.0842', change: '+0.02%', up: true },
  { symbol: 'GBP/USD', price: '1.2641', change: '-0.15%', up: false },
  { symbol: 'SPX 500', price: '5,241.20', change: '+0.42%', up: true },
  { symbol: 'GOLD', price: '2,341.20', change: '+1.02%', up: true },
  { symbol: 'NVDA', price: '921.40', change: '+4.12%', up: true },
  { symbol: 'AAPL', price: '172.45', change: '-0.82%', up: false },
];

export const TerminalTicker: React.FC = () => {
  const [data, setData] = useState(ASSETS);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(a => ({
        ...a,
        price: (parseFloat(a.price.replace(',', '')) + (Math.random() - 0.5) * 5).toLocaleString(undefined, { minimumFractionDigits: 2 }),
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 bg-[#050505] border-b border-[#1a1a1a] flex items-center overflow-hidden whitespace-nowrap z-20">
      <div className="flex items-center gap-2 px-4 border-r border-[#1a1a1a] h-full shrink-0">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Global Aggregate</span>
      </div>
      
      <div className="flex items-center gap-8 animate-[ticker_60s_linear_infinite] px-4">
        {[...data, ...data].map((asset, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase">{asset.symbol}</span>
            <span className="text-[10px] font-mono font-bold text-white">{asset.price}</span>
            <span className={`text-[9px] font-bold ${asset.up ? 'text-emerald-500' : 'text-red-500'}`}>
              {asset.change}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
