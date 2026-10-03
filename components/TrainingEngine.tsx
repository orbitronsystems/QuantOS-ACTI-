import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrainingData {
  time: string;
  gradient: number;
  penalty: number;
}

export const TrainingEngine: React.FC = () => {
  const [data, setData] = useState<TrainingData[]>([]);
  const [currentEpoch, setCurrentEpoch] = useState(1420);

  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: i.toString(),
      gradient: Math.random() * 0.5 + 0.5,
      penalty: Math.random() * 0.2
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const next = {
          time: (parseInt(last.time) + 1).toString(),
          gradient: Math.max(0.1, last.gradient + (Math.random() - 0.5) * 0.1),
          penalty: Math.max(0, last.penalty + (Math.random() - 0.5) * 0.05)
        };
        return [...prev.slice(1), next];
      });
      setCurrentEpoch(e => e + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0d0d0d] p-6 rounded-xl border border-[#1a1a1a] h-full flex flex-col overflow-hidden shadow-xl font-mono">
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Self-Training Loop</h3>
          <p className="text-[9px] text-gray-600 uppercase font-bold mt-1 tracking-widest">Sharpe-Drawdown Optimization</p>
        </div>
        <div className="text-right">
          <span className="text-[8px] text-blue-500 font-black uppercase block tracking-widest">Cycle State</span>
          <span className="text-[12px] font-mono font-bold text-white uppercase tracking-tighter">EP_{currentEpoch.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex-1 min-h-[140px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px', borderRadius: '4px' }}
              itemStyle={{ padding: '2px 0' }}
            />
            <Line 
              type="monotone" 
              dataKey="gradient" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false} 
            />
            <Line 
              type="monotone" 
              dataKey="penalty" 
              stroke="#ef4444" 
              strokeWidth={1.5} 
              dot={false} 
              isAnimationActive={false}
              strokeDasharray="4 4" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 shrink-0">
        <div className="p-3 bg-blue-600/5 border border-blue-500/20 rounded-lg group hover:border-blue-500 transition-all">
          <span className="text-[8px] text-gray-600 uppercase block font-black mb-1 tracking-widest">Sharpe Δ</span>
          <span className="text-[12px] font-mono font-bold text-blue-400">+{data[data.length-1]?.gradient.toFixed(4) || '0.0000'}</span>
        </div>
        <div className="p-3 bg-red-600/5 border border-red-500/20 rounded-lg group hover:border-red-500 transition-all">
          <span className="text-[8px] text-gray-600 uppercase block font-black mb-1 tracking-widest">DD Penalty</span>
          <span className="text-[12px] font-mono font-bold text-red-400">-{data[data.length-1]?.penalty.toFixed(4) || '0.0000'}</span>
        </div>
      </div>
    </div>
  );
};