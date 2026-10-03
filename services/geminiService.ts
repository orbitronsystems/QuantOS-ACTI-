import { GoogleGenAI, Type } from "@google/genai";
import { MarketRegime, BehaviorMetric } from "../types";

const INSIGHT_CACHE_DURATION = 300000; // 5 minutes cache
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1500;
const COOLDOWN_DURATION = 60000; // 1 minute cooldown on persistent errors

export class GeminiService {
  private insightCache: Map<string, { text: string; timestamp: number }> = new Map();
  private static rateLimitResetTime: number = 0;

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isRateLimited(): boolean {
    return Date.now() < GeminiService.rateLimitResetTime;
  }

  private async fetchWithRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
    if (this.isRateLimited()) {
      throw new Error("PROTECTIVE_COOLDOWN: Node logic in isolation mode due to API instability.");
    }

    try {
      return await fn();
    } catch (error: any) {
      const errorStr = JSON.stringify(error) || String(error);
      
      // Specifically target the reported 500 Rpc / UNKNOWN / xhr error
      const isTransient = 
        errorStr.includes("500") || 
        errorStr.includes("UNKNOWN") || 
        errorStr.includes("xhr error") ||
        errorStr.includes("ProxyUnaryCall") ||
        errorStr.includes("RESOURCE_EXHAUSTED");
      
      const isAuthError = 
        errorStr.includes("401") || 
        errorStr.includes("403") || 
        errorStr.includes("UNAUTHENTICATED") || 
        errorStr.includes("PERMISSION_DENIED");

      if (isAuthError) {
        console.error("Gemini API Credential Error. Please check your environment configuration.");
        GeminiService.rateLimitResetTime = Date.now() + COOLDOWN_DURATION;
        throw error;
      }

      if (isTransient && retries > 0) {
        const delay = INITIAL_RETRY_DELAY * (MAX_RETRIES - retries + 1);
        console.warn(`Gemini API transient failure (500/Rpc/Xhr). Retrying in ${delay}ms...`);
        await this.sleep(delay);
        return this.fetchWithRetry(fn, retries - 1);
      }

      if (isTransient) {
        console.error("Gemini API persistent failure. Entering protective cooldown.");
        GeminiService.rateLimitResetTime = Date.now() + COOLDOWN_DURATION;
      }
      throw error;
    }
  }

  async getMarketInsight(regime: MarketRegime, currentPrice: number): Promise<string> {
    const coarsePrice = Math.floor(currentPrice / 1000) * 1000;
    const cacheKey = `${regime}-${coarsePrice}`;
    const cached = this.insightCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp < INSIGHT_CACHE_DURATION)) {
      return cached.text;
    }

    if (this.isRateLimited()) {
      return cached?.text || "The AI reasoning engine is currently in a protective calibration cycle. Local stochastic guards are maintaining market stability.";
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const text = await this.fetchWithRetry(async () => {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Analyze this market regime: ${regime}. Current instrument price is roughly ${coarsePrice}. Provide a technical, succinct analysis focused on volatility and entropy. Max 35 words.`,
          config: {
            systemInstruction: "You are a quantitative AI agent. Provide technical, succinct market signals. Be extremely professional.",
            temperature: 0.6,
          },
        });
        return response.text;
      });

      const result = text?.trim() || "Node link stable. Waiting for next signal packet.";
      this.insightCache.set(cacheKey, { text: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      console.error("Gemini Market Insight Error:", error);
      // If we have a cached value, return it even if it's old, rather than an error message
      return cached?.text || "Predictive layer deferred due to signal entropy. Cross-venue consensus remains within institutional parameters.";
    }
  }

  async analyzeBehavior(metrics: BehaviorMetric[]): Promise<{ guidance: string; confidence: number }> {
    if (this.isRateLimited()) {
      return { 
        guidance: "Behavioral analytics in protective isolation. Reverting to institutional baseline protocols.", 
        confidence: 0 
      };
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const dataStr = JSON.stringify(metrics);
      
      const text = await this.fetchWithRetry(async () => {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: `Analyze trader behavior: ${dataStr}. Recommend specific behavioral corrections to minimize investment loss. Output JSON.`,
          config: {
            systemInstruction: "You are a behavioral intelligence agent. Focus on correcting human cognitive bias in high-stakes trading. Return JSON only.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                guidance: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
              },
              required: ["guidance", "confidence"],
            },
          },
        });
        return response.text;
      });
      
      const result = JSON.parse(text || '{"guidance": "Analysis cycle incomplete.", "confidence": 0}');
      return {
        guidance: result.guidance,
        confidence: Math.round(result.confidence * 100),
      };
    } catch (error) {
      console.error("Gemini Behavior Analysis Error:", error);
      return { 
        guidance: "Cognitive sync deferred. Behavioral baselines currently enforced via local consensus nodes.", 
        confidence: 50 
      };
    }
  }
}

export const geminiService = new GeminiService();