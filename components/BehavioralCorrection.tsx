import React, { useState } from 'react';
import { BehaviorMetric, EmotionalAssessment } from '../types';
import { Icons } from '../constants';
import { geminiService } from '../services/geminiService';

interface Props {
  metrics: BehaviorMetric[];
  emotionalState: EmotionalAssessment;
}

export const BehavioralCorrection: React.FC<Props> = ({ metrics, emotionalState }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [annotation, setAnnotation] = useState('');
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [hasChallenged, setHasChallenged] = useState(false);

  const getAIGuidance = async () => {
    setLoading(true);
    setHasChallenged(false);
    const result = await geminiService.analyzeBehavior(metrics);
    setInsight(result.guidance);
    setConfidence(result.confidence);
    setLoading(false);
  };

  const handleAnnotate = () => {
    // In a real app, this would send the annotation back to a feedback loop or database
    setHasChallenged(true);
    setIsAnnotating(false);
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#262626] flex flex-col font-mono">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Behavioral Correction</h3>
          <p className="text-[10px] text-gray-600 italic">Self-adapting psychological intelligence layer</p>
        </div>
        <button 
          onClick={getAIGuidance}
          disabled={loading}
          className="bg-[#262626] hover:bg-[#404040] disabled:bg-gray-800 text-blue-400 text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-2 transition-all border border-blue-500/20 shadow-sm"
        >
          <Icons.AI />
          {loading ? 'Analyzing...' : 'Run Diagnostics'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex-1 space-y-2">
          {metrics.map((m, idx) => (
            <div key={idx} className={`p-3 rounded border flex items-center justify-between transition-colors ${m.correctionRequired ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
              <div>
                <span className="text-[11px] font-bold block text-gray-300">{m.category}</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-tighter">{m.recommendation}</span>
              </div>
              <div className="text-right flex items-center gap-2">
                <span className={`text-xs font-mono font-bold ${m.correctionRequired ? 'text-red-400' : 'text-emerald-400'}`}>
                  {m.value}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 p-4 bg-[#0d0d0d] rounded border border-[#262626] flex flex-col min-h-[160px] relative overflow-hidden group/card">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icons.Brain />
              <span className="text-[11px] font-bold text-gray-400 uppercase">AI Output: Guidance_v1</span>
            </div>
            {confidence !== null && (
              <div className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors ${confidence > 80 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5'}`}>
                CONFIDENCE: {confidence}%
              </div>
            )}
          </div>

          {insight ? (
            <>
              <div className="text-[12px] text-gray-400 font-mono leading-relaxed max-h-[100px] overflow-y-auto custom-scrollbar italic mb-4">
                {insight}
              </div>
              
              <div className="mt-auto flex items-center gap-2 border-t border-[#222] pt-3">
                {!isAnnotating && !hasChallenged && (
                  <button 
                    onClick={() => setIsAnnotating(true)}
                    className="text-[9px] text-gray-600 hover:text-blue-400 font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Challenge / Annotate
                  </button>
                )}
                {hasChallenged && (
                  <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Annotation Recorded
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="text-[11px] text-gray-600 italic flex-1 flex flex-col justify-center">
              Await node synchronization for behavioral intelligence serialization...
              <div className="mt-2 text-[10px] text-blue-500 font-bold uppercase">System: {emotionalState.status} (Stability: {emotionalState.score}%)</div>
            </div>
          )}

          {isAnnotating && (
            <div className="absolute inset-0 bg-[#0d0d0d] p-4 flex flex-col z-10 animate-in fade-in duration-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Provide Feedback / Annotation</span>
                <button onClick={() => setIsAnnotating(false)} className="text-gray-500 hover:text-white">&times;</button>
              </div>
              <textarea 
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
                placeholder="Explain why this guidance is incorrect or add context..."
                className="flex-1 bg-black border border-[#222] rounded p-2 text-[10px] text-gray-300 focus:outline-none focus:border-blue-500/50 font-mono resize-none mb-3"
              />
              <button 
                onClick={handleAnnotate}
                className="w-full py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-[9px] font-black uppercase rounded border border-blue-500/30 transition-all"
              >
                Submit for Model Correction
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-[#262626]">
        <div className="flex items-start gap-2 bg-[#111] p-3 rounded border border-yellow-500/10">
          <div className="mt-0.5 text-yellow-500 opacity-60">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </div>
          <p className="text-[8px] text-gray-600 uppercase font-black leading-relaxed tracking-widest">
            <span className="text-yellow-500/70">Legal Advisory:</span> Behavioral recommendations are advisory and non-binding unless explicitly authorized via institutional protocol. QuantOS agents provide stochastic decision support, not legal or financial mandates.
          </p>
        </div>
      </div>
    </div>
  );
};
